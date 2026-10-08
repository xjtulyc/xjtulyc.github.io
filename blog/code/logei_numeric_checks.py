#!/usr/bin/env python3
"""Reproducible scalar EI/LogEI numerical checks, not a BO performance benchmark.

Run: python logei_numeric_checks.py
Dependencies tested: mpmath==1.3.0, scipy==1.16.2 (NumPy 2.3.5).

The float64 implementation below is an original scalar expression of the
three-branch idea used by BoTorch's analytic LogEI helper. It uses SciPy erfcx
and Python math; it does not execute BoTorch or an autograd engine. Its mu
partial derivative is evaluated analytically, then checked against high
precision and a central finite difference. We neither fit a GP nor run BO,
wet-lab experiments, GPU kernels, or timing benchmarks.

Reference: Ament et al., NeurIPS 2023; arXiv:2310.20708v3 (2025-01-07).
Implementation reference (read, not executed):
https://github.com/pytorch/botorch/blob/da00e04015c0118f1b9383f32cab17bdcc0944ff/botorch/acquisition/analytic.py

For a=-z>0 we independently change variables in the positive integral:
 h(-a) = phi(a)/a**2 * integral_0^infinity u*exp(-u-u**2/(2*a**2)) du.
This avoids subtracting two nearly equal Gaussian-tail terms. At target precisions 80 and
160 decimal digits it is compared with phi(z)+z*Phi(z), using mpmath.erfc.
Forty guard digits are used internally to protect the independent closed-form
check at the very large auxiliary tail points; printed values retain fewer
than the target digits.
Agreement and refinement checks are numerical evidence, not certified interval
bounds for the quadrature or a proof for every possible input.
"""
from __future__ import annotations

import hashlib
import json
import math
import platform
import sys
from pathlib import Path

import mpmath as mp
import numpy as np
import scipy
from scipy import special


GRID = (1.0, 0.0, -1.0, -5.0, -10.0, -20.0, -40.0, -100.0)
ASYMPTOTIC_GRID = (-1e6, -1e7)
NEG_TAIL_SWITCH = -1e6  # float64 helper branch boundary in the pinned source
LOG_SQRT_2PI = 0.5 * math.log(2.0 * math.pi)
LOG_SQRT_PI_OVER_2 = 0.5 * math.log(math.pi / 2.0)


def naive_ei(z: float) -> float:
    """Fair binary64 expression: stable erfc CDF, not 1+erf cancellation."""
    phi = math.exp(-0.5 * z * z) / math.sqrt(2.0 * math.pi)
    cdf = 0.5 * math.erfc(-z / math.sqrt(2.0))
    return phi + z * cdf  # sigma=1


def log1mexp(w: float) -> float:
    """log(1-exp(w)) for w<0, with stable evaluation near zero."""
    if not w < 0.0:
        raise ValueError('log1mexp needs a strictly negative input')
    if w > -math.log(2.0):
        return math.log(-math.expm1(w))
    return math.log1p(-math.exp(w))


def stable_log_h_and_dz(z: float) -> tuple[float, float, str]:
    """Return log h(z), its z derivative, and the selected scalar branch.

    The third branch is an asymptotic approximation, not an exact identity.
    The derivative is the derivative of the expression evaluated in each
    branch. This function assumes finite inputs of moderate enough magnitude
    that z*z is representable; only the documented grids are tested.
    """
    if not math.isfinite(z):
        raise ValueError('finite z required')
    if z > -1.0:
        h = naive_ei(z)
        cdf = 0.5 * math.erfc(-z / math.sqrt(2.0))
        return math.log(h), cdf / h, 'direct-positive'
    if z > NEG_TAIL_SWITCH:
        a = abs(z)
        ex = float(special.erfcx(a / math.sqrt(2.0)))
        w = math.log(ex * a) + LOG_SQRT_PI_OVER_2
        log_d = log1mexp(w)
        log_h = -0.5 * z * z - LOG_SQRT_2PI + log_d
        # Phi(z)/phi(z) = sqrt(pi/2)*erfcx(-z/sqrt(2)).
        # Analytic gradient d(log h)/dz = [Phi/phi]/[h/phi].
        ratio = math.sqrt(math.pi / 2.0) * ex
        dz = ratio / (-math.expm1(w))
        return log_h, dz, 'erfcx-log1mexp'
    return (
        -0.5 * z * z - LOG_SQRT_2PI - 2.0 * math.log(abs(z)),
        -z - 2.0 / z,
        'leading-asymptotic',
    )


