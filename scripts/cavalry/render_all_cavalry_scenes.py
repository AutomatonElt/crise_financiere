#!/usr/bin/env python3
"""
Générateur de rendu pour les scènes procédurales Cavalry 2D
utilisant la méthodologie WhyCavalry & Claude Bridge.
"""

import sys
from pathlib import Path
from render_cavalry_asset import render_sequence_from_cavalry

# ==============================================================================
# 1. SCÈNE : DOT MATRIX SILHOUETTE (Segment 3)
# ==============================================================================
DOT_MATRIX_SCRIPT = """
(function() {
  var layers = api.getCompLayers(false);
  for (var i = 0; i < layers.length; i++) {
    api.deleteLayer(layers[i]);
  }

  var comp = api.getActiveComp();
  api.set(comp, {
    "resolution": [1920, 1080],
    "startFrame": 0,
    "endFrame": 50,
    "fps": 25,
    "backgroundColor": "#9AE727"
  });

  // Fond vert pomme vibrant
  var bg = api.primitive("rectangle", "Lime_Canvas");
  api.set(bg, {
    "position": [0, 0],
    "generator.dimensions": [1920, 1080],
    "material.materialColor": "#9AE727"
  });

  // Forme source : point noir
  var dot = api.primitive("ellipse", "Source_Dot");
  api.set(dot, {
    "generator.radius": [6.5, 6.5],
    "material.materialColor": "#0B0F10"
  });

  // Duplicateur procédural en grille 28x34 (952 points)
  var dup = api.create("duplicator", "Generative_Dot_Matrix");
  api.addArrayIndex(dup, "shapes");
  api.connect(dot, "id", dup, "shapes.0");
  api.setGenerator(dup, "generator", "gridDistribution");
  api.set(dup, {
    "generator.count": [28, 34],
    "generator.size": [780, 920],
    "position": [0, 0]
  });

  // Bruit procédural pour moduler l'échelle
  var noise = api.create("noise", "Matrix_Organic_Noise");
  api.set(noise, {
    "generator.minimum": 0.25,
    "generator.maximum": 2.2,
    "generator.frequency": 0.005,
    "generator.separateChannels": false,
    "generator.timeScale": 2.0
  });
  api.connect(noise, "id", dup, "shapeScale");

  // Falloff ovale pour sculpter le contour du pitaya
  var falloff = api.create("falloff", "Oval_Contour_Falloff");
  api.set(falloff, {
    "position": [0, 0],
    "size": [450, 650],
    "strength": 1.0
  });
  api.addArrayIndex(dup, "falloffs");
  api.connect(falloff, "id", dup, "falloffs.0");

  return JSON.stringify({ status: "READY", comp: comp });
})();
"""

