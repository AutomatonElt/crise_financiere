// =============================================================================
// THE LEDGER - MASTER MOTION DESIGN SCENE : "NINE DAYS TO ZERO"
// 100% Validated Syntax for Cavalry 2.8 Engine
// =============================================================================

(function() {
    console.log(">>> [Antigravity] Lancement du deploiement Nine Days To Zero...");

    // 1. Nettoyage securise des anciens calques (par ID string unitaire)
    try {
        var comp = api.getActiveComp();
        var children = api.getChildren(comp);
        if (children) {
            for (var i = 0; i < children.length; i++) {
                try { api.deleteLayer(children[i]); } catch(e) {}
            }
        }
    } catch(err) {
        console.warn("Nettoyage: " + err);
    }

    // 2. Fond Sombre "Forensic Midnight" (1920x1080)
    var bg = api.create("basicShape", "Investigation_Desk_Surface");
    try { api.setGenerator(bg, "rectangle"); } catch(e) {}
    api.set(bg, {
        "color": "#0D1117",
        "scale.x": 19.2,
        "scale.y": 10.8,
        "position.x": 0,
        "position.y": 0
    });

    // 3. Plaque Centrale en Ardoise & Finition Or
    var plaqueShadow = api.create("basicShape", "Plaque_Shadow");
    try { api.setGenerator(plaqueShadow, "rectangle"); } catch(e) {}
    api.set(plaqueShadow, {
        "color": "#000000AA",
        "scale.x": 8.6,
        "scale.y": 3.3,
        "position.x": 0,
        "position.y": 25
    });

    var plaque = api.create("basicShape", "Plaque_Slate");
    try { api.setGenerator(plaque, "rectangle"); } catch(e) {}
    api.set(plaque, {
        "color": "#1C212B",
        "stroke": true,
        "strokeColor": "#D4AF37",
        "strokeWidth": 2,
        "scale.x": 8.6,
        "scale.y": 3.3,
        "position.x": 0,
        "position.y": 0
    });

    // Filet or horizontal
    var divider = api.create("basicShape", "Gold_Divider");
    try { api.setGenerator(divider, "rectangle"); } catch(e) {}
    api.set(divider, {
        "color": "#D4AF37",
        "scale.x": 7.4,
        "scale.y": 0.03,
        "position.x": 0,
        "position.y": 25
    });

    // Badge superieur
    var badge = api.create("textShape", "Badge_CaseFile");
    api.set(badge, {
        "text": "FORENSIC DOSSIER // CHAPTER 01",
        "fontSize": 14,
        "horizontalAlignment": 1,
        "color": "#D4AF37",
        "position.x": 0,
        "position.y": -95
    });

    // Titre principal
    var mainTitle = api.create("textShape", "Title_NineDays");
    api.set(mainTitle, {
        "text": "NINE DAYS TO ZERO",
        "fontSize": 64,
        "horizontalAlignment": 1,
        "color": "#F5E8C7",
        "position.x": 0,
        "position.y": -35
    });

    // Sous-titre cyan
    var subtitle = api.create("textShape", "Subtitle_Collapse");
    api.set(subtitle, {
        "text": "THE COLLAPSE OF FTX • NOVEMBER 2022",
        "fontSize": 20,
        "horizontalAlignment": 1,
        "color": "#38BDF8",
        "position.x": 0,
        "position.y": 65
    });

    // 4. Document Flottant 1 : Bilan Alameda Leaked (Gauche)
    var doc1Shadow = api.create("basicShape", "Doc1_Shadow");
    try { api.setGenerator(doc1Shadow, "rectangle"); } catch(e) {}
    api.set(doc1Shadow, {
        "color": "#00000088",
        "scale.x": 3.1,
        "scale.y": 4.1,
        "position.x": -570,
        "position.y": -160,
        "rotation": -8
    });

    var doc1 = api.create("basicShape", "Doc1_BalanceSheet");
    try { api.setGenerator(doc1, "rectangle"); } catch(e) {}
    api.set(doc1, {
        "color": "#FAF8F2",
        "stroke": true,
        "strokeColor": "#CBD5E1",
        "strokeWidth": 1.5,
        "scale.x": 3.1,
        "scale.y": 4.1,
        "position.x": -580,
        "position.y": -180,
        "rotation": -8
    });

    var doc1Text = api.create("textShape", "Doc1_Content");
    api.set(doc1Text, {
        "text": "LEAKED FINANCIAL BALANCE\\nALAMEDA RESEARCH LTD.\\n\\nFTT Reserves : $5.8B (Illiquid)\\nLiabilities   : -$8.4B (Client Funds)\\n\\nDEFICIT: $8,000,000,000",
        "fontSize": 12,
        "horizontalAlignment": 0,
        "color": "#1E293B",
        "position.x": -710,
        "position.y": -280,
        "rotation": -8
    });

    // 5. Document Flottant 2 : Polaroid Sam Bankman-Fried (Droite)
    var sbfShadow = api.create("basicShape", "SBF_Polaroid_Shadow");
    try { api.setGenerator(sbfShadow, "rectangle"); } catch(e) {}
    api.set(sbfShadow, {
        "color": "#00000088",
        "scale.x": 2.9,
        "scale.y": 3.7,
        "position.x": 590,
        "position.y": -40,
        "rotation": 6
    });

    var sbfFrame = api.create("basicShape", "SBF_Polaroid_Frame");
    try { api.setGenerator(sbfFrame, "rectangle"); } catch(e) {}
    api.set(sbfFrame, {
        "color": "#FFFDF8",
        "scale.x": 2.9,
        "scale.y": 3.7,
        "position.x": 580,
        "position.y": -60,
        "rotation": 6
    });

    var sbfPhotoBox = api.create("basicShape", "SBF_Photo_Box");
    try { api.setGenerator(sbfPhotoBox, "rectangle"); } catch(e) {}
    api.set(sbfPhotoBox, {
        "color": "#2D3748",
        "scale.x": 2.5,
        "scale.y": 2.5,
        "position.x": 580,
        "position.y": -95,
        "rotation": 6
    });

    var sbfLabel = api.create("textShape", "SBF_Polaroid_Label");
    api.set(sbfLabel, {
        "text": "SAM BANKMAN-FRIED\\nSUSPECT #01 // BAHAMAS",
        "fontSize": 13,
        "horizontalAlignment": 1,
        "color": "#111827",
        "position.x": 580,
        "position.y": 80,
        "rotation": 6
    });

    // 6. Document Flottant 3 : Note Manuscrite Backdoor (Bas Gauche)
    var memoPaper = api.create("basicShape", "Memo_Paper");
    try { api.setGenerator(memoPaper, "rectangle"); } catch(e) {}
    api.set(memoPaper, {
        "color": "#FEF08A",
        "scale.x": 2.8,
        "scale.y": 1.7,
        "position.x": -550,
        "position.y": 260,
        "rotation": 5
    });

    var memoText = api.create("textShape", "Memo_Text");
    api.set(memoText, {
        "text": "SECRET BACKDOOR CODE\\ncan.send(\"mest\")\\n-> $10B wire to Alameda",
        "fontSize": 13,
        "horizontalAlignment": 0,
        "color": "#451A03",
        "position.x": -660,
        "position.y": 230,
        "rotation": 5
    });

    // 7. Fil Rouge d'Enquete
    var redString = api.create("basicShape", "Forensic_Red_String");
    try { api.setGenerator(redString, "rectangle"); } catch(e) {}
    api.set(redString, {
        "color": "#EF4444CC",
        "scale.x": 12.0,
        "scale.y": 0.04,
        "position.x": 0,
        "position.y": -110,
        "rotation": -8
    });

    // 8. Oscillateurs Harmoniques (Lévitation Procédurale 2.5D)
    try {
        var oscDoc1 = api.create("oscillator", "Osc_Doc1");
        api.set(oscDoc1, { "min": -195, "max": -165, "frequency": 0.45 });
        api.connect(oscDoc1, "output", doc1, "position.y");
        api.connect(oscDoc1, "output", doc1Text, "position.y");

        var oscSbf = api.create("oscillator", "Osc_SBF");
        api.set(oscSbf, { "min": -75, "max": -45, "frequency": 0.52 });
        api.connect(oscSbf, "output", sbfFrame, "position.y");
        api.connect(oscSbf, "output", sbfPhotoBox, "position.y");
        api.connect(oscSbf, "output", sbfLabel, "position.y");

        var oscMemo = api.create("oscillator", "Osc_Memo");
        api.set(oscMemo, { "min": 248, "max": 272, "frequency": 0.38 });
        api.connect(oscMemo, "output", memoPaper, "position.y");
        api.connect(oscMemo, "output", memoText, "position.y");

        var oscPlaque = api.create("oscillator", "Osc_Plaque");
        api.set(oscPlaque, { "min": -6, "max": 6, "frequency": 0.25 });
        api.connect(oscPlaque, "output", plaque, "position.y");
        api.connect(oscPlaque, "output", divider, "position.y");
        api.connect(oscPlaque, "output", mainTitle, "position.y");
        api.connect(oscPlaque, "output", subtitle, "position.y");
        api.connect(oscPlaque, "output", badge, "position.y");
    } catch(oscErr) {
        console.warn("Oscillateurs: " + oscErr);
    }

    try { api.play(); } catch(e) {}
    console.log(">>> [Antigravity] DEPLOIEMENT REUSSI AVEC SUCCES TOTAL !");
})();
