#!/usr/bin/env python3
"""Deterministic, standard-library checks for smooth-potentials-energy-drift.

Run with Python 3.9+; JSON is printed to stdout. All coordinates, time, mass,
and energies use dimensionless synthetic units. These checks use no learned
potential, DFT labels, molecular dataset, neural-network weights, or GPU.

The force example is analytically smooth but nonconservative for epsilon != 0.
The original teaching cutoff is C2 after constant extension, not C3.
It is not claimed to reproduce an eSEN/UMA implementation. The Verlet example uses an
exact conservative harmonic force and demonstrates integration error instead.
"""

import hashlib
import json
import math
import platform
import sys
from fractions import Fraction
from pathlib import Path


def close(actual, expected, *, atol=1e-12, rtol=1e-10):
    assert math.isclose(actual, expected, abs_tol=atol, rel_tol=rtol), (
        actual, expected
    )


def force(x, y, epsilon):
    return (-x - epsilon * y, -y + epsilon * x)


def polygon_work(n, epsilon, orientation):
    """Midpoint integration is exact on every straight segment for linear F.

    orientation = +1 is counterclockwise and -1 is clockwise. The polygon,
    rather than the circular arc, is integrated; the circle is its N->infinity
    limit. Reuse the first point at closure to avoid an extra endpoint gap.
    """
    assert n >= 3 and orientation in (-1, 1)
    points = [
        (math.cos(orientation * 2 * math.pi * k / n),
         math.sin(orientation * 2 * math.pi * k / n))
        for k in range(n)
    ]
    terms = []
    for k, (x0, y0) in enumerate(points):
        x1, y1 = points[(k + 1) % n]
        fx, fy = force((x0 + x1) / 2, (y0 + y1) / 2, epsilon)
        terms.append(fx * (x1 - x0) + fy * (y1 - y0))
    return math.fsum(terms)


def finite_difference_jacobian(point, epsilon, h):
    """J[a][b] = dF_a/dx_b by a centered difference."""
    columns = []
    for b in range(2):
        plus, minus = list(point), list(point)
        plus[b] += h
        minus[b] -= h
        fplus, fminus = force(*plus, epsilon), force(*minus, epsilon)
        columns.append([(fplus[a] - fminus[a]) / (2 * h) for a in range(2)])
    return [[columns[b][a] for b in range(2)] for a in range(2)]


def force_checks():
    epsilon = 0.01
    rows = []
    for n in (16, 32, 64, 128, 256, 512):
        ccw = polygon_work(n, epsilon, 1)
        cw = polygon_work(n, epsilon, -1)
        exact_polygon = epsilon * n * math.sin(2 * math.pi / n)
        close(ccw, exact_polygon)
        close(cw, -exact_polygon)
        close(polygon_work(n, 0.0, 1), 0.0)
        close(polygon_work(n, -epsilon, 1), -exact_polygon)
        rows.append({
            "segments": n, "counterclockwise_work": ccw,
            "clockwise_work": cw, "exact_polygon_work": exact_polygon,
            "absolute_circle_error": abs(ccw - 2 * math.pi * epsilon),
        })
    for previous, current in zip(rows, rows[1:]):
        ratio = previous["absolute_circle_error"] / current["absolute_circle_error"]
        assert 3.9 < ratio < 4.1, ratio
    jacobians = []
    for point in ((0.0, 0.0), (0.4, -0.7), (-1.2, 0.3)):
        for h in (1e-2, 1e-4, 1e-6):
            j = finite_difference_jacobian(point, epsilon, h)
            expected = ((-1.0, -epsilon), (epsilon, -1.0))
            for a in range(2):
                for b in range(2):
                    close(j[a][b], expected[a][b], atol=2e-10)
            skew_difference = [[j[a][b] - j[b][a] for b in range(2)] for a in range(2)]
            close(skew_difference[0][1], -2 * epsilon, atol=2e-10)
            close(skew_difference[1][0], 2 * epsilon, atol=2e-10)
            jacobians.append({"point": point, "step": h, "jacobian": j,
                              "J_minus_J_transpose": skew_difference,
                              "antisymmetric_part": [[value / 2 for value in row] for row in skew_difference]})
    return {"epsilon": epsilon, "circle_ccw_work": 2 * math.pi * epsilon,
            "circle_cw_work": -2 * math.pi * epsilon, "polygon_rows": rows,
            "jacobian_rows": jacobians,
            "convention": "J-J^T has off-diagonal +/-2 epsilon; its half is the antisymmetric part.",
            "finite_difference_limit": "For this linear field, truncation error is zero; only floating-point error remains."}


def polynomial_derivative(s, order):
    coefficients = [Fraction(x) for x in (1, 0, 0, -10, 15, -6)]
    for _ in range(order):
        coefficients = [i * coefficients[i] for i in range(1, len(coefficients))]
    return sum((a * s ** i for i, a in enumerate(coefficients)), Fraction(0))


