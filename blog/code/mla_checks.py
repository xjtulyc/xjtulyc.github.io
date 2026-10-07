#!/usr/bin/env python3
"""Reproducible MLA algebra checks using Python's standard library only.

Run: python3 mla_checks.py

This constructs fixed-seed synthetic, binary64 tensors. It compares explicit
K/V expansion with weight absorption for THE SAME MLA weights. It does not
convert a dense MHA model into MLA, load trained weights, evaluate language
quality, or benchmark GPU kernels. Unit-gain RMSNorm and ordinary paired RoPE
are included identically in both paths; FP8/BF16, YaRN, paging, parallelism,
and production fused kernels are outside this check.

H heads, r latent dimensions, dk content-key dimensions, dv value dimensions,
s positional dimensions: stored elements/token/layer are H*(dk+dv)+s when
expanded keys share their positional branch, versus r+s in the latent cache.
The history-attention MAC counts/query are H*T*(dk+s+dv) versus H*T*(2*r+s).
Those counts exclude projections, softmax, norms, cache writes and scheduling.
Absorption also has per-query key/value projections of H*dk*r and H*dv*r MACs;
their runtime depends on the implementation. No timing claim follows here.
"""

import json
import math
import random

TOL = 1e-10


def dot(a, b):
    assert len(a) == len(b)
    return math.fsum(x * y for x, y in zip(a, b))


def mv(a, x):
    return [dot(row, x) for row in a]


def transpose(a):
    return [list(col) for col in zip(*a)]


def mm(a, b):
    return [[dot(row, col) for col in transpose(b)] for row in a]


def flatten(x):
    for item in x:
        if isinstance(item, (list, tuple)):
            yield from flatten(item)
        else:
            yield item


def error(a, b):
    aa, bb = list(flatten(a)), list(flatten(b))
    assert len(aa) == len(bb)
    diffs = []
    for x, y in zip(aa, bb):
        if not math.isfinite(x) or not math.isfinite(y):
            assert x == y
        else:
            diffs.append(abs(x - y))
    return max(diffs, default=0.0)


def rms(x):
    denominator = math.sqrt(dot(x, x) / len(x) + 1e-6)
    return [value / denominator for value in x]


def rope(x, pos):
    assert len(x) % 2 == 0
    result = []
    for i in range(0, len(x), 2):
        theta = pos / (10000.0 ** (i / len(x)))
        cs, sn = math.cos(theta), math.sin(theta)
        result.extend([cs * x[i] - sn * x[i + 1],
                       sn * x[i] + cs * x[i + 1]])
    return result


def softmax(logits):
    maximum = max(logits)
    assert math.isfinite(maximum), 'Every query must have an eligible key.'
    numerators = [math.exp(x - maximum) for x in logits]
    denominator = math.fsum(numerators)
    return [x / denominator for x in numerators]


def weighted_sum(weights, values):
    return [math.fsum(w * row[k] for w, row in zip(weights, values))
            for k in range(len(values[0]))]


class SyntheticMLA:
    def __init__(self, seed, H, r, dk, dv, s, dmodel, rq):
        self.H, self.r, self.dk, self.dv, self.s = H, r, dk, dv, s
        self.dmodel = dmodel
        rng = random.Random(seed)
        def matrix(rows, cols):
            return [[rng.uniform(-0.7, 0.7) for _ in range(cols)]
                    for _ in range(rows)]
        self.down_kv = matrix(r, dmodel)
        self.down_q = matrix(rq, dmodel)
        self.uk = [matrix(dk, r) for _ in range(H)]
        self.uv = [matrix(dv, r) for _ in range(H)]
        self.uq = [matrix(dk, rq) for _ in range(H)]
        self.qr = [matrix(s, rq) for _ in range(H)]
        self.kr = matrix(s, dmodel)
        self.wo = matrix(dmodel, H * dv)
        # Optional algebraic fusion; the official reference code instead
        # expands each head's weighted latent and then applies its output map.
        self.fused_ov = [mm([row[h*dv:(h+1)*dv] for row in self.wo], self.uv[h])
                         for h in range(H)]
        self.inputs = [[rng.uniform(-1.0, 1.0) for _ in range(dmodel)]
                       for _ in range(7)]

    def encode(self, x, pos):
        c = rms(mv(self.down_kv, x))
        cq = rms(mv(self.down_q, x))
        qc = [mv(u, cq) for u in self.uq]
        return {'pos': pos, 'c': c,
                'kc': [mv(u, c) for u in self.uk],
                'v': [mv(u, c) for u in self.uv],
                'qc': qc,
                'qa': [mv(transpose(u), q) for u, q in zip(self.uk, qc)],
                'qr': [rope(mv(u, cq), pos) for u in self.qr],
                'kr': rope(mv(self.kr, x), pos)}

    def attend(self, query, keys, absorbed, causal=True, wrong_scale=False):
        scale = 1.0 / math.sqrt((self.r if wrong_scale else self.dk) + self.s)
        logits, probabilities, heads, latents = [], [], [], []
        for h in range(self.H):
            row = []
            for key in keys:
                if causal and key['pos'] > query['pos']:
                    row.append(float('-inf'))
                    continue
                content = (dot(query['qa'][h], key['c']) if absorbed
                           else dot(query['qc'][h], key['kc'][h]))
                positional = dot(query['qr'][h], key['kr'])
                row.append((content + positional) * scale)
            weights = softmax(row)
            z = weighted_sum(weights, [key['c'] for key in keys])
            head = (mv(self.uv[h], z) if absorbed else
                    weighted_sum(weights, [key['v'][h] for key in keys]))
            logits.append(row)
            probabilities.append(weights)
            heads.append(head)
            latents.append(z)
        output = mv(self.wo, list(flatten(heads)))
        fused_parts = [mv(a, z) for a, z in zip(self.fused_ov, latents)]
        fused_output = [math.fsum(head[d] for head in fused_parts)
                        for d in range(self.dmodel)]
        return {'logits': logits, 'probabilities': probabilities,
                'heads': heads, 'latents': latents,
                'output': output, 'fused_output': fused_output}