# ==============================================================================
# 2. SCÈNE : SPECIMEN BLUEPRINT (Segment 5)
# ==============================================================================
SPECIMEN_BLUEPRINT_SCRIPT = """
(function() {
  var layers = api.getCompLayers(false);
  for (var i = 0; i < layers.length; i++) {
    api.deleteLayer(layers[i]);
  }

  var comp = api.getActiveComp();
  api.set(comp, {
    "resolution": [1920, 1080],
    "startFrame": 0,
    "endFrame": 50,
    "fps": 25,
    "backgroundColor": "#F0EDE6"
  });

  // 1. Fond papier crème d'archive
  var bg = api.primitive("rectangle", "Laboratory_Canvas");
  api.set(bg, {
    "position": [0, 0],
    "generator.dimensions": [1920, 1080],
    "material.materialColor": "#F0EDE6"
  });

  // 2. Lignes de carroyage millimétré
  var gridH = api.primitive("rectangle", "Grid_H_Axis");
  api.set(gridH, {
    "position": [0, -120],
    "generator.dimensions": [1840, 1.5],
    "material.materialColor": "#D6D1C4"
  });

  var gridVL = api.primitive("rectangle", "Grid_V_Axis_Left");
  api.set(gridVL, {
    "position": [-380, 0],
    "generator.dimensions": [1.5, 1020],
    "material.materialColor": "#D6D1C4"
  });

  var gridVR = api.primitive("rectangle", "Grid_V_Axis_Right");
  api.set(gridVR, {
    "position": [380, 0],
    "generator.dimensions": [1.5, 1020],
    "material.materialColor": "#D6D1C4"
  });

  // 3. Cadran circulaire de calibration en pointillés avec rotation continue
  var calibRing = api.primitive("ellipse", "Calibration_Dashed_Ring");
  api.set(calibRing, {
    "position": [0, 20],
    "generator.radius": [330, 330],
    "material.materialColor": "#00000000"
  });

  var strokeMat = api.create("strokeMaterial", "Ring_Dashed_Stroke");
  api.set(strokeMat, {
    "strokeColor": "#8E897A",
    "width": 2.2,
    "dashPatternMode": 1,
    "dashPattern": "8 14"
  });
  api.connect(strokeMat, "id", calibRing, "stroke");

  var ringOsc = api.create("oscillator", "Ring_Rotation_Osc");
  api.set(ringOsc, {
    "minimum": 0,
    "maximum": 360,
    "frequency": 0.05
  });
  api.connect(ringOsc, "out", calibRing, "rotation.z");

  // Viseurs diagonaux à 45°
  var diag1 = api.primitive("rectangle", "Sight_Diagonal_45");
  api.set(diag1, {
    "position": [0, 20],
    "rotation.z": 45,
    "generator.dimensions": [940, 1.2],
    "material.materialColor": "#C4BEAE"
  });

  var diag2 = api.primitive("rectangle", "Sight_Diagonal_Neg45");
  api.set(diag2, {
    "position": [0, 20],
    "rotation.z": -45,
    "generator.dimensions": [940, 1.2],
    "material.materialColor": "#C4BEAE"
  });

  // 4. Spécimen vivant : Pitaya avec respiration et flottement
  var assetId = api.loadAsset("C:/brand/pitaya_whole.png", false);
  var footageId = api.addAssetToComp(assetId);
  api.rename(footageId, "Forensic_Specimen_Pitaya");
  api.set(footageId, {
    "position": [0, 20],
    "scale": [0.75, 0.75],
    "opacity": 100
  });

  var breathOsc = api.create("oscillator", "Breath_Pulse_Osc");
  api.set(breathOsc, {
    "minimum": 0.73,
    "maximum": 0.77,
    "frequency": 0.35
  });
  api.connect(breathOsc, "out", footageId, "scale.x");
  api.connect(breathOsc, "out", footageId, "scale.y");

  // 5. 5 Réticules de tracking fluo (#99E82B)
  var markerPositions = [
    [-380, 360],
    [380, 360],
    [-380, -320],
    [380, -320],
    [0, 20]
  ];
  for (var m = 0; m < markerPositions.length; m++) {
    var mk = api.primitive("rectangle", "Tracking_Marker_" + (m + 1));
    api.set(mk, {
      "position": markerPositions[m],
      "generator.dimensions": [18, 18],
      "material.materialColor": "#99E82B"
    });
  }

  // 6. Typographie "PITAYA" avec entrée animée
  var title = api.create("textShape", "Title_PITAYA");
  api.set(title, {
    "text": "PITAYA",
    "fontSize": 150,
    "position": [-580, -250],
    "horizontalAlignment": 0,
    "color": "#0B0F10"
  });

  // Badge néon "SPECIMEN_01"
  var badgeBg = api.primitive("rectangle", "Badge_Neon_BG");
  api.set(badgeBg, {
    "position": [-300, -280],
    "generator.dimensions": [220, 48],
    "material.materialColor": "#99E82B"
  });

  var badgeTxt = api.create("textShape", "Badge_Neon_Text");
  api.set(badgeTxt, {
    "text": "SPECIMEN_01",
    "fontSize": 24,
    "position": [-300, -288],
    "horizontalAlignment": 1,
    "color": "#0B0F10"
  });

  // 7. Cartouche de métadonnées
  var metaTxt = api.create("textShape", "Forensic_Metadata_Block");
  api.set(metaTxt, {
    "text": "SPECIMEN: PITAYA-01\\nTYPE: DRAGON FRUIT\\nSTATE: FRESH / WHOLE\\nPALETTE: PINK / LIME\\nCAPTURE: FRONT STUDY",
    "fontSize": 18,
    "lineSpacing": 1.45,
    "position": [440, 260],
    "horizontalAlignment": 0,
    "color": "#1A1A1A"
  });

  // Keyframes d'animation
  api.keyframe(title, 0, { "position.x": -750, "opacity": 0 });
  api.keyframe(title, 12, { "position.x": -580, "opacity": 100 });
  api.magicEasing(title, "position.x", 12, "SlowInSlowOut");
  api.magicEasing(title, "opacity", 12, "SlowOut");

  api.keyframe(badgeBg, 4, { "scale.x": 0 });
  api.keyframe(badgeBg, 14, { "scale.x": 1 });
  api.magicEasing(badgeBg, "scale.x", 14, "SpringOut");

  return JSON.stringify({ status: "READY", comp: comp });
})();
"""

