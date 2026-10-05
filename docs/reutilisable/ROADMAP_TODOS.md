# 🗺️ Roadmap & TODOs : Arsenal des Composants Réutilisables — Financial Forensics

Ce document formalise la feuille de route des **composants modulaires réutilisables** à développer pour ancrer l'identité visuelle et sonore de la chaîne YouTube *Financial Forensics*.

Chaque composant est pensé pour s'intégrer nativement dans la stack automatisée :
- **Moteur Graphique :** Remotion (React / TypeScript / Canvas / SVG) dans `financial-forensics/src/compositions/`
- **Exécution CLI :** Script Python wrapper dans `scripts/generate_*.py` avec paramètres en ligne de commande
- **Format de Rendu :** Apple ProRes 4444 (`.mov` avec canal alpha natif) ou H.264 (`.mp4`)
- **Topologie Timeline :** Positionnement normalisé sur `V2_OVERLAYS` ou `V3_TITLES`
- **Sound Design Synchrone :** Effet sonore dédié sur `A3_SFX_WHOOSH` calé à la frame 0

---

## 📌 Statut Global des Composants

| Composant | Rôle | Statut | Piste OTIO | CLI / Chemin |
|---|---|---|---|---|
| **MainTitle** | Grand Titre Billboard gravé or (Hook → Acte 1) | ✅ **Validé** | `V1_MAIN` + `A3` | `scripts/generate_main_title.py` |
| **TitleCard** | Cartes de repères spatio-temporels (date, lieu, montant) | ✅ **Validé** | `V3_TITLES` + `A3` | `scripts/generate_title_card.py` |
| **ChapterCard** | Annonce de chapitre avec grand numéro or et séparateur | ✅ **Validé** | `V2_OVERLAYS` | `scripts/generate_chapter_card.py` |
| **EvidenceCard** | Fiche suspect / bâtiment / pièce à conviction flottante | ✅ **Validé** | `V2_OVERLAYS` + `A3` | `scripts/generate_evidence_card.py` |
| **MagazinePoster** | Affiche 3D de magazine / article sur fond bleu dégradé animé | ✅ **Validé** | `V1_MAIN` + `A3` | `scripts/generate_magazine_poster.py` |
| **Forensic3DDocument** | Document / Pièce à conviction 3D avec caméra virtuelle & reflets spéculaires | ✅ **Validé** | `V1_MAIN` / `V2` + `A3` | `scripts/generate_3d_document.py` |
| **SubscribeCTA** | Widget d'abonnement YouTube interactif avec curseur | ✅ **Validé** | `V2_OVERLAYS` | `scripts/generate_subscribe_cta.py` |
| **Document Highlighter** | Pièce judiciaire / email secret / surlignage feutre animé | ✅ **Validé** | `V2_OVERLAYS` / `V1` | `scripts/generate_document_evidence.py` |
| **Forensic Status Stamp** | Tampon officiel percutant (ARRESTED, GUILTY, MOST WANTED) | ✅ **Validé** | `V3_TITLES` + `A3` | `scripts/generate_status_stamp.py` |
| **Ledger Title Card** | Billboard d'ouverture post-hook officiel *The Ledger* (polaroids, cursive, titre) | ✅ **Validé** | `V1_MAIN` + `A3` | `scripts/generate_ledger_title.py` |
| **Money Trail Flowchart** | Schéma animé de circuit de blanchiment et sociétés écrans | 📋 **TODO** | `V1_MAIN` / `V2` | *À créer : `scripts/generate_money_trail.py`* |
| **Loss Odometer** | Compteur de montants chocs à défilement rapide ($0 → $4B) | 📋 **TODO** | `V3_TITLES` + `A3` | *À créer : `scripts/generate_loss_odometer.py`* |
| **Quote Card** | Citation choc avec grande guillemet or et source badge | 📋 **TODO** | `V2_OVERLAYS` | *À créer : `scripts/generate_quote_card.py`* |
| **Route / Tracking Map** | Carte sombre vectorielle avec trajectoire de fuite animée | 📋 **TODO** | `V1_MAIN` / `V2` | *À créer : `scripts/generate_tracking_map.py`* |

