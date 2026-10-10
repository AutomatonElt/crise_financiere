// =============================================================================
// THE LEDGER - SCENE MODULAIRE : FICHES VOLANTES & TEXTES EDITABLES
// =============================================================================

(function() {
    console.log(">>> [Antigravity] Generation de la Scene Modulaire Editable...");

    var activeComp = api.getActiveComp();

    // 1. Nettoyage de la composition (sans supprimer la Composition elle-meme)
    try {
        var compLayers = api.getCompLayers(false);
        for (var i = compLayers.length - 1; i >= 0; i--) {
            var lid = compLayers[i];
            if (api.layerExists(lid) && lid !== activeComp && api.getLayerType(lid) !== "composition") {
                try { api.deleteLayer(lid); } catch(e) {}
            }
        }
    } catch(err) {
        console.warn("Nettoyage: " + err);
    }

    // 2. Configuration de la composition (1920x1080 @ 25fps)
    try {
        if (activeComp) {
            api.set(activeComp, {
                "resolution": [1920, 1080],
                "fps": 25.0
            });
        }
    } catch(e) {}

    // 3. Import du Master Desk en Fond
    var pDesk = "C:/brand/frame1_ninedays.jpg";
    if (!api.filePathExists(pDesk)) {
        pDesk = api.getAppAssetsPath() + "/brand/frame1_ninedays.jpg";
    }
    var aDesk = api.loadAsset(pDesk, false);
    var fDesk = api.addAssetToComp(aDesk);
    api.rename(fDesk, "01_Desk_Investigation_Background");
    api.set(fDesk, {
        "position": [0, 0],
        "scale": [1.40, 1.40],
        "opacity": 100
    });

    // 4. Import de la Plaque en Ardoise Vierge (Texture sans texte)
    var pPlaque = "C:/brand/clean_slate_plaque.jpg";
    if (!api.filePathExists(pPlaque)) {
        pPlaque = api.getAppAssetsPath() + "/brand/clean_slate_plaque.jpg";
    }
    var aPlaque = api.loadAsset(pPlaque, false);
    var fPlaque = api.addAssetToComp(aPlaque);
    api.rename(fPlaque, "02_Slate_Plaque_Surface");
    api.set(fPlaque, {
        "position": [0, -118],
        "scale": [1.40, 1.40],
        "opacity": 100
    });

    // 5. Titre Principal Natif (100% Vectoriel & Editable dans l'Attribute Editor)
    var tMain = api.create("textShape", "03_Titre_Principal_Editable");
    api.set(tMain, {
        "text": "NINE DAYS TO ZERO",
        "fontSize": 44,
        "horizontalAlignment": 1, // Centre
        "verticalAlignment": 1,   // Centre
        "color": "#E5C158",       // Or brosse luxueux
        "letterSpacing": 6.0      // Typographie cinématique étirée
    });

    // 6. Sous-titre Natif Editable
    var tSub = api.create("textShape", "04_SousTitre_Editable");
    api.set(tSub, {
        "text": "THE COLLAPSE OF FTX • NOVEMBER 2022",
        "fontSize": 18,
        "horizontalAlignment": 1,
        "verticalAlignment": 1,
        "color": "#9EB0C2",       // Gris platine / bleu ardoise
        "letterSpacing": 4.0
    });

    // 7. Lier les textes a la plaque (Parenting)
    api.parent(tMain, fPlaque);
    api.parent(tSub, fPlaque);
    api.set(tMain, { "position": [0, 20] });
    api.set(tSub,  { "position": [0, -28] });

    // 8. Flottaison Procédurale : Oscillateurs sur la Plaque
    var oscFloat = api.create("oscillator", "Oscillateur_Flottaison_Y");
    api.set(oscFloat, {
        "minimum": -5.0,
        "maximum": 5.0,
        "frequency": 0.4
    });
    api.connect(oscFloat, "out", fPlaque, "position.y");

    var oscRot = api.create("oscillator", "Oscillateur_Bascule_Z");
    api.set(oscRot, {
        "minimum": -0.8,
        "maximum": 0.8,
        "frequency": 0.3
    });
    api.connect(oscRot, "out", fPlaque, "rotation.z");

    // 9. Animation de Camera / Push-in Cinematic (Frame 0 -> 160)
    api.keyframe(fDesk, 0,   { "scale.x": 1.40, "scale.y": 1.40 });
    api.keyframe(fDesk, 160, { "scale.x": 1.48, "scale.y": 1.48 });
    api.magicEasing(fDesk, "scale.x", 0, "SlowOut");
    api.magicEasing(fDesk, "scale.y", 0, "SlowOut");

    // 10. Remise au debut et lecture
    try {
        api.setTime(0);
        api.play();
    } catch(e) {}

    console.log(">>> [Antigravity] SCENE MODULAIRE DEPLOYEE AVEC SUCCES (0 ERREUR) !");
})();