def cutoff(s):
    if s <= 0:
        return Fraction(1)
    if s >= 1:
        return Fraction(0)
    return polynomial_derivative(s, 0)


def cutoff_checks():
    endpoints = []
    for endpoint, expected in ((0, (1, 0, 0, -60)), (1, (0, 0, 0, -60))):
        values = [polynomial_derivative(Fraction(endpoint), order) for order in range(4)]
        assert values == list(map(Fraction, expected))
        assert values[1] == values[2] == 0
        assert values[3] != 0  # outside constant branch has third derivative zero
        endpoints.append({"s": endpoint, "polynomial_inside_derivatives_0_to_3": [str(v) for v in values],
                          "constant_outside_derivatives_1_to_3": ["0", "0", "0"]})
    assert cutoff(Fraction(-1)) == 1 and cutoff(Fraction(0)) == 1
    assert cutoff(Fraction(1)) == 0 and cutoff(Fraction(2)) == 0
    for k in range(101):
        s = Fraction(k, 100)
        assert 0 <= cutoff(s) <= 1
        assert polynomial_derivative(s, 1) == -30 * s**2 * (1 - s)**2
        assert polynomial_derivative(s, 1) <= 0
    return {"arithmetic": "exact Fraction", "endpoint_rows": endpoints,
            "monotonic_grid_points": 101, "piecewise_regularity": "C2 but not C3",
            "limit": "This single cutoff check does not establish regularity of an entire potential or neighbor-list implementation."}


def velocity_verlet(h, steps):
    q, v = 1.0, 0.0
    h0 = 0.5
    max_error = 0.0
    max_shadow_error = 0.0
    for _ in range(steps):
        a = -q
        q_new = q + h * v + 0.5 * h * h * a
        v_new = v + 0.5 * h * (a - q_new)
        q, v = q_new, v_new
        energy = 0.5 * (q * q + v * v)
        assert math.isfinite(energy)
        max_error = max(max_error, abs(energy - h0))
        # An exact-arithmetic invariant of this particular harmonic update.
        invariant = 0.5 * (v * v + (1 - h * h / 4) * q * q)
        max_shadow_error = max(max_shadow_error, abs(invariant - 0.5 * (1 - h * h / 4)))
    return {"step_size": h, "steps": steps, "total_time": h * steps,
            "max_absolute_physical_energy_error": max_error,
            "max_harmonic_discrete_invariant_error": max_shadow_error,
            "final_energy": 0.5 * (q * q + v * v)}


def integration_checks():
    rows = []
    for h in (0.2, 0.1, 0.05, 0.025):
        steps = round(100 / h)
        close(h * steps, 100.0)
        row = velocity_verlet(h, steps)
        envelope = h * h / 8
        actual = row["max_absolute_physical_energy_error"]
        # For q0=1, v0=0, the exact-arithmetic physical energy error is
        # -(h^2/8) sin^2(n theta), theta=2 asin(h/2). The sampled maximum
        # need not attain the envelope exactly over a finite trajectory.
        assert actual <= envelope + 2e-12
        assert actual >= 0.999 * envelope
        assert row["max_harmonic_discrete_invariant_error"] < 2e-12
        row["analytic_error_envelope_h_squared_over_8"] = envelope
        rows.append(row)
    ratios = [rows[i]["max_absolute_physical_energy_error"] / rows[i+1]["max_absolute_physical_energy_error"] for i in range(len(rows)-1)]
    assert all(3.99 < ratio < 4.01 for ratio in ratios)
    unstable = velocity_verlet(2.1, 100)
    assert unstable["max_absolute_physical_energy_error"] > 1.0
    # Deliberately omit the blow-up magnitude: it is only an algorithmic
    # negative control above the h*omega < 2 harmonic stability boundary.
    return {"mass": 1, "spring_constant": 1, "initial_q": 1, "initial_v": 0,
            "initial_energy": 0.5, "stable_rows": rows, "observed_halving_ratios": ratios,
            "unstable_negative_control": {"step_size": 2.1, "steps": 100,
                "finite_computation": True, "energy_error_exceeds_one": True},
            "limit": "Synthetic harmonic oscillator only; no eSEN/DFT reproduction and no general long-time stability proof."}


def main():
    result = {
        "status": "PASS", "scope": "deterministic synthetic mathematics and integration checks",
        "environment": {"python": platform.python_version(), "implementation": platform.python_implementation(),
                        "platform": platform.platform(), "float_mantissa_bits": sys.float_info.mant_dig,
                        "script_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest()},
        "force_field": force_checks(), "cutoff": cutoff_checks(), "integration": integration_checks(),
        "not_tested": ["learned interatomic potentials", "DFT accuracy", "molecular dynamics benchmarks",
                       "GPU speed", "real neighbor lists", "thermostats", "general stiff-system stability"],
    }
    print(json.dumps(result, indent=2, ensure_ascii=False, allow_nan=False))


if __name__ == "__main__":
    main()