def scalar_log_ei(mu: float, incumbent: float, sigma: float) -> tuple[float, float]:
    """log EI and partial_mu log EI at fixed incumbent and sigma>0.

    The deterministic sigma=0 case is deliberately outside this helper's
    domain; production handling must be specified separately.
    """
    if not sigma > 0.0:
        raise ValueError('strictly positive posterior standard deviation required')
    lh, dz, _ = stable_log_h_and_dz((mu - incumbent) / sigma)
    return math.log(sigma) + lh, dz / sigma


def reference(z_float: float, dps: int) -> dict:
    with mp.workdps(dps + 40):
        z = mp.mpf(str(z_float))
        phi = mp.exp(-z*z/2) / mp.sqrt(2*mp.pi)
        cdf = mp.erfc(-z/mp.sqrt(2))/2
        closed = phi + z*cdf
        assert closed > 0
        if z < 0:
            a = -z
            kernel = lambda u: u * mp.exp(-u-u*u/(2*a*a))
            integral = mp.quad(kernel, [0, 1, 4, 16, mp.inf])
            positive = phi/(a*a) * integral
            relative = abs(positive/closed-1)
            tolerance = mp.power(10, -(dps-20))
            assert relative < tolerance, (z_float, dps, relative)
            log_h = mp.log(positive)
        else:
            positive = closed
            relative = mp.mpf('0')
            log_h = mp.log(closed)
        analytic_gradient = cdf / closed
        differentiated = mp.diff(
            lambda t: mp.log(mp.exp(-t*t/2)/mp.sqrt(2*mp.pi)
                            + t*mp.erfc(-t/mp.sqrt(2))/2), z
        )
        assert abs(differentiated/analytic_gradient-1) < mp.power(10, -(dps-20))
        # Store decimal strings so values far below float64 remain representable.
        return {
            'h': mp.nstr(positive, dps-5),
            'log_h': mp.nstr(log_h, dps-5),
            'dlog_dmu_sigma1': mp.nstr(analytic_gradient, dps-5),
            'positive_integral_vs_closed_relative_error': mp.nstr(relative, 12),
        }


def compare_precisions(z: float) -> tuple[dict, dict]:
    r80, r160 = reference(z, 80), reference(z, 160)
    with mp.workdps(170):
        for key in ('h', 'dlog_dmu_sigma1'):
            err = abs(mp.mpf(r80[key])/mp.mpf(r160[key])-1)
            assert err < mp.mpf('1e-60'), (z, key, err)
        log_err = abs(mp.mpf(r80['log_h'])-mp.mpf(r160['log_h']))
        assert log_err < mp.mpf('1e-60'), (z, 'log_h', log_err)
    return r80, r160


def check_row(z: float, finite_difference: bool = True) -> dict:
    r80, r160 = compare_precisions(z)
    value, gradient, branch = stable_log_h_and_dz(z)
    expected = float(r160['log_h'])
    expected_gradient = float(r160['dlog_dmu_sigma1'])
    value_error = abs(value - expected)
    gradient_relative_error = abs(gradient / expected_gradient - 1.0)
    # At huge negative z the float64 ULP in z*z dominates absolute error.
    value_tolerance = max(2e-10, 8.0 * math.ulp(expected))
    assert value_error <= value_tolerance, (z, value_error, value_tolerance)
    assert gradient_relative_error < 2e-9, (z, gradient_relative_error)
    raw = naive_ei(z)
    cdf = 0.5 * math.erfc(-z/math.sqrt(2.0))
    row = {
        'z': z,
        'sigma': 1.0,
        'naive_ei_float64': raw,
        'naive_dEI_dmu_float64': cdf,
        'naive_log_ei_float64': math.log(raw) if raw > 0 else None,
        'stable_log_ei_float64': value,
        'stable_dlogEI_dmu_float64': gradient,
        'branch': branch,
        'reference_160dps': r160,
        'stable_log_abs_error_vs_rounded_reference': value_error,
        'stable_mu_gradient_relative_error': gradient_relative_error,
        '80_vs_160_dps_pass': True,
    }
    if raw > 0:
        with mp.workdps(170):
            row['naive_ei_relative_error'] = float(abs(mp.mpf(raw)/mp.mpf(r160['h'])-1))
    else:
        row['naive_ei_relative_error'] = 1.0
    if finite_difference:
        step = 1e-5 * max(1.0, abs(z))
        fd = (stable_log_h_and_dz(z+step)[0] - stable_log_h_and_dz(z-step)[0])/(2*step)
        fd_relative = abs(fd/expected_gradient-1)
        assert fd_relative < 2e-7, (z, fd, expected_gradient)
        row['finite_difference_step'] = step
        row['finite_difference_mu_gradient'] = fd
        row['finite_difference_relative_error'] = fd_relative
    return row


