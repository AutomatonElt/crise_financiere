# 🔔 Composant Réutilisable : Fidélisation & Call-To-Action (SubscribeCTA)

Animation universelle d'engagement YouTube (**Like + S'abonner + Cloche**) avec curseur interactif, retours visuels réactifs (clics, ondes de choc, vibration de sonnerie) et effets sonores intégrés.

---

## 📍 Chemins des Fichiers Clés

| Rôle | Chemin Absolu |
|---|---|
| **Script CLI de génération** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/scripts/generate_subscribe_cta.py` |
| **Composant Remotion React** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/financial-forensics/src/compositions/SubscribeCTA/SubscribeCTAScene.tsx` |
| **Déclaration Composition** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/financial-forensics/src/Root.tsx` |
| **Dossier de destination** | `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/episodes/01-ruja-ignatova/assets/texte_card/` |

---

## 🎯 Dans quel cas l'utiliser ?

1. **Mid-roll Call-to-Action (Rappel au milieu de l'enquête)** :
   * Vers 8:00 - 12:00 lors d'une transition de chapitre (ex: à la fin de *The Breakdown* ou début de *The Numbers*).
2. **Outro / Conclusion de l'Épisode** :
   * Dans les 30 dernières secondes de la vidéo pour convertir l'audience en abonnés.
3. **Superposition Alpha ProRes 4444** :
   * Fond 100% transparent pour se placer par-dessus une carte, un graphique, une vidéo d'archives ou un b-roll sombre.

---

## 🎨 Fonctionnalités & Interactions Réactives

* **Logos Vectoriels Purs (SVG)** : Pouce Like, bouton Subscribe en pilule, Cloche avec battant et ondes de choc, curseur système haute résolution (zéro pixel flou).
* **Scénario d'Interaction (5.0s @ 25fps)** :
  1. *0.0s - 0.6s* : Apparition fluide en translation vers le haut avec rebond spring doux.
  2. *1.3s* : Le curseur clique sur **LIKE** (onde de choc cyan/bleue + pop de l'icône).
  3. *2.5s* : Le curseur clique sur **SUBSCRIBE** (compression + transition vers `SUBSCRIBED` avec coche blanche).
  4. *3.8s* : Le curseur clique sur la **CLOCHE** (onde de choc + oscillation/vibration physique de la cloche avec anneaux de sonnerie).
  5. *4.5s - 5.0s* : Disparition douce en fondu.
* **Audio SFX Muxé** : Bruits de clics de souris nets et tintement métallique synchronisés dans le fichier `.mov`.

---

## 💻 Utilisation en Ligne de Commande

```bash
# 1. Version Standard Anglaise (Recommandée pour Financial Forensics) :
.venv/bin/python scripts/generate_subscribe_cta.py \
    --theme classic-red \
    --pos bottom-center \
    --out "episodes/01-ruja-ignatova/assets/texte_card/cta_subscribe_en.mov"

# 2. Version Dark Gold (Signature or & noir) :
.venv/bin/python scripts/generate_subscribe_cta.py \
    --theme dark-gold \
    --pos bottom-right \
    --scale 1.1 \
    --out "episodes/01-ruja-ignatova/assets/texte_card/cta_subscribe_gold.mov"

# 3. Version Française (si déclinaison FR) :
.venv/bin/python scripts/generate_subscribe_cta.py \
    --lang fr \
    --out "episodes/01-ruja-ignatova/assets/texte_card/cta_subscribe_fr.mov"
```

---

## ⚙️ Options et Paramètres CLI

| Argument | Type | Valeur par défaut | Description |
|---|---|---|---|
| `--theme` | `str` | `"classic-red"` | Thème de couleur : `classic-red`, `dark-gold`, `glass-cyan`. |
| `--lang` | `str` | `"en"` | Langue : `en` (`SUBSCRIBE`/`SUBSCRIBED`) ou `fr` (`S'ABONNER`/`ABONNÉ`). |
| `--pos`, `--position` | `str` | `"bottom-center"` | Position : `bottom-center`, `bottom-right`, `bottom-left`, `center`. |
| `--scale` | `float` | `1.2` | Échelle d'agrandissement (ex: `1.0`, `1.2`, `1.4`). |
| `--duration` | `float` | `5.0` | Durée totale de l'animation en secondes. |
| `--fps` | `int` | `25` | Cadence d'images (standard chaîne: 25). |
| `--out` | `str` | *Requis* | Chemin du fichier de sortie (`.mov` ProRes 4444). |

---

## 🎬 Intégration Kdenlive

* Déposer le fichier `.mov` sur la piste **`V3_OVERLAY`** ou **`V2_MAIN`** au moment voulu.
* La transparence alpha est native et les effets sonores de clics et cloche sont déjà intégrés dans la piste audio du clip.
