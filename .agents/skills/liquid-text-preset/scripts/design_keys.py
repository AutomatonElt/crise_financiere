"""Design the per-channel curves for the liquid text preset and fit After Effects Hermite keys.

Every channel is a spring step response: soft start (velocity 0 at t=0), long decay, and a small
liquid overshoot when the damping ratio is below 1. Each curve is sampled at DT, then keyed greedily
with cubic Hermite knots. AE bezier keys with 33.333 % influence on both sides and speed = slope ARE
a cubic Hermite spline, so what this script designs is what AE evaluates (measured 0.011 max
deviation on 2026-09-24 across ten channels).

Run:   python design_keys.py [out_dir]
Out:   <out_dir>/keys.json   {channel: {keys:[[t, value, slope], ...], samples:[[t, v], ...]}}
Then:  python build_rig_jsx.py <out_dir>/keys.json <out_dir>/build.jsx

Tuning is the `channels` table below. `wn` (rad/s) sets how fast a channel lands, `zeta` how it
lands: 1.0 = no overshoot, 0.85 = 0.6 % overshoot, 0.7 = 4.6 %, 0.65 = 6 %. `t0` delays the start.
Landing time (within 1 % of travel) is printed for every channel - use it to stagger arrivals so
nothing lands together.
"""
import json, math, os, sys
import numpy as np

FPS = 28.1719970703125          # the preset's comps (2008x1080)
DT = 0.005
T_END = 4.969473235837          # comp duration
T_EXT = 5.4                     # last key past the comp end so nothing stops on the last frame
MIN_GAP = 4 / FPS               # never two keys closer than 4 frames (2 frames on the rotation whip)
grid = np.arange(0, T_EXT + DT / 2, DT)


def spring(t, wn, zeta):
    """Remaining fraction r(t) of a spring step response: r(0)=1, r'(0)=0, r(inf)=0."""
    t = np.maximum(t, 0)
    if abs(zeta - 1) < 1e-9:
        return (1 + wn * t) * np.exp(-wn * t)
    wd = wn * math.sqrt(1 - zeta ** 2)
    return np.exp(-zeta * wn * t) * (np.cos(wd * t) + (zeta * wn / wd) * np.sin(wd * t))


def step(a, b, wn, zeta, t0=0.0):
    return b + (a - b) * spring(grid - t0, wn, zeta)


# ---- the shot, as shipped in the v2 liquid-rig project -----------------
channels = {
    # the two displacement warpers: centre of CC Scale Wipe 1 / 2, in the text layer's pixel space
    "WARP 1 centre/X": step(927, 1205.99981689453, 3.0, 0.85),
    "WARP 1 centre/Y": step(540, 508.688079833984, 2.0, 0.65),
    "WARP 2 centre/X": step(946, 792.867889404297, 2.7, 0.85, t0=0.07),
    "WARP 2 centre/Y": step(540, 508.043441772461, 1.8, 0.65, t0=0.07),
    # turbulence: amount fades out, size grows (waves lengthen as the liquid calms)
    "Turbulent/Amount": step(69, 0, 2.3, 1.0, t0=0.10),
    "Turbulent/Size":   step(65, 120, 1.6, 1.0),
    # transform, one null per channel
    "TXT scale":  step(150, 100, 1.9, 0.75),
    # rotation = fast critically-damped whip (120 deg, wn 8) + slow underdamped settle (45 deg)
    "TXT rot":    -165 + 120 * (1 - spring(grid, 8.0, 1.0)) + 45 * (1 - spring(grid, 1.1, 0.80)),
    "TXT pos X":  step(-30, 0, 1.5, 0.80),
    "TXT pos Y":  step(45, 0, 1.25, 0.80),
}
tol = {"WARP 1 centre/X": 0.6, "WARP 1 centre/Y": 0.6, "WARP 2 centre/X": 0.6, "WARP 2 centre/Y": 0.6,
       "Turbulent/Amount": 0.25, "Turbulent/Size": 0.5, "TXT scale": 0.15, "TXT rot": 0.25,
       "TXT pos X": 0.25, "TXT pos Y": 0.25}
min_gap = {"TXT rot": 2 / FPS}   # the opening whip needs keys 2 frames apart


def hermite(K, P, M, x):
    k = np.clip(np.searchsorted(K, x, side="right") - 1, 0, len(K) - 2)
    h = K[k + 1] - K[k]; s = (x - K[k]) / h
    return ((2*s**3 - 3*s**2 + 1) * P[k] + (s**3 - 2*s**2 + s) * h * M[k]
            + (-2*s**3 + 3*s**2) * P[k + 1] + (s**3 - s**2) * h * M[k + 1])


def keys_for(v, tolerance, gap):
    """Greedy knot insertion: start from the two ends, add a key where the keyed curve strays most."""
    dv = np.gradient(v, DT)
    K = [0.0, T_EXT]
    for _ in range(60):
        Ka = np.array(K); idx = np.round(Ka / DT).astype(int)
        e = np.abs(hermite(Ka, v[idx], dv[idx], grid) - v)
        for k in Ka: e[np.abs(grid - k) < gap] = 0
        if e.max() < tolerance: break
        K = sorted(K + [round(float(grid[e.argmax()]) * FPS) / FPS])   # snap to a frame
    Ka = np.array(K); idx = np.round(Ka / DT).astype(int)
    return Ka, v[idx], dv[idx]


if __name__ == "__main__":
    out_dir = sys.argv[1] if len(sys.argv) > 1 else "."
    os.makedirs(out_dir, exist_ok=True)
    out, report = {}, []
    for name, v in channels.items():
        K, P, M = keys_for(v, tol[name], min_gap.get(name, MIN_GAP))
        fit = hermite(K, P, M, grid)
        err = float(np.abs(fit - v).max()); gaps = np.diff(K) * FPS
        out[name] = {"keys": [[round(float(k), 4), float(p), float(m)] for k, p, m in zip(K, P, M)],
                     "samples": [[round(float(t), 2), float(x)] for t, x in zip(grid[::20], fit[::20])]}
        travel = abs(v[-1] - v[0]); rem = np.abs(v - v[-1])
        land = grid[np.where(rem > 0.01 * travel)[0].max()] if travel > 0 else 0
        peak = float(np.abs(np.gradient(v, DT)).max())
        report.append(f"{name:18s} keys={len(K):2d} maxerr={err:.3f} mingap={gaps.min():.1f}f "
                      f"meangap={gaps.mean():.1f}f  lands@{land:.2f}s  peakspeed={peak:.1f}/s")
    json.dump(out, open(os.path.join(out_dir, "keys.json"), "w"))
    print("\n".join(report))
    print("total keys:", sum(len(c["keys"]) for c in out.values()), "->", os.path.join(out_dir, "keys.json"))
