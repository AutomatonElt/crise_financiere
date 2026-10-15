# The text chain variant (v3, 2026-09-24) - the pro, expression-driven structure

Three sentences handing over to each other inside the preset's look. The example copy used
throughout is **Le montage vidéo / vient de changer / à jamais**; the structure is independent of
the words. The chain is comp `TEXTE - 3 lignes (pro)`, 2008x1080 at the preset's 28.172 fps,
131 frames (4.65 s), built from scratch by `scripts/build_pro_chain.jsx`.

## The structure (top to bottom in the comp)

```
SCALE (adjustment)      adjustment layer, Transform effect; scale bump per switch, expression-driven
LIGNE 3, LIGNE 2, LIGNE 1   one text layer per sentence - the sentence is ONLY its Source Text
CONTROLS                hidden null: sliders "L1 mot cle (1-3)", "L1 mots presents", "L2 ...", "L3 mots presents"
_measure L1 full / present / prefix+key / key,  _measure L2 ...,  _measure L3 full / present
                        hidden guide text layers (shy); Source Text = expression off the line + sliders;
                        their sourceRectAtTime() is where every width comes from
```

Every line: OldEnglishTextMT 120, gold `[1, 0.729, 0]`, centred paragraph, one shared baseline
(y = 579.4). Layer scale keys and animator keys carry **ramps**; expressions turn them into motion
from the measured widths, so retyping a sentence or moving a slider changes the animation with no
rebuild.

| what | keys (easy ease, 33.3 %) | expression |
|---|---|---|
| `Start - Words - Pos+Opacity` (Opacity 0, Position +50 x, by words, Add) | Offset 0 -> 100 over 14 frames after the slide lands | Start = present words / word count x 100, so the leading chunk is never hidden |
| `End - Cut to key word` (Opacity 0, by words, **Subtract, Index units**) | Start 0 -> 1 and End 1 -> 0 from switch-14 to switch-3 | `Start = linear(value, 0, 1, 0, k)`, `End = linear(value, 1, 0, n, k+1)`; k = slider - 1, n = word count |
| `Line - Position` | phase ramp: 0 -> 1 from switch-7 to switch+7 (arriving), -> 2 at reveal end (line centred), 2 -> 3 from the next switch-7 to switch+7 (leaving) | `v<=1: x = kcPrev(1-v) - fc` (continues the previous key word's slide), `v<=2: x = -fc(2-v)`, `else x = -kc(v-2)`; fc = centre of the present chunk, kc = centre of the key word, from the helpers |
| layer Transform Scale | ramp 0 -> 100 (arriving) over the same switch window, 100 -> 200 (leaving) | arriving: `100/s -> 100`, s = own present chunk / previous key word; leaving: `100 -> 100 s`, s = next present chunk / own key word. At the switch both words have the same width |
| `End - Words - Opacity` (last line only) | Offset -100 -> 0 over the last 10 frames | - |
| `SCALE (adjustment)` > Transform > Scale | none | for every text layer with inPoint > 0: `ease(time, ts-w, ts+w, 0, 1)` up, `ease(time, ts+w, ts+w+rel, 1, 0)` down, `A x min(up, down)` summed; sliders Bump amount 12 %, width 0.25 s, relax 0.6 s. Steepest exactly at the switch |

Measured after the build (`report`): switch 1 - outgoing word at +148 px, incoming at +146 px,
widths 224 / 224 px; switch 2 - +97 / +96 px, 368 / 368 px; bump 105.5 % at the switch, 112 %
peak 0.25 s later. Key counts: position 4 / 5 / 3, scale 3 / 4 / 2, no key anywhere per frame.

Timing (frames): switches at 54 and 99; cut 40-51 and 85-96; slide 47-61 and 92-106; reveal of
the rest 61-75 and 106-120; line 1 reveals 0-14; fade 119-129. All of it is `CFG` at the top of the
script (`h`, `cutLead`, `revealLen`, `fadeLen`, `bump`).

## Rebuilding for other sentences

Change texts and sliders in After Effects - nothing else is needed. Rebuild only to change the
number of lines or the timings: edit `CFG.lines` / `CFG.h` etc. and run

```javascript
var f=new File("<job>/build_pro_chain.jsx");f.encoding="UTF-8";f.open("r");var src=f.read();f.close();
return (new Function(src))();
```

It removes a previous `TEXTE - 3 lignes (pro)`, rebuilds, drops it into `1. MODIFIER TEXTE`, trims
every preset comp to the chain, and returns expression errors (must be empty), the helper widths
(must be non-zero) and the positions and scales on both sides of each switch.

## What the two tutorials contributed

- *Start Here*: named animators, Offset 0 -> 100 by words with F9 then shaped in the graph editor,
  a Subtract-mode opacity animator to hide, a whole-line Position animator with two keys to keep the
  text centred, one layer per sentence, the first words present directly and only the rest
  animated, and a parent-level scale bump that hides the switch.
- *The Right Way*: Position and Opacity animated together per word on the start animator (+50 x);
  the special word chosen by a slider on a null through Index-unit expressions so editing the text
  never touches keys; Source Text of helper layers linked to the master (`sourceText.style.setText`
  keeps the style); retiming with a held mid keyframe; emphasis by skew / font morph / gradient.

## Where the rest of the preset stands

| comp | state |
|---|---|
| `1. MODIFIER TEXTE` | only `TEXTE - 3 lignes (pro)` |
| `créer un texte Comp 1` | `Glow` adjustment layer, OFF |
| `créer un texte Comp 2` | `grain1` OFF; the v2 nulls with no keys or expressions; the text layer with no effects |
| `2. RENDU ICI` | the three Shift Channels copies (RGB one and two frames late) on; `grain2` and its `Glow` copy off |

Any imported third-party text-animation template and its leftover solids are removed.

## Open

- Glow and grain come back as you decide; the light-grey wash seen with them on during a
  handoff was not diagnosed to the end (the glow's input was clean; suspect the Fast Grain layer on
  semi-transparent halo pixels in Comp 2 - try `grain2` in the render comp instead).
- A line with a key word that is not the last word gets both Start and End animated by the cut;
  built, not yet used on a real sentence.
- Nothing has been rendered to a movie.
