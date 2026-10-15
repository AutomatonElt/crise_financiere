// physics_follow.jsx - critically damped followers + a hanging pendulum, driven by ANY per-frame target path.
// Pure ES3, no After Effects objects: load it with $.evalFile, then call physicsFollow(opts). It integrates once
// (`sub` steps per second, landing exactly on every frame) and returns per-frame arrays the caller writes as
// one key per frame on sliders; the layer expressions only read them (see SKILL.md, "bake, do not evaluate").
//
// opts = {
//   fps, f0, fN,                 first and last frame (inclusive)
//   sub: 120,                    integration steps per second
//   tx: [], ty: [], tr: [],      targets, index f - f0 (any of them may be omitted); tr in degrees
//   x: { w0: 26, zeta: 1 }, y: { w0: 16, zeta: 1 }, r: { w0: 12, zeta: 1 },   // omega0 rad/s, damping ratio (1 = critical)
//   drift: { x: 22, y: 12, r: 2.5, rampS: 0.8, fx: [0.11, 0.27], fy: [0.14, 0.33], fr: [0.09, 0.23], t0: <s> },  // 0 = none
//   pendulum: { fStart, fEnd, g: 14000, L: 150, lag: 0.02, damping: 24, gClamp: [0.5, 1.5], frameOffset: -180 },
//   shift: [{ f, dx, dy }]       instantaneous re-anchorings: the state AND the targets from f jump together (no dynamics)
// }
// Between pendulum.fStart and fEnd the rotation is a rod hanging from the pivot (0 = hanging): gravity (clamped: a pivot
// accelerating up or down cannot invert it), the pivot's acceleration leaning it (lag x the physical torque), damping.
// The spring follower keeps running toward its FROZEN target so what it still owed at the switch settles smoothly on
// top (no kick, 2026-09-25 q); at fStart the rotation frame changes by `frameOffset` (key frame -> pendulum frame).
// Leaving the pendulum, the spring takes the pendulum's angle and speed and follows tr again (the orbit, a hand).
//
// returns { x: [abs], y: [abs], r: [abs, pendulum frame from fStart], devX: [], devY: [], devR: [], times: [],
//           phiAtStart: <rad, the total angle at the pendulum's start> }
function physicsFollow(opts) {
  var fps = opts.fps, f0 = opts.f0, fN = opts.fN, sub = opts.sub || 120, T = function (f) { return f / fps; };
  var TX = opts.tx, TY = opts.ty, TR = opts.tr, hasX = !!TX, hasY = !!TY, hasR = !!TR;
  function at(A, t) { var p = (t - T(f0)) * fps, i0 = Math.max(0, Math.min(A.length - 2, Math.floor(p))), w = Math.max(0, Math.min(1, p - i0)); return A[i0] + (A[i0 + 1] - A[i0]) * w; }
  function kc(s) { var w0 = s && s.w0 ? s.w0 : 20, z = (s && s.zeta !== undefined) ? s.zeta : 1; return [w0 * w0, 2 * z * w0]; }
  var KX = kc(opts.x), KY = kc(opts.y), KR = kc(opts.r);
  var D = opts.drift || {}, TAU = 2 * Math.PI, dT0 = D.t0 !== undefined ? D.t0 : T(f0);
  function ramp(t) { var rs = D.rampS || 0.001, u = Math.max(0, Math.min(1, (t - dT0) / rs)); return u * u * (3 - 2 * u); }
  function dr(t, a, fr, p) { if (!a || !fr) return 0; var s = t - dT0; return a * ramp(t) * (0.6 * Math.sin(TAU * fr[0] * s + p) + 0.4 * Math.sin(TAU * fr[1] * s + 2.1 * p)); }
  var P = opts.pendulum, tPS = P ? T(P.fStart) : 1e9, tPE = P ? T(P.fEnd) : 1e9, gCl = (P && P.gClamp) || [0.5, 1.5];
  var shifts = opts.shift || [];
  var x = hasX ? TX[0] : 0, vx = 0, y = hasY ? TY[0] : 0, vy = 0, r = hasR ? TR[0] : 0, vr = 0, phi = 0, om = 0;
  var mode = 0, rFrozen = 0, phiAtStart = 0, t = T(f0), pendDone = false, fd = 1 / fps;
  // the mode hand-offs happen on the FIRST sub-step of the frame that lands on fStart / fEnd (frame semantics, not a
  // time comparison: the sub-step clock accumulates rounding, and a time test re-entered the pendulum right after
  // leaving it - a second -180 deg offset, 2026-09-25 q). The frozen target is the array's own entry at fStart (the new
  // frame), never an interpolation across the step. Each hand-off happens once.
  function modeCheck(tt) { if (!hasR || !P) return;
    if (!pendDone && mode == 0 && tt > tPS - fd + 1e-9) {   // -> pendulum: the frame changes, the pendulum starts at rest, the spring's leftover decays
      mode = 1; var off = P.frameOffset || 0; r -= off; rFrozen = TR[Math.min(TR.length - 1, P.fStart - f0)]; phi = 0; om = 0; phiAtStart = (r - rFrozen) * Math.PI / 180; }
    else if (mode == 1 && tt > tPE - fd + 1e-9) { mode = 0; pendDone = true; r = r + phi * 180 / Math.PI; vr = vr + om * 180 / Math.PI; phi = 0; om = 0; } }   // -> spring: takes the pendulum's angle and speed
  var out = { x: [], y: [], r: [], devX: [], devY: [], devR: [], times: [] };
  for (var f = f0; f <= fN; f++) { var tk = T(f);
    // re-anchoring: state and targets jump together; the previous target sample is shifted too, so the interpolation
    // across this frame does not ramp the jump into the follower (its record is already written)
    for (var si = 0; si < shifts.length; si++) if (shifts[si].f == f) { x += shifts[si].dx || 0; y += shifts[si].dy || 0;
      var ip = f - 1 - f0; if (ip >= 0) { if (hasX) TX[ip] += shifts[si].dx || 0; if (hasY) TY[ip] += shifts[si].dy || 0; } }
    var span = tk - t, n = Math.ceil(span * sub - 1e-9), h = n > 0 ? span / n : 0;
    for (var k = 0; k < n; k++) {
      var ax = 0, ay = 0;
      if (hasX) { ax = KX[0] * (at(TX, t) + dr(t, D.x, D.fx, 0.0) - x) - KX[1] * vx; vx += ax * h; x += vx * h; }
      if (hasY) { ay = KY[0] * (at(TY, t) + dr(t, D.y, D.fy, 1.3) - y) - KY[1] * vy; vy += ay * h; y += vy * h; }
      if (hasR) { modeCheck(t);
        var tgt = mode == 1 ? rFrozen : at(TR, t), Lr = P ? P.L : 150, lean = 0;
        if (P) { var rad = (mode == 1 ? phi : r * Math.PI / 180); lean = P.lag * 1.5 / Lr * ax * Math.cos(rad); }
        var ar = KR[0] * (tgt + (mode == 1 ? 0 : dr(t, D.r, D.fr, 2.2)) - r) - KR[1] * vr + (mode == 0 ? lean * 180 / Math.PI : 0); vr += ar * h; r += vr * h;
        if (mode == 1) { var gE = Math.max(gCl[0] * P.g, Math.min(gCl[1] * P.g, P.g - ay)), w2 = 1.5 * gE / Lr;
          om += (-w2 * Math.sin(phi) + lean - P.damping * om) * h; phi += om * h; } }
      t += h; }
    var ti = f - f0, rOut = hasR ? (mode == 1 ? phi * 180 / Math.PI + (r - rFrozen) + dr(tk, D.r, D.fr, 2.2) : r) : 0;
    out.times.push(tk); out.x.push(x); out.y.push(y); out.r.push(rOut);
    out.devX.push(hasX ? x - TX[ti] : 0); out.devY.push(hasY ? y - TY[ti] : 0); out.devR.push(hasR ? rOut - (mode == 1 ? 0 : TR[ti]) : 0); }
  out.phiAtStart = phiAtStart;
  return out;
}
