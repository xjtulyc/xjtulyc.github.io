#!/usr/bin/env python3
"""Exact-arithmetic checks for speculative sampling; no neural-model benchmark.

Convention: p is the target distribution, q the *actual* proposal distribution.
Leviathan et al. use this convention; Chen et al. reverse the letters.
All probabilities use stdlib Fraction. Randomness creates reproducible rational
TEST INPUTS only; probabilities and sequence laws are enumerated exactly.

Sources read:
https://proceedings.mlr.press/v202/leviathan23a/leviathan23a.pdf
https://arxiv.org/pdf/2302.01318

Cache tests check an abstract causal token/context invariant, not any framework's
attention kernel, physical paged cache, floating-point behavior, or latency.
"""
from collections import defaultdict
from fractions import Fraction as F
from itertools import product
from random import Random

ZERO, ONE = F(0), F(1)


def check_distribution(v):
    assert v and all(isinstance(x, F) and x >= 0 for x in v)
    assert sum(v, ZERO) == ONE


def acceptance(p, q, x):
    # A sampled proposal cannot have q[x] == 0. Never evaluate 0/0.
    assert q[x] > 0
    return min(ONE, p[x] / q[x])


def corrected_law(p, q):
    check_distribution(p)
    check_distribution(q)
    assert len(p) == len(q)
    accepted = tuple(q[x] * acceptance(p, q, x) if q[x] else ZERO
                     for x in range(len(p)))
    rejected = sum((q[x] * (ONE - acceptance(p, q, x))
                    for x in range(len(p)) if q[x]), ZERO)
    positive = tuple(max(ZERO, px - qx) for px, qx in zip(p, q))
    normalizer = sum(positive, ZERO)
    tv = sum((abs(px - qx) for px, qx in zip(p, q)), ZERO) / 2
    assert rejected == normalizer == tv
    alpha = sum(accepted, ZERO)
    assert alpha == ONE - tv
    # If p == q, rejection never occurs; no residual distribution is needed.
    residual = tuple(x / normalizer for x in positive) if normalizer else None
    correction = tuple(rejected * x for x in residual) if residual else (ZERO,) * len(p)
    final = tuple(a + b for a, b in zip(accepted, correction))
    assert final == p, (p, q, final)
    return alpha, accepted, rejected, residual, correction, final


def rational_distribution(rng, size):
    weights = [rng.randrange(11) for _ in range(size)]
    if not any(weights):
        weights[0] = 1
    return tuple(F(x, sum(weights)) for x in weights)


def point_mass(index, size):
    return tuple(F(i == index) for i in range(size))


def greedy_distribution(raw):
    # Fixed first-index tie-break: greedy is a delta, not the raw softmax.
    winner = max(range(len(raw)), key=raw.__getitem__)
    return point_mass(winner, len(raw))


def show(v):
    return None if v is None else '(' + ', '.join(map(str, v)) + ')'


def named_checks():
    p = (F(1, 2), F(3, 10), F(1, 5))
    q = (F(1, 5), F(1, 5), F(3, 5))
    old_q = (F(1, 5), F(1, 2), F(3, 10))
    result = corrected_law(p, q)
    alpha, accepted, rejected, residual, correction, final = result
    assert alpha == F(3, 5)
    assert accepted == (F(1, 5), F(1, 5), F(1, 5))
    assert rejected == F(2, 5)
    assert residual == (F(3, 4), F(1, 4), ZERO)
    print('three-token example:')
    print('  proposal acceptance =', show(tuple(acceptance(p, q, x) for x in range(3))))
    print('  acceptance =', alpha, '; rejection / TV =', rejected)
    print('  accepted mass =', show(accepted))
    print('  residual law =', show(residual))
    print('  rejected × residual =', show(correction))
    print('  final mass =', show(final), '= p')

    cases = {
        'prior single-residual example': (p, old_q),
        'p=q with a zero-probability token': ((F(2, 3), F(1, 3), ZERO),) * 2,
        'overlapping support mismatch': ((F(1, 2), F(1, 2), ZERO),
                                         (ZERO, F(1, 3), F(2, 3))),
        'disjoint supports': (point_mass(0, 3), point_mass(2, 3)),
        'greedy target, stochastic draft': (greedy_distribution(p), q),
        'stochastic target, greedy draft': (p, greedy_distribution(q)),
        'both greedy, agree': (greedy_distribution(p), greedy_distribution(p)),
        'both greedy, disagree': (greedy_distribution(p), greedy_distribution(q)),
        'greedy target, deterministic tie-break':
            (greedy_distribution((F(1, 2), F(1, 2), ZERO)), q),
    }
    for name, (pp, qq) in cases.items():
        corrected_law(pp, qq)
    assert corrected_law(*cases['p=q with a zero-probability token'])[3] is None
    print('named edge cases:', len(cases), 'PASS')

    # Negative control: generate greedily but incorrectly use pre-greedy q.
    q = old_q
    residual = corrected_law(p, q)[3]
    proposal = greedy_distribution(q)
    wrong_accepted = tuple(proposal[x] * acceptance(p, q, x)
                           for x in range(len(p)))
    wrong_reject = ONE - sum(wrong_accepted, ZERO)
    wrong_final = tuple(a + wrong_reject * r
                        for a, r in zip(wrong_accepted, residual))
    assert wrong_final == (F(2, 5), F(3, 5), ZERO) and wrong_final != p
    print('incorrect-q negative control:', show(wrong_final), '!= p (detected)')


