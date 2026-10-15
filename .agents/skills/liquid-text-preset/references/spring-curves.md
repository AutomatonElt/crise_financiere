# Spring curves - how every channel of the preset is shaped

## Why springs

The original preset used, on every channel, a bezier pair with **~0 % out influence and 100 % in
influence**. Reconstructing the rotation from its ease values (out speed 13,784 deg/s at 0.2 %
influence, in speed -0.25 at 98.6 %) gives control points `(0,-165) (0.01,-27) (0.07,+1.2) (4.93,0)`:

| time | rotation |
|---|---|
| frame 1 (0.035 s) | -98 |
| frame 2 | -81 |
| 0.5 s | -36 |
| 1.0 s | -19 |
| 1.6 s | -10 |
| 2.5 s | -4 |

Two-thirds of the spin happens before the second frame, then the last 4 degrees crawl for 2.5 s.
The warpers, the turbulence amount and the scale had the same shape on a 2.4-3.2 s span (50 % of
the travel by 0.3 s). That is what "not smooth" was: an instant start, a jolt, and a long crawl,
all channels welded to frame 0 and (for the streak) to 2.378 s.

A **spring step response** has the opposite properties for free: velocity is zero at t = 0 (a soft
start of a few frames), the peak speed comes early, the decay is continuous, and with damping below
critical it overshoots a little and settles - the "liquid inertia" the brief asked for.

## The maths (`design_keys.py`)

Remaining fraction of the travel, `r(t)`, with natural frequency `wn` (rad/s) and damping `zeta`:

- critically damped, `zeta = 1`: `r = (1 + wn t) e^(-wn t)` - no overshoot
- underdamped, `zeta < 1`: `wd = wn sqrt(1 - zeta^2)`,
  `r = e^(-zeta wn t) (cos(wd t) + (zeta wn / wd) sin(wd t))`

value(t) = target + (start - target) * r(t - t0), held at start before t0.

Handy numbers: overshoot = `exp(-pi zeta / sqrt(1 - zeta^2))` -> 0.6 % at zeta 0.85, 1.5 % at 0.8,
2.8 % at 0.75, 4.6 % at 0.7, 6.0 % at 0.65. Settling (2 %) at about `4 / (zeta wn)` seconds. The
overshoot peaks at `pi / wd`.

The rotation is the one non-trivial channel: `-165 + 120 (1 - r_crit(8 t)) + 45 (1 - r(1.1, 0.8, t))`
- a fast critically-damped whip carrying 120 degrees (90 % done by 0.49 s, peak 359 deg/s at
0.125 s) plus a slow underdamped settle carrying the last 45. One spring could not do both.

## Shipped parameters (v2, 2026-09-24)

| channel | from -> to | wn | zeta | t0 | lands (1 %) | peak speed |
|---|---|---|---|---|---|---|
| WARP 1 centre X | 927 -> 1206 | 3.0 | 0.85 | 0 | 1.49 s | 342 px/s |
| WARP 1 centre Y | 540 -> 509 | 2.0 | 0.65 | 0 | 3.23 s | 30 |
| WARP 2 centre X | 946 -> 793 | 2.7 | 0.85 | 0.07 | 1.72 s | 169 |
| WARP 2 centre Y | 540 -> 508 | 1.8 | 0.65 | 0.07 | 3.72 s | 28 |
| Turbulent Amount | 69 -> 0 | 2.3 | 1.0 | 0.10 | 2.98 s | 58 /s |
| Turbulent Size | 65 -> 120 | 1.6 | 1.0 | 0 | 4.04 s | 32 /s |
| TXT scale | 150 -> 100 | 1.9 | 0.75 | 0 | 3.50 s | 42 %/s |
| TXT rot | -165 -> 0 | 8.0 + 1.1 | 1.0 + 0.8 | 0 | 3.35 s | 359 deg/s |
| TXT pos X | -30 -> 0 | 1.5 | 0.8 | 0 | 4.04 s | 19 px/s |
| TXT pos Y | +45 -> 0 | 1.25 | 0.8 | 0 | 3.27 s | 24 px/s |

The X and Y of each warper deliberately have different `wn`, so the Center travels a slight arc
rather than a straight line, and warper 2 starts two frames after warper 1.

The first fit used `wn` 2.6 / 2.35 and `zeta` 0.7 on the warper X channels; that snapped the streak
off at 1.3 s (the Center crosses the text edge at ~1200 / ~808 px) against ~1.75 s in the original,
and the 4.6 % overshoot was invisible anyway. The shipped 3.0 / 2.7 at 0.85 crosses at ~1.4 s.

## From curve to keys

`keys_for()` inserts a knot greedily where the Hermite reconstruction strays most from the sampled
curve, never closer than 4 frames to an existing knot (2 frames on the rotation whip), snapped to a
frame, until the worst error is under the channel's tolerance (0.6 px warpers, 0.25 deg rotation,
0.15 % scale, 0.25 px drift). Result: 66 keys over 10 channels, densest on the rotation and the
warper X channels in the first 0.6 s.

Each knot becomes `setValueAtTime(t, v)`, `BEZIER/BEZIER`, `KeyframeEase(slope, 33.333)` on both
sides. **That is exactly a cubic Hermite spline** (ae-camera-movement measured it first on a camera),
and the closed loop here confirmed it on ten 2D channels: worst |AE - fit| **0.011** (the rotation,
inside the whip), most channels under 0.002. The remaining |AE - design| is the fit tolerance, by
construction.

## Reading the speed numbers

`compare_samples.py` prints the largest change of speed per frame. Shipped values: rotation 174
deg/s per frame (inside the 0-0.3 s whip), warper 1 X 60 px/s per frame, everything else under 11.
For comparison the original rotation changed speed by well over 1,000 deg/s per frame at frame 1.
