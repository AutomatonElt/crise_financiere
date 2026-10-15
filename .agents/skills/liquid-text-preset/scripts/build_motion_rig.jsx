// Third step of the text chain - run AFTER build_pro_chain.jsx and build_typewriter_scan.jsx.
// Every CONTINUOUS motion lives on its own null, so they all run at once and each can be switched off:
//
//   MOTION - Shake      natural handheld shake (asset: assets/expressions/natural-camera-shake)
//     MOTION - Momentum   after each handoff slide the text keeps a little of the slide's speed, then glides back
//       MOTION - Echelle    the handoff scale: a slow drift TOWARD the next handoff's direction, the bump peaking
//                           just before the change, a long eased return - alternating up / down per switch
//         LIGNE 1..N, SCAN *, BARRE X    (the text and the bar ride the chain; _measure / CONTROLS do not)
//
// Every null: anchor = position = comp centre, so its layer space IS comp space - children keep their
// coordinates, masks (toComp/fromComp) and the bar's expressions stay valid, scale/rotation pivot on the
// centre. Parent first, expressions after (a parent change rewrites child values to hold them in place).
// Everything is read from the text layers (switch times = LIGNE in points, slide lengths = _measure widths):
// retype or retime a line and every motion follows.
var M = {
  comp: "TEXTE - 3 lignes (pro)",
  hLead: 13, hTail: 2,                                   // must match build_pro_chain.jsx (the slide window)
  shake: { intensity: 45, frequency: 1 },               // 45 %: text, not a documentary camera
  momentum: { pct: 5, max: 20, tau: 0.9, reveal: 10, glide: 6 },  // 5 % of the slide (max 20 px), 10 px after a word reveal; tau = how slowly the speed fades; glide = build_pro_chain CFG.glide.extra
  revealLen: 14,                                         // must match build_pro_chain.jsx
  scale: { amount: 14, rise: 0.35, lead: 0.1, relax: 1.2, alternate: 1, drift: 4, driftStart: 0.45 },
  asset: ""   // left blank = resolved as apply_natural_shake.jsx beside this script
};
function findComp(n){for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==n)return it;}return null;}
var comp = findComp(M.comp); if (!comp) throw new Error("build the chain first");
var fps = comp.frameRate; var rep = { errors: [] };
var NAMES = ["MOTION - Shake", "MOTION - Momentum", "MOTION - Echelle"];
// manual changes made in the project since the last build are kept (preserve_manual.jsx: three-way merge per layer)
(function () { var here = new File($.fileName).parent;
  var f = new File(here.fsName + "/preserve_manual.jsx");
  if (!f.exists) throw new Error("preserve_manual.jsx not found beside this script");
  $.evalFile(f); })();   // always reload: a cached copy is stale after an edit
var PM_PATTERNS = ["LIGNE ", "SCAN ", "STYLE - police", "BARRE", "MOTION - ", "CONTROLS"], PM_SNAP = $.global.PM ? $.global.PM.snapshot(comp, PM_PATTERNS) : {};

// ---------------------------------------------------------------- idempotent: neutralise, unparent, remove
for (var r = 0; r < NAMES.length; r++) { var old = comp.layer(NAMES[r]); if (!old) continue;
  old.position.expression = ""; old.rotation.expression = ""; old.scale.expression = ""; }
for (var u = 1; u <= comp.numLayers; u++) { var ly = comp.layer(u); if (ly.parent && ly.parent.name.indexOf("MOTION - ") == 0 && ly.name.indexOf("MOTION - ") != 0) ly.parent = null; }
for (var r2 = 0; r2 < NAMES.length; r2++) { var o2 = comp.layer(NAMES[r2]); if (o2) o2.remove(); }
var oldAdj = comp.layer("SCALE (adjustment)"); if (oldAdj) oldAdj.remove();   // replaced by MOTION - Echelle

// ---------------------------------------------------------------- the chain, at rest
function makeNull(name){ var n = comp.layers.addNull(); n.name = name; n.anchorPoint.setValue([comp.width / 2, comp.height / 2]);
  n.position.setValue([comp.width / 2, comp.height / 2]); n.outPoint = comp.duration; n.motionBlur = true; return n; }
