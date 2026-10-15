# ⚡ EffectCraft — Studio After Effects en Pur Rust & Serveur MCP Natif

> **Source de Vérité Technique & Guide Opérationnel** pour la création graphique, l'animation After Effects, le compositing et le motion design automatisé sous Linux.  
> Ce document remplace définitivement les anciens workflows After Effects et Cavalry.

---

## 🏛️ 1. Architecture Générale & Révolution Linux

EffectCraft est une suite complète de Motion Design, de compositing vidéo et d'effets visuels (VFX) écrite **100 % en pur Rust**.  
Contrairement aux solutions traditionnelles qui nécessitent Wine, des bridges HTTP fragiles ou des licences propriétaires Adobe, EffectCraft tourne nativement sur le noyau Linux avec un accès direct au GPU via Vulkan / `wgpu`.

### Schéma d'Architecture Système :

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              ARCHITECTURE SYSTÈME EFFECTCRAFT                          │
├────────────────────────────────┬───────────────────────────────────────────────────────┤
│ 1. COUCHE INTERFACE GRAPHIQUE  │ 2. COUCHE HEADLESS & AUTOMATISATION                   │
│                                │                                                       │
│  [ effectcraft.AppImage ]      │  [ effectcraft-cli ]                                  │
│  • Interface Egui ultra-rapide │  • Serveur MCP Stdio (22 outils typés pour l'IA)      │
│  • Composition & Timeline 60fps│  • Rendu frame unique PNG (~160ms en 1080p)           │
│  • Graph Editor Bézier complet │  • Export vidéo batch (ProRes 4444 Alpha, H.264, AV1) │
│  • Prévisualisation GPU temps  │  • Inspection de projet, audit et diff JSON           │
│    réel sans latence           │  • Exécution de scripts et de commandes internes      │
├────────────────────────────────┴───────────────────────────────────────────────────────┤
│ 3. MOTEUR DE COMPOSITING & EFFETS (PUR RUST)                                           │
│  • 306 Effets Visuels GPU (Glow, Fast Blur, Drop Shadow, Color Balance, Stylize...)   │
│  • Moteur d'Expressions After Effects (wiggle, time, Math.*, interpolation temporelle) │
│  • Codecs intégrés en Rust pur : Apple ProRes 4444 (Alpha), H.264, AV1, Lottie JSON    │
│  • Format projet universel : .ecproj (JSON clair, lisible, diffable et versionnable)  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📍 2. Chemins Absolus & Environnement d'Exécution

Tous les binaires et fichiers nécessaires sont installés localement dans le dépôt du projet :

| Rôle | Chemin Absolu | Description |
|---|---|---|
| **Binaire CLI & Serveur MCP** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/tools/effectcraft/bin/effectcraft-0.8.0-linux-x86_64/bin/effectcraft-cli` | Moteur d'exécution headless, export et interface MCP |
| **Application GUI (AppImage)** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/tools/effectcraft/bin/effectcraft.AppImage` | Lancement de l'interface graphique de bureau |
| **Application GUI (Binaire)** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/tools/effectcraft/bin/effectcraft-0.8.0-linux-x86_64/bin/effectcraft` | Binaire GUI natif Linux x86_64 |
| **Sources & Documentation interne**| `/home/mbogneng-junior/Documents/art/Creation_contenus/Logiciels/effectcraft/` | Dépôt Git officiel cloné avec tests et exemples |
| **Configuration MCP Antigravity** | `.agents/mcp_config.json` & `~/.gemini/antigravity-ide/mcp_config.json` | Déclaration du serveur sous la clé `"effectcraft"` |
| **Skill Agent dédié** | `.agents/skills/effectcraft-motion/SKILL.md` | Directive opérationnelle Antigravity |

---

## 📄 3. Le Format Projet `.ecproj` (JSON Diffable)

L'un des atouts majeurs d'EffectCraft est son format de sauvegarde : **du pur JSON**.  
Contrairement aux fichiers `.aep` d'After Effects (binaires opaques impossibles à versionner sous Git), un fichier `.ecproj` peut être inspecté, généré par programme, édité à la volée ou comparé via un simple `git diff`.

### Exemple de Structure Minimale d'un Projet `.ecproj` :

```json
{
  "version": 1,
  "project": {
    "name": "ForensicInvestigation",
    "compositions": [
      {
        "id": "comp_01",
        "name": "RujaIgnatova_Timeline",
        "width": 1920,
        "height": 1080,
        "fps": 25.0,
        "duration": 5.0,
        "layers": [
          {
            "id": "layer_bg",
            "name": "Solid_DarkBackground",
            "type": "solid",
            "color": [0.03, 0.04, 0.06, 1.0],
            "transform": {
              "position": [960.0, 540.0, 0.0],
              "scale": [100.0, 100.0, 100.0],
              "opacity": 100.0
            }
          },
          {
            "id": "layer_title",
            "name": "Title_AthensDeparture",
            "type": "text",
            "text": "OCTOBRE 2017 — SOFIA / ATHÈNES",
            "fontSize": 54.0,
            "fillColor": [0.88, 0.95, 1.0, 1.0],
            "transform": {
              "position": [960.0, 480.0, 0.0],
              "opacity": {
                "keyframes": [
                  { "time": 0.0, "value": 0.0 },
                  { "time": 0.6, "value": 100.0, "ease_out": [0.25, 0.1, 0.25, 1.0] }
                ]
              }
            },
            "effects": [
              {
                "match_name": "ADBE Drop Shadow",
                "enabled": true,
                "params": {
                  "distance": 8.0,
                  "softness": 12.0,
                  "opacity": 0.75
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
```

---

## 🤖 4. Référence Complète des 22 Outils MCP (`effectcraft`)

Antigravity communique avec EffectCraft via l'exécutable `effectcraft-cli mcp` branché sur ses entrées/sorties standard (stdio).

### Tableau des Outils MCP :

| Outil MCP | Paramètres Principaux | Description & Rôle |
|---|---|---|
| `get_project` | *aucun* | Récupère la structure globale du projet (arborescence des comps et layers). |
| `get_comp` | `comp_id` (string) | Inspecte une composition (résolution, FPS, durée, liste ordonnée des calques). |
| `get_layer` | `layer_id` (string) | Détaille un calque spécifique (nom, type, état de verrouillage/visibilité, propriétés). |
| `get_property` | `layer_id`, `prop_path` | Lit la valeur actuelle ou inspecte les clés d'une propriété (`transform.position`, etc.). |
| `set_property` | `layer_id`, `prop_path`, `value`, `expression` | Assigne une valeur numérique/vectorielle ou une expression After Effects. |
| `add_keyframe` | `layer_id`, `prop_path`, `time`, `value`, `ease_in`, `ease_out` | Ajoute une clé d'animation avec courbes d'interpolation Bézier. |
| `add_effect` | `layer_id`, `match_name`, `params` | Applique un effet GPU parmi les 306 effets disponibles. |
| `list_effects` | `category` (optionnel) | Liste exhaustive des 306 effets visuels classés par catégorie. |
| `list_fonts` | *aucun* | Liste les polices typographiques disponibles dans le système. |
| `get_state` | *aucun* | Renvoie la position de la tête de lecture, la sélection active et le statut général. |
| `render_frame` | `time` (secondes), `out_path` | Génère un rendu PNG instantané d'une frame à un instant précis. |
| `render_preview`| `start_time`, `end_time`, `fps` | Rend une courte séquence de prévisualisation basse résolution. |
| `open_project` | `path` (chemin vers `.ecproj`) | Charge un fichier projet existant dans le moteur. |
| `save_project` | `path` (chemin vers `.ecproj`) | Sauvegarde l'état courant vers le disque. |
| `command_list` | *aucun* | Liste les 669 commandes internes enregistrées dans le moteur. |
| `command_run` | `id` (string), `args` (object) | Exécute une commande interne native (`comp.new`, `layer.new_solid`, `layer.new_text`, etc.). |
| `command_batch`| `commands` (array d'objets) | Exécute une séquence de commandes internes de manière atomique. |
| `batch` | `operations` (array) | Regroupe plusieurs opérations MCP sans surcoût d'allers-retours. |
| `undo` / `redo`| *aucun* | Annule ou rétablit la dernière action dans l'historique du projet. |
| `history` | *aucun* | Affiche la pile d'historique complète. |
| `script_ui` | `script` (string) | Exécute un script d'interface ou d'automatisation. |
| `doc_inspect` | `topic` (string) | Interroge la documentation interne du moteur. |

---

## 🎨 5. Moteur d'Expressions & Effets Visuels

### 1. Support des Expressions After Effects
EffectCraft intègre un interpréteur ECMAScript complet capable d'exécuter la plupart des expressions classiques d'After Effects :

* **Wiggle (Tremblement documentaire / caméra portée) :**
  ```javascript
  wiggle(3, 15) // 3 fois par seconde, amplitude de 15 pixels
  ```
* **Rotation continue mécanique :**
  ```javascript
  time * 45 // 45 degrés par seconde
  ```
* **Pulsation d'opacité ou de lueur néon :**
  ```javascript
  Math.sin(time * 6) * 20 + 80 // Oscillation fluide entre 60% et 100%
  ```
* **Interpolation linéaire conditionnelle :**
  ```javascript
  linear(time, 1.0, 2.5, 0, 100)
  ```

### 2. Bibliothèque des 306 Effets Visuels
Les effets sont organisés en catégories professionnelles :
* **Glow & Lueur :** `ADBE Glow2` (éclat de néon cyan, seuil, rayon d'intensité).
* **Flous & Netteté :** `ADBE Fast Blur`, `ADBE Directional Blur`, `ADBE Gaussian Blur`.
* **Ombres & Détourage :** `ADBE Drop Shadow` (fondus d'ombre cinématographique), `Matte Choker`.
* **Étalonnage & Teinte :** `ADBE Color Balance`, `ADBE Hue/Saturation`, `ADBE Curves`.
* **Distorsion & Synthèse :** `ADBE Turbulent Displace`, `ADBE Displacement Map`, `Glow`.

---

## 💻 6. Guide des Commandes CLI EffectCraft

La ligne de commande `effectcraft-cli` permet de tout exécuter en mode headless sur un serveur ou une station sans écran :

### 1. Vérification & Diagnostic
```bash
# Vérifier la version et les métadonnées :
./tools/effectcraft/bin/effectcraft-0.8.0-linux-x86_64/bin/effectcraft-cli --version

# Lister les informations du moteur et l'état des composants :
./tools/effectcraft/bin/effectcraft-0.8.0-linux-x86_64/bin/effectcraft-cli info --demo
```

### 2. Rendu d'une Frame PNG (Contrôle Qualité IA)
```bash
./tools/effectcraft/bin/effectcraft-0.8.0-linux-x86_64/bin/effectcraft-cli render-frame \
    --project scene.ecproj \
    --time 2.0 \
    --out preview_frame_002s.png
```
*Temps moyen constaté : ~160 ms en Full HD 1080p.*

### 3. Rendu Vidéo Final (MP4 Standard ou ProRes 4444 Alpha)
```bash
# Rendu Master H.264 standard pour la piste V1_MAIN :
./tools/effectcraft/bin/effectcraft-0.8.0-linux-x86_64/bin/effectcraft-cli render \
    --project scene.ecproj \
    --comp "MainComp" \
    --fps 25 \
    --out master_animation.mp4

# Rendu avec Canal Alpha (Transparence totale) pour V2_OVERLAYS / V3_TITLES :
./tools/effectcraft/bin/effectcraft-0.8.0-linux-x86_64/bin/effectcraft-cli render \
    --project scene.ecproj \
    --comp "TitleOverlay" \
    --fps 25 \
    --format prores4444 \
    --out master_overlay.mov
```

---

## 🎬 7. Intégration dans le Pipeline YouTube *Financial Forensics*

EffectCraft s'insère à la perfection dans notre architecture à 7 pistes de montage :

```text
┌────────────────────────────────────────────────────────────────────────┐
│ TIMELINE KDENLIVE (1920x1080 @ 25.0 FPS)                               │
├──────────────┬─────────────────────────────────────────────────────────┤
│ V3_TITLES    │ Titres, dates & lieux EffectCraft en ProRes 4444 Alpha  │
│ V2_OVERLAYS  │ Cartes d'indices, HUD, plexus d'argent blanchi (Alpha) │
│ V1_MAIN      │ Plans d'ouverture, B-Roll, 3D Blender, Master Anim      │
├──────────────┼─────────────────────────────────────────────────────────┤
│ A1_VOICE     │ Voix off ElevenLabs synchronisée mot-à-mot (Whisper)    │
│ A2_MUSIC     │ Fond sonore continu mixé à -18 dBFS                     │
│ A3_SFX       │ Whooshes, frappes clavier mécanique, clics photo (0 dB) │
│ A4_SEC_AUDIO │ Extraits audio d'archives réelles                       │
└──────────────┴─────────────────────────────────────────────────────────┘
```

### Workflow Recommandé pour l'Agent IA :
1. **Création de la scène :** L'agent conçoit le projet soit via les outils MCP (`comp.new`, `layer.new_*`, `add_effect`, `add_keyframe`), soit en générant directement le fichier JSON `.ecproj`.
2. **Vérification visuelle :** L'agent exporte une frame avec `render_frame` à l'instant du reveal clé (ex: `time = 1.5s`) et vérifie le cadrage et le contraste.
3. **Rendu vidéo master :** L'agent lance le rendu CLI à la cadence stricte de **25.0 FPS**.
4. **Insertion Timeline :** Le fichier résultant est inséré sur la piste `V2_OVERLAYS` ou `V3_TITLES` dans le conducteur de montage OTIO.
