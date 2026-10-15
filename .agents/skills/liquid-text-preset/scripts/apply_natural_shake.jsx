// Natural handheld camera shake - reusable expression asset.
//
// Two ways to use it through the AE bridge (or File > Scripts > Run Script File):
//   1. Library: evaluate this file, then call  $.global.naturalShake(layer, opts)  on any layer that
//      should carry the shake (a null the others are parented to, or a camera / its null).
//   2. One shot: set  $.global.__SHAKE = { comp: "My comp", parent: "all" | ["name", ...], intensity: 100 }
//      then evaluate this file: it creates a "MOTION - Shake" null at the comp centre, parents the
//      layers FIRST (the null is still at rest, so nothing jumps), and only then adds the expressions.
//
// Why this and not wiggle(5, 20): a single wiggle is one band of noise and reads as jitter. A real
// operator's shake is several bands at once - a slow float from breathing and weight shift, a sway
// from the arms, a small tremor - on position AND rotation, with a touch of scale (focus breathing /
// distance). wiggle() is smooth band-limited noise (Perlin-like), octaves add sub-detail at half
// amplitude, and every band gets its own seed so X, Y and the bands never move in step.
// Sources: School of Motion (camera shake, wiggle octaves), Dan Ebberts / motionscript.com (wiggle
// and seedRandom), DJordanMedia (position + rotation + focus breathing reads as real).
//
// Controls on the layer: "Shake actif" (checkbox), "Shake intensite (%)" (100 = the values below),
// "Shake frequence (x)" (1 = handheld; 0.5 = floating; 2 = nervous).
$.global.naturalShake = function (layer, opts) {
  opts = opts || {};
  var fx = layer.property("ADBE Effect Parade");
  var ck = fx.addProperty("ADBE Checkbox Control"); ck.name = "Shake actif";
  var s1 = fx.addProperty("ADBE Slider Control"); s1.name = "Shake intensite (%)";
  var s2 = fx.addProperty("ADBE Slider Control"); s2.name = "Shake frequence (x)";
  // adding an effect invalidates the references to its siblings: fetch again by name
  fx.property("Shake actif").property("ADBE Checkbox Control-0001").setValue(opts.on === false ? 0 : 1);
  fx.property("Shake intensite (%)").property("ADBE Slider Control-0001").setValue(opts.intensity != null ? opts.intensity : 100);
  fx.property("Shake frequence (x)").property("ADBE Slider Control-0001").setValue(opts.frequency != null ? opts.frequency : 1);
  var head = 'var I = effect("Shake actif")("Checkbox") * effect("Shake intensite (%)")("Slider") / 100;\nvar F = effect("Shake frequence (x)")("Slider");\n';
  layer.position.expression = '// natural handheld shake: float 0.35 Hz + sway 1.1 Hz + tremor 4.5 Hz, own seed each\n' + head +
    'seedRandom(11); var a = wiggle(0.35 * F, 12 * I, 2, 0.5) - value;\n' +
    'seedRandom(23); var b = wiggle(1.1 * F, 4 * I, 3, 0.5) - value;\n' +
    'seedRandom(37); var c = wiggle(4.5 * F, 0.8 * I, 2, 0.4) - value;\nvalue + a + b + c';
  layer.rotation.expression = '// roll that follows the hands: slow lean + small sway (degrees)\n' + head +
    'seedRandom(41); var a = wiggle(0.3 * F, 0.35 * I, 2, 0.5) - value;\n' +
    'seedRandom(53); var b = wiggle(1.3 * F, 0.1 * I, 2, 0.5) - value;\nvalue + a + b';
  layer.scale.expression = '// focus breathing / distance: a very slow, very small uniform scale\n' + head +
    'seedRandom(67); var w = (wiggle(0.25 * F, 0.6 * I, 2, 0.5) - value)[0];\n[value[0] + w, value[1] + w]';
  var errs = [];
  var props = [layer.position, layer.rotation, layer.scale];
  for (var i = 0; i < props.length; i++) if (props[i].expressionError) errs.push(props[i].name + ": " + props[i].expressionError);
  return errs;
};

// one-shot mode
if ($.global.__SHAKE) {
  var cfg = $.global.__SHAKE; $.global.__SHAKE = null;
  var comp = null;
  if (cfg.comp) { for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name == cfg.comp) comp = it; } }
  else comp = app.project.activeItem;
  if (!(comp instanceof CompItem)) throw new Error("natural shake: no comp");
  var n = comp.layers.addNull(); n.name = cfg.name || "MOTION - Shake";
  n.anchorPoint.setValue([comp.width / 2, comp.height / 2]); n.position.setValue([comp.width / 2, comp.height / 2]);   // layer space = comp space: children do not move
  n.outPoint = comp.duration; n.motionBlur = true;
  var kids = [];
  for (var j = 1; j <= comp.numLayers; j++) { var L = comp.layer(j); if (L === n || L.parent) continue;
    var want = cfg.parent == "all" || (cfg.parent instanceof Array && ("," + cfg.parent.join(",") + ",").indexOf("," + L.name + ",") >= 0);
    if (want) { L.parent = n; kids.push(L.name); } }
  var errors = $.global.naturalShake(n, cfg);
  return { shakeLayer: n.name, parented: kids, errors: errors };   // ("null" is a reserved word as a key in ExtendScript)
}
return { loaded: "naturalShake" };
