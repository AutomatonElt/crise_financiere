# The text chain, act 2 (2026-09-24) - typewriter, eraser bar, scan-line words

> **Rebuilt the same day as one continuous gesture** - see *Continuity rebuild* at the end; it
> supersedes the phase table, the Linear Wipe scan and the 6 px bar below.

Built by `scripts/build_typewriter_scan.jsx`, run after `build_pro_chain.jsx` on the same comp
`TEXTE - 3 lignes (pro)`, which it extends to 435 frames (15.44 s). Idempotent: a re-run removes
what it added and rebuilds.

## The structure added

```
SCAN 1 - le texte ... SCAN 9 - l'IA   one text layer per scan word, in at its sweep start, out at the next sweep end
BARRE                                shape layer: the cursor, the eraser, the underline bar, the scan line
_measure L3 typedA / typedB          prefix of floor(count) and floor(count)+1 characters (stepped count) - cursor
_measure L3 smoothA / smoothB        the same on the smooth count - centring while typing
CONTROLS > "L3 typed (chars)"        HOLD keys, one per character: frames 99 103 106 110 115 121 129 139 (gaps 4 3 4 5 6 8 10 - slows at the end)
CONTROLS > "L3 typed (smooth)"       the same arrivals, easy-eased; both go 8 -> 0 from frame 175 to 200 (out 80 % / in 20 %: slow start, fast end)
LIGNE 3 > "Typewriter - Chars - Opacity"   Opacity 0, Characters, Index units, Add; Start = stepped count, End = character count
```

| phase | frames | what moves |
|---|---|---|
| typewriter | 99-139 | `LIGNE 3` shows `count` characters; `Line - Position` keeps the typed prefix centred (smooth count), continuing the previous key word's slide; `BARRE` x follows the typed width: `x = L.position.x + scale x (linePos + (-Wfull/2 + Wtyped + 6))`, y = cap centre |
| read | 139-175 | bar blinks at 2.5 Hz (opacity expression); line position frozen at 0 |
| erase | 175-200 | counts ease 8 -> 0; the character under the bar fades (fractional Index Start), the bar slides left with it |
| move + rotate | 200-218 | bar position from the text's left edge to frame centre / underline y, rotation 0 -> 90, easy ease, simultaneous |
| expand | 218-232 | rectangle size 6x100 -> 6x560 |
| scan sweeps | 232-244 up, 262-274 down, 292-304 up, stop, 332-341, 349-357, 364-371, 377-383, 388-393, 397-401 alternating, each shorter | bar y between `yTop` (text top - 20) and `yBottom` (baseline + 14), easy ease; the texts swap along the bar |

Scan swap: every `SCAN` layer has a Linear Wipe (feather 10) and three sliders (`dir`, `nextDir`,
`eraseStart (s)`). **A Linear Wipe on a text layer runs over the whole layer buffer, which is
comp-sized and comp-aligned** (measured: 51 % at angle 0 cuts at y = 551 in a 1080 comp), so the
cut is written as a fraction of the comp height: angle 0 hides above y (`100 y / H`), angle 180
hides below (`100 (1 - y/H)`). New text is visible where the bar has passed (below it on an up
sweep, above it on a down sweep); the old text keeps the part the next sweep has not reached.
The `SCALE (adjustment)` bump skips `SCAN` layers - it is for the handoffs.

## Traps this act found

- Adding an **effect** invalidates references to its sibling effects, as adding an animator does:
  add all sliders, then fetch by name. Adding a fill to a shape group invalidates the rectangle
  fetched before it.
- **Slider Control range is +/-1,000,000**; a "never" sentinel must be smaller.
- With **Uniform Scale on, the Transform effect renames "Scale Height" to "Scale"**; find the
  property by its expression or matchName, not by display name.
- Bash-tool heredocs turn `\n` inside Python strings into real newlines; write ExtendScript strings
  with the file tools.

## Open

- The last word "l'IA" holds with its underline to the end (frame 435); nothing exits.
- The short-line rule (*one word, or one word plus a short one*) is applied by hand to line 3; the
  chain builder does not yet choose typewriter vs word-reveal from the text.
- Not rendered to a movie.

## Continuity rebuild (2026-09-24, second pass)

User: *"every animation is overlapping ... it never stops ... that's why we need null objects and
expressions"*, *"activate the motion blur on everything"*, the scan text *"out of sync"*, bar thinner.

```
BARRE (rotation, rect length)  ->  BARRE Y (null, separated Y: turning points)  ->  BARRE X (null)
BARRE X position  = cursor from prefix widths until frame 175, then
                    L.position.x + scale * u * (Wfull/2 + 6), u = slider "u (demi-largeurs)"
LIGNE 3 mask "Erase (bar)"      everything right of the bar (feather 10 x), live from frame 175
SCAN n mask "Scan (bar)"        up-sweep word: below the bar; down-sweep word: above it (feather 8 y)
```

| channel | keys [frame value outInf inInf], all speed 0 |
|---|---|
| u (x) | 175 1 85/33, 203 -1.15 33/45, 226 0 33/65 - slow start, overshoot past the left edge, land centre |
| rotation | 182 0 92/33 -> 224 90 55 - creeps from the middle of the erase |
| length | 204 cap -> 234 long (55/60); after 234 = max(560, widest live SCAN word + 80), dilated +/-0.3 s and triangle-smoothed |
| y | 190 cap line (out 80), turning points 228 B, 253 T, 283 B, 318 T (75 %: the "stop" is a slow hover), 338 B, 355 T, 369 B, 381 T, 391 B, 399 T (50 %), 434 drifts 14 px further |

Why one side per word works: sweep i runs from turn i-1 to turn i, and the next sweep comes back
the other way, so the part of word i still on the passed side is exactly the part the next sweep
has not reached. Word i lives from turn i-1 to turn i+1, when the bar is beyond the band both times.

Measured: bar never still from 175 to the end except 141-175 (reading blink); x reversal at 203,
rotation 0.02 deg at 183; length 869 px while "automatiquement" (789 px) is crossed. Still open:
the bar ends hovering above "l'IA" rather than under it; not rendered.

## Third pass (2026-09-24): text-driven typing, mechanical bar

Supersedes the key frames above; the numbers live in `CFG` / `C2` of the two builders.

- Typing has no keys: `L3 typed (chars)` / `(smooth)` are expressions over the Source Text length
  with sliders `L3 typed start (s)` (3.51), `duration (s)` (1.42), `slowdown` (1.2 = each gap 20 %
  longer). "à jamais." types 9 characters, the "." at frame 140. The blink starts at start + duration.
- Bar: same rig, keys at 85-95 % influence (hard launch, hard braking, velocity still continuous),
  erase 175-190, centre 202, rotation 179-200, length 193-210, turns 206 B 219 T 233 B 247 T
  (+ hover to 283, 10 px) 295 B 305 T 314 B 322 T 329 B 335 T, drift to 389. Comp 390 frames.
- Bump: 14 %, sign alternates per switch (`Bump alterne (1 = oui)`): 114 % at 1.8 s, 95.8 % at 3.2 s.
