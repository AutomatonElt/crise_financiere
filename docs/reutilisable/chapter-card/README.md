# 🏷️ Composant Réutilisable : Titres de Chapitres & d'Actes (ChapterCard)

Générateur de titres de parties, chapitres et actes d'enquête avec l'identité visuelle originale **Financial Forensics** : colonne latérale lumineuse effilée (*Vertical Spine*), micro-badge de classification judiciaire, typographie lourde cinématique, métadonnées d'enquête aérées et ouverture douce instantanée (sans effet machine à écrire).

---

## 📍 Chemins des Fichiers Clés

| Rôle | Chemin Absolu |
|---|---|
| **Script CLI de génération** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/scripts/generate_chapter_card.py` |
| **Composant Remotion React** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/financial-forensics/src/compositions/ChapterCard/ChapterCardScene.tsx` |
| **Déclaration Composition** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/financial-forensics/src/Root.tsx` |
| **Dossier de destination** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/episodes/01-ruja-ignatova/assets/texte_card/` |

---

## 🎯 Dans quel cas l'utiliser ?

1. **Annonce de Partie ou d'Acte Majeur** :
   * Ex : `PART 01 // DISPARITION : THE WOMAN WHO VANISHED WITH $4 BILLION`.
   * `PART 02 // LE MÉCANISME : HOW THE $4B PONZI OPERATED`.
2. **Transition de Chapitre sans Typing** :
   * Contrairement aux *Title Cards* de repères spatio-temporels qui utilisent une frappe au clavier sonore, les **Chapter Cards** s'ouvrent d'un coup de manière statutaire avec l'étirement vertical de la colonne lumineuse et un glissement fluide du texte.
3. **Superposition 100% Transparente (Canal Alpha ProRes 4444)** :
   * Zéro boîte opaque ni cadre copié : le bloc graphique flotte avec élégance sur la vidéo (drone, carte animée, archive).

---

## 🎨 Caractéristiques Visuelles Signature

* **Colonne latérale (Spine) :** Filet vertical effilé avec dégradé lumineux cyan néon (`#38BDF8`).
* **Micro-badge judiciaire :** Tag de partie encadré (ex: `PART 01` en police monospace `JetBrains Mono`) suivi du tag d'investigation (`// DISPARITION`).
* **Titre principal :** Typographie dense et percutante (`Oswald`) en blanc glacier (`#F8FAFC`).
* **Sous-titre / Métadonnées :** Informations d'enquête aérées (`letter-spacing: 3.5px`) en gris acier (`#94A3B8`).
* **Micro-dérive vivante :** Léger zoom continu (1.0 → 1.018) et oscillation lente pour éviter toute fixité.

---

## 💻 Utilisation en Ligne de Commande

### 1. Exemple Standard (Partie 01 - Gauche) :
```bash
.venv/bin/python scripts/generate_chapter_card.py \
    --num "01" \
    --tag "DISPARITION" \
    --title "THE WOMAN WHO VANISHED WITH $4 BILLION" \
    --subtitle "SOFIA, BULGARIE • OCTOBRE 2017" \
    --pos left \
    --duration 4.5 \
    --out "episodes/01-ruja-ignatova/assets/texte_card/chapter_01_woman_who_vanished.mov"
```

### 2. Exemple Centré (Sans numéro) :
```bash
.venv/bin/python scripts/generate_chapter_card.py \
    --tag "LE MÉCANISME" \
    --title "HOW THE $4B PONZI ACTUALLY OPERATED" \
    --subtitle "ONECOIN INVESTIGATION" \
    --pos center \
    --accent "#38BDF8" \
    --duration 4.0 \
    --out "episodes/01-ruja-ignatova/assets/texte_card/chapter_mechanism.mov"
```

---

## ⚙️ Options et Paramètres CLI

| Argument | Type | Valeur par défaut | Description |
|---|---|---|---|
| `--title` | `str` | *Requis* | Titre principal du chapitre. |
| `--num`, `--number` | `str` | `""` | Numéro de la partie (ex: `01`, `02`, `I`). |
| `--tag` | `str` | `"DOSSIER D'ENQUÊTE"` | Tag éditorial supérieur (ex: `DISPARITION`, `LE MÉCANISME`). |
| `--subtitle` | `str` | `""` | Sous-titre ou métadonnées contextuelles. |
| `--pos`, `--position` | `str` | `"left"` | Position : `left` (défaut), `center`, `right`. |
| `--duration` | `float` | `4.5` | Durée totale en secondes. |
| `--accent`, `--color` | `hex` | `"#38BDF8"` | Couleur signature de la colonne et du tag (Cyan Financial Forensics). |
| `--title-color` | `hex` | `"#F8FAFC"` | Couleur du titre (Blanc glacier). |
| `--subtitle-color`| `hex` | `"#94A3B8"` | Couleur du sous-titre (Gris acier). |
| `--fps` | `int` | `25` | Cadence d'images (25 FPS standard chaîne). |
| `--out` | `str` | *Requis* | Chemin complet du fichier `.mov` généré. |

---

## 🎬 Intégration Kdenlive

* Déposer le fichier `.mov` sur la piste **`V3_OVERLAYS`** au début de la séquence ou du chapitre.
* Sa transparence native laisse voir le plan vidéo de **`V2_MAIN`** tout en posant clairement la structure narrative.
