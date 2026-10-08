#!/usr/bin/env python3
"""Exact enumeration of one-token Bernoulli group-gradient estimators.

Run with Python 3.9+; prints JSON. No random sampling or learned model is used.
For p=sigmoid(z), a~Bernoulli(p), reward=a, the logit score is a-p.
Every group estimator is the mean of A_i*(a_i-p), with sampled advantages
treated as fixed (stop-gradient). This is an on-policy, unclipped toy without
KL, sequence-length effects, repeated optimizer steps, or importance weights.

Rational probabilities and raw/centered/leave-one-out quantities use Fraction.
Square roots and normalized estimators use float. Resampling calculations
assume independent complete groups at a fixed prompt/policy, with no cap.
"""

import hashlib
import itertools
import json
import math
import platform
import sys
from fractions import Fraction
from pathlib import Path


def close(actual, expected, atol=2e-14, rtol=2e-12):
    assert math.isclose(actual, expected, abs_tol=atol, rel_tol=rtol), (actual, expected)


def exact_value(value):
    return {"fraction": str(value), "float": float(value)}


def count_estimators(group_size, successes, p, delta=0.0):
    """Closed forms at a fixed count k, not population expectations."""
    assert group_size > 1 and 0 <= successes <= group_size and delta >= 0
    f = Fraction(successes, group_size)
    variance = f * (1 - f)  # population variance over this sampled group
    raw = f * (1 - p)
    centered = variance
    loo = Fraction(group_size, group_size - 1) * variance
    # Constant groups explicitly have zero advantage, including delta=0.
    pop = float(variance) / (math.sqrt(float(variance)) + delta) if variance else 0.0
    sample_variance = Fraction(group_size, group_size - 1) * variance
    ddof1 = float(variance) / math.sqrt(float(sample_variance)) if variance else 0.0
    return {"raw": raw, "centered": centered, "loo": loo,
            "std_population": pop, "std_ddof1_delta0": ddof1}


def sequence_estimators(actions, p, delta=0.0):
    """Independent per-action construction for checking the count reduction."""
    g = len(actions)
    mean = Fraction(sum(actions), g)
    centered_rewards = [Fraction(a) - mean for a in actions]
    variance = sum((x * x for x in centered_rewards), Fraction(0)) / g
    sample_variance = sum((x * x for x in centered_rewards), Fraction(0)) / (g - 1)
    raw = sum((Fraction(a) * (a - p) for a in actions), Fraction(0)) / g
    centered = sum((b * (a - p) for a, b in zip(actions, centered_rewards)), Fraction(0)) / g
    loo = sum(((Fraction(a) - Fraction(sum(actions) - a, g - 1)) * (a - p)
               for a in actions), Fraction(0)) / g
    if variance:
        pop_advantages = [float(b) / (math.sqrt(float(variance)) + delta) for b in centered_rewards]
        sample_advantages = [float(b) / math.sqrt(float(sample_variance)) for b in centered_rewards]
        pop = math.fsum(a * float(b - p) for a, b in zip(pop_advantages, actions)) / g
        ddof1 = math.fsum(a * float(b - p) for a, b in zip(sample_advantages, actions)) / g
    else:
        pop = ddof1 = 0.0
    return {"raw": raw, "centered": centered, "loo": loo,
            "std_population": pop, "std_ddof1_delta0": ddof1}


def enumerate_counts(group_size, p, delta=0.0):
    exact = {key: Fraction(0) for key in ("raw", "centered", "loo")}
    floats = {key: [] for key in ("std_population", "std_ddof1_delta0")}
    mixed_raw = Fraction(0)
    probabilities = []
    mixed_prob = Fraction(0)
    normalized_formula = []
    for k in range(group_size + 1):
        probability = math.comb(group_size, k) * p**k * (1 - p)**(group_size-k)
        probabilities.append(probability)
        values = count_estimators(group_size, k, p, delta)
        for key in exact:
            exact[key] += probability * values[key]
        for key in floats:
            floats[key].append(float(probability) * values[key])
        if 0 < k < group_size:
            mixed_prob += probability
            mixed_raw += probability * values["raw"]
            v = Fraction(k, group_size) * (1 - Fraction(k, group_size))
            term = math.sqrt(float(v)) if delta == 0 else float(v) / (math.sqrt(float(v)) + delta)
            normalized_formula.append(float(probability) * term)
    assert sum(probabilities) == 1
    true_gradient = p * (1 - p)
    assert exact["raw"] == true_gradient
    assert exact["centered"] == Fraction(group_size - 1, group_size) * true_gradient
    assert exact["loo"] == true_gradient
    alpha = 1 - p**group_size - (1 - p)**group_size
    assert mixed_prob == alpha
    assert mixed_raw == true_gradient - p**group_size * (1 - p)
    means = dict(exact, **{key: math.fsum(terms) for key, terms in floats.items()})
    close(means["std_population"], math.fsum(normalized_formula))
    if delta == 0:
        close(means["std_ddof1_delta0"], math.sqrt((group_size - 1) / group_size) * means["std_population"])
    if alpha:
        expected_groups = 1 / alpha
        expected_responses = group_size / alpha
        # First-step recurrences for geometric retry cost, checked exactly.
        assert expected_groups == 1 + (1 - alpha) * expected_groups
        assert expected_responses == group_size + (1 - alpha) * expected_responses
        conditional = {key: means[key] / alpha for key in ("centered", "loo")}
        conditional["std_population"] = means["std_population"] / float(alpha)
        conditional["raw"] = mixed_raw / alpha
        # Raw REINFORCE need not vanish on an all-one group. This guards
        # against incorrectly applying unconditional_mean/alpha to raw.
        if 0 < p < 1:
            assert conditional["raw"] != means["raw"] / alpha
        close(conditional["std_population"] * float(alpha), means["std_population"])
    else:
        expected_groups = expected_responses = conditional = None
    return {"means": means, "true_gradient": true_gradient, "alpha": alpha,
            "conditional": conditional, "expected_groups": expected_groups,
            "expected_responses": expected_responses}


