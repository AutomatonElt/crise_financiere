// =============================================================================
// CAVALRY MASTERPIECE : "LE RESEAU OPAQUE D'ALAMEDA" (VERSION XXL CONTRASTEE)
// Grand format, néons vibrants, câbles larges et badges visibles
// =============================================================================

(function() {
    console.log(">>> [Antigravity] Compilation du Reseau XXL...");

    var comp = api.getActiveComp();

    // 1. Nettoyage
    try {
        var compLayers = api.getCompLayers(false);
        for (var i = compLayers.length - 1; i >= 0; i--) {
            var lid = compLayers[i];
            if (api.layerExists(lid) && lid !== comp && api.getLayerType(lid) !== "composition") {
                try { api.deleteLayer(lid); } catch(e) {}
            }
        }
    } catch(err) {}

    // 2. Config HD
    try {
        api.set(comp, { "resolution": [1920, 1080], "fps": 25.0 });
    } catch(e) {}

    // =========================================================================
    // LAYER 1 : FOND BLEU NUIT PROFOND
    // =========================================================================
    var bg = api.primitive("rectangle", "01_Fond");
    api.set(bg, {
        "generator.dimensions": [2500, 1500],
        "material.materialColor": "#0A0F1D",
        "position": [0, 0]
    });

    // =========================================================================
    // HELPER : CABLE LARGE (10px) AVEC PAQUET LUMINEUX XXL
    // =========================================================================
    function createBigCable(name, centerPos, length, angleDeg, colorHex) {
        // Câble porteur bien épais et visible
        var cable = api.primitive("rectangle", name + "_Cable");
        api.set(cable, {
            "generator.dimensions": [length, 8],
            "generator.cornerRadius": 4,
            "material.materialColor": colorHex,
            "opacity": 50.0,
            "position": centerPos,
            "rotation": [0, 0, angleDeg]
        });

        // Capsule d'argent voyageuse (très visible : 50x18 px néon)
        var packet = api.primitive("rectangle", name + "_MoneyPacket");
        api.set(packet, {
            "generator.dimensions": [60, 20],
            "generator.cornerRadius": 10,
            "material.materialColor": "#FFFFFF", // Blanc éclatant
            "stroke.strokeColor": colorHex,
            "stroke.strokeWidth": 3.0,
            "opacity": 100.0
        });
        api.parent(packet, cable);

        var osc = api.create("oscillator", name + "_Travel");
        api.set(osc, {
            "minimum": -length / 2 + 50,
            "maximum": length / 2 - 50,
            "frequency": 0.7
        });
        api.connect(osc, "out", packet, "position.x");
        api.set(packet, { "position.y": 0 });
    }

    createBigCable("C1_FTX_Alameda", [-240, -50], 512, 20.55, "#EF4444");
    createBigCable("C2_Alameda_NorthDim", [-350, -230], 316, -34.7, "#F59E0B");
    createBigCable("C3_FTX_Deltec", [240, 80], 486, 9.46, "#10B981");
    createBigCable("C4_FTX_Albany", [160, 175], 418, 40.18, "#00E5FF");

    // =========================================================================
    // HELPER : NOEUD BANCAIRE XXL BIEN VISIBLE (Diamètre 160px à 200px)
    // =========================================================================
    function createBigNode(name, pos, radius, colorHex, titleText, descText) {
        // 1. Onde de choc extérieure
        var rip = api.primitive("ellipse", name + "_Onde");
        api.set(rip, {
            "generator.radius": [radius * 1.5, radius * 1.5],
            "material.alpha": 0.0,
            "stroke.strokeColor": colorHex,
            "stroke.strokeWidth": 4.0,
            "position": pos
        });

        var ripOsc = api.create("oscillator", name + "_Pulse");
        api.set(ripOsc, { "minimum": 0.9, "maximum": 1.4, "frequency": 0.8 });
        api.connect(ripOsc, "out", rip, "scale.x");
        api.connect(ripOsc, "out", rip, "scale.y");

        // 2. Disque solide bien contrasté
        var core = api.primitive("ellipse", name + "_Disque");
        api.set(core, {
            "generator.radius": [radius, radius],
            "material.materialColor": "#151F36", // Bleu nuit lumineux
            "stroke.strokeColor": colorHex,
            "stroke.strokeWidth": 6.0,
            "position": pos
        });

        // 3. Titre au-dessus (très lisible : 22px blanc gras)
        var tTitle = api.create("textShape", name + "_Titre");
        api.set(tTitle, {
            "text": titleText,
            "fontSize": 20,
            "horizontalAlignment": 1,
            "position": [pos[0], pos[1] - radius - 20],
            "color": "#FFFFFF",
            "letterSpacing": 2.0
        });

        // 4. Montant en dessous (20px couleur néon)
        var tDesc = api.create("textShape", name + "_Montant");
        api.set(tDesc, {
            "text": descText,
            "fontSize": 18,
            "horizontalAlignment": 1,
            "position": [pos[0], pos[1] + radius + 22],
            "color": colorHex,
            "letterSpacing": 2.0
        });
    }

    // Nœuds à grande échelle :
    createBigNode("N_FTX", [0, 40], 75, "#00E5FF", "FTX EXCHANGE", "DEPÔTS CLIENTS");
    createBigNode("N_Alameda", [-480, -140], 85, "#EF4444", "ALAMEDA RESEARCH", "-$8.2 MILLIARDS");
    createBigNode("N_Deltec", [480, 120], 70, "#10B981", "DELTEC BANK", "RÉSERVES TETHER");
    createBigNode("N_NorthDim", [-220, -320], 60, "#F59E0B", "NORTH DIMENSION", "SOCIÉTÉ ÉCRAN");
    createBigNode("N_Albany", [320, 310], 65, "#E5C158", "PENTHOUSES ALBANY", "IMMOBILIER LUXE");

    // =========================================================================
    // TITRAGES HUD FORENSIQUES
    // =========================================================================
    var header = api.create("textShape", "HUD_Top_Header");
    api.set(header, {
        "text": "RÉSEAU DE DÉTOURNEMENT DES FONDS // AFFAIRE FTX",
        "fontSize": 26,
        "horizontalAlignment": 1,
        "position": [0, -460],
        "color": "#00E5FF",
        "letterSpacing": 4.0
    });

    var alertBottom = api.create("textShape", "HUD_Bottom_Alert");
    api.set(alertBottom, {
        "text": "DÉFICIT TOTAL CONSTATÉ : -$8,700,000,000 USD",
        "fontSize": 28,
        "horizontalAlignment": 1,
        "position": [0, 460],
        "color": "#EF4444",
        "letterSpacing": 3.0
    });

    var pOsc = api.create("oscillator", "Alerte_Pulse");
    api.set(pOsc, { "minimum": 50.0, "maximum": 100.0, "frequency": 1.2 });
    api.connect(pOsc, "out", alertBottom, "opacity");

    try { api.setTime(0); api.play(); } catch(e) {}
    console.log(">>> [Antigravity] RESEAU XXL REUSSI !");
})();
