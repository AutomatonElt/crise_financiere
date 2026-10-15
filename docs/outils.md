# Outils de montage — Inventaire général & Environnement

> **RÈGLE CRITIQUE POUR LES AGENTS :** 
> Tous les outils et bibliothèques sont **DÉJÀ INSTALLÉS** dans l'environnement local.
> **NE JAMAIS RÉINSTALLER** les packages à zéro. Utilisez directement les chemins ci-dessous.

---

## 📍 Chemins d'accès et Environnements (Source de Vérité)

| Composant | Chemin absolu / Commande | Notes |
|---|---|---|
| **Python Virtualenv** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/.venv/bin/python` | Environnement principal avec toutes les libs |
| **Pip Virtualenv** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/.venv/bin/pip` | Gestionnaire de paquets du venv |
| **Remotion (Projet)** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/financial-forensics` | Projet React 19 + TypeScript + Remotion |
| **Node.js** | `/home/mbogneng-junior/.nvm/versions/node/v22.22.1/bin/node` (v22.22.1) | Runtime Node |
| **FFmpeg / FFprobe** | `/usr/bin/ffmpeg` & `/usr/bin/ffprobe` (v6.1.1) | Encodage, manipulation vidéo/audio |
| **Kdenlive** | `flatpak run org.kde.kdenlive` (v26.04.3) | Montage NLE principal |
| **Google Flow (Images & Vidéos IA MCP)** | `scripts/google-flow-mcp/` & CDP `127.0.0.1:9222` | Génération IA gratuite illimitée (images) & Veo 3.1 (vidéo) via profil Chrome dédié `~/.config/google-chrome-flow` |
| **EffectCraft (After Effects Rust & MCP)** | `tools/effectcraft/bin/effectcraft-0.8.0-linux-x86_64/bin/` | Studio After Effects en pur Rust (306 effets, ProRes 4444 Alpha, Lottie, serveur MCP natif 22 outils `effectcraft-cli mcp`) |

---

## 📦 Bibliothèques Python Installées dans `.venv`

Toutes ces bibliothèques sont installées et opérationnelles dans `.venv` :
* **`opentimelineio`** (0.18.1) : Gestion et conformation des timelines Kdenlive.
* **`pillow`** (12.3.0) : Génération et traitement d'images/overlays frame-by-frame.
* **`numpy`** (2.5.2) & **`scipy`** (1.18.0) : Traitement de signal et synthèse audio.
* **`soundfile`** (0.14.0) : Lecture et écriture de fichiers audio WAV.
* **`elevenlabs`** (2.62.0) : Génération TTS voix off avec Request Stitching.
* **`groq`** (1.6.0) : Transcription Whisper haute précision mot par mot.
* **`requests`** (2.34.2) : Appels API externes.
* **`python-dotenv`** (1.2.2) : Chargement des variables d'environnement (`.env`).

---

## 🔊 État des Banques SFX (`_shared/sfx/`)

* **Whoosh (`_shared/sfx/whoosh/`)** : ✅ **VALIDÉ** (transitions structurelles et sauts de chapitres).
* **Typing Clavier (`_shared/sfx/typing/`)** : ✅ **VALIDÉ** (fichier `soumages-keyboard-typing-579122.mp3` avec 48 frappes découpées et calées mot par mot).
* **Camera Shutter (`_shared/sfx/camera-shutter/`)** : ✅ **VALIDÉ** (`79190__nathan_lomeli__iphone-camera-click.wav`, déclencheur net calé à -0.9 dBFS dès la 1ère frame).
* **Beat Stabs (`_shared/sfx/beats/`)** : En cours de validation.

---

## 🎬 Remotion — Animations programmatiques (`financial-forensics/`)

| Élément | Détail |
|---|---|
| **Emplacement** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/financial-forensics` |
| **Runtime** | Node.js v22.22.1 + npm / npx |
| **Framework** | React 19 + TypeScript 5.9 |
| **Stack visuelle** | Three.js + @react-three/fiber + react-simple-maps |
| **Commandes** | `npm run start` (studio preview) · `npx remotion render ...` (export) |

---

## ⚡ EffectCraft — Studio After Effects en Pur Rust & Serveur MCP Natif