def block_law(prefix, gamma, target, draft, vocab):
    """Enumerate one full block, including rejection correction or bonus token."""
    out = defaultdict(F)
    for guesses in product(range(vocab), repeat=gamma):
        path_weight = ONE
        for i, token in enumerate(guesses):
            path_weight *= draft[prefix + guesses[:i]][token]
        if not path_weight:
            continue
        survival = path_weight
        for i, token in enumerate(guesses):
            context = prefix + guesses[:i]
            p, q = target[context], draft[context]
            accept = acceptance(p, q, token)
            reject_mass = survival * (ONE - accept)
            if reject_mass:
                positive = tuple(max(ZERO, p[t] - q[t]) for t in range(vocab))
                norm = sum(positive, ZERO)
                assert norm > 0
                for y, value in enumerate(positive):
                    out[guesses[:i] + (y,)] += reject_mass * value / norm
            survival *= accept
        # The final verified row yields a target bonus after full acceptance.
        for y, value in enumerate(target[prefix + guesses]):
            out[guesses + (y,)] += survival * value
    assert sum(out.values(), ZERO) == ONE
    return {sequence: mass for sequence, mass in out.items() if mass}


def first_n_law(prefix, n, gamma, target, draft, vocab):
    """Repeat blocks and marginalize/truncate to exactly n generated tokens."""
    if n == 0:
        return {(): ONE}
    out = defaultdict(F)
    for block, weight in block_law(prefix, gamma, target, draft, vocab).items():
        if len(block) >= n:
            out[block[:n]] += weight
        else:
            for rest, rest_weight in first_n_law(prefix + block, n - len(block),
                                                gamma, target, draft, vocab).items():
                out[block + rest] += weight * rest_weight
    return dict(out)


def autoregressive_law(prefix, n, target):
    if n == 0:
        return {(): ONE}
    out = {}
    for token, mass in enumerate(target[prefix]):
        if not mass:
            continue
        for rest, rest_mass in autoregressive_law(prefix + (token,), n - 1, target).items():
            out[(token,) + rest] = mass * rest_mass
    return out


def conditional_checks():
    rng = Random(210006)
    contexts = [prefix for depth in range(5) for prefix in product(range(2), repeat=depth)]
    for trial in range(64):
        target = {prefix: rational_distribution(rng, 2) for prefix in contexts}
        draft = {prefix: rational_distribution(rng, 2) for prefix in contexts}
        if trial == 0:
            draft = target.copy()  # Exercise every all-accepted/bonus branch.
        observed = first_n_law((), 3, 2, target, draft, 2)
        expected = autoregressive_law((), 3, target)
        assert sum(observed.values(), ZERO) == ONE
        assert observed == expected, (trial, observed, expected)
    print('three-token conditional laws, gamma=2:', trial + 1,
          'exact exhaustive trees PASS (including correction, bonus, next block)')


def cache_checks():
    count = 0
    for L in (1, 2, 7):
        for gamma in range(5):
            committed = tuple(f'x{i + 1}' for i in range(L))
            old_cache = committed[:-1]
            guesses = tuple(f'd{i + 1}' for i in range(gamma))
            feed = committed[-1:] + guesses
            temporary = old_cache + feed
            assert len(old_cache) == L - 1
            assert len(temporary) == L + gamma
            for r in range(gamma + 1):
                absolute_pos = L - 1 + r
                allowed_columns = tuple(c for c in range(L + gamma)
                                        if c <= absolute_pos)
                row_context = tuple(temporary[c] for c in allowed_columns)
                assert row_context == committed + guesses[:r]
                # Thus row r predicts p_{r+1}; no future draft is visible.
                assert temporary[absolute_pos] == feed[r]
            for accepted in range(gamma + 1):
                new_committed = committed + guesses[:accepted] + ('new_y',)
                retained = temporary[:L + accepted]
                assert retained == new_committed[:-1]
                assert len(retained) == L + accepted == len(new_committed) - 1
                assert new_committed[-1] == 'new_y'
                # Includes A=0 and A=gamma; sampled y is never pre-cached.
                count += 1
    print('pending-last-token cache/position/mask invariants:', count, 'cases PASS')


def iid_length_checks():
    checks = 0
    for alpha in (ZERO, F(1, 5), F(7, 10), ONE):
        for gamma in range(7):
            # A = accepted draft prefix length; emitted length is A+1.
            length_mean = sum((F(a + 1) * alpha**a * (ONE - alpha)
                               for a in range(gamma)), ZERO)
            length_mean += F(gamma + 1) * alpha**gamma
            geometric_sum = sum((alpha**i for i in range(gamma + 1)), ZERO)
            assert length_mean == geometric_sum
            closed = F(gamma + 1) if alpha == ONE else (ONE - alpha**(gamma + 1)) / (ONE - alpha)
            assert closed == geometric_sum
            checks += 1
    print('IID capped-geometric length identity:', checks, 'cases PASS')


def main():
    named_checks()
    rng = Random(202610062100)
    for _ in range(2048):
        vocab = rng.randrange(2, 10)
        corrected_law(rational_distribution(rng, vocab), rational_distribution(rng, vocab))
    print('seeded rational one-step cases: 2048 PASS')
    conditional_checks()
    cache_checks()
    iid_length_checks()
    print('ALL CHECKS PASS; exact algebra only, no floating-point/model/latency claims.')


if __name__ == '__main__':
    main()
