---
name: liquid-text-preset
description: Build and tune a liquid-streak text animation in After Effects - a line of type that spins in as a smeared streak, snaps off, and floats with a soft glow - and the expression-driven multi-sentence text chain that runs inside it. Use when asked to "make the streak more liquid", "rebuild the text preset on nulls", "put several sentences through the preset", "make the text change seamless", "keep the remaining part centred", or when a render shows a torn streak, a spin that snaps in one frame, warpers landing together, or no motion blur. Owns the CC Scale Wipe + Turbulent Displace streak, the AfterGlow chain, the RGB time-offset trick, the null-per-channel spring rig, and the centred sentence-handover chain.
version: 2.0.0
license: MIT
---

# Liquid text preset

A line of type spins in as a **liquid streak**, the streak snaps off, and the text floats with a
soft glow. You edit the words in one comp and render another; everything in between is a rig you
should not hand-key.

Reference comps are 2008x1080 at 28.172 fps, 4.97 s. The full anatomy — every comp, layer, effect
and expression, and why each is there — is `references/template-anatomy.md`. **Read it before
touching an effect:** the glow chain is fourteen effects driven by one controller.

Two layers of the thing, usable separately:

| | what it is | built by |
|---|---|---|
| **The liquid rig** | the streak and its spring-designed motion, one null per channel | `design_keys.py` → `build_rig_jsx.py` |
| **The text chain** | several sentences handing over to each other, centred, expression-driven | `build_pro_chain.jsx` (+ act 2, + the motion rig) |

## The two "displacement warpers"

They are **CC Scale Wipe** and **CC Scale Wipe 2** on the text layer, Stretch 100, directions 90
and 270. Each stretches the text from its Center point outward, so while a Center sits inside the
text the letters smear to the frame edge; the streak **snaps off the moment the Center crosses the
text's edge**. Turbulent Displace rides on top and makes the smear wave.

- **Stretch stays at 100.** At 40 the streak tears into a gap on both sides of the text (rendered
  and looked at). The liquid feel comes from the Center path and the turbulence, never from
  Stretch.
- Center is an effect **point**, so After Effects treats it as a spatial property with a single
  speed along its path. Do not key it directly: it lives on a null (`WARP 1 centre`,
  `WARP 2 centre`) parented to the text layer, and the Center reads
  `thisComp.layer("WARP 1 centre").position`. A null parented to the layer has its position in the
  layer's own pixel space, which is exactly the space the effect point uses.

## The rig

One channel per null, child to parent, all nulls anchor `[0,0]`, scale 100, rotation 0, and every
position null with **dimensions separated** so each key is a plain 1D property:

```
text layer -> TXT drift -> TXT scale -> TXT rot -> TXT pos Y -> TXT pos X
                                                               (top-level, at comp centre)
WARP 1 centre, WARP 2 centre -> text layer      (layer-space nulls for the effect points)
```

The text layer keeps its effects and nothing else: position `[0,0]` under the drift null, scale
100, rotation 0, no keys, no expressions. `TXT drift` carries the continuous wander that used to
sit on the layer, as `wiggle(0.5, 10) + wiggle(1.3, 5) - value` on position and `wiggle(0.6, 0.7)`
on rotation. The warp nulls sway with `wiggle(0.8, 6)` faded to zero between 1.8 and 2.6 s, so the
sway is gone before the text is read.

Turbulent Displace: Displacement **Turbulent Smoother** (dropdown value 4), Evolution `time * 300`
so it never freezes, Amount and Size keyed. The render comp's **motion blur switch must be on**
(`motionBlurAdaptiveSampleLimit` 32) — a nested comp having blur does nothing for the comp it is
nested in, which is how the original rendered with none.

## How the keys are designed