EffectCraft remplace intégralement les anciens workflows After Effects / Cavalry sous Linux. C'est un moteur de Motion Design et compositing moderne écrit à 100 % en pur Rust, sans Wine, sans FFmpeg et sans dépendance propriétaire.

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              ARCHITECTURE EFFECTCRAFT LINUX                            │
├────────────────────────────────┬───────────────────────────────────────────────────────┤
│ 1. INTERFACE GRAPHIQUE (EGUI)  │ 2. MOTEUR HEADLESS & CLI (RUST PUR)                   │
│ • AppImage : tools/.../AppImage│ • Binaire CLI : tools/.../bin/effectcraft-cli         │
│ • Panels After Effects natifs  │ • Serveur MCP stdio (22 outils pour Antigravity)      │
│ • Graph Editor & Timeline      │ • Moteur d'export natif : ProRes 4444 Alpha, H.264...  │
│ • 306 effets GPU / Expressions │ • Fichier projet JSON diffable (.ecproj)              │
└────────────────────────────────┴───────────────────────────────────────────────────────┘
```

### Chemins Absolus & Environnement :

| Élément | Chemin absolu / Valeur | Rôle |
|---|---|---|
| **Dossier Outil** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/tools/effectcraft/` | Répertoire d'installation local |
| **Application GUI (AppImage)** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/tools/effectcraft/bin/effectcraft.AppImage` | Lancement de l'interface graphique de bureau |
| **Application GUI (Binaire)** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/tools/effectcraft/bin/effectcraft-0.8.0-linux-x86_64/bin/effectcraft` | Binaire natif Linux x86_64 |
| **CLI & Serveur MCP** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/tools/effectcraft/bin/effectcraft-0.8.0-linux-x86_64/bin/effectcraft-cli` | Moteur d'exécution, de rendu et d'automatisation IA |
| **Code Source Officiel** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Logiciels/effectcraft/` | Dépôt Git cloné avec documentation et tests |
| **Documentation dédiée** | [`docs/EFFECTCRAFT_MOTION_ET_MCP.md`](docs/EFFECTCRAFT_MOTION_ET_MCP.md) | Guide complet de manipulation et d'intégration |
| **Skill Agent dédié** | `.agents/skills/effectcraft-motion/SKILL.md` | Directive opérationnelle Antigravity |

### Commandes Clés :

```bash
# 1. Lancer l'interface graphique en arrière-plan :
./tools/effectcraft/bin/effectcraft.AppImage &

# 2. Inspecter l'état et les commandes disponibles (669 commandes) :
./tools/effectcraft/bin/effectcraft-0.8.0-linux-x86_64/bin/effectcraft-cli info --demo

# 3. Rendre une frame PNG instantanée (temps moyen : ~160 ms en 1080p) :
./tools/effectcraft/bin/effectcraft-0.8.0-linux-x86_64/bin/effectcraft-cli render-frame \
    --project mon_projet.ecproj \
    --time 1.5 \
    --out preview.png

# 4. Rendre une vidéo complète (MP4, ProRes 4444 Alpha, AV1, Lottie) :
./tools/effectcraft/bin/effectcraft-0.8.0-linux-x86_64/bin/effectcraft-cli render \
    --project mon_projet.ecproj \
    --comp "NomComp" \
    --fps 25 \
    --out master.mp4
```

---

## ⚙️ Norme de Rendu Standard

| Paramètre | Valeur standard |
|---|---|
| Résolution | **1920×1080** |
| Cadence (FPS) | **25.0 FPS** (standard projet chaîne) |
| Codec vidéo standard | H.264 (libx264, CRF 22) |
| Codec vidéo avec transparence (Alpha) | ProRes 4444 (`prores_ks`, `yuva444p10le`) ou WebM (`libvpx-vp9`, `yuva420p`) |
| Codec audio | AAC ou PCM WAV |
| Pixel format | yuv420p (ou yuva444p10le / yuva420p pour overlays alpha) |

---

## 🚀 Étapes du pipeline de montage
 
```
1. Transcription voix-off     → Groq Whisper (timestamps word-level) via scripts/transcribe.py
2. Génération voix-off        → ElevenLabs via scripts/generate_voiceover.py
3. Conducteur & Mapping       → scripts/build_cutting_script.py
4. Animations Motion Design   → Remotion (financial-forensics/)
5. Overlays vidéo transparents→ ProRes 4444 ou WebM (sur V3_OVERLAYS)
6. Conformation Timeline      → scripts/agent_otio.py -> 01-ruja-ignatova-auto.otio
7. Finition humaine           → Kdenlive
```

