// =============================================================================
// THE LEDGER - TITLE SEQUENCE : "NINE DAYS TO ZERO"
// Master Cinematic Title Sequence via Native Cavalry Assets
// =============================================================================

(function() {
    console.log(">>> [Antigravity] Construction de la Sequence Titre Master...");

    // 1. Nettoyer la composition
    try {
        var existingLayers = api.getAllSceneLayers();
        if (existingLayers && existingLayers.length > 0) {
            for (var i = 0; i < existingLayers.length; i++) {
                try {
                    api.deleteLayer(existingLayers[i]);
                } catch(delErr) {}
            }
        }
    } catch(cleanErr) {
        console.warn("Nettoyage: " + cleanErr);
    }

    // 2. Definir la resolution de la Composition (1920x1080 @ 25fps)
    try {
        var comp = api.getActiveComp();
        if (comp) {
            api.set(comp, {
                "resolution": [1920, 1080],
                "frameRate": 25.0
            });
        }
    } catch(compErr) {
        console.warn("Comp config: " + compErr);
    }

    // 3. Charger les 3 Master Plates via l'API officielle loadAsset
    // Verification des chemins
    var p1 = "C:/brand/frame1_ninedays.jpg";
    var p2 = "C:/brand/frame2_sbf.jpg";
    var p3 = "C:/brand/frame3_billboard.jpg";

    if (!api.filePathExists(p1)) {
        p1 = api.getAppAssetsPath() + "/brand/frame1_ninedays.jpg";
        p2 = api.getAppAssetsPath() + "/brand/frame2_sbf.jpg";
        p3 = api.getAppAssetsPath() + "/brand/frame3_billboard.jpg";
    }

    console.log("Chargement Planche 1: " + p1);
    var a1 = api.loadAsset(p1, false);
    console.log("-> Asset 1 ID: " + a1);

    console.log("Chargement Planche 2: " + p2);
    var a2 = api.loadAsset(p2, false);
    console.log("-> Asset 2 ID: " + a2);

    console.log("Chargement Planche 3: " + p3);
    var a3 = api.loadAsset(p3, false);
    console.log("-> Asset 3 ID: " + a3);

    if (!a1 || !a2 || !a3) {
        console.error("Erreur critique: impossible de charger un ou plusieurs assets !");
        return;
    }

    // 4. Instancier les 3 calques FootageShape dans la composition
    var f3 = api.addAssetToComp(a3);
    var f2 = api.addAssetToComp(a2);
    var f1 = api.addAssetToComp(a1);

    api.rename(f1, "Plate_01_NineDays");
    api.rename(f2, "Plate_02_SBF_Bahamas");
    api.rename(f3, "Plate_03_Billboard_Ledger");

    // Echelle pour remplir 1920x1080 depuis 1376x768 (ratio 1.396)
    var S_INIT = 1.40;
    var S_END = 1.46;

    // Position initiale
    api.set(f1, { "position": [0, 0], "scale": [S_INIT, S_INIT], "opacity": 100 });
    api.set(f2, { "position": [1920, 0], "scale": [S_INIT, S_INIT], "opacity": 100 });
    api.set(f3, { "position": [1920, 0], "scale": [S_INIT, S_INIT], "opacity": 100 });

    // 5. Animation - Tableaux et Transitions Whip-Pan (0 - 150 frames)

    // --- TABLEAU 1 : NINE DAYS TO ZERO (Frames 0 -> 45) ---
    // Push-in lent au centre
    api.keyframe(f1, 0,  { "scale.x": S_INIT, "scale.y": S_INIT, "position": [0, 0] });
    api.keyframe(f1, 40, { "scale.x": S_END,  "scale.y": S_END,  "position": [0, 0] });
    // Whip-pan sortie vers la gauche (Frames 40 -> 48)
    api.keyframe(f1, 48, { "position": [-1920, 0] });
    api.magicEasing(f1, "position", 40, "SlowIn");

    // --- TABLEAU 2 : SAM BANKMAN-FRIED & CAROLINE (Frames 40 -> 95) ---
    // Whip-pan entree depuis la droite (Frames 40 -> 48)
    api.keyframe(f2, 40, { "position": [1920, 0], "scale.x": S_INIT, "scale.y": S_INIT });
    api.keyframe(f2, 48, { "position": [0, 0] });
    api.magicEasing(f2, "position", 40, "SlowOut");
    // Drift / zoom lent au centre (Frames 48 -> 88)
    api.keyframe(f2, 88, { "position": [0, 0], "scale.x": S_END, "scale.y": S_END });
    // Whip-pan sortie vers la gauche (Frames 88 -> 96)
    api.keyframe(f2, 96, { "position": [-1920, 0] });
    api.magicEasing(f2, "position", 88, "SlowIn");

    // --- TABLEAU 3 : THE LEDGER BILLBOARD (Frames 88 -> 150) ---
    // Whip-pan entree depuis la droite (Frames 88 -> 96)
    api.keyframe(f3, 88, { "position": [1920, 0], "scale.x": S_INIT, "scale.y": S_INIT });
    api.keyframe(f3, 96, { "position": [0, 0] });
    api.magicEasing(f3, "position", 88, "SlowOut");
    // Push-in hero final sur le logo 3D (Frames 96 -> 150)
    api.keyframe(f3, 150, { "position": [0, 0], "scale.x": S_END * 1.04, "scale.y": S_END * 1.04 });

    // 6. Remise a zero et demarrage de la lecture
    try {
        api.setTime(0);
        api.play();
    } catch(playErr) {}

    console.log(">>> [Antigravity] SEQUENCE MASTER CREEE AVEC SUCCES DANS CAVALRY !");
})();
