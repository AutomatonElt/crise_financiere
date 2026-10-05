# Arborescence Complète & Guide de Synchronisation Multi-Machines

> **Objectif :** Ce document détaille la structure exacte des répertoires de la chaîne YouTube (*The Ledger / Crime & Finance Forensics*) et explique comment récupérer ou synchroniser l'ensemble du projet et ses médias volumineux sur une deuxième machine.

---

## 1. Arborescence Standard du Projet

Grâce aux fichiers `.gitkeep` suivis par Git, un simple `git clone` sur une nouvelle machine recrée instantanément l'ensemble de l'arborescence ci-dessous, prête à recevoir vos médias :

```text
temp/
├── .agents/                               # Compétences et agents IA (Blender, Remotion, etc.)
├── docs/                                  # Documentation technique, charts et guides
│   ├── CAVALRY_LINUX_SETUP_ET_MCP.md      # Guide Cavalry 2D & configuration MCP
│   ├── GUIDE_MOTION_DESIGN_REMOTION.md    # Guide Remotion React / Three.js
│   ├── PIPELINE_OTIO.md                   # Normes timelines OpenTimelineIO
│   ├── outils.md                          # Inventaire des environnements et outils
│   └── reutilisable/                      # Spécifications modulaires par composant graphique
│       ├── chapter-card/
│       ├── cross-section/
│       ├── document-evidence/
│       ├── evidence-card/
│       ├── forensic-3d-document/
│       ├── ledger-title/
│       ├── ledger-title-sequence/
│       ├── magazine-poster/
│       ├── main-title/
│       ├── status-stamp/
│       ├── subscribe-cta/
│       └── tunnel-drilling/
│
├── _shared/                               # Ressources globales partagées
│   ├── music/                             # Pistes musicales de fond (non suivies sur Git)
│   │   ├── adjusted/                      # Musiques calibrées en volume (-18 dBFS)
│   │   └── suspenses/                     # Ambiances documentaires
│   └── sfx/                               # Banques de bruitages validées
│       ├── camera-shutter/                # Déclencheurs photo
│       ├── typing/                        # Sons de clavier mécanique mot-à-mot
│       └── whoosh/                        # Whooshes de transition
│
├── episodes/                              # Dossier racine des épisodes
│   ├── 01-ruja-ignatova/                  # Épisode 1 : OneCoin
│   │   ├── assets/                        # Rushs, illustrations et graphiques
│   │   │   ├── custom-graphics/           # Animations Remotion générées
│   │   │   ├── footage-animated/          # Plans animés (Runway / Pika / Comfy)
│   │   │   ├── footage-reel/              # Rushs vidéo documentaires bruts
│   │   │   ├── ia-image/                  # Images Midjourney / Nano Banana
│   │   │   ├── ia-video/                  # Clips vidéo générés par IA
│   │   │   ├── real-footage/              # Vraies archives historiques & BBC
│   │   │   └── texte_card/                # Titres et chiffres clés avec SFX
│   │   ├── montage/                       # Mapping visuel et exports de conformation
│   │   ├── transcription/                 # JSON Whisper mot-par-mot (Groq)
│   │   ├── tts/                           # Scripts texte et fichiers voix off ElevenLabs
│   │   └── *.otio / *.kdenlive            # Timelines de montage
│   │
│   ├── 02-ftx/                            # Épisode 2 : FTX / Sam Bankman-Fried
│   │   ├── assets/
│   │   │   ├── image-ai/                  # Générations IA de personnages et décors
│   │   │   ├── real/                      # Pièces à conviction réelles (bilans, arrêtés)
│   │   │   ├── real-footage/              # Archives Nassau / Congrès US
│   │   │   └── stock_video/               # Rushs d'ambiance
│   │   ├── scripts/                       # Scripts de génération spécifiques FTX
│   │   ├── transcription/                 # Transcriptions synchronisées
│   │   └── tts/                           # Voix off de l'épisode
│   │
│   ├── 03-madoff/                         # Épisode 3 : Bernard Madoff
│   ├── 04-theranos/                       # Épisode 4 : Elizabeth Holmes / Theranos
│   ├── 05-lottery/                        # Épisode 5 : Braquage de la loterie
│   └── 06-frank-bourassa/                 # Épisode 6 : Le faussaire aux 250M$
│
├── financial-forensics/                   # Projet Remotion (React 19 + TypeScript)
│   ├── public/                            # Éléments graphiques statiques légers (logos, plaques)
│   │   ├── brand/                         # Logo officiel doré, plaques laiton, clean plates
│   │   └── ftx_real/                      # Références visuelles
│   └── src/                               # Code source des compositions d'animation
│       ├── Root.tsx                       # Registre des compositions
│       ├── components/                    # Composants réutilisables (Flowchart, CaseFile...)
│       └── compositions/                  # Scènes montées (LedgerTitleSequence, etc.)
│
├── scripts/                               # Outils Python automatisés du pipeline
│   ├── agent_otio.py                      # Conformation automatique OTIO
│   ├── build_cutting_script.py            # Générateur de conducteur de montage
│   ├── generate_ledger_title_sequence.py  # Titre signature 3 phases The Ledger
│   ├── generate_voiceover.py              # Synthèse vocale ElevenLabs
│   ├── transcribe.py                      # Transcription Whisper word-level
│   └── ...                                # Générateurs d'evidence, stamps, posters
│
├── .gitignore                             # Règles d'exclusion des médias lourds
└── README.md                              # Présentation du projet
```