var nE = makeNull("MOTION - Echelle"), nM = makeNull("MOTION - Momentum"), nS = makeNull("MOTION - Shake");   // each added on top
nE.parent = nM; nM.parent = nS;
rep.parented = [];
for (var i = 1; i <= comp.numLayers; i++) { var L = comp.layer(i); if (L.parent) continue;
  if (L.name.indexOf("LIGNE ") == 0 || L.name.indexOf("SCAN ") == 0 || L.name.indexOf("FINALE ") == 0 || L.name == "BARRE X") { L.parent = nE; rep.parented.push(L.name); } }

// ---------------------------------------------------------------- MOTION - Shake (the asset)
var assetPath = M.asset || (new File($.fileName).parent.fsName + "/apply_natural_shake.jsx");
var f = new File(assetPath); f.encoding = "UTF-8"; if (!f.open("r")) throw new Error("shake asset missing: " + assetPath);
var src = f.read(); f.close(); (new Function(src))();
rep.errors = rep.errors.concat($.global.naturalShake(nS, M.shake));

// ---------------------------------------------------------------- shared controls
function ctl(layer, type, name, v){ var p = layer.property("ADBE Effect Parade").addProperty(type); p.name = name; }
function setv(layer, name, v){ var e = layer.property("ADBE Effect Parade").property(name); e.property(1).setValue(v); }
var SM = 'function sm(u) { u = Math.max(0, Math.min(1, u)); return u * u * u * (u * (u * 6 - 15) + 10); }\n';

// ---------------------------------------------------------------- MOTION - Momentum
// Speed that never dies: each motion event (a handoff slide, a word reveal) hands a small offset to this null
// that rises with the event, PEAKS IN SPEED as the event lands, then keeps moving on an exponential fade
// (tau) - it never stops at a peak. It returns to centre during the NEXT handoff slide, where that big move
// hides it (or during the line's exit when nothing follows). Measured before: 36 -> 0.75 px/frame in 2 frames.
ctl(nM, "ADBE Checkbox Control", "Momentum actif"); ctl(nM, "ADBE Slider Control", "Momentum (% du glissement)");
ctl(nM, "ADBE Slider Control", "Momentum max (px)"); ctl(nM, "ADBE Slider Control", "Momentum apparition (px)"); ctl(nM, "ADBE Slider Control", "Momentum amorti (s)");
setv(nM, "Momentum actif", 1); setv(nM, "Momentum (% du glissement)", M.momentum.pct); setv(nM, "Momentum max (px)", M.momentum.max);
setv(nM, "Momentum apparition (px)", M.momentum.reveal); setv(nM, "Momentum amorti (s)", M.momentum.tau);
nM.position.expression =
  'var on = effect("Momentum actif")("Checkbox"), k = effect("Momentum (% du glissement)")("Slider") / 100, Mx = effect("Momentum max (px)")("Slider");\n' +
  'var Mr = effect("Momentum apparition (px)")("Slider"), tau = Math.max(0.05, effect("Momentum amorti (s)")("Slider"));\n' +
  'var fd = thisComp.frameDuration, hA = ' + M.hLead + ' * fd, hB = ' + M.hTail + ' * fd, rev = ' + M.revealLen + ' * fd, gl = ' + M.momentum.glide + ' * fd;\n' + SM +
  'function W(n) { return thisComp.layer(n).sourceRectAtTime(time, false).width; }\n' +
  '// rises over `ramp` (speed peaks near its end), then an exponential fade: the speed is never zero\n' +
  'function P(x, ramp) { return x <= 0 ? 0 : (1 - Math.exp(-x / tau)) * sm(x / ramp); }\n' +
  '// back to centre inside the next handoff slide (or the last 0.6 s of the line)\n' +
  'function ret(i, L) { var a, b; try { var Ln = thisComp.layer("LIGNE " + (i + 1)); a = Ln.inPoint - hA; b = Ln.inPoint + hB; } catch (e) { b = L.outPoint; a = b - 0.6; }\n' +
  '  return time <= a ? 1 : (time >= b ? 0 : 1 - sm((time - a) / (b - a))); }\n' +
  'var dx = 0;\nfor (var i = 1; i < 50; i++) {\n  var L; try { L = thisComp.layer("LIGNE " + i); } catch (e1) { break; }\n  var back = ret(i, L);\n' +
  '  // the key word slid from where it sat in the previous line to the centre\n' +
  '  if (i > 1) { try { var p = i - 1; var kc = -W("_measure L" + p + " full") / 2 + W("_measure L" + p + " prefix+key") - W("_measure L" + p + " key") / 2;\n' +
  '    dx += Math.max(-Mx, Math.min(Mx, -kc * k)) * P(time - (L.inPoint - hA), hA + hB + rev / 2) * back; } catch (e2) {} }\n' +
  '  // the words that arrive with a slide (reveal animator offset, e.g. +50 px = from the right, moving left)\n' +
  '  var off = 0; try { off = L.text.animator("Start - Words - Pos+Opacity").property.position[0]; } catch (e3) {}\n' +
  '  if (off != 0) { var r0 = L.inPoint > 0.001 ? L.inPoint + hB : L.inPoint; dx += (off > 0 ? -Mr : Mr) * P(time - r0, rev + gl) * back; }\n}\n' +
  '[value[0] + on * dx, value[1]]';