Do not hand-key this preset. Every channel is a **spring step response** designed in
`scripts/design_keys.py`, fitted greedily to cubic Hermite knots, and written as AE bezier keys
with 33.333 % influence and speed = slope on both sides. That pairing is exactly a Hermite spline,
so the closed loop is tight: after a build, AE evaluated every channel within **0.011 units** of
the designed curve. The maths and the parameter table are in `references/spring-curves.md`.

```bash
python scripts/design_keys.py <scratch>                       # keys.json + landing report
python scripts/build_rig_jsx.py <scratch>/keys.json <scratch>/build.jsx
# run build.jsx in After Effects - it refuses to run twice (see Traps)
# then run sample_rig.jsx (writes ae_samples.tsv to the temp folder) and:
python scripts/compare_samples.py <scratch>                   # PASS when worst |AE - fit| < 0.05
```

`scripts/keys.example.json` is a shipped key set (66 keys over 10 channels).

Tuning is the `channels` table in `design_keys.py`: `wn` sets how fast a channel lands, `zeta`
whether it overshoots (1.0 none, 0.85 barely, 0.7 visibly liquid), `t0` delays its start.
**Stagger the landings** — the report prints each channel's landing time, and nothing should land
together. A working set: warper 1 at 1.5 s, warper 2 at 1.7 s, turbulence gone by 3.0 s, scale
3.5 s, rotation 3.4 s, drift X 4.0 s, drift Y 3.3 s. The last key of every channel sits past the
comp end, so nothing stops on the last frame.

What the spring rebuild changed, measured against the hand-keyed original:

| | original | spring rig |
|---|---|---|
| rotation speed in frame 1 | ~1,900 deg/s | 359 deg/s peak, soft 4-frame start |
| every channel starts | hard, at frame 0, together | soft, staggered by `t0` and `wn` |
| warpers + turbulence land | all at 2.378 s, welded | 1.5 / 1.7 / 3.0 s |
| turbulence after landing | frozen (Evolution keyed to a stop) | flows, `time * 300` |
| render comp motion blur | off | on, adaptive limit 32 |

## The text chain

When the preset carries **several sentences**, build them the way a motion designer does: one text
layer per sentence (`LIGNE 1..N`, the sentence is only its Source Text), three **named** animators
per line (Start - Words - Pos+Opacity / Line - Position / End - Cut to key word), two or three
easy-eased keys per property, a hidden `CONTROLS` null with a slider per line for the key word and
for how many leading words are present from frame one, hidden `_measure` text layers whose
`sourceRectAtTime()` feeds every width into expressions, and a `SCALE (adjustment)` layer on top
whose bump is steepest exactly at each switch.

**Never a keyframe per frame, never a scale change to fix a handoff, never a stop at a switch.**
The key word's slide to centre is one easy-eased move that straddles the switch: the outgoing word
carries its first half and the incoming word the second. `scripts/build_pro_chain.jsx` builds the
whole comp from a `CFG` table, so changing a sentence or a slider afterwards needs no rebuild.
Full structure, timings and selector detail: `references/text-chain.md`.

Run the builders **as files**, not as a string:

```javascript
// from the AE scripting console, or a bridge's execute-script
$.evalFile(new File("<path>/scripts/build_pro_chain.jsx"));
```

or `AfterFX.exe -r "<path>/scripts/build_pro_chain.jsx"` from a shell. Each builder finds its
bundled helpers through `$.fileName`, which is empty when a script is eval'd from a string — so
`new Function(src)` will fail with "preserve_manual.jsx not found beside this script".

**Act 2** (`build_typewriter_scan.jsx`, run after the chain on the same comp) adds the typewriter
arrival of a short line with a cursor, the eraser bar, the underline bar and the scan-line word
swaps, then the ball-jump / hinged-fall / sweep choreography and a seven-segment counter. It
re-times itself from the previous line's out point. See `references/text-chain-act2.md`.

**The motion rig** (`build_motion_rig.jsx`, run last) adds the `Shake -> Momentum -> Echelle` null
chain with the text layers parented under it, each stage behind its own on/off checkbox. The
principle: a slide's velocity momentum continues slightly after the slide, a scale drift leans
toward the next bump before it happens, and nothing is ever completely static.

