# 🏷️ Composant Réutilisable : Title Card / Repères Spatio-Temporels

Générateur de cartes de titre vidéo transparentes avec effet machine à écrire, typographie lourde style enquête, maintien à l'écran (Hold) et son de clavier mécanique réel synchronisé lettre par lettre.

---

## 📍 Chemins des Fichiers Clés

| Rôle | Chemin Absolu |
|---|---|
| **Script CLI de génération** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/scripts/generate_title_card.py` |
| **Composant Remotion React** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/financial-forensics/src/compositions/TitleCard/TitleCardScene.tsx` |
| **Déclaration Composition** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/financial-forensics/src/Root.tsx` |
| **Source Audio Clavier Réel** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/_shared/sfx/typing/soumages-keyboard-typing-579122.mp3` |
| **Échantillons Découpés** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/_shared/sfx/typing/samples/` |

---

## 🎯 Dans quel cas l'utiliser ?

1. **Repère Temporel & Géographique (Cas principal)** :
   * Introduire une date et un lieu clé (ex: `OCTOBRE 2017` / `SOFIA — ATHÈNES`).
   * Marquer un saut temporel ou un changement de pays dans l'enquête.
2. **Chiffre Clé ou Montant Choc** :
   * Mettre en valeur une somme ou une statistique sur 1 seule ligne (ex: `4 MILLIARDS DE DOLLARS`, `12 MILLIONS DE VICTIMES`).
3. **Classification & Dossier Judiciaire** :
   * Afficher un statut d'enquête ou une référence judiciaire (ex: en haut à droite `CONFIDENTIEL` / `DOSSIER FBI #091`).
4. **Superposition sur tout type de fond** :
   * Le fond est **100% transparent (Canal Alpha ProRes 4444)** avec ombrage cinéma profond pour garantir une lisibilité absolue sur des vidéos de drones, des cartes, des interviews ou des photos d'archives.

---

## 💻 Utilisation en Ligne de Commande

### 1. Exemple Standard (2 lignes : Date + Lieu)
```bash
.venv/bin/python scripts/generate_title_card.py \
    --line1 "OCTOBRE 2017" \
    --line2 "SOFIA — ATHÈNES" \
    --out "episodes/01-ruja-ignatova/assets/custom-graphics/title_01_sofia_athens.mov"
```

### 2. Exemple sur 1 seule ligne (Chiffre clé / révélation)
```bash
.venv/bin/python scripts/generate_title_card.py \
    --line1 "4 MILLIARDS DE DOLLARS" \
    --out "episodes/01-ruja-ignatova/assets/custom-graphics/chiffre_4milliards.mov"
```

### 3. Exemple avec Position et Couleurs Personnalisées
```bash
.venv/bin/python scripts/generate_title_card.py \
    --line1 "CONFIDENTIEL" \
    --line2 "DOSSIER FBI #091" \
    --pos top-right \
    --color1 "#EF4444" \
    --color2 "#FFFFFF" \
    --hold 4.0 \
    --out "episodes/01-ruja-ignatova/assets/custom-graphics/badge_fbi.mov"
```

---

## ⚙️ Paramètres et Options Disponibles

| Argument | Type | Valeur par défaut | Description |
|---|---|---|---|
| `--line1` | `str` | *Requis* | Texte de la première ligne (haut). |
| `--line2` | `str` | `""` (optionnel) | Texte de la deuxième ligne (bas). Si vide, seule la ligne 1 est affichée. |
| `--out` | `str` | *Requis* | Chemin complet du fichier `.mov` généré. |
| `--pos`, `--position` | `str` | `"bottom-left"` | Position à l'écran : `bottom-left`, `bottom-right`, `top-left`, `top-right`, `center`. |
| `--color1` | `hex` | `"#38BDF8"` | Couleur de la ligne 1 (Bleu ciel / cyan lumineux). |
| `--color2` | `hex` | `"#E0F2FE"` | Couleur de la ligne 2 (Blanc glacier teinté). |
| `--hold` | `float` | `3.0` | Secondes d'affichage fixe et immobile après la fin de la frappe. |
| `--duration` | `float` | `None` (auto) | Durée totale en secondes. Calculée automatiquement si omise (`frappe + hold + 0.5s fondu`). |
| `--start1` | `float` | `0.32` | Instant de départ de la frappe de la ligne 1 (en secondes). |
| `--start2` | `float` | `None` (auto) | Instant de départ de la ligne 2. Par défaut : 0.40s après la fin de la ligne 1. |
| `--speed` | `int` | `14` | Vitesse d'écriture en caractères par seconde. |
| `--audio` | `str` | `DEFAULT_AUDIO` | Fichier source des touches réelles (utilise `soumages-keyboard-typing-579122.mp3`). |
| `--fps` | `int` | `25` | Cadence d'images par seconde (standard chaîne: 25 FPS). |

---

## 🎞️ Spécifications Techniques de Sortie

* **Format conteneur** : QuickTime `.mov`
* **Codec vidéo** : Apple ProRes 4444 (`prores_ks`, profile 4)
* **Pixel Format** : `yuva444p10le` / `yuva444p12le` (**Canal Alpha 100% transparent**)
* **Résolution** : 1920 × 1080
* **Cadence** : 25.0 FPS
* **Codec audio intégré** : PCM 16-bit stéréo 48 000 Hz, volume normalisé à -1.5 dBFS.
* **Fichier compagnon WAV** : Un fichier `.wav` identique est généré au même emplacement pour un mixage séparé si nécessaire.

---

## 🎬 Intégration dans le Montage Kdenlive

1. Glisser le fichier `.mov` dans le dossier de projet ou le chutier Kdenlive.
2. Placer le clip sur la piste **`V3_OVERLAYS`** à l'endroit exact de l'annonce vocale.
3. Le clip ne nécessite aucun masque ni incrustation : sa transparence native laisse voir la vidéo principale de `V2_MAIN`.
4. La piste audio intégrée se coupe automatiquement dès que l'écriture est terminée, assurant un silence total pendant la tenue à l'écran.
