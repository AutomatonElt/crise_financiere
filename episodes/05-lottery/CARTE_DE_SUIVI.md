# 📋 CARTE DE SUIVI DE PRODUCTION — ÉPISODE 05 : LOTTERY
> **Titre de l'épisode :** *The Ledger — They Bought Every Single Ticket*  
> **Format :** 1080p 25 FPS · Enquête financière narrative  
> **Statut global :** 🟡 En cours de production  

---

## 📌 ÉTAPE 1 : ÉCRITURE & ADAPTATION VOCALE (VOICEOVER)
- [x] **1.1** Script V2 rédigé en français avec la nouvelle bible (`STYLE_NARRATIF.md` & `GRAMMAIRE_MONTAGE.md`)
- [x] **1.2** Nettoyage intégral de toutes les balises de régie et de montage (`( … )`, `[TEXTE]`, `[SCHÉMA]`, etc.)
- [x] **1.3** Traduction intégrale en anglais américain parlé, percutant et oralisé
- [x] **1.4** Intégration des directives de prosodie et audio tags **Eleven v4** (`[Low, steady voice]`, `[Cold, low, measured voice]`, ellipses et tirets cadencés)
- [x] **1.5** Découpage en 3 blocs compatibles ElevenLabs (< 10 000 caractères) avec Request Stitching
  - [x] `block-01-hook-mandel.txt` (5 744 caractères)
  - [x] `block-02-selbee-ginther.txt` (6 781 caractères)
  - [x] `block-03-tipton-pattern-outro.txt` (4 531 caractères)
- [x] **1.6** Relecture qualité : vérification de la prosodie, des nombres humains et mise à niveau de `scripts/generate_voiceover.py` vers le modèle `eleven_v4` et `output_format="mp3_44100_128"`

---

## 🎙️ ÉTAPE 2 : GÉNÉRATION AUDIO & SYNCHRONISATION MOT-À-MOT
- [x] **2.1** Génération vocale ElevenLabs v4 :
  - [x] **Bloc 1** (`voiceover_block-01.mp3`, 369.63s / 6m10s, Request-ID: `wCVxF1nsY6hOZwf21REg`)
  - [x] **Bloc 2** (`voiceover_block-02.mp3`, 405.55s / 6m45s, Request-ID: `5J51ElROX9j4pERCsGVN`)
  - [x] **Bloc 3** (`voiceover_block-03.mp3`, 268.67s / 4m28s, Request-ID: `qlp7yrws4JMeDLs7YcY8`)
  - [x] **Master final assemblé** : [`voiceover_en.mp3`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/episodes/05-lottery/tts/voiceover_en.mp3) (1 043.80s / 17m24s, 24.5 Mo)
- [x] **2.2** Transcription Whisper mot-par-mot via `scripts/transcribe_en_timestamps.py` :
  - [x] [`voiceover_en_words.json`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/episodes/05-lottery/transcription/voiceover_en_words.json) (2 673 mots horodatés avec précision milliseconde)
- [x] **2.3** Horodatage de l'épisode complet validé (1 043.80s / 17m24s)

---

## 🎨 ÉTAPE 3 : FABRICATION DES ASSETS GRAPHIQUES & MOTION DESIGN
### A. Title Cards Spatio-Temporelles (`scripts/generate_title_card.py` - ProRes 4444 Alpha sur V3)
- [ ] **3.1** `VIRGINIA — FEBRUARY 1992`
- [ ] **3.2** `1986 — SYDNEY`
- [ ] **3.3** `EVART, MICHIGAN — 2003`
- [ ] **3.4** `DES MOINES, IOWA — DECEMBER 2010`
- [ ] **3.5** Chiffres clés : `7,059,052 COMBINATIONS`, `26 MILLION DOLLARS`

### B. Grand Titre Maître d'Épisode (`scripts/generate_main_title.py` - sur V1)
- [ ] **3.6** `THE LEDGER` / `THEY BOUGHT EVERY TICKET` (Or gravé, travelling lent, whoosh pur)

### C. Chapter Cards (`scripts/generate_chapter_card.py` - ProRes 4444 Alpha sur V2)
- [ ] **3.7** Acte 1 : `THE FUND MANAGER` (Stefan Mandel)
- [ ] **3.8** Acte 2 : `THE RETIREES` (Jerry & Marge Selbee)
- [ ] **3.9** Acte 3 : `THE PROFESSOR` (Joan Ginther)
- [ ] **3.10** Acte 4 : `THE LINE` (Eddie Tipton)

