// Second act of the text chain - run AFTER build_pro_chain.jsx on the same comp.
//   LIGNE 3 arrives letter by letter (typewriter, stepped, slowing at the end) with a cursor bar.
//   Then ONE continuous gesture of the bar, every channel overlapping the next (nothing waits for
//   anything, the bar never stops as a whole): it sweeps left erasing the line (a mask cut at the bar),
//   already starting to rotate; reverses to centre while dropping to the underline, finishing its
//   rotation and growing into a long bar; then oscillates up and down as a scan line. Every sweep
//   swaps the words exactly along the bar: each SCAN word is masked to the side the bar has passed.
//
// Rig (null per channel, own key times each):
//   BARRE  (rotation, rectangle length)  ->  BARRE Y (null: height)  ->  BARRE X (null: x)
// X is an expression: the typing cursor from measured prefix widths, then a slider "u" in half-widths
// of the line (1 = after the last letter, -1 = left edge, 0 = centre), so retyping the line keeps it right.
// All keys are speed-0 turning points or starts/landings with shaped influence: velocity is continuous.
var C2 = {
  comp: "TEXTE - 3 lignes (pro)", fps: 28.1719970703125, totalFrames: 575,
  line: "LIGNE 3", switchF: 99,
  // typing is computed from the TEXT: every character of LIGNE 3 arrives between start and start + duration,
  // each gap `slowdown` times longer than the one before (slows strongly at the end) - add a "." and it types it
  typing: { startF: 99, durF: 40, slowdown: 1.2 },
  readHoldEnd: 175,                                  // bar leaves the cursor role here (blinks from the last letter to here)
  // sweepH: the cursor's height from the mirror on ("the vertical bar after 'à l'écran' ... a bit taller", 2026-09-25 f)
  bar: { thick: 1.5, capH: 100, sweepH: 150, len: 760, gap: 6, fill: [1, 0.72940999269485, 0, 1], blinkHz: 1.2, growIn: 10 },   // growIn: frames the cursor takes to grow from 0
  // frames below are written for a line 3 that starts at frame 99 and a 36-frame read; the block after the config
  // re-times them: everything moves with the real switch, and everything after the typing moves with the READ
  // time (characters / readCps, at least minRead) - a longer line is read longer
  readCps: 18, minRead: 16,
  endShrink: [396, 414],                             // after the last pass the bar closes (shrinks to 0) while it slides out
  // the tutorial's light (thick copy of the line, rays 95, glow 0.6 r0, glow 0.8 threshold a little higher, second rays
  // in Brightest offset along the beam, wide glow 0.1), on ONE shape layer over a black comp-sized rectangle (full-frame
  // buffer, no precomp, no motion blur), made subtler and warmer (yellow to red) with a faint flicker - see BARRE LUMIERE
  // (2026-09-25: on the shape layer the same stack came out ~3 x dimmer than on the precomp's adjustment layer - measured
  // 0.77 vs ~2.0 mean at frame 179 over black; glow2 0.7 + opacity 100 gave 3.73, opacity 55 gave 1.14 - not linear, the
  // glows threshold on the result - so opacity 75 for the approved level)
  // (2026-09-25 d: "reduce fall off for the light, make it lighting less far" - rays 95 -> 55, the wide glow 120 -> 50 px)
  light: { amount: 55, glow1: 0.4, glow2: 0.7, glow2Threshold: 178, glowWide: 0.08, glowWideRadius: 50, spread: 90,
           // normalMix: weight of the bar's perpendicular in the ray direction (2026-09-25 k)
           pull: 4, lead: 700, minOff: 200, tilt: 0.5, normalMix: 0.65, thick: 7, opacity: 75, fadeDist: 90, growIn: 0.45,
           // the matte at the bar (2026-09-26): endPad px past each end, the lit zone widening `fan` px per px of depth,
           // its two ends faded by a directional blur of endSoft px along the bar
           endPad: 30, fan: 0.35, endSoft: 90,
           // colour: yellow at the bar (bright = A) running to red at the tips (dim = B)
           fill: [1, 0.6, 0.05, 1], colorA: [1, 0.78, 0.12], colorB: [1, 0.22, 0.04],
           flicker: { hz: 3, pct: 5 } },
  yTopPad: 20, yBottomPad: 14, over: 40,             // text band = [text top - 20, baseline + 14]; turning points 40 px beyond it
  // [frame, value, influence out, influence in] - all speed 0
  // mechanical feel: velocity stays continuous but every key brakes and launches hard (influence 85-95 %)
  // The cursor -> underline transition is ONE gesture (tutorial "Animate Light to Control Your Viewer": a few keys,
  // easy ease, the curves squeezed so the move is fast in the middle and soft at both ends): the moment the erase
  // reverses (190), the x return, the drop, the rotation and the growth ALL start together, and each carries its
  // momentum a little past its target before settling (overshoot keys)
  xKeys:   [[175, 1, 92, 33], [190, -1.15, 80, 80], [210, 0.06, 33, 70], [217, 0, 33, 75]],   // erase left (slow start, accelerating), reverse, through the centre, settle
  // COUNTER-clockwise (2026-09-25: "we want counter clockwise ... so that the bar can actually sweep like a scan bar to
  // make text appear"): the top of the cursor swings LEFT and down, the bottom right and up, and the bar lies horizontal
  // at -90 (the hinge phase then runs -90 -> 0 = hanging, still a clockwise fall of the right end)
  rotKeys: [[189, 0, 80, 33], [209, -95, 33, 60], [217, -90, 33, 80]],                        // 0 -> past -90 -> -90
  lenKeys: [[189, 0, 80, 33], [214, 1, 33, 85]],                                              // 0 = cursor height, 1 = long bar
  yLeave: [189, 80],                                                                          // Y leaves the cap line with the rest; lands on the first turning point
  // ACT 2b (brief of 2026-09-25): once the underline has arrived the bar JUMPS like a thrown ball - fast launch,
  // decelerating, a hang at the top ("inertia"), accelerating back down, a hard bounce and the same jump again:
  // three vertical sweeps (le texte / que tu vois / à l'écran), the third one read at the top. Then the bar's LEFT
  // end becomes a hinge: the right end falls under gravity (a rod pendulum, simulated in an expression), overshoots
  // a little and settles vertical; the bar retracts to a cursor while the pivot drops to the cap line; and it sweeps
  // left-right across the remaining words, fast and mechanical as before.
  // jumps: [frame, "bottom"|"top", ...]: a bottom key is a launch/bounce (first one: launch influence % from rest),
  // a top key is an apex (speed 0; optional hold frames + creeping drift px = the reading pause); rises and falls
  // between them are true parabolas (launch/landing speed = 2 h / T, influence 33.3)
  // (brief of 2026-09-25 b, replacing the three jumps) - the cursor DIPS below the text at the left edge, then rises through
  // it to the TOP while it turns horizontal, revealing "le texte" on the way (the word lives below the bar); from the top
  // it plunges like a spring - slow start, peak speed at the lowest point (`low` px under the band), a random jolt of
  // rotation at the impact - and comes back up slowly ("que tu vois" above it on the way down, "à l'écran" below it on
  // the way up); at the top it never stops: it keeps rising `pauseDrift` px at a constant crawl until the hinge, with a
  // slight rotation wobble (the bar is never static, it continues the previous motion slowly)
  // (2026-09-25 f, replacing the plunge / slow rise / hinge fall) "we're gonna mirror the first animation ... from
  // horizontal to vertical ... in the opposite animation ... to the RIGHT of the text": from mirror.startF the gesture
  // 189 -> 217 runs BACKWARDS and mirrored left-right - the bar dips below the text while it turns on to vertical
  // (continuing counter-clockwise, -90 -> -180) and ends as a cursor right of the text; "le texte" goes with it, "que tu
  // vois" appears above / left of it. Then the sweeps start from the RIGHT (the first one reveals "à l'écran").
  vert: { dip: 196, top1: 217, pauseDrift: 8, wobble: 1.5 },
  mirror: { startF: 231 },                           // the reversed gesture takes 217 - 189 frames from here
  xPauseDrift: 0.03,                                 // half-widths the bar keeps sliding (leftward, its previous direction) during the read of "le texte"
  // the fall starts at the end of the hold; g in px/s^2 and a viscous damping (1/s) on a rod pivoted at its end;
  // shrink = frames over which the bar retracts to the cursor (pivot end fixed) and the pivot drops to the cap line
  // (2026-09-25: "as it falls down, it starts slowly and accelerates ... as bar falls down, it starts to shrink
  // simultaneously") - light damping while it falls (from rest, accelerating all the way to vertical), heavy damping
  // once it has crossed vertical (one small swing, then still); the retract starts with the release
  // restitution = the hinge's stop at vertical: the angular speed is cut to this fraction at the first crossing (the
  // energy a real pin sheds), then dampingSettle gives one small swing (~16 deg, ~5, ~1.5) - measured: without the
  // stop the bar overshot 29 deg and crept back for 40 frames
  // (2026-09-25 b: "more dramatized, more extreme so we can clearly see it" - g up, the stop keeps 60 % of the speed so the
  // swing back is wide and repeats, the bar stays full length through the fall and shrinks after the first swing)
  // (the hinge fall was removed 2026-09-25 f: the mirror already leaves a cursor beside the text)
  // horizontal turning points for the cursor: [frame, "left"|"right", hold frames]; sweep i runs from the end of
  // sweeps[i]'s hold to sweeps[i+1]; the first point is where the mirror left the cursor (right of the text); during a
  // hold the target creeps on outward (never static); after the last one the target keeps creeping too.
  // "que tu vois" is read to 276, the swipe to 290 reveals "à l'écran", read to 333; "l'IA..." is the last pass
  // 4th element (optional): HUG - instead of the bar's far end, the cursor stops this many px outside the edge of the word
  // this sweep reveals, measured on that word (2026-09-25 m: "after 0:00:09:07 the bar goes too far from text. keep it
  // closer ... way closer, with rays almost touching text, only for 'à l'écran'")
  // (2026-09-25 n: "bar too far for 'été' as well") - "été" hugs too
  // 5th element (optional): CUT - the word revealed up to this stop fades out in 3 frames as the next word comes in, instead
  // of being wiped by the next sweep (2026-09-25 o: "fix 'été' and 'généré' overlap on généré's time. été must go")
  // (2026-09-25 q: "the bar light closer to text" - the hugs 55 -> 36 px)
  // (2026-09-26: "the bar does not go all the way to erase 'que tu vois' ... same thing for générer ... less distance for
  // par, l'IA") - EVERY stop hugs now (hugDefault when the 4th element is absent), and the stop clears the word this sweep
  // ERASES and the next word as well as the one it reveals: "que tu vois" is wider than "à l'écran", "généré" than "été"
  sweeps: [[276, "right"], [290, "left", 43, 36], [343, "right"], [353, "left", 0, 36, true], [362, "right"], [370, "left"], [377, "right"]],
  hugDefault: 36,
  holdDrift: 0.12,                                   // half-bar-lengths the target glides outward through a hold (ample, never parked)
  sweepEndDrift: 0.08,                               // half-bar-lengths of slow continuation after the last sweep
  // FINALE (brief of 2026-09-25 c): after the last pass the bar closes as before (endShrink), the last word and the bar
  // slide UP and out together, slow to fast (out influence 85, arriving at parabola speed); then "90%" slides in from
  // below with the same slow-to-fast run, passing `pass` px under its place at speed and settling in a few frames
  // (2026-09-25 i, replacing the exit / entry slides) "remove the animation after L'IA ... simultaneously see the IA change
  // into 00 and the '...' into '%' ... right away while it changes, the loading already starts": at `morph` every
  // character of the last word flips shut (scale y 100 -> 0 about its middle, flipF frames) while the counter flips open
  // in its place from `morph + flipLag` - the count starts at `morph`; the bar closes where it is (endShrink)
  // (2026-09-25 j: "i dont want the current scale down transition ... 'L'' to disappear, the I to actually turn into a 0,
  // A into 0 as well, and ... into % ... in an instant") - no flip: at `morph` the last word is cut and the counter,
  // in the same font and place, takes over on that frame ("00%": I -> 0, A -> 0, "..." -> "%", "l'" gone) and counts at once
  // (2026-09-25 o: "for 'IA' into '00' ... make the letter change, one after the other, visibly ... the letters individually
  // change into the digit" / "don't make the light disappear, make it move smoothly and slowly to the bottom of the text,
  // lighting the digits from the bottom as they load. loading, the bar can close") - from `morph` the counter layer
  // steps "L'IA..." -> "IA..." -> "0A..." -> "00..." -> "00%" one change every stepF frames, each change flickering
  // through `flicker` random digits first; the count starts when the "%" lands. The bar glides (smootherstep over
  // `glide`) from the hanging cursor to a HORIZONTAL bar `under` px below the baseline, as long as the final word +
  // `margin`, its rays lighting the digits from below; it closes to its centre over `close` while the count runs.
  // steps: the text after each change (the first is the last word minus "l'"); flickerAt: the character that flickers
  // through random digits for `flicker` frames at the start of that step (-1 = none)
  // (2026-09-25 q: the digits are replaced by the LOADING BAR below; the last word fades over fadeF from `morph` while the
  // bar's cases pop in; the bar's physics runs through the finale: see `loading` and ae-pendulum-follow)
  // (2026-09-25 t: "after 'L'IA' you can close the light bar, we don't need it for the percentage thing. just close it and
  // make it disappear") - orbit: false = no orbit; the hanging cursor closes over `close` right after the morph and is
  // gone (its light with it). With orbit: true the old finale (orbit under the loading bar, close with the count) returns.
  finale: { morph: 398, fadeF: 4, orbit: false, glide: [385, 412], under: 96, margin: 90, close: [400, 412] },
  // THE LOADING BAR (2026-09-25 q: "10 rectangles arranged horizontally ... like a loading bar, almost like squares but still
  // rectangles ... first only light grey / off-white, kind of transparent, and it gets filled by green, dark deep green all the
  // way to the ninth, and the [tenth] is filled with red. and there is a triangle cursor that moves along as the rectangles get
  // filled: the inverted triangle above the top right corner of the last filled rectangle, does not jump but moves smoothly
  // and quickly to the next ... keep it all compact"). n cases w x h, gap; the count (0 -> `to` on the spline `curve` over
  // durF, from delayF after the morph) fills case i continuously from its left edge while count is in [10 i, 10 i + 10];
  // the 10th fills red redDelayF frames after the 9th is full, over redLenF; the cursor's target is the top-right corner of
  // the last FULL case (it stays on the 9th: the 90 % mark) and a critically damped follower (w0) carries it there - baked.
  // (2026-09-25 r: "actual rectangles ... the triangle white ... instant filling: each rectangle is filled as a whole, at
  // once, one at a time") - cases 48 x 30; a case is full the frame the count passes its threshold (instant: 1 or 0)
  loading: { n: 10, w: 48, h: 30, gap: 6, radius: 3, base: [0.9, 0.9, 0.87], baseOpacity: 38,
             // (2026-09-25 s: "it's not 90% but 80%, it stops at 8 rectangles ... a text above the triangle cursor with
             // the percentage using DrukCond") - perCase: percent per case (10); the cases past `to` fill red; `pct`: the
             // percentage text riding above the cursor (floor of the count), in its own face, white like the cursor
             green: [0.02, 0.4, 0.13], red: [0.86, 0.09, 0.09], to: 90, perCase: 10, delayF: 6, durF: 66,
             // (2026-09-26: "its not 80% for the bar its 90%" - 9 green cases, the 10th red)
             curve: [[0, 0], [0.34, 5], [0.54, 15], [0.8, 80], [0.91, 88], [1, 90]],
             // (2026-09-26: "the percentage font to the same font adobe jenson") - font: null = the master style's font, live
             pct: { font: null, size: 50, color: [1, 1, 1], above: 10 },
             redDelayF: 8, redLenF: 1, popF: 4, popStagger: 1,
             cursor: { w: 18, h: 13, above: 6, w0: 34, zeta: 1, color: [1, 1, 1] } },
  // (2026-09-25 i: "we completely lost the natural animations of the cursor bar ... physically accurate spring + mass,
  // never static always drifting") - from the end of the read of LIGNE 3 the WHOLE path is a target, not the bar: x and
  // y are masses on springs (w0 rad/s, damping ratio zeta), the rotation a torsion spring, and every target carries a
  // slow drift (px / deg, two incommensurate sines, faded in over rampS) so the springs never rest; baked in bakeSim
  // (2026-09-25 k: "too springy ... smooth always elegant, no springy and hectic, movement should be deliberate and ample,
  // and always ongoing ... slowly drifting") - CRITICALLY damped (zeta 1: the smooth-damp follower, no overshoot, no
  // ringing); x stiff enough to keep ~89 % of a sweep's amplitude (w0x 26), y and the rotation softer; the drift ample and
  // slow (px / deg, frequencies in Hz, faded in over rampS)
  physics: { w0: 26, w0y: 16, zeta: 1, w0r: 12, zetaR: 1,
             drift: { x: 22, y: 12, r: 2.5, rampS: 0.8, fx: [0.11, 0.27], fy: [0.14, 0.33], fr: [0.09, 0.23] } },
  sweepInfluence: 60,                                // (2026-09-25 k) smooth ease in and out, no longer the mechanical 88
  // (2026-09-25, "we don't see enough momentum and continuity of movement ... like gravity is there") - the keyed sweep
  // is only the TARGET: the pivot is a mass on a spring (w0 rad/s, damping ratio zeta) that lags the launch and
  // overshoots every reversal, and the hanging rod is a pendulum forced by the pivot's acceleration (lag = fraction of the
  // physical torque - the full value flails at these speeds; damping while sweeping) so the cursor's bottom trails when
  // it starts and swings ahead when it brakes. Same integration as the fall (fixed step count, 120 steps per second).
  // (measured: lag 0.08 / damping 8 gave +-20 deg on the first sweep but +-50 deg on the fast later ones - the short
  // cursor's pendulum period, 0.56 s, sits near the sweep rhythm - so lag 0.04 / damping 12 for +-10-25 deg)
  // (2026-09-25 k) the hanging cursor's pendulum at critical damping (natural 11.8 rad/s for 150 px: c = 24) and half the
  // push - it leans with the moves and comes back without swinging
  sweepSpring: { w0: 22, zeta: 0.5, lag: 0.02, damping: 24, tail: 2.5 },
  endDrift: 14,                                      // after the last sweep the cursor keeps floating up this far until the end
  // (2026-09-26: "l'animation que tu vois à l'écran a été générée par l'IA..." - capital L: a new sentence after "à tout jamais.")
  words: ["L'animation", "que tu vois", "à l'écran", "a", "été", "générée", "par", "l'IA..."],   // (the loading bar follows: `loading`)
  // the last word is a digital counter (brief of 2026-09-25): "à 0%." to "à 90%." one unit at a time, slow at first
  // (each step readable), accelerating, fast in the middle, braking just before 90 - a smootherstep on the count;
  // the digits in a seven-segment font (DSEG7 Classic, SIL OFL, assets/fonts/DSEG7-Classic), the rest in the master style
  // curve: [u, count] control points on a monotone cubic spline (u = fraction of durF): the first steps ~0.15 s apart,
  // the middle at ~60 per second, the last few slowing again ("just before attaining 90 % it slows down")
  // (measured 2026-09-25: the first five counts ~13, 6, 5, 4, 3 frames apart, then 3 per count to 15, then fast; 89 -> 90 takes 9)
  // entirely digital (2026-09-25 c): digits in DSEG7 Classic, the "%" in DSEG14 Classic (DSEG7's percent glyph is a
  // blank box; DSEG14's is a real segmented percent) - both in assets/fonts; the count starts once the word has landed
  // (2026-09-25 e: "the 90% loading animation must have already started when it appears on screen, and finish sooner" -
  // delayF is counted from the layer's in point and may be negative: -8 = counting before the word slides into view)
  // (2026-09-25 j: "it will stop at 87% ... keep same font so it keeps same dimensions") - to 87, the curve's top rescaled;
  // digital = 0: the digits and "%" in the text's own (master) font; the DSEG faces stay one checkbox away
  // (2026-09-25 k: "put the 2 digits into tungsten compressed black and 135px. and let it go to 90%") - the digits in their
  // own face and size (range form of setFont / setFontSize), the "%" in the text's master font; one checkbox
  // (the digit counter of 2026-09-25 c..o is gone: the loading bar above replaced it on 2026-09-25 q)
  featherErase: 10, featherScan: 8
};
function findComp(n){for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==n)return it;}return null;}
var fps = C2.fps; function T(f){ return f / fps; } function q(s){ return '"' + s + '"'; }
var comp = findComp(C2.comp); if (!comp) throw new Error("run build_pro_chain.jsx first");
if (2 + C2.sweeps.length - 1 != C2.words.length) throw new Error("2 vertical words + sweeps - 1 must equal the number of words");
// ---------------------------------------------------------------- re-time from the real switch and the read time
(function () { var L = comp.layer(C2.line); var sw = Math.round(L.inPoint * fps), shift = sw - 99;
  var n = L.property("ADBE Text Properties").property("ADBE Text Document").value.text.length;
  var read = Math.max(C2.minRead, Math.ceil(n / C2.readCps * fps)), delta = read - 36;   // 36 = the read the frames were written for (139 -> 175)
  function F(f) { return f <= 139 ? f + shift : f + shift + delta; }
  function FK(list) { for (var i = 0; i < list.length; i++) list[i][0] = F(list[i][0]); }
  C2.switchF = F(C2.switchF); C2.typing.startF = F(C2.typing.startF); C2.readHoldEnd = F(C2.readHoldEnd);
  FK(C2.xKeys); FK(C2.rotKeys); FK(C2.lenKeys); FK(C2.sweeps); C2.yLeave[0] = F(C2.yLeave[0]);
  C2.vert.dip = F(C2.vert.dip); C2.vert.top1 = F(C2.vert.top1); C2.mirror.startF = F(C2.mirror.startF);
  C2.finale.morph = F(C2.finale.morph); C2.finale.glide = [F(C2.finale.glide[0]), F(C2.finale.glide[1])]; C2.finale.close = [F(C2.finale.close[0]), F(C2.finale.close[1])];
  C2.endShrink = [F(C2.endShrink[0]), F(C2.endShrink[1])]; C2.totalFrames = F(C2.totalFrames);
  C2.retimeInfo = { switchF: C2.switchF, readFrames: read, readHoldEnd: C2.readHoldEnd, totalFrames: C2.totalFrames }; })();
