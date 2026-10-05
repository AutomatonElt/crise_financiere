# 👑 Composant Réutilisable : Titre Principal d'Épisode (MainTitle)

Générateur de la séquence de titre maîtresse de l'épisode (Billboard Reveal) apparaissant une seule fois dans la vidéo (à la fin du Hook) sur fond sombre cinéma immersif avec typographie gravée or, lueur dorée diffuse, tag de série et travelling avant lent.

---

## 📍 Chemins des Fichiers Clés

| Rôle | Chemin Absolu |
|---|---|
| **Script CLI de génération** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/scripts/generate_main_title.py` |
| **Composant Remotion React** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/financial-forensics/src/compositions/MainTitle/MainTitleScene.tsx` |
| **Déclaration Composition** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/financial-forensics/src/Root.tsx` |
| **Dossier de destination** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/episodes/01-ruja-ignatova/assets/texte_card/` |

---

## 🎯 Dans quel cas l'utiliser ?

1. **Révélation du Grand Titre de la Vidéo (Billboard Reveal)** :
   * Apparaît **une seule fois** à la fin du Hook (vers 0:35–0:45) lorsque la voix off conclut : *"This is the story of Ruja Ignatova. The Cryptoqueen."*
2. **Transition Monumentale Hook → Corps de l'Enquête** :
   * Pose l'identité cinématographique de l'épisode sans aucun texte encombrant.

---

## 🎨 Caractéristiques Visuelles Épurées

* **Fond sombre immersif :** Dégradé radial bleu nuit profond (`#060A12` / `#0F1A2E`) avec vignettage cinéma, lueur dorée diffuse et grille forensic discrète.
* **Grand Titre Gravé Or :** Typographie `Cinzel` monumentale avec dégradé d'or pur (`#D4AF37`) et halo lumineux.
* **Filet central avec Node :** Filet d'or effilé avec point diamant central blanc.
* **Zéro encombrement :** Aucun texte parasite en haut ou en bas, focus 100% sur le titre choc.
* **Animation :** Travelling avant très lent (*Slow Push-in* 1.0 → 1.04) et fondu enchaîné doux.

---

## 💻 Utilisation en Ligne de Commande

```bash
# 1. Variante A - Clean (Titre gravé or pur sans reflet ni lueur centrale) :
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

---

## ⚙️ Options et Paramètres CLI

| Argument | Type | Valeur par défaut | Description |
|---|---|---|---|
| `--title` | `str` | *Requis* | Grand titre de l'épisode (ex: `THE CRYPTOQUEEN`). |
| `--style` | `str` | `"shimmer"` | Style : `shimmer` (balayage lumineux cinéma), `clean` (or pur net), `ambient`. |
| `--accent`, `--color` | `hex` | `"#D4AF37"` | Couleur or signature de la chaîne. |
| `--duration` | `float` | `5.0` | Durée totale en secondes. |
| `--transparent` | `bool` | `False` | Fond transparent au lieu du fond sombre cinéma. |
| `--sound` / `--no-sound` | `bool` | `True` | Intègre automatiquement le son Whoosh cinéma (`whoosh_long.wav`). |
| `--whoosh` | `str` | `""` | Chemin d'un effet whoosh personnalisé. |
| `--fps` | `int` | `25` | Cadence en images par seconde (25 FPS standard chaîne). |
| `--out` | `str` | *Requis* | Chemin complet du fichier vidéo de sortie (`.mp4` ou `.mov`). |

---

## 🎵 Fichier Audio Compagnon

Lorsque `--sound` est activé (par défaut), le script génère automatiquement :
1. La vidéo avec le son whoosh mixé dans le flux audio (`.mp4`).
2. Un fichier WAV compagnon synchronisé (ex: `main_title_cryptoqueen_shimmer_whoosh.wav`) pour faciliter l'alignement sur la piste audio `A3_SFX_WHOOSH` dans Kdenlive.

---

## 🎬 Signature de Montage : Le "Beat-Through Title Drop"

Pour maximiser la rétention YouTube et créer une tension cinématographique puissante, la chaîne adopte la règle de signature suivante lors du grand titre :

1. **Respiration de la Voix Narration (`A1_MASTER_VOICE`)** :
   - La voix off s'interrompt net dès la fin de la phrase d'accroche (ex: *"The Cryptoqueen."* à 00:48).
   - Un silence vocal de **3,80 secondes** est maintenu pour marquer la solennité de l'annonce.
2. **Continuité du Beat Musical (`A2_MUSIC_BED`)** :
   - **La musique / beat de suspense ne se coupe PAS.** Elle continue de pulser sous le titre pour maintenir le rythme, l'énergie et la dynamique de la vidéo sans créer de « vide numérique ».
3. **Apparition et Effet Whoosh (`A3_SFX_WHOOSH`)** :
   - Le plan vidéo précédent s'attarde ~1 seconde pour laisser résonner les derniers mots.
   - Le Grand Titre ([main_title_cryptoqueen_shimmer.mp4](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/episodes/01-ruja-ignatova/assets/texte_card/main_title_cryptoqueen_shimmer.mp4)) surgit avec le son d'impact [whoosh_long.wav](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/_shared/sfx/whoosh/whoosh_long.wav) pur (sans aucun grondement ou drone artificiel).
4. **Relance Immédiate de l'Acte 1** :
   - À 00:51.80, la voix off reprend avec force (*"Let's rewind."*), parfaitement synchronisée avec la carte du Chapitre 2 sur `V2_OVERLAYS`.

---

## 🎬 Intégration Kdenlive / OTIO

* **Piste Vidéo** : Déposer le clip vidéo sur **`V1_MAIN`** à la coupure du Hook (durée calibrée : 2,5s à 3,8s).
* **Piste Musique** : Prolonger le morceau sombre sur **`A2_MUSIC_BED`** sans coupure.
* **Piste SFX** : Aligner [main_title_cryptoqueen_shimmer_whoosh.wav](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/episodes/01-ruja-ignatova/assets/texte_card/main_title_cryptoqueen_shimmer_whoosh.wav) sur **`A3_SFX_WHOOSH`** au moment précis de l'entrée du titre.
* **Projet de référence** : [rudja3.otio](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/episodes/01-ruja-ignatova/rudja3.otio).