# ==============================================================================
# 3. SCÈNE : EVOLUTION STAIRCASE (Segment 6)
# ==============================================================================
STAIRCASE_SCRIPT = """
(function() {
  var layers = api.getCompLayers(false);
  for (var i = 0; i < layers.length; i++) {
    api.deleteLayer(layers[i]);
  }
  var comp = api.getActiveComp();
  api.set(comp, {
    "resolution": [1920, 1080],
    "startFrame": 0,
    "endFrame": 40,
    "fps": 25,
    "backgroundColor": "#DA008B"
  });

  // 1. Fond magenta éclatant
  var bg = api.primitive("rectangle", "Magenta_Canvas");
  api.set(bg, {
    "position": [0, 0],
    "generator.dimensions": [1920, 1080],
    "material.materialColor": "#DA008B"
  });

  // 2. Grille de fond subtile
  var gridLine = api.primitive("rectangle", "Floor_Baseline");
  api.set(gridLine, {
    "position": [0, -320],
    "generator.dimensions": [1800, 2],
    "material.materialColor": "#FF5BB5"
  });

  // 3. Les 5 Marches d'évolution
  var stepWidth = 260;
  var stepSpacing = 320;
  var startX = -640;
  var startY = -260;
  var heightDelta = 130;

  var stages = [
    { name: "BUD", num: "01" },
    { name: "YOUNG", num: "02" },
    { name: "OPENING", num: "03" },
    { name: "RIPE", num: "04" },
    { name: "CUT", num: "05" }
  ];

  // 3. Arcs de rebond cinétiques sous les paliers (conforme à ref_stair_01)
  for (var a = 0; a < 4; a++) {
    var arcStartX = startX + a * stepSpacing;
    var arcStartY = startY + a * heightDelta;
    var arcEndX = startX + (a + 1) * stepSpacing;
    var arcEndY = startY + (a + 1) * heightDelta;
    var midX = (arcStartX + arcEndX) / 2;

    var arc = api.primitive("ellipse", "Rebound_Arc_" + (a + 1));
    api.set(arc, {
      "position": [midX, (arcStartY + arcEndY) / 2 - 40],
      "generator.radius": [stepSpacing / 2, 70],
      "material.materialColor": "#00000000"
    });

    var arcStroke = api.create("strokeMaterial", "Arc_Stroke_" + (a + 1));
    api.set(arcStroke, {
      "strokeColor": "#2A0019",
      "width": 1.5,
      "dashPatternMode": 0
    });
    api.connect(arcStroke, "id", arc, "stroke");

    var arcDelay = 4 + a * 3;
    api.keyframe(arc, arcDelay, { "scale.x": 0, "scale.y": 0, "opacity": 0 });
    api.keyframe(arc, arcDelay + 8, { "scale.x": 1, "scale.y": 1, "opacity": 100 });
    api.magicEasing(arc, "scale.x", arcDelay + 8, "SlowInSlowOut");
  }

  return JSON.stringify({ status: "READY" });
})();
"""

