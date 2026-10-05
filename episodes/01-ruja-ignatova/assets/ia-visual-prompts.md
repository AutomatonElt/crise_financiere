# Prompts visuels IA — Ruja Ignatova : The Cryptoqueen

> Document de production. Chaque prompt est calibré pour SnapGenAI (images et vidéos courtes 3-5s).
> Les assets générés vont dans `episodes/01-ruja-ignatova/assets/ia-image/` ou `ia-video/`.
> Tous les visuels IA réalistes (personnes, événements) nécessitent la divulgation IA YouTube Studio.

---

## Style global — cohérence visuelle

Tous les prompts IA de cet épisode partagent une direction stylistique commune :

- **Palette** : bleu nuit profond (#0A1628), or ambre (#C9A961), gris ardoise, blanc cassé. Éviter les couleurs vives saturées sauf pour la robe rouge (point narratif).
- **Texture** : rendu cinématographique, grain léger, éclairage dramatique côté (chiaroscuro). Pas de look "3D render propre" — viser photo journalistique / documentaire.
- **Composition** : plan large ou moyen, profondeur de champ courte, sujet légèrement décentré quand possible.
- **Détails humains** : silhouettes ou figures partiellement visibles (dos, profil, mains) — jamais de visage identifiable généré par IA (conformité YouTube : pas de deepfake de personnes réelles). Ruja Ignatova est toujours silhouette ou vu de dos.
- **Post-traitement** : appliquer l'overlay halftone (cf. `identite-montage.md` section 3) sur toutes ces images en montage.

---

## 1. Silhouette en robe rouge sur scène — Wembley Arena

**Apparition** : `L'Histoire`, ligne 67 — "silhouette sur scène, projecteurs, foule"
**Outil** : SnapGenAI (image + vidéo optionnelle 4s)
**Priorité** : haute — image signature de l'épisode

### Prompt SnapGenAI — image

```
A lone woman in a floor-length deep red gown standing on a massive arena stage,
seen from behind, silhouette against blinding spotlights, thousands of
silhouetted audience members in the dark below, Wembley Arena interior,
dramatic chiaroscuro lighting, blue-black shadows, golden spotlight beams,
cinematic documentary style, shallow depth of field, film grain, 35mm,
--ar 16:9 --style raw --v 7
```

### Prompt SnapGenAI — vidéo (si vidéo)

```
Camera slowly pushes forward toward a woman in a red gown standing center stage
in a dark arena, spotlights blazing behind her, crowd silhouettes barely visible
in the darkness, she raises her arms slightly, the crowd roars (no audio),
cinematic documentary footage, blue-black color grade, film grain, 4 seconds
```

### Notes
- La robe rouge est le seul élément saturé — elle doit "pop" visuellement.
- Ne jamais générer son visage : silhouette de dos uniquement.
- Si vidéo SnapGenAI : mouvement minimal (slow push-in), pas d'action complexe.

---

## 2. Bjercke — visioconférence et refus du poste

**Apparition** : `L'Histoire` — Bjercke recruté, enquête, refuse le poste
**Outil** : SnapGenAI (2 images : visioconférence + document refusé)
**Priorité** : moyenne

### Prompt SnapGenAI — visioconférence (Bjercke enquête)

```
A man seen from behind, sitting at a desk taking notes during a video call,
laptop screen showing a conference call interface, folders and a code editor
visible on a second monitor in the background, dark home office at night,
cold blue screen glow, cinematic documentary style, film grain, shallow depth
of field, blue-black color grade, --ar 16:9 --style raw --v 7
```

### Prompt SnapGenAI — document refusé (DECLINED)

```
A formal contract document on a dark desk, partially closed, a bold stamp
reading DECLINED in red ink visible on the cover page, pen lying beside it,
dramatic side lighting, blue-black shadows, cinematic documentary style, film
grain, shallow depth of field, --ar 16:9 --style raw --v 7
```

### Notes
- Remplace l'ancien visuel "employé face à tableur qui part" — Bjercke n'a
  jamais travaillé chez OneCoin, il a refusé le poste après enquête.
- Le visuel "DECLINED" est plus fort narrativement que le départ silencieux.

---

## 3. Mockup DealShaker — marketplace fictive

**Apparition** : `The Breakdown`, ligne 144 — "mockup du site DealShaker, produits listés, prix gonflés"
**Outil** : SnapGenAI (image base) + montage composite (ajout texte/prix en post-production)
**Priorité** : moyenne

### Prompt SnapGenAI

```
A screenshot-style view of a generic online marketplace website, early 2016
web design aesthetic, product grid layout with placeholder items, blurry
product photos, generic e-commerce template, slightly amateurish design,
blue and white color scheme, web UI mockup, flat lighting, --ar 16:9
--style raw --v 7
```

### Notes
- L'image IA sert de **base/arrière-plan** uniquement. Les prix gonflés, logos
  "merchants" et éléments textuels seront ajoutés en montage (After Effects /
  overlay) pour un contrôle précis du contenu.
- Viser un look "site e-commerce 2015-2016" — pas trop moderne.

---

## 4. Silhouette changeant de visage — nouvelle identité

**Apparition** : `The Aftermath`, ligne 249 — "silhouette qui change de visage, transformation, nouveaux documents d'identité, passeports"
**Outil** : SnapGenAI (vidéo 4-5s) — c'est une transformation, l'image statique ne suffit pas
**Priorité** : haute — moment narratif clé (Theory 2)

### Prompt SnapGenAI — vidéo

```
A featureless silhouette of a woman standing in a dark room, her face slowly
morphs and shifts through subtle changes — cheekbones, jawline, hair color —
as passport photos and identity documents briefly flash and overlay on her
figure, dark cinematic atmosphere, blue-black color grade, film grain,
documentary style, 5 seconds
```

### Notes
- La transformation doit être **ambiguë et lente** — pas un "morph" net.
- Les documents d'identité qui flashent restent flous/illisibles (pas de
  faux passeport lisible qui poserait un problème légal).
