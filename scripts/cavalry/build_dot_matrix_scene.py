#!/usr/bin/env python3
"""
Génère la scène "Dot Matrix Silhouette" dans Cavalry 2D
via Duplicator procédural + Grid Distribution + Noise Generator.
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
    "endFrame": 90,
    "fps": 25,
    "backgroundColor": "#9AE727"
  });

  // 1. Fond vert pomme vibrant
  var bg = api.primitive("rectangle", "Lime_Canvas");
  api.set(bg, {
    "position": [0, 0],
    "generator.dimensions": [1920, 1080],
    "material.materialColor": "#9AE727"
  });

  // 2. Forme source : un point noir épuré
  var dot = api.primitive("ellipse", "Source_Dot");
  api.set(dot, {
    "generator.radius": [7, 7],
    "material.materialColor": "#0B0F10"
  });

  // 3. Duplicateur procédural en grille 28x34
  var dup = api.create("duplicator", "Generative_Dot_Matrix");
  api.addArrayIndex(dup, "shapes");
  api.connect(dot, "id", dup, "shapes.0");
  api.setGenerator(dup, "generator", "gridDistribution");
  api.set(dup, {
    "generator.count": [28, 34],
    "generator.size": [780, 920],
    "position": [0, 0]
  });

  // Masquer la forme source originale hors du duplicateur
  // api.set(dot, { "hidden": true });

  // 4. Générateur de Bruit procédural pour moduler la taille des points
  var noise = api.create("noise", "Matrix_Organic_Noise");
  api.set(noise, {
    "generator.minimum": [0.15, 0.15],
    "generator.maximum": [2.4, 2.4],
    "generator.frequency": 0.0035,
    "generator.timeScale": 2.0
  });

  // Connexion du bruit à la taille de chaque clone
  api.connect(noise, "id", dup, "shapeScale");

  // Rendu de contrôle Frame 20
  api.setFrame(20);
  api.renderPNGFrame("Z:/home/mbogneng-junior/.gemini/antigravity-ide/brain/647adabc-a467-417d-b018-a08320029961/scratch/cavalry_dot_matrix_preview.png", 100);

  return {
    status: "SUCCESS",
    activeComp: comp,
    layerCount: api.getCompLayers(false).length
  };
})();
"""

if __name__ == "__main__":
    print("🚀 Envoi du script Dot Matrix à Cavalry...")
    success = execute_in_cavalry(CAVALRY_SCRIPT)
    if success:
        print("🎉 Scène Dot Matrix générée avec succès dans Cavalry !")
    else:
        sys.exit(1)
