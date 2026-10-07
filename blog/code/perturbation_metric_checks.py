#!/usr/bin/env python3
"""Synthetic, standard-library checks for perturbation evaluation metrics.

These are algebraic examples, not single-cell data, model training, or a
reproduction of biological benchmark results. Fractions are exact; only the
reported Pearson coefficients use floating-point square roots.

The first example fixes a reference independently of the test response. In the
second, noise belongs to synthetic pseudobulk estimates, not individual cells.
The first-gene weighting is an ORACLE TOY SUPPORT known by construction. It is
not a deployable gene-selection method. In real evaluation, ground-truth-derived
scoring weights must not be supplied to the predictor or used to construct the
positive-control prediction from the same evaluation half.

Run: python3 perturbation_metric_checks.py
The program prints JSON and raises AssertionError if a claimed identity fails.
"""

import json
from fractions import Fraction as F
from itertools import product
from math import sqrt


def add(a, b):
    assert len(a) == len(b)
    return tuple(x + y for x, y in zip(a, b))


def subtract(a, b):
    assert len(a) == len(b)
    return tuple(x - y for x, y in zip(a, b))


def scale(k, a):
    return tuple(k * x for x in a)


def dot(a, b):
    assert len(a) == len(b)
    return sum((x * y for x, y in zip(a, b)), F(0))


def mse(a, b):
    error = subtract(a, b)
    return dot(error, error) / len(error)


def pearson(a, b):
    """Return (reported float, exact squared correlation), or (None, None).

    Pearson correlation is undefined when either centered vector is constant.
    A zero vector is not assigned an arbitrary zero score.
    """
    assert len(a) == len(b) and len(a) > 1
    a = tuple(map(F, a))
    b = tuple(map(F, b))
    ac = tuple(x - sum(a, F(0)) / len(a) for x in a)
    bc = tuple(x - sum(b, F(0)) / len(b) for x in b)
    numerator = dot(ac, bc)
    denominator_squared = dot(ac, ac) * dot(bc, bc)
    if denominator_squared == 0:
        return None, None
    return (float(numerator) / sqrt(float(denominator_squared)),
            numerator * numerator / denominator_squared)


def shared_shift_checks():
    s = tuple(map(F, (1, -1, 1, -1)))
    u = tuple(map(F, (1, 1, -1, -1)))
    assert sum(s) == sum(u) == 0 and dot(s, u) == 0
    control = add((F(100),) * 4, scale(20, s))
    # Fixed reference: no test response is used to estimate this vector.
    reference = add(control, scale(10, s))
    truth = add(reference, u)
    prediction = reference  # No perturbation-specific component.
    raw, raw_squared = pearson(prediction, truth)
    delta, delta_squared = pearson(subtract(prediction, control),
                                   subtract(truth, control))
    centered, centered_squared = pearson(subtract(prediction, reference),
                                         subtract(truth, reference))
    doubled, doubled_squared = pearson(scale(2, u), u)
    assert raw_squared == F(900, 901) and raw > 0
    assert delta_squared == F(100, 101) and delta > 0
    assert centered is None and centered_squared is None
    assert doubled == 1.0 and doubled_squared == 1
    assert mse(scale(2, u), u) == 1
    return {
        "raw_pearson": raw,
        "raw_pearson_squared_exact": str(raw_squared),
        "control_delta_pearson": delta,
        "control_delta_pearson_squared_exact": str(delta_squared),
        "perturbed_reference_pearson": centered,
        "null_reason": "zero prediction vector; Pearson is undefined",
        "doubled_specific_effect_pearson": doubled,
        "doubled_specific_effect_mse_exact": str(mse(scale(2, u), u)),
    }


def coordinate_expected_errors(effect, noise):
    """Enumerate all nine independent GT/duplicate noise pairs for one gene."""
    baseline_error = duplicate_error = probability = F(0)
    for (gt_noise, gt_prob), (td_noise, td_prob) in product(noise, repeat=2):
        weight = gt_prob * td_prob
        gt = effect + gt_noise
        duplicate = effect + td_noise
        baseline_error += weight * gt * gt  # Centered mean baseline is zero.
        duplicate_error += weight * (duplicate - gt) ** 2
        probability += weight
    assert probability == 1
    return baseline_error, duplicate_error


def noise_checks():
    genes = 100
    effects = (F(1),) + (F(0),) * (genes - 1)
    noise = ((F(-1), F(1, 100)), (F(0), F(98, 100)),
             (F(1), F(1, 100)))
    assert sum(p for _, p in noise) == 1
    assert sum(x * p for x, p in noise) == 0
    variance = sum(x * x * p for x, p in noise)
    assert variance == F(1, 50) and dot(effects, effects) == 1
    # Squared error is additive across genes. This coordinate-wise enumeration
    # is exact; it does not require materializing a 9**100 joint outcome table.
    errors = [coordinate_expected_errors(effect, noise) for effect in effects]
    baseline = sum((item[0] for item in errors), F(0)) / genes
    duplicate = sum((item[1] for item in errors), F(0)) / genes
    oracle_baseline, oracle_duplicate = errors[0]
    assert baseline == F(3, 100)
    assert duplicate == F(1, 25)
    assert oracle_baseline == F(51, 50)
    assert oracle_duplicate == F(1, 25)
    assert baseline < duplicate and oracle_baseline > oracle_duplicate
    return {
        "genes": genes,
        "signal_squared_norm_exact": str(dot(effects, effects)),
        "noise_probabilities_exact": {str(x): str(p) for x, p in noise},
        "noise_variance_per_gene_per_half_exact": str(variance),
        "enumerated_noise_pairs_per_gene": 9,
        "coordinate_pair_terms": genes * 9,
        "unweighted_expected_mse_exact": {
            "mean_baseline": str(baseline),
            "technical_duplicate": str(duplicate),
        },
        "oracle_first_gene_expected_mse_exact": {
            "mean_baseline": str(oracle_baseline),
            "technical_duplicate": str(oracle_duplicate),
        },
        "weighting_scope": "fixed oracle toy support; not inferred from real data",
    }


