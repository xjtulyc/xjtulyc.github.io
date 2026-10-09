# -*- coding: utf-8 -*-
"""Original CPU/NumPy float64 checks of the mathematical core, not a model benchmark."""
from pathlib import Path
import hashlib
import json
import numpy as np

SEED = 20261009
TOL = 1e-11

def recurrent(q, k, v, alpha, beta, state):
    state = np.array(state, dtype=np.float64, copy=True)
    out = []
    for qi, ki, vi, ai, bi in zip(q, k, v, alpha, beta):
        state *= ai
        residual = bi * (vi - state @ ki)
        state += np.outer(residual, ki)
        out.append(state @ qi)
    return np.array(out), state

def chunk(q, k, v, alpha, beta, state):
    """Educational triangular residual formulation; no inverse or GPU/WY kernel."""
    q, k, v, alpha, beta, state = [np.asarray(x, dtype=np.float64) for x in (q, k, v, alpha, beta, state)]
    n = len(alpha)
    gamma = np.cumprod(alpha)
    rho = np.zeros((n, n), dtype=np.float64)
    for i in range(n):
        rho[i, i] = 1.
        for j in range(i-1, -1, -1):
            rho[i, j] = rho[i, j+1] * alpha[j+1]
    lower = np.tril(rho * (k @ k.T), -1)
    rhs = beta[:, None] * (v - gamma[:, None] * (k @ state.T))
    # Forward substitution in (I + diag(beta) lower) E = rhs.
    errors = np.zeros_like(v)
    for i in range(n):
        errors[i] = rhs[i] - beta[i] * lower[i, :i] @ errors[:i]
    out = gamma[:, None] * (q @ state.T) + (rho * (q @ k.T)) @ errors
    final = gamma[-1] * state + errors.T @ (rho[-1, :, None] * k)
    return out, final

def blocked(q, k, v, alpha, beta, state, size):
    result = []
    for i in range(0, len(alpha), size):
        o, state = chunk(q[i:i+size], k[i:i+size], v[i:i+size], alpha[i:i+size], beta[i:i+size], state)
        result.append(o)
    return np.concatenate(result), state

