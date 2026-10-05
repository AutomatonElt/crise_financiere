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
| **ImageMagick** | `/usr/bin/convert` | Manipulation d'images |
| **Cavalry 2D (Motion Design & MCP)** | `cavalry` (ou `~/.local/bin/cavalry`) | Animation 2D procédurale nodale (Wine 9.0 + MCP sur port 6768) |

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

## ⚡ Cavalry 2D — Motion Design Procédural & Serveur MCP

| Élément | Détail |
|---|---|
| **Rôle** | Motion design 2D nodal procédural (duplicators, oscillateurs, typographie dynamique) |
| **Emplacement Wine** | `/home/mbogneng-junior/.cavalry` |
| **Commande de lancement** | `cavalry` (ou depuis le menu d'applications Ubuntu) |
| **Serveur MCP embarqué** | `http://localhost:6768/sse` (automatique au démarrage) |
| **Documentation complète** | Voir [CAVALRY_LINUX_SETUP_ET_MCP.md](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/docs/CAVALRY_LINUX_SETUP_ET_MCP.md) |

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