---

## 🛠️ Spécifications Détaillées des Nouveaux Composants (TODOs)

---

### 📋 TODO 1 : Le "Document Highlighter & Redaction" (`generate_document_evidence.py`)

* **Concept éditorial :** Dans chaque crime financier, la bascule se fait sur un document écrit : un email privé compromettant (*"Take the money and run"* pour Ruja), un acte d'accusation du DOJ/SDNY, un relevé de compte bancaire maquillé ou un audit interne falsifié.
* **Aspect visuel :**
  - Fond papier judiciaire texturé sombre ou ivoire avec filigrane discret ("CONFIDENTIAL", "EXHIBIT A").
  - Extrait de document avec typographie type machine à écrire (`Courier Prime`) ou police d'email professionnelle.
  - **Animation A (Surlignage) :** Un trait de feutre translucide jaune fluo ou or signature vient surligner dynamiquement la phrase clé de gauche à droite.
  - **Animation B (Déclassification) :** Une bande noire opaque de censure glisse ou se dissout pour révéler le passage caché.
* **Sound Design Signature :**
  - Léger froissement de dossier papier en entrée + crissement net de marqueur feutre (*felt-tip marker squeak*).
* **Paramètres CLI prévus :**
  ```bash
  .venv/bin/python scripts/generate_document_evidence.py \
      --header "EXHIBIT B — INTERNAL MEMO" \
      --date "OCTOBER 20, 2014" \
      --text "Take the money and run and blame someone else." \
      --highlight "Take the money and run" \
      --style dark_legal \
      --duration 4.5 \
      --out episodes/01-ruja-ignatova/assets/evidence/doc_memo_run.mov
  ```
* **Checklist technique :**
  - [ ] Créer la composition Remotion `DocumentEvidence.tsx`
  - [ ] Coder l'effet de tracé SVG progressif pour le coup de surligneur
  - [ ] Intégrer les variantes `dark_legal` (sombre) et `vintage_paper` (papier d'archive)
  - [ ] Intégrer les bruitages dans `_shared/sfx/document/`
  - [ ] Écrire le script Python CLI `scripts/generate_document_evidence.py`
  - [ ] Rédiger la documentation `docs/reutilisable/document-evidence/README.md`

---

### 📋 TODO 2 : Le "Forensic Status Stamp" (`generate_status_stamp.py`)

* **Concept éditorial :** Permet de clore de manière nette et brutale le destin d'un protagoniste sans alourdir le commentaire vocal. Vient s'appliquer par-dessus une EvidenceCard ou un document.
* **Aspect visuel :**
  - Tampon rectangulaire à double cadre grunge / encreur officiel, incliné à 25–35°.
  - Couleurs disponibles : Rouge sang vif (`#DC2626`) pour culpabilité/arrestation, Or gravé (`#D4AF37`) pour verdicts d'immunité, Noir d'encre pour faillite.
  - Textes clés pré-configurés :
    - `ARRESTED — OCT 2018`
    - `GUILTY — 20 YEARS`
    - `FBI TOP 10 MOST WANTED`
    - `FUGITIVE — AT LARGE`
    - `BANKRUPT / $0`
  - Animation : Zoom avant rapide avec légère décélération physique et micro-rebond élastique à l'impact (slam).
* **Sound Design Signature :**
  - Bruitage mécanique de tampon encreur lourd + impact sub-bass mat (*percussive stamp thud*).
* **Paramètres CLI prévus :**
  ```bash
  .venv/bin/python scripts/generate_status_stamp.py \
      --text "ARRESTED" \
      --subtext "BANGKOK — OCT 2018" \
      --color red \
      --angle -28 \
      --duration 3.0 \
      --out episodes/01-ruja-ignatova/assets/texte_card/stamp_greenwood_arrested.mov
  ```
* **Checklist technique :**
  - [ ] Créer la composition Remotion `StatusStamp.tsx` avec effet d'encre tamponnée (filtres SVG d'érosion)
  - [ ] Générer l'animation d'impact physique (spring physics avec micro-décalage de rotation)
  - [ ] Sélectionner et normaliser le bruitage d'impact dans `_shared/sfx/stamps/`
  - [ ] Écrire le script Python CLI `scripts/generate_status_stamp.py`
  - [ ] Documenter le composant dans `docs/reutilisable/status-stamp/README.md`