Timing comes from the text, not from typed numbers: a line's hold is
`characters / 18 cps`, at least reveal + glide + 4 frames. Typing arrival for character *k* is
`start + D (r^k - 1)/(r^(n-1) - 1)` with *n* = text length, the three parameters on sliders.

## Traps

- **`setParentWithJump()`, then set values.** A plain `.parent =` rewrites the child's local values
  to hold its screen position and silently destroys what is about to be written.
- **Effect keys do not show in most MCP/bridge layer inspectors.** Dump them with a script that
  walks `layer.effect(...)` properties.
- **A comp's motion blur switch does nothing for the comp it is nested in.** The render comp's own
  switch and the Render Settings template decide.
- **The rig build script refuses to run twice** by checking for its backup comp. Delete that comp
  to rebuild from a fresh original, or reopen the original project.
- **Save-as, never save.** The original preset must survive; a rebuild is a new file.
- **Range selectors have two triplets named Start/End/Offset.** The keyed ones are
  `ADBE Text Percent *`; the `Index` triplet with the same display names is unkeyed and shadows
  them in a name-keyed dump — which is how a first dump reported "no keys" on a chain that
  visibly animates. **Dump by matchName.**
- **A `sourceText` referenced from another layer's expression comes back WITHOUT that layer's own
  expression applied** (measured: a line evaluated at size 160, its `_measure` helper read 120).
  Every text layer takes its character style from the master layer directly, never through a line.
- **A new text layer inherits the Character panel, including All Caps**, and a Source Text
  expression's `style.setText()` does not override that layer-level caps. The `_measure` helpers
  then measure capitals (817 px for a 586 px line). Set
  `td.fontCapsOption = FontCapsOption.FONT_NORMAL_CAPS` in every builder's style function
  (`allCaps` is read-only from ExtendScript), and have the helper expressions do
  `sty.isAllCaps ? out.toUpperCase() : out` so a line capitalised by hand is still measured live.
- **Re-map the project before removing anything.** Someone editing between sessions moves effects
  around: a glow chain that was on the text layer turns up on an adjustment layer, and new
  distortion layers appear.
- **A black solid under the text kills an alpha-based glow** (alpha becomes uniform). Probe the
  glow's input by other means.
- **A bridge does not roll back a script that throws half-way.** Re-read the state before
  re-running; the second half of a failed script is what is left to do, not the whole script.
- **When a bridge panel stops answering** (AE alive, idle, no dialog), the running instance still
  takes scripts from the command line: `AfterFX.exe -r script.jsx` (no `-m`), the script writing
  its JSON result to a file the caller polls. Wrap everything in try/catch and write the error
  too; find layers by name prefix when the name carries accents.
- **`applyTemplate()` on a render-queue item RESETS its time span.** Set `timeSpanStart` /
  `timeSpanDuration` **after** the template, read `timeSpanDuration` back, and remove the item if
  it is not one frame. Getting this backwards once queued eight full renders that nothing could
  stop: Escape is ignored while a script drives `renderQueue.render()` and the output file is
  locked.
- **Single-frame render timings are noise** (6 s to 45 s for the same frame in a row). Compare
  controlled pairs on the main comp, purging before each (`app.purge(PurgeTarget.ALL_CACHES)`).
- **`saveFrameToPng` returns before the files exist.** A 364-frame loop came back in 15 s with 82
  files on disk and the rest arriving for minutes. Count the files before reading them. The PNGs
  are at the viewer's resolution and transparent.
- **Text-animator scripting:** `addProperty("ADBE Text Animator")` invalidates property objects
  already fetched from that layer's other animators — re-fetch by name. `ADBE Text Position 3D`
  takes a one-element `KeyframeEase` array. Effects invalidate sibling references the same way.
