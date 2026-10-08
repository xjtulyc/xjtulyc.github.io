#!/usr/bin/env python3
"""Dense versus blockwise online attention: a standard-library teaching check.

Run: python3 streaming_softmax_checks.py

The same finite Q, K, V, scale, and Boolean mask feed both implementations.
The recurrence is equivalent over exact real arithmetic; Python binary64 is
compared with explicit tolerances, not bitwise equality. Key blocks must cover
every key exactly once. Empty blocks and arbitrary block/key order are allowed.

For this script only, a row with no permitted key returns a zero value vector.
This is an explicit convention, not a claim about all attention frameworks.
The dense reference and test masks intentionally materialize small matrices.
The online path does not materialize the full score/probability matrix, but
still keeps the supplied Q/K/V, mask, and optional diagnostic trace in memory.
This is not a GPU kernel, a FlashAttention implementation, a speed benchmark,
or a test of neural-model quality, autograd, low-precision storage, or hardware IO.
"""

import hashlib
import itertools
import json
import math
from pathlib import Path
import platform
import random
import sys


SEED = 20261008
ATOL = 2e-12
RTOL = 2e-12


def require(condition, message):
    """Checks remain active even if Python is invoked with -O."""
    if not condition:
        raise AssertionError(message)


def make_mask(nq, nk, *, causal=False, query_start=0, key_start=0,
              query_valid=None, key_valid=None):
    """Causal rule: absolute key position <= absolute query position.

    For queries that are the final nq tokens of nk keys (nk >= nq), use
    query_start=nk-nq, key_start=0. This is bottom-right causal alignment.
    Explicit offsets also describe a short key suffix against longer queries.
    """
    qv = [True] * nq if query_valid is None else list(query_valid)
    kv = [True] * nk if key_valid is None else list(key_valid)
    require(len(qv) == nq and len(kv) == nk, "Validity dimensions mismatch")
    return [[bool(qv[i] and kv[j] and
                  (not causal or key_start + j <= query_start + i))
             for j in range(nk)] for i in range(nq)]


def validate(Q, K, V, scale, mask, value_dim):
    require(bool(Q), "This teaching interface requires at least one query")
    dk = len(Q[0])
    require(dk > 0, "Key dimension must be positive")
    require(len(K) == len(V), "K/V token counts differ")
    dv = len(V[0]) if V else value_dim
    require(isinstance(dv, int) and dv > 0,
            "An empty K/V axis requires a positive value_dim")
    require(value_dim is None or value_dim == dv, "value_dim mismatch")
    for label, matrix, width in (("Q", Q, dk), ("K", K, dk), ("V", V, dv)):
        require(all(len(row) == width for row in matrix), label + " is ragged")
        require(all(math.isfinite(x) for row in matrix for x in row),
                label + " must contain finite values")
    require(math.isfinite(scale), "Scale must be finite")
    require(len(mask) == len(Q) and all(len(row) == len(K) for row in mask),
            "Mask dimensions mismatch")
    return dv


def score(q, k, scale):
    result = scale * math.fsum(x * y for x, y in zip(q, k))
    require(math.isfinite(result), "Scaled logit overflow; outside test scope")
    return result


def dense_attention(Q, K, V, scale, mask, *, value_dim=None):
    """Stable dense reference, using a full small score matrix."""
    dv = validate(Q, K, V, scale, mask, value_dim)
    scores = [[score(q, k, scale) for k in K] for q in Q]
    outputs, states = [], []
    for i, row in enumerate(scores):
        permitted = [j for j in range(len(K)) if mask[i][j]]
        if not permitted:
            outputs.append([0.0] * dv)
            states.append((-math.inf, 0.0, [0.0] * dv))
            continue
        m = max(row[j] for j in permitted)
        weights = {j: math.exp(row[j] - m) for j in permitted}
        ell = math.fsum(weights.values())
        u = [math.fsum(weights[j] * V[j][a] for j in permitted)
             for a in range(dv)]
        outputs.append([x / ell for x in u])
        states.append((m, ell, u))
    return outputs, states