---

## 🏷️ Générateur Universel de Titres / Dates & Lieux (`scripts/generate_title_card.py`)

Crée des vidéos transparentes **ProRes 4444 (Canal Alpha total)** avec typographie lourde sans cadre, identité **Bleu Clair / Cyan (`#38BDF8`)** et **Blanc Glacier (`#E0F2FE`)**, son de clavier synchronisé sur chaque lettre et maintien fixe à l'écran (Hold).

### Utilisation en ligne de commande :

```bash
# 1. Exemple standard (Date + Lieu / Sujet fort) :
.venv/bin/python scripts/generate_title_card.py \
    --line1 "OCTOBRE 2017" \
    --line2 "SOFIA — ATHÈNES" \
    --out "episodes/01-ruja-ignatova/assets/custom-graphics/mon_titre.mov"

# 2. Exemple sur 1 seule ligne (Chiffre clé, nom ou date seule) :
.venv/bin/python scripts/generate_title_card.py \
    --line1 "4 MILLIARDS DE DOLLARS" \
    --out "episodes/01-ruja-ignatova/assets/custom-graphics/chiffre_cle.mov"

# 3. Exemple avec temps de maintien personnalisé (hold = 4 secondes) :
.venv/bin/python scripts/generate_title_card.py \
    --line1 "NOVEMBRE 2022" \
    --line2 "BAHAMAS // SIÈGE DE FTX" \
    --hold 4.0 \
    --out "episodes/02-ftx/assets/custom-graphics/titre_ftx.mov"
```