def run() -> dict:
    rows = [check_row(z) for z in GRID]
    asymptotic = [check_row(z, finite_difference=False) for z in ASYMPTOTIC_GRID]
    # The log transform preserves order even for two underflowed tail values.
    assert naive_ei(-40.0) == naive_ei(-100.0) == 0.0
    assert stable_log_h_and_dz(-40.0)[0] > stable_log_h_and_dz(-100.0)[0]
    # Affine objective transform: positive a changes log EI by log a,
    # provided mean, incumbent and posterior standard deviation all transform.
    old, _ = scalar_log_ei(-40.0, 0.0, 1.0)
    new, _ = scalar_log_ei(3*(-40.0)+7, 7.0, 3.0)
    assert math.isclose(new-old, math.log(3), rel_tol=0, abs_tol=2e-13)
    # Partial_mu scaling with sigma while z is held fixed.
    _, scaled_grad = scalar_log_ei(-8.0, 0.0, 0.2)
    assert math.isclose(scaled_grad, stable_log_h_and_dz(-40.0)[1]/0.2,
                        rel_tol=2e-15)
    try:
        scalar_log_ei(1.0, 0.0, 0.0)
    except ValueError:
        pass
    else:
        raise AssertionError('sigma=0 domain check did not run')
    return {
        'status': 'PASS',
        'environment': {
            'python': platform.python_version(),
            'implementation': platform.python_implementation(),
            'platform': platform.platform(),
            'mpmath': mp.__version__,
            'scipy': scipy.__version__,
            'numpy': np.__version__,
            'float_radix': sys.float_info.radix,
            'float_mantissa_bits': sys.float_info.mant_dig,
            'script_sha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        },
        'conventions': {
            'objective': 'maximize; fixed noiseless incumbent; Gaussian scalar posterior; sigma>0',
            'z': '(mu-incumbent)/sigma; main numerical grid fixes sigma=1',
            'naive_baseline': 'Python math float64 phi(z)+z*0.5*erfc(-z/sqrt(2)); no 1+erf cancellation',
            'gradient': 'analytic partial_mu log EI at fixed sigma and incumbent; independently checked by high-precision differentiation and float64 finite differences; no autograd execution',
            'reference': '80/160 target decimal digits, 40 internal guard digits; negative-tail positive integral cross-checked against high-precision Gaussian closed form',
            'stable_float64': 'SciPy erfcx plus Python math log1mexp; leading asymptotic below -1e6; original scalar helper following the pinned BoTorch idea, not BoTorch execution',
            'zero_in_naive': 'floating-point underflow, not zero mathematical EI; null represents an unavailable real logarithm of a computed zero',
            'precision_boundary': 'agreement thresholds establish these cases only; high-precision refinement is not rigorous interval-certified quadrature',
            'scope': 'No fitted surrogate, BO optimization loop, wet-lab/clinical data, GPU test, wall-time claim, or calibration/decision-quality guarantee',
        },
        'main_rows': rows,
        'asymptotic_branch_checks': asymptotic,
        'additional_checks': {
            'negative_tail_ordering_restored': True,
            'positive_affine_objective_shift': True,
            'mu_partial_sigma_scaling': True,
            'sigma_zero_explicitly_out_of_domain': True,
        },
    }


if __name__ == '__main__':
    print(json.dumps(run(), ensure_ascii=False, indent=2, allow_nan=False))
