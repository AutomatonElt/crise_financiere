// =============================================================================
// THE LEDGER - MASTER MOTION DESIGN SCENE : "NINE DAYS TO ZERO"
// Style : Forensic Desk avec papiers flottants 2.5D, Polaroids & Plaque Dorée
// =============================================================================

(function() {
    api.log(">>> Début de la construction de la scène 'Nine Days To Zero'...");

    // 1. Nettoyage complet
    try {
        var existing = api.getLayers();
        for (var i = 0; i < existing.length; i++) {
            api.delete(existing[i]);
        }
    } catch(e) {
        api.log("Nettoyage: " + e);
    }

    // Chemins vers les assets
    var PATH_DESK_BG = "Z:/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/financial-forensics/public/brand/frame1_clean_plate.jpg";
    var PATH_SBF_IMG = "Z:/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/episodes/02-ftx/assets/image-ai/characters/CHR-SBF_master.jpg";
    var PATH_ELL_IMG = "Z:/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/episodes/02-ftx/assets/image-ai/characters/CHR-ELL_master.jpg";

    // -------------------------------------------------------------------------
    // 2. FOND DE TABLE D'INVESTIGATION (Investigation Desk Texture)
    // -------------------------------------------------------------------------
    var bgAsset = api.create("imageAsset", "Desk_Background_Asset");
    api.set(bgAsset, { "filePath": PATH_DESK_BG });

    var bgImg = api.create("imageShape", "Desk_Background_Layer");
    api.connect(bgAsset, "id", bgImg, "asset");
    api.set(bgImg, {
        "position.x": 0,
        "position.y": 0,
        "scale.x": 1.0,
        "scale.y": 1.0
    });

    // Respiration lente de la caméra (Subtle scale breathing)
    var camBreathing = api.create("oscillator", "Camera_Scale_Breath");
    api.set(camBreathing, { "min": 1.0, "max": 1.03, "frequency": 0.12 });
    api.connect(camBreathing, "output", bgImg, "scale.x");
    api.connect(camBreathing, "output", bgImg, "scale.y");

    // -------------------------------------------------------------------------
    // 3. DOCUMENT FLOTTANT 1 : BILAN FINANCIER D'ALAMEDA (Haut Gauche)
    // -------------------------------------------------------------------------
    var doc1X = -600;
    var doc1BaseY = -230;

    // Ombre portée dynamique (s'étire avec l'altitude du papier)
    var doc1Shadow = api.create("basicShape", "Doc1_BalanceSheet_Shadow");
    api.set(doc1Shadow, {
        "generator.shape": 1, // Rectangle
        "generator.width": 310,
        "generator.height": 400,
        "generator.cornerRadius": 8,
        "color": { "r": 0, "g": 0, "b": 0, "a": 95 },
        "position.x": doc1X + 18,
        "position.y": doc1BaseY + 28
    });

    // Corps de la feuille de papier
    var doc1Paper = api.create("basicShape", "Doc1_BalanceSheet_Paper");
    api.set(doc1Paper, {
        "generator.shape": 1,
        "generator.width": 310,
        "generator.height": 400,
        "generator.cornerRadius": 8,
        "color": { "r": 250, "g": 248, "b": 242, "a": 255 }, // Papier crème
        "stroke": true,
        "strokeColor": { "r": 210, "g": 205, "b": 195, "a": 180 },
        "strokeWidth": 1.5,
        "position.x": doc1X,
        "position.y": doc1BaseY
    });

    // Titre imprimé sur la feuille
    var doc1Title = api.create("textShape", "Doc1_Title");
    api.set(doc1Title, {
        "text": "LEAKED FINANCIAL BALANCE SHEET\nALAMEDA RESEARCH LTD.",
        "fontSize": 14,
        "horizontalAlignment": 0, // Gauche
        "color": { "r": 30, "g": 41, "b": 59, "a": 240 },
        "position.x": doc1X - 130,
        "position.y": doc1BaseY - 145,
        "lineSpacing": 1.3
    });

    // Lignes de compte / grille comptable
    var doc1Lines = api.create("textShape", "Doc1_Lines");
    api.set(doc1Lines, {
        "text": "FTT Token Reserves :  $5,820,000,000\nClient Liabilities :   -$8,400,000,000\nLiquid USD Reserves :      $13,420,000\nNet Capital Deficit :  [CRITICAL LEAK]",
        "fontSize": 12,
        "horizontalAlignment": 0,
        "color": { "r": 71, "g": 85, "b": 105, "a": 210 },
        "position.x": doc1X - 130,
        "position.y": doc1BaseY - 60,
        "lineSpacing": 1.6
    });

    // Tampon d'investigation rouge "DEFICIT : $8 BILLION"
    var doc1Stamp = api.create("textShape", "Doc1_Deficit_Stamp");
    api.set(doc1Stamp, {
        "text": "8 BILLION DEFICIT",
        "fontSize": 24,
        "horizontalAlignment": 1,
        "color": { "r": 220, "g": 38, "b": 38, "a": 235 }, // Rouge sang
        "position.x": doc1X,
        "position.y": doc1BaseY + 90,
        "letterSpacing": 2
    });

    // Physique de lévitation harmonique du Document 1
    var doc1OscY = api.create("oscillator", "Doc1_Hover_Y");
    api.set(doc1OscY, { "min": doc1BaseY - 16, "max": doc1BaseY + 16, "frequency": 0.45 });
    api.connect(doc1OscY, "output", doc1Paper, "position.y");
    api.connect(doc1OscY, "output", doc1Title, "position.y");
    api.connect(doc1OscY, "output", doc1Lines, "position.y");
    api.connect(doc1OscY, "output", doc1Stamp, "position.y");

    var doc1OscRot = api.create("oscillator", "Doc1_Hover_Rot");
    api.set(doc1OscRot, { "min": -10, "max": -6, "frequency": 0.32 });
    api.connect(doc1OscRot, "output", doc1Paper, "rotation");
    api.connect(doc1OscRot, "output", doc1Stamp, "rotation");

    // -------------------------------------------------------------------------
    // 4. POLAROID FLOTTANT : CAROLINE ELLISON (Bas Gauche)
    // -------------------------------------------------------------------------
    var polEllX = -620;
    var polEllBaseY = 250;

    var polEllShadow = api.create("basicShape", "Polaroid_Ellison_Shadow");
    api.set(polEllShadow, {
        "generator.shape": 1,
        "generator.width": 250,
        "generator.height": 310,
        "generator.cornerRadius": 5,
        "color": { "r": 0, "g": 0, "b": 0, "a": 90 },
        "position.x": polEllX + 14,
        "position.y": polEllBaseY + 22
    });

    var polEllFrame = api.create("basicShape", "Polaroid_Ellison_Frame");
    api.set(polEllFrame, {
        "generator.shape": 1,
        "generator.width": 250,
        "generator.height": 310,
        "generator.cornerRadius": 5,
        "color": { "r": 253, "g": 251, "b": 247, "a": 255 }, // Blanc Polaroid
        "position.x": polEllX,
        "position.y": polEllBaseY
    });

    var ellAsset = api.create("imageAsset", "Photo_Ellison_Asset");
    api.set(ellAsset, { "filePath": PATH_ELL_IMG });

    var ellPhoto = api.create("imageShape", "Photo_Ellison_Layer");
    api.connect(ellAsset, "id", ellPhoto, "asset");
    api.set(ellPhoto, {
        "position.x": polEllX,
        "position.y": polEllBaseY - 25,
        "scale.x": 0.42,
        "scale.y": 0.42
    });

    var ellLabel = api.create("textShape", "Polaroid_Ellison_Label");
    api.set(ellLabel, {
        "text": "Caroline E.  //  Alameda CEO",
        "fontSize": 13,
        "horizontalAlignment": 1,
        "color": { "r": 55, "g": 65, "b": 81, "a": 230 },
        "position.x": polEllX,
        "position.y": polEllBaseY + 120
    });

    // Flottement déphasé pour Caroline Ellison
    var polEllOscY = api.create("oscillator", "Polaroid_Ellison_HoverY");
    api.set(polEllOscY, { "min": polEllBaseY - 18, "max": polEllBaseY + 18, "frequency": 0.38 });
    api.connect(polEllOscY, "output", polEllFrame, "position.y");
    api.connect(polEllOscY, "output", ellPhoto, "position.y");
    api.connect(polEllOscY, "output", ellLabel, "position.y");

    var polEllOscRot = api.create("oscillator", "Polaroid_Ellison_HoverRot");
    api.set(polEllOscRot, { "min": 4, "max": 8, "frequency": 0.27 });
    api.connect(polEllOscRot, "output", polEllFrame, "rotation");
    api.connect(polEllOscRot, "output", ellPhoto, "rotation");

    // -------------------------------------------------------------------------
    // 5. POLAROID FLOTTANT : SAM BANKMAN-FRIED (Droite)
    // -------------------------------------------------------------------------
    var sbfX = 640;
    var sbfBaseY = -60;

    var sbfShadow = api.create("basicShape", "Polaroid_SBF_Shadow");
    api.set(sbfShadow, {
        "generator.shape": 1,
        "generator.width": 290,
        "generator.height": 360,
        "generator.cornerRadius": 6,
        "color": { "r": 0, "g": 0, "b": 0, "a": 105 },
        "position.x": sbfX + 16,
        "position.y": sbfBaseY + 25
    });

    var sbfFrame = api.create("basicShape", "Polaroid_SBF_Frame");
    api.set(sbfFrame, {
        "generator.shape": 1,
        "generator.width": 290,
        "generator.height": 360,
        "generator.cornerRadius": 6,
        "color": { "r": 254, "g": 252, "b": 248, "a": 255 },
        "position.x": sbfX,
        "position.y": sbfBaseY
    });

    var sbfAsset = api.create("imageAsset", "Photo_SBF_Asset");
    api.set(sbfAsset, { "filePath": PATH_SBF_IMG });

    var sbfPhoto = api.create("imageShape", "Photo_SBF_Layer");
    api.connect(sbfAsset, "id", sbfPhoto, "asset");
    api.set(sbfPhoto, {
        "position.x": sbfX,
        "position.y": sbfBaseY - 30,
        "scale.x": 0.50,
        "scale.y": 0.50
    });

    var sbfLabel = api.create("textShape", "Polaroid_SBF_Label");
    api.set(sbfLabel, {
        "text": "SAM BANKMAN-FRIED\nFOUNDER // TARGET #01",
        "fontSize": 14,
        "horizontalAlignment": 1,
        "color": { "r": 31, "g": 41, "b": 55, "a": 240 },
        "position.x": sbfX,
        "position.y": sbfBaseY + 130,
        "lineSpacing": 1.2
    });

    // Flottement dynamique SBF
    var sbfOscY = api.create("oscillator", "Polaroid_SBF_HoverY");
    api.set(sbfOscY, { "min": sbfBaseY - 20, "max": sbfBaseY + 20, "frequency": 0.50 });
    api.connect(sbfOscY, "output", sbfFrame, "position.y");
    api.connect(sbfOscY, "output", sbfPhoto, "position.y");
    api.connect(sbfOscY, "output", sbfLabel, "position.y");

    var sbfOscRot = api.create("oscillator", "Polaroid_SBF_HoverRot");
    api.set(sbfOscRot, { "min": 2, "max": 6.5, "frequency": 0.35 });
    api.connect(sbfOscRot, "output", sbfFrame, "rotation");
    api.connect(sbfOscRot, "output", sbfPhoto, "rotation");

    // -------------------------------------------------------------------------
    // 6. NOTE MANUSCRITE POST-IT D'INVESTIGATION (Bas Droite)
    // -------------------------------------------------------------------------
    var noteX = 620;
    var noteBaseY = 320;

    var noteShadow = api.create("basicShape", "Note_Investigation_Shadow");
    api.set(noteShadow, {
        "generator.shape": 1,
        "generator.width": 280,
        "generator.height": 180,
        "generator.cornerRadius": 4,
        "color": { "r": 0, "g": 0, "b": 0, "a": 80 },
        "position.x": noteX + 12,
        "position.y": noteBaseY + 18
    });

    var notePaper = api.create("basicShape", "Note_Investigation_Paper");
    api.set(notePaper, {
        "generator.shape": 1,
        "generator.width": 280,
        "generator.height": 180,
        "generator.cornerRadius": 4,
        "color": { "r": 254, "g": 249, "b": 195, "a": 255 }, // Jaune bloc-notes
        "position.x": noteX,
        "position.y": noteBaseY
    });

    var noteText = api.create("textShape", "Note_Investigation_Text");
    api.set(noteText, {
        "text": "backdoor withdrawal code\ncan.send(\"mest\")\n-> $10B wire to Alameda",
        "fontSize": 14,
        "horizontalAlignment": 0,
        "color": { "r": 68, "g": 64, "b": 60, "a": 230 },
        "position.x": noteX - 110,
        "position.y": noteBaseY - 30,
        "lineSpacing": 1.4
    });

    var noteOscY = api.create("oscillator", "Note_HoverY");
    api.set(noteOscY, { "min": noteBaseY - 14, "max": noteBaseY + 14, "frequency": 0.44 });
    api.connect(noteOscY, "output", notePaper, "position.y");
    api.connect(noteOscY, "output", noteText, "position.y");

    var noteOscRot = api.create("oscillator", "Note_HoverRot");
    api.set(noteOscRot, { "min": -7, "max": -3, "frequency": 0.30 });
    api.connect(noteOscRot, "output", notePaper, "rotation");

    // -------------------------------------------------------------------------
    // 7. LA PIÈCE MAÎTRESSE : PLAQUE D'ARDOISE & TYPOGRAPHIE DORÉE
    // -------------------------------------------------------------------------
    var plaqueBaseY = 0;

    // Ombre profonde de la plaque centrale
    var plaqueShadow = api.create("basicShape", "Plaque_Slate_Shadow");
    api.set(plaqueShadow, {
        "generator.shape": 1,
        "generator.width": 780,
        "generator.height": 280,
        "generator.cornerRadius": 14,
        "color": { "r": 0, "g": 0, "b": 0, "a": 160 },
        "position.x": 0,
        "position.y": plaqueBaseY + 22
    });

    // Plaque centrale en pierre d'ardoise noire
    var plaqueBody = api.create("basicShape", "Plaque_Slate_Body");
    api.set(plaqueBody, {
        "generator.shape": 1,
        "generator.width": 780,
        "generator.height": 280,
        "generator.cornerRadius": 14,
        "color": { "r": 24, "g": 28, "b": 36, "a": 255 }, // Ardoise foncée
        "stroke": true,
        "strokeColor": { "r": 212, "g": 175, "b": 55, "a": 130 }, // Filet or
        "strokeWidth": 2,
        "position.x": 0,
        "position.y": plaqueBaseY
    });

    // Ligne dorée horizontale de séparation
    var goldDivider = api.create("basicShape", "Plaque_Gold_Divider");
    api.set(goldDivider, {
        "generator.shape": 1,
        "generator.width": 680,
        "generator.height": 2,
        "color": { "r": 212, "g": 175, "b": 55, "a": 180 }, // Or brillant
        "position.x": 0,
        "position.y": plaqueBaseY + 25
    });

    // TITRE PRINCIPAL : NINE DAYS TO ZERO
    var mainTitle = api.create("textShape", "Title_NineDaysToZero");
    api.set(mainTitle, {
        "text": "NINE DAYS TO ZERO",
        "fontSize": 64,
        "horizontalAlignment": 1,
        "position.x": 0,
        "position.y": plaqueBaseY - 35,
        "color": { "r": 245, "g": 230, "b": 200, "a": 255 }, // Or pâle précieux
        "letterSpacing": 7
    });

    // SOUS-TITRE : THE COLLAPSE OF FTX • NOVEMBER 2022
    var subTitle = api.create("textShape", "SubTitle_Collapse");
    api.set(subTitle, {
        "text": "THE COLLAPSE OF FTX  •  NOVEMBER 2022",
        "fontSize": 18,
        "horizontalAlignment": 1,
        "position.x": 0,
        "position.y": plaqueBaseY + 65,
        "color": { "r": 180, "g": 195, "b": 210, "a": 230 }, // Blanc bleuté métallique
        "letterSpacing": 6
    });

    // Badge de catégorie en haut de la plaque
    var categoryBadge = api.create("textShape", "Plaque_Category_Badge");
    api.set(categoryBadge, {
        "text": "FORENSIC CASE // FILE #02",
        "fontSize": 13,
        "horizontalAlignment": 1,
        "position.x": 0,
        "position.y": plaqueBaseY - 95,
        "color": { "r": 212, "g": 175, "b": 55, "a": 200 }, // Or
        "letterSpacing": 4
    });

    // Micro-lévitation noble de la plaque centrale
    var plaqueOscY = api.create("oscillator", "Plaque_HoverY");
    api.set(plaqueOscY, { "min": plaqueBaseY - 8, "max": plaqueBaseY + 8, "frequency": 0.22 });
    api.connect(plaqueOscY, "output", plaqueBody, "position.y");
    api.connect(plaqueOscY, "output", goldDivider, "position.y");
    api.connect(plaqueOscY, "output", mainTitle, "position.y");
    api.connect(plaqueOscY, "output", subTitle, "position.y");
    api.connect(plaqueOscY, "output", categoryBadge, "position.y");

    // -------------------------------------------------------------------------
    // 8. FIL ROUGE D'ENQUÊTE DYNAMIQUE (Connecting Forensic String)
    // -------------------------------------------------------------------------
    var stringLine = api.create("basicShape", "Forensic_Red_String");
    api.set(stringLine, {
        "generator.shape": 1, // Ligne fine
        "generator.width": 1200,
        "generator.height": 2.5,
        "color": { "r": 220, "g": 38, "b": 38, "a": 160 }, // Fil rouge sang
        "position.x": 20,
        "position.y": -80,
        "rotation": -8
    });

    var stringOsc = api.create("oscillator", "String_HoverRot");
    api.set(stringOsc, { "min": -10, "max": -6, "frequency": 0.28 });
    api.connect(stringOsc, "output", stringLine, "rotation");

    api.log(">>> Scène 'Nine Days To Zero' construite avec succès !");
})();
