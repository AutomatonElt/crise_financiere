---
name: cavalry-motion
description: Pilotage de Cavalry 2D procédural sous Linux/Wine via le pont Stallion HTTP et le serveur MCP. À utiliser pour créer des animations 2D, graphiques financiers, typographies dynamiques, flux de données, fiches volantes et grilles procédurales.
---

# Skill : Pilotage de Cavalry 2D via MCP / Stallion

## 1. Principes d'Architecture sur la Machine

- **Plateforme :** Ubuntu 24.04 avec Wine 9.0 64-bit.
- **Prefix Wine :** `/home/mbogneng-junior/.cavalry` (Drive C = `~/.cavalry/drive_c`).
- **Exécutable :** `~/.local/bin/cavalry` (wrapper configuré avec `MESA_GL_VERSION_OVERRIDE=4.5`).
- **Ponts de Communication :**
  - **Option 1 (Stallion) :** `http://127.0.0.1:8080/post` (via menu **Scripts > Stallion**).
  - **Option 2 (Bridge Autonome) :** `http://127.0.0.1:8080` (via menu **Scripts > cavalry-bridge**).
- **Dossier Scripts Cavalry :** `~/.cavalry/drive_c/users/mbogneng-junior/AppData/Roaming/Cavalry/Scripts/`.
  *(Tout script `.js` déposé dans ce dossier apparaît instantanément dans le menu **Scripts** de Cavalry).*
- **Dossier Assets Windows :** `C:/brand/` (mappé sur `~/.cavalry/drive_c/brand/`) et `C:/Program Files/Cavalry/assets/brand/`.
- **Documentation exhaustive :** Voir [docs/CAVALRY_COMMUNITY_SKILLS_ET_MCP.md](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/docs/CAVALRY_COMMUNITY_SKILLS_ET_MCP.md) et [docs/CAVALRY_LINUX_SETUP_ET_MCP.md](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/docs/CAVALRY_LINUX_SETUP_ET_MCP.md).

> ⚠️ **Note Critique de Sécurité IA :**  
> Ne jamais contacter le port SSE 6768 natif sous Wine (deadlocks SRWLock). Toujours passer par Stallion / cavalry-bridge (`127.0.0.1:8080`) ou déposer un script dans le dossier `Scripts/` de Cavalry.

---

## 2. Délimitation Stricte des Rôles : Quand utiliser Remotion vs Cavalry ?

> 🚨 **RÈGLE CARDINALE DE PRODUCTION :**  
> **Ne JAMAIS utiliser Cavalry pour faire des mises en page de documents, de fiches de preuves ou de titrages de films.**

| Tâche Graphique | Outil Obligatoire | Pourquoi ? |
| :--- | :--- | :--- |
| **Génériques de titres de prestige & Typographie Cinzel** | **REMOTION** | Typographie vectorielle web parfaite, balayage lumineux spéculaire (`stage1SheenProgress`), flou de mouvement CSS, synchro SFX frame par frame. |
| **Fiches de preuves (Evidence Cards) & Dossiers criminels** | **REMOTION** | Mise en page CSS/Flexbox naturelle, ombres portées douces, réactivité par props React (`<EvidenceCard />`), 0 décalage visuel. |
| **Documents financiers & Bilans fuités surlignés** | **REMOTION** | Surlignage jaune animé, caviardage noir, zoom de caméra interactif. |
| **Fonds de flux d'argent ondulants (400 points)** | **CAVALRY** | 60 FPS constants, impossible en DOM React sans faire ramer le navigateur. |
| **Graphes de réseau on-chain (Plexus) & Cadrans FUI** | **CAVALRY** | Duplicators, calculs nodaux Skia, capsules voyageuses sur circuits. |
| **Spirales mathématiques & Vortex de liquidité (Fibonacci)** | **CAVALRY** | Phyllotaxie mathématique pure, morphing d'angles en temps réel. |

---

## 3. Les Pièges Mortels de l'API C++ Cavalry (Règles Communautaires Validées)

Cavalry est écrit en **C++ natif avec un parseur JSON strict (`nlohmann::json`)** et le moteur JavaScript V8.