# ==============================================================================
# 4. SCÈNE : MESH TRIANGULATION / PLEXUS (Segment 7)
# ==============================================================================
PLEXUS_SCRIPT = """
(function() {
  var layers = api.getCompLayers(false);
  for (var i = 0; i < layers.length; i++) {
    api.deleteLayer(layers[i]);
  }
  var comp = api.getActiveComp();
  api.set(comp, {
    "resolution": [1920, 1080],
    "startFrame": 0,
    "endFrame": 40,
    "fps": 25,
    "backgroundColor": "#0E0B12"
  });

  // 1. Fond noir profond forensic
  var bg = api.primitive("rectangle", "Dark_Canvas");
  api.set(bg, {
    "position": [0, 0],
    "generator.dimensions": [1920, 1080],
    "material.materialColor": "#0E0B12"
  });

  // 2. Grille de fond technique
  var gridH = api.primitive("rectangle", "Scan_Line_H");
  api.set(gridH, {
    "position": [0, 0],
    "generator.dimensions": [1840, 1],
    "material.materialColor": "#2A2336"
  });

  // 3. Constellation de Nœuds de Plexus
  var nodeShape = api.primitive("ellipse", "Plexus_Node");
  api.set(nodeShape, {
    "generator.radius": [7, 7],
    "material.materialColor": "#99E82B"
  });

  var dup = api.create("duplicator", "Mesh_Duplicator");
  api.addArrayIndex(dup, "shapes");
  api.connect(nodeShape, "id", dup, "shapes.0");
  api.setGenerator(dup, "generator", "circleDistribution");
  api.set(dup, {
    "generator.count": 24,
    "generator.radius": 380,
    "position": [0, 20]
  });

  var rotOsc = api.create("oscillator", "Mesh_Rot_Osc");
  api.set(rotOsc, {
    "minimum": -15,
    "maximum": 15,
    "frequency": 0.1
  });
  api.connect(rotOsc, "out", dup, "rotation.z");

  var centerTarget = api.primitive("ellipse", "Center_Target");
  api.set(centerTarget, {
    "position": [0, 20],
    "generator.radius": [40, 40],
    "material.materialColor": "#00000000"
  });
  var targetStroke = api.create("strokeMaterial", "Target_Stroke");
  api.set(targetStroke, {
    "strokeColor": "#FF2A85",
    "width": 2.5,
    "dashPatternMode": 1,
    "dashPattern": "6 6"
  });
  api.connect(targetStroke, "id", centerTarget, "stroke");

  // 4. Cartouche de télémétrie
  var coordText = api.create("textShape", "Plexus_Telemetry");
  api.set(coordText, {
    "text": "DELAUNAY_TRIANGULATION: ACTIVE\\nNODES: 24 (6D MANIFOLD)\\nTOLERANCE: 0.0028mm\\nTOPOLOGY: ADAPTIVE MESH\\nTRACK: BIO_MORPHOMETRY",
    "fontSize": 18,
    "lineSpacing": 1.4,
    "position": [-740, 360],
    "horizontalAlignment": 0,
    "color": "#99E82B"
  });

  // Entrée animée du mesh
  api.keyframe(dup, 0, { "scale.x": 0.4, "scale.y": 0.4, "opacity": 0 });
  api.keyframe(dup, 12, { "scale.x": 1.0, "scale.y": 1.0, "opacity": 100 });
  api.magicEasing(dup, "scale.x", 12, "SlowInSlowOut");
  api.magicEasing(dup, "scale.y", 12, "SlowInSlowOut");

  return JSON.stringify({ status: "READY" });
})();
"""

if __name__ == "__main__":
    print("🎬 Lancement de la production des rendus Cavalry...")
    
    # 1. Rendu Dot Matrix (26 frames: 0 à 25)
    render_sequence_from_cavalry("cavalry_dot_matrix", DOT_MATRIX_SCRIPT, start_frame=0, end_frame=25, fps=25)

    # 2. Rendu Specimen Blueprint (40 frames: 0 à 39)
    render_sequence_from_cavalry("cavalry_blueprint", SPECIMEN_BLUEPRINT_SCRIPT, start_frame=0, end_frame=39, fps=25)

    # 3. Rendu Evolution Staircase (30 frames: 0 à 29)
    render_sequence_from_cavalry("cavalry_staircase", STAIRCASE_SCRIPT, start_frame=0, end_frame=29, fps=25)

    # 4. Rendu Plexus Triangulation (34 frames: 0 à 33)
    render_sequence_from_cavalry("cavalry_plexus", PLEXUS_SCRIPT, start_frame=0, end_frame=33, fps=25)
    
    print("\n✅ Tous les rendus Cavalry ont été générés avec succès !")
