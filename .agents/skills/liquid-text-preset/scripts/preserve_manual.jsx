// Preserve manual changes across rebuilds (2026-09-25: "changes I made manually in between passes should not be
// overridden, but kept"). Three-way merge per layer, keyed by layer name:
//   snapshot  = the values in the project right before the rebuild
//   built     = the values the previous build wrote (kept as JSON in the layer's comment, prefix "PM1:")
//   a value that differs from `built` was changed by hand -> re-applied after the rebuild, and recorded as the new built
//   a value equal to `built` was never touched -> the new build's config wins
// Tracked per layer: effect parameters without expression or keys (sliders, checkboxes, colours, points), the text
// layer's character style (font, size, colours, stroke, tracking, justification) and its text, a shape layer's first fill
// colour, and the layer's enabled / label / blend mode / opacity (when not driven). Expressions and keyframes are the
// builders' own and are never treated as manual.
$.global.PM = (function () {
  var PREFIX = "PM1:";
  function eq(a, b) { if (a === b) return true; if (a === null || b === null || a === undefined || b === undefined) return false;
    if (typeof a == "number" && typeof b == "number") return Math.abs(a - b) < 1e-6;
    if (a instanceof Array && b instanceof Array) { if (a.length != b.length) return false; for (var i = 0; i < a.length; i++) if (!eq(a[i], b[i])) return false; return true; }
    return String(a) == String(b); }
  function fxProps(L, out) { var fx = L.property("ADBE Effect Parade"); if (!fx) return;
    for (var e = 1; e <= fx.numProperties; e++) { var ef = fx.property(e);
      for (var p = 1; p <= ef.numProperties; p++) { var pr = ef.property(p); try {
        if (pr.propertyType != PropertyType.PROPERTY) continue; if (!pr.canSetExpression) continue;
        var vt = pr.propertyValueType; if (vt != PropertyValueType.OneD && vt != PropertyValueType.TwoD && vt != PropertyValueType.ThreeD && vt != PropertyValueType.COLOR) continue;
        if (pr.numKeys > 0 || (pr.expression && pr.expression.length)) continue;
        out["fx:" + ef.name + "/" + pr.name] = pr.value; } catch (e1) {} } } }
  function textProps(L, out) { try { var td = L.property("ADBE Text Properties").property("ADBE Text Document").value;
    out["text:font"] = td.font; out["text:fontSize"] = td.fontSize; out["text:fillColor"] = td.fillColor; out["text:applyFill"] = td.applyFill;
    out["text:applyStroke"] = td.applyStroke; try { out["text:strokeColor"] = td.strokeColor; out["text:strokeWidth"] = td.strokeWidth; } catch (e0) {}
    out["text:tracking"] = td.tracking; out["text:justification"] = td.justification; out["text:text"] = td.text; } catch (e) {} }
  function shapeFill(L) { try { var root = L.property("ADBE Root Vectors Group"); var g = root.property(1); var c = g.property("ADBE Vectors Group");
    for (var i = 1; i <= c.numProperties; i++) if (c.property(i).matchName == "ADBE Vector Graphic - Fill") return c.property(i).property("ADBE Vector Fill Color"); } catch (e) {} return null; }
  function layerProps(L, out) { out["layer:enabled"] = L.enabled; out["layer:label"] = L.label; try { out["layer:blendingMode"] = L.blendingMode; } catch (e) {}
    try { if (L.opacity.numKeys == 0 && !(L.opacity.expression && L.opacity.expression.length)) out["layer:opacity"] = L.opacity.value; } catch (e2) {}
    var f = shapeFill(L); if (f && !(f.expression && f.expression.length) && f.numKeys == 0) out["shape:fillColor"] = f.value; }
  function values(L) { var out = {}; fxProps(L, out); if (L instanceof TextLayer) textProps(L, out); layerProps(L, out);
    // a text composed by its own expression (the digital counter) is not a manual edit: its digits change with time
    try { var ex = L.property("ADBE Text Properties").property("ADBE Text Document").expression || ""; if (ex.indexOf("digital counter") >= 0) delete out["text:text"]; } catch (e) {}
    return out; }
  function built(L) { try { var c = L.comment || ""; if (c.indexOf(PREFIX) != 0) return null; return eval("(" + c.substr(PREFIX.length) + ")"); } catch (e) { return null; } }
  function matches(name, patterns) { for (var i = 0; i < patterns.length; i++) if (name.indexOf(patterns[i]) == 0) return true; return false; }
  // snapshot(comp, patterns) -> { name: { manual: {key: value}, all: {...} } } : manual = keys whose value differs from the recorded build
  // Entries that a builder could not re-apply (the layer did not exist yet - the chain builder recreates the whole comp
  // before the scan and rig builders rebuild their layers) wait in $.global.PM_PENDING for the next builder of the session.
  function snapshot(comp, patterns) { var snap = {}, pend = $.global.PM_PENDING || {};
    for (var pn in pend) { if (pend.hasOwnProperty(pn) && matches(pn, patterns)) snap[pn] = pend[pn]; }   // handed on by an earlier builder
    for (var i = 1; i <= comp.numLayers; i++) { var L = comp.layer(i); if (!matches(L.name, patterns)) continue;
      var cur = values(L), rec = built(L), manual = {};
      if (rec) { for (var k in cur) { if (!cur.hasOwnProperty(k)) continue; if (rec.hasOwnProperty(k) && !eq(cur[k], rec[k])) manual[k] = cur[k]; } }
      snap[L.name] = { manual: manual, all: cur, hadRecord: !!rec }; }   // a live layer always wins over a pending entry
    return snap; }
  function apply(L, key, v) { try {
    if (key.indexOf("fx:") == 0) { var s = key.substr(3).split("/"); var ef = L.property("ADBE Effect Parade").property(s[0]); if (!ef) return false; var pr = ef.property(s[1]); if (!pr) return false;
      if (pr.numKeys > 0 || (pr.expression && pr.expression.length)) return false; pr.setValue(v); return true; }
    if (key.indexOf("text:") == 0) { var tp = L.property("ADBE Text Properties").property("ADBE Text Document"); var td = tp.value; var f = key.substr(5);
      if (f == "text") { td.text = v; if (L.name.indexOf("SCAN ") == 0) { var m = /^(SCAN \d+ - )/.exec(L.name); if (m) L.name = m[1] + v; } }
      else if (f == "strokeColor" || f == "strokeWidth") { if (td.applyStroke) td[f] = v; } else td[f] = v;
      tp.setValue(td); return true; }
    if (key == "layer:enabled") { L.enabled = v; return true; } if (key == "layer:label") { L.label = v; return true; }
    if (key == "layer:blendingMode") { L.blendingMode = v; return true; } if (key == "layer:opacity") { if (L.opacity.numKeys == 0 && !(L.opacity.expression && L.opacity.expression.length)) { L.opacity.setValue(v); return true; } return false; }
    if (key == "shape:fillColor") { var fl = shapeFill(L); if (fl) { fl.setValue(v); return true; } return false; }
  } catch (e) {} return false; }
  // restore(comp, snap) -> re-applies the manual values to the layers that exist now; returns what was kept
  function restore(comp, snap) { var kept = [], done = {};
    for (var i = 1; i <= comp.numLayers; i++) { var L = comp.layer(i); var s = snap[L.name]; if (!s) continue; done[L.name] = true;
      for (var k in s.manual) { if (!s.manual.hasOwnProperty(k)) continue; if (apply(L, k, s.manual[k])) kept.push(L.name + " " + k); } }
    // what could not be applied here waits for the next builder (a layer it will recreate); what was applied is cleared
    var pend = {}; for (var nm in snap) { if (!snap.hasOwnProperty(nm) || done[nm]) continue; var hasManual = false; for (var kk in snap[nm].manual) if (snap[nm].manual.hasOwnProperty(kk)) hasManual = true; if (hasManual) pend[nm] = snap[nm]; }
    $.global.PM_PENDING = pend;
    return kept; }
  // record(comp, patterns) -> writes the current values as this build's record
  function record(comp, patterns) { var n = 0;
    for (var i = 1; i <= comp.numLayers; i++) { var L = comp.layer(i); if (!matches(L.name, patterns)) continue;
      var cur = values(L); L.comment = PREFIX + JSON.stringify(cur); n++; }
    return n; }
  return { snapshot: snapshot, restore: restore, record: record, values: values, built: built };
})();