---

### 📋 TODO 3 : Le "Money Trail / Flowchart Financier" (`generate_money_trail.py`)

* **Concept éditorial :** C'est la signature analytique de la chaîne (Pilier 1 : *The Breakdown*). Les spectateurs veulent comprendre comment une pyramide MLM ou un schéma de blanchiment fonctionne concrètement.
* **Aspect visuel :**
  - Schéma à nœuds interconnectés sur fond transparent ou semi-opaque bleu nuit.
  - Boîtes de flux : `Victimes / Investisseurs` ➔ `OneCoin Headquarter` ➔ `Fiduciaires Offshores (Îles Caïmans, Panama)` ➔ `Biens Immobiliers & Yachts`.
  - Des particules lumineuses dorées circulent dans les conduits vectoriels pour montrer le transit des capitaux.
  - Compteurs de pourcentages et de sommes associés à chaque étape.
* **Sound Design Signature :**
  - Légers clics électroniques discrets à chaque apparition de nœud + son soyeux de transfert de données.
* **Paramètres CLI prévus :**
  ```bash
  .venv/bin/python scripts/generate_money_trail.py \
      --nodes '[{"name":"Victims","val":"$4.0B"},{"name":"OneCoin Ltd","val":"$4.0B"},{"name":"Apex Fund (Dubai)","val":"$2.5B"},{"name":"Luxury Assets","val":"$1.5B"}]' \
      --duration 8.0 \
      --out episodes/01-ruja-ignatova/assets/graphics/money_trail_onecoin.mov
  ```
* **Checklist technique :**
  - [ ] Concevoir le template Remotion `MoneyTrailScene.tsx` supportant 3 à 6 nœuds
  - [ ] Implémenter l'animation de flux de particules le long des chemins SVG (strokeDashoffset)
  - [ ] Ajouter l'affichage progressif synchronisé avec le rythme de la voix off
  - [ ] Créer le wrapper Python `scripts/generate_money_trail.py`

---

### 📋 TODO 4 : Le "Loss Odometer / Compteur de Pertes" (`generate_loss_odometer.py`)

* **Concept éditorial :** Dans les introductions (Hook) ou les transitions de chapitre, annoncer un montant choc sous forme de compteur qui s'emballe crée un impact psychologique immédiat.
* **Aspect visuel :**
  - Typographie monumentale dorée avec séparateurs de milliers bien visibles.
  - Roulette digitale ultra-rapide qui monte de `$0` à `$4,000,000,000` en 2,5 secondes.
  - Micro-cartouche sous le montant : *(Equivalent to 2.3x the GDP of Belize)* ou *(Over 3.5 Million Victims Worldwide)*.
* **Sound Design Signature :**
  - Bruit de roulette mécanique / cliquetis digital rapide (*ticker sound*) qui s'arrête net sur un claquement de coffre-fort métallique (*vault lock*).
* **Paramètres CLI prévus :**
  ```bash
  .venv/bin/python scripts/generate_loss_odometer.py \
      --amount 4000000000 \
      --currency "$" \
      --label "TOTAL INVESTOR LOSSES" \
      --comparison "MORE THAN THE GDP OF BELIZE" \
      --duration 3.5 \
      --out episodes/01-ruja-ignatova/assets/texte_card/odometer_4_billion.mov
  ```
* **Checklist technique :**
  - [ ] Développer `LossOdometer.tsx` avec accélération et décélération logarithmique
  - [ ] Synchroniser le SFX de ticker avec l'incrémentation des frames
  - [ ] Écrire le script Python CLI `scripts/generate_loss_odometer.py`

