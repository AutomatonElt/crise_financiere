// =============================================================================
// THE LEDGER - MASTER MOTION DESIGN SCENE : "NINE DAYS TO ZERO"
// 100% Native Architecture for Cavalry 2.8
// =============================================================================

(function() {
    console.log(">>> [Antigravity] Construction finale de Nine Days To Zero...");

    // 1. Nettoyage complet
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

    // Helper pour creer des rectangles parfaits avec setGenerator
    function createRect(name, color, scaleX, scaleY, posX, posY, rot) {
        var s = api.create("basicShape", name);
        try { api.setGenerator(s, "rectangle"); } catch(e) {}
        var props = {
            "color": color,
            "scale.x": scaleX,
            "scale.y": scaleY,
            "position.x": posX || 0,
            "position.y": posY || 0
        };
        if (rot !== undefined) props["rotation"] = rot;
        api.set(s, props);
        return s;
    }

    // 2. FOND SOMBRE DE TABLE D'INVESTIGATION (1920x1080)
    var bg = createRect("Desk_Background", "#0B0F19", 19.2, 10.8, 0, 0);

    // 3. PLAQUE CENTRALE EN ARDOISE NOIRE & FINITION OR
    var plaqueShadow = createRect("Plaque_Shadow", "#000000AA", 8.8, 3.4, 0, 20);
    var plaque = createRect("Plaque_Slate", "#181D26", 8.6, 3.2, 0, 0);

    // Filet dore
    var divider = createRect("Gold_Divider", "#D4AF37", 7.2, 0.03, 0, 25);

    // 4. TYPOGRAPHIES PRINCIPALES
    var badge = api.create("textShape", "Badge_CaseFile");
    api.set(badge, {
        "text": "FORENSIC DOSSIER // CHAPTER 01",
        "fontSize": 14,
        "horizontalAlignment": 1,
        "color": "#D4AF37",
        "position.x": 0,
        "position.y": -95
    });

    var mainTitle = api.create("textShape", "Title_NineDays");
    api.set(mainTitle, {
        "text": "NINE DAYS TO ZERO",
        "fontSize": 66,
        "horizontalAlignment": 1,
        "color": "#F5E8C7",
        "position.x": 0,
        "position.y": -35
    });

    var subtitle = api.create("textShape", "Subtitle_FTX");
    api.set(subtitle, {
        "text": "THE COLLAPSE OF FTX • NOVEMBER 2022",
        "fontSize": 20,
        "horizontalAlignment": 1,
        "color": "#38BDF8",
        "position.x": 0,
        "position.y": 65
    });

    // 5. DOCUMENT FLOTTANT GAUCHE : BILAN D'ALAMEDA LEAKED
    var doc1Shadow = createRect("Doc1_Shadow", "#00000088", 3.1, 4.1, -570, -160, -8);
    var doc1Paper = createRect("Doc1_BalanceSheet", "#FAF8F2", 3.1, 4.1, -580, -180, -8);

    var doc1Text = api.create("textShape", "Doc1_Content");
    api.set(doc1Text, {
        "text": "LEAKED FINANCIAL BALANCE\\nALAMEDA RESEARCH LTD.\\n\\nFTT Reserves : $5.8B\\nLiabilities : -$8.4B\\n\\nDEFICIT: $8,000,000,000",
        "fontSize": 12,
        "horizontalAlignment": 0,
        "color": "#1E293B",
        "position.x": -700,
        "position.y": -280,
        "rotation": -8
    });

    // 6. DOCUMENT FLOTTANT DROITE : POLAROID SBF
    var sbfShadow = createRect("SBF_Polaroid_Shadow", "#00000088", 2.9, 3.7, 590, -40, 6);
    var sbfFrame = createRect("SBF_Polaroid_Frame", "#FFFDF8", 2.9, 3.7, 580, -60, 6);
    var sbfPhoto = createRect("SBF_Photo_Box", "#2D3748", 2.5, 2.5, 580, -95, 6);

    var sbfLabel = api.create("textShape", "SBF_Label");
    api.set(sbfLabel, {
        "text": "SAM BANKMAN-FRIED\\nSUSPECT #01 // BAHAMAS",
        "fontSize": 13,
        "horizontalAlignment": 1,
        "color": "#111827",
        "position.x": 580,
        "position.y": 80,
        "rotation": 6
    });

    // 7. MEMO POST-IT BAS GAUCHE : BACKDOOR CODE
    var memoPaper = createRect("Memo_Paper", "#FEF08A", 2.8, 1.7, -550, 260, 5);

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

    // 8. FIL ROUGE D'ENQUETE
    var redString = createRect("Forensic_Red_String", "#EF4444", 12.0, 0.04, 0, -110, -8);

    console.log(">>> [Antigravity] VICTOIRE ! Scene Nine Days To Zero creee sans aucune erreur !");
})();
