---
name: effectcraft-motion
description: Pilotage d'EffectCraft (moteur After Effects en pur Rust sous Linux) via MCP et CLI pour créer des animations Motion Design, effets visuels (VFX), tracés animés et overlays vidéo transparents ProRes 4444 Alpha.
---

# Guide Opérationnel : EffectCraft Motion Design & MCP

Ce skill formalise le workflow de production graphique, d'animation After Effects et de compositing sous Linux piloté par Antigravity dans **EffectCraft** via son serveur MCP natif (`effectcraft-cli mcp`) et sa CLI de rendu.

---

## 1. Vue d'Ensemble & Environnement

EffectCraft remplace intégralement les anciens workflows After Effects et Cavalry sous Linux. C'est un moteur écrit à 100 % en pur Rust, sans Wine, sans FFmpeg externe et sans émulation.

| Composant | Chemin Absolu |
|---|---|
| **CLI & Serveur MCP** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/tools/effectcraft/bin/effectcraft-0.8.0-linux-x86_64/bin/effectcraft-cli` |
| **Application GUI (AppImage)** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/tools/effectcraft/bin/effectcraft.AppImage` |
| **Dépôt & Sources** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/tools/effectcraft/source/` |
| **Fichiers Projets** | Fichiers `.ecproj` (format JSON pur, diffable et versionnable) |

---

## 2. Outils MCP Disponibles (`effectcraft`)

Le serveur MCP stdio expose 22 outils puissants et directs :

| Outil MCP | Rôle |
|---|---|
| `get_project` | Retourne la structure complète du projet en cours (comps, calques, métadonnées). |
| `get_comp` | Retourne le détail d'une composition spécifique (`comp_id`). |
| `get_layer` | Inspecte un calque précis (`layer_id`) et l'arborescence de ses propriétés. |
| `get_property` | Lit la valeur ou l'état d'animation d'une propriété (`layer_id`, `prop_path`). |
| `set_property` | Modifie la valeur ou applique une expression After Effects (`layer_id`, `prop_path`, `value`, `expression`). |
| `add_keyframe` | Pose une clé d'animation (`layer_id`, `prop_path`, `time`, `value`, `ease_in`, `ease_out`). |
| `add_effect` | Ajoute un effet visuel sur un calque (`layer_id`, `match_name`, `params`). |
| `list_effects` | Liste les 306 effets disponibles avec leurs identifiants internes. |
| `list_fonts` | Liste les polices typographiques installées et disponibles. |
| `get_state` | Retourne l'état courant de l'application (timeline, sélection, frame active). |
| `render_frame` | Rend une frame PNG en mémoire ou sur disque (temps moyen : ~160 ms en 1080p). |
| `open_project` | Ouvre un fichier `.ecproj` existant. |
| `save_project` | Sauvegarde le projet courant vers un chemin `.ecproj`. |
| `command_run` | Exécute l'une des 669 commandes internes du moteur (ex: `comp.new`, `layer.new_solid`, `layer.new_text`). |
| `batch` / `command_batch` | Exécute un ensemble d'opérations de manière atomique en un seul appel. |
| `undo` / `redo` / `history` | Gestion de l'historique d'actions. |

---

## 3. Workflow Standard de Création en 6 Étapes

### Étape 1 : Initialisation du Projet
Deux méthodes sont valables :
1. **Via MCP :**
   ```json
   // 1. Créer une nouvelle composition 1920x1080 @ 25fps :
   call_mcp_tool("effectcraft", "command_run", {
     "id": "comp.new",
     "args": {
       "name": "ForensicGraphic",
       "width": 1920,
       "height": 1080,
       "fps": 25,
       "duration": 5.0
     }
   })
   ```
2. **Via Écriture Directe du JSON `.ecproj` :**
   Puisqu'un projet EffectCraft est un simple fichier JSON, l'agent peut également générer ou modifier directement un fichier `.ecproj` puis l'ouvrir avec `open_project`.

### Étape 2 : Création des Calques
Utiliser `command_run` pour ajouter les éléments structurants :
* **Fond solide :**
  ```json
  call_mcp_tool("effectcraft", "command_run", {
    "id": "layer.new_solid",
    "args": { "name": "Background", "color": [0.03, 0.04, 0.06, 1.0] }
  })
  ```
* **Texte :**
  ```json
  call_mcp_tool("effectcraft", "command_run", {
    "id": "layer.new_text",
    "args": { "text": "OCTOBRE 2017 — ATHÈNES", "fontSize": 64 }
  })
  ```
* **Calque de forme (Shape Layer) :**
  ```json
  call_mcp_tool("effectcraft", "command_run", { "id": "layer.new_shape", "args": { "name": "RadarLine" } })
  ```
* **Calque Null (contrôleur) :**
  ```json
  call_mcp_tool("effectcraft", "command_run", { "id": "layer.new_null", "args": { "name": "CameraCtrl" } })
  ```

### Étape 3 : Animation & Interpolation (Keyframes)
Poser des clés sur les propriétés de transformation (`transform.position`, `transform.scale`, `transform.opacity`, `transform.rotation`) :
```json
call_mcp_tool("effectcraft", "add_keyframe", {
  "layer_id": "txt_01",
  "prop_path": "transform.opacity",
  "time": 0.0,
  "value": 0.0
})
call_mcp_tool("effectcraft", "add_keyframe", {
  "layer_id": "txt_01",
  "prop_path": "transform.opacity",
  "time": 0.5,
  "value": 100.0,
  "ease_in": [0.25, 0.1, 0.25, 1.0]
})
```

### Étape 4 : Expressions After Effects
EffectCraft supporte la syntaxe standard des expressions After Effects. Utilisez `set_property` avec l'argument `expression` :
* **Tremblement organique / Wiggle :** `"wiggle(2, 25)"`
* **Rotation continue temporelle :** `"time * 45"`
* **Pulsation lumineuse ou d'échelle :** `"Math.sin(time * 4) * 15 + 100"`

### Étape 5 : Ajout d'Effets Visuels (VFX)
Choisir parmi les 306 effets intégrés via `add_effect` :
* `ADBE Glow2` : Éclat néon cyan sur les tracés de preuve.
* `ADBE Fast Blur` : Flou directionnel ou d'ambiance.
* `ADBE Drop Shadow` : Ombre portée pour détacher les calques.
* `ADBE Color Balance` : Correction colorimétrique documentaire sombre.

### Étape 6 : Validation Visuelle & Rendu
1. **Contrôle instantané (PNG) :**
   ```json
   call_mcp_tool("effectcraft", "render_frame", {
     "time": 1.5,
     "out_path": "preview.png"
   })
   ```
2. **Sauvegarder le projet :**
   ```json
   call_mcp_tool("effectcraft", "save_project", {
     "path": "/chemin/absolu/scene.ecproj"
   })
   ```
3. **Rendu vidéo via la CLI :**
   ```bash
   ./tools/effectcraft/bin/effectcraft-0.8.0-linux-x86_64/bin/effectcraft-cli render \
       --project "/chemin/absolu/scene.ecproj" \
       --comp "ForensicGraphic" \
       --fps 25 \
       --out "/chemin/absolu/scene.mp4"
   ```

---

## 4. Règles d'Intégration dans le Pipeline YouTube

1. **Norme Cadence :** Toujours configurer les compositions à **25.0 FPS**.
2. **Norme Résolution :** **1920×1080** (ou 3840×2160 pour les plans zoomables).
3. **Overlays avec Canal Alpha :**
   * Pour les titrages et animations superposées sur la piste `V2_OVERLAYS` ou `V3_TITLES`, exporter en **ProRes 4444** avec transparence (`.mov`) :
     ```bash
     effectcraft-cli render --project anim.ecproj --comp "Overlay" --fps 25 --format prores4444 --out overlay.mov
     ```
4. **Charte Couleurs Financial Forensics :**
   * Fond sombre : `#080B10` / `[0.03, 0.04, 0.06]`
   * Accent Cyan / Preuve : `#38BDF8` / `[0.22, 0.74, 0.97]`
   * Alerte / Fraude : `#EF4444` / `[0.94, 0.27, 0.27]`
   * Texte Titre : `#F8FAFC` / `[0.97, 0.98, 0.99]`