// ---------------------------------------------------------------- MOTION - Echelle
ctl(nE, "ADBE Checkbox Control", "Echelle actif"); ctl(nE, "ADBE Slider Control", "Bump amount (%)"); ctl(nE, "ADBE Slider Control", "Bump rise (s)");
ctl(nE, "ADBE Slider Control", "Bump lead (s)"); ctl(nE, "ADBE Slider Control", "Bump relax (s)"); ctl(nE, "ADBE Slider Control", "Bump alterne (1 = oui)");
ctl(nE, "ADBE Slider Control", "Derive lente (%)");
setv(nE, "Echelle actif", 1); setv(nE, "Bump amount (%)", M.scale.amount); setv(nE, "Bump rise (s)", M.scale.rise); setv(nE, "Bump lead (s)", M.scale.lead);
setv(nE, "Bump relax (s)", M.scale.relax); setv(nE, "Bump alterne (1 = oui)", M.scale.alternate); setv(nE, "Derive lente (%)", M.scale.drift);
ctl(nE, "ADBE Slider Control", "Derive depart (x relax)"); setv(nE, "Derive depart (x relax)", M.scale.driftStart);
nE.scale.expression =
  '// the text is never still: between handoffs it drifts slowly TOWARD the next handoff\'s direction\n' +
  '// (up before an upscale, down before a downscale), the bump adds on top and peaks `lead` s before\n' +
  '// the change (zero speed at the peak), then drift + bump return together on a long eased tail.\n' +
  '// After the last handoff it drifts on in the next direction to the end of the comp.\n' +
  'var on = effect("Echelle actif")("Checkbox"), A = effect("Bump amount (%)")("Slider"), rise = effect("Bump rise (s)")("Slider");\n' +
  'var lead = effect("Bump lead (s)")("Slider"), rel = effect("Bump relax (s)")("Slider"), alt = effect("Bump alterne (1 = oui)")("Slider") >= 0.5, D = effect("Derive lente (%)")("Slider"); var ov = effect("Derive depart (x relax)")("Slider");\n' + SM +
  'var sw = [];\nfor (var i = 1; i <= thisComp.numLayers; i++) { var L = thisComp.layer(i); if (L.name.indexOf("LIGNE ") == 0 && L.inPoint > 0.001) sw.push(L.inPoint); }\n' +
  'sw.sort(function (a, b) { return a - b; });\n' +
  'var s = 0, prevEnd = 0;\nfor (var j = 0; j < sw.length; j++) {\n  var sg = (alt && j % 2 == 1) ? -1 : 1, tp = sw[j] - lead;\n' +
  '  if (time <= tp) { if (time >= prevEnd) s += sg * (D * sm((time - prevEnd) / Math.max(0.01, tp - prevEnd)) + A * sm((time - tp + rise) / rise)); }\n' +
  '  else if (time < tp + rel) s += sg * (D + A) * (1 - sm(1 - Math.pow(1 - (time - tp) / rel, 1.7)));\n  prevEnd = tp + rel * ov;   // the next drift starts WHILE this bump is still returning (same direction): no still point\n}\n' +
  'var sgT = (alt && sw.length % 2 == 1) ? -1 : 1;\nvar lastOut = thisComp.duration, lastIn = -1; for (var i3 = 1; i3 <= thisComp.numLayers; i3++) { var L3 = thisComp.layer(i3); if (L3.name.indexOf("LIGNE ") == 0 && L3.inPoint > lastIn) { lastIn = L3.inPoint; lastOut = L3.outPoint; } }\n' +
  '// after the last handoff the drift runs until the last line leaves (not the end of the comp: it would be too slow to see)\n' +
  'if (time > prevEnd) s += sgT * D * sm((time - prevEnd) / Math.max(0.01, lastOut - prevEnd));\n' +
  '[value[0] + on * s, value[1] + on * s]';