var rep = { errors: [], retime: C2.retimeInfo };
// manual changes made in the project since the last build are kept (preserve_manual.jsx: three-way merge per layer)
(function () { var here = new File($.fileName).parent;
  var f = new File(here.fsName + "/preserve_manual.jsx");
  if (!f.exists) throw new Error("preserve_manual.jsx not found beside this script");
  $.evalFile(f); })();   // always reload: a cached copy is stale after an edit
// the physics (critically damped followers + pendulum, baked per frame): the generic integrator of ae-pendulum-follow
(function () { var here = new File($.fileName).parent;
  var f = new File(here.fsName + "/physics_follow.jsx");
  if (!f.exists) throw new Error("physics_follow.jsx not found beside this script");
  $.evalFile(f); })();   // always reload: a cached copy is stale after an edit
if (typeof physicsFollow != "function") throw new Error("physics_follow.jsx did not load");
var PM_PATTERNS = ["LIGNE ", "SCAN ", "STYLE - police", "BARRE", "MOTION - ", "CONTROLS"], PM_SNAP = $.global.PM ? $.global.PM.snapshot(comp, PM_PATTERNS) : {};
// a SCAN word retyped by hand wins over the config word (the layer keeps its place in the sequence)
// (not the counter: its text is an expression, and what the snapshot reads is the expression's result - 2026-09-25 o, the
// counter came back renamed "IA..." from the morph's first step)
for (var pw = 0; pw < C2.words.length; pw++) { for (var nm in PM_SNAP) { if (!PM_SNAP.hasOwnProperty(nm) || nm.indexOf("SCAN " + (pw + 1) + " - ") != 0) continue;
  var mt = PM_SNAP[nm].manual["text:text"]; if (mt && mt != C2.words[pw]) C2.words[pw] = mt; } }
