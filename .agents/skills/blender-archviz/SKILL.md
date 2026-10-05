---
name: blender-archviz
description: Modélisation architecturale 3D (ArchViz), extérieurs, intérieurs complets, matériaux réalistes et éclairage dans Blender via MCP. À utiliser pour créer des scènes 3D à partir d'images de référence ou de descriptions détaillées.
---

# Guide de Modélisation ArchViz & Intérieurs dans Blender (via MCP)

Ce skill formalise le workflow de modélisation 3D architecturale photoréaliste et d'aménagement intérieur directement piloté par Antigravity dans Blender via l'addon MCP (`mcp-for-blender`).

---

## 1. Architecture du Pont MCP & Communication
* **Connexion locale :** Le serveur MCP communique avec Blender via le socket TCP local `127.0.0.1:9876`.
* **Exécution Python :** Les commandes sont envoyées à l'outil `execute_blender_code` et exécutées en direct par le moteur Python de Blender (`bpy`).
* **Vérification visuelle systématique :** Après chaque étape clé, appeler `get_viewport_screenshot` pour inspecter la géométrie, les proportions, l'éclairage et les ombres.

---

## 2. Compatibilité & Spécificités Blender 5.x / Shaders
* **Accès aux nœuds de shader :** Toujours cibler les nœuds par leur type (ex: `n.type == "BSDF_PRINCIPLED"`), jamais par leur nom localisé.
* **Inputs Principled BSDF en Blender 5.x :**
  * `Base Color` : Couleur diffuse
  * `Roughness` : Rugosité
  * `Metallic` : Réflectivité métallique
  * `Transmission Weight` : Transparence/transmission pour le verre (remplace `Transmission`)
  * `IOR` : Indice de réfraction (1.52 pour verre standard, 1.33 pour eau)
  * `Emission Color` & `Emission Strength` : Éclairages intégrés / sources lumineuses
* **Ciel & Environnement :**
  * Utiliser `ShaderNodeTexSky` avec `sky_type = 'MULTIPLE_SCATTERING'` (modèle physique haute fidélité sous Blender 5.2).

---

## 3. Workflow de Modélisation en 6 Étapes

### Étape 1 : Analyse de référence & Décomposition volumétrique
1. Extraire les volumes clés (rez-de-chaussée, étage en retrait, avancées, toitures-terrasses).
2. Déterminer l'angle de la caméra (focale 35-40mm pour grand angle architectural sans déformation excessive).
3. Déterminer la position du soleil (hauteur/azimut pour reproduire les ombres portées).

### Étape 2 : Sol, Terrasse & Aménagement extérieur
1. Terrain / pelouse naturelle (`LawnGrass`).
2. Dalle de terrasse en pierre/travertin clair (`TerraceStone`).
3. Bande de propreté périphérique en gravier noir ou basalte (`DarkGravel`).
4. Piscine encastrée : margelles en pierre, eau turquoise translucide et bassin en carrelage clair.
5. Végétation emblématique : cyprès colonnaires étagés, agaves et bacs à fleurs modernes.

### Étape 3 : Structure du Bâtiment & Façades
1. Murs en enduit minéral blanc cassé (`roughness: 0.85`).
2. Découpes nettes pour les porches, auvents et acrotères avec couvertines sombres en zinc/alu.
3. Menuiseries en aluminium anthracite (`metallic: 0.8`, `roughness: 0.35`).
4. Baies vitrées coulissantes à vitrage crystal-clear (`Alpha: 0.25`, `Transmission Weight: 1.0`, `Roughness: 0.02`).

### Étape 4 : Aménagement Intérieur Complet ("Intérieur compris")
Ne jamais laisser l'intérieur vide lorsqu'il est visible à travers les baies :
* **Revêtement de sol :** Dalles grand format en marbre/grès cérame lustré (`roughness: 0.18`).
* **Zone salon :** Canapé d'angle modulable, table basse design, tapis texturé, mur média avec tasseaux de bois, écran plat OLED et lampadaire.
* **Zone cuisine/repas :** Îlot central avec plan de travail en cascade marbre/quartz, tabourets hauts, suspensions laiton.
* **Escalier :** Marches suspendues en chêne clair et garde-corps fin.
* **Étage :** Lit king size avec tête de lit et tables de chevet.
* **Éclairage d'ambiance intérieur :** Spots au plafond et points lumineux chauds (2700K - 3000K) pour créer la lueur intérieure visible de jour comme au crépuscule.

### Étape 5 : Mobilier Extérieur & Pergola
* Pergola bioclimatique en alu noir avec lames d'ombrage.
* Table de repas en teck et chaises d'extérieur.
* Salon lounge (fauteuils tressés, table galet).
* Fauteuil cocon suspendu sous le porche couvert.
* Appliques murales up/down diffusant des faisceaux lumineux sur les façades.

### Étape 6 : Cadrage Caméra & Prise de Vue
* **Caméra extérieure :** Cadrage 3/4 avec légère contre-plongée ou vue à hauteur d'homme (Z ~ 2.0-2.4m).
* **Caméra intérieure :** Vue immersive grand angle (24mm) au cœur du salon pour visiter les aménagements.
* **Nettoyage Viewport :** Masquer les guides, curseur 3D et contours pour un rendu propre immédiat.
