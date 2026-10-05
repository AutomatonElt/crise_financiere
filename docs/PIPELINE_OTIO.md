# Architecture OTIO - Financial Forensics

Ce document définit la philosophie et la structure de l'automatisation vidéo via `opentimelineio`.

## 1. Topologie de la Timeline (Norme "Base Propre - 3 Pistes Vidéo")
Pour un compositing naturel du bas vers le haut dans Kdenlive avec zéro piste inutile :
- `V3_TITLES` (Vidéo 3 - Sommet) : Chiffres clés ($5M), Title Cards de repères spatio-temporels (Sofia -> Athènes), animations.
- `V2_OVERLAYS` (Vidéo 2 - Milieu) : Cartes de chapitres (ChapterCard) et fiches personnages (EvidenceCard soft).
- `V1_MAIN` (Vidéo 1 - Bas) : Piste maîtresse visuelle (rushs continus, B-roll, archives). Toujours en bas, ne masque rien !
- `A1_MASTER_VOICE` (Audio 1) : Métronome vocal généré par IA.
- `A2_MUSIC_BED` (Audio 2) : Musique d'ambiance.
- `A3_SFX_WHOOSH` (Audio 3) : Effets sonores & déclencheurs photo.
- `A4_SECONDARY_AUDIO` (Audio 4) : Voix annexes, interviews. 

## 2. Segments du Pipeline 
L'automation (via `scripts/agent_otio.py`) fonctionne en 4 "Segments" :

### Segment 1 : Loader Audio et Repères Temporels
Charge le JSON word-by-word de la transcription (`voiceover_en_words.json`).
*Note importante sur le décalage de la timeline* :
Lors de l'insertion d'un Titre Principal avec respiration (pause de voix de 3.80s à 48.00s), les repères temporels des mots postérieurs à 48.00s sont automatiquement décalés de +3.80s dans `voiceover_en_words_timeline.json`. Ce fichier fait foi pour tout alignement ultérieur d'éléments sur la timeline.

### Segment 2 : OTIO Shell Builder
Génère la timeline selon la Topologie stricte. 
*Note de bug OTIO* : Kdenlive ne tolère pas les pistes instanciées mais "falsy" (Tracks vides). Le script s'assure d'insérer les médias sans échec et injecte Kdenlive-ready metadata.

### Segment 3 : Master Audio Spine & Signature "Beat-Through"
- **Voix Principale (`A1_MASTER_VOICE`)** : Verrouille `voiceover_en_v2.mp3` sur `A1` à T=0.0s (avec gap de silence de 3.80s à 48.00s pour marquer la solennité de l'annonce du Titre).
- **Fond Musical Continu (`A2_MUSIC_BED`)** : Contrairement à un silence complet, le beat musical / drone de suspense sur `A2` continue sans interruption pendant le grand titre. Cette signature maintient la tension et le dynamisme sans interruption du flux d'attention.
- **SFX Dédiés (`A3_SFX_WHOOSH`)** : Whoosh pur sans grondement ([whoosh_long.wav](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/_shared/sfx/whoosh/whoosh_long.wav)) calé à l'apparition du titre, bruits d'obturateur photo (EvidenceCard) et frappe machine à écrire (TitleCard).

### Segment 4 : Ingénierie Visuelle Hybride
La puissance du pipeline réside dans **l'ingestion hybride** :
1. **Mode Preview Manuel (`--import-preview`)** : Si le monteur a déjà posé ses cuts sur un `rough_cut.otio`, le script extrait intégralement cette piste (avec transitions et timings exacts) et la fige sur `V1_MAIN`. C'est le flux nominal validé sur [rudja4.otio](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/episodes/01-ruja-ignatova/rudja4.otio).
2. **Mode Déclaratif (`--visuals`)** : Alternativement, le script lit un fichier JSON statique de *mapping* pour générer dynamiquement l'OTIO selon des `assets` scannés. 

---

## 3. Workflow de Production en 2 Phases : `.otio` ➔ `.kdenlive`

Pour concilier la puissance de l'automatisation IA et la richesse des effets NLE sans jamais perdre de travail, la chaîne adopte un **workflow strict en 2 phases** :

```
┌────────────────────────────────────────────────────────┐
│ PHASE 1 : Architecture & Montage Structurel (.otio)    │
├────────────────────────────────────────────────────────┤
│ • Découpe et placement des rushs d'archives (V1_MAIN)  │
│ • Intégration des cartes de chapitres & fiches (V2)   │
│ • Calage des repères spatio-temporels (V3_TITLES)     │
│ • Synchronisation millimétrée voix / musique / SFX     │
│ ⚠️ Ne pas faire de mixage de volume fin ni filtres      │
│    (Kdenlive ne stocke pas les filtres dans le .otio) │
└──────────────────────────┬─────────────────────────────┘
                           │
                           │ Validation humaine de la structure
                           ▼
┌────────────────────────────────────────────────────────┐
│ PHASE 2 : Finition, Effets & Mixage (.kdenlive)        │
├────────────────────────────────────────────────────────┤
│ • L'utilisateur fait "Fichier > Enregistrer sous..."   │
│   au format natif .kdenlive                            │
│ • L'agent / l'humain injecte dans le XML MLT :         │
│   1. Animations vidéo : Slow Push-in / Ken Burns       │
│      (zoom 100% -> 105% sur plans fixes et photos)     │
│   2. Mixage audio & Ducking (musique baissée sous voix)│
│   3. Transitions stylisées (Rewind glitch, dip to black│
│   4. Fondus d'entrée/sortie et étalonnage              │
│ ✅ Tous les effets sont 100% conservés et pérennes     │
└────────────────────────────────────────────────────────┘
```

Ce découpage évite les régressions : l'architecture temporelle est figée d'abord, puis la couche cosmétique et sonore est appliquée sur le projet final.
