# 📸 Composant Réutilisable : Fiche Personnage / Preuve (EvidenceCard)

Générateur de fiches visuelles transparentes avec animation vivante, déclencheur photo au pop et viseurs forensic pour afficher les photos de suspects, personnages réels, lieux ou pièces à conviction.

---

## 📍 Chemins des Fichiers Clés

| Rôle | Chemin Absolu |
|---|---|
| **Script CLI de génération** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/scripts/generate_evidence_card.py` |
| **Composant Remotion React** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/financial-forensics/src/compositions/EvidenceCard/EvidenceCardScene.tsx` |
| **Déclaration Composition** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/financial-forensics/src/Root.tsx` |
| **Son Déclencheur Caméra** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/_shared/sfx/camera-shutter/79190__nathan_lomeli__iphone-camera-click.wav` |

---

## 🎯 Dans quel cas l'utiliser ?

1. **Présentation d'un Personnage Réel / Suspect** :
   * Introduire le visage d'un protagoniste (ex: Ruja Ignatova, Sam Bankman-Fried, Mark Scott) tout en laissant la vidéo principale tourner en arrière-plan.
2. **Lieu Historique ou Bâtiment d'Archive** :
   * Superposer une photo d'époque ou d'archive (façade d'hôtel, tribunal, banque, île des Bahamas).
3. **Pièce à Conviction & Document d'Enquête** :
   * Révéler un document confidentiel, un passeport falsifié, un avis de recherche du FBI ou une capture d'écran de transaction.

---

## 🎨 Styles et Animation

* **Style 1 : `clean` (Par défaut)** :
  * La photo pure flottante, bords nets (radius 6px), ombre portée cinéma naturelle (`box-shadow` profonde).
  * Zéro cadre artificiel.
* **Style 2 : `print` (Tirage d'archive papier)** :
  * Passe-partout élégant ivoire / blanc cassé (`#F4F1EA`) façon tirage argentique ou carte postale d'archive.
* **Style 3 : `soft` (Bords doux & fondus flottants - Style documentaire)** :
  * Bords adoucis et estompés (masque dégradé progressif radial sans coupe nette), coins arrondis (26px), vignettage sombre interne et halo diffus pour faire flotter l'archive de façon organique au-dessus du plan vidéo.
* **Position par défaut** : **À DROITE EN BAS** de l'écran (`right` avec décalage vers le bas `offset-y: +85px`).
* **Animation vivante (Floating Drift)** :
  * Dérive organique lente (oscillation verticale douce de `±6px` et micro-rotation vivante `±0.5°`).
  * Lent zoom continu (1.0 → 1.025) pour éviter toute fixité.
* **Son de caméra optionnel** : Activé par défaut (`--sound`), ou désactivable (`--no-sound`).

---

## 💻 Utilisation en Ligne de Commande

### 1. Style Pur Sans Cadre (Clean - Recommandé) :
```bash
.venv/bin/python scripts/generate_evidence_card.py \
    --image "episodes/01-ruja-ignatova/assets/real-footage/fbi-ignatova-wanted-photo.jpg" \
    --style clean \
    --pos right \
    --duration 5.0 \
    --out "episodes/01-ruja-ignatova/assets/texte_card/card_ruja_clean.mov"
```

### 2. Style Tirage d'Archive avec Bordure Ivoire (Print) :
```bash
.venv/bin/python scripts/generate_evidence_card.py \
    --image "episodes/01-ruja-ignatova/assets/real-footage/fbi-ignatova-wanted-photo.jpg" \
    --style print \
    --pos right \
    --duration 5.0 \
    --out "episodes/01-ruja-ignatova/assets/texte_card/card_ruja_print.mov"
```

### 3. Style Bords Doux Fondus Flottants (Soft - Documentaire) :
```bash
.venv/bin/python scripts/generate_evidence_card.py \
    --image "episodes/01-ruja-ignatova/assets/real-footage/fbi-ignatova-wanted-photo.jpg" \
    --style soft \
    --pos right \
    --duration 5.0 \
    --out "episodes/01-ruja-ignatova/assets/texte_card/card_ruja_soft.mov"
```

### 4. Ajustement de la hauteur / Position personnalisée :
```bash
# Pour baisser encore plus la carte vers le bas (ex: offset +120px) :
.venv/bin/python scripts/generate_evidence_card.py \
    --image "chemin/vers/image.jpg" \
    --style soft \
    --pos right \
    --offset-y 120 \
    --out "chemin/vers/sortie.mov"
```

---

## ⚙️ Options et Paramètres CLI

| Argument | Type | Valeur par défaut | Description |
|---|---|---|---|
| `--image` | `str` | *Requis* | Chemin absolu ou relatif de la photo source (JPG, PNG, WebP). |
| `--out` | `str` | *Requis* | Chemin complet du fichier vidéo `.mov` généré. |
| `--style`, `--border` | `str` | `"clean"` | Style : `clean` (photo pure nette), `print` (tirage ivoire), `soft` (bords doux et fondus). |
| `--pos`, `--position` | `str` | `"right"` | Position à l'écran : `right` (défaut), `left`, `center`, `bottom-right`, `bottom-left`. |
| `--offset-y` | `int` | `85` | Décalage vertical en pixels vers le bas (défaut: 85px pour ancrage bas-droit). |
| `--duration` | `float` | `5.0` | Durée totale de la vidéo en secondes. |
| `--width` | `int` | `520` | Largeur du cadre en pixels. |
| `--sound` / `--no-sound` | `flag` | `True` (avec son) | Activer ou désactiver le déclencheur photo au début. |
| `--audio` | `str` | iPhone Click | Fichier audio du déclencheur (`79190__...__iphone-camera-click.wav`). |
| `--fps` | `int` | `25` | Cadence (standard chaîne: 25 FPS). |

---

## 🎬 Intégration Kdenlive

* Déposer le fichier `.mov` sur la piste **`V3_OVERLAYS`** au timecode souhaité.
* Le fond transparent révèle instantanément le plan vidéo de fond situé sur **`V2_MAIN`**.
* La piste audio intégrée claque au moment précis de l'apparition de la carte.
