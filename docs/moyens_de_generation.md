# 🎨 Moyens de Génération & Arsenal Visuel — Financial Forensics

> **Source de Vérité Stratégique & Technique** pour la création visuelle, graphique et cinématique de la chaîne.  
> Ce document définit la doctrine de production, l'inventaire des 6 piliers de génération, la matrice d'arbitrage (IA vs Code vs 3D) et les commandes d'exécution.

---

## 🏛️ 1. Doctrine Visuelle : L'Arsenal Hybride

Les enquêtes de *Financial Forensics* exigent une rigueur chirurgicale. Les vidéos produites ne doivent **jamais** ressembler à du "slop IA" générique (personnages inconsistants aux visages déformés, mouvements mous sans physique).  
À l'inverse, l'animation manuelle pure est trop lente pour un rythme de publication YouTube soutenu.

Notre solution est un **arsenal hybride modulaire à 6 piliers** où chaque outil est assigné à son domaine de supériorité absolue :

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          ARSENAL DE GÉNÉRATION FINANCIAL FORENSICS                     │
├────────────────────────┬─────────────────────────┬─────────────────────────────────────┤
│ 1. REMOTION (React/TS) │ 2. EFFECTCRAFT (Rust)   │ 3. HYPERFRAMES (Web Native)         │
│ • Titres & Repères HUD │ • 306 Effets GPU & VFX  │ • Kinetic Typography                │
│ • Fiches Preuves V2    │ • Expressions After Eff.│ • UI/Web Slams & Recuts             │
│ • Location Cards       │ • Rendu ProRes 4444 A.  │ • Contact Sheets & Snapshots        │
│ • Overlays ProRes Alpha│ • MCP Natif (22 Outils) │ • Code HTML/CSS/Canvas léger        │
├────────────────────────┼─────────────────────────┼─────────────────────────────────────┤
│ 4. BLENDER 3D (EEVEE)  │ 5. VIDÉO & IMAGE IA     │ 6. AUDIO & CONFORMATION             │
│ • Forensic Cross-Sect. │ • Google Flow (Illimité)│ • ElevenLabs TTS HD                 │
│ • Maquettes ArchViz    │ • Seedance 2.5 (B-roll) │ • Groq Whisper (Sync mot-à-mot)     │
│ • Cuves & Siphonnages  │ • Storyboards & Décors  │ • Banque SFX Calée Frame 0          │
│ • Effondrements 3D     │ • Calibration 25fps     │ • OpenTimelineIO -> Kdenlive        │
└────────────────────────┴─────────────────────────┴─────────────────────────────────────┘
```

---

## 🧭 2. Matrice Stratégique d'Arbitrage : Quel Outil Choisir ?

| Type de Séquence ou d'Asset | Outil Recommandé | Alternative | Format de Sortie | Piste Kdenlive |
|---|---|---|---|---|
| **Date, Lieu, Chiffre clé choc** | `scripts/generate_title_card.py` (Remotion) | Hyperframes | ProRes 4444 Alpha (.mov) | `V3_TITLES` |
| **Bâtiment clé, siège, photo d'archive (Style Furtif)** | `scripts/generate_location_card.py` (Remotion) | EvidenceCard | ProRes 4444 Alpha (.mov) ou MP4 | `V2_OVERLAYS` ou `V1_MAIN` |
| **Photo de suspect / Pièce à conviction** | `scripts/generate_evidence_card.py` (Remotion) | LocationCard | ProRes 4444 Alpha (.mov) | `V2_OVERLAYS` |
| **Billboard d'ouverture / Grand Titre d'Épisode** | `scripts/generate_main_title.py` (Remotion) | LedgerTitleSequence | H.264 MP4 ou ProRes (.mov) | `V1_MAIN` |
| **Titre de chapitre / Découpage d'acte** | `scripts/generate_chapter_card.py` (Remotion) | TitleCard | ProRes 4444 Alpha (.mov) | `V2_OVERLAYS` |
| **Flux de capitaux abstrait, blanchiment, réseau** | EffectCraft (Effets GPU, Glow, Tracés animés) | Remotion Three.js | ProRes 4444 Alpha (.mov) / MP4 | `V1_MAIN` ou `V2_OVERLAYS` |
| **Compositing Motion, VFX 2D, HUD & Particules** | EffectCraft CLI / MCP (306 effets After Effects) | Remotion Canvas | ProRes 4444 Alpha (.mov) | `V2_OVERLAYS` |
| **Kinetic typography / Slams de texte / UI Web** | Hyperframes (`videos/test-kinetic-slam/`) | Remotion | MP4 / ProRes Alpha | `V1_MAIN` ou `V3_TITLES` |
| **Coupe transversale 3D (Cross-section, coffre, tunnel)** | `scripts/generate_ftx_forensic_diorama.py` (Blender 3D) | Remotion Three.js | H.264 MP4 1080p 25fps | `V1_MAIN` |
| **Effondrement architectural / Maquette détruite** | `scripts/generate_collapse_cinematic_cut.py` (Blender + FFMPEG) | IA Vidéo (Runway/Seedance) | H.264 MP4 | `V1_MAIN` |
| **Plan d'ambiance lent (couloir désert, fumée, nuit)** | Google Flow MCP / Seedance 2.5 (`calibrate_h01_google_flow.py`) | Stock footage | H.264 MP4 1080p 25fps calibré | `V1_MAIN` |
| **Horloge physique, trotteuse, cadran temporel exact** | Stock footage réel + Découpe FFmpeg | ❌ Interdit en IA Vidéo | MP4 HD | `V1_MAIN` |

---

## 🛠️ 3. Détail des Moyens de Génération

---

### PILIER 1 : Remotion — Motion Design Programmatique & Overlays Alpha

* **Emplacement :** `financial-forensics/`
* **Technologies :** React 19, TypeScript, Three.js, `@react-three/fiber`, Tailwind CSS.
* **Forces :** Déterminisme total, synchronisation audio frame par frame, export natif en transparence Apple ProRes 4444 (`yuva444p10le`).

#### Scripts d'Automatisation Python Clés :
1. **`scripts/generate_title_card.py`** : Titres cinéma date & lieu, son de clavier mécanique calé mot à mot.
2. **`scripts/generate_location_card.py`** : Cartes de lieux vintage (style *Furtif*), passe-partout ivoire, badge de montant (`32 MILLIARDS $`), tilt 3D et ombres cinéma.
3. **`scripts/generate_evidence_card.py`** : Fiches suspects flottantes (`clean`, `print`, `soft`) avec clic d'obturateur photo iPhone calé frame 0.
4. **`scripts/generate_chapter_card.py`** : Titres de parties avec grande colonne lumineuse cyan et séparateur vertical.
5. **`scripts/generate_main_title.py`** : Grand titre or monumental avec travelling arrière et whoosh pur.
6. **`scripts/generate_subscribe_cta.py`** : Animation YouTube clics et cloche réactive.

#### Commande d'Exécution Remotion :
```bash
# Lancer le studio de prévisualisation dans le navigateur :
cd financial-forensics && npm run start

