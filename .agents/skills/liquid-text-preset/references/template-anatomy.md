# Template anatomy - "the liquid text preset"

Measured through the MCP bridge on 2026-09-24 (`inspect-comp`, `inspect-layer`, and a script that
walked every effect property for keys and expressions). All comps: 2008 x 1080, 28.1719970703125
fps, black background.

## Comps

| comp | duration | layers | role |
|---|---|---|---|
| `1. MODIFIER TEXTE` | 4.97 s | 1 text layer `modifier texte` | **the only comp you edit** - OldEnglishTextMT 79 px, fill gold `[1, 0.729, 0]`, centred, collapse transformations on |
| `créer un texte Comp 1` | 4.97 s | `1. MODIFIER TEXTE` nested, no effects | isolation precomp (folder `3. NE PAS TOUCHER`) |
| `créer un texte Comp 2` | 4.97 s | the animated layer (14 effects) + since v2 the 7 rig nulls | **all the animation lives here** (folder `3. NE PAS TOUCHER`) |
| `2. RENDU ICI` | 5.00 s | `créer un texte Comp 2` three times | the render comp - chromatic split, see below |
| `créer un texte Comp 2 (backup avant nulls)` | 4.97 s | v2 only | the untouched pre-rig comp, for A/B |

## The render comp's chromatic trick

`2. RENDU ICI` stacks the animated comp three times, each with **Shift Channels** keeping one
colour channel and blanking the others, and offsets the two upper copies in **time by one and two
frames** (start 0.0355 s and 0.0710 s), blend mode ADD:

| layer | starts | keeps |
|---|---|---|
| 1 (top) | +2 frames | green |
| 2 | +1 frame | red + blue |
| 3 | 0 | blue |

Because the copies are offset in time and not in space, the fringing only appears where the picture
moves - fast in the whip, gone once the text settles. That is why the stills at 0.1-1.3 s show red
and green streaks and the settled text is clean gold.

Its motion blur switch was **off** in the original while the nested comp's was on. Nested switches
do not propagate; the render had no blur. v2 turns it on with adaptive sample limit 32 (the
default 128 has stalled heavy glow chains before - see ae-camera-movement).

## The animated layer's effect stack (in `créer un texte Comp 2`)

| # | effect | job | keyed / expressed |
|---|---|---|---|
| 1 | CC Scale Wipe | warper 1: Stretch 100, Direction 90 | Center - original 2 keys `[927,540] -> [1206,509]` at 0 / 2.378 s; v2 `thisComp.layer("WARP 1 centre").position` |
| 2 | CC Scale Wipe 2 | warper 2: Stretch 100, Direction 270 | Center - original `[946,540] -> [793,508]`; v2 `thisComp.layer("WARP 2 centre").position` |
| 3 | Turbulent Displace | the wave on the streak; Size 65, Complexity 1, Pinning 3 | Amount 69 -> 0 (original 2 keys to 2.378 s), Evolution (original LINEAR 0 -> 733 then frozen; v2 `time * 300`); v2 Displacement = Turbulent Smoother, Size keyed 65 -> 120 |
| 4 | AfterGlow Controls (pseudo effect) | one controller for the whole glow chain | not keyed |
| 5 | slider `↓↓-----EFFECTS-----↓↓` | disabled divider | - |
| 6 | Transform (Streak Angle) | rotates by -Streak Angle so the streak glow is directional | expressions from the controller |
| 7 | Glow (Streak) | the directional streak glow | threshold/radius/intensity/colour from the controller; opacity 0 in this preset (streak off) |
| 8 | Transform (Streak Restore Angle) | rotates back | expression |
| 9-13 | Glow 1 .. Glow 5 | five stacked glows, each radius x2.5 and intensity x1.2 of the previous, colour lerped from inner white to outer blue | every property is an expression off the previous glow and the controller |
| 14 | Glow 6 (Large Glow) | the wide halo, radius 1000, colour `[0.4,0.4,1]` | expressions |

Transform (Streak Angle) anchors at `[960,540]` - a 1920-wide assumption in a 2008-wide comp. It is
harmless while the streak glow's opacity is 0; if the streak glow is ever switched on, re-centre it
at `[1004,540]`.

## The layer's own animation, original versus v2

| property | original | v2 |
|---|---|---|
| Position | `wiggle(1,15)`, no keys | `[0,0]`, no expression; drift lives on `TXT drift` |
| Scale | 150 -> 100, 2 keys 0 / 3.16 s, out influence 1.77 %, in influence 100 % | 100; keyed on `TXT scale` |
| Rotation | -165 -> 0, 2 keys 0 / 4.93 s, out speed 13,784 deg/s at 0.2 % influence, in 98.6 % + `wiggle(1,0.8)` | 0; keyed on `TXT rot`, wiggle on `TXT drift` |

The original's curve shape, everywhere, was the same: **zero-influence burst out, 100 %-influence
glide in**. That reads as an exponential decay that starts in one frame. `spring-curves.md` shows
how the rotation went from -165 to -98 in a single frame.

## The nulls added in v2

| null | label | keyed | expression |
|---|---|---|---|
| `TXT pos X` | 9 | X Position (separated), 1004 + (-30 -> 0) | - |
| `TXT pos Y` | 9 | Y Position (separated), 45 -> 0 | - |
| `TXT rot` | 10 | Rotation, -165 -> 0 (+0.6 overshoot) | - |
| `TXT scale` | 10 | Scale, 150 -> 100 (98.6 dip at 2.5 s) | - |
| `TXT drift` | 11 | none | position `wiggle(0.5, 10) + wiggle(1.3, 5) - value`, rotation `wiggle(0.6, 0.7)` |
| `WARP 1 centre` | 14 | X, Y (separated), 927/540 -> 1206/509 | both axes: `var a = linear(time, 1.8, 2.6, 1, 0); value + (wiggle(0.8, 6) - value) * a` |
| `WARP 2 centre` | 14 | X, Y (separated), 946/540 -> 793/508 | same |

Position nulls key **only their own axis**; the other axis holds 0 (540 for `TXT pos X`'s Y, since
it is the top of the chain). Rotation and scale nulls hold position `[0,0]`.
