// Build the word-switch text chain, professionally structured and expression-driven.
//
//   LIGNE 1..N       one text layer per sentence, named by number (the sentence is only its Source Text)
//   CONTROLS         hidden null: per line "L<i> mot cle" (which word survives the cut, 1-based) and
//                    "L<i> mots presents" (how many leading words are on screen from the first frame)
//   _measure ...     hidden text layers whose Source Text is an expression off the line and the sliders;
//                    their sourceRectAtTime() gives the widths every other expression needs
//
// Pipeline: build_pro_chain.jsx -> build_typewriter_scan.jsx (act 2) -> build_act3_outro.jsx (act 3, 2026-09-25) -> build_motion_rig.jsx
// (MOTION nulls: handoff scale + slow drift, slide momentum, natural shake - every continuous motion).
//
// Keys: 2-3 easy-eased keys per property, carrying 0..1 RAMPS; expressions turn the ramps into the
// measured motion. Nothing is keyed per frame, and no number in a key depends on the words.
var CFG = {
  compName: "TEXTE - 3 lignes (pro)",
  width: 2008, height: 1080, fps: 28.1719970703125, frames: 131,
  font: "OldEnglishTextMT", fontSize: 120, fill: [1, 0.72940999269485, 0],
  lines: [
    { text: "Le montage vidéo",  keyWord: "vidéo",   presentWords: 1 },   // (2026-09-26 script: "Le montage vidéo vient de changer à tout jamais.")
    { text: "vient de changer", keyWord: "changer", presentWords: 1 },
    { text: "à jamais.",        keyWord: null,      presentWords: 2, lastLen: 32 }
  ],
  // TIMING COMES FROM THE TEXT: a line holds until it has been read (characters / readCps), never less than
  // its reveal + glide + minHold; then the cut and the handoff slide run. Longer line = longer pause.
  // On a rebuild, the texts currently in the comp win over the ones above (edit in AE, rebuild, timing follows).
  readCps: 18,   // reading speed, characters per second (subtitle norm is 15-20)
  minHold: 4,    // frames of stillness at least after the line is fully revealed
  hLead: 13,     // the slide (and the width match) runs from switch-hLead to switch+hTail:
  hTail: 2,      //   the text changes near the very END of the slide (13/15 of it), still gliding in
  cutLead: 17,   // the cut to the key word runs from switch-cutLead ...
  cutTail: 5,    //   ... to switch-cutTail
  letterLead: 9, // letter rule: the key word is cut down to one letter from switch-letterLead ...
  letterTail: 1, //   ... to switch-letterTail
  revealLen: 14, // frames the remaining words take to reveal after the slide lands
  glide: { extra: 6, inInfluence: 80 },   // the centring lands 6 frames after the reveal, on an 80 % ease-in: a long soft landing
  fadeLen: 10    // last line: frames of the closing fade, ending 2 frames before the comp ends
};
function findComp(n){for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==n)return it;}return null;}
var fps = CFG.fps; function T(f){ return f / fps; }
var old = findComp(CFG.compName);
// manual changes made in the project since the last build are kept (preserve_manual.jsx: three-way merge per layer)
(function () { var here = new File($.fileName).parent;
  var f = new File(here.fsName + "/preserve_manual.jsx");
  if (!f.exists) throw new Error("preserve_manual.jsx not found beside this script");
  $.evalFile(f); })();   // always reload: a cached copy is stale after an edit
var PM_PATTERNS = ["LIGNE ", "SCAN ", "STYLE - police", "BARRE", "MOTION - ", "CONTROLS"], PM_SNAP = {};
if (old && $.global.PM) { PM_SNAP = $.global.PM.snapshot(old, PM_PATTERNS); }
if (old) { for (var o1 = 0; o1 < CFG.lines.length; o1++) { try { var tx = old.layer("LIGNE " + (o1 + 1)).property("ADBE Text Properties").property("ADBE Text Document").value.text; if (tx) CFG.lines[o1].text = tx; } catch (eO) {} } old.remove(); }
// timeline from the texts
(function () { var t = 0, nL = CFG.lines.length;
  for (var i = 0; i < nL; i++) { var ln = CFG.lines[i]; ln.inF = t;
    if (i == nL - 1) { ln.outF = t + (ln.lastLen || 32); break; }
    var start = i == 0 ? 0 : t + CFG.hTail;
    var read = Math.ceil(ln.text.length / CFG.readCps * fps), shown = CFG.revealLen + CFG.glide.extra + CFG.minHold;
    ln.outF = start + Math.max(read, shown) + CFG.cutLead; t = ln.outF; }
  CFG.frames = CFG.lines[nL - 1].outF; })();
