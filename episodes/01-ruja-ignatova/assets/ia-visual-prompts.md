# Prompts visuels IA — Ruja Ignatova : The Cryptoqueen

> Document de production. Chaque prompt est calibré pour Midjourney v7 (images) ou Runway Gen-3 (vidéo courte 3-5s).
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
**Outil** : Midjourney v7 (image) + Runway Gen-3 (optional 4s vidéo)
**Priorité** : haute — image signature de l'épisode

### Prompt Midjourney

```
A lone woman in a floor-length deep red gown standing on a massive arena stage,
seen from behind, silhouette against blinding spotlights, thousands of
silhouetted audience members in the dark below, Wembley Arena interior,
dramatic chiaroscuro lighting, blue-black shadows, golden spotlight beams,
cinematic documentary style, shallow depth of field, film grain, 35mm,
--ar 16:9 --style raw --v 7
```

### Prompt Runway Gen-3 (si vidéo)

```
Camera slowly pushes forward toward a woman in a red gown standing center stage
in a dark arena, spotlights blazing behind her, crowd silhouettes barely visible
in the darkness, she raises her arms slightly, the crowd roars (no audio),
cinematic documentary footage, blue-black color grade, film grain, 4 seconds
```

### Notes
- La robe rouge est le seul élément saturé — elle doit "pop" visuellement.
- Ne jamais générer son visage : silhouette de dos uniquement.
- Si vidéo Runway : mouvement minimal (slow push-in), pas d'action complexe.

---

## 2. Employé face à un tableur, puis partant

**Apparition** : `L'Histoire`, ligne 81 — "silhouette d'un employé face à un écran montrant un simple tableur, puis se levant et partant"
**Outil** : Midjourney v7 (image) + Runway Gen-3 (4s vidéo pour la séquence départ)
**Priorité** : moyenne

### Prompt Midjourney (image — employé devant écran)

```
A man seen from behind, sitting alone in a dark office at night, facing a
monitor displaying a plain spreadsheet with rows of numbers, cold blue screen
glow on his silhouette, empty office around him, oppressive corporate
atmosphere, cinematic documentary style, film grain, shallow depth of field,
blue-black color grade, --ar 16:9 --style raw --v 7
```

### Prompt Runway Gen-3 (vidéo — séquence départ)

```
A man sitting at a desk in a dark office lit only by a monitor's blue glow,
he slowly pushes his chair back, stands up, and walks away toward the door
in the background, leaving the screen glowing alone, cinematic documentary
footage, blue-black color grade, film grain, 4 seconds
```

### Notes
- L'écran montre un tableur banal (SQL database feel), pas un graphique crypto.
- Le départ doit être lent, résigné — pas précipité.

---

## 3. Mockup DealShaker — marketplace fictive

**Apparition** : `The Breakdown`, ligne 144 — "mockup du site DealShaker, produits listés, prix gonflés"
**Outil** : Midjourney v7 (image base) + montage composite (ajout texte/prix en post-production)
**Priorité** : moyenne

### Prompt Midjourney

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
**Outil** : Runway Gen-3 (vidéo 4-5s) — c'est une transformation, l'image statique ne suffit pas
**Priorité** : haute — moment narratif clé (Theory 2)

### Prompt Runway Gen-3

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
**Outil** : Midjourney v7 (image yacht) — la disparition/effacement se fait en montage
**Priorité** : haute — visuel le plus sombre de l'épisode

### Prompt Midjourney

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

---

## 6. Café au Cap — Theory 3 (nouvelle vie en Afrique du Sud)

**Apparition** : `The Aftermath`, ligne 255 — "silhouette dans un café au Cap"
**Outil** : Midjourney v7 (image)
**Priorité** : moyenne

### Prompt Midjourney

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
**Outil** : Midjourney v7 (images supplémentaires pour b-roll)
**Priorité** : basse — b-roll de remplissage

### Prompt Midjourney — foule

```
A large crowd of people in a dark conference arena, seen from behind the
stage, spotlights sweeping overhead, silhouettes of audience members raising
phones, energy of a revival meeting or product launch event, cinematic
documentary style, blue-black color grade, film grain, --ar 16:9
--style raw --v 7
```

### Prompt Midjourney — projecteurs

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

## 8. Icônes pour les trois théories — crâne, ombre, café

**Apparition** : `The Aftermath`, ligne 233 — "trois branches, chacune avec une icône distincte : un crâne, une ombre, une tasse de café"
**Outil** : Midjourney v7 (icônes stylisées) — utilisées dans un graphique After Effects
**Priorité** : moyenne

### Prompt Midjourney — crâne (Theory 1: dead)

```
A minimalist skull icon, engraved line art style, gold lines on deep navy
blue background, no shading, clean vector-like aesthetic, centered, lots of
negative space, --ar 1:1 --style raw --v 7
```

### Prompt Midjourney — ombre (Theory 2: alive, protected)

```
A minimalist silhouette icon of a person standing in a doorway, backlit,
only shadow visible, engraved line art style, gold lines on deep navy blue
background, no shading, clean vector-like aesthetic, centered, lots of
negative space, --ar 1:1 --style raw --v 7
```

### Prompt Midjourney — tasse de café (Theory 3: new life)

```
A minimalist coffee cup icon with rising steam, engraved line art style,
gold lines on deep navy blue background, no shading, clean vector-like
aesthetic, centered, lots of negative space, --ar 1:1 --style raw --v 7
```

### Notes
- Les trois icônes partagent le même style (or sur navy, line art) pour
  former un ensemble cohérent dans le graphique After Effects.
- Format carré (1:1) — elles seront placées côte à côte dans le schéma
  à trois branches.

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
| 1 | Silhouette robe rouge Wembley | Midjourney + Runway | Image + vidéo | Haute | A générer |
| 2 | Employé face tableur + départ | Midjourney + Runway | Image + vidéo | Moyenne | A générer |
| 3 | Mockup DealShaker | Midjourney + montage | Image composite | Moyenne | A générer |
| 4 | Silhouette changeant de visage | Runway Gen-3 | Vidéo 5s | Haute | A générer |
| 5 | Yacht mer Ionienne | Midjourney | Image | Haute | A générer |
| 6 | Café au Cap | Midjourney | Image | Moyenne | A générer |
| 7 | B-roll foule + projecteurs | Midjourney | Images | Basse | A générer |
| 8 | Icônes 3 théories (crâne/ombre/café) | Midjourney | 3 images carrées | Moyenne | A générer |
| 9 | Photo Charles Ponzi | Archive publique | Photo réelle | Basse | A sourcer |

---

## Notes de post-traitement (rappel)

1. **Halftone overlay** sur tous les visuels IA (sauf icônes #8 qui sont déjà
   stylisées) — cf. `identite-montage.md` section 3.
2. **Camera Snapshot** (shutter + flash) sur les visuels réels (photos FBI,
   documents DOJ) — pas sur les visuels IA ci-dessus.
3. **Whoosh** sur les transitions entre sections — pas à l'intérieur d'un
   plan IA.
4. **Divulgation IA YouTube** : cocher "Altered or synthetic content" pour
   cet épisode (visuels #1, #2, #3, #4, #5, #6, #7 sont réalistes).