def crosscheck_sequences():
    cases = sequences = 0
    probabilities = [Fraction(0), Fraction(1, 100), Fraction(1, 10), Fraction(1, 2), Fraction(9, 10), Fraction(99, 100), Fraction(1)]
    for g in (2, 3, 4, 5):
        for p in probabilities:
            for delta in (0.0, 0.01, 0.1):
                by_count = enumerate_counts(g, p, delta)
                exact = {key: Fraction(0) for key in ("raw", "centered", "loo")}
                floats = {key: [] for key in ("std_population", "std_ddof1_delta0")}
                kept = {key: [] for key in ("raw", "centered", "loo", "std_population")}
                alpha = Fraction(0)
                for actions in itertools.product((0, 1), repeat=g):
                    k = sum(actions)
                    probability = p**k * (1 - p)**(g-k)
                    direct = sequence_estimators(actions, p, delta)
                    count = count_estimators(g, k, p, delta)
                    for key in exact:
                        assert direct[key] == count[key]
                        exact[key] += probability * direct[key]
                    for key in floats:
                        close(direct[key], count[key])
                        floats[key].append(float(probability) * direct[key])
                    if 0 < k < g:
                        alpha += probability
                        for key in kept:
                            kept[key].append(float(probability) * float(direct[key]))
                    sequences += 1
                for key in exact:
                    assert exact[key] == by_count["means"][key]
                for key in floats:
                    close(math.fsum(floats[key]), by_count["means"][key])
                assert alpha == by_count["alpha"]
                if alpha:
                    for key in kept:
                        close(math.fsum(kept[key]) / float(alpha), float(by_count["conditional"][key]))
                cases += 1
    return {"group_sizes": [2, 3, 4, 5], "probabilities": [str(p) for p in probabilities],
            "deltas_outside_sqrt": [0.0, 0.01, 0.1], "cases": cases, "sequence_cases_enumerated": sequences}


def table():
    rows = []
    for g in (4, 8, 16):
        for p in map(Fraction, (".01", ".1", ".5", ".9", ".99")):
            result = enumerate_counts(g, p)
            mean = result["means"]
            row = {"group_size": g, "p": exact_value(p),
                   "true_logit_gradient": exact_value(result["true_gradient"]),
                   "mean_raw": exact_value(mean["raw"]),
                   "mean_centered": exact_value(mean["centered"]),
                   "mean_leave_one_out": exact_value(mean["loo"]),
                   "mean_std_population_delta0": mean["std_population"],
                   "mean_std_ddof1_delta0": mean["std_ddof1_delta0"],
                   "mixed_group_probability": exact_value(result["alpha"]),
                   "conditional_std_population_delta0": result["conditional"]["std_population"],
                   "conditional_raw": exact_value(result["conditional"]["raw"]),
                   "expected_groups_per_retained_group": exact_value(result["expected_groups"]),
                   "expected_responses_per_retained_group": exact_value(result["expected_responses"]),
                   "mean_std_population_positive_delta": {str(delta): enumerate_counts(g, p, delta)["means"]["std_population"] for delta in (0.01, 0.1)}}
            rows.append(row)
    return rows


def main():
    result = {"status": "PASS",
              "scope": "Exact Bernoulli count/sequence enumeration; normalized quantities use float square roots. No Monte Carlo or model training.",
              "environment": {"python": platform.python_version(), "implementation": platform.python_implementation(),
                              "platform": platform.platform(), "float_mantissa_bits": sys.float_info.mant_dig,
                              "script_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest()},
              "crosscheck": crosscheck_sequences(), "rows": table(),
              "conventions": {"score": "a-p, derivative with respect to logit z",
                              "group_reduction": "mean, not sum", "advantages": "stop-gradient",
                              "boundary_probabilities": "p=0 or 1 tests limiting degenerate distributions, not a finite sigmoid logit",
                              "reward_scale": "reward=a in {0,1}; positive affine reward scales cancel for delta=0, not generally for fixed delta>0",
                              "population_variance": "v=f(1-f), f=k/G",
                              "normalized_mean_at_count": "v/(sqrt(v)+delta), delta outside sqrt",
                              "constant_groups": "normalized and centered advantages zero",
                              "ddof1": "sqrt((G-1)/G) scaling holds for delta=0",
                              "resampling_units": "responses per retained complete group, G/alpha",
                              "no_mixed_groups": "alpha=0: conditioning undefined and expected retry cost infinite; internally represented by None",
                              "raw_conditioning": "[p(1-p)-p^G(1-p)]/alpha; unconditional_raw/alpha is incorrect"},
              "not_tested": ["LLM training", "PPO clipping", "KL gradients", "off-policy/reused rollouts",
                             "variable response lengths", "multi-prompt dynamic batch selection", "GPU/latency/token costs"]}
    print(json.dumps(result, indent=2, ensure_ascii=False, allow_nan=False))


if __name__ == "__main__":
    main()