var comp = app.project.items.addComp(CFG.compName, CFG.width, CFG.height, 1, T(CFG.frames), fps);
comp.bgColor = [0, 0, 0]; comp.motionBlur = true;
var report = { comp: comp.name, lines: [], errors: [] };
var EASE = 33.333;

function easeAll(prop){ for (var k = 1; k <= prop.numKeys; k++) { prop.setInterpolationTypeAtKey(k, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
  var tries = [1, 3, 2], ok = false; for (var t = 0; t < tries.length && !ok; t++) { var e = []; for (var d = 0; d < tries[t]; d++) e.push(new KeyframeEase(0, EASE)); try { prop.setTemporalEaseAtKey(k, e, e); ok = true; } catch (er) {} }
  try { prop.setSpatialTangentsAtKey(k, [0, 0, 0], [0, 0, 0]); } catch (e2) {} } }
function ramp(prop, pairs, vec){ // pairs: [[frame, value], ...] easy-eased; vec: wrap value as [v, v2, 100]
  for (var i = 0; i < pairs.length; i++) { var v = pairs[i][1]; prop.setValueAtTime(T(pairs[i][0]), vec ? vec(v) : v); } easeAll(prop); }
function addAnimator(L, name){ var a = L.property("ADBE Text Properties").property("ADBE Text Animators").addProperty("ADBE Text Animator"); a.name = name; return a; }
function animatorByName(L, name){ return L.property("ADBE Text Properties").property("ADBE Text Animators").property(name); }
function addSelector(anim, basedOn, mode){ var s = anim.property("ADBE Text Selectors").addProperty("ADBE Text Selector"); var adv = s.property("ADBE Text Range Advanced"); adv.property("ADBE Text Range Type2").setValue(basedOn); adv.property("ADBE Text Selector Mode").setValue(mode); return s; }
function styleText(L){ var st = L.property("ADBE Text Properties").property("ADBE Text Document"); var td = st.value; td.font = CFG.font; td.fontSize = CFG.fontSize; td.fillColor = CFG.fill; td.applyFill = true; td.justification = ParagraphJustification.CENTER_JUSTIFY; td.tracking = 0;
  try { td.fontCapsOption = FontCapsOption.FONT_NORMAL_CAPS; } catch (eC) {}   // never inherit the Character panel's All Caps (helpers then mismeasure; the expressions upper-case live when the line is in caps)
  st.setValue(td); return st; }
function q(s){ return '"' + s + '"'; }

// ---------------------------------------------------------------- controls
var ctrl = comp.layers.addNull(); ctrl.name = "CONTROLS"; ctrl.enabled = false;
function slider(name, v){ var s = ctrl.property("ADBE Effect Parade").addProperty("ADBE Slider Control"); s.name = name; s.property("ADBE Slider Control-0001").setValue(v); return name; }
var N = CFG.lines.length, names = [], sl = [];
for (var i = 0; i < N; i++) { names.push("LIGNE " + (i + 1)); var words = CFG.lines[i].text.split(" "); var kw = 0;
  if (CFG.lines[i].keyWord) { for (var w = 0; w < words.length; w++) if (words[w] == CFG.lines[i].keyWord) kw = w + 1; if (!kw) throw new Error("key word not in line " + (i + 1)); }
  sl.push({ key: CFG.lines[i].keyWord ? slider("L" + (i + 1) + " mot cle (0 = dernier)", kw == words.length ? 0 : kw) : null, present: slider("L" + (i + 1) + " mots presents", CFG.lines[i].presentWords || 1) }); }

// ---------------------------------------------------------------- master style
// one hidden text layer carries the font / size / colour / tracking; every text layer's Source Text is an expression that
// re-applies that character style to its own typed text - change the font on STYLE, all texts follow (the guide layers
// inherit it through the lines they copy). Paragraph justification stays per layer. Rebuild after a large size change:
// the bar's rest heights are measured at build time.
var STYLE = comp.layers.addText("Aa - police maitre"); STYLE.name = "STYLE - police (master)"; styleText(STYLE); STYLE.enabled = false; STYLE.guideLayer = true;
STYLE.position.setValue([120, 80, 0]); STYLE.label = 9;
// Every text layer carries a checkbox "Police master": ON (default) = the master's character style; OFF = the layer's OWN
// Character-panel style (2026-09-25: "I need to be able to edit fonts individually on text too if I want to"). The
// checkbox is added BEFORE the expression (an expression that errors once is disabled by AE).
var MASTER_CHK = "Police master (1 = suivre STYLE)";
var STYLE_PICK = 'var useM = 1; try { useM = effect(' + q(MASTER_CHK) + ')("Checkbox"); } catch (e0) {}\n' +
  'var st = useM > 0 ? thisComp.layer("STYLE - police (master)").text.sourceText.style : text.sourceText.style;\n';
function masterStyle(L){ var fxm = L.property("ADBE Effect Parade"); if (!fxm.property(MASTER_CHK)) { fxm.addProperty("ADBE Checkbox Control").name = MASTER_CHK; L.property("ADBE Effect Parade").property(MASTER_CHK).property("ADBE Checkbox Control-0001").setValue(1); }
  L.property("ADBE Text Properties").property("ADBE Text Document").expression =
  '// font, size, colour, tracking come from "STYLE - police (master)" while "Police master" is on; switch it off to style this\n// layer on its own in the Character panel; the text itself stays yours\n' +
  STYLE_PICK + 'st.setText(String(value))'; }

// ---------------------------------------------------------------- text lines
var layers = [];
for (var i2 = 0; i2 < N; i2++) { var ln = CFG.lines[i2]; var L = comp.layers.addText(ln.text); L.name = names[i2]; styleText(L); L.startTime = 0; L.inPoint = T(ln.inF); L.outPoint = T(ln.outF); L.motionBlur = true; masterStyle(L); layers.push(L); }
var r0 = layers[0].sourceRectAtTime(0.001, false); var yBase = CFG.height / 2 - (r0.top + r0.height / 2);
for (var i3 = 0; i3 < N; i3++) layers[i3].position.setValue([CFG.width / 2, yBase, 0]);

// ---------------------------------------------------------------- measuring helpers (hidden, shy)
// the helpers show: full line / present chunk / prefix through the key word / key word alone
function helper(name, expr){ var Hl = comp.layers.addText("x"); Hl.name = name; styleText(Hl); Hl.enabled = false; Hl.shy = true; Hl.guideLayer = true; Hl.moveToEnd();
  Hl.property("ADBE Text Properties").property("ADBE Text Document").expression = expr; return Hl; }
function wordsExpr(i){ return 'var src = thisComp.layer(' + q(names[i]) + ').text.sourceText;\nvar w = String(src).split(" ");\n'; }
// the style comes from the MASTER layer, not from the line: a sourceText referenced from another layer's expression
// comes back WITHOUT that layer's own expression applied (measured: the line read 160, its helper 120)
// ... unless the line's "Police master" checkbox is off: then the helper takes the line's own Character-panel style
// (a cross-layer sourceText.style is exactly that: the layer's style without its expression)
function styled(i, s){ return 'var out = ' + s + ';\ntry { var Li = thisComp.layer(' + q(names[i]) + '); var useM = 1; try { useM = Li.effect(' + q(MASTER_CHK) + ')("Checkbox"); } catch (e1) {}\n' +
  '  var sty = useM > 0 ? thisComp.layer("STYLE - police (master)").text.sourceText.style : Li.text.sourceText.style; var up = false; try { up = sty.isAllCaps; } catch (eC) {} out = sty.setText(up ? out.toUpperCase() : out); } catch (e) {}\nout'; }
// LET(i): the key word of line i, and the LETTER RULE - when the next line opens with a one-letter word
// ("à") that appears in the key word ("changer", accents ignored), the cut goes on down to that letter,
// so "a" hands over to "à" at the same width. Defines s, w, k, kw, kStart, li (letter index in the key
// word, -1 = no letter mode) and cs (its character index in the line).
function LET(i){ var nextName = (i + 1 < N) ? names[i + 1] : null;
  return 'var s = String(thisComp.layer(' + q(names[i]) + ').text.sourceText), w = s.split(" ");\n' +
    'var k = Math.round(thisComp.layer("CONTROLS").effect(' + q(sl[i].key) + ')("Slider")); if (k < 1 || k > w.length) k = w.length;\n' +
    'var kw = w[k - 1], kStart = w.slice(0, k - 1).join(" ").length + (k > 1 ? 1 : 0);\n' +
    'function nm(c) { return String(c).toLowerCase().replace(/[àâä]/g, "a").replace(/[éèêë]/g, "e").replace(/[îï]/g, "i").replace(/[ôö]/g, "o").replace(/[ùûü]/g, "u").replace(/ç/g, "c"); }\n' +
    'var nx = "";' + (nextName ? ' try { nx = String(thisComp.layer(' + q(nextName) + ').text.sourceText).split(" ")[0]; } catch (e0) {}' : '') + '\n' +
    'var li = (nx.length == 1) ? nm(kw).indexOf(nm(nx)) : -1, cs = kStart + li;\n'; }
var H = [];
for (var i4 = 0; i4 < N; i4++) { var hh = {};
  hh.full = helper("_measure L" + (i4 + 1) + " full", wordsExpr(i4) + styled(i4, 'String(src)'));
  hh.present = helper("_measure L" + (i4 + 1) + " present", wordsExpr(i4) + 'var p = Math.max(1, Math.min(w.length, Math.round(thisComp.layer("CONTROLS").effect(' + q(sl[i4].present) + ')("Slider"))));\n' + styled(i4, 'w.slice(0, p).join(" ")'));
  if (sl[i4].key) {
    // key word slider: 0 (or out of range) = the last word, so retyping a line never breaks the cut
    // in letter mode the "key" is the single letter: every slide, width match and momentum then targets it
    hh.prefixKey = helper("_measure L" + (i4 + 1) + " prefix+key", wordsExpr(i4) + LET(i4) + styled(i4, 'li >= 0 ? s.substr(0, cs + 1) : w.slice(0, k).join(" ")'));
    hh.key = helper("_measure L" + (i4 + 1) + " key", wordsExpr(i4) + LET(i4) + styled(i4, 'li >= 0 ? kw.charAt(li) : kw'));
  }
  H.push(hh); }
function W(name){ return 'thisComp.layer(' + q(name) + ').sourceRectAtTime(time, false).width'; }
// geometry snippets (layer space, centred paragraph): first-chunk centre fc, key-word centre kc
function geo(i){ var s = 'var Wf = ' + W(H[i].full.name) + ';\nvar Wp = ' + W(H[i].present.name) + ';\nvar fc = -Wf / 2 + Wp / 2;\n';
  if (H[i].key) s += 'var Wpk = ' + W(H[i].prefixKey.name) + ';\nvar Wk = ' + W(H[i].key.name) + ';\nvar kc = -Wf / 2 + Wpk - Wk / 2;\n'; else s += 'var kc = 0, Wk = 1;\n'; return s; }
function geoPrev(i){ if (i == 0) return 'var kcPrev = 0, WkPrev = 1;\n'; var p = i - 1; return 'var WfP = ' + W(H[p].full.name) + ';\nvar WpkP = ' + W(H[p].prefixKey.name) + ';\nvar WkPrev = ' + W(H[p].key.name) + ';\nvar kcPrev = -WfP / 2 + WpkP - WkPrev / 2;\n'; }
function geoNext(i){ if (i == N - 1) return 'var WpNext = Wk;\n'; return 'var WpNext = ' + W(H[i + 1].present.name) + ';\n'; }

// ---------------------------------------------------------------- animators, ramps, expressions
for (var i5 = 0; i5 < N; i5++) {
  var ln2 = CFG.lines[i5], L2 = layers[i5], rec = { line: names[i5], text: ln2.text };
  var hasPrev = i5 > 0, hasNext = i5 < N - 1, swIn = ln2.inF, swOut = ln2.outF, hA = CFG.hLead, hB = CFG.hTail;
  var revealStart = hasPrev ? swIn + hB : swIn, revealEnd = revealStart + CFG.revealLen;

  // Start animation: leading chunk present from frame one (Start past it, via the slider), the rest reveals sliding in 50 px
  var aIn = addAnimator(L2, "Start - Words - Pos+Opacity");
  aIn.property("ADBE Text Animator Properties").addProperty("ADBE Text Opacity").setValue(0);
  aIn.property("ADBE Text Animator Properties").addProperty("ADBE Text Position 3D").setValue([50, 0, 0]);
  var sIn = addSelector(aIn, 3, 1);
  sIn.property("ADBE Text Percent Start").expression = 'var p = thisComp.layer("CONTROLS").effect(' + q(sl[i5].present) + ')("Slider");\nvar n = String(thisComp.layer(' + q(names[i5]) + ').text.sourceText).split(" ").length;\nMath.min(100, p / n * 100)';
  ramp(sIn.property("ADBE Text Percent Offset"), [[revealStart, 0], [revealEnd, 100]]);

  // End animation: cut to the key word (Subtract, Index units) - words before/after it go, key word stays
  var sCut = null;
  if (hasNext) {
    var aCut = addAnimator(L2, "End - Cut to key word");
    aCut.property("ADBE Text Animator Properties").addProperty("ADBE Text Opacity").setValue(0);
    sCut = addSelector(aCut, 3, 2); sCut.property("ADBE Text Range Advanced").property("ADBE Text Range Units").setValue(2);
    ramp(sCut.property("ADBE Text Index Start"), [[swOut - CFG.cutLead, 0], [swOut - CFG.cutTail, 1]]);
    ramp(sCut.property("ADBE Text Index End"), [[swOut - CFG.cutLead, 1], [swOut - CFG.cutTail, 0]]);
    var pick = 'var n = String(text.sourceText).split(" ").length;\nvar k = Math.round(thisComp.layer("CONTROLS").effect(' + q(sl[i5].key) + ')("Slider")); if (k < 1 || k > n) k = n;\nk = k - 1;\n';
    sCut.property("ADBE Text Index Start").expression = pick + "linear(value, 0, 1, 0, k);";
    sCut.property("ADBE Text Index End").expression = pick + "linear(value, 0, 1, k + 1, n);";
    // letter rule: then cut the key word itself down to the letter the next line opens with (both sides at once);
    // Subtract mode: the selected range is what STAYS - no letter match = the whole line stays.
    // (never linear(value, 1, 0, a, b): with a reversed input range AE returns the wrong end)
    var aL = addAnimator(L2, "End - Cut to letter");
    aL.property("ADBE Text Animator Properties").addProperty("ADBE Text Opacity").setValue(0);
    var sL = addSelector(aL, 1, 2); sL.property("ADBE Text Range Advanced").property("ADBE Text Range Units").setValue(2);
    ramp(sL.property("ADBE Text Index Start"), [[swOut - CFG.letterLead, 0], [swOut - CFG.letterTail, 1]]);
    ramp(sL.property("ADBE Text Index End"), [[swOut - CFG.letterLead, 1], [swOut - CFG.letterTail, 0]]);
    sL.property("ADBE Text Index Start").expression = LET(i5) + 'li < 0 ? 0 : linear(value, 0, 1, 0, cs);';
    sL.property("ADBE Text Index End").expression = LET(i5) + 'li < 0 ? s.length : linear(value, 0, 1, cs + 1, s.length);';
    if (sL.property("ADBE Text Index Start").expressionError) report.errors.push(names[i5] + " letter cut: " + sL.property("ADBE Text Index Start").expressionError);
  }
  // last line: closing fade, left to right
  if (!hasNext) { var aOut = addAnimator(L2, "End - Words - Opacity"); aOut.property("ADBE Text Animator Properties").addProperty("ADBE Text Opacity").setValue(0);
    var sOut = addSelector(aOut, 3, 1); ramp(sOut.property("ADBE Text Percent Offset"), [[CFG.frames - 2 - CFG.fadeLen, -100], [CFG.frames - 2, 0]]); }

  // Line position: a phase ramp. 0..1 = arriving (continues the previous key word's slide), 1..2 = centring
  // the line as it completes, 2..3 = sliding the key word to centre (first half before the switch)
  addAnimator(L2, "Line - Position").property("ADBE Text Animator Properties").addProperty("ADBE Text Position 3D");
  var pos = animatorByName(L2, "Line - Position").property("ADBE Text Animator Properties").property("ADBE Text Position 3D");
  var pairs = [];
  if (hasPrev) pairs.push([swIn - hA, 0], [swIn + hB, 1]); else pairs.push([swIn, 1]);
  var centreEnd = revealEnd + CFG.glide.extra;
  pairs.push([centreEnd, 2]);
  if (hasNext) pairs.push([swOut - hA, 2], [swOut + hB, 3]);
  ramp(pos, pairs, function (v) { return [v, 0, 0]; });
  pos = animatorByName(L2, "Line - Position").property("ADBE Text Animator Properties").property("ADBE Text Position 3D");
  // no dead stop anywhere in the line's travel: the landing of the handoff slide is a PASS-THROUGH key
  // (the slide flows straight into the centring), and the centring lands on a long soft ease that the
  // MOTION - Momentum null takes over - measured before: 36 -> 6 -> 0.75 px/frame in two frames
  if (hasPrev) { var kL = pos.nearestKeyIndex(T(swIn + hB)); pos.setTemporalContinuousAtKey(kL, true); pos.setTemporalAutoBezierAtKey(kL, true); }
  var kC = pos.nearestKeyIndex(T(centreEnd)); var eo = [new KeyframeEase(0, EASE)], ei = [new KeyframeEase(0, CFG.glide.inInfluence)];
  try { pos.setTemporalEaseAtKey(kC, ei, eo); } catch (eG) { var ei3 = [], eo3 = []; for (var d3 = 0; d3 < 3; d3++) { ei3.push(new KeyframeEase(0, CFG.glide.inInfluence)); eo3.push(new KeyframeEase(0, EASE)); } pos.setTemporalEaseAtKey(kC, ei3, eo3); }
  pos = animatorByName(L2, "Line - Position").property("ADBE Text Animator Properties").property("ADBE Text Position 3D");
  pos.expression = 'var v = value[0];\n' + geo(i5) + geoPrev(i5) +
    'var x;\nif (v <= 1) x = kcPrev * (1 - v) - fc;\nelse if (v <= 2) x = -fc * (2 - v);\nelse x = -kc * (v - 2);\n[x, 0, 0]';

  // Layer scale: ramp 0..100 = arriving (from 100/s to 100, s = own present chunk / previous key word),
  // 100..200 = leaving (100 -> s x 100, s = next present chunk / own key word). Both words share a width at the switch.
  var spairs = [];
  if (hasPrev) spairs.push([swIn - hA, 0], [swIn + hB, 100]); else spairs.push([swIn, 100]);
  if (hasNext) spairs.push([swOut - hA, 100], [swOut + hB, 200]);
  ramp(L2.scale, spairs, function (v) { return [v, v, 100]; });
  L2.scale.expression = 'var v = value[0];\n' + geo(i5) + geoPrev(i5) + geoNext(i5) +
    'var sc = 100;\nif (v <= 100) { var sIn = Math.max(0.05, Wp / Math.max(1, WkPrev)); var r = v / 100; sc = 100 / sIn + (100 - 100 / sIn) * r; }\n' +
    'else { var sOut = Math.max(0.05, WpNext / Math.max(1, Wk)); var r2 = (v - 100) / 100; sc = 100 + (100 * sOut - 100) * r2; }\n' +
    (hasPrev ? '' : 'if (v <= 100) sc = 100;\n') + '[sc, sc, 100]';

  // read back
  var errs = []; function chk(p, tag) { if (p.expression && p.expressionError) errs.push(tag + ": " + p.expressionError); }
  var sIn2 = animatorByName(L2, "Start - Words - Pos+Opacity").property("ADBE Text Selectors").property(1);
  chk(pos, "position"); chk(L2.scale, "scale"); chk(sIn2.property("ADBE Text Percent Start"), "reveal start");
  if (hasNext) { var sc2 = animatorByName(L2, "End - Cut to key word").property("ADBE Text Selectors").property(1); chk(sc2.property("ADBE Text Index Start"), "cut start"); chk(sc2.property("ADBE Text Index End"), "cut end"); }
  rec.expressionErrors = errs; rec.positionKeys = pos.numKeys; rec.scaleKeys = L2.scale.numKeys;
  rec.xAtSwitchOut = hasNext ? Math.round(pos.valueAtTime(T(swOut) - 0.001, false)[0]) : null;
  rec.xAtSwitchIn = hasPrev ? Math.round(pos.valueAtTime(T(swIn) + 0.001, false)[0]) : null;
  rec.scaleAtSwitchOut = hasNext ? Math.round(L2.scale.valueAtTime(T(swOut) - 0.001, false)[0] * 10) / 10 : null;
  rec.scaleAtSwitchIn = hasPrev ? Math.round(L2.scale.valueAtTime(T(swIn) + 0.001, false)[0] * 10) / 10 : null;
  report.lines.push(rec);
}
// helper widths read back (proves the measuring layers evaluate while hidden)
// one shared curve through each switch: the incoming line's landing key is a pass-through (it flows into the
// centring), so the outgoing line's last key must arrive with the SAME speed and influence - otherwise the two
// ramps differ before the switch and the word jumps when the text changes (seen at "vidéo" -> "vient")
report.switchX = [];
for (var i7 = 1; i7 < N; i7++) { var sw7 = CFG.lines[i7].inF;
  var pIn = animatorByName(layers[i7], "Line - Position").property("ADBE Text Animator Properties").property("ADBE Text Position 3D");
  var pOut = animatorByName(layers[i7 - 1], "Line - Position").property("ADBE Text Animator Properties").property("ADBE Text Position 3D");
  var kI = pIn.nearestKeyIndex(T(sw7 + CFG.hTail)), kO = pOut.nearestKeyIndex(T(sw7 + CFG.hTail));
  pOut.setTemporalEaseAtKey(kO, pIn.keyInTemporalEase(kI), pOut.keyOutTemporalEase(kO));
  report.switchX.push([Math.round((pOut.valueAtTime(T(sw7), true)[0] - 2) * 1000) / 1000, Math.round(pIn.valueAtTime(T(sw7), true)[0] * 1000) / 1000]); }   // ramp progress on both sides: must be equal
report.timing = []; for (var i8 = 0; i8 < N; i8++) report.timing.push([CFG.lines[i8].inF, CFG.lines[i8].outF]);
try { report.masterFont = layers[0].property("ADBE Text Properties").property("ADBE Text Document").valueAtTime(0.5, false).font; } catch (eMF) { report.masterFont = "?"; }
report.helperWidths = {};
for (var i6 = 0; i6 < N; i6++) for (var k6 in H[i6]) { var hl = H[i6][k6]; report.helperWidths[hl.name] = Math.round(hl.sourceRectAtTime(0.5, false).width); }

// the handoff scale (bump + slow drift), the momentum and the shake are NOT built here:
// build_motion_rig.jsx puts every continuous motion on a null chain, after act 2.

// ---------------------------------------------------------------- wire into the preset
var mod = findComp("1. MODIFIER TEXTE");
for (var m3 = mod.numLayers; m3 >= 1; m3--) { var ly = mod.layer(m3); if (ly.source && ly.source instanceof CompItem && (ly.source.name == "screen txt anim 1" || ly.source.name == CFG.compName)) ly.remove(); }
var newLayer = mod.layers.add(comp); newLayer.name = comp.name; newLayer.position.setValue([CFG.width / 2, CFG.height / 2]); newLayer.moveToBeginning();
var dur = T(CFG.frames); var cn = ["1. MODIFIER TEXTE", "créer un texte Comp 1", "créer un texte Comp 2"];
for (var c = 0; c < cn.length; c++) { var cc = findComp(cn[c]); cc.duration = dur; cc.workAreaStart = 0; try { cc.workAreaDuration = Math.floor(cc.duration * fps - 0.5) / fps; } catch (eA) {} for (var L3 = 1; L3 <= cc.numLayers; L3++) { if (cc.layer(L3).outPoint > dur) cc.layer(L3).outPoint = dur; } }
var rc = findComp("2. RENDU ICI"); rc.duration = dur + 2 / fps; rc.workAreaStart = 0; try { rc.workAreaDuration = Math.floor(rc.duration * fps - 0.5) / fps; } catch (eW) {}
report.yBase = yBase; report.layerOrder = []; for (var lo = 1; lo <= comp.numLayers; lo++) report.layerOrder.push(comp.layer(lo).name);
// re-apply what was changed by hand, then record this build's values (the next build compares against them)
if ($.global.PM) { report.manualKept = $.global.PM.restore(comp, PM_SNAP); report.recorded = $.global.PM.record(comp, PM_PATTERNS); }
// leave nothing selected: a selected null whose anchor = position = comp centre draws its 100 x 100 box at the comp's
// top-left corner in the viewer (the 'something at the top left' of 2026-09-24)
for (var ds = 1; ds <= comp.numLayers; ds++) comp.layer(ds).selected = false;
return report;