var chk = [nM.position, nE.scale]; for (var c = 0; c < chk.length; c++) if (chk[c].expressionError) rep.errors.push(chk[c].name + ": " + chk[c].expressionError);

// ---------------------------------------------------------------- re-enable the light's expressions
// They reference MOTION - Echelle, which did not exist when act 2 built them: AE evaluated them once, failed, and
// DISABLED them (an expression that errors is switched off, not retried). Switch them back on now the rig exists.
(function () { var names = ["BARRE LUMIERE - position", "BARRE LUMIERE", "BARRE LUMIERE - cache"]; var n = 0;
  var preL = null; for (var pi = 1; pi <= app.project.numItems; pi++) { var pit = app.project.item(pi); if (pit instanceof CompItem && pit.name == "BARRE LUMIERE (pre)") preL = pit; }
  function walk(pg) { for (var i = 1; i <= pg.numProperties; i++) { var pr = pg.property(i); if (!pr) continue;
    if (pr.propertyType == PropertyType.PROPERTY) { try { if (pr.canSetExpression && pr.expression && (!pr.expressionEnabled || pr.expressionError)) { var ex = pr.expression; pr.expression = ex; pr.expressionEnabled = true; n++; } } catch (e) {} }   // re-assigning the text clears the error state; enabling alone did not stick after a full chain rebuild (2026-09-25)
    else walk(pr); } }
  for (var k = 0; k < names.length; k++) { var Lk = comp.layer(names[k]); if (Lk) walk(Lk); }
  if (preL) for (var pk = 1; pk <= preL.numLayers; pk++) walk(preL.layer(pk));   // builds before 2026-09-24 kept the stack in a precomp; now the light is one layer in this comp
  rep.reenabled = n; })();

// ---------------------------------------------------------------- read back
rep.samples = [];   // opt-in since 2026-09-25 d ("no need to re-test every time as part of the script")
if ($.global.RUSH_READBACK) for (var fr = 0; fr < comp.duration * fps; fr += 4) { var t = fr / fps;
  rep.samples.push([fr, Math.round(nE.scale.valueAtTime(t, false)[0] * 10) / 10, Math.round((nM.position.valueAtTime(t, false)[0] - comp.width / 2) * 10) / 10,
    Math.round((nS.position.valueAtTime(t, false)[0] - comp.width / 2) * 10) / 10, Math.round(nS.rotation.valueAtTime(t, false) * 100) / 100]); }
// re-apply what was changed by hand, then record this build's values (the next build compares against them)
if ($.global.PM) { rep.manualKept = $.global.PM.restore(comp, PM_SNAP); rep.recorded = $.global.PM.record(comp, PM_PATTERNS); }
// leave nothing selected: a selected null whose anchor = position = comp centre draws its 100 x 100 box at the comp's
// top-left corner in the viewer (the 'something at the top left' of 2026-09-24)
for (var ds = 1; ds <= comp.numLayers; ds++) comp.layer(ds).selected = false;
return rep;