def run():
    rng = np.random.default_rng(SEED)
    worst_out = 0.
    worst_state = 0.
    cases = 0
    for length in [1, 2, 5, 17, 33]:
        for dk, dv in [(1, 1), (2, 3), (7, 4)]:
            for mode in ['interior', 'endpoints', 'strong_decay']:
                k = rng.normal(size=(length, dk))
                k /= np.linalg.norm(k, axis=-1, keepdims=True)
                q = rng.normal(size=(length, dk))
                q /= np.linalg.norm(q, axis=-1, keepdims=True) * np.sqrt(dk)
                v = rng.normal(size=(length, dv))
                initial = rng.normal(size=(dv, dk))
                alpha = rng.uniform(.05, .99, length)
                beta = rng.uniform(.01, .99, length)
                if mode == 'endpoints':
                    alpha[::3] = 0.; alpha[1::3] = 1.
                    beta[::3] = 1.; beta[1::3] = 0.
                if mode == 'strong_decay':
                    alpha[:] = 1e-25
                expected, expected_state = recurrent(q, k, v, alpha, beta, initial)
                for size in [1, 2, 4, 8, 64]:
                    actual, actual_state = blocked(q, k, v, alpha, beta, initial.copy(), size)
                    oe = float(np.max(np.abs(actual-expected)))
                    se = float(np.max(np.abs(actual_state-expected_state)))
                    assert oe < TOL and se < TOL
                    worst_out = max(worst_out, oe); worst_state = max(worst_state, se); cases += 1
    s = np.array([[1., 2.]])
    q = np.array([[1., 0.]])
    k = q.copy(); v = np.array([[3.]])
    _, ordered = recurrent(q, k, v, [.5], [1.], s)
    wrong = .5 * (s + np.outer((v[0] - s @ k[0]), k[0]))
    np.testing.assert_allclose(ordered, [[3., 1.]], atol=TOL)
    np.testing.assert_allclose(wrong, [[1.5, 1.]], atol=TOL)
    unit45 = np.array([[1., 1.]]) / np.sqrt(2)
    _, interfered = recurrent(q, unit45, [[0.]], [1.], [1.], s)
    np.testing.assert_allclose(interfered, [[-.5, .5]], atol=TOL)
    _, history_a = recurrent([[1.], [1.]], [[1.], [1.]], [[4.], [0.]], [.5, .5], [.5, .5], [[0.]])
    _, history_b = recurrent([[1.], [1.]], [[1.], [1.]], [[0.], [1.]], [.5, .5], [.5, .5], [[0.]])
    np.testing.assert_allclose(history_a, [[.5]], atol=TOL)
    np.testing.assert_allclose(history_a, history_b, atol=TOL)
    _, unnormalized = recurrent([[1.]], [[3.]], [[0.]], [1.], [.5], [[1.]])
    np.testing.assert_allclose(unnormalized, [[-3.5]], atol=TOL)
    # Core neutral padding: alpha=1,beta=0 preserves state; q=0 masks output.
    pad_out, pad_state = recurrent([[0., 0.]], [[1., 0.]], [[123.]], [1.], [0.], s)
    np.testing.assert_allclose(pad_state, s, atol=TOL)
    np.testing.assert_allclose(pad_out, [[0.]], atol=TOL)
    # Output includes the current write. A strict-output mask incorrectly drops it.
    one_out, _ = chunk([[1.]], [[1.]], [[7.]], np.array([.5]), np.array([.5]), np.zeros((1, 1)))
    np.testing.assert_allclose(one_out, [[3.5]], atol=TOL)
    # Omitting the decay ratio in an otherwise correct chunk readout is detectable.
    decay_probe, _ = chunk([[1.], [1.]], [[1.], [1.]], [[4.], [0.]], [.5, .5], [.5, .5], np.zeros((1, 1)))
    missing_decay = np.tril(np.ones((2, 2))) @ np.array([[2.], [-.5]])
    np.testing.assert_allclose(decay_probe, [[2.], [.5]], atol=TOL)
    assert not np.allclose(decay_probe, missing_decay)
    # Educational packed-sequence boundary: reset the core before independent segment.
    _, first = recurrent([[1.]], [[1.]], [[4.]], [.5], [.5], [[0.]])
    second_reset, _ = recurrent([[1.]], [[1.]], [[0.]], [.5], [.5], [[0.]])
    second_leaked, _ = recurrent([[1.]], [[1.]], [[0.]], [.5], [.5], first)
    assert not np.allclose(second_reset, second_leaked)
    report = {
        'scope': 'Original CPU NumPy float64 forward arithmetic of a single mathematical core; no network weights, full model, official kernel, backward pass, GPU timing or empirical task-quality experiment.',
        'seed': SEED, 'numpy': np.__version__, 'tolerance': TOL, 'forward_comparisons': cases,
        'max_output_abs_error': worst_out, 'max_final_state_abs_error': worst_state,
        'covered': ['normalized random keys', 'nonzero incoming state', 'alpha/beta teaching endpoints', 'strong decay without product division', 'chunk partitions', 'inclusive output diagonal', 'neutral core padding', 'explicit independent-segment reset'],
        'counterexamples': {
            'decay_before_write': ordered.tolist(), 'wrong_delta_then_decay': wrong.tolist(),
            'nonorthogonal_interference': interfered.tolist(),
            'distinct_histories_same_core_state': [history_a.tolist(), history_b.tolist()],
            'unnormalized_key_expansion': unnormalized.tolist(),
            'reset_vs_leaked_readout': [second_reset.tolist(), second_leaked.tolist()],
            'correct_vs_missing_decay_readout': [decay_probe.tolist(), missing_decay.tolist()],
        },
        'passed': True,
        'script_sha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
    }
    Path(__file__).with_name('memory-sanity.json').write_text(json.dumps(report, indent=2)+'\n')
    print(json.dumps(report, indent=2))
    return report

if __name__ == '__main__':
    run()
