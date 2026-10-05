# 📰 Composant Réutilisable : Affiches, Couvertures & Articles de Presse (MagazinePoster)

Générateur de scènes d'articles de presse, couvertures de magazines, coupures de journaux et dossiers d'archives pour la chaîne YouTube **Financial Forensics**.
Le composant met en scène n'importe quel document ou capture de presse sur un **fond bleu royal dégradé animé en continu avec grille épurée**, un conteneur document blanc élégant (avec ombre cinéma portée douce et reflet papier glacé), sans encombrement de texte ni surcharge.

---

## 📍 Chemins des Fichiers Clés

| Rôle | Chemin Absolu |
|---|---|
| **Script CLI de génération** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/scripts/generate_magazine_poster.py` |
| **Composant Remotion React** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/financial-forensics/src/compositions/MagazinePoster/MagazinePosterScene.tsx` |
| **Déclaration Composition** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/financial-forensics/src/Root.tsx` (`id="MagazinePoster"`) |
| **Dossier de destination type** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/episodes/01-ruja-ignatova/assets/custom-graphics/` |
| **Son Whoosh par défaut** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/_shared/sfx/whoosh/whoosh_medium.wav` |

---

## 🎯 Dans quel cas l'utiliser ?

1. **Couverture de Magazine ou Presse Internationale** :
   * Mettre en scène une couverture de presse célèbre (ex: *Forbes*, *Financial IT*, *Fortune*, *The Economist*, *Wired*).
2. **Article de Presse, Advertorial & Preuves Médiatiques** :
   * Révéler un article en ligne, une publication de réseau social ou un dossier d'archive avec un maximum de lisibilité, sans bordure parasite.
3. **Documents et Rapports d'Archive** :
   * Présenter un communiqué officiel, un rapport d'audit ou un mémorandum interne avec un rendu haute définition.

---

## 🎨 Caractéristiques Visuelles

* **Fond bleu royal dégradé uniforme et vivant :**
  * Dégradé radial saphir & bleu royal profond (`#1656c7` ➔ `#051842`).
  * Faisceau lumineux doux en mouvement sinusoïdal pour donner de la vie sans créer de contraste agressif.
  * Grille géométrique épurée (`60x60px`), nette et fine.
  * Zéro particule/point parasite, zéro mention HUD encombrante dans les coins pour laisser le document respirer.
* **Mise en scène du document :**
  * Monture papier blanche pure aux coins adoucis (`16px`), fidèle au standard des présentations documentaires modernes.
  * Ombre portée cinéma profonde et douce (`box-shadow` multicouche réaliste).
  * **Zéro contour or artificiel** : contours neutres et purs pour respecter la nature du document.
  * **Balayage lumineux diagonal de reflet glacé (*Glossy Paper Sheen*) :** un reflet translucide traverse le document peu après l'entrée pour donner la texture tactile du papier d'imprimerie.
* **Motion Design & Audio :**
  * **100% Silencieux par défaut** (aucun effet sonore parasite, prêt pour le montage ; activation optionnelle via `--sound`).
  * **Document agrandi** : remplit ~82% de la hauteur de l'écran avec marges équilibrées et préservation totale des en-têtes/pieds de page.
  * Entrée fluide avec physique de ressort doux (*spring damping* avec légère bascule 3D).
  * **Lévitation 3D et dérive vivante permanente** : oscillation continue en Y (±16px) et X (±12px), inclinaison en lacet (RotY ±2.5°), tangage (RotX ±1.5°) et roulis (RotZ ±1.1°).
  * **Dérive interne de l'image** : micro-mouvement fluide de l'affiche dans son passe-partout.
  * Travelling avant continu (*Cinematic Push-in* 1.0 ➔ 1.045) sur toute la durée de la séquence.
  * Double balayage diagonal de reflet papier glacé (*Glossy Paper Sheen*).
  * Ombre portée dynamique et réaliste réagissant à l'altitude de lévitation.

---

## 💻 Utilisation en Ligne de Commande

### 1. Exemple Standard (Document seul épuré)
```bash
.venv/bin/python scripts/generate_magazine_poster.py \
    --image "episodes/01-ruja-ignatova/assets/footage-reel/ignotova_affiche_magazine.jpeg" \
    --duration 8.0 \
    --out "episodes/01-ruja-ignatova/assets/custom-graphics/poster_financial_it.mp4"
```

### 2. Exemple avec Titre sous la Carte
```bash
.venv/bin/python scripts/generate_magazine_poster.py \
    --image "episodes/01-ruja-ignatova/assets/footage-reel/ignatova_affiche_forbes.jpeg" \
    --title "FORBES BULGARIA" \
    --show-title \
    --duration 5.0 \
    --out "episodes/01-ruja-ignatova/assets/custom-graphics/poster_forbes_bulgaria.mp4"
```

---

## ⚙️ Options et Paramètres CLI

| Argument | Type | Valeur par défaut | Description |
|---|---|---|---|
| `--image` | `str` | *Requis* | Chemin absolu ou relatif de l'image (JPG, PNG, WebP). Convertie automatiquement en Data URI. |
| `--title` | `str` | `""` | Titre optionnel. |
| `--show-title` | `flag` | `False` | Active l'affichage d'un titre typographique blanc épuré sous la carte. |
| `--card-width` | `int` | `840` | Largeur maximale du conteneur en pixels. |
| `--duration` | `float` | `5.0` | Durée totale de la vidéo en secondes. |
| `--fps` | `int` | `25` | Cadence en images par seconde (standard chaîne: 25). |
| `--sound` / `--no-sound` | `flag` | `True` (avec son) | Active ou désactive le Whoosh cinématique d'entrée. |
| `--whoosh` | `str` | `DEFAULT` | Chemin d'un effet sonore whoosh alternatif. |
| `--out` | `str` | *Requis* | Chemin complet du fichier vidéo de sortie (`.mp4` ou `.mov`). |

---

## 🎬 Intégration Kdenlive / OTIO

* **Piste :** Déposer le fichier généré sur la piste **`V1_MAIN`** pour une séquence en pleine largeur.
* **Audio :** Le flux audio intégré comporte déjà le whoosh d'impact synchronisé.
