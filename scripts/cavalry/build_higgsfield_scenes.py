#!/usr/bin/env python3
"""
Génère le Specimen Blueprint procédural directement dans Cavalry 2D
via Stallion et l'API native Cavalry.
"""
import sys
from run_cavalry_script import execute_in_cavalry

CAVALRY_SCRIPT = """
(function() {
  var layers = api.getCompLayers(false);
  for (var i = 0; i < layers.length; i++) {
    api.deleteLayer(layers[i]);
  }

  var comp = api.getActiveComp();
  api.set(comp, {
    "resolution": [1920, 1080],
    "startFrame": 0,
    "endFrame": 150,
    "fps": 25,
    "backgroundColor": "#F0EDE6"
  });

  // 1. Fond papier crème d’archive
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

  // 3. Cadran circulaire de calibration en pointillés (StrokeMaterial natif)
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
    "dashPattern": "8 14"
  });
  api.connect(strokeMat, "id", calibRing, "stroke");

  // Rotation continue 360° du cadran
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
    "minimum": 0.74,
    "maximum": 0.77,
    "frequency": 0.4
  });
  api.connect(breathOsc, "out", footageId, "scale.x");
  api.connect(breathOsc, "out", footageId, "scale.y");

  // 5. 5 Réticules de tracking fluo (Lime Green #99E82B)
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

  // 6. Typographie principale "PITAYA"
  var title = api.create("textShape", "Title_PITAYA");
  api.set(title, {
    "text": "PITAYA",
    "fontSize": 160,
    "position": [-580, -250],
    "horizontalAlignment": 0,
    "color": "#0B0F10"
  });

  // Badge néon "SPECIMEN_01" (placé à droite du titre)
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

  // 7. Bloc de métadonnées forensic (Haut Droit)
  var metaTxt = api.create("textShape", "Forensic_Metadata_Block");
  api.set(metaTxt, {
    "text": "SPECIMEN: PITAYA-01\\nTYPE: DRAGON FRUIT\\nSTATE: FRESH / WHOLE\\nRIND: PINK / GREEN\\nPALETTE: PINK / LIME\\nSURFACE: ORGANIC\\nCAPTURE: FRONT STUDY",
    "fontSize": 18,
    "lineSpacing": 1.45,
    "position": [440, 260],
    "horizontalAlignment": 0,
    "color": "#1A1A1A"
  });

  // Animation par keyframes à l'entrée avec Magic Easing
  api.keyframe(title, 0, { "position.x": -750, "opacity": 0 });
  api.keyframe(title, 14, { "position.x": -580, "opacity": 100 });
  api.magicEasing(title, "position.x", 14, "SlowInSlowOut");
  api.magicEasing(title, "opacity", 14, "SlowOut");

  api.keyframe(badgeBg, 4, { "scale.x": 0 });
  api.keyframe(badgeBg, 16, { "scale.x": 1 });
  api.magicEasing(badgeBg, "scale.x", 16, "SpringOut");

  // Rendu de contrôle Frame 25
  api.setFrame(25);
  api.renderPNGFrame("Z:/home/mbogneng-junior/.gemini/antigravity-ide/brain/647adabc-a467-417d-b018-a08320029961/scratch/cavalry_blueprint_preview.png", 100);

  return {
    status: "SUCCESS",
    activeComp: comp,
    layerCount: api.getCompLayers(false).length
  };
})();
"""

if __name__ == "__main__":
    print("🚀 Envoi du script Specimen Blueprint à Cavalry...")
    success = execute_in_cavalry(CAVALRY_SCRIPT)
    if success:
        print("🎉 Specimen Blueprint généré dans Cavalry avec succès !")
    else:
        print("❌ Échec.")
        sys.exit(1)
