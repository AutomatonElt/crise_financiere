// =============================================================================
// THE LEDGER - SCÈNE DE MOTION DESIGN PROCÉDURALE (CAVALRY 2D)
// Forensic Flow Matrix & HUD Investigation Title
// =============================================================================

(function() {
    api.log(">>> Lancement de la construction de la scène Motion Design...");

    // 1. Nettoyage préventif des calques existants
    try {
        var existing = api.getLayers();
        for (var i = 0; i < existing.length; i++) {
            api.delete(existing[i]);
        }
    } catch(e) {
        api.log("Note nettoyage: " + e);
    }

    // 2. Fond Sombre "Forensic Midnight" (#0B0F19)
    var bg = api.create("basicShape", "Background_Dark");
    api.set(bg, {
        "generator.shape": 1, // Rectangle
        "generator.width": 1920,
        "generator.height": 1080,
        "color": { "r": 11, "g": 15, "b": 25, "a": 255 }
    });

    // 3. Grille de Nœuds Procédurale (Wall Street Liquidity Grid)
    // Forme de base : Petit point lumineux cyan
    var dot = api.create("basicShape", "DataNode_Base");
    api.set(dot, {
        "generator.shape": 0, // Ellipse
        "generator.radius": 3.5,
        "color": { "r": 56, "g": 189, "b": 248, "a": 120 } // Cyan semi-transparent
    });

    // Duplicateur en matrice 16 x 9
    var gridDup = api.create("duplicator", "Liquidity_Grid");
    api.connect(dot, "id", gridDup, "shapes.0");
    api.set(gridDup, {
        "distribution": 1, // Grid
        "grid.columns": 16,
        "grid.rows": 9,
        "grid.spacing.x": 110,
        "grid.spacing.y": 95
    });

    // Behaviour Bruit (Noise) pour faire onduler subtilement la grille
    var gridNoise = api.create("noise", "Grid_Fluctuation");
    api.set(gridNoise, {
        "frequency": 0.4,
        "strength": 25,
        "noiseType": 1 // Perlin/Simplex
    });
    api.connect(gridNoise, "output", gridDup, "transform.position.y");

    // 4. Anneau de Ciblage Central (Forensic Reticle)
    var reticle = api.create("basicShape", "Reticle_Ring");
    api.set(reticle, {
        "generator.shape": 0, // Ellipse
        "generator.radius": 240,
        "fill": false,
        "stroke": true,
        "strokeColor": { "r": 14, "g": 165, "b": 233, "a": 70 }, // Cyan clair discret
        "strokeWidth": 1.5
    });

    // Anneau intérieur hexagonal rotatif
    var hexRing = api.create("basicShape", "Hex_Target");
    api.set(hexRing, {
        "generator.shape": 2, // Polygon
        "generator.sides": 6,
        "generator.radius": 180,
        "fill": false,
        "stroke": true,
        "strokeColor": { "r": 245, "g": 158, "b": 11, "a": 90 }, // Ambre / Or
        "strokeWidth": 2
    });

    // Oscillateur de rotation pour l'hexagone
    var hexOsc = api.create("oscillator", "Hex_Rotation_Osc");
    api.set(hexOsc, {
        "min": -45,
        "max": 45,
        "frequency": 0.3
    });
    api.connect(hexOsc, "output", hexRing, "transform.rotation");

    // 5. Typographie Principale : THE LEDGER
    var mainTitle = api.create("textShape", "Title_Main");
    api.set(mainTitle, {
        "text": "THE LEDGER",
        "fontSize": 82,
        "horizontalAlignment": 1, // Centré
        "position.x": 0,
        "position.y": 0,
        "color": { "r": 248, "g": 250, "b": 252, "a": 255 }, // Blanc éclatant
        "letterSpacing": 6
    });

    // Sous-titre Supérieur (Catégorie Forensic)
    var subHeader = api.create("textShape", "Header_Forensic");
    api.set(subHeader, {
        "text": "FINANCIAL FORENSICS & INVESTIGATION",
        "fontSize": 18,
        "horizontalAlignment": 1,
        "position.x": 0,
        "position.y": -65,
        "color": { "r": 56, "g": 189, "b": 248, "a": 220 }, // Cyan vif
        "letterSpacing": 8
    });

    // Sous-titre Inférieur (Dossier / Épisode)
    var subFooter = api.create("textShape", "Footer_Episode");
    api.set(subFooter, {
        "text": "DOSSIER // 02-FTX : LE TROU NOIR D'ALAMEDA",
        "fontSize": 20,
        "horizontalAlignment": 1,
        "position.x": 0,
        "position.y": 68,
        "color": { "r": 245, "g": 158, "b": 11, "a": 240 }, // Or / Ambre
        "letterSpacing": 4
    });

    // 6. Éléments HUD / Télémétrie d'Investigation
    var hudTopLeft = api.create("textShape", "HUD_TopLeft");
    api.set(hudTopLeft, {
        "text": "STATUS: RECORDING // 25.00 FPS\nNODE: 0x8F92...C44\nSOURCE: ON-CHAIN LEDGER",
        "fontSize": 13,
        "horizontalAlignment": 0, // Aligné à gauche
        "position.x": -880,
        "position.y": -460,
        "color": { "r": 148, "g": 163, "b": 184, "a": 180 },
        "lineSpacing": 1.4
    });

    var hudBottomRight = api.create("textShape", "HUD_BottomRight");
    api.set(hudBottomRight, {
        "text": "[ SYSTEM VERIFIED - CAVALRY 2D LINUX ENGINE ]",
        "fontSize": 12,
        "horizontalAlignment": 2, // Aligné à droite
        "position.x": 880,
        "position.y": 480,
        "color": { "r": 56, "g": 189, "b": 248, "a": 160 }
    });

    // Pulsation d'opacité subtile sur le statut HUD
    var hudPulse = api.create("oscillator", "HUD_Blink");
    api.set(hudPulse, {
        "min": 100,
        "max": 255,
        "frequency": 2.0
    });
    api.connect(hudPulse, "output", hudTopLeft, "opacity");

    api.log(">>> Scène Motion Design créée avec succès !");
})();