def online_attention(Q, K, V, scale, mask, key_blocks, *, value_dim=None,
                     keep_trace=False, wrong_no_u_rescale=False):
    """Accumulate unnormalized (m, ell, u) for each query row.

    wrong_no_u_rescale enables an intentionally incorrect negative control.
    It is never used for the passing implementation comparisons.
    """
    dv = validate(Q, K, V, scale, mask, value_dim)
    flat = [j for block in key_blocks for j in block]
    require(sorted(flat) == list(range(len(K))),
            "Blocks must partition keys exactly once, without omissions")
    states, outputs, traces = [], [], []
    for i, q in enumerate(Q):
        m, ell, u = -math.inf, 0.0, [0.0] * dv
        row_trace = []
        for block in key_blocks:
            items = [(j, score(q, K[j], scale)) for j in block if mask[i][j]]
            if items:
                new_m = max(m, max(s for _, s in items))
                old_scale = math.exp(m - new_m) if ell else 0.0
                weights = [(j, math.exp(s - new_m)) for j, s in items]
                new_ell = old_scale * ell + math.fsum(w for _, w in weights)
                old_u_scale = 1.0 if wrong_no_u_rescale else old_scale
                new_u = [old_u_scale * u[a] +
                         math.fsum(w * V[j][a] for j, w in weights)
                         for a in range(dv)]
                m, ell, u = new_m, new_ell, new_u
            # Empty/all-masked blocks leave state unchanged; never form -inf--inf.
            if keep_trace:
                row_trace.append((m, ell, list(u)))
        states.append((m, ell, u))
        outputs.append([x / ell for x in u] if ell else [0.0] * dv)
        traces.append(row_trace)
    return outputs, states, traces


def wrong_sum_block_softmax(Q, K, V, scale, mask, blocks):
    """Incorrect: normalize each block independently, then add outputs."""
    dv = len(V[0])
    outputs = []
    for i, q in enumerate(Q):
        out = [0.0] * dv
        for block in blocks:
            permitted = [j for j in block if mask[i][j]]
            if not permitted:
                continue
            s = {j: score(q, K[j], scale) for j in permitted}
            m = max(s.values())
            weights = {j: math.exp(s[j] - m) for j in permitted}
            ell = math.fsum(weights.values())
            for a in range(dv):
                out[a] += math.fsum(weights[j] * V[j][a] for j in permitted) / ell
        outputs.append(out)
    return outputs


def compare(actual, expected, label):
    require(len(actual) == len(expected), label + ": row count")
    max_abs = max_scaled = 0.0
    for row_a, row_e in zip(actual, expected):
        require(len(row_a) == len(row_e), label + ": column count")
        for a, e in zip(row_a, row_e):
            require(math.isfinite(a) and math.isfinite(e), label + ": non-finite")
            error = abs(a - e)
            allowance = ATOL + RTOL * max(abs(a), abs(e))
            require(error <= allowance, label + ": outside tolerance")
            max_abs = max(max_abs, error)
            max_scaled = max(max_scaled, error / allowance)
    return max_abs, max_scaled


def check_states(actual, expected, label):
    for (m, ell, u), (ref_m, ref_ell, ref_u) in zip(actual, expected):
        require(m == ref_m, label + ": running maximum")
        compare([[ell] + u], [[ref_ell] + ref_u], label + ": denominator/numerator")


def chunks(order, lengths):
    result, start = [], 0
    for length in lengths:
        result.append(order[start:start + length])
        start += length
    require(start == len(order), "Partition lengths mismatch")
    return result