def squared_distance(a, b):
    difference = subtract(a, b)
    return dot(difference, difference)


def strict_pairwise_score(prediction, targets, correct_index):
    """Fraction of competitors strictly farther away; ties are not wins.

    This explicitly chosen tie policy is not a claim that every implementation
    of a retrieval metric uses the same ranking convention.
    """
    assert len(targets) > 1 and 0 <= correct_index < len(targets)
    correct_distance = squared_distance(prediction, targets[correct_index])
    wins = sum(squared_distance(prediction, target) > correct_distance
               for i, target in enumerate(targets) if i != correct_index)
    return F(wins, len(targets) - 1)


def retrieval_checks():
    u = tuple(map(F, (1, 1, -1, -1)))
    reference = (F(200),) * 4
    targets = (add(reference, u), subtract(reference, u))
    predictions = (add(reference, scale(100, u)),
                   subtract(reference, scale(100, u)))
    scores = [strict_pairwise_score(p, targets, i)
              for i, p in enumerate(predictions)]
    errors = [mse(p, targets[i]) for i, p in enumerate(predictions)]
    assert scores == [F(1), F(1)] and errors == [F(9801), F(9801)]
    # Distinct labels may have identical measured profiles. A perfect profile
    # then does not win a strict comparison against its identical competitor.
    tie_score = strict_pairwise_score(targets[0], (targets[0], targets[0]), 0)
    assert tie_score == 0
    return {
        "candidate_count": len(targets),
        "strict_pairwise_scores_exact": list(map(str, scores)),
        "mse_exact": list(map(str, errors)),
        "identical_competitor_strict_score_exact": str(tie_score),
        "tie_policy": "strictly farther competitors count as wins; ties do not",
    }


def squared_distance_tiles(predictions, targets, row_block, column_block):
    """Yield one distance tile at a time using the squared-L2 dot identity.

    Inputs are already in memory. No full output matrix is allocated here;
    the small test consumer materializes results only to check every entry.
    """
    assert row_block > 0 and column_block > 0
    for r0 in range(0, len(predictions), row_block):
        query = predictions[r0:r0 + row_block]
        for c0 in range(0, len(targets), column_block):
            candidate = targets[c0:c0 + column_block]
            tile = [[dot(a, a) + dot(b, b) - 2 * dot(a, b)
                     for b in candidate] for a in query]
            yield r0, c0, tile


def tiled_distance_checks():
    # Uneven edge tiles, repeated targets, and a zero vector exercise indexing
    # and ties. Fractions avoid any floating-point cancellation in this check.
    predictions = [tuple(map(F, x)) for x in
                   ((2, 0, -1, 3), (0, 0, 0, 0), (-2, 1, 4, 1))]
    targets = [tuple(map(F, x)) for x in
               ((1, 2, 3, 4), (-1, 0, 1, 0), (1, 2, 3, 4), (0, 0, 0, 0))]
    direct = {(i, j): squared_distance(a, b)
              for i, a in enumerate(predictions) for j, b in enumerate(targets)}
    tile_shapes = ((1, 1), (2, 3), (4, 5))
    comparisons = 0
    for row_block, column_block in tile_shapes:
        tiled = {}
        for r0, c0, tile in squared_distance_tiles(
                predictions, targets, row_block, column_block):
            for r, row in enumerate(tile):
                for c, value in enumerate(row):
                    assert (r0 + r, c0 + c) not in tiled
                    tiled[r0 + r, c0 + c] = value
        assert tiled == direct and all(value >= 0 for value in tiled.values())
        comparisons += len(direct)
    return {
        "matrix_shape": [len(predictions), len(targets)],
        "block_shapes": [list(shape) for shape in tile_shapes],
        "exact_entry_comparisons": comparisons,
        "all_distances_equal": True,
        "scope": "exact toy arithmetic, not a memory or runtime benchmark",
    }


def main():
    result = {
        "scope": "synthetic algebra only; no biological data or trained model",
        "shared_shift": shared_shift_checks(),
        "independent_discrete_noise": noise_checks(),
        "retrieval_amplitude_and_ties": retrieval_checks(),
        "tiled_squared_distances": tiled_distance_checks(),
        "all_checks_passed": True,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2, allow_nan=False))


if __name__ == "__main__":
    main()