- Consistance avec le ton dubitatif du script : on ne montre pas une
  nouvelle identité claire, on suggère la possibilité.

---

## 5. Yacht en mer Ionienne — Theory 1 (elle est morte)

**Apparition** : `The Aftermath`, ligne 241 — "carte de la mer Ionienne, un point qui s'efface, silhouette de yacht, puis noir"
**Outil** : SnapGenAI (image yacht) — la disparition/effacement se fait en montage
**Priorité** : haute — visuel le plus sombre de l'épisode

### Prompt SnapGenAI

```
A luxury yacht alone on a dark calm sea at night, viewed from high angle,
Ionian Sea, deep blue-black water, minimal lighting on the vessel, ominous
atmosphere, no other boats visible, distant coastline barely visible in the
dark, cinematic documentary style, film grain, chiaroscuro, --ar 16:9
--style raw --v 7
```

### Notes
- **Ambiguïté obligatoire** (cf. `production-strategy.md` point de vigilance) :
  le yacht est là, flottant, rien d'explicite. L'effacement se fait en
  montage (fondu au noir lent, 2-3s) — pas de violence visuelle.
- Pas de personne visible sur le yacht.
- L'atmosphère doit être funèbre sans être graphique.
- **Garde-fou hors contexte** : ajouter un texte à l'écran synchronisé sur
  ce plan — "Unverified — single source" en petit, discret mais présent —
  pour que la prudence éditoriale survive même si le plan circule sans audio
  (TikTok, Twitter, screenshot de miniature). Le script corrigé inclut déjà
  cette mention dans le `[VISUEL]`.

---

## 6. Café au Cap — Theory 3 (nouvelle vie, leading theory)

**Apparition** : `The Aftermath` — "silhouette dans un café au Cap" + connexion Kamenov
**Outil** : SnapGenAI (image)
**Priorité** : haute — désormais la leading theory (janvier 2026)

### Prompt SnapGenAI

```
An anonymous woman's silhouette sitting alone at a small outdoor cafe table,
morning light, Cape Town South Africa vibe with Table Mountain silhouette
in the far background, coffee cup on the table, she reads a newspaper, face
not visible, warm but muted tones, cinematic documentary style, film grain,
shallow depth of field, --ar 16:9 --style raw --v 7
```

### Notes
- Le ton est plus chaleureux que les autres visuels (lumière du matin, tons
  ambre) — contraste délibéré avec le yacht sombre de Theory 1.
- La silhouette reste anonyme : vu de dos ou de trois-quarts, visage dans
  l'ombre du journal.
