// Test simple script for ui.runFileScript
api.log(">>> RUNNING FROM ui.runFileScript !!!");
var t = api.create("textShape", "DirectFileScriptLayer");
api.set(t, {
    "text": "SUCCESS VIA RUN FILE SCRIPT",
    "fontSize": 48,
    "position.y": -150,
    "color": { "r": 0, "g": 255, "b": 0, "a": 255 }
});
