# Identité de montage — "Financial Forensics"

> Document transversal, valable pour tous les épisodes. Complète `scripts/production-strategy.md`
> (qui définit QUOI utiliser — ratio footage réel/IA/custom — celui-ci définit COMMENT on l'assemble :
> transitions, rythme, sound design).

---

## 1. Méthode de travail : deux passes, jamais une seule

**Passe 1 — Montage classique (cuts francs).**
On cale d'abord tous les visuels sur la narration avec des coupes sèches, au rythme du texte
et des `[VISUEL]` du script. Zéro transition stylisée à ce stade. Le seul objectif : que le
montage tienne debout au silence, juste sur le rythme visuel/narratif.

**Passe 2 — Habillage (transitions signature).**
Une fois la passe 1 validée, on ajoute les transitions de la section 2, les effets sur les
photos animées (section 3), et les beats sonores (section 4). On n'habille jamais un montage
qui n'est pas encore rythmiquement solide — ça masque les problèmes de pacing au lieu de les
résoudre.

Pourquoi dans cet ordre : ça évite de "sur-habiller" une coupe qui de toute façon ne fonctionne
pas, et ça permet de juger le pacing brut avant de le noyer sous des effets.

---

## 2. Système de transitions

Trois familles distinctes, chacune avec un usage précis — ne pas les interchanger, sinon elles
perdent leur valeur de signal pour le spectateur.

### 2.1 — Cut sec (par défaut)
La majorité des coupes à l'intérieur d'une section. Pas d'effet. C'est le rythme normal du
montage — rapide, sans fioriture, porté par le débit de la voix off.

### 2.2 — "Camera Snapshot" — réservée aux révélations de preuve réelle
**Déclencheur :** chaque fois qu'on bascule sur une photo réelle, un document judiciaire, un
screenshot FBI/DOJ — c'est-à-dire les éléments de la pile "footage réel" (~40%) qui servent de
preuve, pas d'ambiance.

**Recette :**
- SFX : clic d'obturateur (shutter click), sec et net.
- VFX : flash blanc bref (1-2 frames), léger punch-zoom (scale 1.0 → 1.03 sur ~4-5 frames),
  vignette qui se resserre puis se relâche.
- Optionnel : un très bref cadre viseur d'appareil photo (coins + réticule) qui apparaît et
  disparaît en moins de 200ms, pour renforcer l'idée de "capture".

**Pourquoi ça marche pour ce format :** ça matérialise visuellement le moment où le spectateur
reçoit une preuve — cohérent avec l'angle "analyste qui dissèque des preuves" plutôt que
"conteur". À utiliser avec parcimonie (3-6 fois par épisode max) pour que ça reste un signal
fort, pas un tic.

### 2.3 — Whoosh — réservée aux ruptures structurelles
**Déclencheur :** changements de section (Hook→Histoire, Breakdown→Numbers, etc.), sauts
temporels ou géographiques importants. PAS pour les cuts internes à une section.

**Recette :** un whoosh directionnel court (300-500ms), synthétisable via numpy/scipy (déjà
listé dans `outils.md`) ou sourcé libre de droits. Un seul whoosh "signature" par chaîne,
décliné en 2-3 variantes de longueur — pas un whoosh différent à chaque fois.

---

## 3. Traitement des photos/images animées (Ken Burns IA)

Pour les images IA ou photos réelles animées en Ken Burns (zoom/pan progressif, déjà listé dans
`outils.md`), ajouter un **effet de trame à points ("halftone/grain")** :

- Overlay de points noirs semi-transparents (motif halftone façon photocopie/journal ancien),
  opacité faible (10-20%), légèrement animé (grain qui vit, pas figé).
- Usage : sur toute image qui n'est PAS une preuve brute (donc pas sur les screenshots FBI/DOJ
  eux-mêmes, réservés au traitement "Camera Snapshot" ci-dessus) — typiquement les
  reconstitutions IA (silhouette Wembley, yacht, café au Cap) et les vieilles photos d'archive
  animées.
