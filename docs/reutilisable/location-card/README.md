# 📍 Carte de Lieu & d'Archive (LocationCard)

> **Inspiration :** Habillage visuel cinématique inspiré des enquêtes de la chaîne **"Furtif"**.  
> **Type d'asset :** Overlay vidéo transparent **Apple ProRes 4444** (Canal Alpha total) ou plan monté avec fond.  
> **Piste Timeline Kdenlive :** `V2_OVERLAYS` (sur fond B-roll/Rushs) ou `V1_MAIN` (si fond intégré).  
> **Script Python :** [`scripts/generate_location_card.py`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/scripts/generate_location_card.py)  
> **Scène Remotion :** [`financial-forensics/src/compositions/LocationCard/LocationCardScene.tsx`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/financial-forensics/src/compositions/LocationCard/LocationCardScene.tsx)

---

## 🎯 Rôle & Cas d'Usage

Le générateur **LocationCard** permet d'introduire un lieu marquant, un bâtiment clé, une scène de crime ou une preuve géographique dans un style visuel d'archive authentique :
* **Présentation d'un siège social ou complexe** (ex: *FTX Arena, Miami*, *Siège de OneCoin, Sofia*).
* **Repère visuel géographique avec chiffre choc** (ex: badge *"32 MILLIARDS $"* ou *"CONFIDENTIEL"*).
* **Mise en valeur d'une photo d'époque** sans le look plat d'un simple rectangle posé sur la timeline.

---

## 🎨 Styles Visuels Disponibles

### 1. Style `postcard` (Défaut recommandé)
* Passe-partout élégant papier d'archive ivoire (`#F4F1EA`).
* Filet noir fin d'encadrement intérieur (`1.5px solid rgba(15,23,42,0.18)`).
* Badge supérieur rouge carmin ou doré pour les montants chocs (`32 MILLIARDS $`).
* Titre géant en typographie sans-serif lourde (`Cabinet Grotesk` / `Cinzel` / `Inter`).
* Sous-titre avec coordonnées spatio-temporelles (`MIAMI, FLORIDE // JANVIER 2022`).
* Micro-inclinaison subtile (tilt de 1 à 2 degrés) et ombre portée douce à 3 étages.

### 2. Style `feathered`
* Bords adoucis fondus (masque progressif radial/elliptique).
* S'intègre naturellement par-dessus des images d'archives ou des vidéos sombres sans coupure franche.
* Idéal pour les documents d'archives sensibles ou les plans d'ambiance crépusculaires.

---

## ⚡ Commandes CLI Rapides

### 1. Carte de lieu standard avec badge de montant choc :
```bash
.venv/bin/python scripts/generate_location_card.py \
    --image "episodes/02-ftx/assets/real/REAL-04_ftx_arena_miami_nuit.jpg" \
    --title "FTX ARENA" \
    --subtitle "MIAMI, FLORIDE // JANVIER 2022" \
    --badge "32 MILLIARDS $" \
    --style postcard \
    --position right \
    --duration 3.0 \
    --out "episodes/02-ftx/assets/custom-graphics/H03_location_card_ftx_arena.mov"
```

### 2. Variante à gauche avec photo d'archive adoucie (`feathered`) :
```bash
.venv/bin/python scripts/generate_location_card.py \
    --image "episodes/01-ruja-ignatova/assets/real-footage/sofia-headquarters.jpg" \
    --title "SIÈGE ONECOIN" \
    --subtitle "SOFIA, BULGARIE // OCTOBRE 2017" \
    --style feathered \
    --position left \
    --duration 4.0 \
    --out "episodes/01-ruja-ignatova/assets/custom-graphics/card_sofia_feathered.mov"
```

### 3. Variante avec incrustation directe sur une vidéo de fond (Compositing direct) :
```bash
.venv/bin/python scripts/generate_location_card.py \
    --image "episodes/02-ftx/assets/real/REAL-04_ftx_arena_miami_nuit.jpg" \
    --title "FTX ARENA" \
    --subtitle "MIAMI, FLORIDE" \
    --bg "episodes/02-ftx/assets/stock_video/miami_night_drone.mp4" \
    --duration 3.5 \
    --out "episodes/02-ftx/assets/custom-graphics/H03_composite_final.mp4"
```

---

## 🛠️ Options Complètes du Script

| Option | Défaut | Description |
|---|---|---|
| `--image` | *(Obligatoire)* | Chemin absolu ou relatif de la photo source. |
| `--title` | `None` | Titre en majuscules (ex: `FTX ARENA`). |
| `--subtitle` | `""` | Sous-titre géographique et temporel. |
| `--badge` | `""` | Badge choc supérieur (ex: `32 MILLIARDS $`, `CONFIDENTIEL`). |
| `--style` | `postcard` | Style visuel : `postcard` (ivoire vintage) ou `feathered` (bords fondus). |
| `--position` | `right` | Ancrage horizontal : `right`, `left`, `center`. |
| `--duration` | `3.0` | Durée totale de la séquence en secondes. |
| `--card-width` | Auto (selon style) | Largeur de la carte en pixels (`580px` pour postcard, `680px` pour feathered). |
| `--aspect-ratio` | Auto | Ratio d'aspect de la photo (`1.45` pour postcard, `1.50` pour feathered). |
| `--tilt` | Auto | Angle d'inclinaison de la carte en degrés (`1.2°` à droite, `-1.2°` à gauche). |
| `--offset-x` | `0` | Décalage horizontal fin en pixels. |
| `--offset-y` | Auto | Décalage vertical fin en pixels. |
| `--bg` | `None` | Chemin d'une vidéo ou image de fond pour rendu composite direct. |
| `--fps` | `25` | Cadence d'images (25 FPS standard chaîne). |
| `--out` | *(Obligatoire)* | Chemin du fichier de sortie (`.mov` ProRes 4444 ou `.mp4`). |

---

## 🎬 Placement dans la Timeline Kdenlive

```text
[V3_TITLES]    : (Vide ou TitleCard superposé si nécessaire)
[V2_OVERLAYS]  : ───[ H03_location_card_ftx_arena.mov (ProRes Alpha) ]───
[V1_MAIN]      : ───[ Plan B-Roll ou Stock Video (ex: Miami drone nuit) ]───
[A1_VOICE]     : "...En janvier 2022, le nom de FTX s'affiche sur l'Arena de Miami..."
[A2_MUSIC]     : Musique de fond continue (-18 dBFS)
[A3_SFX]       : Déclencheur photo ou whoosh discret à l'apparition
```