| ERREUR INTERDITE | POURQUOI CELA PLANTE | CE QU'IL FAUT ÉCRIRE |
| :--- | :--- | :--- |
| `api.create("imageAsset")` / `imageShape` | **Nœuds inexistants** dans le binaire C++ de Cavalry. | `var assetId = api.loadAsset(path, false);`<br>`var shapeId = api.addAssetToComp(assetId);` |
| `"color": {"r": 255, "g": 215, "b": 0}` | Lève l'exception fatale `[json.exception.type_error.302] type must be string, but is object`. | Toujours une **chaîne hexadécimale** :<br>`"color": "#FFD700"` ou `"#0B0F19"` |
| `api.set(id, { "position.x": 100 })` | Lève l'erreur `Attribute not found: position.x`. Dans `api.set`, `position` est un vecteur 2D/3D. | `api.set(id, { "position": [100, 0] });` |
| `api.set(ellipse, { "generator.dimensions": ... })` | Lève l'erreur `Attribute not found: generator.dimensions`. Les ellipses utilisent le rayon ! | `api.set(ellipse, { "generator.radius": [120, 120] });` |
| `api.set(osc, { "min": -2, "max": 2 })` | Lève l'erreur `Attribute not found: min`. | `api.set(osc, { "minimum": -2, "maximum": 2 });` |
| `api.connect(osc, "output", ...)` | Lève l'erreur `connect: source attribute not found`. L'attribut de sortie est `out`. | `api.connect(osc, "out", target, "attribute");` |
| `api.magicEasing(id, "position", frame, ...)` | Lève le warning `Attribute is not keyframed: position`. L'interpolation se fait par canal individuel. | `api.magicEasing(id, "position.x", frame, "SlowIn");` |
| `EaseIn`, `Linear`, `BackIn` dans `magicEasing` | **Noms non supportés** par Cavalry. | Utiliser exclusivement : `SlowIn`, `SlowOut`, `SlowInSlowOut`, `VerySlowIn`, `VerySlowOut`, `SpringIn`, `SpringOut`, `BounceIn`, `BounceOut`, `Custom`, `None`. |
| `api.set(id, { "opacity": 0.8 })` | Dans Cavalry, l'opacité est un **pourcentage de 0 à 100**. | `api.set(id, { "opacity": 80.0 });` |
| Boucle `for (var i = 0; i < N; i++) api.create(...)` | Proscrit sous Cavalry. Surcharge la scène et empêche l'animation procédurale. | Créer **une forme source** + **un duplicator** + connecter une distribution (`circleDistribution`, `gridDistribution`, `fibonacciDistribution`). |

---

## 4. Outils MCP Disponibles & Guide d'Utilisation

L'agent a accès aux 28 outils MCP suivants :

1. **Introspection :**
   - `cavalry_ping` : Statut du bridge et plateforme.
   - `cavalry_list_layers` : Liste complète des calques.
   - `cavalry_list_attributes({ layerId })` : **À appeler systématiquement avant de modifier un attribut inconnu** pour éviter les écritures muettes dans le vide.
   - `cavalry_inspect_connections({ layerId })` : Vérification en direct des connexions nodales.
   - `cavalry_composition_info` : Résolution, cadencement et durée.
   - `cavalry_bounding_box({ layerId, worldSpace: true })` : Dimensions réelles et centrage.

2. **Création & Modification :**
   - `cavalry_create_primitive({ generator: "rectangle" | "ellipse" | "star" | "polygon" | "ring" | "arrow" })` : Primitives complètes prêtes à l'emploi.
   - `cavalry_create_layer({ layerType: "duplicator" | "oscillator" | "noise" | "null" | ... })` : Nœuds logiques.
   - `cavalry_set_attribute({ layerId, attributes: { ... } })` : Modification par lot.
   - `cavalry_set_generator({ layerId, generator: "gridDistribution" | "circleDistribution" | "fibonacciDistribution" })` : Paramétrage des duplicateurs.
   - `cavalry_connect({ fromLayerId, fromAttrId, toLayerId, toAttrId })` : Câblage nodal.
   - `cavalry_keyframe({ layerId, frame, attributes })` : Pose de keyframe.
   - `cavalry_magic_easing({ layerId, attrPath, frame, easingType: "SlowInSlowOut" })` : Lissage de courbe.