def check_case(seed, dims, offset):
    model = SyntheticMLA(seed, **dims)
    tokens = [model.encode(x, offset+i) for i, x in enumerate(model.inputs)]
    explicit = [model.attend(q, tokens, absorbed=False) for q in tokens]
    absorbed = [model.attend(q, tokens, absorbed=True) for q in tokens]
    maxima = {}
    for field in ('logits', 'probabilities', 'heads', 'output'):
        maxima[field] = max(error(a[field], b[field])
                            for a, b in zip(explicit, absorbed))
        assert maxima[field] < TOL, (seed, dims, field, maxima[field])
    maxima['fused_output'] = max(error(a['output'], a['fused_output']) for a in absorbed)
    assert maxima['fused_output'] < TOL

    # Each head has its own weights and weighted latent, despite a shared cache.
    distinct_weights = error(absorbed[-1]['probabilities'][0], absorbed[-1]['probabilities'][1])
    distinct_latents = error(absorbed[-1]['latents'][0], absorbed[-1]['latents'][1])
    assert distinct_weights > 1e-8 and distinct_latents > 1e-8
    # A shared latent CACHE does not license sharing the weighted aggregate.
    # Deliberately reuse head 0's z for every head, keeping each head's own UV.
    wrong_heads = [mv(u, absorbed[-1]['latents'][0]) for u in model.uv]
    wrong_shared_aggregate = mv(model.wo, list(flatten(wrong_heads)))
    shared_aggregate_difference = error(absorbed[-1]['output'], wrong_shared_aggregate)
    assert shared_aggregate_difference > 1e-8

    masked_entries = 0
    for i, record in enumerate(absorbed):
        for row in record['probabilities']:
            for j in range(i+1, len(tokens)):
                assert row[j] == 0.0
                masked_entries += 1
            assert abs(math.fsum(row) - 1.0) < TOL

    incremental = [model.attend(tokens[i], tokens[:i+1], True)['output']
                   for i in range(len(tokens))]
    chunked, prefix = [], []
    for width in (2, 3, 2):
        start = len(prefix)
        chunk = tokens[start:start+width]
        # All rows can access old prefix plus this chunk; the absolute-position
        # causal mask excludes later rows of the current chunk.
        prefix.extend(chunk)
        chunked.extend(model.attend(q, prefix, True)['output'] for q in chunk)
    reference = [x['output'] for x in explicit]
    maxima['incremental'] = error(reference, incremental)
    maxima['chunked_with_prefix'] = error(reference, chunked)
    assert maxima['incremental'] < TOL and maxima['chunked_with_prefix'] < TOL

    # Alter future input: proper causal masking must protect all earlier rows.
    changed = tokens[:-1] + [model.encode([x+3 for x in model.inputs[-1]], tokens[-1]['pos'])]
    future_change = [model.attend(q, changed, True)['output'] for q in tokens[:-1]]
    maxima['future_input_isolation'] = error(reference[:-1], future_change)
    assert maxima['future_input_isolation'] < TOL
    unmasked_difference = error(absorbed[0]['output'], model.attend(tokens[0], tokens, True, causal=False)['output'])
    assert unmasked_difference > 1e-8
    wrong_scale_difference = max(error(a['probabilities'], model.attend(q, tokens, True, wrong_scale=True)['probabilities'])
                                 for q, a in zip(tokens, absorbed))
    assert wrong_scale_difference > 1e-8
    return {'seed': seed, 'dimensions': dims, 'absolute_position_offset': offset,
            'max_absolute_errors': maxima, 'future_masked_probabilities': masked_entries,
            'negative_controls': {'no_causal_mask_output_difference': unmasked_difference,
                                  'wrong_scale_probability_difference': wrong_scale_difference,
                                  'shared_head_aggregate_output_difference': shared_aggregate_difference},
            'distinct_head_weights_difference': distinct_weights,
            'distinct_head_latents_difference': distinct_latents}


