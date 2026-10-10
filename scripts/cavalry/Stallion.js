// VERSION 0.8.1 (Antigravity Hardened Edition)
// Robust error handling, polyfills, and crash-proof onPost callback
(()=>{
    // Polyfill api.log if missing
    try {
        if (typeof api !== "undefined" && !api.log) {
            api.log = function() {
                var args = Array.prototype.slice.call(arguments);
                console.log.apply(console, ["[Cavalry API]"].concat(args));
            };
        }
    } catch(e) {}

    var n = class {
        #e;
        constructor(a) {
            this.#e = a;
        }
        onPost = () => {
            try {
                let a = this.#e.getNextPost(), u;
                if (!a || !a.result) return;
                try {
                    u = JSON.parse(a.result);
                } catch(err) {
                    return console.error("Stallion: Failed to parse request as JSON: " + err);
                }
                console.log("Stallion: Data received");
                let { type: e, code: r, path: t } = u;
                if (!e && !t) return console.error("Stallion: Missing/empty `type` key in request");
                if (!r && !t) return console.error("Stallion: Missing/empty `code` or `path` key in request");

                if (e === "script" || t) {
                    if (r && t) console.warn("Stallion: `code` and `path` keys both in request, executing `path`");
                    if (t) {
                        if (!api.filePathExists(t)) return console.error("Stallion: No script found at " + t);
                        try {
                            if (ui.runFileScript(t)) return console.log("Stallion: Script file successfully executed");
                        } catch(fileErr) {
                            return console.error("Stallion: File execution error: " + fileErr);
                        }
                    }
                    if (r && !t) {
                        try {
                            var wrappedCode = "(function() { try { " + r + " \\n} catch(innerErr) { console.error('Script Error: ' + innerErr); } })()";
                            var ok = api.exec("io.scenery.stallion", wrappedCode);
                            if (ok) {
                                console.log("Stallion: Script successfully executed");
                            } else {
                                console.error("Stallion: Script failed to execute");
                            }
                        } catch(execErr) {
                            console.error("Stallion: Exec exception: " + execErr);
                        }
                        return;
                    }
                }

                if (e.startsWith("javaScript") || e.startsWith("sksl")) {
                    let s = api.getSelection();
                    if (!s.length) s = [api.create(e)];
                    let o = "expression";
                    if (e === "javaScriptShape") o = "generator.expression";
                    if (e.startsWith("sksl")) o = "code";
                    for (let i of s) {
                        if (api.getLayerType(i) !== e) {
                            let g = api.getNiceName(i);
                            console.warn("Stallion: Skipped layer '" + g + "' because it is not of type '" + e + "'");
                            continue;
                        }
                        api.set(i, { [o]: r });
                    }
                    return console.log("Stallion: Successfully applied expression");
                }

                if (e.toLowerCase().includes("render")) {
                    let s = api.getRenderQueueItems();
                    for (let o of s) {
                        if (api.get(o, "selected")) api.set(o, { [e]: r });
                    }
                    return console.log("Stallion: Successfully applied render expression");
                }

                console.error("Stallion: Unexpected type '" + e + "'");
            } catch(outerErr) {
                console.error("Stallion: Top-level callback error: " + outerErr);
            }
        };
    };

    var p = "2.4.0";
    if (cavalry.versionLessThan(p)) throw new Error("Stallion requires Cavalry " + p + " or higher");

    var l = new api.WebServer;
    var d = 8080;
    var S = "127.0.0.1";
    var m = new n(l);
    l.listen(S, d);
    l.addCallbackObject(m);
    l.setHighFrequency();

    var y = { CENTRE: 1 };
    var f = new ui.Label("Listening on " + S + ":" + d + " (Hardened)");
    f.setAlignment(y.CENTRE);
    var h = new ui.Label("[Hardened Stallion Bridge Active]");
    h.setAlignment(y.CENTRE);
    var c = new ui.VLayout;
    c.addStretch();
    c.add(f, h);
    c.addStretch();
    ui.setTitle("Stallion");
    ui.add(c);
    ui.show();
})();