# Rendre une composition en ligne de commande :
npx remotion render src/index.ts LocationCard out/location.mov --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le
```

---

### PILIER 2 : EffectCraft — Studio After Effects en Rust Pur & Serveur MCP Natif

* **Emplacement :** `tools/effectcraft/bin/effectcraft-0.8.0-linux-x86_64/bin/`
* **Technologies :** Moteur Rust pur (GPU wgpu/Vulkan), expressions After Effects, 306 effets intégrés, codecs natifs (Apple ProRes 4444 Alpha, H.264, AV1, Lottie JSON).
* **Forces :** 100 % natif Linux (aucun Wine, aucun FFmpeg externe, vitesse d'exécution C/Rust), serveur MCP stdio 22 outils pour manipulation automatisée par l'IA, projets `.ecproj` en format JSON déclaratif diffable sous Git, rendu de frame PNG en ~160ms et export vidéo complet en quelques secondes.
* **Skill Associé :** [`.agents/skills/effectcraft-motion/SKILL.md`](file:///.agents/skills/effectcraft-motion/SKILL.md).
* **Documentation Dédiée :** [`docs/EFFECTCRAFT_MOTION_ET_MCP.md`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/docs/EFFECTCRAFT_MOTION_ET_MCP.md).

#### Capacités Clés :
* **Compositing 2D/3D & Graph Editor :** Courbes de Bézier précises, parents hiérarchiques, modes de fusion, motion blur natif.
* **306 Effets Visuels :** Glow, Fast Blur, Drop Shadow, Color Correction, Distort, Stylize, Channel, Matte.
* **Support des Expressions After Effects :** `wiggle(2, 30)`, `time * 90`, `Math.sin(time * 3) * 50`, variables temporelles dynamiques.
* **Transparence Native ProRes 4444 :** Export direct des overlays pour les pistes `V2_OVERLAYS` et `V3_TITLES`.

#### Commandes d'Exécution EffectCraft :
```bash
# 1. Lancer l'interface graphique en arrière-plan :
./tools/effectcraft/bin/effectcraft.AppImage &