- **Every builder must deselect all layers at its end.** A null with anchor = position = comp
  centre draws its 100x100 box at the comp's `[0,0]` in the viewer *while selected*, and a build
  leaves its last layer selected — which looks exactly like a render artefact in the corner.
- **A render comp with three time-offset copies (the RGB split) turns any one-frame glitch into a
  coloured full-frame flash.** Find the glitch in the source comp with a per-frame mean and a
  one-frame spike test against both neighbours; do not debug it in the render comp.
- **Never let a precomp's expressions reach back into the comp that contains it**
  (`comp("...")...`). Nested, such a precomp rendered a different layer's text on random single
  frames. Every expression stays in the comp that renders it.
- **Effects with a point parameter on a bare shape or text layer:** the effect buffer is the
  content bounds grown by what the chain needs (about 90 px with glows), so a point computed from
  `sourceRectAtTime` lands 90 px off. Give the layer a comp-sized black rectangle under its
  content and an effect point becomes a plain comp coordinate.
- **`linear(value, 1, 0, a, b)` returns the wrong end.** An End ramp running 1 → 0 must map
  `linear(value, 0, 1, se, s.length)`; mapped the other way it hides the tail of every line.
- **Glow Threshold is 0-255 in scripting**, and `CC Radial Fast Blur` streams rays **away** from
  its centre.
- **A slider's range is ±1e6**, and Uniform Scale renames Scale Height to Scale.

## Rebuilds keep what was changed by hand

A rebuild script must read existing manual changes before re-applying itself — changes made by
hand between passes are kept, not overridden. `scripts/preserve_manual.jsx` does a three-way merge
per layer name, and every builder loads it (always re-`evalFile`d; a cached `$.global` copy is
stale after an edit):

1. **snapshot** before touching anything: effect parameters without expression or keys, a text
   layer's character style and text, a shape layer's first fill colour, enabled / label / blend
   mode / opacity.
2. **built** = what the previous build wrote, kept as JSON in each layer's comment (`PM1:...`). A
   value that differs from it was changed by hand; a value equal to it follows the new config.
3. **restore** re-applies the hand-changed values after the rebuild. What could not be applied
   (the chain builder recreates the whole comp before the later builders rebuild their layers)
   waits in `$.global.PM_PENDING` for the next builder of the session. A retyped word replaces the
   config word and renames its layer. A digital counter's text is never treated as manual.
4. **record** the values as this build's record.

Keyframes and expressions are the builders' own and are **not** preserved — change those in the
config.

Two traps met building it: the chain builder deletes the comp, so later builders have no layer to
snapshot (hence the pending hand-on); and a library loaded only "if absent" keeps running its old
code (hence the unconditional reload). `text.sourceText.value` on a layer carrying the master
expression returns the *evaluated* style, so a master change shows up as a "manual" change on
every line — harmless, it only refreshes their own-style fallback.

## Keeping render time and script time down

Measured on one project: the three builders went 101 s → 30 s, and a typing frame with motion blur
42 s → 3.4 s. Where the time went, and the rules that came out of it:

1. **A per-frame integration belongs in the builder, not in an expression.** A pendulum + spring
   drive re-ran up to 640 steps on *every* evaluation, and every mask, light and matte expression
   that asked where the bar was evaluated it again — 16 times per frame under motion blur.
   `bakeSim()` integrates once and writes one key per frame on two sliders; the expressions read
   the sliders. Baked against live: 2.7 px and 0.63 deg apart at worst.
2. **Measure once what does not change per frame.** A text layer whose Source Text expression
   builds a style (`sourceText.style`, `setText`) is laid out again at *every* evaluation. Four
   such `_measure` helpers under motion blur were the entire cost of the typing phase. Replace
   them with a width table written at build time — accepting that retyping that line then needs a
   rebuild to re-measure.
3. **No read-back inside the builders.** Per-frame `valueAtTime` sweeps cost more than the builds
   themselves. Run them only behind a flag (`$.global.RUSH_READBACK = true`); verification is the
   caller's job, in its own script.
