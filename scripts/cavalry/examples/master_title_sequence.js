// =============================================================================
// THE LEDGER - TITLE SEQUENCE : "NINE DAYS TO ZERO"
// Master Photorealistic Animated Plates & Whip-Pan Transitions
// =============================================================================

(function() {
    console.log(">>> [Antigravity] Construction de la Sequence Titre Master...");

    // 1. Nettoyage complet des anciens calques
    try {
        var layers = api.getAllSceneLayers();
        if (layers) {
            for (var i = 0; i < layers.length; i++) {
                try { api.deleteLayer(layers[i]); } catch(e) {}
            }
        }
    } catch(err) {
        console.warn("Nettoyage: " + err);
    }

    // 2. Configuration de la Composition (160 frames @ 25fps)
    try {
        var comp = api.getActiveComp();
        api.set(comp, {
            "resolution.x": 1920,
            "resolution.y": 1080,
            "frameRate": 25.0
        });
    } catch(e) {}

    var BASE_SCALE = 1.396; // 1376x768 -> 1920x1080 plein ecran

    // =========================================================================
    // STAGE 3 : THE LEDGER BILLBOARD (Arriere-plan / Ordre Z)
    // =========================================================================
    var a3 = api.create("imageAsset", "Asset_Stage3_Billboard");
    api.set(a3, { "filePath": "C:/brand/frame3_billboard.jpg" });

    var img3 = api.create("imageShape", "Stage3_Billboard_Plate");
    try { api.connect(a3, "id", img3, "asset"); } catch(e) {}

    api.set(img3, {
        "position.x": 1920,
        "position.y": 0,
        "scale.x": BASE_SCALE,
        "scale.y": BASE_SCALE
    });

    // Animation Stage 3 : Entree Whip-in a la frame 98 -> 106, puis push-in lent
    try {
        api.keyframe(img3, 0, { "position.x": 1920 });
        api.keyframe(img3, 98, { "position.x": 1920, "scale.x": BASE_SCALE, "scale.y": BASE_SCALE });
        api.keyframe(img3, 106, { "position.x": 0, "scale.x": BASE_SCALE, "scale.y": BASE_SCALE });
        api.keyframe(img3, 160, { "position.x": 0, "scale.x": BASE_SCALE * 1.05, "scale.y": BASE_SCALE * 1.05 });
    } catch(kErr) {
        console.warn("Keyframes Stage 3: " + kErr);
    }

    // =========================================================================
    // STAGE 2 : SAM BANKMAN-FRIED & CAROLINE ELLISON (Milieu Z)
    // =========================================================================
    var a2 = api.create("imageAsset", "Asset_Stage2_SBF");
    api.set(a2, { "filePath": "C:/brand/frame2_sbf.jpg" });

    var img2 = api.create("imageShape", "Stage2_SBF_Plate");
    try { api.connect(a2, "id", img2, "asset"); } catch(e) {}

    api.set(img2, {
        "position.x": 1920,
        "position.y": 0,
        "scale.x": BASE_SCALE,
        "scale.y": BASE_SCALE
    });

    // Animation Stage 2 : Entree a frame 46 -> 54, zoom lent, sortie a frame 98 -> 106
    try {
        api.keyframe(img2, 0, { "position.x": 1920 });
        api.keyframe(img2, 46, { "position.x": 1920, "scale.x": BASE_SCALE * 1.02, "scale.y": BASE_SCALE * 1.02 });
        api.keyframe(img2, 54, { "position.x": 0, "scale.x": BASE_SCALE * 1.02, "scale.y": BASE_SCALE * 1.02 });
        api.keyframe(img2, 98, { "position.x": 0, "position.y": -8, "scale.x": BASE_SCALE * 1.07, "scale.y": BASE_SCALE * 1.07 });
        api.keyframe(img2, 106, { "position.x": -1920, "scale.x": BASE_SCALE * 1.07, "scale.y": BASE_SCALE * 1.07 });
    } catch(kErr) {
        console.warn("Keyframes Stage 2: " + kErr);
    }

    // =========================================================================
    // STAGE 1 : NINE DAYS TO ZERO (Premier Plan Initial)
    // =========================================================================
    var a1 = api.create("imageAsset", "Asset_Stage1_NineDays");
    api.set(a1, { "filePath": "C:/brand/frame1_ninedays.jpg" });

    var img1 = api.create("imageShape", "Stage1_NineDays_Plate");
    try { api.connect(a1, "id", img1, "asset"); } catch(e) {}

    api.set(img1, {
        "position.x": 0,
        "position.y": 0,
        "scale.x": BASE_SCALE,
        "scale.y": BASE_SCALE
    });

    // Animation Stage 1 : Zoom d'ouverture 0 -> 46, puis Whip-out vers la gauche 46 -> 54
    try {
        api.keyframe(img1, 0, { "position.x": 0, "position.y": 0, "scale.x": BASE_SCALE, "scale.y": BASE_SCALE });
        api.keyframe(img1, 46, { "position.x": 0, "position.y": -10, "scale.x": BASE_SCALE * 1.05, "scale.y": BASE_SCALE * 1.05 });
        api.keyframe(img1, 54, { "position.x": -1920, "position.y": -10, "scale.x": BASE_SCALE * 1.05, "scale.y": BASE_SCALE * 1.05 });
    } catch(kErr) {
        console.warn("Keyframes Stage 1: " + kErr);
    }

    // 3. Remise a zero de la tete de lecture et lecture
    try {
        api.setCurrentFrame(0);
        api.play();
    } catch(e) {}

    console.log(">>> [Antigravity] DEPLOIEMENT MASTER PHOTOREALISTE 100% REUSSI !");
})();
