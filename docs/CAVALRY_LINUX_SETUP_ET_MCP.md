# Guide Complet & Pérenne : Cavalry sur Linux (Ubuntu 24.04) & Pilotage IA / MCP

> **Statut du Système :** ✅ **INSTALLÉ, CONFIGURÉ ET TESTÉ AVEC SUCCÈS**  
> **Exécutable :** `/home/mbogneng-junior/.local/bin/cavalry`  
> **Prefix Wine :** `/home/mbogneng-junior/.cavalry` (Wine 9.0 64-bit)  
> **Pont IA Opérationnel :** **Stallion Bridge HTTP** (`http://127.0.0.1:8080/post`)  
> **Serveur MCP Antigravity :** `scripts/cavalry-mcp/dist/index.js`  
> **Test de validation en direct :** `HTTP/1.1 200 OK — Success` (création confirmée de calques dans le viewport)

---

## 1. Vue d'Ensemble & Rôle dans le Pipeline

[Cavalry](https://cavalry.studio/) est l'outil de référence pour le **Motion Design 2D procédural** (fusion moderne entre After Effects et la logique nodale d'Houdini).

Dans la chaîne YouTube (*The Ledger*), la stack graphique est structurée comme suit :
1. **Remotion** (`financial-forensics/`) : Motion design programmatique React / TypeScript pour les séquences orientées données (timelines chronologiques, documents confidentiels, zooms interactifs).
2. **Blender 3D** : Coupes schématiques médico-légales (Forensic Cross-Sections), dioramas 3D, scènes volumétriques et blueprints.
3. **Cavalry 2D** : Animation vectorielle procédurale pure (ondes, flux d'argent, visualisations financières dynamiques, grilles de duplicateurs animées, typographie cinématique).

---

## 2. Architecture Technique sur Linux (Ubuntu 24.04)

Puisque Cavalry est officiellement compilé pour Windows et macOS, son exécution sous Ubuntu s'appuie sur une couche Wine 9.0 hautement configurée :

| Composant | Emplacement / Valeur | Rôle |
|---|---|---|
| **Moteur Wine** | `/usr/bin/wine` (Wine 9.0 64-bit) | Couche de compatibilité Windows sur Linux |
| **Prefix dédié** | `/home/mbogneng-junior/.cavalry` | Environnement Windows isolé et optimisé |
| **Binaire Cavalry** | `~/.cavalry/drive_c/Program Files/Cavalry/Cavalry.exe` | Cavalry 2.8+ officiel |
| **Lanceur CLI** | `/home/mbogneng-junior/.local/bin/cavalry` | Wrapper bash avec overrides graphiques |
| **Raccourci Bureau** | `~/.local/share/applications/Cavalry.desktop` | Lancement depuis le menu des applications Ubuntu |
| **Gestionnaire URL SSO** | `~/.local/share/applications/cavalry-handler.desktop` | Interception du protocole `cavalry://auth/...` pour Canva |
| **Accélération Viewport** | `MESA_GL_VERSION_OVERRIDE=4.5` | Moteur OpenGL 4.5 Core via Mesa |

### Détails du wrapper (`~/.local/bin/cavalry`) :
```bash
#!/bin/bash
export WINEPREFIX="${WINEPREFIX:-$HOME/.cavalry}"
export MESA_GL_VERSION_OVERRIDE=4.5
export MESA_GLSL_VERSION_OVERRIDE=450
cd "$WINEPREFIX/drive_c/Program Files/Cavalry"
exec /usr/bin/wine "$WINEPREFIX/drive_c/Program Files/Cavalry/Cavalry.exe" "$@"
```

---

## 3. Comprendre l'Intégration IA / MCP : Historique des Deux Approches

Pour qu'un agent IA (comme Antigravity, Claude ou Cursor) puisse piloter Cavalry, deux méthodes ont été explorées. Il est crucial pour toute future IA de comprendre pourquoi la méthode 2 a été retenue :

### Approche A : Le serveur SSE natif Cavalry 2.8 (`http://localhost:6768/sse`)
*Cavalry 2.8 a introduit un serveur MCP interne basé sur SSE.*
* **Pourquoi les clients génériques échouent :**  
  1. **En-têtes HTTP de sécurité obligatoires :** Cavalry rejette avec une erreur `HTTP 401 Unauthorized` toute requête qui ne transmet pas explicitement :
     * `X-Cavalry-MCP-Client-Name` (ex: `Antigravity`)
     * `X-Cavalry-MCP-Fingerprint` (empreinte de session)
     * `X-Cavalry-MCP-Client-Version`
  2. **Limitations de Wine sur le multithreading SSE :** Les workers SSE de `ExtensionLayer.dll` s'appuient sur des primitives Windows (`SRWLock`, threads asynchrones avec allocateurs heap MSVC) qui provoquent sous Wine des deadlocks (`RtlReleaseSRWLockExclusive is not owned exclusive`) et des tentatives d'allocation mémoire virtuelle géante (`mmap size 0x7fa5b94f0000`).
* **Conclusion :** Le serveur SSE natif est fragile sous Wine.

### Approche B (Retenue & 100% Stable) : Le Pont Stallion HTTP + `cavalry-mcp`
*La solution officielle adoptée par la communauté Cavalry (VS Code extension Stallion & package `cavalry-mcp`).*
* **Fonctionnement :**  
  Un script léger (`Stallion.js`) s'exécute directement à l'intérieur du runtime JavaScript V8 de Cavalry grâce à l'objet natif `api.WebServer`.
* **Avantages déterminants :**
  1. Aucun thread externe : s'exécute dans la boucle d'événements de Cavalry.
  2. Zéro instabilité Wine.
  3. Réponse instantanée `200 OK - Success` avec retour des logs et ID d'objets créés.

---

## 4. Configuration & Déploiement du Pont Stallion

### A. Emplacement du script dans Cavalry
Le script est copié dans le dossier des scripts utilisateur de Cavalry :
* **Chemin :** `/home/mbogneng-junior/.cavalry/drive_c/users/mbogneng-junior/AppData/Roaming/Cavalry/Scripts/Stallion.js`
* **Copie de secours :** `scripts/cavalry/Stallion.js`

### B. Serveur MCP Stdio (`cavalry-mcp`)
Le serveur MCP traduit les appels d'outils de l'IDE vers des requêtes HTTP POST à destination de Stallion :
* **Dossier :** `scripts/cavalry-mcp/`
* **Point d'entrée compilé :** `scripts/cavalry-mcp/dist/index.js`
* **Endpoint cible :** `http://127.0.0.1:8080/post`

### C. Configuration Antigravity IDE (`~/.gemini/antigravity-ide/mcp_config.json`)
```json
{
  "mcpServers": {
    "cavalry": {
      "command": "node",
      "args": [
        "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/scripts/cavalry-mcp/dist/index.js"
      ]
    }
  }
}
```

---

## 5. Guide de Démarrage Rapide (Procédure pour l'Utilisateur ou l'IA)

Quand vous démarrez une nouvelle session de travail :

1. **Lancer Cavalry :**
   Dans un terminal : `cavalry` (ou via l'icône d'application).
2. **Ouvrir une scène :**
   Créez un nouveau projet / nouvelle comp (`Ctrl+N` ou bouton New Comp).
3. **Activer le bridge Stallion :**
   Dans le menu du haut de Cavalry : cliquez sur **Scripts > Stallion**.  
   *Une petite fenêtre s'ouvre indiquant `Listening on 127.0.0.1:8080`.* (Laissez cette fenêtre ouverte).
4. **Vérification instantanée depuis le terminal :**
   ```bash
   curl -s -X POST http://127.0.0.1:8080/post \
     -H "Content-Type: application/json" \
     -d '{"type":"script","code":"api.log(\"PING OK\");"}'
   # Réponse attendue : Success
   ```
5. **Recharger Antigravity IDE :**  
   Faites `Ctrl+Shift+P` -> `Developer: Reload Window`. Les outils MCP `cavalry_*` sont alors automatiquement attachés à l'agent.

---

## 6. Outils MCP Disponibles & Guide de Pilotage pour l'IA

Quand l'agent IA dispose des outils `cavalry`, il a accès à :

| Outil MCP | Paramètres | Rôle |
|---|---|---|
| `cavalry_ping` | `{}` | Vérifie si Stallion et Cavalry répondent sur le port 8080. |
| `cavalry_run_script` | `{ "code": "..." }` | **L'outil universel le plus puissant.** Exécute n'importe quel code JavaScript V8 dans la scène. |
| `cavalry_create_layer` | `{ "layerType": "textShape", "name": "MonTitre" }` | Crée un calque spécifique et retourne son ID. |
| `cavalry_set_attribute` | `{ "layerId": "...", "attributes": {...} }` | Modifie les propriétés d'un calque. |
| `cavalry_get_attribute` | `{ "layerId": "...", "attribute": "..." }` | Lit la valeur courante d'un attribut. |
| `cavalry_connect` | `{ "sourceLayer": "...", "sourceAttr": "...", "targetLayer": "...", "targetAttr": "..." }` | Établit une connexion nodale entre calques. |
| `cavalry_keyframe` | `{ "layerId": "...", "attribute": "...", "frame": 0, "value": 100 }` | Pose une clé d'animation à une frame précise. |

---

## 7. Principes Fondamentaux de Scripting Cavalry (Pour les Agents IA)

Pour générer des animations fluides et professionnelles, l'IA doit respecter ces règles d'or :

### Règle 1 : La logique du Duplicator (JAMAIS de boucle `for` pour créer des calques)
Ne créez jamais 50 calques séparés avec une boucle `for`.  
Créez **une seule forme source**, connectez-la à un **`duplicator`**, définissez la distribution (Grid, Circle, Path, etc.), puis connectez des **Behaviours** (`noise`, `oscillator`, `random`) pour animer dynamiquement toutes les copies.

### Règle 2 : Primitives complètes (`basicShape`)
Privilégiez les formes complètes (`basicShape` avec générateur `rectangle`, `ellipse`, `polygon`) plutôt que les générateurs nus (`ringShape`), car les formes complètes possèdent immédiatement les attributs de couleur, contour (`stroke`), fond (`fill`), matière et modes de fusion.

### Recette 1 : Création d'un titre cinématique avec lueur
```javascript
// Création du calque texte
var titleId = api.create("textShape", "Titre_Principal");
api.set(titleId, {
    "text": "THE LEDGER",
    "fontSize": 90,
    "horizontalAlignment": 1, // Centre
    "position": [0, 0],
    "color": "#FFD700" // Doré (impérativement une chaîne hexadécimale !)
});

// Animation fluide sans keyframes via un oscillateur
var oscId = api.create("oscillator", "Oscillateur_Opacite");
api.set(oscId, { "min": 60, "max": 100, "frequency": 1.2 });
api.connect(oscId, "output", titleId, "opacity");
```

---

## 7.bis RÈGLES CRITIQUES DE L'API C++ CAVALRY & GESTION DES ASSETS

1. **Importation d'Images / Documents Texturés :**
   - Ne jamais utiliser `api.create("imageAsset")` ou `imageShape` (types inexistants).
   - Utiliser :
     ```javascript
     var assetId = api.loadAsset("C:/brand/mon_image.jpg", false);
     var footageId = api.addAssetToComp(assetId);
     ```
2. **Couleurs :** Toujours en hexadécimal `"#RRGGBB"` (le parseur JSON C++ plante sur `{r, g, b, a}`).
3. **Position dans `api.set` :** Toujours un vecteur `[x, y]`, jamais `"position.x"`.
4. **Keyframes & Magic Easing :** Animer `"position.x"` individuellement puis appliquer `api.magicEasing(id, "position.x", frame, "SlowIn")`.
5. **Opacité :** En pourcentage de 0 à 100 (pas 0.0 à 1.0).


### Recette 2 : Grille financière procédurale (Wall Street Matrix)
```javascript
// 1. Forme de base (losange / point de données)
var dotId = api.create("basicShape", "DataPoint");
api.set(dotId, { "generator.sides": 4, "radius": 6 });

// 2. Duplicateur en grille 10x10
var dupId = api.create("duplicator", "DataGrid");
api.connect(dotId, "id", dupId, "shapes.0");
api.set(dupId, {
    "distribution": 1, // Grid
    "grid.columns": 10,
    "grid.rows": 10,
    "grid.spacing.x": 80,
    "grid.spacing.y": 80
});

// 3. Bruit de Perlin pour faire onduler les points
var noiseId = api.create("noise", "GridNoise");
api.set(noiseId, { "frequency": 0.5, "strength": 40 });
api.connect(noiseId, "output", dupId, "transform.position.y");
```

---

## 8. Dépannage & FAQ

| Symptôme | Cause | Résolution |
|---|---|---|
| `curl ...:8080/post` renvoie `Connection refused` | Le script Stallion n'est pas actif dans Cavalry | Dans Cavalry, cliquez sur **Scripts > Stallion**. La petite fenêtre doit afficher `Listening on 127.0.0.1:8080`. |
| `HTTP 404 Not Found` sur port 8080 | Mauvaise URL appelée | L'endpoint exact de Stallion est `/post` (`http://127.0.0.1:8080/post`). |
| Outils `cavalry_*` absents de la liste d'Antigravity | IDE non rechargé après modification de `mcp_config.json` | Faites `Ctrl+Shift+P` -> `Developer: Reload Window`. |
| Viewport Cavalry tout noir | OpenGL mal reconnu par Mesa | Vérifier que `MESA_GL_VERSION_OVERRIDE=4.5` est actif dans le script wrapper (`~/.local/bin/cavalry`). |
| Redémarrage PC : où est le script ? | Persistance garantie | Le script est stocké de manière permanente dans `~/.cavalry/drive_c/users/mbogneng-junior/AppData/Roaming/Cavalry/Scripts/Stallion.js` et reste disponible dans le menu **Scripts** à chaque ouverture. |

---

## 9. Bilan Stratégique : Séparation des Rôles & Scripts Créés

### La règle d'or pour la chaîne YouTube *The Ledger* :
1. **Remotion (`financial-forensics/`) = Le Cœur Éditorial & Narratif :**
   - Toutes les fiches d'enquête (*Evidence Cards*), photos de suspects, documents PDF caviardés et titres de films (*Cinzel* doré).
   - Raison : 100% natif Linux, React/CSS au pixel près, hot-reload, export ProRes transparent immédiat.
2. **Cavalry 2D = Le Moteur d'Overlays Procéduraux Abstraits :**
   - Fonds de flux financiers ondulants, vortex de Fibonacci, réseaux de blanchiment (Plexus).
   - Raison : 60 FPS constants sur GPU, calculs nodaux impossibles en DOM web.

### Catalogue des Scripts Déployés (`Scripts/`) :
Tous ces scripts sont situés dans `~/.cavalry/drive_c/users/mbogneng-junior/AppData/Roaming/Cavalry/Scripts/` et directement accessibles dans le menu **Scripts** de Cavalry :

1. **`01_Nine_Days_To_Zero.js`** : Séquence titre maître cinématographique complète (Desk photoréaliste + Whip-Pan vers SBF et The Ledger).
2. **`02_Nine_Days_Modulaire.js`** : Plaque d'ardoise avec texte natif vectoriel modifiable en direct dans l'Attribute Editor.
3. **`03_Procedural_Forensic_Matrix.js`** : Matrice de 400 micro-processeurs en vague 3D + cadran radar circulaire 60 ticks.
4. **`04_Fibonacci_Capital_Vortex.js`** : Vortex d'or de Fibonacci (260 tokens) avec trou noir de déficit des 8 milliards.
5. **`05_Alameda_Money_Laundering_Plexus.js`** : Réseau médico-légal de blanchiment d'argent XXL avec câbles néon, paquets d'argent volants et ondes d'impact.