4. **A wide glow is usually the most expensive effect in a light stack.** Reducing a glow radius
   from 120 to 50 and ray amount from 95 to 55 is where the light's cost is.
5. **Measure speed per frame before calling a timing done.** `measure_text_speed.jsx` prints the
   text's on-screen speed per frame. A pause is a speed cliff you can see in numbers: a centring
   that braked 36 → 6 → 0.75 px/frame in two frames reads as a dead stop; retuned to 44 → 1
   px/frame over 15 frames it reads as continuous.

## Do not propose again

- **Animating Stretch for a liquid pull.** Below 100 the streak tears.
- **Keying CC Scale Wipe Center directly with temporal ease.** It is spatial; per-axis Hermite
  timing is impossible on it. The null is the only clean route.
- **A single spring for the rotation.** A 5 s swing kills the whip; a 0.5 s whip kills the settle.
  Use a fast critically-damped 120 deg plus a slow underdamped 45 deg.
- **Per-frame position keys to keep a line centred, and a scale ramp to hide a handoff.** Centre
  with the position animator's two keys; hand over by cutting to the key word with the range
  selector.
- **A bar or object that does one move after the other** (slide, stop, turn, stop, grow, sweep,
  stop). Every channel on its own null or property, key times overlapping, turning points only.
- **A Linear Wipe for a scan cut.** Its percentage lives in a comp-sized buffer and reads as out of
  sync. Cut with a mask whose path expression reads the object's `toComp([0,0])`.
- **A text change at mid-slide with the scale bump peaking exactly at the change.** The change
  sits near the END of the slide and the bump peaks ~0.1 s before it.
- **Timing keyed per character, or sliders tied to a word count.** Typing, key word, widths and bar
  length are all computed from Source Text; a key-word slider at 0 means the last word.
- **A continuous motion on an adjustment layer, or a static hold between handoffs.** Continuous
  motion belongs on null objects, so several channels can move at once.
- **Cutting a key word to a whole word when the next line opens with one letter.** Cut the key word
  down to that letter (accents ignored).
- **Motion blur on a light and its matte.** A blurred glow shows none, and it costs 16 sub-frame
  renders of every blur and glow in the stack.
- **Reusing another project's text-animation slots for this preset.** Their slides and parked tails
  are that project's grammar, and cancelling them costs more than building the lines clean.

## Files

| file | what |
|---|---|
| `references/template-anatomy.md` | every comp, layer, the fourteen-effect glow chain, the RGB time-offset trick |
| `references/spring-curves.md` | the spring maths, parameter table, closed-loop numbers |
| `references/text-chain.md` | the sentence chain: structure, centring, selectors |
| `references/text-chain-act2.md` | typewriter, cursor, eraser bar, scan-line swaps |
| `scripts/design_keys.py` → `build_rig_jsx.py` | the spring rig pipeline |
| `scripts/sample_rig.jsx` → `compare_samples.py` | the closed loop that proves AE matches the design |
| `scripts/keys.example.json` | a shipped key set |
| `scripts/build_pro_chain.jsx` | the sentence chain, from its `CFG` table |
| `scripts/build_typewriter_scan.jsx` | act 2 (needs `physics_follow.jsx`, bundled) |
| `scripts/build_motion_rig.jsx` | the MOTION null chain (needs `apply_natural_shake.jsx`, bundled) |
| `scripts/preserve_manual.jsx` | the manual-change merge every builder runs |
| `scripts/measure_text_speed.jsx` | on-screen speed per frame |

The builders resolve their bundled helpers next to themselves, so keep `scripts/` together.
A third act (an outro with software logos crossed out and ticked) is **not** included: it depended
on third-party logo images that are not redistributable here.

## Fonts

The example look uses Old English Text MT for the display line and DSEG7/DSEG14 Classic for the
seven-segment counter. Neither is bundled — install your own and set it in the builder config.