- Table Mountain en arrière-plan ancre la localisation sans être caricatural.

---

## 7. Reconstitution stylisée — foule et projecteurs (variantes)

**Apparition** : `L'Histoire`, ligne 67 (déjà couvert par #1) + utilisations transversales
**Outil** : SnapGenAI (images supplémentaires pour b-roll)
**Priorité** : basse — b-roll de remplissage

### Prompt SnapGenAI — foule

```
A large crowd of people in a dark conference arena, seen from behind the
stage, spotlights sweeping overhead, silhouettes of audience members raising
phones, energy of a revival meeting or product launch event, cinematic
documentary style, blue-black color grade, film grain, --ar 16:9
--style raw --v 7
```

### Prompt SnapGenAI — projecteurs

```
Blinding stage spotlights in a dark arena, beams cutting through haze and
fog, empty stage visible in the background, dramatic lighting, cinematic
documentary style, blue-black and gold tones, film grain, --ar 16:9
--style raw --v 7
```

### Notes
- Ces images servent de b-roll entre les visuels principaux — pas de sujet
  humain identifiable, juste ambiance.

---

## 8. Icônes pour les trois théories — signal éteint, ombre, café

**Apparition** : `The Aftermath` — "trois branches, chacune avec une icône distincte"
**Outil** : SnapGenAI (icônes stylisées) — utilisées dans un graphique After Effects
**Priorité** : moyenne

### Prompt SnapGenAI — signal qui s'éteint (Theory 1: dead)

```
A minimalist icon of a signal waveform flatlining into a straight line,
engraved line art style, gold lines on deep navy blue background, no shading,
clean vector-like aesthetic, centered, lots of negative space, --ar 1:1
--style raw --v 7
```

### Prompt SnapGenAI — ombre (Theory 2: alive, protected)

```
A minimalist silhouette icon of a person standing in a doorway, backlit,
only shadow visible, engraved line art style, gold lines on deep navy blue
background, no shading, clean vector-like aesthetic, centered, lots of
negative space, --ar 1:1 --style raw --v 7
```

### Prompt SnapGenAI — tasse de café (Theory 3: new life, leading theory)

```
A minimalist coffee cup icon with rising steam, engraved line art style,
gold lines on deep navy blue background, no shading, clean vector-like
aesthetic, centered, lots of negative space, --ar 1:1 --style raw --v 7
```

### Notes
- L'icône "signal qui s'éteint" remplace le crâne initialement prévu — plus
  cohérente avec le ton Bloomberg/FT de la chaîne, évite le vocabulaire visuel
  true-crime pulp.
- Les trois icônes partagent le même style (or sur navy, line art) pour
  former un ensemble cohérent dans le graphique After Effects.
- Format carré (1:1) — elles seront placées côte à côte dans le schéma
  à trois branches.
- L'icône café peut être visuellement mise en avant (légère surbrillance)
  pour refléter que c'est désormais la leading theory.

---

## 9. Photo de Charles Ponzi (outro)

**Apparition** : `Outro`, ligne 303 — "vieille photo de Charles Ponzi en noir et blanc, fondu"
**Outil** : Footage réel (photo de domaine public) — PAS de génération IA
**Note** : Cette photo existe dans les archives publiques. Utiliser la vraie
photo historique de Ponzi (disponible sur Wikipedia / Library of Congress),
pas une reconstitution IA. Appliquer l'effet halftone en montage pour
cohérence avec le style "archive".

---

## Checklist de production

| # | Visuel | Outil | Type | Priorité | Statut |
|---|--------|-------|------|----------|--------|
| 1 | Silhouette robe rouge Wembley | SnapGenAI | Image + vidéo | Haute | ✅ Image + vidéo Kling 1080p 4s |
| 2 | Bjercke visio + document DECLINED | SnapGenAI | 2 images | Moyenne | ✅ Image + vidéo Grok 720p 6s |
| 3 | Mockup DealShaker | SnapGenAI + montage | Image composite | Moyenne | ✅ Image + vidéo Grok 720p 6s |
| 4 | Silhouette changeant de visage | SnapGenAI | Vidéo 5s | Haute | ✅ Vidéo Kling 1080p 5s |
| 5 | Yacht mer Ionienne (+ texte "Unverified") | SnapGenAI | Image | Haute | ✅ Image + vidéo Grok 720p 6s |
| 6 | Café au Cap (leading theory) | SnapGenAI | Image | Haute | ✅ Image + vidéo Grok 720p 6s |
| 7 | B-roll foule + projecteurs | SnapGenAI | Images | Basse | ✅ Image foule + vidéo Grok 720p 6s |
| 8 | Icônes 3 théories (signal/ombre/café) | SnapGenAI | 3 images carrées | Moyenne | ✅ Intégré dans Remotion ThreeTheories |
| 9 | Photo Charles Ponzi | Archive publique | Photo réelle | Basse | ✅ Téléchargé (real-footage/) |
| 10 | Carte Sofia→Ionian→Cape Town (Kamenov) | After Effects / SnapGenAI | Graphique | Moyenne | ⏳ À faire en montage |
| 11 | Thumbnails A/B/C (3 variantes) | SnapGenAI | 3 images | Haute | ✅ 3 images générées |

### Assets vidéo IA générés (ia-video/)

| # | Fichier | Provider | Durée exacte | Résolution | Image ref |
|---|---------|----------|-------------|------------|-----------|
| 1 | 01-wembley-push-in.mp4 | Kling 3.0 | 4.04s | 1080p | 01-wembley-red-gown.png |
| 2 | 02-identity-morph.mp4 | Kling 3.0 | 5.04s | 1080p | (text-to-video) |
| 3 | 03-bjercke-laptop-test.mp4 | Grok 3 | 6.04s | 720p | 08-bjercke-laptop-helicopter.png |
| 4 | 04-crowd-hands-money.mp4 | Grok 3 | 6.04s | 720p | 04-crowd-hands-money.png |
| 5 | 06-ruja-disappearing.mp4 | Grok 3 | 6.04s | 720p | 05-ruja-disappearing-crowd.png |
| 6 | 08-dealshaker-mockup.mp4 | Grok 3 | 6.04s | 720p | 09-dealshaker-mockup.png |
| 7 | 10-yacht-ionian-sea.mp4 | Grok 3 | 6.04s | 720p | 11-yacht-ionian-sea.png |
| 8 | 11-cape-town-silhouette.mp4 | Grok 3 | 6.04s | 720p | 12-cape-town-silhouette.png |

**Durée totale vidéo IA** : 45.32s
**Durée totale vidéo FBI** : 1min 58s (117.95s)
**Durée totale graphiques custom** : 60.59s (10 × 6.06s)
**Durée totale footage vidéo** : 223.86s (~3min 44s)

### Vidéos supprimées (qualité insuffisante)
- ~~05-private-jet-globe.mp4~~ — jet privé/globe, rendu non convaincant
- ~~07-dark-office-laptop.mp4~~ — bureau sombre, rendu non convaincant
- ~~09-fbi-wanted-board.mp4~~ — tableau FBI, rendu non convaincant

### Assets réels (real-footage/)

| # | Fichier | Source | Licence |
|---|---------|--------|--------|
| 1 | charles-ponzi-mugshot.jpg | Wikimedia Commons | Domaine public |
| 2 | fbi-ignatova-wanted-photo.jpg | fbi.gov | Domaine public US Gov |
| 3 | fbi-ignatova-hires.jpg | fbi.gov | Domaine public US Gov |
| 4 | fbi-ignatova-wanted-poster.pdf | fbi.gov | Domaine public US Gov |
| 5 | fbi-ruja-london-speech.mp4 | fbi.gov | Domaine public US Gov |
| 6 | doj-ignatova-indictment.pdf | justice.gov | Domaine public US Gov |
| 7 | doj-konstantin-ignatov-complaint.pdf | justice.gov | Domaine public US Gov |

### Graphiques custom (custom-graphics/) — Remotion 1080p 30fps

| # | Fichier | Composant | Durée exacte |
|---|---------|-----------|-------------|
| 1 | 01-price-chart.mp4 | PriceChart | 6.06s |
| 2 | 02-mlm-pyramid.mp4 | MlmPyramid | 6.06s |
| 3 | 03-money-flow.mp4 | MoneyFlow | 6.06s |
| 4 | 04-three-theories.mp4 | ThreeTheories | 6.06s |
| 5 | 05-reward-staircase.mp4 | RewardStaircase | 6.06s |
| 6 | 06-comparison-bars.mp4 | ComparisonBars | 6.06s |
| 7 | 07-packages-table.mp4 | PackagesTable | 6.06s |
| 8 | 08-blockchain-comparison.mp4 | BlockchainComparison | 6.06s |
| 9 | 09-mining-comparison.mp4 | MiningComparison | 6.06s |
| 10 | 10-trust-chain.mp4 | TrustChain | 6.06s |

---

## Notes de post-traitement (rappel)

1. **Halftone overlay** sur tous les visuels IA (sauf icônes #8 qui sont déjà
   stylisées) — cf. `identite-montage.md` section 3.
2. **Camera Snapshot** (shutter + flash) sur les visuels réels (photos FBI,
   documents DOJ) — pas sur les visuels IA ci-dessus.
3. **Whoosh** sur les transitions entre sections — pas à l'intérieur d'un
   plan IA.
4. **Divulgation IA YouTube** : cocher "Altered or synthetic content" pour
   cet épisode (visuels #1, #2, #3, #4, #5, #6, #7, #11 sont réalistes).
5. **Garde-fou yacht** : le texte "Unverified — single source" doit rester
   à l'écran pendant toute la durée du plan yacht, pas seulement en flash.

---

## 10. Thumbnails — 3 variantes A/B testables

Le thumbnail décide du clic avant même le titre. Règles de composition
spécifiques (différentes du reste de l'épisode) :

- **Un seul point focal** — l'œil doit comprendre en 0.3s
- **Contraste fort** — pousser au-delà de ce qui semble "beau" en plein écran
- **Texte overlay** ajouté en post-prod (2-4 mots max), pas dans le prompt IA
- **Jamais de visage généré** pour Ignatova — silhouette, dos, ou éléments
  symboliques (cohérent avec le reste + conformité deepfake)
- **Tester en A/B** sur YouTube Studio dès les premières 48h

### Variante A — La silhouette et l'argent

**Prompt SnapGenAI**

```
Close-up dramatic portrait composition, back view silhouette of a woman in
a red gown against a stark deep navy background, half her figure dissolving
into golden particle fragments on the right side, bold high contrast lighting,
single dramatic rim light, thumbnail composition with clear negative space
on the left third for text overlay, cinematic, ultra high contrast, punchy
saturated red against navy, --ar 16:9 --style raw --v 7
```

**Texte overlay** : `SHE VANISHED` (haut, blanc) / `$4,000,000,000` (bas, or)

### Variante B — Le poster FBI

**Prompt SnapGenAI**

```
Dramatic close crop of a wanted-poster style composition, torn/weathered
paper texture edge on one side, bold stamped WANTED aesthetic without literal
readable text, deep red stamp mark, navy and cream color palette, high
contrast, gritty documentary photography feel, thumbnail composition with
clear space for text overlay, --ar 16:9 --style raw --v 7
```

**Texte overlay** : `$5,000,000 REWARD` (gros, rouge/or) / `STILL MISSING` (petit)

### Variante C — Le visage qui se dissout (numérique)

**Prompt SnapGenAI**

```
Bold graphic composition, silhouette profile of a woman's head made of
glitching digital fragments and glowing gold particles dispersing into
darkness, deep navy background, high contrast, dramatic single light source,
minimal, striking, thumbnail composition with negative space for text,
cinematic digital-dissolve effect, --ar 16:9 --style raw --v 7
```

**Texte overlay** : `THE CRYPTOQUEEN`

### Checklist thumbnails
- [x] Les 3 variantes générées (13-thumbnail-a-ponzi-portrait.png, 14-thumbnail-b-ghost-coin.png, 06-thumbnail-c-digital-dissolve.png)
- [ ] Vérifier la palette en vignette 120x67px sur téléphone
- [x] Aucun visage généré reconnaissable comme Ignatova
- [ ] Texte overlay à ajouter en post-prod (2-4 mots max)
- [ ] Les 3 variantes chargées dans le test A/B YouTube Studio dès la mise en ligne
- [ ] Cohérence avec les futurs thumbnails (Theranos, Madoff, FTX) — même grammaire visuelle

### Gabarit réutilisable (épisodes suivants)
Garder la grammaire (silhouette dos/profil + un chiffre choc en overlay +
palette navy/or + un seul point focal), varier le sujet et la composition à
chaque épisode — jamais le même prompt avec juste le nom changé.
