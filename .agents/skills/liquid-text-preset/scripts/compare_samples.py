"""Close the loop: compare what After Effects evaluates against the designed and fitted curves.

    python compare_samples.py <dir>      # dir holds keys.json (design_keys.py) and ae_samples.tsv (sample_rig.jsx)

Prints, per channel: max |AE - design|, max |AE - Hermite fit|, and the largest change of speed
per frame (the number the eye reads as a jolt). Expect |AE - fit| near 0.01 or less: AE bezier keys
at 33.333 % influence ARE the Hermite spline. Anything larger means a key was written with the wrong
ease or interpolation - re-run build_rig_jsx.py rather than nudging keys by hand.
"""
import contextlib, importlib.util, io, json, os, sys
import numpy as np

d_dir = sys.argv[1] if len(sys.argv) > 1 else "."
here = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("design", os.path.join(here, "design_keys.py"))
design = importlib.util.module_from_spec(spec)
with contextlib.redirect_stdout(io.StringIO()):
    spec.loader.exec_module(design)

ae = {}
for line in open(os.path.join(d_dir, "ae_samples.tsv"), encoding="utf-8"):
    k, t, v = line.rstrip("\n").split("\t"); ae.setdefault(k, []).append((float(t), float(v)))
keys = json.load(open(os.path.join(d_dir, "keys.json"), encoding="utf-8"))
FPS = design.FPS
print(f"{'channel':18s} {'max|AE-design|':>14s} {'max|AE-fit|':>12s} {'max dSpeed/frame':>16s}")
worst = 0.0
for k, v in design.channels.items():
    s = np.array(ae[k]); t = s[:, 0]; x = s[:, 1]
    des = np.interp(t, design.grid, v)
    kk = keys[k]["keys"]
    fit = design.hermite(np.array([q[0] for q in kk]), np.array([q[1] for q in kk]), np.array([q[2] for q in kk]), t)
    sp = np.gradient(x, 0.01); dsp = np.abs(np.diff(sp)) * (1 / FPS / 0.01)
    worst = max(worst, float(np.abs(x - fit).max()))
    print(f"{k:18s} {np.abs(x - des).max():14.3f} {np.abs(x - fit).max():12.4f} {dsp.max():16.2f}")
print("worst |AE - fit|:", round(worst, 4), "->", "PASS" if worst < 0.05 else "FAIL (keys not written as 33.333 % Hermite)")