def rope_noncommutation_check():
    # Even equal latent/key dimensions do not make generic U commute with RoPE.
    U, q, c, i, j = [[1.0, 0.0], [0.0, 2.0]], [0.3, -0.7], [0.8, -0.2], 1, 3
    qi = rope(q, i)
    correct = dot(qi, rope(mv(U, c), j))
    incorrect = dot(mv(transpose(U), qi), rope(c, j))
    # An algebraically exact key-position-dependent transformed query exists,
    # but it is different for each j, defeating this simple static absorption.
    query_depending_on_j = mv(transpose(U), rope(qi, -j))
    dependent_correct = dot(query_depending_on_j, c)
    assert abs(correct-dependent_correct) < TOL
    assert abs(correct-incorrect) > 1e-3
    # At j=0 the accidental equality cannot establish a general identity.
    assert abs(dot(qi, mv(U, c))-dot(mv(transpose(U), qi), c)) < TOL
    return {'correct_rotated_expanded_score': correct,
            'incorrect_rotate_latent_score': incorrect,
            'absolute_error': abs(correct-incorrect),
            'key_position_dependent_query_score': dependent_correct}


def exact_quarter_turn_check():
    # Pure integer arithmetic: no trigonometric or floating-point roundoff.
    # This is a matrix-identity counterexample, independent of a causal mask.
    U, R = [[1, 0], [0, 2]], [[0, -1], [1, 0]]
    q, c = [1, 0], [1, 1]
    def integer_mv(matrix, vector):
        return [sum(a*b for a, b in zip(row, vector)) for row in matrix]
    correct = sum(a*b for a, b in zip(q, integer_mv(R, integer_mv(U, c))))
    incorrect = sum(a*b for a, b in zip(q, integer_mv(U, integer_mv(R, c))))
    assert correct == -2 and incorrect == -1 and correct != incorrect
    return {'U': U, 'R_quarter_turn': R, 'q': q, 'c': c,
            'q_transpose_R_U_c': correct, 'q_transpose_U_R_c': incorrect,
            'arithmetic': 'exact integers'}


def main():
    configurations = [dict(H=2, r=5, dk=4, dv=3, s=2, dmodel=7, rq=3),
                      dict(H=3, r=3, dk=6, dv=2, s=4, dmodel=9, rq=4)]
    records = [check_case(seed, dims, offset) for seed in (7, 19, 43)
               for dims in configurations for offset in (0, 11)]
    H, r, dk, dv, s = 128, 512, 128, 128, 64
    expanded_shared = H*(dk+dv)+s
    latent = r+s
    explicit_macs = dk+s+dv
    latent_macs = 2*r+s
    assert expanded_shared == 32832 and latent == 576
    assert expanded_shared == 57*latent
    assert latent_macs*5 == explicit_macs*17  # exactly 3.4 as a rational number
    report = {'status': 'PASS', 'case_count': len(records),
              'tolerance': TOL, 'arithmetic': 'Python float (binary64 on this runtime)',
              'maximum_positive_check_error': max(v for rec in records for v in rec['max_absolute_errors'].values()),
              'naive_rope_absorption_negative_control': rope_noncommutation_check(),
              'exact_quarter_turn_negative_control': exact_quarter_turn_check(),
              'dimension_arithmetic_not_a_benchmark': {
                  'H': H, 'r': r, 'dk': dk, 'dv': dv, 's': s,
                  'expanded_shared_rope_elements_per_token_layer': expanded_shared,
                  'expanded_repeated_rope_elements_per_token_layer': H*(dk+s+dv),
                  'latent_elements_per_token_layer': latent,
                  'shared_rope_expanded_to_latent_elements_ratio': 57,
                  'history_macs_per_head_per_key_explicit': explicit_macs,
                  'history_macs_per_head_per_key_absorbed': latent_macs,
                  'absorbed_to_explicit_history_mac_ratio': '17/5',
                  'excluded': 'projections, softmax, norms, writes, scheduling; not physical bytes or measured traffic'},
              'cases': records,
              'limitations': ['Same synthetic MLA weights in both paths; not equivalence to an arbitrary dense model.',
                              'No trained weights, quality evaluation, GPU kernels or speed measurement.',
                              'No low-precision quantization, YaRN, paging or tensor-parallel behavior.']}
    print(json.dumps(report, ensure_ascii=False, indent=2, allow_nan=False))


if __name__ == '__main__':
    main()