function easeKey(prop, k, outInf, inInf){ prop.setInterpolationTypeAtKey(k, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
  var tries = [1, 3, 2], ok = false; for (var t = 0; t < tries.length && !ok; t++) { var ei = [], eo = []; for (var d = 0; d < tries[t]; d++) { ei.push(new KeyframeEase(0, inInf)); eo.push(new KeyframeEase(0, outInf)); } try { prop.setTemporalEaseAtKey(k, ei, eo); ok = true; } catch (e) {} }
  try { prop.setSpatialTangentsAtKey(k, [0, 0, 0], [0, 0, 0]); } catch (e2) {} }
function easyAll(prop){ for (var k = 1; k <= prop.numKeys; k++) easeKey(prop, k, 33.333, 33.333); }
// a key with its own incoming and outgoing SPEEDS (units/s): different speeds = a broken tangent (a bounce)
function speedKey(prop, k, inSpeed, inInf, outSpeed, outInf){ prop.setInterpolationTypeAtKey(k, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
  var tries = [1, 3, 2], ok = false; for (var t = 0; t < tries.length && !ok; t++) { var ei = [], eo = []; for (var d = 0; d < tries[t]; d++) { ei.push(new KeyframeEase(inSpeed, inInf)); eo.push(new KeyframeEase(outSpeed, outInf)); } try { prop.setTemporalEaseAtKey(k, ei, eo); ok = true; } catch (e) {} }
  if (Math.abs(inSpeed - outSpeed) > 1e-6) { try { prop.setTemporalContinuousAtKey(k, false); prop.setTemporalAutoBezierAtKey(k, false); } catch (e2) {} } }
function smoother(u){ u = Math.max(0, Math.min(1, u)); return u * u * u * (u * (u * 6 - 15) + 10); }
function keys(prop, list, map){ // list: [frame, value, outInf, inInf]
  for (var i = 0; i < list.length; i++) prop.setValueAtTime(T(list[i][0]), map ? map(list[i][1]) : list[i][1]);
  for (var j = 0; j < list.length; j++) easeKey(prop, prop.nearestKeyIndex(T(list[j][0])), list[j][2], list[j][3]); }
function animators(L){ return L.property("ADBE Text Properties").property("ADBE Text Animators"); }
function styleLike(src, L){ var st = L.property("ADBE Text Properties").property("ADBE Text Document"); var td = st.value; var sd = src.property("ADBE Text Properties").property("ADBE Text Document").value;
  td.font = sd.font; td.fontSize = sd.fontSize; td.fillColor = sd.fillColor; td.applyFill = true; td.justification = ParagraphJustification.CENTER_JUSTIFY; td.tracking = 0;
  try { td.fontCapsOption = sd.fontCapsOption; } catch (eC) {}   // a new text layer inherits the Character panel (All Caps was on: helpers measured "À TOUT JAMAIS." 817 px for 586) - allCaps itself is read-only
  st.setValue(td); }
function makeNull(name){ var n = comp.layers.addNull(); n.name = name; n.anchorPoint.setValue([0, 0]); n.shy = true; n.outPoint = comp.duration; return n; }

// ---------------------------------------------------------------- durations
comp.duration = T(C2.totalFrames);
var L3 = comp.layer(C2.line); var ctrl = comp.layer("CONTROLS"); ctrl.outPoint = comp.duration;
for (var i = 1; i <= comp.numLayers; i++) { var ly = comp.layer(i); if (ly.name.indexOf("_measure") == 0) ly.outPoint = comp.duration; }
var yBase = L3.position.value[1];
var r3 = L3.sourceRectAtTime(L3.inPoint + 0.01, false);
var yTop = yBase + r3.top - C2.yTopPad, yBottom = yBase + C2.yBottomPad;
var yUp = yTop - C2.over, yDown = yBottom + C2.over;

// ---------------------------------------------------------------- idempotent: remove what a previous run left
for (var cl = comp.numLayers; cl >= 1; cl--) { var ln = comp.layer(cl).name;
  if (ln == "BARRE" || ln.indexOf("BARRE LUMIERE") == 0 || ln == "BARRE X" || ln == "BARRE Y" || ln.indexOf("SCAN ") == 0 || ln.indexOf("_measure L3 typed") == 0 || ln.indexOf("_measure L3 smooth") == 0 || ln.indexOf("_measure L3 prefix") == 0 || ln.indexOf("_measure L3 capitale") == 0) comp.layer(cl).remove(); }
// the cursor's line = the text's middle line: baseline - half the CAPITAL height (2026-09-25 i: "a bit too high now ...
// properly centered systematically to text's center horizontal axis"). The full line's box centre was too high - accents
// ("À") and descenders pull it around. An "H" in the line's live style measures the capital height; its Source Text
// expression is added with the other helpers (STYLE_OF_LINE), and the bar reads it at a fixed time (cached).
var CAPH = "_measure L3 capitale (H)";
var capL = comp.layers.addText("H"); capL.name = CAPH; styleLike(L3, capL); capL.enabled = false; capL.guideLayer = true; capL.shy = true; capL.moveToEnd(); capL.inPoint = 0; capL.outPoint = comp.duration;
var rH = capL.sourceRectAtTime(0, false), yCap = yBase + rH.top + rH.height / 2;
var fxc = ctrl.property("ADBE Effect Parade"); for (var fi = fxc.numProperties; fi >= 1; fi--) { if (fxc.property(fi).name.indexOf("L3 typed") == 0) fxc.property(fi).remove(); }
var mk = L3.property("ADBE Mask Parade"); for (var mi = mk.numProperties; mi >= 1; mi--) mk.property(mi).remove();
var a = animators(L3);
for (var ai0 = a.numProperties; ai0 >= 1; ai0--) { if (a.property(ai0).name.indexOf("Typewriter") == 0) a.property(ai0).remove(); }
for (var ai = a.numProperties; ai >= 1; ai--) { var nm = a.property(ai).name; if (nm.indexOf("Start - ") == 0 || nm.indexOf("End - Words") == 0) a.property(ai).remove(); }
// the line ends the moment the bar reaches its leftmost point (fully erased): when the bar travels back
// to the centre the mask would open again and show the erased letters - once gone, gone
L3.outPoint = T(C2.xKeys[1][0] + 1);

// ---------------------------------------------------------------- LIGNE 3: typewriter in
function slider(name){ var s = ctrl.property("ADBE Effect Parade").addProperty("ADBE Slider Control"); s.name = name; }
// add every slider first: adding an effect invalidates references to its siblings
slider("L3 typed start (s)"); slider("L3 typed duration (s)"); slider("L3 typed slowdown"); slider("L3 typed (chars)"); slider("L3 typed (smooth)");
function sv(name){ return ctrl.property("ADBE Effect Parade").property(name).property("ADBE Slider Control-0001"); }
sv("L3 typed start (s)").setValue(T(C2.typing.startF)); sv("L3 typed duration (s)").setValue(T(C2.typing.durF)); sv("L3 typed slowdown").setValue(C2.typing.slowdown);
// arrival of character k (0-based) of n: start + duration * (r^k - 1) / (r^(n-1) - 1) - geometric gaps
var arr = 'var s = String(thisComp.layer(' + q(C2.line) + ').text.sourceText), n = s.length;\nvar C = thisComp.layer("CONTROLS");\n' +
  'var t0 = C.effect("L3 typed start (s)")("Slider"), D = C.effect("L3 typed duration (s)")("Slider"), r = Math.max(1.001, C.effect("L3 typed slowdown")("Slider"));\n' +
  'function arr(k) { return n > 1 ? t0 + D * (Math.pow(r, k) - 1) / (Math.pow(r, n - 1) - 1) : t0; }\n';
sv("L3 typed (chars)").expression = arr + 'var c = 0; for (var k = 0; k < n; k++) if (time >= arr(k)) c = k + 1;\nc';
sv("L3 typed (smooth)").expression = arr + 'var c = 0; for (var k = 0; k < n; k++) if (time >= arr(k)) { c = k + 1;\n  if (k + 1 < n && time < arr(k + 1)) { var u = (time - arr(k)) / (arr(k + 1) - arr(k)); c += u * u * (3 - 2 * u); } }\nc';
if (sv("L3 typed (chars)").expressionError) rep.errors.push("typing: " + sv("L3 typed (chars)").expressionError);
// per-layer font override (2026-09-25): every text layer carries the checkbox "Police master"; ON = the master's character
// style, OFF = the layer's own Character-panel style. Helpers measuring a line follow that line's checkbox.
var MASTER_CHK = "Police master (1 = suivre STYLE)";
var STYLE_OF_LINE = 'var Li = thisComp.layer(' + q(C2.line) + '); var useM = 1; try { useM = Li.effect(' + q(MASTER_CHK) + ')("Checkbox"); } catch (e1) {}\n' +
  '  var sty = useM > 0 ? thisComp.layer("STYLE - police (master)").text.sourceText.style : Li.text.sourceText.style;';
var STYLE_PICK = 'var useM = 1; try { useM = effect(' + q(MASTER_CHK) + ')("Checkbox"); } catch (e0) {}\n' +
  'var st = useM > 0 ? thisComp.layer("STYLE - police (master)").text.sourceText.style : text.sourceText.style;\n';
function addCheckbox(L, name, v){ var fx = L.property("ADBE Effect Parade"); if (!fx.property(name)) { fx.addProperty("ADBE Checkbox Control").name = name; } L.property("ADBE Effect Parade").property(name).property("ADBE Checkbox Control-0001").setValue(v); }
// The typed prefix widths, LIVE and parametric (2026-09-25 e: "it should be based on text length parametrically and
// systematically" - a table measured at build went stale the moment the font was changed by hand). ONE hidden text
// layer holds "the first k characters of LIGNE 3 in LIGNE 3's live style", with k read from ITS OWN TIME: k = time x
// 1000. Asking it sourceRectAtTime(k / 1000) is the width of the k-prefix - any text, any font, any size, nothing to
// re-measure. The asked times are integers / 1000, the same at every motion-blur sub-sample, so AE's per-time cache
// answers the repeats (until 2026-09-25 d four helpers evaluated at the sub-sample times themselves: 42 s per frame).
var PREFIX = "_measure L3 prefix (k = temps x 1000)";
(function () { var Hl = comp.layers.addText("x"); Hl.name = PREFIX; styleLike(L3, Hl); Hl.enabled = false; Hl.guideLayer = true; Hl.shy = true; Hl.moveToEnd();
  Hl.inPoint = 0; Hl.outPoint = comp.duration;
  Hl.property("ADBE Text Properties").property("ADBE Text Document").expression = '// the first k characters of ' + C2.line + ', k = time x 1000 (asked by the cursor and the centring)\n' +
    'var out = String(thisComp.layer(' + q(C2.line) + ').text.sourceText).substr(0, Math.round(time * 1000));\ntry { ' + STYLE_OF_LINE + ' var up = false; try { up = sty.isAllCaps; } catch (eC) {} out = sty.setText(up ? out.toUpperCase() : out); } catch (e) {}\nout'; })();
capL.property("ADBE Text Properties").property("ADBE Text Document").expression = '// a capital H in ' + C2.line + '\'s live style: its height sets the cursor\'s middle line\n' +
  'var out = "H";\ntry { ' + STYLE_OF_LINE + ' var up = false; try { up = sty.isAllCaps; } catch (eC) {} out = sty.setText(up ? out.toUpperCase() : out); } catch (e) {}\nout';
// a typed line arrives one character at a time: what is on screen at the switch is its FIRST CHARACTER, so the
// incoming width match (and the previous line's leaving scale) measure that, not the first words
comp.layer("_measure L3 present").property("ADBE Text Properties").property("ADBE Text Document").expression =
  'var src = thisComp.layer(' + q(C2.line) + ').text.sourceText;\nvar out = String(src).substr(0, 1);\ntry { ' + STYLE_OF_LINE + ' var up = false; try { up = sty.isAllCaps; } catch (eC) {} out = sty.setText(up ? out.toUpperCase() : out); } catch (e) {}\nout';
function W(name){ return 'thisComp.layer(' + q(name) + ').sourceRectAtTime(time, false).width'; }
function typedWidth(sliderName){ return '// width of the typed prefix, measured live on the prefix layer (k characters = its time k / 1000)\n' +
  'var c = thisComp.layer("CONTROLS").effect(' + q(sliderName) + ')("Slider"), H = thisComp.layer(' + q(PREFIX) + '), nP = String(thisComp.layer(' + q(C2.line) + ').text.sourceText).length;\n' +
  'function PW(j) { j = Math.max(0, Math.min(nP, j)); return j == 0 ? 0 : H.sourceRectAtTime(j / 1000, false).width; }\n' +
  'var k = Math.max(0, Math.min(nP, Math.floor(c))), fr = c - k;\nvar WA = PW(k), WB = fr > 0 ? PW(k + 1) : WA;\nvar Wt = WA + (WB - WA) * fr;\n'; }
a.addProperty("ADBE Text Animator").name = "Typewriter - Chars - Opacity";
var tw = animators(L3).property("Typewriter - Chars - Opacity"); tw.property("ADBE Text Animator Properties").addProperty("ADBE Text Opacity").setValue(0);
tw = animators(L3).property("Typewriter - Chars - Opacity"); tw.property("ADBE Text Selectors").addProperty("ADBE Text Selector");
var sel = animators(L3).property("Typewriter - Chars - Opacity").property("ADBE Text Selectors").property(1); var adv = sel.property("ADBE Text Range Advanced");
adv.property("ADBE Text Range Type2").setValue(1); adv.property("ADBE Text Range Units").setValue(2); adv.property("ADBE Text Selector Mode").setValue(1);
sel.property("ADBE Text Index Start").expression = 'thisComp.layer("CONTROLS").effect("L3 typed (chars)")("Slider")';
sel.property("ADBE Text Index End").expression = 'String(text.sourceText).length';
var pos = animators(L3).property("Line - Position").property("ADBE Text Animator Properties").property("ADBE Text Position 3D");
pos.expression = 'var v = value[0];\nvar WfP = ' + W("_measure L2 full") + ';\nvar WpkP = ' + W("_measure L2 prefix+key") + ';\nvar WkPrev = ' + W("_measure L2 key") + ';\nvar kcPrev = -WfP / 2 + WpkP - WkPrev / 2;\n' +
  'var Wf = ' + W("_measure L3 full") + ';\n' + typedWidth("L3 typed (smooth)") +
  'var fcT = -Wf / 2 + Wt / 2;\nvar x = (v <= 1) ? kcPrev * (1 - v) - fcT : -fcT;\nif (time >= ' + T(C2.readHoldEnd).toFixed(4) + ') x = 0;\n[x, 0, 0]';
rep.l3 = { posExprError: pos.expressionError || "", selErr: sel.property("ADBE Text Index Start").expressionError || "", yTop: yTop, yBottom: yBottom, yCap: yCap };

// ---------------------------------------------------------------- the bar rig
var nX = makeNull("BARRE X"), nY = makeNull("BARRE Y");
var bar = comp.layers.addShape(); bar.name = "BARRE";
// created first: the bar's x, y, rotation and length expressions all read it, and an expression that errors once (the
// effect not there yet) stays disabled even after it appears
bar.property("ADBE Effect Parade").addProperty("ADBE Slider Control").name = "longueur finale (px, mesure au build)";   // set after the words
// the orbit's start (the pin and angle when the glide begins) and the digits' centre below / above the baseline: set at the end
var ORBS = ["orbite x0 (px, mesure au build)", "orbite y0 (px, mesure au build)", "orbite a0 (deg, mesure au build)", "orbite centre dy (px, mesure au build)"];
for (var ob = 0; ob < ORBS.length; ob++) bar.property("ADBE Effect Parade").addProperty("ADBE Slider Control").name = ORBS[ob];
var grp = bar.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group"); grp.name = "bar";
var gc = grp.property("ADBE Vectors Group"); gc.addProperty("ADBE Vector Shape - Rect");
gc.addProperty("ADBE Vector Graphic - Fill");
gc = bar.property("ADBE Root Vectors Group").property("bar").property("ADBE Vectors Group");   // re-fetch: the fill invalidated the rectangle
gc.property(2).property("ADBE Vector Fill Color").setValue(C2.bar.fill);
nY.parent = nX; bar.parent = nY;                  // parent first, then write values (a plain parent= rewrites the child's values)
nX.inPoint = nY.inPoint = bar.inPoint = T(C2.switchF); nX.outPoint = nY.outPoint = bar.outPoint = comp.duration;
bar.anchorPoint.setValue([0, 0]); bar.position.setValue([0, 0]);

// X: typing cursor from measured widths, then the u slider (half-widths of the line)
nX.property("ADBE Effect Parade").addProperty("ADBE Slider Control").name = "u (demi-largeurs)";
var u = nX.property("ADBE Effect Parade").property("u (demi-largeurs)").property("ADBE Slider Control-0001");
keys(u, C2.xKeys);
// never static: after the return to centre the bar keeps sliding in its previous (leftward) direction at a constant crawl
// until the hinge - a continuous speed through the last x key instead of a stop
// THE MIRROR (2026-09-25 f): the gesture G0 -> G1 (cursor -> long bar at the top) played backwards from M0 and mirrored
// left-right, so the bar turns on to vertical RIGHT of the text; every key is reflected in time (f -> M0 + G1 - f, the
// in and out influences swapped), x is negated, the rotation reflected as -180 - r (so it keeps turning counter-
// clockwise, -90 -> -180, instead of flipping back through 0). From M1 (= tH) the cursor sweeps.
var G0 = C2.rotKeys[0][0], G1 = C2.vert.top1, M0 = C2.mirror.startF, M1 = M0 + (G1 - G0);
function mirrorKeys(list, fv, from) { var out = []; for (var mk = list.length - 1; mk >= (from || 0); mk--) out.push([M0 + (G1 - list[mk][0]), fv(list[mk][1]), list[mk][3], list[mk][2]]); return out; }
var tH = T(M1), tM0 = T(M0);
var xLastK = C2.xKeys[C2.xKeys.length - 1], uCrawl = -C2.xPauseDrift / (tM0 - T(xLastK[0]));   // half-widths per second
var uM = mirrorKeys(C2.xKeys, function (vv) { return -vv; }, 1);   // the erase key (the first) is not part of the gesture
uM[0][1] = xLastK[1] - C2.xPauseDrift;   // it starts where the crawl has brought it
keys(u, uM);
speedKey(u, u.nearestKeyIndex(T(xLastK[0])), uCrawl, xLastK[3], uCrawl, 33.333); speedKey(u, u.nearestKeyIndex(tM0), uCrawl, 33.333, 0, uM[0][2]);
// From the hinge on, x is the PIVOT (the bar's left end, then the cursor): slider v in half-bar-lengths (-1 = left end,
// +1 = right end); the bar's rectangle is re-anchored on that end at the same instant, so nothing moves at the switch
nX.property("ADBE Effect Parade").addProperty("ADBE Slider Control").name = "v (balayage, demi-barres)";
var v = nX.property("ADBE Effect Parade").property("v (balayage, demi-barres)").property("ADBE Slider Control-0001");
function sideV(sw) { return sw[1] == "left" ? -1 : 1; }
var vk = [[M1, sideV(C2.sweeps[0]), 33.333, 33.333]];   // the cursor as the mirror left it
for (var sw = 0; sw < C2.sweeps.length; sw++) { var sv0 = sideV(C2.sweeps[sw]);
  if (C2.sweeps[sw][2]) { vk.push([C2.sweeps[sw][0], sv0, 33.333, C2.sweepInfluence]); vk.push([C2.sweeps[sw][0] + C2.sweeps[sw][2], sv0 * (1 + C2.holdDrift), C2.sweepInfluence, 33.333]); }   // a hold: creeps outward
  else vk.push([C2.sweeps[sw][0], sv0, C2.sweepInfluence, C2.sweepInfluence]); }
var lastSw = C2.sweeps[C2.sweeps.length - 1];   // after the last sweep the target creeps on in the same direction (never static)
vk.push([C2.totalFrames - 1, sideV(lastSw) * (1 + C2.sweepEndDrift), 33.333, 33.333]);
keys(v, vk);
// the baked simulation (see bakeSim): one key per frame from the end of the read - the expressions read these sliders.
// dx / dy are the DEVIATIONS of the masses from their targets (lag, overshoot, drift): the targets themselves stay live
// (text widths and heights measured now), so a font change still places the path and the physics rides on it
nX.property("ADBE Effect Parade").addProperty("ADBE Slider Control").name = "sim dx (px, cuit)";
nX.property("ADBE Effect Parade").addProperty("ADBE Slider Control").name = "sim dy (px, cuit)";
nX.property("ADBE Effect Parade").addProperty("ADBE Slider Control").name = "sim angle (deg, cuit)";
// where the pin sits relative to the bar's centre when the cursor starts hanging: its REAL top end at its real angle
// (2026-09-25 l: "at 0:00:08:08 there is a stutter" - a straight vertical half-length jumped 13 px sideways with the bar
// still 11 deg off vertical at the switch)
nX.property("ADBE Effect Parade").addProperty("ADBE Slider Control").name = "sim pivot dx (px, cuit)";
nX.property("ADBE Effect Parade").addProperty("ADBE Slider Control").name = "sim pivot dy (px, cuit)";
// W0 = the bar's full length: the base length or the widest SCAN word + margin, whichever is larger (one constant for
// the whole act, so the scan bar, the hinge and the sweep extents all agree). MEASURED ONCE at build time (bakeSim below)
// and written to the slider "W0 (px, mesure au build)" on BARRE: an expression measuring nine text layers every frame
// was part of the render cost (2026-09-25 d: "optimise ... frame render time")
var W0 = 'function W0() { return thisComp.layer("BARRE").effect("W0 (px, mesure au build)")("Slider"); }\n';
// The simulation shared by the pivot's x and the bar's rotation: from the release, the pivot is a mass on a spring
// towards the keyed target, the rod a pendulum on that pivot - free fall, the pin's stop at vertical, the settle, then
// the sweeps with the pivot's acceleration leaning the rod. It is integrated ONCE, in bakeSim() at the end of this
// script (same maths, 120 steps per second from the release), and written as one key per frame on two sliders of
// BARRE X; the expressions only read them. Before 2026-09-25 d both expressions re-ran the whole integration (up to
// ~640 steps, each reading a keyed slider) on EVERY frame, and every mask or light expression that asked the bar
// where it was triggered it again: the frame render time and the builder's read-back were dominated by it.
// (2026-09-25 i) the physics now covers the WHOLE act after the read of LIGNE 3, not only the sweeps: the keyed path
// (erase, dip, rise, read, mirror, sweeps, the creep to the end) is the TARGET; x and y are masses on springs, the
// rotation a torsion spring until the mirror ends and then the pendulum; each target carries a slow drift.
var SS = C2.sweepSpring, PH = C2.physics, tE = T(C2.readHoldEnd);
var SIMA = 'thisComp.layer("BARRE X").effect("sim angle (deg, cuit)")("Slider")';
// the finale, shared by the bar's x, y, rotation and length: fu = the glide (0 -> 1, smootherstep), cu = the close, Lc =
// the finale length now (measured on the final word at build, closing to 0), fdx / fdy / fdr = a slow drift (never still)
var FZ = C2.finale;
var FIN = '// finale: fu = glide to the bar under the counter, cu = its close, Lc = its length now\n' +
  (FZ.orbit ? 'var fu = clamp((time - ' + T(FZ.glide[0]).toFixed(4) + ') / ' + T(FZ.glide[1] - FZ.glide[0]).toFixed(4) + ', 0, 1); fu = fu * fu * fu * (fu * (fu * 6 - 15) + 10);\n' : 'var fu = 0;   // no orbit (finale.orbit false)\n') +
  'var cu = clamp((time - ' + T(FZ.close[0]).toFixed(4) + ') / ' + T(FZ.close[1] - FZ.close[0]).toFixed(4) + ', 0, 1); cu = cu * cu * cu * (cu * (cu * 6 - 15) + 10);\n' +
  'var Lc = thisComp.layer("BARRE").effect("longueur finale (px, mesure au build)")("Slider") * (1 - cu);\n';
// THE ORBIT (2026-09-25 p: "i don't like the bar animation from vertical to horizontal ... the light should keep oriented
// towards the center of the text, and the light should not flip sides, instead ... 'orbit around' aiming at the center
// of the 2 digits"; 2026-09-25 q: "way more natural and more actual physics") - this is the TARGET PATH the baked physics
// follows (ae-pendulum-follow: critically damped followers + the pivot's lean; the same formulas run in bakeSim's
// orbit()). From the pin's target at the glide start ("orbite x0 / y0", the bar hanging) the bar's CENTRE travels on an
// arc around the counter's centre (C: the text's centre x, baseline + "orbite centre dy") to straight below it, the radius
// easing to `under`; the bar stays TANGENT to the circle (rotation = the polar angle), so its perpendicular - and the rays -
// point at C. Returns in ORBx / ORBy the target pin (the rectangle's origin: its end). Needs `yb` (live baseline).
var ORB = FIN + 'var Bo = thisComp.layer("BARRE"), oL = ' + C2.bar.sweepH + ' + (Lc - ' + C2.bar.sweepH + ') * fu;\n' +
  'var ox = Bo.effect("orbite x0 (px, mesure au build)")("Slider"), oy = Bo.effect("orbite y0 (px, mesure au build)")("Slider");\n' +
  'var c0x = ox, c0y = oy + ' + (C2.bar.sweepH / 2) + ';   // the bar\'s centre when the glide starts (hanging from its pin)\n' +
  'var Cx = thisComp.layer(' + q(C2.line) + ').transform.position[0], Cy = yb + Bo.effect("orbite centre dy (px, mesure au build)")("Slider");\n' +
  'var th0 = Math.atan2(c0y - Cy, c0x - Cx), r0 = Math.sqrt((c0x - Cx) * (c0x - Cx) + (c0y - Cy) * (c0y - Cy));\n' +
  'var th1 = Math.PI / 2, r1 = yb + ' + FZ.under + ' - Cy;   // straight below the counter\n' +
  'while (th1 - th0 > Math.PI) th1 -= 2 * Math.PI; while (th0 - th1 > Math.PI) th1 += 2 * Math.PI;   // the short way round\n' +
  'var oth = th0 + (th1 - th0) * fu, orr = r0 + (r1 - r0) * fu;\n' +
  'var ocx = Cx + orr * Math.cos(oth), ocy = Cy + orr * Math.sin(oth);\n' +
  '// the rectangle hangs from its origin along local +y = (-sin a, cos a): the origin is the centre minus half of that\n' +
  'var ORBx = ocx + Math.sin(oth) * oL / 2, ORBy = ocy - Math.cos(oth) * oL / 2;\n';
var tgF = FZ.orbit ? T(FZ.glide[0]).toFixed(4) : '1e6';   // no orbit: the orbit branch never runs
var HUGC = {};   // per hug stop: px added to its target so the lagging pin actually reaches it (grows each bakeSim pass)
function bakeSim() {
  var Wb = C2.bar.len;
  for (var i = 1; i <= comp.numLayers; i++) { var Ls = comp.layer(i); if (Ls.name.indexOf("SCAN ") != 0) continue;
    Wb = Math.max(Wb, Ls.sourceRectAtTime(Ls.inPoint + 0.01, false).width * Ls.scale.value[0] / 100 + 120); }
  var manW0 = (PM_SNAP["BARRE"] && PM_SNAP["BARRE"].manual) ? PM_SNAP["BARRE"].manual["fx:W0 (px, mesure au build)/Slider"] : null;
  if (manW0) Wb = manW0;   // a hand-set length wins (preserve_manual.jsx) and the simulation is baked with it
  bar.property("ADBE Effect Parade").property("W0 (px, mesure au build)").property("ADBE Slider Control-0001").setValue(Wb);
  var fxX = nX.property("ADBE Effect Parade"), uS = fxX.property("u (demi-largeurs)").property(1), vS = fxX.property("v (balayage, demi-barres)").property(1);
  var dxS = fxX.property("sim dx (px, cuit)").property(1), dyS = fxX.property("sim dy (px, cuit)").property(1), phS = fxX.property("sim angle (deg, cuit)").property(1);
  var E = Wb / 2, g = 14000, lag = SS.lag;
  var kx = PH.w0 * PH.w0, cx2 = 2 * PH.zeta * PH.w0, ky = PH.w0y * PH.w0y, cy2 = 2 * PH.zeta * PH.w0y, kr = PH.w0r * PH.w0r, cr = 2 * PH.zetaR * PH.w0r;
  // the targets, with the same formulas as the live expressions (x: u in half-widths of the line until the mirror ends,
  // then v in half-bar-lengths from where the mirror left the cursor; y and the rotation: their keys before the expressions)
  var Wf = comp.layer("_measure L3 full").sourceRectAtTime(tH, false).width;
  var x0 = L3.scale.valueAtTime(tH, false)[0] / 100 * uS.valueAtTime(tH, false) * (Wf / 2 + C2.bar.gap);
  var dX = x0 - sideV(C2.sweeps[0]) * E;
  // HUG points: the v key of that stop (and of its hold's end) is set so the PIN lands `gap` px outside the word's edge -
  // the word measured now (its layer, its font); the pin offset from the last bake is taken off (bakeSim runs twice)
  var pdx = fxX.property("sim pivot dx (px, cuit)").property(1).value; rep.hug = []; var hugWant = [];
  function scanL(n) { for (var li = 1; li <= comp.numLayers; li++) if (comp.layer(li).name.indexOf("SCAN " + n + " - ") == 0) return comp.layer(li); return null; }
  function edge(Lw, side, pad) { var rr = Lw.sourceRectAtTime(Lw.inPoint + 0.3, false), sc = Lw.scale.value[0] / 100, wx = Lw.position.value[0] - L3.position.value[0];
    return side < 0 ? wx + rr.left * sc - pad : wx + (rr.left + rr.width) * sc + pad; }
  for (var hk = 1; hk < C2.sweeps.length; hk++) { var sp = C2.sweeps[hk], hug = sp[3] || C2.hugDefault; if (!hug) continue;
    var wl = scanL(nV + hk); if (!wl) continue; var sd = sideV(sp);
    var xr = edge(wl, sd, hug);
    // the word this sweep ERASES must be passed too (2026-09-26: "que tu vois" is wider than "à l'écran" - the bar stopped
    // inside it and the rest vanished instead of being swept), and the NEXT word, which appears on this side of the cursor
    // as the next sweep leaves (its end would show before the bar reaches it)
    var cand = [scanL(nV + hk - 1)]; if (hk + 1 < C2.sweeps.length) cand.push(scanL(nV + hk + 1));
    for (var cj = 0; cj < cand.length; cj++) if (cand[cj]) { var xe = edge(cand[cj], sd, hug); xr = sd < 0 ? Math.min(xr, xe) : Math.max(xr, xe); }
    // the follower lags: on a short sweep the pin turns ~5-40 px before the target (measured 2026-09-26: "généré" 137 for
    // 178, its edge at 142 - the last é was never revealed). Each pass pushes the target out by what the last one missed.
    hugWant.push([hk, xr, sd]); xr += HUGC[hk] || 0;
    var vv = (xr - dX - pdx) / E;
    vS.setValueAtKey(vS.nearestKeyIndex(T(sp[0])), vv);
    if (sp[2]) vS.setValueAtKey(vS.nearestKeyIndex(T(sp[0] + sp[2])), vv + sideV(sp) * 10 / E);   // the hold still glides, 10 px
    rep.hug.push([wl.name, Math.round(xr), Math.round(vv * 1000) / 1000]); }
  function xT(t) { return t < tH ? L3.scale.valueAtTime(t, false)[0] / 100 * uS.valueAtTime(t, false) * (Wf / 2 + C2.bar.gap) : vS.valueAtTime(t, false) * E + dX; }
  function yT(t) { return pY.valueAtTime(t, true); }
  function rT(t) { return bar.rotation.valueAtTime(t, true); }
  // (2026-09-25 q) the physics is the generic integrator of ../../ae-pendulum-follow: critically damped followers on
  // x, y and the rotation toward the TARGET PATH below, a hanging pendulum from tH to the glide start (the leftover
  // angle settling on top, no kick; effective gravity clamped), then the spring again following the ORBIT - the arc
  // around the counter is a target the physics trails and settles on, not a kinematic blend.
  // The target path, per frame, in the spaces the expressions add the deviations in: x relative to LIGNE 3's x;
  // y absolute (key values, = the live band at build); from tH the PIN (the pivot offsets included: state and
  // targets jump together at tH, an instantaneous re-anchoring); from the glide start the orbit's pin.
  var f0 = C2.readHoldEnd, fN = C2.totalFrames, fH = M1, fg = FZ.orbit ? FZ.glide[0] : C2.totalFrames + 1, TX = [], TY = [], TR = [];
  var pdy = fxX.property("sim pivot dy (px, cuit)").property(1).value;   // from the previous pass (bakeSim runs twice)
  var yBaseB = L3.position.value[1], cxB = L3.position.value[0], yCapB = yCap;
  var cDy = bar.property("ADBE Effect Parade").property("orbite centre dy (px, mesure au build)").property(1).value;
  var LcB = bar.property("ADBE Effect Parade").property("longueur finale (px, mesure au build)").property(1).value;
  var ox0 = 0, oy0 = 0, oCy = yBaseB + cDy;
  function sm5(u) { u = Math.max(0, Math.min(1, u)); return u * u * u * (u * (u * 6 - 15) + 10); }
  function orbit(f) {   // same formulas as the ORB expression: centre on an arc from the pin's start pose to below the counter
    var fu = sm5((f - FZ.glide[0]) / (FZ.glide[1] - FZ.glide[0])), cu = sm5((f - FZ.close[0]) / (FZ.close[1] - FZ.close[0]));
    var Lc = LcB * (1 - cu), oL = C2.bar.sweepH + (Lc - C2.bar.sweepH) * fu;
    var c0x = ox0, c0y = oy0 + C2.bar.sweepH / 2;   // the bar's centre at the glide start (hanging: rotation 0)
    var th0 = Math.atan2(c0y - oCy, c0x - cxB), r0 = Math.sqrt((c0x - cxB) * (c0x - cxB) + (c0y - oCy) * (c0y - oCy));
    var th1 = Math.PI / 2, r1 = yBaseB + FZ.under - oCy;
    while (th1 - th0 > Math.PI) th1 -= 2 * Math.PI; while (th0 - th1 > Math.PI) th1 += 2 * Math.PI;
    var th = th0 + (th1 - th0) * fu, rr = r0 + (r1 - r0) * fu, cxo = cxB + rr * Math.cos(th), cyo = oCy + rr * Math.sin(th);
    return { x: cxo + Math.sin(th) * oL / 2 - cxB, y: cyo - Math.cos(th) * oL / 2, a: th * 180 / Math.PI }; }
  for (var fs = f0; fs <= fN; fs++) { var ts = T(fs);
    if (fs < fH) { TX.push(xT(ts)); TY.push(yT(ts)); TR.push(rT(ts)); }
    else if (fs < fg) { TX.push(xT(ts) + pdx); TY.push(yT(ts) + pdy); TR.push(0); }
    else { if (fs == fg) { ox0 = cxB + TX[fs - 1 - f0]; oy0 = TY[fs - 1 - f0]; }   // the orbit starts from the pin's target
      var o = orbit(fs); TX.push(o.x); TY.push(o.y); TR.push(o.a); } }
  var sim = physicsFollow({ fps: fps, f0: f0, fN: fN, tx: TX, ty: TY, tr: TR,
    x: { w0: PH.w0, zeta: PH.zeta }, y: { w0: PH.w0y, zeta: PH.zeta }, r: { w0: PH.w0r, zeta: PH.zetaR },
    drift: { x: PH.drift.x, y: PH.drift.y, r: PH.drift.r, rampS: PH.drift.rampS, fx: PH.drift.fx, fy: PH.drift.fy, fr: PH.drift.fr, t0: tE },
    pendulum: { fStart: fH, fEnd: fg, g: 14000, L: C2.bar.sweepH, lag: SS.lag, damping: SS.damping, gClamp: [0.5, 1.5], frameOffset: rT(tH) },
    shift: [{ f: fH, dx: pdx, dy: pdy }] });
  var times = sim.times, dxs = sim.devX, dys = sim.devY, as = [], xAbs = sim.x, phi0 = sim.phiAtStart;
  rep.hugReached = [];
  for (var hw = 0; hw < hugWant.length; hw++) { var hW = hugWant[hw], spW = C2.sweeps[hW[0]], kW = spW[0] + (spW[2] || 0), ext = null;
    for (var fW = spW[0] - 2; fW <= kW + 12; fW++) { var jW = fW - f0; if (jW < 0 || jW >= xAbs.length) continue;
      if (ext === null || (hW[2] < 0 ? xAbs[jW] < ext : xAbs[jW] > ext)) ext = xAbs[jW]; }
    if (ext === null) continue; var miss = hW[2] * (hW[1] - ext);   // > 0: turned short of the target
    if (miss > 0) HUGC[hW[0]] = (HUGC[hW[0]] || 0) + hW[2] * miss;
    rep.hugReached.push([hW[0], Math.round(hW[1]), Math.round(ext)]); }
  for (var fa = 0; fa < times.length; fa++) as.push(f0 + fa < fH ? sim.devR[fa] : sim.r[fa]);   // deviation from the keys, then the absolute angle
  dxS.setValuesAtTimes(times, dxs); dyS.setValuesAtTimes(times, dys); phS.setValuesAtTimes(times, as);   // linear keys, one per frame; the last one holds
  // the pin = the bar's top end at the switch: centre + (sin phi0, -cos phi0) x half the cursor (local +y = (-sin, cos))
  fxX.property("sim pivot dx (px, cuit)").property(1).setValue(Math.sin(phi0) * C2.bar.sweepH / 2);
  fxX.property("sim pivot dy (px, cuit)").property(1).setValue(-Math.cos(phi0) * C2.bar.sweepH / 2);
  var bfxO = bar.property("ADBE Effect Parade");
  bfxO.property("orbite x0 (px, mesure au build)").property(1).setValue(ox0); bfxO.property("orbite y0 (px, mesure au build)").property(1).setValue(oy0); bfxO.property("orbite a0 (deg, mesure au build)").property(1).setValue(0);
  rep.pivot = [Math.round(phi0 * 1800 / Math.PI) / 10, Math.round(Math.sin(phi0) * C2.bar.sweepH / 2 * 10) / 10]; rep.orbitStart = [Math.round(ox0), Math.round(oy0)];
  var iS = fH - f0; rep.switchAngles = { frameOffset: rT(tH), TRbefore: Math.round(TR[iS - 1] * 10) / 10, TRat: TR[iS], rBefore: Math.round(sim.r[iS - 1] * 10) / 10, rAt: Math.round(sim.r[iS] * 10) / 10, devBefore: Math.round(sim.devR[iS - 1] * 10) / 10 };
  // each sweep word comes in on the frame the PIN actually turns (the follower arrives after its key): coming in on the key
  // showed a sliver of the next word for a frame or two while the bar was still on its way (2026-09-25 n)
  rep.turns = [];
  for (var sw2 = 1; sw2 < C2.sweeps.length - 1; sw2++) { var wl2 = null; for (var lk = 1; lk <= comp.numLayers; lk++) if (comp.layer(lk).name.indexOf("SCAN " + (nV + sw2 + 1) + " - ") == 0) wl2 = comp.layer(lk);
    if (!wl2) continue; var ks = C2.sweeps[sw2][0] + (C2.sweeps[sw2][2] || 0), best = ks, bx = null;
    for (var fk = ks - 2; fk <= ks + 10; fk++) { var jx = fk - f0; if (jx < 0 || jx >= xAbs.length) continue; var xv = xAbs[jx];
      if (bx === null || (sideV(C2.sweeps[sw2]) < 0 ? xv < bx : xv > bx)) { bx = xv; best = fk; } }
    // (setting inPoint on these layers MOVED their outPoint by the same amount - measured 2026-09-25 o: "l'IA..." ran 2
    // frames past the morph and doubled up with the counter's "IA..." - so the outPoint is put back)
    var keepOut = wl2.outPoint; wl2.inPoint = T(best); wl2.outPoint = keepOut; rep.turns.push([wl2.name, ks, best]);
    // CUT: the word before goes as this one comes in - a 3-frame fade from this word's first frame, then gone
    if (C2.sweeps[sw2][4]) { var ol = null; for (var lo2 = 1; lo2 <= comp.numLayers; lo2++) if (comp.layer(lo2).name.indexOf("SCAN " + (nV + sw2) + " - ") == 0) ol = comp.layer(lo2);
      if (ol) { while (ol.opacity.numKeys) ol.opacity.removeKey(1);
        ol.opacity.setValueAtTime(T(best), 100); ol.opacity.setValueAtTime(T(best + 3), 0); ol.outPoint = T(best + 3); rep.turns.push(["cut " + ol.name, best, best + 3]); } } }
  // the typed line ends the frame the bar is leftmost (the spring's own minimum, not the key's): once erased, gone -
  // the light appears there too (its amount grows from its own in point)
  var fMin = f0, xMin = 1e9; for (var j = 0; j < xAbs.length && T(f0 + j) < tH; j++) if (xAbs[j] < xMin) { xMin = xAbs[j]; fMin = f0 + j; }
  L3.outPoint = T(fMin + 1); lpos.inPoint = lpre.inPoint = cache.inPoint = L3.outPoint;
  var mx = 0, my = 0, ma = 0; for (var m2 = 0; m2 < dxs.length; m2++) { mx = Math.max(mx, Math.abs(dxs[m2])); my = Math.max(my, Math.abs(dys[m2])); }
  rep.sim = { W0: Math.round(Wb * 10) / 10, x0: Math.round(x0 * 10) / 10, keys: times.length, maxDev: [Math.round(mx), Math.round(my)], eraseEndF: fMin + 1 };
}
// the WIDTH of the bar's half (E) and the sweep origin are live too: E from W0, the origin from where u leaves the cursor
nX.position.expression = W0 + 'var L = thisComp.layer(' + q(C2.line) + '); var sc = L.scale[0] / 100;\nvar Wf = ' + W("_measure L3 full") + ';\nvar x;\n' +
  'if (time < ' + tE.toFixed(4) + ') {\n  var xl = 0; try { xl = L.text.animator("Line - Position").property.position[0]; } catch (e) {}\n  ' +
  typedWidth("L3 typed (chars)") + '  x = L.position[0] + sc * (xl + (-Wf / 2 + Wt + ' + C2.bar.gap + '));\n' +
  '} else {   // the target (keys, live widths) + the mass\'s deviation from it (spring, drift - baked)\n' +
  '  var u = effect("u (demi-largeurs)")("Slider"), base, tH = ' + tH.toFixed(4) + ';\n' +
  '  if (time < tH) base = sc * u * (Wf / 2 + ' + C2.bar.gap + ');\n' +
  '  else { var E = W0() / 2, x0 = L.scale.valueAtTime(tH)[0] / 100 * u.valueAtTime(tH) * (Wf / 2 + ' + C2.bar.gap + ');\n' +
  '    base = effect("v (balayage, demi-barres)")("Slider") * E + x0 - (' + sideV(C2.sweeps[0]) + ') * E + effect("sim pivot dx (px, cuit)")("Slider"); }   // the pin: the bar\'s real top end\n' +
  '  x = L.position[0] + base + effect("sim dx (px, cuit)")("Slider");\n' +
  '  // the finale: the target is the orbit\'s pin (see ORB); the baked deviation carries the physics on top\n' +
  '  var yb = L.transform.position.valueAtTime(0)[1];\n' + ORB +
  '  if (time >= ' + tgF + ') x = ORBx + effect("sim dx (px, cuit)")("Slider");\n}\n[x, 0]';

// Y: cap line, down to the underline; then the jumps (parabolas between bounces and apexes); the hold at the last apex;
// the pivot stays there through the fall, drops to the cap line as the bar retracts; a slow drift up to the end
nY.position.dimensionsSeparated = true;
var pY = nY.property("ADBE Transform Group").property("ADBE Position_1"); nY.property("ADBE Transform Group").property("ADBE Position_0").setValue(0);
keys(pY, [[C2.yLeave[0], yCap, C2.yLeave[1], 33.333]]);
// keys are the bar's CENTRE height; from tH the rectangle hangs from its top end, so the null carries that end: the
// expression lifts it by half the cursor's height at that instant (nothing moves on screen)
var VT = C2.vert, tDip = T(VT.dip), tTop1 = T(VT.top1);
pY.setValueAtTime(tDip, yDown); pY.setValueAtTime(tTop1, yUp);
easeKey(pY, pY.nearestKeyIndex(tDip), 40, 40);                       // the dip below the text: a quick turn
// the read of "le texte": a slow creep upward (its previous direction), then the mirrored dip down to the cap line
var crawl = -VT.pauseDrift / (tM0 - tTop1);
var yM = [[M0, yUp - VT.pauseDrift, 75, 33.333], [M0 + (G1 - VT.dip), yDown, 40, 40], [M1, yCap, 33.333, C2.yLeave[1]]];
keys(pY, yM);
speedKey(pY, pY.nearestKeyIndex(tTop1), 0, 75, crawl, 33.333); speedKey(pY, pY.nearestKeyIndex(tM0), crawl, 33.333, 0, 75);
// to the end: the cursor keeps creeping up through the sweeps and closes where it is (the finale no longer slides it out)
var FN = C2.finale, tEndK = T(C2.totalFrames - 1), creep = -C2.endDrift / (tEndK - tH);
pY.setValueAtTime(tEndK, yCap - C2.endDrift);
speedKey(pY, pY.nearestKeyIndex(tH), 0, C2.yLeave[1], creep, 33.333); speedKey(pY, pY.nearestKeyIndex(tEndK), creep, 33.333, creep, 33.333);
// (2026-09-25 h: "the font changed and the cursor bar is now off on the y vertical position ... so it coincides with
// text") - the keys hold the heights measured at build (band top - over, cap line, band bottom + over); the expression
// maps them piecewise-linearly onto the SAME points measured LIVE on the prefix layer's full line (asked at a fixed
// time, so AE's cache answers the repeats) - a font or size change moves the whole vertical scan with the text.
// Outside the band (the finale's exit) the offset carries on 1:1.
pY.expression = '// heights follow the LIVE text band: build-time points -> the same points measured now (font / size changes)\n' +
  'var L = thisComp.layer(' + q(C2.line) + '), H = thisComp.layer(' + q(PREFIX) + '), n = String(L.text.sourceText).length;\n' +
  'var r = H.sourceRectAtTime(n / 1000, false), yb = L.transform.position.valueAtTime(0)[1];\n' +
  'var rH = thisComp.layer(' + q(CAPH) + ').sourceRectAtTime(0, false);   // the capital height: the middle line is baseline - H / 2\n' +
  'var up = yb + r.top - ' + (C2.yTopPad + C2.over) + ', cap = yb + rH.top + rH.height / 2, dn = yb + ' + (C2.yBottomPad + C2.over) + ';\n' +
  'var U0 = ' + yUp.toFixed(3) + ', C0 = ' + yCap.toFixed(3) + ', D0 = ' + yDown.toFixed(3) + ', v = value, y;\n' +
  'if (v <= U0) y = up + (v - U0); else if (v >= D0) y = dn + (v - D0);\n' +
  'else y = v < C0 ? up + (v - U0) * (cap - up) / (C0 - U0) : cap + (v - C0) * (dn - cap) / (D0 - C0);\n' +
  '// + the mass\'s deviation from that target (spring, drift - baked); from the mirror\'s end the bar hangs from its top\n// end (the pendulum\'s pin): the null carries that end\n' +
  'var X = thisComp.layer("BARRE X");\n' +
  'var dy = X.effect("sim dy (px, cuit)")("Slider");\n' +
  'y = y + dy + (time >= ' + tH.toFixed(4) + ' ? X.effect("sim pivot dy (px, cuit)")("Slider") : 0);\n' + ORB +
  '// the finale: the target is the orbit\'s pin (see ORB); the baked deviation carries the physics on top\n' +
  'if (time >= ' + tgF + ') y = ORBy + dy;\ny';

// BARRE: rotation (keys, then the pendulum expression from the hinge), length (slider + expression), pivot offset
keys(bar.rotation, C2.rotKeys);
keys(bar.rotation, mirrorKeys(C2.rotKeys, function (r) { return -180 - r; }));   // -90 -> -85 -> -180: on to vertical, right of the text
bar.rotation.expression = '// until the mirror ends: the keys + a torsion spring\'s deviation from them (lag, overshoot, drift); from then: the\n' +
  '// cursor hanging from its top end - a rod pendulum forced by its pivot\'s acceleration,\n' +
  '// phi\'\' = -(3 (g - a_y) / 2 L) sin(phi) + lag (3 / 2 L) a_x cos(phi) - c phi\' - both baked (see BARRE X)\n' +
  'var s = ' + SIMA + ';\n' +
  '// from the mirror\'s end the baked angle is absolute (0 = hanging down, rectangle on local +y): the pendulum, then the\n' +
  '// spring following the orbit\'s tangent (rotation = the polar angle), lag, lean and settle included\n' +
  'time < ' + tH.toFixed(4) + ' ? value + s : s';
if (bar.rotation.expressionError) rep.errors.push("bar rotation: " + bar.rotation.expressionError);
var size = gc.property(1).property("ADBE Vector Rect Size"), rpos = gc.property(1).property("ADBE Vector Rect Position");
// the rectangle's centre: at the layer origin until the hinge, then half a length along +y so the pivot end IS the origin
// (at rotation -90 local +y points right: the bar extends right of its pinned left end; at 0 it hangs down)
rpos.expression = 'time < ' + tH.toFixed(4) + ' ? [0, 0] : [0, content("bar").content(1).size[1] / 2]';
// length: a slider keyed in NOMINAL px (760 = the full length W0, whatever the words measure), the cursor growing from
// nothing at the first typed letter; from the hinge the bar retracts to the cursor over `shrink`; at the end, to nothing
bar.property("ADBE Effect Parade").addProperty("ADBE Slider Control").name = "longueur (px nominal)";
bar.property("ADBE Effect Parade").addProperty("ADBE Slider Control").name = "W0 (px, mesure au build)";   // set by bakeSim
var lenS = bar.property("ADBE Effect Parade").property("longueur (px nominal)").property("ADBE Slider Control-0001");
keys(lenS, [[C2.switchF, 0, 33.333, 33.333], [C2.switchF + C2.bar.growIn, C2.bar.capH, 33.333, 75]]);
keys(lenS, C2.lenKeys, function (vv) { return C2.bar.capH + (C2.bar.len - C2.bar.capH) * vv; });
// the mirror shrinks it back - to the taller sweeping cursor (sweepH), not to the typing cursor
keys(lenS, mirrorKeys(C2.lenKeys, function (vv) { return vv > 0.5 ? C2.bar.len : C2.bar.sweepH; }));
size = bar.property("ADBE Root Vectors Group").property("bar").property("ADBE Vectors Group").property(1).property("ADBE Vector Rect Size");
// nominal px map to real px as they are up to the sweeping cursor's height, then scale to W0 at `nom`
size.expression = 'var v = effect("longueur (px nominal)")("Slider"), c0 = ' + C2.bar.sweepH + ', nom = ' + C2.bar.len + ', tH = ' + tH.toFixed(4) + ';\n' + W0 +
  'var Wb = W0(), L;\nif (time < tH) L = v <= c0 ? v : c0 + (Wb - c0) * (v - c0) / (nom - c0);\n' +
  'else L = c0;   // the sweeping cursor\n' + FIN +
  '// the finale: grows into the horizontal bar under the counter, then closes to its centre while the count runs\n' +
  'if (fu > 0) L = L + (Lc - L) * fu;\n' +
  (FZ.orbit ? '' : '// no orbit: the hanging cursor itself closes (up to its pin) and is gone\nL = L * (1 - cu);\n') +
  '[' + C2.bar.thick + ', L]';
if (size.expressionError) rep.errors.push("bar length: " + size.expressionError);
if (rpos.expressionError) rep.errors.push("bar pivot: " + rpos.expressionError);
bar.opacity.expression = 'var C = thisComp.layer("CONTROLS"); var t1 = C.effect("L3 typed start (s)")("Slider") + C.effect("L3 typed duration (s)")("Slider"), t2 = ' + T(C2.readHoldEnd).toFixed(4) + ';\nif (time > t1 && time < t2) (Math.floor((time - t1) * ' + C2.bar.blinkHz + ' * 2) % 2 == 0 ? 100 : 0); else 100';
bar.moveBefore(nY);
bar.outPoint = T(C2.finale.close[1] + 1);

// ---------------------------------------------------------------- BARRE LUMIERE: the light (tutorial "Animate Light to
// Control Your Viewer", no plugins): a copy of the line carrying CC Radial Fast Blur (rays from a light position),
// two Glows (radius small then higher threshold), a second Radial Fast Blur in "Brightest" with its centre offset (a
// second light source), a wide faint Glow; the light position is a null. MEASURED 2026-09-24: CC Radial Fast Blur
// streams the rays AWAY from its centre. So the light source sits on the FAR side of the bar from the text, at a
// distance proportional to bar-to-text (`pull`, capped by `lead`): the rays pass through the bar and fall on the text.
// The target is the centre of the VISIBLE text: while LIGNE 3 exists, the typed part left of the cursor; afterwards
// the text band centre (every scan word is centred). When the bar crosses that centre the offset passes through zero,
// so the light changes side smoothly instead of flipping; at the top and bottom peaks a lateral term (`tilt`,
// proportional to the height above/below the text) leans the rays a little. The bar stays on top as the crisp core.
// The light exists only once the typed line is gone (from L3's out point): the bar has just reversed at the left edge,
// the source is on its left, the rays stream right toward the text centre - and it grows in from 0 % of its length.
var lightIn = L3.outPoint;
var lpos = comp.layers.addNull(); lpos.name = "BARRE LUMIERE - position"; lpos.anchorPoint.setValue([0, 0]); lpos.shy = true;
lpos.position.setValue([0, 0]); lpos.inPoint = lightIn; lpos.outPoint = bar.outPoint;   // unparented: comp coordinates
lpos.property("ADBE Effect Parade").addProperty("ADBE Slider Control").name = "dist (px)";
var TGT = 'var B = thisComp.layer("BARRE"), E = thisComp.layer("MOTION - Echelle");\nvar p = B.toComp(B.content("bar").content(1).position);   // the bar\'s centre (the rectangle is re-anchored on its pivot end from the hinge)\n' +
  FIN + '// the aim: the text band\'s centre (every word is centred); through the finale it moves to the digits\' centre - the orbit\'s\n// centre - so the rays keep pointing at the counter while the bar orbits it (2026-09-25 p)\n' +
  'var tgY = ' + yCap.toFixed(2) + ' + (thisComp.layer(' + q(C2.line) + ').transform.position.valueAtTime(0)[1] + B.effect("orbite centre dy (px, mesure au build)")("Slider") - ' + yCap.toFixed(2) + ') * fu;\n' +
  'var tgt = E.toComp([' + (comp.width / 2) + ', tgY]);\nvar d = p - tgt, L = length(d);\n';
lpos.property("ADBE Effect Parade").property("dist (px)").property("ADBE Slider Control-0001").expression = '// bar to text-centre distance: the light dims to nothing as the bar crosses the text (the tutorial dims at the switch)\n' + TGT + 'L';
// (2026-09-25 k: "direction of rays should smartly move too depending on position and orientation of the bar") - the
// rays leave the bar along its own PERPENDICULAR (on the side away from the text; the side eases through zero as the
// bar crosses the text, so it never flips), blended with the bar-to-text direction; the source also slides along the
// bar by the bar's offset from the text along its axis, so the fan leans back toward the words
var LPOS_EXPR = '// the light source, in comp space: behind the bar (rays stream away from it through the bar onto the text), `pull` x\n' +
  '// the distance, never closer than minOff (a centre ON the content is a degenerate radial blur) nor farther than lead\n' + TGT +
  'var ax = B.toComp([0, 100]) - B.toComp([0, 0]), la = length(ax); ax = la > 0.001 ? ax / la : [1, 0];\n' +
  'var nrm = [-ax[1], ax[0]], s = clamp(dot(nrm, d) / 40, -1, 1);   // the bar\'s perpendicular, pointing away from the text\n' +
  'var dp = L > 0.5 ? d / L : [0, -1], dir = nrm * s * ' + C2.light.normalMix + ' + dp * (1 - ' + C2.light.normalMix + '), ld = length(dir);\n' +
  'dir = ld > 0.001 ? dir / ld : dp;\n' +
  'var dist = Math.max(' + C2.light.minOff + ', Math.min(' + C2.light.lead + ', L * ' + C2.light.pull + '));\n';
// (set again with the ray-angle master once "MASTER - lumière" exists - an expression that errors once stays disabled)
lpos.position.expression = LPOS_EXPR + 'p + dir * dist + ax * dot(ax, d) * ' + C2.light.tilt;
// The whole light is ONE shape layer in this comp - no precomp. A comp-sized BLACK rectangle under the thick copy of
// the bar gives the layer a full-frame effect buffer (an effect point is then a plain comp coordinate; on a bare shape
// layer the buffer is the content bounds grown by ~90 px and the rays flip side as the source comes close) and adds
// nothing in ADD mode. The earlier precomp + adjustment layer did the same job, but its expressions reached back into
// this comp (`comp("...")`) and that nested render came back wrong on random frames: the plain white adjustment solid,
// or another layer's text, flashed for one frame (2026-09-24, "there are artifacts and flashes"; with the RGB-split
// render comp every one-frame glitch became a coloured flash). No motion blur on the light: a blurred glow shows
// none, and it cost 16 sub-frame renders of the two radial blurs and three glows per frame.
var SRC = 'thisComp.layer("BARRE")', LPOS = 'thisComp.layer("BARRE LUMIERE - position")';
var oldPre = findComp("BARRE LUMIERE (pre)"); if (oldPre) oldPre.remove();   // left by builds before 2026-09-24
var lpre = comp.layers.addShape(); lpre.name = "BARRE LUMIERE"; lpre.motionBlur = false;
var lroot = lpre.property("ADBE Root Vectors Group");
// 1. the light line: the bar thickened (the tutorial's stroke 10), full opacity, warm, following the bar in world space
lroot.addProperty("ADBE Vector Group").name = "light line";
var lg = lroot.property("light line");
lg.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Rect"); lg.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill");
lg = lroot.property("light line");
lg.property("ADBE Vectors Group").property(2).property("ADBE Vector Fill Color").setValue(C2.light.fill);
lg.property("ADBE Vectors Group").property(1).property("ADBE Vector Rect Size").expression = 'var B = ' + SRC + ', s = B.content("bar").content(1).size;\nvar ws = length(B.toComp([0, 1]) - B.toComp([0, 0]));   // world scale (MOTION - Echelle)\n[s[0] * ' + C2.light.thick + ' * ws, s[1] * ws]';
var ltr = lg.property("ADBE Vector Transform Group");
ltr.property("ADBE Vector Position").expression = 'var B = ' + SRC + ';\nB.toComp(B.content("bar").content(1).position)';
ltr.property("ADBE Vector Rotation").expression = '// world angle of the bar (its own rotation plus the shake roll), unwrapped so it never jumps by 360\nvar B = ' + SRC + ', a = B.toComp([0, 0]), b = B.toComp([0, 100]);\nvar r = radiansToDegrees(Math.atan2(b[1] - a[1], b[0] - a[0])) - 90;\nif (r < -180) r += 360;\nr';
// 2. the frame: four 2 px BLACK dots in the comp's corners, below the line (contents render top-down). They stretch the
// layer's content bounds - and so its effect buffer - to the whole frame while the buffer stays TRANSPARENT inside, so
// the blurs and glows see the line over nothing, as they did on the adjustment layer; black adds nothing in ADD.
// (A comp-sized black rectangle was tried first: full buffer, but the rays came out 4-10 x dimmer - the effects then
// blur the line into opaque black - and a 1 % rectangle tinted every half-plane grey over transparency.)
lroot.addProperty("ADBE Vector Group").name = "cadre (4 points noirs)";
var lf = lroot.property("cadre (4 points noirs)"), lfc = lf.property("ADBE Vectors Group");
for (var cd = 0; cd < 4; cd++) lfc.addProperty("ADBE Vector Shape - Rect");
lfc.addProperty("ADBE Vector Graphic - Fill");
lfc = lroot.property("cadre (4 points noirs)").property("ADBE Vectors Group");
var corners = [[1, 1], [comp.width - 1, 1], [1, comp.height - 1], [comp.width - 1, comp.height - 1]];
for (var cd2 = 0; cd2 < 4; cd2++) { lfc.property(cd2 + 1).property("ADBE Vector Rect Size").setValue([2, 2]); lfc.property(cd2 + 1).property("ADBE Vector Rect Position").setValue(corners[cd2]); }
lfc.property(5).property("ADBE Vector Fill Color").setValue([0, 0, 0, 1]);
lpre.anchorPoint.setValue([0, 0]); lpre.position.setValue([0, 0]);   // layer space = comp space
// 3. the tutorial's stack on the layer itself: rays, glow, glow (shape, coloured), rays 2 (brightest), wide glow
var lfx = lpre.property("ADBE Effect Parade");
lfx.addProperty("CC Radial Fast Blur"); lfx.addProperty("ADBE Glo2"); lfx.addProperty("ADBE Glo2"); lfx.addProperty("CC Radial Fast Blur"); lfx.addProperty("ADBE Glo2");
lfx.addProperty("ADBE Ramp");   // last: the master gradient recolours the whole light (driven from "MASTER - lumière", below)
lfx = lpre.property("ADBE Effect Parade");   // re-fetch after the adds
lfx.property(1).name = "Light rays"; lfx.property(2).name = "Light glow"; lfx.property(3).name = "Light shape"; lfx.property(4).name = "Light rays 2 (brightest)"; lfx.property(5).name = "Light wide";
lfx.property(6).name = "Dégradé lumière (master)";
lfx = lpre.property("ADBE Effect Parade");
function lp(e, n){ return lfx.property(e).property(n); }
var centre = LPOS + '.position';   // the buffer = the comp frame (black rectangle): comp coordinates
var DIST = 'var dist = ' + LPOS + '.effect("dist (px)")("Slider");\n';
// Amount: 0 -> 95 over growIn s after the light appears (it grows in from nothing), 0 again as the bar crosses the text
// (the light's in point is a build-time constant: an expression that errors once is disabled by AE)
var AMT = DIST + 'var t0 = inPoint;   // the light\'s own in point: set where the spring leaves the bar leftmost (bakeSim)\nvar g = linear(time, t0, t0 + ' + C2.light.growIn + ', 0, 1);\n' + C2.light.amount + ' * g * ease(dist, 0, ' + (C2.light.fadeDist * 1.3).toFixed(0) + ', 0, 1)';
lp("Light rays", "Center").expression = centre; lp("Light rays", "Amount").expression = AMT;
lp("Light glow", "Glow Radius").setValue(0); lp("Light glow", "Glow Intensity").setValue(C2.light.glow1);
lp("Light shape", "Glow Threshold").setValue(C2.light.glow2Threshold); lp("Light shape", "Glow Radius").setValue(0); lp("Light shape", "Glow Intensity").setValue(C2.light.glow2);
// the colour: bright (near the bar) = colour A (red-orange), dim (the tips) = colour B (orange)
lp("Light shape", "Glow Colors").setValue(2); lp("Light shape", "Color A").setValue(C2.light.colorA); lp("Light shape", "Color B").setValue(C2.light.colorB);
// second light source, offset ALONG THE BEAM (the tutorial moves its y "to open the light up": a second cone, more depth)
lp("Light rays 2 (brightest)", "Center").expression = 'var Bq = ' + SRC + '.toComp([0, 0]), S = ' + centre + ';\nvar dn = S - Bq, Ld = length(dn); dn = Ld > 0.5 ? dn / Ld : [0, -1];\nS + dn * ' + C2.light.spread;
lp("Light rays 2 (brightest)", "Amount").expression = AMT; lp("Light rays 2 (brightest)", "Zoom").setValue(2);
lp("Light wide", "Glow Radius").setValue(C2.light.glowWideRadius); lp("Light wide", "Glow Intensity").setValue(C2.light.glowWide);
// (a Fractal Noise haze multiplied into the beam was tried and rejected 2026-09-24: "the texture added to light is not good")
// 4. the layer: ADD, subtle, a faint flicker, off across the text crossing and with the bar
lpre.opacity.expression = '// the tutorial switches the light off at the switch of side (here: as the bar crosses the text); out with the bar\n' +
  'var dist = thisComp.layer("BARRE LUMIERE - position").effect("dist (px)")("Slider");\n' +
  'var bl = thisComp.layer("BARRE").content("bar").content(1).size[1];\n' +
  'seedRandom(7); var fl = 1 + (wiggle(' + C2.light.flicker.hz + ', ' + C2.light.flicker.pct + ') - value) / 100;   // a lamp\'s faint flicker\n' +
  'thisComp.layer("BARRE").opacity * ' + (C2.light.opacity / 100) + ' * fl * ease(dist, 0, ' + C2.light.fadeDist + ', 0, 1) * ease(bl, 0, 150, 0, 1)';
lpre.inPoint = lightIn; lpre.outPoint = bar.outPoint; lpre.blendingMode = BlendingMode.ADD;
if (lp("Light rays", "Center").expressionError) rep.errors.push("light centre: " + lp("Light rays", "Center").expressionError);
if (lp("Light rays", "Amount").expressionError) rep.errors.push("light amount: " + lp("Light rays", "Amount").expressionError);
var lposErr = lpos.position.expressionError || ""; if (lposErr && lposErr.indexOf("MOTION - Echelle") < 0) rep.errors.push("light position: " + lposErr);   // the rig comes in the next builder
// The light must start AT the bar (the tutorial contains its box light with a matte): a track matte, applied after the
// effects unlike a mask, keeps only the half-plane on the text side of the bar's edge
var cache = comp.layers.addShape(); cache.name = "BARRE LUMIERE - cache"; cache.shy = true; cache.motionBlur = false;
cache.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group").name = "demi-plan";
var cgc = cache.property("ADBE Root Vectors Group").property("demi-plan").property("ADBE Vectors Group");
cgc.addProperty("ADBE Vector Shape - Group"); cgc.addProperty("ADBE Vector Graphic - Fill");
cgc = cache.property("ADBE Root Vectors Group").property("demi-plan").property("ADBE Vectors Group");
cgc.property(2).property("ADBE Vector Fill Color").setValue([1, 1, 1, 1]);
cgc.property(1).property("ADBE Vector Shape").expression = '// the half-plane beyond the bar\'s edge on the text side (comp coordinates: this layer sits at the origin)\n' +
  'var B = thisComp.layer("BARRE"), c0 = B.toComp([0, 0]), c = B.toComp(B.content("bar").content(1).position), ax = B.toComp([0, 100]) - c0; ax = ax / Math.max(1, length(ax));\n' +
  'var n = c - thisComp.layer("BARRE LUMIERE - position").position, Ln = length(n); n = Ln > 0.5 ? n / Ln : [0, -1];\n' +
  'var th = B.content("bar").content(1).size[0] / 2 * length(B.toComp([1, 0]) - c0);\nvar e = c + n * th;\n' +
  // (2026-09-26: "the light is bleeding all the way to the top and all the way to the bottom, and it's cut ... as if the
  // bar cursor had some continuity") - the half-plane ran 20000 px along the bar's line, so past the bar's ends the glow
  // was sliced along that invisible extension. Now the cut is only as long as the bar (+ endPad), the lit zone widens
  // with the rays' fan (fan x depth) and the Directional Blur below (along the bar's axis) fades its two ends
  '// only along the bar: its half-length + endPad at the bar, widening with the rays\' fan further out\n' +
  'var hl = length(B.toComp(B.content("bar").content(1).position + [0, B.content("bar").content(1).size[1] / 2]) - c), D = 2200;\n' +
  'var s0 = hl + ' + C2.light.endPad + ', s1 = s0 + D * ' + C2.light.fan + ';\n' +
  'createPath([e + ax * s0, e - ax * s0, e - ax * s1 + n * D, e + ax * s1 + n * D], [], [], true)';
cache.anchorPoint.setValue([0, 0]); cache.position.setValue([0, 0]); cache.inPoint = lightIn; cache.outPoint = bar.outPoint;
cache.property("ADBE Effect Parade").addProperty("ADBE Motion Blur").name = "fondu des bouts (le long de la barre)";
(function () { var db = cache.property("ADBE Effect Parade").property("fondu des bouts (le long de la barre)");
  // Direction 0 blurs vertically: the bar's axis angle from vertical; blurring ALONG the axis leaves the edge parallel to
  // the bar (the cut at the bar) sharp and softens only the two ends
  db.property(1).expression = 'var B = thisComp.layer("BARRE"), a = B.toComp([0, 100]) - B.toComp([0, 0]);\nradiansToDegrees(Math.atan2(a[0], -a[1]))';
  db.property(2).setValue(C2.light.endSoft); })();
if (cgc.property(1).property("ADBE Vector Shape").expressionError) rep.errors.push("light cache: " + cgc.property(1).property("ADBE Vector Shape").expressionError);
cache.moveBefore(lpre); lpre.setTrackMatte(cache, TrackMatteType.ALPHA);
lpre.moveAfter(bar); cache.moveAfter(bar);

// ---------------------------------------------------------------- LIGNE 3 erase: mask cut exactly at the bar
var m = L3.property("ADBE Mask Parade").addProperty("ADBE Mask Atom"); m.name = "Erase (bar)";
m = L3.property("ADBE Mask Parade").property("Erase (bar)");
m.property("ADBE Mask Feather").setValue([C2.featherErase, 0]);
m.property("ADBE Mask Shape").expression = '// everything right of the bar is erased (from the moment the bar stops being the cursor)\n' +
  'var p = fromComp(thisComp.layer("BARRE").toComp([0, 0]));\nvar B = 20000, x = (time < ' + T(C2.readHoldEnd).toFixed(4) + ') ? B : p[0];\n' +
  'createPath([[-B, -B], [x, -B], [x, B], [-B, B]], [], [], true)';
if (m.property("ADBE Mask Shape").expressionError) rep.errors.push("erase mask: " + m.property("ADBE Mask Shape").expressionError);

// ---------------------------------------------------------------- SCAN words: each visible on the side the bar has passed
// Sweep i goes from turn i-1 to turn i. Up sweep: the new word is below the bar; the next sweep comes back down,
// and the part still below the bar is exactly the part it has not reached - so a word keeps ONE side for its life.
// Vertical words (the jumps): side = below (+1) for a rise, above (-1) for a fall; the mask cuts at the bar's y.
// Horizontal words (the sweeps): side = left (-1) for a rightward sweep, right (+1) for a leftward one; cut at the
// bar's x (the pivot = the cursor). The last vertical word lives BELOW the bar until the hinge and to the RIGHT of
// the pivot after it (the pivot hangs at the far left, so nothing changes on screen), and the first sweep wipes it.
// the two vertical words: [in frame, side, out frame] - "le texte" below the bar from the dip (revealed by the rise,
// taken back by the mirror), "que tu vois" above it from the top (revealed by the mirror: above the bar while it
// comes down, LEFT of it once it stands right of the text) and wiped by the first sweep
var vWords = [[C2.vert.dip, 1, M1], [G1, -1, C2.sweeps[1][0]]], nV = 2;
var FNc = C2.finale, cx = comp.width / 2;
// (2026-09-25 e: "le texte should appear based on the actual bar line") - the vertical words cut along the bar's OWN
// line at its real angle (it tilts while the cursor turns), not a flat line at the bar's centre y. The side is taken
// relative to the bar's local +y, so through the mirror (-90 -> -180) "below" turns into "right of the bar" and
// "above" into "left of it" with it. The last vertical word, from the mirror's end, is cut at the cursor's x like the
// sweep words (the pendulum's lean must not tilt it), on the side away from where the first sweep starts.
function vMaskExpr(lastV) { return '// the word shows on the side of the bar\'s own line the bar has passed, at the bar\'s real angle\n' +
  'var B = thisComp.layer("BARRE"), P = B.toComp([0, 0]), Q = B.toComp([0, 100]), G = 20000;\n' +
  'var a = Math.atan2(Q[1] - P[1], Q[0] - P[0]), side = effect("cote (1 bas-droite / -1 haut-gauche)")("Slider");\n' +
  (lastV ? 'if (time >= ' + tH.toFixed(4) + ') { var p = fromComp(P), sx = ' + (-sideV(C2.sweeps[0])) + ';   // from the mirror\'s end: cut at the cursor\'s x, wiped by the first sweep\n' +
    '  sx > 0 ? createPath([[p[0], -G], [G, -G], [G, G], [p[0], G]], [], [], true) : createPath([[-G, -G], [p[0], -G], [p[0], G], [-G, G]], [], [], true);\n} else {\n' : '') +
  'var dx = Math.cos(a), dy = Math.sin(a), nx = -dy * side, ny = dx * side;\n' +
  'var A = [P[0] - dx * G, P[1] - dy * G], E = [P[0] + dx * G, P[1] + dy * G];\n' +
  'createPath([fromComp(A), fromComp(E), fromComp([E[0] + nx * G, E[1] + ny * G]), fromComp([A[0] + nx * G, A[1] + ny * G])], [], [], true);' + (lastV ? '\n}' : ''); }
for (var s = 0; s < C2.words.length; s++) {
  var vertical = s < nV, isLastPass = false, side, axe, inF, outF;
  if (vertical) { side = vWords[s][1]; axe = 0; inF = vWords[s][0]; outF = vWords[s][2]; }
  else { var i = s - nV; side = C2.sweeps[i + 1][1] == "right" ? -1 : 1; axe = 1; inF = C2.sweeps[i][0];
    isLastPass = i + 2 >= C2.sweeps.length; outF = isLastPass ? FNc.morph + FNc.fadeF + 1 : C2.sweeps[i + 2][0];   // the last word fades out from the morph frame
    if (i > 0 && C2.sweeps[i][1] == C2.sweeps[i + 1][1]) throw new Error("sweeps must alternate"); }
  var Ls = comp.layers.addText(C2.words[s]); Ls.name = "SCAN " + (s + 1) + " - " + C2.words[s]; styleLike(L3, Ls);
  addCheckbox(Ls, MASTER_CHK, 1);   // before the expression: an expression that errors once is disabled
  if (isLastPass) { Ls.opacity.setValueAtTime(T(FNc.morph), 100); Ls.opacity.setValueAtTime(T(FNc.morph + FNc.fadeF), 0); }
  if (false) { var cc = null;   // (the digit counter's text expression, kept for reference until the loading bar is approved)
    // (the words "digital counter" in the first line are the marker preserve_manual.jsx uses to leave this text alone)
    Ls.property("ADBE Text Properties").property("ADBE Text Document").expression = '// digital counter - the last word turns into the counter ONE CHARACTER AT A TIME (every stepF frames: "L\'" goes, I -> 0, A -> 0, "..." -> "%"),\n' +
      '// each change flickering through random digits first; then the count: 0 -> ' + cc.to + ' on a monotone spline (slow, fast, slow)\n' +
      '// once per frame: motion blur re-evaluates the text at every sub-sample and blended different steps and flicker\n// digits into one smear (2026-09-25 o)\n' +
      'posterizeTime(1 / thisComp.frameDuration);\n' +
      'var fd = thisComp.frameDuration, sf = ' + FZ.stepF + ' * fd, fl = ' + FZ.flicker + ' * fd, tm = time - inPoint;\n' +
      'var STEPS = ' + JSON.stringify(FZ.steps) + ', FLK = ' + JSON.stringify(FZ.flickerAt) + ', morph = null;\n' +
      'var si = Math.floor(tm / sf);\n' +
      '// (tm >= -fd / 2: the first frame sits a hair before inPoint)\n' +
      'if (tm >= -fd / 2 && si < STEPS.length) { morph = STEPS[Math.max(0, si)]; var fi = FLK[Math.max(0, si)];\n' +
      '  if (fi >= 0 && tm - Math.max(0, si) * sf < fl) { seedRandom(Math.floor(time / fd), true); morph = morph.substr(0, fi) + Math.floor(random(10)) + morph.substr(fi + 1); } }\n' +
      'var N = ' + cc.to + ', t0 = inPoint + STEPS.length * sf + (' + T(cc.delayF).toFixed(4) + ')' + ', D = ' + T(cc.durF).toFixed(4) + ';\n' +
      'var u = Math.max(0, Math.min(1, (time - t0) / D));\n' +
      '// monotone cubic spline (Fritsch-Carlson) through the control points, end slopes halved for a soft start and finish\n' +
      'var P = ' + JSON.stringify(cc.curve) + ', n = P.length, d = [], m = [];\n' +
      'for (var i = 0; i < n - 1; i++) d.push((P[i + 1][1] - P[i][1]) / (P[i + 1][0] - P[i][0]));\n' +
      'm[0] = d[0] / 2; m[n - 1] = d[n - 2] / 2;\n' +
      'for (var j = 1; j < n - 1; j++) { m[j] = (d[j - 1] * d[j] <= 0) ? 0 : (d[j - 1] + d[j]) / 2; m[j] = Math.min(m[j], 3 * Math.min(d[j - 1], d[j])); }\n' +
      'var k = 0; while (k < n - 2 && u > P[k + 1][0]) k++;\n' +
      'var hh = P[k + 1][0] - P[k][0], tt = (u - P[k][0]) / hh, t2 = tt * tt, t3 = t2 * tt;\n' +
      'var cnt = (2 * t3 - 3 * t2 + 1) * P[k][1] + (t3 - 2 * t2 + tt) * hh * m[k] + (-2 * t3 + 3 * t2) * P[k + 1][1] + (t3 - t2) * hh * m[k + 1];\n' +
      'var nn = Math.max(0, Math.min(N, Math.floor(cnt + 1e-6))), num = (nn < 10 ? "0" : "") + nn, pre = ' + q(cc.prefix) + ';   // always two digits: 00, 01 ...\n' +
      'var txt = morph !== null ? morph : pre + num + ' + q(cc.suffix) + ';\n' +
      STYLE_PICK + 'var res = st.setText(txt);\n' +
      '// every digit in its own face and size (letters, dots and "%" stay in the master font); untick to style them with the rest\n' +
      'try { if (effect(' + q(ZERO_O) + ')("Checkbox") > 0) for (var ci = 0; ci < txt.length; ci++) if ("0123456789".indexOf(txt.charAt(ci)) >= 0) res = res.setFont(' + q(cc.digitFont) + ', ci, 1).setFontSize(' + cc.digitSize + ', ci, 1); } catch (eF) {}\n' +
      'var dseg = 1; try { dseg = effect("Chiffres DSEG (0 = police du calque)")("Checkbox"); } catch (e3) {}\n' +
      'if (dseg > 0) {   // digital faces by expression; switch off to style the whole word in the Character panel\n' +
      '  try { res = res.setFont(' + q(cc.font) + ', pre.length, num.length); } catch (e) {}   // needs the range form of setFont (AE 24+) and the font installed\n' +
      (cc.fontSuffix ? '  try { res = res.setFont(' + q(cc.fontSuffix) + ', pre.length + num.length, ' + cc.suffix.length + '); } catch (e2) {}   // the "%" in the 14-segment face\n' : '') + '}\nres'; }
  else Ls.property("ADBE Text Properties").property("ADBE Text Document").expression = '// font, size, colour, tracking come from "STYLE - police (master)" while "Police master" is on; switch it off to style this\n// layer on its own in the Character panel\n' +
    STYLE_PICK + 'st.setText(String(value))';
  Ls.position.setValue([cx, yBase, 0]); Ls.inPoint = T(inF); Ls.outPoint = Math.min(comp.duration, T(outF));
  var fxs = Ls.property("ADBE Effect Parade"); fxs.addProperty("ADBE Slider Control").name = "axe (0 y / 1 x)"; fxs.addProperty("ADBE Slider Control").name = "cote (1 bas-droite / -1 haut-gauche)";
  fxs = Ls.property("ADBE Effect Parade"); fxs.property("axe (0 y / 1 x)").property("ADBE Slider Control-0001").setValue(axe); fxs.property("cote (1 bas-droite / -1 haut-gauche)").property("ADBE Slider Control-0001").setValue(side);
  var ms = Ls.property("ADBE Mask Parade").addProperty("ADBE Mask Atom"); ms.name = "Scan (bar)";
  ms = Ls.property("ADBE Mask Parade").property("Scan (bar)");
  ms.property("ADBE Mask Feather").setValue([C2.featherScan, C2.featherScan]);
  var lastV = vertical && s == nV - 1;
  if (vertical) { ms.property("ADBE Mask Shape").expression = vMaskExpr(lastV); if (ms.property("ADBE Mask Shape").expressionError) rep.errors.push(Ls.name + ": " + ms.property("ADBE Mask Shape").expressionError); continue; }
  ms.property("ADBE Mask Shape").expression = '// the word shows on the side of the bar the sweep has passed: below/above it (y cut) or left/right of it (x cut)\n' +
    'var p = fromComp(thisComp.layer("BARRE").toComp([0, 0])), G = 20000;\n' +
    'var axe = effect("axe (0 y / 1 x)")("Slider"), side = effect("cote (1 bas-droite / -1 haut-gauche)")("Slider");\n' +
    (lastV ? 'if (time >= ' + tH.toFixed(4) + ') { axe = 1; side = 1; }   // from the hinge: right of the pivot, wiped by the first sweep\n' : '') +
    (isLastPass ? 'if (time >= ' + T(FZ.glide[0]).toFixed(4) + ') p = [side > 0 ? -G + 1 : G - 1, p[1]];   // the finale glide must not cut the last word: fully shown from there\n' : '') +
    'if (axe < 0.5) (side > 0 ? createPath([[-G, p[1]], [G, p[1]], [G, G], [-G, G]], [], [], true) : createPath([[-G, -G], [G, -G], [G, p[1]], [-G, p[1]]], [], [], true));\n' +
    'else (side > 0 ? createPath([[p[0], -G], [G, -G], [G, G], [p[0], G]], [], [], true) : createPath([[-G, -G], [p[0], -G], [p[0], G], [-G, G]], [], [], true));';
  if (ms.property("ADBE Mask Shape").expressionError) rep.errors.push(Ls.name + ": " + ms.property("ADBE Mask Shape").expressionError);
}
// ---------------------------------------------------------------- THE LOADING BAR (replaces the digit counter, 2026-09-25 q)
// one shape layer centred on the text's middle line: n cases (a translucent base + a fill that grows from the left with the
// count), the inverted triangle cursor above the last full case. The count is a slider (the spline of the old counter,
// once per frame); the cursor's x is BAKED through the same critically damped follower as the bar (ae-pendulum-follow).
var LD = C2.loading, ldW = LD.n * LD.w + (LD.n - 1) * LD.gap, ldName = "SCAN " + (C2.words.length + 1) + " - chargement";
var ld = comp.layers.addShape(); ld.name = ldName; ld.anchorPoint.setValue([0, 0]); ld.position.setValue([cx, yCap, 0]);
ld.inPoint = T(FNc.morph); ld.outPoint = comp.duration; ld.motionBlur = true;
var ldfx = ld.property("ADBE Effect Parade"); ldfx.addProperty("ADBE Slider Control").name = "chargement (0-" + LD.to + ")"; ldfx.addProperty("ADBE Slider Control").name = "curseur x (px, cuit)";
var CNT = 'thisComp.layer(' + q(ldName) + ').effect("chargement (0-' + LD.to + ')")("Slider")';
ld.property("ADBE Effect Parade").property("chargement (0-" + LD.to + ")").property(1).expression = '// the count: 0 -> ' + LD.to + ' on a monotone spline (slow, fast, slow), from delayF after the bar appears; once per frame\n' +
  'posterizeTime(1 / thisComp.frameDuration);\n' +
  'var t0 = inPoint + ' + T(LD.delayF).toFixed(4) + ', D = ' + T(LD.durF).toFixed(4) + ', u = clamp((time - t0) / D, 0, 1);\n' +
  'var P = ' + JSON.stringify(LD.curve) + ', n = P.length, d = [], m = [];\n' +
  'for (var i = 0; i < n - 1; i++) d.push((P[i + 1][1] - P[i][1]) / (P[i + 1][0] - P[i][0]));\n' +
  'm[0] = d[0] / 2; m[n - 1] = d[n - 2] / 2;\n' +
  'for (var j = 1; j < n - 1; j++) { m[j] = (d[j - 1] * d[j] <= 0) ? 0 : (d[j - 1] + d[j]) / 2; m[j] = Math.min(m[j], 3 * Math.min(d[j - 1], d[j])); }\n' +
  'var k = 0; while (k < n - 2 && u > P[k + 1][0]) k++;\n' +
  'var hh = P[k + 1][0] - P[k][0], tt = (u - P[k][0]) / hh, t2 = tt * tt, t3 = t2 * tt;\n' +
  'clamp((2 * t3 - 3 * t2 + 1) * P[k][1] + (t3 - 2 * t2 + tt) * hh * m[k] + (-2 * t3 + 3 * t2) * P[k + 1][1] + (t3 - t2) * hh * m[k + 1], 0, ' + LD.to + ')';
// the same spline in the builder, for the cursor bake and the landing frame
function ldCount(f) { var u = Math.max(0, Math.min(1, (f - FNc.morph - LD.delayF) / LD.durF)), P = LD.curve, n = P.length, d = [], m = [];
  for (var i = 0; i < n - 1; i++) d.push((P[i + 1][1] - P[i][1]) / (P[i + 1][0] - P[i][0])); m[0] = d[0] / 2; m[n - 1] = d[n - 2] / 2;
  for (var j = 1; j < n - 1; j++) { m[j] = (d[j - 1] * d[j] <= 0) ? 0 : (d[j - 1] + d[j]) / 2; m[j] = Math.min(m[j], 3 * Math.min(d[j - 1], d[j])); }
  var k = 0; while (k < n - 2 && u > P[k + 1][0]) k++; var hh = P[k + 1][0] - P[k][0], tt = (u - P[k][0]) / hh, t2 = tt * tt, t3 = t2 * tt;
  return Math.max(0, Math.min(LD.to, (2 * t3 - 3 * t2 + 1) * P[k][1] + (t3 - 2 * t2 + tt) * hh * m[k] + (-2 * t3 + 3 * t2) * P[k + 1][1] + (t3 - t2) * hh * m[k + 1])); }
var fLandLd = FNc.morph + LD.delayF + LD.durF, per = LD.perCase, tRedF = fLandLd + LD.redDelayF, nGreen = Math.round(LD.to / per);
var ldRoot = ld.property("ADBE Root Vectors Group");
for (var ci = 0; ci < LD.n; ci++) { var xi = -ldW / 2 + LD.w / 2 + ci * (LD.w + LD.gap), gname = "case " + (ci + 1);
  ldRoot.addProperty("ADBE Vector Group").name = gname;
  var gv = ldRoot.property(gname).property("ADBE Vectors Group");
  gv.addProperty("ADBE Vector Shape - Rect"); gv.addProperty("ADBE Vector Graphic - Fill"); gv.addProperty("ADBE Vector Shape - Rect"); gv.addProperty("ADBE Vector Graphic - Fill");
  gv = ldRoot.property(gname).property("ADBE Vectors Group");
  gv.property(1).name = "remplissage"; gv.property(2).name = "remplissage couleur"; gv.property(3).name = "fond"; gv.property(4).name = "fond couleur";
  // the base: translucent off-white (contents render top-down: the fill sits above the base)
  gv.property(3).property("ADBE Vector Rect Size").setValue([LD.w, LD.h]); gv.property(3).property("ADBE Vector Rect Position").setValue([xi, 0]); gv.property(3).property("ADBE Vector Rect Roundness").setValue(LD.radius);
  gv.property(4).property("ADBE Vector Fill Color").setValue(LD.base.concat([1])); gv.property(4).property("ADBE Vector Fill Opacity").setValue(LD.baseOpacity);
  // the fill: green up to the 9th, the 10th red; grows from the case's left edge
  var isRed = ci >= nGreen;   // the cases past the count's end (9 and 10 at 80 %) fill red together after the last green one
  gv.property(2).property("ADBE Vector Fill Color").setValue((isRed ? LD.red : LD.green).concat([1]));
  gv.property(1).property("ADBE Vector Rect Roundness").setValue(LD.radius);
  // (2026-09-25 t: "the cursor should keep moving forward ... as if it was the driver, and the green filling should follow
  // and be gradual") - a green case fills from its left edge up to the CURSOR (its baked x): the cursor drives, the fill
  // trails it; the red ones fill at once, together, redDelayF frames after the count lands
  var fExpr = isRed ? 'var f = time - inPoint >= ' + T(tRedF - FNc.morph).toFixed(4) + ' ? 1 : 0;\n'
                    : 'var f = clamp((effect("curseur x (px, cuit)")("Slider") - ' + (xi - LD.w / 2) + ') / ' + LD.w + ', 0, 1);\n';
  // an empty case draws NO fill (2026-09-25 t: a 0.5 px sliver with 3 px rounded corners showed as "a weird vertical line")
  gv.property(1).property("ADBE Vector Rect Size").expression = '// how full this case is' + (isRed ? ' (red: all at once, after the count lands)' : ': up to the cursor, which drives the fill') + '\n' + fExpr + 'f < 0.02 ? [0, 0] : [f * ' + LD.w + ', ' + LD.h + ']';
  gv.property(1).property("ADBE Vector Rect Roundness").expression = fExpr + 'Math.min(' + LD.radius + ', f * ' + LD.w + ' / 2)';
  gv.property(1).property("ADBE Vector Rect Position").expression = fExpr + '[' + (xi - LD.w / 2) + ' + Math.max(0.01, f) * ' + (LD.w / 2) + ', 0]';
  // pop in, staggered, about the case's own centre
  var gt = ldRoot.property(gname).property("ADBE Vector Transform Group"), tp = FNc.morph + ci * LD.popStagger;
  gt.property("ADBE Vector Anchor").setValue([xi, 0]); gt.property("ADBE Vector Position").setValue([xi, 0]);
  gt.property("ADBE Vector Scale").setValueAtTime(T(tp), [0, 0]); gt.property("ADBE Vector Scale").setValueAtTime(T(tp + LD.popF * 0.6), [112, 112]); gt.property("ADBE Vector Scale").setValueAtTime(T(tp + LD.popF), [100, 100]); easyAll(gt.property("ADBE Vector Scale")); }
// the cursor: an inverted triangle, its apex `above` px over the top edge, on the baked x
ldRoot.addProperty("ADBE Vector Group").name = "curseur";
var cg = ldRoot.property("curseur").property("ADBE Vectors Group"); cg.addProperty("ADBE Vector Shape - Group"); cg.addProperty("ADBE Vector Graphic - Fill");
cg = ldRoot.property("curseur").property("ADBE Vectors Group");
var tri = new Shape(), cw = LD.cursor.w, ch = LD.cursor.h, yA = -LD.h / 2 - LD.cursor.above;
tri.vertices = [[-cw / 2, yA - ch], [cw / 2, yA - ch], [0, yA]]; tri.closed = true; cg.property(1).property("ADBE Vector Shape").setValue(tri);
cg.property(2).property("ADBE Vector Fill Color").setValue(LD.cursor.color.concat([1]));
var ct = ldRoot.property("curseur").property("ADBE Vector Transform Group");
ct.property("ADBE Vector Position").expression = '[effect("curseur x (px, cuit)")("Slider"), 0]';
var tpc = FNc.morph + LD.n * LD.popStagger; ct.property("ADBE Vector Scale").setValueAtTime(T(tpc), [0, 0]); ct.property("ADBE Vector Scale").setValueAtTime(T(tpc + LD.popF), [100, 100]); easyAll(ct.property("ADBE Vector Scale"));
// the cursor's x, baked: target = the top-right corner of the last FULL case (the left edge before any is full; it stays on
// the 9th, the 90 % mark), followed critically damped
(function () { var TXc = [], f0c = FNc.morph, fNc = C2.totalFrames;
  // continuous (2026-09-25 t): k = count / perCase in cases; the target glides across each case and its gap in proportion,
  // landing on the right edge of case k when the count reaches k x 10 (80 % = the 8th's top-right corner)
  for (var f = f0c; f <= fNc; f++) { var k = Math.min(nGreen, ldCount(f) / per); TXc.push(-ldW / 2 + k * (LD.w + LD.gap) - LD.gap * Math.min(1, k)); }
  var simc = physicsFollow({ fps: fps, f0: f0c, fN: fNc, tx: TXc, x: { w0: LD.cursor.w0, zeta: LD.cursor.zeta } });
  ld.property("ADBE Effect Parade").property("curseur x (px, cuit)").property(1).setValuesAtTimes(simc.times, simc.x);
  rep.loading = { width: ldW, lands: fLandLd, cursorEnd: Math.round(simc.x[simc.x.length - 1]), nGreen: nGreen }; })();
// the percentage above the cursor: a text layer parented to the bar, on the baked cursor x, floor(count) + "%", DrukCond;
// not a "SCAN" layer (no master gradient, no mask): white like the cursor, its own face and size
(function () { var PCT = LD.pct, pn = "CHARGEMENT - pourcentage";
  for (var pi = comp.numLayers; pi >= 1; pi--) if (comp.layer(pi).name == pn) comp.layer(pi).remove();
  var pt = comp.layers.addText(LD.to + "%"); pt.name = pn; var pst = pt.property("ADBE Text Properties").property("ADBE Text Document"), ptd = pst.value;
  ptd.font = PCT.font || comp.layer("STYLE - police (master)").property("ADBE Text Properties").property("ADBE Text Document").value.font; ptd.fontSize = PCT.size; ptd.fillColor = PCT.color; ptd.applyFill = true; ptd.applyStroke = false; ptd.justification = ParagraphJustification.CENTER_JUSTIFY; ptd.tracking = 0; pst.setValue(ptd);
  pt.parent = ld; pt.inPoint = ld.inPoint; pt.outPoint = ld.outPoint; pt.motionBlur = true; pt.anchorPoint.setValue([0, 0, 0]);
  pt.position.expression = '// above the cursor, on its baked x\n[thisComp.layer(' + q(ldName) + ').effect("curseur x (px, cuit)")("Slider"), ' + (-LD.h / 2 - LD.cursor.above - LD.cursor.h - PCT.above) + ']';
  pst.expression = '// the percentage: floor of the count, once per frame\nposterizeTime(1 / thisComp.frameDuration);\n' +
    (PCT.font ? 'text.sourceText.style' : '// the master font (STYLE - police), its own size and colour\nthisComp.layer("STYLE - police (master)").text.sourceText.style.setFontSize(' + PCT.size + ').setFillColor([' + PCT.color.join(', ') + '])') +
    '.setText(Math.floor(' + CNT + ' + 1e-6) + "%")';
  var tpp = FNc.morph + LD.n * LD.popStagger; pt.scale.setValueAtTime(T(tpp), [0, 0, 100]); pt.scale.setValueAtTime(T(tpp + LD.popF), [100, 100, 100]); easyAll(pt.scale);
  if (pst.expressionError) rep.errors.push("pct: " + pst.expressionError); if (pt.position.expressionError) rep.errors.push("pct pos: " + pt.position.expressionError);
  pt.moveBefore(ld); })();
if (ld.property("ADBE Effect Parade").property("chargement (0-" + LD.to + ")").property(1).expressionError) rep.errors.push("loading count: " + ld.property("ADBE Effect Parade").property("chargement (0-" + LD.to + ")").property(1).expressionError);
// the finale bar: as long as the loading bar + margin; the orbit's centre = the loading bar's centre (the text's middle line)
bar.property("ADBE Effect Parade").property("longueur finale (px, mesure au build)").property(1).setValue(ldW + FZ.margin); rep.finaleLen = Math.round(ldW + FZ.margin);
bar.property("ADBE Effect Parade").property("orbite centre dy (px, mesure au build)").property(1).setValue(yCap - yBase); rep.orbitCentreDy = Math.round(yCap - yBase);
rep.barErr = [nX.position.expressionError || "", bar.opacity.expressionError || ""];

// ---------------------------------------------------------------- MASTER controls (2026-09-25 g): "2 more master control -
// 1 to control the text gradient for all text ... 1 for the light's gradient color ... and the line's color if i want to
// make it different than the light". Two nulls, created ONCE with defaults and never rewritten by a rebuild (not in
// PM_PATTERNS): every value on them belongs to whoever edits the project. Everything else only reads them.
function ensureMaster(name, label, ctrls) {   // ctrls: [matchName, name, default]
  var M = null; for (var mi2 = 1; mi2 <= comp.numLayers; mi2++) if (comp.layer(mi2).name == name) M = comp.layer(mi2);
  if (!M) { M = comp.layers.addNull(); M.name = name; M.label = label; M.moveToBeginning(); }
  M.inPoint = 0; M.outPoint = comp.duration;
  for (var ci = 0; ci < ctrls.length; ci++) { var fxm = M.property("ADBE Effect Parade"); if (fxm.property(ctrls[ci][1])) continue;
    fxm.addProperty(ctrls[ci][0]).name = ctrls[ci][1]; M.property("ADBE Effect Parade").property(ctrls[ci][1]).property(1).setValue(ctrls[ci][2]); }
  return M; }
var MG = "MASTER - dégradé texte", MLI = "MASTER - lumière";
ensureMaster(MG, 11, [["ADBE Checkbox Control", "Dégradé actif", 1], ["ADBE Color Control", "Couleur A (début)", [1, 0.86, 0.35, 1]],
  ["ADBE Color Control", "Couleur B (fin)", [1, 0.55, 0, 1]], ["ADBE Angle Control", "Angle (0 = A en bas, B en haut)", 180],
  ["ADBE Slider Control", "Étendue (px)", 104], ["ADBE Slider Control", "Centre x (px)", 0], ["ADBE Slider Control", "Centre y (px, 0 = ligne de base)", -40],
  ["ADBE Slider Control", "Mélange (%)", 100]]);
ensureMaster(MLI, 11, [["ADBE Color Control", "Lumière couleur A (près de la barre)", C2.light.colorA.concat([1])], ["ADBE Color Control", "Lumière couleur B (pointes)", C2.light.colorB.concat([1])],
  ["ADBE Color Control", "Lumière couleur du coeur (rayons)", C2.light.fill], ["ADBE Checkbox Control", "Ligne = couleur A de la lumière", 0],
  ["ADBE Color Control", "Ligne couleur", C2.bar.fill], ["ADBE Slider Control", "Éclairage du texte (%)", 100], ["ADBE Slider Control", "Éclairage portée (px)", 260],
  // (2026-09-26: "a master to control the angle [of the light rays] ... a master to control the light rays gradient, not
  // parallel to the cursor but perpendicular ... choose the angle of the gradient") - short names: property("<name>") limits
  ["ADBE Angle Control", "Rayons rotation (0 = auto)", 0], ["ADBE Checkbox Control", "Rayons angle fixe (on/off)", 0],
  ["ADBE Angle Control", "Rayons angle fixe", 90],
  ["ADBE Checkbox Control", "Dégradé lumière actif", 1], ["ADBE Angle Control", "Dégradé angle (0 = perp.)", 0],
  ["ADBE Color Control", "Dégradé couleur barre", C2.light.colorA.concat([1])], ["ADBE Color Control", "Dégradé couleur fin", C2.light.colorB.concat([1])],
  ["ADBE Slider Control", "Dégradé étendue (px)", 320], ["ADBE Slider Control", "Dégradé mélange (%)", 100],
  // (2026-09-26: "change the light rays length so its longer or shorter with 1 setting") - 100 = as built
  ["ADBE Slider Control", "Rayons longueur (%)", 100]]);
// the text gradient: a Gradient Ramp on every text layer. On a text layer it keeps the glyphs' alpha AND the masks (measured
// 2026-09-25 g: the scan swipe still cuts the gradient word), so no matte is needed. Its points are in LAYER coordinates
// offset by the layer's own position (measured: a hard edge at position + [0, 0] sits exactly on the baseline) - so the
// gradient rides each word through its slides; centre and spread are in px from the baseline centre.
var GM = 'thisComp.layer(' + q(MG) + ').effect';
function rampPt(sign) { return 'var a = degreesToRadians(' + GM + '("Angle (0 = A en bas, B en haut)")("Angle")), e = ' + GM + '("Étendue (px)")("Slider") / 2;\n' +
  'var c = [' + GM + '("Centre x (px)")("Slider"), ' + GM + '("Centre y (px, 0 = ligne de base)")("Slider")], d = [Math.sin(a), -Math.cos(a)];\n' +
  'var p = transform.position; [p[0], p[1]] + c ' + sign + ' d * e'; }
rep.gradient = [];
for (var gl = 1; gl <= comp.numLayers; gl++) { var TL = comp.layer(gl); if (!(TL instanceof TextLayer) || !(TL.name.indexOf("LIGNE ") == 0 || TL.name.indexOf("SCAN ") == 0)) continue;
  var fxg = TL.property("ADBE Effect Parade"); if (fxg.property("Dégradé (master)")) fxg.property("Dégradé (master)").remove();
  TL.property("ADBE Effect Parade").addProperty("ADBE Ramp").name = "Dégradé (master)";
  var rg = TL.property("ADBE Effect Parade").property("Dégradé (master)");
  rg.property("ADBE Ramp-0001").expression = '// start (colour A): from "' + MG + '"\n' + rampPt('-');
  rg.property("ADBE Ramp-0003").expression = '// end (colour B)\n' + rampPt('+');
  rg.property("ADBE Ramp-0002").expression = GM + '("Couleur A (début)")("Color")';
  rg.property("ADBE Ramp-0004").expression = GM + '("Couleur B (fin)")("Color")';
  rg.property("ADBE Ramp-0007").expression = '// 100 = the layer\'s own colour (gradient off)\n' + GM + '("Dégradé actif")("Checkbox") > 0 ? 100 - clamp(' + GM + '("Mélange (%)")("Slider"), 0, 100) : 100';
  if (rg.property("ADBE Ramp-0001").expressionError) rep.errors.push(TL.name + " gradient: " + rg.property("ADBE Ramp-0001").expressionError);
  rep.gradient.push(TL.name); }
// the light and the line: colours from "MASTER - lumière"; the line follows the light's colour A when asked
var LM = 'thisComp.layer(' + q(MLI) + ').effect';
lfx = lpre.property("ADBE Effect Parade");
lfx.property("Light shape").property("Color A").expression = LM + '("Lumière couleur A (près de la barre)")("Color")';
lfx.property("Light shape").property("Color B").expression = LM + '("Lumière couleur B (pointes)")("Color")';
lroot.property("light line").property("ADBE Vectors Group").property(2).property("ADBE Vector Fill Color").expression = LM + '("Lumière couleur du coeur (rayons)")("Color")';
// the rays' direction: the automatic one (bar perpendicular + toward the text), turned by "Rayons rotation", or a fixed
// direction ("Rayons angle fixe", the way the rays TRAVEL: 0 = up, 90 = right) - the source sits opposite it
lpos.position.expression = LPOS_EXPR + 'var M = thisComp.layer(' + q(MLI) + '), fixe = M.effect("Rayons angle fixe (on/off)")("Checkbox") > 0;\n' +
  'if (fixe) { var af = degreesToRadians(M.effect("Rayons angle fixe")("Angle")); dir = [-Math.sin(af), Math.cos(af)]; }\n' +
  'var ro = degreesToRadians(M.effect("Rayons rotation (0 = auto)")("Angle")), cr = Math.cos(ro), sr = Math.sin(ro);\n' +
  'dir = [dir[0] * cr - dir[1] * sr, dir[0] * sr + dir[1] * cr];\n' +
  'p + dir * dist + (fixe ? [0, 0] : ax * dot(ax, d) * ' + C2.light.tilt + ')   // auto: along the bar, the fan leans back toward the text centre';
if (lpos.position.expressionError && lpos.position.expressionError.indexOf("MOTION - Echelle") < 0) rep.errors.push("light position: " + lpos.position.expressionError);
// the rays' length, one setting: both radial blurs' Amount (the streak length; CC Radial Fast Blur caps at 100) and the
// wide glow's radius scale with "Rayons longueur (%)" - written here, once the master exists
var RLEN = 'Math.max(0, ' + LM + '("Rayons longueur (%)")("Slider")) / 100';
lp("Light rays", "Amount").expression = AMT + ';\nMath.min(100, ' + C2.light.amount + ' * g * ease(dist, 0, ' + (C2.light.fadeDist * 1.3).toFixed(0) + ', 0, 1) * ' + RLEN + ')';
lp("Light rays 2 (brightest)", "Amount").expression = lp("Light rays", "Amount").expression;
lp("Light wide", "Glow Radius").expression = C2.light.glowWideRadius + ' * ' + RLEN;
if (lp("Light rays", "Amount").expressionError) rep.errors.push("rays length: " + lp("Light rays", "Amount").expressionError);
// the light's gradient: from the bar (colour "barre") outward over "étendue", PERPENDICULAR to the bar on the lit side at
// angle 0, turned by "Dégradé angle"; the layer is at the comp origin, so its points are comp coordinates
var LRG = lfx.property("Dégradé lumière (master)");
function lrampPt(k) { return 'var M = thisComp.layer(' + q(MLI) + '), B = thisComp.layer("BARRE"), r = B.content("bar").content(1), c = B.toComp(r.position);\n' +
  'var ax = B.toComp([0, 100]) - B.toComp([0, 0]), la = length(ax); ax = la > 0.001 ? ax / la : [1, 0];\n' +
  'var n = [-ax[1], ax[0]], v = c - thisComp.layer("BARRE LUMIERE - position").position; if (dot(n, v) < 0) n = -n;   // the lit side\n' +
  'var a = degreesToRadians(M.effect("Dégradé angle (0 = perp.)")("Angle")), g = [n[0] * Math.cos(a) - n[1] * Math.sin(a), n[0] * Math.sin(a) + n[1] * Math.cos(a)];\n' +
  'c + g * M.effect("Dégradé étendue (px)")("Slider") * ' + k; }
LRG.property("ADBE Ramp-0001").expression = '// start (colour "barre"): at the bar\n' + lrampPt(0);
LRG.property("ADBE Ramp-0003").expression = '// end (colour "fin"): "étendue" px away from the bar\n' + lrampPt(1);
LRG.property("ADBE Ramp-0002").expression = LM + '("Dégradé couleur barre")("Color")';
LRG.property("ADBE Ramp-0004").expression = LM + '("Dégradé couleur fin")("Color")';
LRG.property("ADBE Ramp-0007").expression = '// 100 = the light as it was (gradient off)\n' + LM + '("Dégradé lumière actif")("Checkbox") > 0 ? 100 - clamp(' + LM + '("Dégradé mélange (%)")("Slider"), 0, 100) : 100';
if (LRG.property("ADBE Ramp-0001").expressionError) rep.errors.push("light gradient: " + LRG.property("ADBE Ramp-0001").expressionError);
// THE LIGHT ON THE TEXT (2026-09-25 l: "i want the light of the bar to impact / have a lighting effect on the text ... more
// realistic"). The tutorial's light only touches its text through a track matte (the text shows where the light is); here
// the words must stay readable, so: (1) the bar and its rays go ABOVE the words - until now every SCAN word sat over the
// light, so the ADD rays only ever fell on the black; (2) under them an adjustment layer warms and brightens the words in a
// soft pool: from the bar's edge on the lit side out to `portée`, as long as the bar plus half the reach, feathered, turning
// with the bar and dimming with the light (its opacity follows the light layer's)
var ADJN = "BARRE LUMIERE - éclairage texte";
for (var oi = app.project.numItems; oi >= 1; oi--) { var oit = app.project.item(oi); if (oit.name == ADJN && oit instanceof FootageItem && oit.usedIn.length == 0) oit.remove(); }
var adj = comp.layers.addSolid([1, 1, 1], ADJN, comp.width, comp.height, 1, comp.duration); adj.adjustmentLayer = true; adj.motionBlur = false; adj.shy = true;
adj.inPoint = lpre.inPoint; adj.outPoint = bar.outPoint;
adj.property("ADBE Effect Parade").addProperty("ADBE Exposure2"); adj.property("ADBE Effect Parade").addProperty("ADBE Tint");
var afx = adj.property("ADBE Effect Parade");
afx.property(1).name = "Éclairage (exposition)"; afx.property(2).name = "Éclairage (teinte)";
afx = adj.property("ADBE Effect Parade");
afx.property("Éclairage (exposition)").property("ADBE Exposure2-0003").setValue(1.2);   // exposure, stops
afx.property("Éclairage (teinte)").property("ADBE Tint-0002").expression = LM + '("Lumière couleur A (près de la barre)")("Color")';   // map white to: the light colour
afx.property("Éclairage (teinte)").property("ADBE Tint-0003").setValue(35);                   // amount to tint
adj.opacity.expression = '// with the light (its opacity already carries the side switch, the flicker and the bar length) x the master amount\n' +
  'clamp(thisComp.layer("BARRE LUMIERE").opacity / ' + (C2.light.opacity / 100) + ' * ' + LM + '("Éclairage du texte (%)")("Slider") / 100, 0, 100)';
var am = adj.property("ADBE Mask Parade").addProperty("ADBE Mask Atom"); am.name = "Flaque de lumière";
am = adj.property("ADBE Mask Parade").property("Flaque de lumière");
am.property("ADBE Mask Shape").expression = '// the lit pool, comp coordinates (the solid covers the frame): from just behind the bar\'s edge out to the reach, on\n// the side the rays go (away from the light source), as long as the bar + half the reach\n' +
  'var B = thisComp.layer("BARRE"), r = B.content("bar").content(1), c = B.toComp(r.position), a0 = B.toComp([0, 0]);\n' +
  'var ax = B.toComp([0, 100]) - a0, la = length(ax); ax = la > 0.001 ? ax / la : [1, 0];\n' +
  'var hl = length(B.toComp(r.position + [0, r.size[1] / 2]) - c);\n' +
  'var n = c - thisComp.layer("BARRE LUMIERE - position").position, ln = length(n); n = ln > 0.5 ? n / ln : [0, 1];\n' +
  'var R = ' + LM + '("Éclairage portée (px)")("Slider"), s = hl + R * 0.5, e = c - n * R * 0.15;\n' +
  'createPath([e - ax * s, e + ax * s, e + ax * s + n * R, e - ax * s + n * R], [], [], true)';
am.property("ADBE Mask Feather").expression = 'var R = ' + LM + '("Éclairage portée (px)")("Slider") * 0.6; [R, R]';
if (am.property("ADBE Mask Shape").expressionError) rep.errors.push("light pool: " + am.property("ADBE Mask Shape").expressionError);
// order, top down: the bar, its light (and the light's matte), the pool - all above the words
adj.moveToBeginning(); lpre.moveToBeginning(); cache.moveToBeginning(); bar.moveToBeginning();
bar.property("ADBE Root Vectors Group").property("bar").property("ADBE Vectors Group").property(2).property("ADBE Vector Fill Color").expression =
  '// the line: its own colour, or the light\'s colour A ("Ligne = couleur A de la lumière")\n' + LM + '("Ligne = couleur A de la lumière")("Checkbox") > 0 ? ' + LM + '("Lumière couleur A (près de la barre)")("Color") : ' + LM + '("Ligne couleur")("Color")';

// ---------------------------------------------------------------- motion blur on everything
var cn = ["1. MODIFIER TEXTE", "créer un texte Comp 1", "créer un texte Comp 2", "2. RENDU ICI", C2.comp];
for (var mb = 0; mb < cn.length; mb++) { var cm = findComp(cn[mb]); cm.motionBlur = true;
  for (var lb = 1; lb <= cm.numLayers; lb++) { try { cm.layer(lb).motionBlur = true; } catch (eMB) {} } }
// ... except the light and its matte: a blurred glow shows no motion blur, and it was the heaviest render by far
lpre.motionBlur = false; cache.motionBlur = false;

// ---------------------------------------------------------------- preset comps follow
var dur = comp.duration; var cn2 = ["1. MODIFIER TEXTE", "créer un texte Comp 1", "créer un texte Comp 2"];
for (var c3 = 0; c3 < cn2.length; c3++) { var cc = findComp(cn2[c3]); cc.duration = dur; cc.workAreaStart = 0; try { cc.workAreaDuration = Math.floor(dur * fps - 0.5) / fps; } catch (eA) {} for (var L4 = 1; L4 <= cc.numLayers; L4++) { cc.layer(L4).outPoint = dur; } }
var rc = findComp("2. RENDU ICI"); rc.duration = dur + 2 / fps; rc.workAreaStart = 0; try { rc.workAreaDuration = Math.floor(rc.duration * fps - 0.5) / fps; } catch (eW) {}
for (var L5 = 1; L5 <= rc.numLayers; L5++) { var lr = rc.layer(L5); lr.outPoint = Math.min(rc.duration, lr.startTime + dur); }

// ---------------------------------------------------------------- read back: the bar per frame (world centre, angle, length)
// (opt-in since 2026-09-25 d - "no need to re-test every time as part of the script": set $.global.RUSH_READBACK = true before running)
bakeSim(); bakeSim(); bakeSim();   // three passes: the hug stops and the orbit's start take the pin offset the first pass measured, and the lag correction (HUGC) converges
rep.track = [];
if ($.global.RUSH_READBACK) for (var f = C2.switchF; f < C2.totalFrames; f++) { var tt = T(f);
  var wx = nX.position.valueAtTime(tt, false)[0], wy = pY.valueAtTime(tt, false);
  rep.track.push([f, Math.round(wx * 10) / 10, Math.round(wy * 10) / 10, Math.round(bar.rotation.valueAtTime(tt, false) * 100) / 100, Math.round(size.valueAtTime(tt, false)[1] * 10) / 10]); }
rep.compDuration = comp.duration; rep.layers = []; for (var lo = 1; lo <= comp.numLayers; lo++) rep.layers.push(comp.layer(lo).name);
// re-apply what was changed by hand, then record this build's values (the next build compares against them)
if ($.global.PM) { rep.manualKept = $.global.PM.restore(comp, PM_SNAP); rep.recorded = $.global.PM.record(comp, PM_PATTERNS); }
// leave nothing selected: a selected null whose anchor = position = comp centre draws its 100 x 100 box at the comp's
// top-left corner in the viewer (the 'something at the top left' of 2026-09-24)
for (var ds = 1; ds <= comp.numLayers; ds++) comp.layer(ds).selected = false;
return rep;