### Options disponibles :
* `--line1` *(obligatoire)* : Texte de la première ligne (haut).
* `--line2` *(optionnel)* : Texte de la deuxième ligne (bas). Si omis, seule la ligne 1 est affichée.
* `--out` *(obligatoire)* : Chemin du fichier `.mov` généré.
* `--hold` *(défaut: 3.0s)* : Temps d'affichage fixe et immobile après la fin de la frappe.
* `--duration` *(optionnel)* : Durée totale forcée (calculée automatiquement si non spécifiée).
* `--speed` *(défaut: 14)* : Vitesse de frappe (caractères par seconde).
* `--color1` *(défaut: #38BDF8)* : Couleur de la ligne 1 (Bleu ciel / cyan lumineux).
* `--color2` *(défaut: #E0F2FE)* : Couleur de la ligne 2 (Blanc glacier teinté).
* `--pos`, `--position` *(défaut: bottom-left)* : Positionnement à l'écran :
  * `bottom-left` *(défaut cinéma standard)*
  * `bottom-right` *(aligné à droite)*
  * `top-left` *(en haut à gauche)*
  * `top-right` *(en haut à droite)*
  * `center` *(centré au milieu de l'écran)*
* `--audio` *(optionnel)* : Fichier audio clavier source (utilise par défaut `soumages-keyboard-typing-579122.mp3`).

---

## 📸 Générateur Universel de Fiches Preuves / Suspects (`scripts/generate_evidence_card.py`)

Crée des fiches visuelles transparentes **ProRes 4444 (Canal Alpha total)** avec photo d'archive ou portrait de suspect, animation vivante continue (micro-dérive organique et slow push-in), déclencheur de caméra iPhone au pop (calé frame 0) et styles configurables.

### Utilisation en ligne de commande :

```bash
# Style Clean (défaut)
.venv/bin/python scripts/generate_evidence_card.py \
    --image "episodes/01-ruja-ignatova/assets/real-footage/fbi-ignatova-wanted-photo.jpg" \
    --style clean \
    --out "episodes/01-ruja-ignatova/assets/texte_card/card_ruja_clean.mov"

# Style Print (passe-partout ivoire d'archive)
.venv/bin/python scripts/generate_evidence_card.py \
    --image "episodes/01-ruja-ignatova/assets/real-footage/fbi-ignatova-wanted-photo.jpg" \
    --style print \
    --out "episodes/01-ruja-ignatova/assets/texte_card/card_ruja_print.mov"

# Style Soft (bords adoucis documentaires)
.venv/bin/python scripts/generate_evidence_card.py \
    --image "episodes/01-ruja-ignatova/assets/real-footage/fbi-ignatova-wanted-photo.jpg" \
    --style soft \
    --out "episodes/01-ruja-ignatova/assets/texte_card/card_ruja_soft.mov"

# Sans son
.venv/bin/python scripts/generate_evidence_card.py \
    --image "episodes/01-ruja-ignatova/assets/real-footage/fbi-ignatova-wanted-photo.jpg" \
    --no-sound \
    --out "episodes/01-ruja-ignatova/assets/texte_card/card_ruja_silent.mov"
```

### Options disponibles :
* `--image` *(obligatoire)* : Chemin de la photo source (JPG, PNG, WebP).
* `--out` *(obligatoire)* : Chemin du fichier vidéo `.mov` généré.
* `--style`, `--border` *(défaut: clean)* : Style visuel :
  * `clean` *(défaut)* : Photo pure flottante avec ombre cinéma profonde, sans bordure artificielle.
  * `print` : Passe-partout élégant ivoire / blanc cassé (`#F4F1EA`) façon tirage argentique d'archive.
  * `soft` : Bords doux estompés sans coupure nette, vignettage progressif et halo vaporeux flottant.
* `--pos`, `--position` *(défaut: right)* : Position à l'écran (`right`, `left`, `center`, `bottom-right`, `bottom-left`).
* `--offset-y` *(défaut: 85)* : Décalage vertical en pixels vers le bas (pour caler la carte en bas).
* `--duration` *(défaut: 5.0s)* : Durée totale de l'overlay en secondes.
* `--width` *(défaut: 520)* : Largeur du cadre en pixels.
* `--sound` / `--no-sound` *(défaut: avec son)* : Déclencheur photo synchronisé à la frame 0.
* `--audio` *(optionnel)* : Fichier audio du déclencheur (utilise `_shared/sfx/camera-shutter/79190__nathan_lomeli__iphone-camera-click.wav`).
* `--fps` *(défaut: 25)* : Cadence d'images (standard chaîne: 25 FPS).

---

## 📖 Générateur Universel de Titres de Chapitres & d'Actes (`scripts/generate_chapter_card.py`)

Crée des titres de parties, chapitres et actes d'enquête transparents **ProRes 4444 (Canal Alpha total)** avec l'identité originale **Financial Forensics** : colonne latérale lumineuse effilée (*Vertical Spine*), micro-badge de classification judiciaire, typographie lourde cinématique, métadonnées aérées et ouverture douce instantanée (sans effet machine à écrire).

### Utilisation en ligne de commande :

```bash
# 1. Titre de chapitre standard (à gauche, avec numéro et tag judiciaire) :
.venv/bin/python scripts/generate_chapter_card.py \
    --num "01" \
    --tag "DISPARITION" \
    --title "THE WOMAN WHO VANISHED WITH $4 BILLION" \
    --subtitle "SOFIA, BULGARIE • OCTOBRE 2017" \
    --pos left \
    --duration 4.5 \
    --out "episodes/01-ruja-ignatova/assets/texte_card/chapter_01_woman_who_vanished.mov"

# 2. Titre centré personnalisé (ex: séquence ou mécanisme) :
.venv/bin/python scripts/generate_chapter_card.py \
    --tag "LE MÉCANISME" \
    --title "HOW THE $4B PONZI ACTUALLY OPERATED" \
    --subtitle "ONECOIN INVESTIGATION" \
    --pos center \
    --accent "#38BDF8" \
    --duration 4.0 \
    --out "episodes/01-ruja-ignatova/assets/texte_card/chapter_mechanism.mov"
```

### Options disponibles :
* `--title` *(obligatoire)* : Titre principal du chapitre.
* `--num`, `--number` *(optionnel)* : Numéro de la partie (ex: `01`, `02`, `I`).
* `--tag` *(défaut: DOSSIER D'ENQUÊTE)* : Tag éditorial supérieur (ex: `DISPARITION`, `LE MÉCANISME`).
* `--subtitle` *(optionnel)* : Sous-titre ou description contextuelle.
* `--pos`, `--position` *(défaut: left)* : Position : `left`, `center`, `right`.
* `--duration` *(défaut: 4.5s)* : Durée totale en secondes.
* `--accent`, `--color` *(défaut: #38BDF8)* : Couleur signature de la colonne et du tag (Cyan Financial Forensics).
* `--title-color` *(défaut: #F8FAFC)* : Couleur du titre (Blanc glacier).
* `--subtitle-color` *(défaut: #94A3B8)* : Couleur du sous-titre (Gris acier).
* `--fps` *(défaut: 25)* : Cadence d'images (25 FPS standard chaîne).
* `--out` *(obligatoire)* : Chemin du fichier `.mov` généré.

---

## 👑 Générateur du Titre Maître d'Épisode (`scripts/generate_main_title.py`)

Crée la séquence monumentale de titre de l'épisode (**Billboard Reveal**) apparaissant une seule fois dans la vidéo (à la fin du Hook) sur fond sombre cinéma immersif sans texte superflu avec typographie gravée or et travelling lent.

### Utilisation en ligne de commande :

```bash
# 1. Variante A - Clean (Or pur sans halo lumineux au centre) :
.venv/bin/python scripts/generate_main_title.py \
    --title "THE CRYPTOQUEEN" \
    --style clean \
    --duration 5.0 \
    --out "episodes/01-ruja-ignatova/assets/texte_card/main_title_cryptoqueen_clean.mp4"

# 2. Variante B - Shimmer (Éclair cinéma / balayage de lumière métallique gauche -> droite) :
.venv/bin/python scripts/generate_main_title.py \
    --title "THE CRYPTOQUEEN" \
    --style shimmer \
    --duration 5.0 \
    --out "episodes/01-ruja-ignatova/assets/texte_card/main_title_cryptoqueen_shimmer.mp4"
```

### Options disponibles :
* `--title` *(obligatoire)* : Grand titre de la vidéo (ex: `THE CRYPTOQUEEN`).
* `--style` *(défaut: shimmer)* : Style visuel : `shimmer` (éclair de lumière cinéma gauche→droite) ou `clean` (or pur sans éclat dynamique).
* `--accent`, `--color` *(défaut: #D4AF37)* : Couleur or signature.
* `--duration` *(défaut: 5.0s)* : Durée totale en secondes.
* `--transparent` *(optionnel)* : Activer pour exporter en transparence ProRes 4444.
* `--sound` / `--no-sound` *(défaut: activé)* : Intègre le son Whoosh cinéma (`whoosh_long.wav`).
* `--whoosh` *(optionnel)* : Chemin d'un effet whoosh personnalisé.
* `--fps` *(défaut: 25)* : Cadence en FPS (standard chaîne: 25).
* `--out` *(obligatoire)* : Chemin du fichier de sortie (`.mp4` ou `.mov`).

---

## 🔔 Générateur du Composant de Fidélisation (`scripts/generate_subscribe_cta.py`)

Crée l'animation interactive YouTube (**Like + S'abonner + Cloche**) avec curseur réactif, retours visuels réactifs (clics, ondes de choc, vibration de sonnerie) et effets sonores intégrés.

### Utilisation en ligne de commande :

```bash
# 1. Version Standard Anglaise (Recommandée pour Financial Forensics) :
.venv/bin/python scripts/generate_subscribe_cta.py \
    --theme classic-red \
    --pos bottom-center \
    --out "episodes/01-ruja-ignatova/assets/texte_card/cta_subscribe_en.mov"

# 2. Version Dark Gold (Signature or & noir) :
.venv/bin/python scripts/generate_subscribe_cta.py \
    --theme dark-gold \
    --pos bottom-right \
    --scale 1.1 \
    --out "episodes/01-ruja-ignatova/assets/texte_card/cta_subscribe_gold.mov"
```

### Options disponibles :
* `--theme` *(défaut: classic-red)* : Thème de couleur : `classic-red`, `dark-gold`, `glass-cyan`.
* `--lang` *(défaut: en)* : Langue des boutons : `en` (`SUBSCRIBE`/`SUBSCRIBED`) ou `fr` (`S'ABONNER`/`ABONNÉ`).
* `--pos`, `--position` *(défaut: bottom-center)* : Position : `bottom-center`, `bottom-right`, `bottom-left`, `center`.
* `--scale` *(défaut: 1.2)* : Échelle d'agrandissement.
* `--duration` *(défaut: 5.0s)* : Durée totale de l'animation en secondes.
* `--fps` *(défaut: 25)* : Cadence en FPS (standard chaîne: 25).
* `--out` *(obligatoire)* : Chemin du fichier de sortie (`.mov` ProRes 4444).

---

## 🎥 Génération Vidéo IA — ByteDance Seedance 2.5 via SnapGen API

Permet de générer des plans vidéo cinématiques (5s, 10s, 15s) à partir d'une image de départ (`@image1`) et d'un prompt textuel détaillé.

* **Script principal :** `episodes/02-ftx/scripts/generate_seedance_video.py`
* **Poller d'arrière-plan résilient :** `episodes/02-ftx/scripts/poll_and_download.py`
* **Modèle recommandé (faible coût) :** `sd-2-5-lower` (mode `lower`, 720p, 24 fps).
* **Coût unitaire :** **10 crédits** SnapGen par séquence de 5 secondes.

### Commande type :

```bash
.venv/bin/python episodes/02-ftx/scripts/generate_seedance_video.py \
    --prompt "Starting from @image1, locked-off camera, no movement. The rows of ceiling light tubes along the corridor switch off one bank after another..." \
    --ref "episodes/02-ftx/assets/image-ai/environments/ENV-03.jpg" \
    --out "episodes/02-ftx/assets/generated-videos/H01_take1.mp4" \
    --duration 5 \
    --model "sd-2-5-lower" \
    --mode "lower"
```

### Surveillance en arrière-plan d'une tâche déjà soumise :

```bash
.venv/bin/python episodes/02-ftx/scripts/poll_and_download.py \
    <UUID_DE_LA_TACHE> \
    "episodes/02-ftx/assets/generated-videos/<NOM_SORTIE>.mp4"
```

### Règles d'arbitrage de production (IA vs Réel) :
1. **Plans d'ambiance et atmosphère (IA recommandée) :** Extinctions de lumières dans des pièces vides, fumée, variations lumineuses lentes, décors sans mouvement temporel critique (ex: Plan H01 couloir de serveurs).
2. **Plans à cadence physique rigoureuse (Footage réel recommandé) :** Mécanismes d'horlogerie, aiguilles de trotteuse battant à 1 seconde par seconde (ex: Plan H02). L'IA a tendance à accélérer ou lisser le temps de manière imprévisible ; un stock HD réel combiné à un bruitage acoustique calé à la frame garantit un tempo impeccable.

---

## 🌐 Google Flow MCP — Génération d'Images & Vidéos IA (Google AI Pro)

Permet de piloter la plateforme de pointe **Google Flow** (`flow.google.com`) par intelligence artificielle directement depuis Antigravity / Claude via le protocole MCP et l'automatisation Chrome DevTools Protocol (CDP).

* **Emplacement du serveur :** `scripts/google-flow-mcp/`
* **Profil Chrome dédié persistant :** `/home/mbogneng-junior/.config/google-chrome-flow`
* **Port de débogage CDP :** `127.0.0.1:9222`
* **Lanceur démon :** `scripts/google-flow-mcp/scripts/ensure-flow-chrome.sh`
* **Compte actif :** `mbognengjunior@gmail.com` (Abonnement **Google AI Pro**)
* **Documentation exhaustive :** Voir [GOOGLE_FLOW_MCP.md](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/docs/GOOGLE_FLOW_MCP.md)
* **Skill Agent dédié :** [`.agents/skills/google-flow-generate/SKILL.md`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/.agents/skills/google-flow-generate/SKILL.md)

### Modèles et Coûts :
* **Images (Nano Banana 2 / Imagen 4) :** **Gratuit & Illimité (0 crédit consommé)** sur Google AI Pro. Génère 2 images simultanées par prompt.
* **Vidéos (Veo 3.1 Lite / Quality, Omni Flash) :** Consomme les crédits mensuels de Flow (~10 crédits pour Veo Lite, ~100 pour Quality). Par défaut, `auto_confirm: false` pour prévisualiser sans consommer.

### Commandes de base :
```bash
# 1. Vérifier ou lancer l'instance Chrome avec CDP 9222 en arrière-plan :
bash scripts/google-flow-mcp/scripts/ensure-flow-chrome.sh

# 2. Vérifier la connectivité CDP :
curl -s http://127.0.0.1:9222/json/version

# 3. Calibrer une vidéo générée pour la timeline standard 1080p 25fps :
.venv/bin/python episodes/02-ftx/scripts/calibrate_h01_google_flow.py \
    --clip-a "episodes/02-ftx/assets/flow/shot_aerial.mp4" \
    --out "episodes/02-ftx/assets/generated-videos/H01_calibrated_1080p25.mp4"
```