### D. Fiches Personnages & Preuves (`scripts/generate_evidence_card.py` - sur V2)
- [ ] **3.11** Stefan Mandel (Photo d'archive + shutter cliqué frame 0)
- [ ] **3.12** Jerry & Marge Selbee (Photo d'archive / portrait de supérette)
- [ ] **3.13** Joan Ginther (Photo / document d'enquête)
- [ ] **3.14** Eddie Tipton (Photo de police / badge)

### E. Animations Procédurales & Schémas Dédiés
- [ ] **3.15** Grille de probabilités (7 059 052 points / 78% allumés en vert, 22% gris)
- [ ] **3.16** Schéma de la cascade Roll-down (pyramide qui déborde)
- [ ] **3.17** Timeline des 81 jours d'impression machine en continu

### F. Reconstitutions Cinématiques & Biomes IA (Pipeline RFIA Studio)
- [x] **3.18** Intégration des 3 Skills RFIA (`rfia-direction-artistique`, `rfia-personnages-realistes`, `rfia-realisation-video`) dans `.agents/skills/`
- [x] **3.19** Verrouillage de la Bible Visuelle des 5 Biomes & Décors (RFIA Studio) :
  - [x] **Lieu 1 : Virginia 1992 (L'Entrepôt Mandel)** : [`virginia_warehouse_1992.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/biomes/virginia_warehouse_1992.png)
  - [x] **Lieu 2 : Bucarest / Sydney (1960s-1980s - Bureau Mathématique Mandel)** : [`mandel_study_bucharest_1970s.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/biomes/mandel_study_bucharest_1970s.png)
  - [x] **Lieu 3 : Michigan / Massachusetts 2003 (Motel des Selbee)** : [`selbee_motel_room_2003.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/biomes/selbee_motel_room_2003.png)
  - [x] **Lieu 4 : Texas 2000s (Station-Service & Épicerie Joan Ginther)** : [`texas_convenience_store_2000s.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/biomes/texas_convenience_store_2000s.png)
  - [x] **Lieu 5 : Iowa MUSL 2010 (Salle des Serveurs Sécurisée Eddie Tipton)** : [`iowa_musl_server_room_2010.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/biomes/iowa_musl_server_room_2010.png)
- [x] **3.20** Casting & Modélisation Flow (Onglet Portrait = Face rapprochée & Entier | Onglet Corps = Triptyque 3 vues) :
  - [x] **Stefan Mandel** :
    - Portrait visage rapproché : [`stefan_mandel_portrait_face.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/characters/stefan_mandel_portrait_face.png)
    - Portrait seul entier : [`stefan_mandel_portrait_single.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/characters/stefan_mandel_portrait_single.png)
    - Triptyque 3 vues corps : [`stefan_mandel_corps_triptyque.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/characters/stefan_mandel_corps_triptyque.png)
  - [x] **Jerry Selbee** :
    - Portrait visage rapproché : [`jerry_selbee_portrait_face.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/characters/jerry_selbee_portrait_face.png)
    - Portrait seul entier : [`jerry_selbee_portrait_single.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/characters/jerry_selbee_portrait_single.png)
    - Triptyque 3 vues corps : [`jerry_selbee_corps_triptyque.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/characters/jerry_selbee_corps_triptyque.png)
  - [x] **Marge Selbee** :
    - Portrait visage rapproché : [`marge_selbee_portrait_face.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/characters/marge_selbee_portrait_face.png)
    - Portrait seul entier : [`marge_selbee_portrait_single.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/characters/marge_selbee_portrait_single.png)
    - Triptyque 3 vues corps : [`marge_selbee_corps_triptyque.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/characters/marge_selbee_corps_triptyque.png)
  - [x] **Joan Ginther** :
    - Portrait visage rapproché : [`joan_ginther_portrait_face.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/characters/joan_ginther_portrait_face.png)
    - Portrait seul entier : [`joan_ginther_portrait_single.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/characters/joan_ginther_portrait_single.png)
    - Triptyque 3 vues corps : [`joan_ginther_corps_triptyque.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/characters/joan_ginther_corps_triptyque.png)
  - [x] **Eddie Tipton** :
    - Portrait visage rapproché : [`eddie_tipton_portrait_face.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/characters/eddie_tipton_portrait_face.png)
    - Portrait seul entier : [`eddie_tipton_portrait_single.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/characters/eddie_tipton_portrait_single.png)
    - Triptyque 3 vues corps : [`eddie_tipton_corps_triptyque.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/characters/eddie_tipton_corps_triptyque.png)
### G. Pièces à Conviction & Props Narratifs Modulaires (Couche 2)
- [x] **3.21 Stefan Mandel (Bucarest 1970s — Condensation Combinatoire)** :
  - Master 2D vectoriel : [`mandel_calculation_sheet_1970s.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/props/mandel_calculation_sheet_1970s.png)
  - Cahier physique relié ouvert (Fond neutre studio) : [`mandel_diegetic_notebook_1970s.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/props/mandel_diegetic_notebook_1970s.png)
- [x] **3.22 Jerry & Marge Selbee (Massachusetts 2003 — Cash WinFall)** :
  - Master 2D brochure & tickets : [`selbee_winfall_brochure_tickets.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/props/selbee_winfall_brochure_tickets.png)
  - Dépliant plié, tickets thermiques & stylo (Fond neutre studio) : [`selbee_diegetic_brochure_tickets.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/props/selbee_diegetic_brochure_tickets.png)
- [x] **3.23 Joan Ginther (Texas 2000s — Grattage 50$ $140M Extreme Payout)** :
  - Master 2D ticket & reçu : [`ginther_texas_scratchoff.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/props/ginther_texas_scratchoff.png)
  - Ticket gratté ($10M sur 23), US quarter, copeaux & reçu (Fond neutre studio) : [`ginther_diegetic_scratchoff.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/props/ginther_diegetic_scratchoff.png)
- [x] **3.24 Eddie Tipton (Iowa 2010 — Backdoor RNG MUSL)** :
  - Master 2D code source C++ & badge : [`tipton_usb_code_evidence.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/props/tipton_usb_code_evidence.png)
  - Feuille imprimée audit, badge d'accès & clé USB (Fond neutre studio) : [`tipton_diegetic_usb_console.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/props/tipton_diegetic_usb_console.png)

### H. Cinématiques & Découpages 5-plans (Couche 3)
- [/] **3.25** Génération des B-roll et découpages 5-plans (Google Flow — Omni 1.1 Flash 4s) :
  - [x] **Séquence 1 · Hook (Virginie Février 1992 — Découpage complet & Validé)** :
    - Plan 0 (Établissement Aérien Virginie Février 1992) : [`sequence_01_hook_plan_00_aerial_virginia.mp4`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/cinematics/sequence_01_hook_plan_00_aerial_virginia.mp4) (1080p 25 FPS)
    - Plan 1 (Master Dolly Aisle) : [`sequence_01_hook_plan_01.mp4`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/cinematics/sequence_01_hook_plan_01.mp4) (1080p 25 FPS)
    - Plan 2 (Insert Racks & Cartons) : [`sequence_01_hook_plan_02.mp4`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/cinematics/sequence_01_hook_plan_02.mp4) (1080p 25 FPS)
    - Plan 3 (Insert Liasses & Imprimante matricielle) : [`sequence_01_hook_plan_03.mp4`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/cinematics/sequence_01_hook_plan_03.mp4) (1080p 25 FPS)
    - Plan 4 (Plateau TV Tirage 1992) : [`sequence_01_hook_plan_04.mp4`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/cinematics/sequence_01_hook_plan_04.mp4) (1080p 25 FPS)
    - Plan 5 (Recul Écran CRT & Pénombre) : [`sequence_01_hook_plan_05.mp4`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/cinematics/sequence_01_hook_plan_05.mp4) (1080p 25 FPS)
    - Teaser 1 (Selbee Motel Flashback) : [`sequence_01_teaser_selbee_motel.mp4`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/cinematics/sequence_01_teaser_selbee_motel.mp4) (1080p 25 FPS)
    - Teaser 2 (Ginther Texas Scratch-off) : [`sequence_01_teaser_ginther_texas.mp4`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/cinematics/sequence_01_teaser_ginther_texas.mp4) (1080p 25 FPS)
    - Teaser 3 (Tipton Iowa Server Terminal) : [`sequence_01_teaser_tipton_server.mp4`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/cinematics/sequence_01_teaser_tipton_server.mp4) (1080p 25 FPS)
  - [ ] **Séquence 2 · Mandel (Bucarest 1970s — 5 plans)**
  - [ ] **Séquence 3 · Selbee (Michigan / Massachusetts — 5 plans)**
  - [ ] **Séquence 4 · Ginther (Texas 2000s — 5 plans)**
  - [ ] **Séquence 5 · Tipton (Iowa MUSL 2010 — 5 plans)**

---

## 🎞️ ÉTAPE 4 : CONFORMATION DE LA TIMELINE KDENLIVE (OTIO)
- [ ] **4.1** Génération du conducteur de montage reliant transcription et visuels
- [ ] **4.2** Conformation de la timeline 7 pistes via `scripts/agent_otio.py` -> `05-lottery.otio`
  - V3 : Repères spatio-temporels, chiffres clés, HUD
  - V2 : Cartes de chapitres, fiches personnages
  - V1 : B-Roll, stock footage, grand titre, schémas
  - A1 : Voix off principale (respiration au Grand Titre)
  - A2 : Nappe musicale continue (-18 dBFS)
  - A3 : SFX whooshs, déclencheurs photo, clavier mécanique
  - A4 : Sons d'ambiance / archives
- [ ] **4.3** Vérification des repères de timeline (secondes décimales dans OTIO)
- [ ] **4.4** Import réussi dans Kdenlive (`Fichier > OpenTimelineIO import`)

---

## 💎 ÉTAPE 5 : FINITION & MASTERING (KDENLIVE .KDENLIVE)
- [ ] **5.1** Enregistrement au format natif `.kdenlive`
- [ ] **5.2** Application des zooms lents (Ken Burns 100% -> 105%) sur les plans fixes
- [ ] **5.3** Ducking audio (baisse de la musique sous la voix narrateur)
- [ ] **5.4** Validation humaine finale et rendu master 1080p 25 FPS