def run_checks():
    require(sys.float_info.mant_dig == 53 and sys.float_info.max_exp == 1024,
            "This report assumes Python IEEE-754 binary64 floats")
    rng = random.Random(SEED)
    rows = lambda n, d: [[rng.uniform(-2.0, 2.0) for _ in range(d)] for _ in range(n)]
    records = []
    max_abs = max_scaled = 0.0
    comparisons = 0

    def check_case(name, Q, K, V, mask, plans, *, scale=None, value_dim=None):
        nonlocal max_abs, max_scaled, comparisons
        if scale is None:
            scale = 1.0 / math.sqrt(len(Q[0]))
        expected, ref_states = dense_attention(Q, K, V, scale, mask,
                                               value_dim=value_dim)
        case_abs = case_scaled = 0.0
        for plan in plans:
            actual, states, _ = online_attention(Q, K, V, scale, mask, plan,
                                                 value_dim=value_dim)
            error, scaled = compare(actual, expected, name)
            check_states(states, ref_states, name)
            case_abs, case_scaled = max(case_abs, error), max(case_scaled, scaled)
            comparisons += 1
        max_abs, max_scaled = max(max_abs, case_abs), max(max_scaled, case_scaled)
        records.append({"name": name, "queries": len(Q), "keys": len(K),
                        "key_dim": len(Q[0]),
                        "value_dim": len(V[0]) if V else value_dim, "scale": scale,
                        "block_plans": plans, "allowed_keys_per_query":
                        [sum(row) for row in mask], "max_abs_error": case_abs,
                        "max_error_fraction_of_tolerance": case_scaled,
                        "passes": True, "comparison_count": len(plans)})
        return expected

    Q, K, V = rows(5, 4), rows(9, 4), rows(9, 3)
    base = chunks(list(range(9)), [0, 1, 3, 0, 2, 3, 0])
    reordered = [base[i] for i in [4, 0, 6, 2, 5, 1, 3]]
    check_case("noncausal_irregular_and_permuted", Q, K, V, make_mask(5, 9),
               [base, list(reversed(base)), reordered])

    Q, K, V = rows(7, 5), rows(7, 5), rows(7, 2)
    base = chunks(list(range(7)), [2, 0, 1, 4])
    check_case("square_global_causal", Q, K, V, make_mask(7, 7, causal=True),
               [base, list(reversed(base))])

    # Zero scores provide independently known means, not just two implementations.
    mask = make_mask(2, 6, causal=True, query_start=4, key_start=0)
    require([sum(x) for x in mask] == [5, 6], "Bottom-right mask offsets")
    out = check_case("rectangular_bottom_right", [[0.0], [0.0]], [[0.0]] * 6,
                     [[float(j)] for j in range(6)], mask,
                     [[[0], [1, 2, 3], [], [4, 5]], [[5, 4], [3, 2], [1, 0]]])
    compare(out, [[2.0], [2.5]], "Independent bottom-right uniform means")
    # Longer query axis: positive key offset leaves initial query rows fully masked.
    mask = make_mask(5, 2, causal=True, query_start=0, key_start=3)
    out = check_case("rectangular_empty_prefix_rows", [[0.0]] * 5, [[0.0]] * 2,
                     [[10.0], [20.0]], mask, [[[1], [], [0]]])
    compare(out, [[0.0], [0.0], [0.0], [10.0], [15.0]],
            "Independent long-query bottom-right means")

    Q, K, V = rows(4, 3), rows(7, 3), rows(7, 4)
    mask = make_mask(4, 7, query_valid=[True, True, False, True],
                     key_valid=[True, False, True, False, False, True, False])
    base = [[0], [1, 3, 4], [], [2], [5, 6]]
    check_case("padding_middle_masked_and_empty_blocks", Q, K, V, mask,
               [base, list(reversed(base))])
    _, _, trace = online_attention(Q, K, V, 1.0 / math.sqrt(3), mask, base,
                                   keep_trace=True)
    require(all(t[0] == t[1] == t[2] for t in trace),
            "Fully masked and empty middle blocks must preserve all state")

    out = check_case("all_masked_zero_convention", rows(2, 3), rows(4, 3),
                     rows(4, 2), [[False] * 4 for _ in range(2)],
                     [[[], [0, 1], [], [2, 3]], [[3], [2, 1, 0], []]])
    require(out == [[0.0, 0.0], [0.0, 0.0]], "All-masked zero convention")
    out = check_case("empty_key_axis_zero_convention", rows(2, 3), [], [],
                     [[], []], [[[], []]], value_dim=2)
    require(out == [[0.0, 0.0], [0.0, 0.0]], "Empty key-axis zero convention")

    shifts, shift_outputs = [-10000.0, 0.0, 10000.0], []
    relative = [-2.0, -0.5, 0.0, 1.25, 3.0]
    V = [[-1.0, 3.0], [0.5, -2.0], [2.0, 1.0], [-3.0, 0.0], [1.0, 4.0]]
    for shift in shifts:
        shift_outputs.append(check_case(
            "common_logit_shift_" + str(int(shift)), [[1.0]],
            [[shift + x] for x in relative], V, make_mask(1, 5),
            [[[0, 1], [], [2], [3, 4]], [[4, 3], [2], [1, 0]]], scale=1.0))
    for out in shift_outputs:
        compare(out, shift_outputs[1], "Common finite logit shift invariance")
    check_case("wide_logit_span_running_max_jumps", [[1.0]],
               [[-1000.0], [-500.0], [0.0], [500.0], [1000.0]],
               [[-2.0], [1.0], [4.0], [-3.0], [2.0]], make_mask(1, 5),
               [[[i] for i in range(5)], [[i] for i in reversed(range(5))]],
               scale=1.0)

    Q, K, V = rows(3, 4), rows(6, 4), rows(6, 3)
    base = [[0, 1], [2], [3, 4, 5]]
    check_case("all_six_block_orders", Q, K, V, make_mask(3, 6),
               [list(plan) for plan in itertools.permutations(base)])
    for case in range(16):
        nq, nk, dk, dv = (rng.randint(1, 7), rng.randint(1, 11),
                          rng.randint(1, 6), rng.randint(1, 5))
        Q, K, V = rows(nq, dk), rows(nk, dk), rows(nk, dv)
        mask = [[rng.random() > 0.3 for _ in range(nk)] for _ in range(nq)]
        order = list(range(nk))
        rng.shuffle(order)
        split = rng.randint(0, nk)
        base = [[], order[:split], [], order[split:], []]
        check_case("seeded_case_%02d" % case, Q, K, V, mask,
                   [base, list(reversed(base))])

    mask, blocks = make_mask(1, 2), [[0], [1]]
    Q, K, V = [[1.0]], [[0.0], [math.log(3.0)]], [[0.0], [1.0]]
    correct, _ = dense_attention(Q, K, V, 1.0, mask)
    wrong = wrong_sum_block_softmax(Q, K, V, 1.0, mask, blocks)
    compare(correct, [[0.75]], "Analytical two-key weighted mean")
    require(wrong == [[1.0]] and abs(wrong[0][0] - correct[0][0]) > 0.24,
            "Local-softmax summation negative control did not fail")
    wrong_average = wrong[0][0] / len(blocks)
    require(abs(wrong_average - correct[0][0]) > 0.24,
            "Averaging block outputs must also fail in this unequal-mass case")
    local_negative = {"logits": [0.0, math.log(3.0)], "values": [0.0, 1.0],
                      "correct": correct[0][0], "wrong": wrong[0][0],
                      "wrong_average": wrong_average,
                      "absolute_difference": abs(wrong[0][0] - correct[0][0])}
    Q, K, V = [[1.0]], [[0.0], [math.log(3.0)]], [[1.0], [0.0]]
    correct, _ = dense_attention(Q, K, V, 1.0, mask)
    wrong, _, _ = online_attention(Q, K, V, 1.0, mask, blocks,
                                   wrong_no_u_rescale=True)
    compare(correct, [[0.25]], "Analytical two-key rescaling example")
    compare(wrong, [[0.75]], "Analytical incorrect numerator example")
    require(abs(wrong[0][0] - correct[0][0]) > 0.49,
            "Missing-u-rescale negative control did not fail")
    rescale_negative = {"logits": [0.0, math.log(3.0)], "values": [1.0, 0.0],
                        "correct": correct[0][0], "wrong": wrong[0][0],
                        "absolute_difference": abs(wrong[0][0] - correct[0][0])}

    # Detect invalid partition inputs rather than silently double-counting keys.
    invalid_plans = [[[0], [0, 1]], [[0]], [[0, 2]], [[-1, 0]]]
    for plan in invalid_plans:
        try:
            online_attention(Q, K, V, 1.0, mask, plan)
        except AssertionError:
            pass
        else:
            raise AssertionError("Invalid key partition was accepted")

    return {"status": "passed", "seed": SEED,
            "tolerances": {"atol": ATOL, "rtol": RTOL,
                          "rule": "abs(a-b) <= atol + rtol * max(abs(a),abs(b))"},
            "case_count": len(records), "dense_online_comparisons": comparisons,
            "max_abs_error": max_abs,
            "max_error_fraction_of_tolerance": max_scaled,
            "cases": records,
            "counterexamples": {"block_local_sum": local_negative,
                                "missing_u_rescale": rescale_negative},
            "invalid_partitions_rejected": len(invalid_plans),
            "independent_checks": ["Known rectangular uniform-attention means",
                                   "All-masked and zero-key outputs are exactly zero",
                                   "Empty/masked blocks preserve all state",
                                   "Finite common-logit-shift invariance",
                                   "Two analytical negative-control outputs"],
            "environment": {"python": platform.python_version(),
                          "implementation": platform.python_implementation(),
                          "system": platform.system(), "machine": platform.machine(),
                          "float_mantissa_bits": sys.float_info.mant_dig,
                          "code_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest()},
            "limits": ["Synthetic CPU binary64 arithmetic only; not bitwise equivalence",
                       "Finite scaled logits only; overflow at dot/scale is rejected",
                       "Extreme finite differences can legitimately underflow exp to zero",
                       "Masks and optional traces are materialized for small educational checks",
                       "Zero-output all-masked convention is local to this script",
                       "No model weights, autograd, GPU kernel, IO measurement or timing benchmark"]}


if __name__ == "__main__":
    print(json.dumps(run_checks(), indent=2, allow_nan=False))
