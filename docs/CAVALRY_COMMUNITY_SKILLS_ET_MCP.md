# Guide d'Automatisation Avancée : Cavalry MCP & Skills Communautaires

> Ce document synthétise et intègre les 3 projets majeurs de la communauté pour le pilotage de **Cavalry 2D** par IA via le Model Context Protocol (MCP) et les bridges locaux :
> 1. [**WhyCavalry** (par OfficialWhyEd)](https://github.com/OfficialWhyEd/WhyCavalry) — File bridge local, interaction sans copier-coller & mémoire itérative.
> 2. [**Cavalry Claude Bridge** (par Jo-Serk)](https://glama.ai/mcp/servers/Jo-Serk/cavalry-claude-bridge) — Pont Stallion, base de connaissances `api-notes.md` et catalogue `cavalry-enum-db.json`.
> 3. [**Cavalry-MCP** (par ZHUYUFAN3-33 / nxnai)](https://glama.ai/mcp/servers/ZHUYUFAN3-33/cavalry-mcp) — Serveur MCP d'élite à 28 outils typés, `cavalry-bridge.js` autonome (sans Stallion requis), batching et capture d'erreurs typées.

---

## 1. Vue d'Ensemble des 3 Outils de la Communauté

```
                                      ┌─────────────────────────────────────────────────────────┐
                                      │                     ANTIGRAVITY / IA                     │
                                      └──────────────┬────────────────────────────┬─────────────┘
                                                     │                            │
                                           [Option MCP Typé]              [Option Script/File]
                                                     │                            │
                                                     ▼                            ▼
                                         ┌───────────────────────┐    ┌────────────────────────┐
                                         │  cavalry-mcp / bridge │    │ WhyCavalry File Bridge │
                                         │ (ZHUYUFAN3-33/Jo-Serk)│    │   (OfficialWhyEd)      │
                                         └───────────┬───────────┘    └───────────┬────────────┘
                                                     │ HTTP                       │ File polling
                                                     ▼                            ▼
                                         ┌─────────────────────────────────────────────────────┐
                                         │                  CAVALRY 2D (Wine 9.0)              │
                                         │  api.WebServer (8080)  OU  Stallion HTTP (8080)     │
                                         │  -> Viewport temps réel, duplicateurs, exports PNG  │
                                         └─────────────────────────────────────────────────────┘
```

| Outil | Mécanisme | Points Forts | Rôle pour notre Pipeline |
|---|---|---|---|
| **WhyCavalry** | File Bridge (`~/.whycavalry/cmd` & `res`) + exécution de scripts | Dialogue itératif naturel, rapidité de test sans configuration réseau. | Modèle de prompt pour ajustements itératifs ("rends l'animation 30% plus rapide", "ajoute un rebond"). |
| **Cavalry Claude Bridge** | HTTP vers Stallion (`127.0.0.1:8080`) | Base de connaissances validée (`api-notes.md`), documentation des fonctions non supportées, catalogue d'énumérations. | Source de vérité sur les règles de syntaxe C++/V8 de Cavalry et gestion des collections nodales. |
| **cavalry-mcp** | Serveur MCP Stdio + `cavalry-bridge.js` autonome | 28 outils granulaires, Zod validation, pas de crash silencieux, exécution par lot (`cavalry_batch`), inspection des connexions. | Moteur principal d'automatisation nodale pour l'IA dans l'IDE. |

---

## 2. Inventaire des 28 Outils MCP (`cavalry-mcp`)

Le serveur MCP `cavalry-mcp` expose des outils structurés et sécurisés qui évitent à l'IA d'injecter du code non vérifié :

### A. Introspection de la Scène (Ne jamais deviner, toujours inspecter)
* `cavalry_ping` : Vérifie la connectivité avec le bridge Cavalry et renvoie la plateforme hôte.
* `cavalry_list_layers` : Liste tous les calques du projet (`id`, `type`, `name`).
* `cavalry_get_selection` : Récupère les calques actuellement sélectionnés.
* `cavalry_composition_info` : Renvoie résolution (X, Y), plage de frames (`startFrame`, `endFrame`), FPS et frame courante.
* `cavalry_get_attribute` : Lit la valeur exacte d'un attribut sur un calque (`layerId`, `attrPath`).
* `cavalry_list_attributes` : **Outil vital.** Liste tous les attributs d'un calque avec leur type, `niceName`, état d'animation et enfants composés. Évite les erreurs silencieuses d'attributs inexistants.
* `cavalry_list_layer_types` : Liste tous les types de calques instanciables (ex: `shuffleString` pour "Shuffle String Manipulator").
* `cavalry_inspect_connections` : **Vérification cruciale.** Détecte les connexions entrantes (`incoming`), sortantes (`outgoing`) et attributs animés.
* `cavalry_bounding_box` : Mesure la boîte englobante dans l'espace monde pour vérifier la position sans calcul d'image.

### B. Création & Primitives
* `cavalry_create_layer` : Crée un nœud standard (`textShape`, `duplicator`, `null`, `stagger`, `basicShape`, etc.).
* `cavalry_create_primitive` : Crée une primitive complète avec matière et contour (`ellipse`, `rectangle`, `star`, `polygon`, `ring`, `arrow`, `superEllipse`, `line`).

### C. Manipulation & Nœuds Procéduraux
* `cavalry_set_attribute` : Assigne un dictionnaire `{ "attribut": valeur }` (ex: `position: [0, 100]`, `color: "#38BDF8"`).
* `cavalry_set_generator` : Change le générateur ou la distribution (ex: assigner `fibonacciDistribution` à un duplicateur).
* `cavalry_connect` : Établit un lien nodal sécurisé avec vérification (`fromLayerId`, `fromAttrId`, `toLayerId`, `toAttrId`, `force`).
* `cavalry_parent` : Hiérarchise un enfant sous un parent (Null, Groupe) pour cascades de transformation.
* `cavalry_duplicate` : Clone des calques existants.
* `cavalry_delete_layers` : Supprime les calques inutiles ou temporaires.
* `cavalry_add_dynamic_attribute` : Ajoute un attribut dynamique (`double`, `string`, `color`, etc.) sur un nœud JavaScript.

### D. Animation & Courbes (*Magic Easing*)
* `cavalry_keyframe` : Pose une clé d'animation (`layerId`, `frame`, `{ "position.x": 100 }`).
* `cavalry_magic_easing` : Applique une courbe cinématique éprouvée.
* `cavalry_delete_keyframe` : Supprime une clé spécifique.
* `cavalry_set_frame` : Déplace la tête de lecture.
* `cavalry_play` : Lance la lecture dans le viewport.

### E. Rendu & Feedback Visuel Direct
* `cavalry_render_png` / `cavalry_render_frame` : Exporte une frame (en PNG) pour permettre à l'IA d'analyser le résultat visuel et corriger ses paramètres.

### F. Performance & Mode Batch
* `cavalry_batch` : Exécute une chaîne d'opérations en un seul aller-retour HTTP pour créer des scènes complexes sans latence.
* `cavalry_run_script` : Exécute du code JavaScript V8 arbitraire lorsque des opérations personnalisées sont nécessaires.

---

## 3. Base de Connaissances & Règles Critiques Extraites

Grâce aux dépôts de Jo-Serk et ZHUYUFAN3-33, voici les règles de syntaxe et d'architecture validées sur le moteur Cavalry :

### 1. Valeurs autorisées pour `cavalry_magic_easing`
Cavalry ne supporte **PAS** les noms génériques comme `EaseIn`, `EaseOut` ou `Linear`. La liste exhaustive supportée est :
- `SlowIn`
- `SlowOut`
- `SlowInSlowOut` *(Recommandé par défaut pour la fluidité)*
- `VerySlowIn`
- `VerySlowOut`
- `SpringIn` / `SpringOut`
- `BounceIn` / `BounceOut`
- `Custom`
- `None`

### 2. Catalogue des Distributions de Duplicateurs (`setGenerator`)
Ne jamais utiliser de boucle pour créer des copies. Connecter une forme à un `duplicator`, puis configurer :
- `circleDistribution` (attributs : `radius`, `count`, `angle`, `startAngle`)
- `gridDistribution` (attributs : `count`, `size`, `offset`)
- `fibonacciDistribution` (attributs : `count`, `radius`, `angle` = 137.508)
- `linearDistribution` (attributs : `count`, `size`, `direction`)
- `randomDistribution` (attributs : `count`, `size`, `seed`)
- `pathDistribution` (distribution le long d'un tracé)

### 3. Gestion des Tableaux Dynamiques (JS Utility & Behaviours)
- Les nœuds JavaScript démarrent avec un slot `array.0` (affiché "n0" dans l'UI).
- Pour ajouter un paramètre : appeler `api.addDynamic(id, "array", "double")` (retourne `array.1`).
- **Piège majeur :** Renommer un attribut dans l'interface ne met **JAMAIS** à jour le code de l'expression ! Il faut toujours réécrire l'attribut `expression` en cohérence.

---

## 4. Déploiement Local sous Ubuntu 24.04 / Wine 9.0

Deux ponts sont désormais installés et disponibles dans votre environnement :

1. **Option 1 : Stallion HTTP (`Stallion.js`)**
   - Menu Cavalry : **Scripts > Stallion** (Écoute sur `127.0.0.1:8080/post`).
   - Pilote universel pour scripts bruts et tools MCP.

2. **Option 2 : Bridge Natif Dédié (`cavalry-bridge.js`)**
   - Emplacement : `~/.cavalry/drive_c/users/mbogneng-junior/AppData/Roaming/Cavalry/Scripts/cavalry-bridge.js`
   - Menu Cavalry : **Scripts > cavalry-bridge** (Écoute sur `127.0.0.1:8080`).
   - Fournit le dispatching d'erreurs typées et le protocole POST-then-poll ultra-robuste.

---

## 5. Exemple de Flux de Travail Itératif (Prompt ➔ Animation ➔ Validation)

```bash
# 1. Tester la présence de Cavalry et du bridge :
cavalry_ping

# 2. Obtenir la résolution et la timeline :
cavalry_composition_info

# 3. Créer une primitive et son duplicateur en grille :
cavalry_create_primitive({ "generator": "rectangle", "name": "ForensicNode" })
cavalry_create_layer({ "layerType": "duplicator", "name": "NodeMatrix" })

# 4. Connecter la forme au duplicateur :
cavalry_connect({
  "fromLayerId": "basicShape#1",
  "fromAttrId": "id",
  "toLayerId": "duplicator#1",
  "toAttrId": "shapes"
})

# 5. Appliquer une distribution en grille et un oscillateur :
cavalry_set_generator({ "layerId": "duplicator#1", "generator": "gridDistribution" })
cavalry_create_layer({ "layerType": "oscillator", "name": "WaveMod" })
cavalry_connect({
  "fromLayerId": "oscillator#1",
  "fromAttrId": "out",
  "toLayerId": "duplicator#1",
  "toAttrId": "shapePosition.y"
})

# 6. Rendu d'une frame de contrôle :
cavalry_render_png({ "filePath": "/tmp/test_frame.png", "scale": 100 })
```