# 2. Inspecter les effets et les commandes CLI :
./tools/effectcraft/bin/effectcraft-0.8.0-linux-x86_64/bin/effectcraft-cli info --demo

# 3. Rendre une frame PNG de contrôle (en ~160ms) :
./tools/effectcraft/bin/effectcraft-0.8.0-linux-x86_64/bin/effectcraft-cli render-frame \
    --project mon_projet.ecproj \
    --time 1.5 \
    --out preview.png

# 4. Rendre une vidéo complète (1080p 25 FPS Master) :
./tools/effectcraft/bin/effectcraft-0.8.0-linux-x86_64/bin/effectcraft-cli render \
    --project mon_projet.ecproj \
    --comp "CompName" \
    --fps 25 \
    --out master.mp4
```

---

### PILIER 3 : Hyperframes — Framework Web-Native Motion Graphics

* **Emplacement :** `videos/test-kinetic-slam/`, `videos/design1-reproduction/`, `videos/design2-passo-reproduction/`, `docs/community-references/hyperframes`.
* **Technologies :** HTML5, CSS moderne, Canvas, Web Animations API, Node CLI.
* **Forces :** Rendu vidéo ultra-léger basé sur les standards web, parfait pour les kinetic typographies percutantes, les animations de données textuelles et les vidéos explicatives SaaS/produit. Génère des contact sheets automatiques pour valider chaque seconde d'animation.

#### Commandes d'Exécution Hyperframes :
```bash
# 1. Lancer la prévisualisation Studio en arrière-plan :
cd videos/test-kinetic-slam && npx hyperframes preview --background

# 2. Vérifier le statut de l'écouteur :
npx hyperframes preview --status

# 3. Lancer la validation complète (lint + layout + contraste) :
npm run check

# 4. Rendre la vidéo finale en MP4 :
npm run render
```

---

### PILIER 4 : Blender 3D — Coupes Médico-Légales & Modélisation ArchViz

* **Emplacement :** `scripts/generate_ftx_forensic_diorama.py`, `scripts/generate_collapse_cinematic_cut.py`, `scripts/generate_ftx_collapse_scene.py`.
* **Technologies :** Blender 4.x via MCP & BPY, moteur temps réel EEVEE ou Cycles, shaders procéduraux Dark Clay & Neon Glow, Blueprint HUD lines.
* **Forces :** Représentation tridimensionnelle des mécanismes de fraude invisibles (coupe transversale de bâtiments, chambres fortes dissimulées, tuyaux clandestins de siphonnage de fonds, effondrements volumétriques).
* **Skills Associés :** 
  * [`.agents/skills/blender-schematic-cross-section/SKILL.md`](file:///.agents/skills/blender-schematic-cross-section/SKILL.md)
  * [`.agents/skills/blender-archviz/SKILL.md`](file:///.agents/skills/blender-archviz/SKILL.md)

#### Commandes d'Exécution Blender :
```bash
# 1. Rendre le diorama médico-légal FTX (Surface Nassau + Sous-sol Coffre $8.9B) :
blender -b -P scripts/generate_ftx_forensic_diorama.py -- \
    --output "episodes/02-ftx/assets/custom-graphics/ftx_diorama_cross_section.png"

# 2. Générer la vidéo de coupe avec animation de caméra :
.venv/bin/python scripts/generate_ftx_forensic_diorama_video.py