---

### 📋 TODO 5 : La "Quote Card" (`generate_quote_card.py`)

* **Concept éditorial :** Quand la narration cite les paroles exactes d'un suspect ou d'un enquêteur clé, une fiche citation épurée apporte un temps fort théâtral.
* **Aspect visuel :**
  - Grande guillemet ouvrante dorée stylisée en filigrane (`“`).
  - Citation élégante en blanc titane (police avec ou sans empattement haut de gamme).
  - Badge source en bas avec icône (ex: 🎙️ *Interview BBC 2016* ou ⚖️ *United States District Court, SDNY*).
* **Sound Design Signature :**
  - Souffle d'air très doux (*subtle low whoosh*) + nappe d'ambiance feutrée.
* **Paramètres CLI prévus :**
  ```bash
  .venv/bin/python scripts/generate_quote_card.py \
      --quote "They offered me 2 million to build a blockchain. They had nothing." \
      --author "Bjorn Bjercke" \
      --role "Blockchain Expert & Whistleblower" \
      --source "BBC Interview, 2016" \
      --duration 4.5 \
      --out episodes/01-ruja-ignatova/assets/texte_card/quote_bjercke.mov
  ```
* **Checklist technique :**
  - [ ] Développer `QuoteCard.tsx` dans Remotion avec apparition typographique douce
  - [ ] Créer le script Python CLI `scripts/generate_quote_card.py`
  - [ ] Établir la bibliothèque audio associée

---

### 📋 TODO 6 : La "Route & Flight Tracking Map" (`generate_tracking_map.py`)

* **Concept éditorial :** Les affaires criminelles internationales impliquent des fuites, des rendez-vous secrets et des livraisons de fonds dans différentes métropoles (le vol Sofia ➔ Athènes de Ruja, la livraison de papier Allemagne ➔ Canada de Bourassa).
* **Aspect visuel :**
  - Carte vectorielle mondiale sombre (style satellite nuit ou blueprint topographique).
  - Tracé lumineux reliant la ville de départ à la ville d'arrivée (ligne courbée avec impulsion lumineuse).
  - Pings radar aux deux extrémités avec coordonnées GPS, heure locale et distance en kilomètres.
* **Sound Design Signature :**
  - Pulsations sonores de balise radar + léger grésillement radio d'aviation.
* **Paramètres CLI prévus :**
  ```bash
  .venv/bin/python scripts/generate_tracking_map.py \
      --from "Sofia, Bulgaria" \
      --to "Athens, Greece" \
      --flight "Ryanair Flight 2932" \
      --date "OCTOBER 25, 2017" \
      --duration 5.0 \
      --out episodes/01-ruja-ignatova/assets/graphics/map_sofia_athens.mov
  ```
* **Checklist technique :**
  - [ ] Intégrer un fond cartographique vectoriel haute résolution
  - [ ] Animer la courbe d'itinéraire de vol avec icône d'avion ou pulse d'énergie
  - [ ] Créer le script Python CLI `scripts/generate_tracking_map.py`

---

## 🎯 Plan d'Implémentation Recommandé

1. **Sprint 1 (Finition Épisode 01 - Ruja) :**
   - **Forensic Status Stamp** : Pour estampiller l'arrestation de Greenwood à Bangkok, celle de Konstantin à LA, et le statut "FUGITIVE / MOST WANTED" de Ruja.
   - **Document Highlighter** : Pour l'email secret *"Take the money and run"*.
2. **Sprint 2 (Industrialisation pour Épisodes 02+ : Madoff, FTX, Bourassa) :**
   - **Loss Odometer** : Chiffres de la fraude de Madoff ($65 milliards) et FTX ($8 milliards).
   - **Money Trail Flowchart** : Schéma des flux financiers pour Madoff et FTX/Alameda.
3. **Sprint 3 (Perfectionnement Graphique) :**
   - **Quote Card** & **Tracking Route Map**.
