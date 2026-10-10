// =============================================================================
// CAVALRY SHOWCASE 2 : MATHEMATICAL GOLDEN SPIRAL VORTEX
// "The $8 Billion Capital Drain — Fibonacci Phyllotaxis Matrix"
// 260 Golden Tokens + Golden Angle Morphing + Event Horizon Accretion
// =============================================================================

(function() {
    console.log(">>> [Antigravity] Generation du Vortex Fibonacci...");

    var comp = api.getActiveComp();

    // 1. Nettoyage de la scene
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
    // LAYER 1 : FOND NOIR COSMOS FORENSIQUE
    // =========================================================================
    var bg = api.primitive("rectangle", "01_Void_Background");
    api.set(bg, {
        "generator.dimensions": [2400, 1400],
        "material.materialColor": "#030611",
        "position": [0, 0]
    });

    // =========================================================================
    // LAYER 2 : LA SPIRALE FIBONACCI (260 TOKENS D'OR EN CHUTE LIBRE)
    // =========================================================================
    // Le token individuel : petite pièce d'or crypto biseautée
    var token = api.primitive("rectangle", "Token_Coin");
    api.set(token, {
        "generator.dimensions": [14, 14],
        "generator.cornerRadius": 7,       // Cercle parfait
        "material.materialColor": "#F59E0B" // Or ambré
    });

    // Duplicateur avec Distribution Fibonacci (Phyllotaxie mathématique)
    var spiralDup = api.create("duplicator", "02_Fibonacci_Capital_Vortex");
    api.setGenerator(spiralDup, "generator", "fibonacciDistribution");
    api.connect(token, "id", spiralDup, "shapes");
    api.set(spiralDup, {
        "generator.count": 260,
        "generator.radius": 540,
        "generator.angle": 137.508 // L'Angle d'Or mathématique parfait
    });

    // 1. Morphing de la spirale : micro-variation de l'angle d'or
    // Cela fait muter les bras de la spirale de manière hypnotique
    var angleOsc = api.create("oscillator", "Oscillateur_Morphing_Angle_Or");
    api.set(angleOsc, {
        "minimum": 137.42,
        "maximum": 137.58,
        "frequency": 0.15
    });
    api.connect(angleOsc, "out", spiralDup, "generator.angle");

    // 2. Rotation globale de la galaxie financière
    var vortexRot = api.create("oscillator", "Oscillateur_Rotation_Galaxie");
    api.set(vortexRot, {
        "minimum": 0.0,
        "maximum": 360.0,
        "frequency": 0.06
    });
    api.connect(vortexRot, "out", spiralDup, "rotation.z");

    // 3. Pulsation d'échelle organique (staggered)
    // Les pièces pulsent en vagues successives depuis le centre
    var scaleOsc = api.create("oscillator", "Oscillateur_Pulsation_Tokens");
    api.set(scaleOsc, {
        "minimum": 0.35,
        "maximum": 1.65,
        "frequency": 0.8,
        "stagger": 3.2
    });
    api.connect(scaleOsc, "out", spiralDup, "shapeScale.x");
    api.connect(scaleOsc, "out", spiralDup, "shapeScale.y");

    // 4. Scintillement d'opacité lumineux
    var opacityOsc = api.create("oscillator", "Oscillateur_Lueur_Tokens");
    api.set(opacityOsc, {
        "minimum": 30.0,
        "maximum": 100.0,
        "frequency": 0.8,
        "stagger": 3.2
    });
    api.connect(opacityOsc, "out", spiralDup, "shapeOpacity");

    // =========================================================================
    // LAYER 3 : L'HORIZON DES EVENEMENTS (LE TROU NOIR DES 8 MILLIARDS)
    // =========================================================================
    // Disque central d'absorption
    var blackHole = api.primitive("ellipse", "03_BlackHole_Core");
    api.set(blackHole, {
        "generator.radius": [95, 95],
        "material.materialColor": "#02040A",
        "stroke.strokeColor": "#EF4444",    // Liseré rouge alerte
        "stroke.strokeWidth": 2.5
    });

    // Anneau d'accrétion rouge incandescent
    var accretionRing = api.primitive("ellipse", "04_Accretion_Disk");
    api.set(accretionRing, {
        "generator.radius": [125, 125],
        "material.alpha": 0.0,              // Vide à l'intérieur
        "stroke.strokeColor": "#EF4444",
        "stroke.strokeWidth": 1.5,
        "opacity": 75.0
    });

    var accretionPulse = api.create("oscillator", "Oscillateur_Accretion_Pulse");
    api.set(accretionPulse, {
        "minimum": 0.92,
        "maximum": 1.10,
        "frequency": 1.2
    });
    api.connect(accretionPulse, "out", accretionRing, "scale.x");
    api.connect(accretionPulse, "out", accretionRing, "scale.y");

    // =========================================================================
    // LAYER 4 : CERCLES CONCENTRIQUES DE TRAÇAGE ON-CHAIN
    // =========================================================================
    var scope1 = api.primitive("ellipse", "05_OnChain_Scope_Outer");
    api.set(scope1, {
        "generator.radius": [460, 460],
        "material.alpha": 0.0,
        "stroke.strokeColor": "#00E5FF", // Cyan blockchain
        "stroke.strokeWidth": 1.0,
        "opacity": 40.0
    });

    var scope2 = api.primitive("ellipse", "06_OnChain_Scope_Mid");
    api.set(scope2, {
        "generator.radius": [310, 310],
        "material.alpha": 0.0,
        "stroke.strokeColor": "#F59E0B", // Or
        "stroke.strokeWidth": 1.0,
        "opacity": 50.0
    });

    // =========================================================================
    // LAYER 5 : HUD DE TELEMETRIE BLOCKCHAIN FORENSIQUE
    // =========================================================================
    var hudHeader = api.create("textShape", "07_HUD_Trace_Protocol");
    api.set(hudHeader, {
        "text": "[ BLOCKCHAIN CAPITAL DRAIN // 260 LIQUIDITY POOLS COLLAPSING ]",
        "fontSize": 15,
        "horizontalAlignment": 1,
        "position": [0, -320],
        "color": "#00E5FF",
        "letterSpacing": 6.0
    });

    var hudCoreText = api.create("textShape", "08_HUD_BlackHole_Label");
    api.set(hudCoreText, {
        "text": "DEFICIT",
        "fontSize": 13,
        "horizontalAlignment": 1,
        "position": [0, -12],
        "color": "#94A3B8",
        "letterSpacing": 4.0
    });

    var hudNumber = api.create("textShape", "09_HUD_Drain_Amount");
    api.set(hudNumber, {
        "text": "-$8.0B",
        "fontSize": 26,
        "horizontalAlignment": 1,
        "position": [0, 16],
        "color": "#EF4444",
        "letterSpacing": 2.0
    });

    var hudFooter = api.create("textShape", "10_HUD_Status_Alert");
    api.set(hudFooter, {
        "text": "CRITICAL ILLIQUIDITY EVENT • NOVEMBER 2022",
        "fontSize": 14,
        "horizontalAlignment": 1,
        "position": [0, 340],
        "color": "#F59E0B",
        "letterSpacing": 5.0
    });

    // Lancer la lecture automatique
    try {
        api.setTime(0);
        api.play();
    } catch(e) {}

    console.log(">>> [Antigravity] VORTEX FIBONACCI REUSSI (0 ERREUR) !");
})();