---

## 2. Déploiement sur une Nouvelle Machine (Machine B)

### Étape 1 : Cloner le code depuis GitHub
Sur votre deuxième machine :
```bash
git clone https://github.com/AutomatonElt/crise_financiere.git
cd crise_financiere
```
*Tous les dossiers de l'arborescence sont créés automatiquement.*

### Étape 2 : Installer les dépendances de code

1. **Environnement virtuel Python :**
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install opentimelineio pillow numpy scipy soundfile elevenlabs groq requests python-dotenv
```

2. **Projet Remotion (Motion Design) :**
```bash
cd financial-forensics
npm install
cd ..
```

---

## 3. Comment Récupérer et Synchroniser les Médias Lourds

Puisque les fichiers vidéo (`.mp4`), audio (`.mp3`, `.wav`) et rushs lourds sont conservés localement sans saturer GitHub, voici les **3 méthodes recommandées** pour les transférer de Machine 1 vers Machine 2 :

### Méthode 1 (La plus rapide : En réseau local via `rsync`)
Si les deux machines sont sur le même réseau WiFi ou câble Ethernet :

Sur **Machine 2**, lancez cette commande unique pour tout copier depuis **Machine 1** (remplacez `ip-machine1` par l'adresse IP de votre Machine 1) :
```bash
rsync -avP --include='*/' \
           --include='*.mp4' \
           --include='*.mov' \
           --include='*.mp3' \
           --include='*.wav' \
           --include='*.png' \
           --include='*.jpg' \
           --exclude='node_modules' \
           --exclude='.git' \
           --exclude='.venv' \
           user@ip-machine1:~/Documents/art/Creation_contenus/Youtube/temp/ ./
```
*Le transfert se fait en direct à la vitesse maximale de votre réseau sans passer par Internet.*

### Méthode 2 (Via Disque Dur Externe SSD ou Clé USB)
1. Branchez votre SSD sur Machine 1.
2. Copiez simplement les dossiers suivants sur le SSD :
   * `episodes/`
   * `_shared/music/`
   * `_shared/sfx/`
3. Branchez le SSD sur Machine 2 et collez-les dans votre dossier local `crise_financiere/`.
*Les fichiers s'imbriqueront directement dans l'arborescence déjà créée par Git.*

### Méthode 3 (Archivage zip léger par épisode)
Si vous voulez ne transférer qu'un seul épisode (par exemple `02-ftx`) :
```bash
# Sur Machine 1 :
tar -czvf ftx_media.tar.gz episodes/02-ftx/assets/ episodes/02-ftx/tts/

# Sur Machine 2 :
tar -xzvf ftx_media.tar.gz
```