# 3. Générer le montage cinématique d'effondrement architectural récursif :
.venv/bin/python scripts/generate_collapse_cinematic_cut.py
```

---

### PILIER 5 : Vidéo & Image IA — Google Flow & Seedance 2.5

* **Technologies :** 
  * **Google Flow** via `scripts/google-flow-mcp` (Labs Google AI Pro, modèles Veo/Imagen).
  * **ByteDance Seedance 2.5** via SnapGen API (`sd-2-5-lower`, 720p/1080p, 24fps).
* **Forces :** Génération d'images illimitée et gratuite (sans consommer le pool mensuel Flow), plans B-roll atmosphériques impossibles à trouver en stock (extinction de néons dans des fermes de serveurs, couloirs nocturnes abandonnés).
* **Skill Associé :** [`.agents/skills/google-flow-generate/SKILL.md`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/.agents/skills/google-flow-generate/SKILL.md).
* **Documentation Complète :** [GOOGLE_FLOW_MCP.md](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/docs/GOOGLE_FLOW_MCP.md).

#### Scripts Clés :
* `scripts/calibrate_video.py` : **Calibrateur universel** pour toute vidéo brute vers la norme 1080p 25 FPS Kdenlive (modes `fill` ou `fit`, CRF 18, audio 48kHz).
* `episodes/02-ftx/scripts/calibrate_h01_google_flow.py` : Calibre et raboute automatiquement deux plans successifs (ex: Vue aérienne + Porte d'entrée = 3.00s).
* `episodes/02-ftx/scripts/generate_seedance_video.py` : Lance une génération Seedance guidée par image de départ (`@image1`).
* `episodes/02-ftx/scripts/poll_and_download.py` : Surveille en tâche de fond le statut de rendu et télécharge l'asset dès qu'il est prêt.

#### Commandes d'Exécution :
```bash
# Calibrer n'importe quelle vidéo brute vers la norme 1080p 25 FPS :
.venv/bin/python scripts/calibrate_video.py <video_brute.mp4>

# Calibrer et assembler deux plans successifs sur une durée précise :
.venv/bin/python episodes/02-ftx/scripts/calibrate_h01_google_flow.py \
    --clip-a "episodes/02-ftx/assets/flow/shot_aerial.mp4" \
    --clip-b "episodes/02-ftx/assets/flow/shot_entrance.mp4" \
    --out "episodes/02-ftx/assets/generated-videos/H01_stakeout_3s_1080p.mp4"
```

---

### PILIER 6 : Audio, Transcription & Conformation Automatisée

* **Technologies :** ElevenLabs API, Groq Whisper (timestamps word-level), OpenTimelineIO, Kdenlive.
* **Forces :** Conformation automatique d'une timeline 7 pistes en moins de 5 secondes, synchronisation absolue de chaque mot dit avec les reveals graphiques.

#### Pipeline en 4 Étapes :
```bash
# 1. Génération de la voix off d'enquête :
.venv/bin/python scripts/generate_voiceover.py --script "episodes/02-ftx/tts/voiceover.txt"

# 2. Transcription mot-à-mot Whisper :
.venv/bin/python scripts/transcribe.py --audio "episodes/02-ftx/tts/voiceover.mp3"

# 3. Génération du conducteur de montage :
.venv/bin/python scripts/build_cutting_script.py --episode "02-ftx"

# 4. Conformation automatique de la timeline OTIO vers Kdenlive :
.venv/bin/python scripts/agent_otio.py --episode "02-ftx"
```

---

## 📐 4. Structure Standard de la Timeline (Architecture 7 Pistes)

Toute création issue de nos générateurs s'insère strictement dans l'architecture 7 pistes Kdenlive / OTIO :

```text
┌────────────────────────────────────────────────────────────────────────┐
│ VIDÉO                                                                  │
├──────────────┬─────────────────────────────────────────────────────────┤
│ V3_TITLES    │ Title Cards, dates, lieux, chiffres ($5M), sous-titres  │
│ V2_OVERLAYS  │ Location Cards, Evidence Cards, Chapitres (ProRes Alpha)│
│ V1_MAIN      │ B-Roll, Stock Footage, Grand Titre, Dioramas 3D Blender │
├──────────────┼─────────────────────────────────────────────────────────┤
│ AUDIO        │                                                         │
├──────────────┼─────────────────────────────────────────────────────────┤
│ A1_VOICE     │ Voix off principale (respiration au Grand Titre)        │
│ A2_MUSIC     │ Musique de fond continue (-18 dBFS, mixée sans coupure) │
│ A3_SFX       │ Whooshes purs, frappes clavier, déclencheurs photo (0dB)│
│ A4_SEC_AUDIO │ Témoignages réels, interviews d'archives, son direct   │
└──────────────┴─────────────────────────────────────────────────────────┘
```
