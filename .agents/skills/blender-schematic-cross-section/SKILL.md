---
name: blender-schematic-cross-section
description: Modélisation et rendu de coupes 3D schématiques (Forensic Cross-Section, Diorama d'investigation, tunnels de braquage, schémas souterrains) dans Blender via MCP avec habillage HUD Blueprint et éclairage cinématique sombre.
---

# Guide des Coupes 3D Schématiques & Dioramas d'Investigation (Blender via MCP)

Ce skill formalise la méthodologie complète pour créer des plans 3D documentaires en coupe transversale (*Cross-Section Diorama / Schematic Blueprint*), inspirés des documentaires d'investigation criminelle et financière (comme *Sagamo*, *MagnatesMedia*, *Fern* ou *Johnny Harris*).

---

## 1. Principes Fondamentaux du Style "Forensic Clay & Neon Blueprint"

1. **Rendu "Clay / Maquette sobre"** :
   * Pas de textures photoréalistes saturées. Utiliser des shaders gris neutres ou anthracite (`Roughness: 0.65 - 0.85`, `Metallic: 0.0 - 0.2`).
   * Tous les éléments de décor (immeubles, voitures, sol) sont semi-monochromes pour mettre en valeur les éléments d'investigation.
2. **Couleur Accent Unique (Cyan Néon / Or)** :
   * L'objet du délit (le tunnel clandestin, le flux d'argent, la faille de sécurité) est le seul élément lumineux.
   * Utiliser un shader `Emission` puissant (`Strength: 15.0 - 25.0`, couleur `#00F5FF` ou `#D4AF37`).
3. **Coupe Transversale Écorchée (Cross-Section)** :
   * Le bloc de sol est tranché verticalement. La cavité souterraine est ouverte pour révéler les fondations, les piliers et le passage secret.
   * Une grille fine de repères blueprint (`Grid Lines`) est plaquée sur la face de coupe verticale.
4. **Habillage HUD & Lignes de Rappel (Leader Lines)** :
   * Des annotations vectorielles ou 3D flottantes avec police sans-serif (`RESIDENTIAL HOUSE`, `CENTRAL BANK`, `DEPTH: 6 METERS`).
   * Des lignes de cotes en biseau fin avec pastilles lumineuses aux points d'ancrage.

---

## 2. Topologie de Scène Recommandée

* **Bloc de Sol (Diorama)** :
  * Largeur standard : 35 à 45 mètres (axe X).
  * Profondeur : 8 à 12 mètres (axe Y).
  * Hauteur sol : $Z = 0.0$.
  * Profondeur sous-sol : $Z = -5.0$ à $-6.0$.
* **Composition en 3 Zones** :
  1. **Zone Gauche (Origine)** : Bâtiment de départ (maison résidentielle, hangar, atelier clandestin).
  2. **Zone Centrale (Obstacle)** : Rue avec circulation (voitures, lampadaires, terre-plein) posée sur une dalle pont soutenue par des piliers massifs en béton.
  3. **Zone Droite (Cible)** : Bâtiment institutionnel (banque centrale, coffre-fort, salle des serveurs) avec sa fondation souterraine et sa porte blindée.

---

## 3. Shaders Types (Blender 5.x)

```python
# Shaders de base dans Blender 5.x
def make_mat(name, color=(0.8, 0.8, 0.8, 1.0), roughness=0.7, metallic=0.0, emission_color=None, emission_strength=0.0):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    
    output = nodes.new(type="ShaderNodeOutputMaterial")
    if emission_strength > 0 and emission_color:
        shader = nodes.new(type="ShaderNodeEmission")
        shader.inputs["Color"].default_value = emission_color
        shader.inputs["Strength"].default_value = emission_strength
    else:
        shader = nodes.new(type="ShaderNodeBsdfPrincipled")
        shader.inputs["Base Color"].default_value = color
        shader.inputs["Roughness"].default_value = roughness
        shader.inputs["Metallic"].default_value = metallic
        
    mat.node_tree.links.new(shader.outputs[0], output.inputs["Surface"])
    return mat
```

---

## 4. Éclairage & Caméra Studio

* **Monde (World)** : Noir bleuté profond (`Color: (0.012, 0.016, 0.024, 1.0)`, `Strength: 0.35`).
* **Key Light** : Sun Light douce à 52° d'élévation, couleur blanc cassé froid (`Energy: 3.5`, `Angle: 10.0°`).
* **Rim Light (Contre-jour)** : Sun Light froide bleue (`(0.1, 0.65, 1.0)`) opposée pour découper les toits et corniches sur le fond noir.
* **Lumières Locales** : Point Lights cyan le long du tunnel (`Energy: 40.0`, `Radius: 0.5m`) pour projeter de la lueur sur les piliers et le sol souterrain.
* **Caméra** : 45mm à 65mm en vue 3/4 plongeante (hauteur $Z \approx 14.5$, distance $Y \approx -31$, angle $X \approx 65^\circ$).

---

## 5. Script Clé en Main

Le script de génération automatique est disponible dans :
👉 [`scripts/generate_cross_section_schematic.py`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/scripts/generate_cross_section_schematic.py)