3. **Boucle de Rétroaction Visuelle (Inspect & Correct) :**
   - `cavalry_render_png({ filePath: "/tmp/frame.png", scale: 100 })` : Exporte la frame courante pour contrôle visuel.

---

## 5. Le Piège de l'Échelle et du Contraste (Calibration 1080p)

> ⚠️ **Attention au dézoom du Viewport :**  
> Le viewport Cavalry est souvent dézoomé à 40%-50%. Tout élément trop fin devient **invisible**.

- **Câbles & Tracés :** Jamais de traits de 2-3 px. Minimum **6 à 10 px d'épaisseur** pour être perçu nettement.
- **Nœuds & Cercles :** Minimum **120 à 160 px de diamètre** avec un fond contrasté (`#151F36`) sur fond noir (`#050814`). Jamais de noir sur noir.
- **Typographie :** Titres à **24-32 px gras** (minimum 20 px pour les sous-titres). À 14 px, le texte est illisible à cette échelle.

---

## 6. Duplicators & Comportements Procéduraux — Recettes Types

### A. Grille de Données (400 Points Ondulants)
```javascript
var cell = api.primitive("rectangle", "Cell");
api.set(cell, { "generator.dimensions": [14, 14], "material.materialColor": "#00E5FF" });

var grid = api.create("duplicator", "Grid_400");
api.connect(cell, "id", grid, "shapes");
api.set(grid, {
    "generator.count": [25, 16], // 400 copies
    "generator.size": [1680, 960]
});

var wave = api.create("oscillator", "Wave_Y");
api.set(wave, { "minimum": -70, "maximum": 70, "frequency": 0.6, "stagger": 2.8 });
api.connect(wave, "out", grid, "shapePosition.y");
```

### B. Spirale d'Or de Fibonacci (260 Tokens en Chute Libre)
```javascript
var token = api.primitive("rectangle", "Token");
api.set(token, { "generator.dimensions": [14, 14], "generator.cornerRadius": 7, "material.materialColor": "#F59E0B" });

var spiral = api.create("duplicator", "Fibonacci_Spiral");
api.setGenerator(spiral, "generator", "fibonacciDistribution");
api.connect(token, "id", spiral, "shapes");
api.set(spiral, {
    "generator.count": 260,
    "generator.radius": 540,
    "generator.angle": 137.508 // Nombre d'or
});
```

---

## 7. Bibliothèque des Scripts Disponibles dans `Scripts/`

Tous ces scripts sont sauvegardés de manière permanente dans `~/.cavalry/drive_c/users/mbogneng-junior/AppData/Roaming/Cavalry/Scripts/` et exécutables en 1 clic dans le menu **Scripts** de Cavalry :

1. **`01_Nine_Days_To_Zero.js`** : La séquence titre maître photoréaliste (Desk d'investigation + transitions Whip-Pan vers SBF et The Ledger).
2. **`02_Nine_Days_Modulaire.js`** : Plaque d'ardoise et texte natif modifiable en direct dans l'Attribute Editor.
3. **`03_Procedural_Forensic_Matrix.js`** : Matrice de 400 processeurs en vague 3D + cadran radar circulaire 60 ticks.
4. **`04_Fibonacci_Capital_Vortex.js`** : Vortex d'or de Fibonacci (260 tokens) avec trou noir de déficit des 8 milliards.
5. **`05_Alameda_Money_Laundering_Plexus.js`** : Réseau médico-légal de blanchiment d'argent XXL avec câbles néon, paquets d'argent volants et ondes d'impact.
6. **`cavalry-bridge.js`** : Serveur HTTP autonome haute fidélité pour le pilotage IA via `cavalry-mcp`.
7. **`Stallion.js`** : Serveur HTTP historique pour scripts et tooling Scenery.io.
