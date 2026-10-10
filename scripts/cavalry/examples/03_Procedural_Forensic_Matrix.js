// =============================================================================
// CAVALRY SHOWCASE : PURE PROCEDURAL MOTION DESIGN
// "The Capital Drain Matrix & Forensic FUI Radar"
// 400 Nodes Simplex Wave + 60-Tick Circular Dial + Concentric Pulses
// =============================================================================

(function() {
    console.log(">>> [Antigravity] Generation du Chef-d'Oeuvre Procedural Cavalry...");

    var comp = api.getActiveComp();

    // 1. Nettoyage complet
    try {
        var compLayers = api.getCompLayers(false);
        for (var i = compLayers.length - 1; i >= 0; i--) {
            var lid = compLayers[i];
            if (api.layerExists(lid) && lid !== comp && api.getLayerType(lid) !== "composition") {
                try { api.deleteLayer(lid); } catch(e) {}
            }
        }
    } catch(err) {
        console.warn("Nettoyage: " + err);
    }

    // 2. Configuration HD 1920x1080 @ 25fps
    try {
        api.set(comp, {
            "resolution": [1920, 1080],
            "fps": 25.0
        });
    } catch(e) {}

    // =========================================================================
    // LAYER 1 : FOND NOIR PROFOND CYBERNETIQUE
    // =========================================================================
    var bg = api.primitive("rectangle", "01_Background_DeepDark");
    api.set(bg, {
        "generator.dimensions": [2400, 1400],
        "material.materialColor": "#040711",
        "position": [0, 0]
    });

    // =========================================================================
    // LAYER 2 : LA GRILLE MATHEMATIQUE (400 NOEUDS ONDULANTS)
    // =========================================================================
    // Forme élémentaire : petit carré cyber biseauté
    var cell = api.primitive("rectangle", "Matrix_Data_Node");
    api.set(cell, {
        "generator.dimensions": [14, 14],
        "generator.cornerRadius": 3,
        "material.materialColor": "#00E5FF", // Cyan électrique
        "position": [0, 0]
    });

    // Duplicateur Grille : 25 colonnes x 16 lignes = 400 points
    var gridDup = api.create("duplicator", "02_Capital_Grid_400_Points");
    api.connect(cell, "id", gridDup, "shapes");
    api.set(gridDup, {
        "generator.count": [25, 16],
        "generator.size": [1680, 960]
    });

    // Moteur d'onde 1 : Ondulation verticale en vague déphasée (Staggered Oscillator)
    var waveY = api.create("oscillator", "Oscillateur_Vague_Y");
    api.set(waveY, {
        "minimum": -70.0,
        "maximum": 70.0,
        "frequency": 0.6,
        "stagger": 2.8
    });
    api.connect(waveY, "out", gridDup, "shapePosition.y");

    // Moteur d'onde 2 : Échelle dynamique (pulsation 3D de la vague)
    var waveScale = api.create("oscillator", "Oscillateur_Echelle_Vague");
    api.set(waveScale, {
        "minimum": 0.25,
        "maximum": 1.75,
        "frequency": 0.6,
        "stagger": 2.8
    });
    api.connect(waveScale, "out", gridDup, "shapeScale.x");
    api.connect(waveScale, "out", gridDup, "shapeScale.y");

    // Moteur d'onde 3 : Évanouissement lumineux (Opacité des crêtes)
    var waveOpacity = api.create("oscillator", "Oscillateur_Lueur_Vague");
    api.set(waveOpacity, {
        "minimum": 15.0,
        "maximum": 100.0,
        "frequency": 0.6,
        "stagger": 2.8
    });
    api.connect(waveOpacity, "out", gridDup, "shapeOpacity");

    // =========================================================================
    // LAYER 3 : LE CADRAN FUI CIRCULAIRE (RADAR FORENSIQUE 60 TICKS)
    // =========================================================================
    var tick = api.primitive("rectangle", "Radar_Tick");
    api.set(tick, {
        "generator.dimensions": [4, 26],
        "generator.cornerRadius": 1,
        "material.materialColor": "#F59E0B" // Or ambré crypto
    });

    var dialDup = api.create("duplicator", "03_Forensic_Radar_60_Ticks");
    api.setGenerator(dialDup, "generator", "circleDistribution");
    api.connect(tick, "id", dialDup, "shapes");
    api.set(dialDup, {
        "generator.count": 60,
        "generator.radius": 280
    });

    // Rotation continue 360° du cadran
    var dialRot = api.create("oscillator", "Oscillateur_Rotation_Cadran");
    api.set(dialRot, {
        "minimum": 0.0,
        "maximum": 360.0,
        "frequency": 0.08
    });
    api.connect(dialRot, "out", dialDup, "rotation.z");

    // Micro-pulsation de taille des ticks
    var tickPulse = api.create("oscillator", "Oscillateur_Pulsation_Ticks");
    api.set(tickPulse, {
        "minimum": 0.7,
        "maximum": 1.3,
        "frequency": 1.2,
        "stagger": 0.8
    });
    api.connect(tickPulse, "out", dialDup, "shapeScale.y");

    // =========================================================================
    // LAYER 4 : ANNEAUX CONCENTRIQUES CYBER (RADAR SCOPE)
    // =========================================================================
    var ringOuter = api.primitive("ellipse", "04_Anneau_Radar_Externe");
    api.set(ringOuter, {
        "generator.radius": [320, 320],
        "material.alpha": 0.0,            // Pas de fond
        "stroke.strokeColor": "#00E5FF",  // Contour cyan
        "stroke.strokeWidth": 2.0,
        "opacity": 70.0
    });

    var ringInner = api.primitive("ellipse", "05_Anneau_Radar_Interne");
    api.set(ringInner, {
        "generator.radius": [220, 220],
        "material.alpha": 0.0,
        "stroke.strokeColor": "#F59E0B",  // Contour or
        "stroke.strokeWidth": 1.5,
        "opacity": 85.0
    });

    // Pulsation d'échelle douce des anneaux
    var ringBreath = api.create("oscillator", "Oscillateur_Respiration_Anneaux");
    api.set(ringBreath, {
        "minimum": 0.96,
        "maximum": 1.04,
        "frequency": 0.4
    });
    api.connect(ringBreath, "out", ringOuter, "scale.x");
    api.connect(ringBreath, "out", ringOuter, "scale.y");
    api.connect(ringBreath, "out", ringInner, "scale.x");
    api.connect(ringBreath, "out", ringInner, "scale.y");

    // =========================================================================
    // LAYER 5 : COEUR DE TELEMETRIE FORENSIQUE (DATA CENTER HUD)
    // =========================================================================
    // Losange central tournant
    var diamond = api.primitive("polygon", "06_Coeur_Losange_Central");
    api.set(diamond, {
        "generator.sides": 4,
        "generator.radius": 45,
        "material.materialColor": "#10B981", // Vert émeraude data
        "opacity": 90.0
    });

    var diamondRot = api.create("oscillator", "Oscillateur_Rotation_Losange");
    api.set(diamondRot, {
        "minimum": -45.0,
        "maximum": 135.0,
        "frequency": 0.25
    });
    api.connect(diamondRot, "out", diamond, "rotation.z");

    // Titres de télémétrie HUD
    var tHud1 = api.create("textShape", "07_HUD_Status_Header");
    api.set(tHud1, {
        "text": "[ FORENSIC CAPITAL TELEMETRY // ALAMEDA DRAIN ]",
        "fontSize": 16,
        "horizontalAlignment": 1,
        "position": [0, -75],
        "color": "#00E5FF",
        "letterSpacing": 5.0
    });

    var tHud2 = api.create("textShape", "08_HUD_Live_Deficit");
    api.set(tHud2, {
        "text": "-$8,240,000,000.00",
        "fontSize": 34,
        "horizontalAlignment": 1,
        "position": [0, 85],
        "color": "#EF4444", // Rouge alerte déficit
        "letterSpacing": 3.0
    });

    // Pulsation d'alerte sur le chiffre
    var alertPulse = api.create("oscillator", "Oscillateur_Alerte_Deficit");
    api.set(alertPulse, {
        "minimum": 60.0,
        "maximum": 100.0,
        "frequency": 1.5
    });
    api.connect(alertPulse, "out", tHud2, "opacity");

    // Lancer la lecture
    try {
        api.setTime(0);
        api.play();
    } catch(e) {}

    console.log(">>> [Antigravity] SHOWCASE PROCEDURAL CAVALRY REUSSI AVEC SUCCES !");
})();
