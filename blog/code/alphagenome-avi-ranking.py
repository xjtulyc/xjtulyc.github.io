"""Original arithmetic checks for a score-interpretation article.

Python >=3.9, standard library only. No AlphaGenome/AVI implementation,
weights, API requests, biological observations, or clinical calibration.
The empirical upper-tail convention is defined here, not claimed to match
Atlas tie handling, interpolation, or out-of-range score handling.
"""
from bisect import bisect_left
from dataclasses import dataclass
import json
import math


@dataclass(frozen=True)
class ReferenceTail:
    """Sort a fixed synthetic reference once; each lookup costs O(log N)."""
    scores: tuple

    def __post_init__(self):
        values = tuple(sorted(float(x) for x in self.scores))
        if not values or not all(math.isfinite(x) for x in values):
            raise ValueError("A nonempty finite reference is required")
        object.__setattr__(self, "scores", values)

    def fraction(self, score):
        if not math.isfinite(score):
            raise ValueError("Score must be finite")
        n = len(self.scores)
        # Equality is included: tied scores share one upper-tail fraction.
        k = n - bisect_left(self.scores, score)
        if k == 0:
            raise ValueError("Above reference maximum: no finite-tail extrapolation")
        return k / n

    def phred(self, score):
        return max(0.0, -10.0 * math.log10(self.fraction(score)))


def sigmoid(x):
    if x >= 0:
        return 1.0 / (1.0 + math.exp(-x))
    e = math.exp(x)
    return e / (1.0 + e)


def prior_shift(q_sample, prior_sample, prior_target):
    """Only same-label prior shift with unchanged class-conditional densities."""
    for p in (q_sample, prior_sample, prior_target):
        if not 0 < p < 1:
            raise ValueError("All inputs must be strictly between zero and one")
    log_odds = (math.log(q_sample) - math.log1p(-q_sample)
                - math.log(prior_sample) + math.log1p(-prior_sample)
                + math.log(prior_target) - math.log1p(-prior_target))
    return sigmoid(log_odds)


def posterior_from_rates(sensitivity, false_positive_rate, prevalence):
    """Bayes identity for specified hypothetical rates; not AVI calibration."""
    if not all(0 <= p <= 1 for p in (sensitivity, false_positive_rate, prevalence)):
        raise ValueError("Rates must be in [0,1]")
    numerator = sensitivity * prevalence
    denominator = numerator + false_positive_rate * (1-prevalence)
    if denominator == 0:
        raise ValueError("Conditioning event has zero probability")
    return numerator / denominator


def cached_pass_counts(non_n_positions):
    """Idealized SNV forward-pass counts, not elapsed time or memory."""
    if not isinstance(non_n_positions, int) or not 0 <= non_n_positions <= 128:
        raise ValueError("Use integer non-N positions in a 128 bp window")
    variants = 3 * non_n_positions
    return 2 * variants, (1 + variants if variants else 0)


def verify():
    checks = 0

    def check(condition):
        nonlocal checks
        if not condition:
            raise AssertionError("Arithmetic invariant failed")
        checks += 1

    def close(a, b):
        check(math.isclose(a, b, rel_tol=1e-12, abs_tol=1e-12))

    def rejects(call):
        nonlocal checks
        try:
            call()
        except ValueError:
            checks += 1
        else:
            raise AssertionError("Expected input rejection")

    ref = ReferenceTail(tuple(range(1000)))
    for score, q in [(0,0),(900,10),(990,20),(999,30)]:
        close(ref.phred(score), q)
    ties = ReferenceTail((0,0,1,1,2))
    close(ties.fraction(1), 3/5)
    close(ties.phred(1), -10*math.log10(3/5))
    # Strictly increasing affine transforms preserve fixed-reference ranks.
    for scale, offset in [(0.5,-3),(2,7),(5,-19)]:
        transformed = ReferenceTail(tuple(scale*x+offset for x in ref.scores))
        for score in [0,1,50,500,900,990,999]:
            close(ref.phred(score), transformed.phred(scale*score+offset))
    for score in range(0, 950, 50):
        check(ref.phred(score) <= ref.phred(score+50))
    subset = ReferenceTail(tuple(range(990,1000)))
    close(ref.phred(990), 20)
    close(subset.phred(990), 0)
    # Applying the same reference to another class does not estimate its tail.
    indel_example = ReferenceTail(tuple(range(900,1000)))
    close(ref.fraction(990), 0.01)
    close(indel_example.fraction(990), 0.10)
    mean_logits = sigmoid((0+4)/2)
    mean_sigmoids = (sigmoid(0)+sigmoid(4))/2
    check(mean_logits > mean_sigmoids)
    close(prior_shift(0.9,0.5,0.01), 1/12)
    close(prior_shift(0.9,0.5,0.5), 0.9)
    close(prior_shift(0.5,1e-320,0.5), 1.0)
    close(prior_shift(0.9,1e-320,0.01), 1.0)
    # Identical conditional rates, different prevalences, different posteriors.
    low = posterior_from_rates(0.9,0.01,0.001)
    high = posterior_from_rates(0.9,0.01,0.1)
    close(low, 0.0009/0.01089)
    close(high, 0.09/0.099)
    check(low < high)
    # Positive adaptive weight alone is not a monotonicity proof.
    f = lambda x: x*math.exp(-x)
    check(math.exp(-1)>0 and math.exp(-2)>0)
    check(f(2) < f(1))
    # Exact path-integral attribution for a polynomial, nonzero output at zero.
    bias, coefficients, inputs = 7.0, (1,-2,3), (2,4,-1)
    contributions = [x*x+c*x for c,x in zip(coefficients,inputs)]
    output = bias + sum(contributions)
    close(sum(contributions), output-bias)
    check(not math.isclose(sum(contributions),output))
    for n in [0,1,7,64,128]:
        naive, cached = cached_pass_counts(n)
        close(naive, 6*n)
        close(cached, 1+3*n if n else 0)
    check(cached_pass_counts(128)==(768,385))
    for call in [lambda: ReferenceTail(()),lambda: ReferenceTail((float('nan'),)),
                 lambda: ref.phred(1000),lambda: ref.phred(float('inf')),
                 lambda: prior_shift(1,0.5,0.01),lambda: cached_pass_counts(129),
                 lambda: posterior_from_rates(0,0,0.1)]:
        rejects(call)
    return {
        "checks": checks,
        "synthetic_reference_size": 1000,
        "same_score_global_vs_subset_phred": [ref.phred(990),subset.phred(990)],
        "hypothetical_posteriors": [low,high],
        "idealized_snv_forward_pass_counts": list(cached_pass_counts(128)),
        "scope": "Pure arithmetic with specified synthetic inputs; no model, biological or clinical experiment",
    }


if __name__ == "__main__":
    print(json.dumps(verify(), indent=2))
