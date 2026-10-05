# 🎬 Pipeline de Production Vidéo — Financial Forensics

Ce dossier consolide le pipeline technique et artistique pour la chaîne YouTube **"Financial Forensics"** (enquêtes criminelles financières).
Le système gère la création de bout en bout : voix off TTS, transcription horodatée mot par mot, animations programmatiques Motion Design (Remotion), overlays vidéo transparents (ProRes 4444 Alpha), banques SFX synchronisées et montage automatisé Kdenlive via OpenTimelineIO (OTIO).

---

## 🧭 Guide Rapide pour les Nouveaux Agents & Monteurs

| Ressource | Emplacement | Ce que vous y trouverez |
|---|---|---|
| **📍 Outils & Environnement** | [`docs/outils.md`](docs/outils.md) | **Source de vérité** : chemins absolus de Python `.venv`, Remotion, Node, FFmpeg, Kdenlive et état des banques SFX. |
| **📦 Composants Réutilisables** | [`docs/reutilisable/`](docs/reutilisable/) | Catalogue des générateurs et composants modulaires prêts à l'emploi (Titres, Cartes, Graphiques). |
| **🏷️ Générateur de Titres** | [`docs/reutilisable/title-card/`](docs/reutilisable/title-card/README.md) | Guide complet du générateur de repères spatio-temporels et chiffres clés avec son clavier calé. |
| **👑 Grand Titre d'Épisode** | [`docs/reutilisable/main-title/`](docs/reutilisable/main-title/README.md) | Guide complet du grand titre monumental de l'épisode sur fond sombre immersif et or gravé. |
| **📖 Titres de Chapitres & d'Actes** | [`docs/reutilisable/chapter-card/`](docs/reutilisable/chapter-card/README.md) | Guide complet du générateur de titres de parties et d'actes (grand numéro or, séparateur vertical, sans typing). |
| **📸 Fiches Preuves & Suspects** | [`docs/reutilisable/evidence-card/`](docs/reutilisable/evidence-card/README.md) | Guide complet du générateur de photos/suspects transparentes (`clean`/`print`/`soft`), dérive vivante et obturateur photo. |
| **📰 Affiches & Articles de Presse** | [`docs/reutilisable/magazine-poster/`](docs/reutilisable/magazine-poster/README.md) | Guide complet de mise en scène 3D d'articles et couvertures sur fond bleu dégradé animé, reflet papier glacé et whoosh. |
| **🎞️ Spécifications Montage** | [`docs/specification_montage.md`](docs/specification_montage.md) | Règles de montage, découpage des scènes et structure de timeline 7 pistes. |
| **⚙️ Pipeline OTIO** | [`docs/PIPELINE_OTIO.md`](docs/PIPELINE_OTIO.md) | Fonctionnement de l'ingestion automatique de timeline rough cut vers Kdenlive. |

---

## 🗂️ Structure du Répertoire

* **`scripts/`** : Usines d'automatisation Python.
  * `generate_title_card.py` : **Générateur universel de titres / dates & lieux cinéma** (vidéos ProRes 4444 avec canal alpha total, son de clavier synchronisé sur chaque lettre et positionnement dynamique).
  * `generate_main_title.py` : **Générateur du grand titre maître d'épisode** (séquence monumentale sur fond sombre cinéma immersif, or gravé et travelling lent).
  * `generate_chapter_card.py` : **Générateur universel de titres de chapitres & d'actes** (vidéos ProRes 4444 avec canal alpha total, grand numéro or, séparateur vertical et ouverture douce).
  * `generate_evidence_card.py` : **Générateur universel de fiches preuves / suspects** (overlays ProRes 4444 avec canal alpha total, photo pure `clean`, tirage d'archive `print` ou bords doux fondus `soft`, dérive vivante et déclencheur caméra iPhone calé frame 0).
  * `generate_magazine_poster.py` : **Générateur d'affiches, couvertures de magazines & articles de presse** (scènes 3D immersives sur fond bleu dégradé animé, reflet papier glacé et son whoosh).
  * `agent_otio.py` : Conformation automatique des rough cuts sur l'architecture standard 7 pistes (V1-V3, A1-A4).
  * `build_cutting_script.py` : Générateur de conducteur de montage reliant la voix, les timecodes et les assets.
  * `transcribe.py` : Transcription Whisper haute précision mot par mot (Groq API).
  * `generate_voiceover.py` : Génération de voix off haute fidélité (ElevenLabs).
* **`financial-forensics/`** : Projet Motion Design (React 19 + TypeScript + Remotion + Three.js).
* **`_shared/sfx/`** : Banque d'effets sonores identitaires de la chaîne.
  * `typing/` : Enregistrements réels de frappes de touches mécaniques (`soumages-keyboard-typing-579122.mp3` et échantillons découpés).
  * `whoosh/` : Whooshes cinématiques pour transitions.
  * `camera-shutter/` : Clics d'obturateurs iPhone réels (`79190__...__iphone-camera-click.wav`) pour reveals photo/dossier.
  * `beats/` : Stabs sonores dramatiques.
* **`episodes/`** : Dossiers de production par vidéo.
  * `01-ruja-ignatova/` : Épisode pilote (OneCoin / The Cryptoqueen).
  * `02-ftx/` : Épisode 2 (Sam Bankman-Fried / FTX).
* **`docs/`** : Documentation technique, stratégique et composants réutilisables.
  * `reutilisable/` : Index et documentations des modules et générateurs réutilisables.
  * `outils.md` : Inventaire complet des outils et dépendances locales.

---

## ⚡ Commandes Fréquentes

```bash
# 1. Générer un titre cinéma (Date + Lieu) transparent avec son clavier calé :
.venv/bin/python scripts/generate_title_card.py \
    --line1 "OCTOBRE 2017" \
    --line2 "SOFIA — ATHÈNES" \
    --out "episodes/01-ruja-ignatova/assets/custom-graphics/mon_titre.mov"

# 2. Générer une fiche photo de suspect flottante (Clean ou Print) avec son obturateur :
.venv/bin/python scripts/generate_evidence_card.py \
    --image "episodes/01-ruja-ignatova/assets/real-footage/fbi-ignatova-wanted-photo.jpg" \
    --style clean \
    --pos right \
    --out "episodes/01-ruja-ignatova/assets/custom-graphics/card_ruja_clean.mov"

# 3. Lancer le studio de prévisualisation Remotion :
cd financial-forensics && npm run start

# 4. Conformer une timeline OTIO pour Kdenlive :
.venv/bin/python scripts/agent_otio.py
```