- Double bénéfice : ça donne une texture "dossier d'enquête / archive de presse" cohérente avec
  le ton "Financial Forensics", ET ça dilue discrètement les petits artefacts IA (mains,
  textures trop lisses) qui trahissent la génération.
- Peut aussi servir de transition de sortie : la trame de points s'intensifie jusqu'à couvrir
  l'image à 100% (dissolve en points) avant de couper au plan suivant.

---

## 4. Beats sonores synchronisés à la narration

Le pipeline produit déjà les timestamps mot-par-mot (`transcribe_en_timestamps.py` →
`voiceover_en_words.json`). On exploite cette donnée pour placer des **accents sonores courts**
(stab, hit, riser bref) exactement sur les mots à fort poids narratif :

- Chiffres clés ("thirty-two billion", "five million dollars")
- Reveals ("she has not been seen in public since")
- Noms propres à leur première apparition dans une section

Pas de musique de fond systématique par-dessus — ces beats sont des accents ponctuels, pas un
tapis musical. La direction musicale de fond reste celle définie par épisode dans
`production-strategy.md` (ex. section "Direction musicale" pour Ruja Ignatova).

**Prochaine étape technique (à faire quand on y arrive) :** un script qui lit `*_words.json`,
repère les mots candidats (regex sur nombres/montants + liste de noms propres du script), et
génère un fichier de marqueurs (timestamps) prêt à importer dans le monteur — pour ne pas le
faire à l'oreille à chaque épisode.

---

## 5. Bibliothèque de sons partagée

Tous les SFX signature (whoosh, shutter, beats) sont **communs à tous les épisodes** — on les
crée/source une fois, on les réutilise partout. D'où leur emplacement dans `_shared/sfx/`
plutôt que dans un dossier d'épisode.

À sourcer ou synthétiser (numpy/scipy déjà disponible, cf. `outils.md`) :
- `_shared/sfx/camera-shutter/` — 1-2 variantes de clic d'obturateur
- `_shared/sfx/whoosh/` — 2-3 variantes de longueur du whoosh signature
- `_shared/sfx/beats/` — 3-5 accents courts (stab/hit) de charges émotionnelles différentes
  (neutre/chiffré, dramatique, révélation)

---

## 6. Arborescence de production (tous épisodes)

```
temp/
├── scripts/                          ← scripts narratifs .md (source de vérité éditoriale)
│   └── production-strategy.md        ← QUOI utiliser par épisode (ratio, assets, musique, pacing)
├── _shared/
│   ├── identite-montage.md           ← ce document (COMMENT assembler, tous épisodes)
│   └── sfx/                          ← whoosh / camera-shutter / beats, réutilisés partout
├── episodes/
│   ├── 01-ruja-ignatova/
│   │   ├── tts/                      ← blocs texte narration (< 10k caractères/bloc)
│   │   │   ├── block-01-hook-histoire.txt
│   │   │   ├── block-02-breakdown-numbers.txt
│   │   │   ├── block-03-aftermath-pattern-outro.txt
│   │   │   └── voiceover_en.mp3      ← sortie finale ElevenLabs (concaténée)
│   │   ├── transcription/
│   │   │   └── voiceover_en_words.json
│   │   ├── montage/
│   │   │   └── feuille-de-montage.md ← sortie de build_cutting_script.py
│   │   └── assets/
│   │       ├── footage-reel/
│   │       ├── ia-video/
│   │       ├── ia-image/
│   │       └── remotion-renders/     ← exports des compositions financial-forensics/
│   ├── 02-ftx/
│   ├── 03-madoff/
│   ├── 04-theranos/
│   └── 05-lottery/
├── financial-forensics/              ← projet Remotion (graphiques custom, existe déjà)
├── generate_voiceover.py
├── transcribe_en_timestamps.py
├── build_cutting_script.py
└── .env
```

Les scripts Python (`generate_voiceover.py`, `transcribe_en_timestamps.py`,
`build_cutting_script.py`) restent à la racine — ce sont des outils de pipeline génériques,
appelés avec des chemins différents selon l'épisode traité.
