// ==============================================================================
// 06_Cavalry_Reel_2025_Style.js
// Reproduction fidèle de l'esthétique "Cavalry Reel 2025" (@cavalryapp)
// Style : Kinetic 3D Packaging, Brutalisme Suisse, Matrices Barcode & Flottaison
// ==============================================================================

(function() {
    api.log(">>> [Antigravity] Generation de la scene Cavalry Reel 2025...");

    // Nettoyage complet
    var allLayers = api.getLayers();
    if (allLayers && allLayers.length > 0) {
        api.deleteLayers(allLayers);
    }

    // 1. FOND NOIR STUDIO ABSOLU (Dark Void)
    var bg = api.primitive("rectangle", "Studio_Dark_Void");
    api.set(bg, {
        "generator.dimensions": [2500, 1500],
        "position": [0, 0],
        "material.materialColor": "#050608"
    });

    // Fonction d'aide pour creer une boite de packaging 3D volumetrique
    function createPackagingBox(name, x, y, rotZ, scaleVal, config) {
        var boxGroup = api.create("group", name);
        api.set(boxGroup, {
            "position": [x, y],
            "rotation": rotZ,
            "scale": [scaleVal, scaleVal]
        });

        var w = 480;
        var h = 640;
        var cr = 18; // Corner radius doux

        // A. Ombre portee douce (Ambiance Occlusion)
        var shadow = api.primitive("rectangle", name + "_Shadow");
        api.set(shadow, {
            "generator.dimensions": [w + 20, h + 20],
            "generator.cornerRadius": cr + 4,
            "position": [25, 35],
            "material.materialColor": "#000000",
            "opacity": 55.0
        });
        api.parent(shadow, boxGroup);

        // B. Tranche volumetrique ombree (Simulation de l'epaisseur 3D / Extrusion)
        var edge3D = api.primitive("rectangle", name + "_Extrusion_Edge");
        api.set(edge3D, {
            "generator.dimensions": [w, h],
            "generator.cornerRadius": cr,
            "position": [config.depthOffsetX || 16, config.depthOffsetY || 20],
            "material.materialColor": "#C4C4CA" // Gris tranche ombree
        });
        api.parent(edge3D, boxGroup);

        // C. Biseau speculaire (Liseret de chanfrein captant la lumiere)
        var bevelBezel = api.primitive("rectangle", name + "_Bevel_Highlight");
        api.set(bevelBezel, {
            "generator.dimensions": [w + 2, h + 2],
            "generator.cornerRadius": cr,
            "position": [(config.depthOffsetX || 16) * 0.5, (config.depthOffsetY || 20) * 0.5],
            "material.materialColor": "#FFFFFF"
        });
        api.parent(bevelBezel, boxGroup);

        // D. Face principale en craie blanche (Planche matte)
        var face = api.primitive("rectangle", name + "_Face_Chalk");
        api.set(face, {
            "generator.dimensions": [w, h],
            "generator.cornerRadius": cr,
            "position": [0, 0],
            "material.materialColor": "#F2F2F6" // Blanc craie de luxe
        });
        api.parent(face, boxGroup);

        // E. DETAILS GRAPHIQUES SERIGRAPHIES (Style Brutalisme Reel 2025)

        // Motif Matriciel Carrés Noirs (comme sur la boite de gauche du Reel)
        if (config.hasMatrixPattern) {
            var dot = api.primitive("rectangle", name + "_Pixel");
            api.set(dot, {
                "generator.dimensions": [14, 14],
                "material.materialColor": "#111116"
            });
            var dup = api.create("duplicator", name + "_DataMatrix");
            api.connect(dot, "id", dup, "shapes");
            api.set(dup, {
                "generator.count": [5, 7],
                "generator.size": [110, 160],
                "position": [-140, 180]
            });
            api.parent(dot, boxGroup);
            api.parent(dup, boxGroup);
        }

        // Lignes de code-barres / Data-Stripe
        if (config.hasBarcode) {
            for (var b = 0; b < 6; b++) {
                var bar = api.primitive("rectangle", name + "_Bar_" + b);
                var barW = (b % 2 === 0) ? 6 : 14;
                api.set(bar, {
                    "generator.dimensions": [barW, 70],
                    "position": [120 + (b * 16), -220],
                    "material.materialColor": "#15151A"
                });
                api.parent(bar, boxGroup);
            }
        }

        // Typographie Inversée & Technique (exactement comme dans la capture)
        if (config.labelTitle) {
            var label1 = api.create("textShape", name + "_Title");
            api.set(label1, {
                "text": config.labelTitle,
                "fontSize": 28,
                "horizontalAlignment": 0,
                "color": "#111116",
                "position": [config.textX || -180, config.textY || -180],
                "rotation": config.textRot || 0
            });
            api.parent(label1, boxGroup);
        }

        if (config.labelSub) {
            var label2 = api.create("textShape", name + "_Sub");
            api.set(label2, {
                "text": config.labelSub,
                "fontSize": 15,
                "horizontalAlignment": 0,
                "color": "#4A4A55",
                "position": [config.subX || -180, config.subY || -140],
                "rotation": config.textRot || 0
            });
            api.parent(label2, boxGroup);
        }

        // Oscillation cinématique lente (flottaison physique)
        var oscRot = api.create("oscillator", name + "_Osc_Rot");
        api.set(oscRot, {
            "minimum": rotZ - 3.5,
            "maximum": rotZ + 3.5,
            "frequency": 0.25,
            "stagger": config.stagger || 0.5
        });
        api.connect(oscRot, "out", boxGroup, "rotation");

        var oscY = api.create("oscillator", name + "_Osc_Y");
        api.set(oscY, {
            "minimum": y - 22,
            "maximum": y + 22,
            "frequency": 0.35,
            "stagger": (config.stagger || 0.5) * 1.5
        });
        api.connect(oscY, "out", boxGroup, "position.y");

        return boxGroup;
    }

    // =========================================================================
    // CREATION DES 3 BOITES CONFORMES A LA CAPTURE D'ECRAN DU REEL 2025
    // =========================================================================

    // 1. BOITE DU PREMIER PLAN (BAS / CENTRE)
    // Inclinée, typographie renversée, biseau accrochant la lumière
    createPackagingBox("Box_Center_Foreground", 20, 240, -28, 1.25, {
        depthOffsetX: 22,
        depthOffsetY: 26,
        hasMatrixPattern: true,
        hasBarcode: true,
        labelTitle: "CAPITE // 1051r",
        labelSub: "THE LEDGER FORENSIC ED. - 2025",
        textRot: 180, // Typographie renversée comme sur la capture !
        textX: 160,
        textY: 120,
        subX: 160,
        subY: 70,
        stagger: 0.1
    });

    // 2. BOITE DE GAUCHE (HAUT / GAUCHE)
    // Montre son motif matriciel noir pixélisé caractéristique
    createPackagingBox("Box_Top_Left", -440, -320, 18, 0.95, {
        depthOffsetX: 18,
        depthOffsetY: 22,
        hasMatrixPattern: true,
        hasBarcode: false,
        labelTitle: "NINE DAYS // ZERO",
        labelSub: "SERIES ARTIFACT B-02",
        textRot: 0,
        textX: -160,
        textY: -210,
        subX: -160,
        subY: -170,
        stagger: 0.6
    });

    // 3. BOITE DE DROITE (HAUT / DROITE)
    // Vue sous un angle plongeant avec tranche nette
    createPackagingBox("Box_Top_Right", 460, -280, -12, 1.05, {
        depthOffsetX: 24,
        depthOffsetY: 28,
        hasMatrixPattern: false,
        hasBarcode: true,
        labelTitle: "PROOF OF RESERVE",
        labelSub: "ALAMEDA RECOVERY PROTOCOL",
        textRot: 90, // Typographie verticale sur la tranche
        textX: 180,
        textY: -120,
        subX: 140,
        subY: -120,
        stagger: 1.1
    });

    api.log(">>> [Antigravity] SCENE REEL 2025 GENEREE AVEC SUCCES DANS LE VIEWPORT !");
})();
