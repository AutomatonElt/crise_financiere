# REGISTRE DES OBJETS ATOMIQUES — FTX : NINE DAYS TO ZERO
### Financial Forensics — Épisode 02 · Source de vérité des assets (compagnon de `Montage.md`)

> **Rôle :** découper *tout* ce que la vidéo montre en objets isolés, réutilisables et référencés par identifiant. Chaque plan de `Montage.md` assemble au plus **3 de ces objets** (1 décor + 1 personnage + 1 objet). Le prompt de plan n'a donc plus besoin de redécrire quoi que ce soit : c'est ce qui garantit la cohérence.
> **Chemin cible :** `episodes/02-ftx/assets/` (arborescence en fin de document).

---

## 0. Principes de génération des assets

1. **Un asset = une image maître** (Nano Banana dans Flow ou Snapgen), générée **seule**, sur fond neutre, **sans texte et sans logo**.
2. **Décors vides** : jamais de personnage dedans. Le mannequin y entre en vidéo, jamais à la génération du décor.
3. **Personnages** : une seule image maître de face en pied (Full body). Les différents cadrages et angles (dos, trois-quarts, profil, mains/poignets) sont générés directement dans Google Flow grâce à l'option **Body** intégrée.
4. **Objets** : un objet par image, fond gris uni, éclairage unique venant du haut-gauche, usure réelle.
5. **États** : un objet qui change (poussière, fissure, ouvert/fermé) devient plusieurs images (`-A`, `-B`…). Voir la matrice d'états en fin de document.
6. **Contrôle de conformité :** même mannequin d'une image à l'autre (même blanc mat, même corps lisse et continu, sans coupure ni jointure de robot). Une image qui dérive est **refusée**.
7. **Nomenclature standardisée (fichiers & Google Flow) :**
   - **Personnages maîtres :** `CHR-XXX_master.jpg` (ex. `CHR-SBF_master.jpg`).
   - **Nom du slot dans Google Flow :** `CHR-SBF`, `CHR-ELL`, `CHR-CZ`, `CHR-RAY`, `CHR-WANG`, `CHR-SING`, `CHR-SAL`, `CHR-LD`, `CHR-ENQ`, `CHR-POL`.
   - **Déclinaisons Flow (option Body) :** `CHR-XXX_master` (face / plein pied), `CHR-XXX_back` (vue de dos), `CHR-XXX_hands` (macro poignets/mains), `CHR-XXX_medium` (buste / 3-quarts).
   - **Décors :** `ENV-XX_nom.jpg` (ex. `ENV-04_table_oak.jpg`).
   - **Objets & états :** `PRP-XXX_nom_état.jpg` (ex. `PRP-FTT_jeton_B-fissure.jpg`).

### Descripteur mannequin (MAN) — identique pour tous les personnages
```
Smooth matte white mannequin with a perfectly human, natural anatomy, sculpted as one single continuous seamless surface like a smooth white plaster statue. Faceless egg-shaped head with no hair, no ears and no facial features. Neck, shoulders, arms, elbows, wrists, hands, fingers, legs and knees completely smooth and continuous: no joints, no seams, no cuts, no gaps, no segmentation, no mechanical parts, not a robot, not a wooden artist's doll. Hands are natural human hands with five softly sculpted fingers. Plain light-grey seamless background, soft even studio light, photographic, no text.
```

### Préfixe objets (PRP) — à coller avant chaque sujet
```
Isolated product photograph on a plain mid-grey seamless background, soft single-source light from the upper left, sharp detail, authentic wear and a little dust, no text, no logos. Subject:
```

### Préfixe décors (ENV) — à coller avant chaque sujet
```
Wide photograph, no people, no readable text, no logos, natural film grain, practical lighting, real surfaces with dust and wear. Scene:
```

---

## 1. ENVIRONNEMENTS (décors vides)

| ID | Nom | Sujet à générer (EN) | Utilisé dans |
|---|---|---|---|
| **ENV-01** | PENTHOUSE_INT — « l'Aquarium » | `Luxury penthouse living room in Nassau at night. Floor-to-ceiling glass wall onto a dark ocean, cold white marble floor strewn with tangled black cables, glass meeting tables with takeaway boxes and soda cans, an old cathode-ray television on a low table in one corner, a worn blue beanbag against a wall. Warm lamps at 2700K, blue monitor spill. 24mm lens, eye level.` | H09, N09 |
| **ENV-01X** | PENTHOUSE_EXT | `Seen from a rain-soaked terrace at night through a floor-to-ceiling glass wall into the penthouse living room. Drops running down the glass, a faint reflection of the ocean, warm interior light and red monitor reflections. 35mm lens, locked-off.` | H13 |
| **ENV-02** | BUREAU_SBF | `Cluttered open-plan workstation: six monitors on one desk (screens off), tangled cables, empty cans, an old wooden chair, a worn blue beanbag under the desk with a crumpled grey plaid, a half-empty cup, a mathematics textbook. One warm desk lamp (2700K) and cold blue window spill. 28mm lens.` + **variante jour** `(same room in dull daylight through a dirty window)` | H02, N01, N23, R04, R12, R20, B17, B19, P11 |
| **ENV-03** | SERVEURS | `Long symmetrical corridor of black server racks stretching into darkness, blinking LEDs, polished concrete floor, overhead cable trays, cold cyan glow (5600K), faint haze. 24mm lens, low angle, centred.` + **variante** `(aisle between two facing racks with a thick bundle of braided cables running across)` | H01, N13, R28 |
| **ENV-04** | SALLE_ENQUÊTE — « la table » | `Quiet investigation room: a large dark oak table, a brass banker's lamp, venetian blinds letting in thin window light, a wooden filing cabinet, a cork board on a plain brick wall, sealed archive boxes on a shelf. Warm 2700K lamp pools, cold window fill. 35mm lens, eye level.` | H05, N19, N22, N27, N30, B01–B05, B09, B18, M05, M12, O12, O14 |
| **ENV-05** | TRIBUNAL | `Federal courtroom: dark mahogany panelling, a witness stand with a gooseneck microphone, a clerk's table, a defence table, tall austere windows with flat daylight, a plain wall clock, heavy oak doors at the back. Neutral cold light at 90°. 28mm lens.` | K01–K14, K16 |
| **ENV-05X** | TRIBUNAL_EXT | `Stone steps of a neoclassical courthouse in daylight, empty, heavy doors at the top, long hard shadows. 28mm lens.` | K15 |
| **ENV-06** | BUREAU_DIRIGEANT | `Executive corner office at night: floor-to-ceiling window over a dense generic city skyline, minimal desk, polished floor, cold blue city light with one warm desk lamp. 35mm lens.` | N07 |
| **ENV-07** | SALLE_MARCHÉ | `Empty trading floor at night: rows of desks with several dark monitors and black landline handsets, a ticker-tape machine in the foreground, marble floor, soft practical desk lamps, an unlettered green emergency sign. 28mm lens.` | N12, N14 |
| **ENV-08** | HALL_BANQUE | `Grand marble bank hall at night: teller positions with brass grilles and a steel security gate, a heavy vault door in the background, cold overhead light. 24mm lens.` | N17 |
| **ENV-09** | SALLE_COFFRES — « hommage Spaggiari » | `Basement safe-deposit room: a floor-to-ceiling wall of numbered steel boxes with brass key locks, a heavy round vault door standing slightly open at the far end, cold top light, fine dust in the air. 28mm lens.` + **états** `(A: tout fermé · B: un tiroir ouvert avec plateau de feutre vide · C: chambre forte vide, étagères nues)` | H07, R14, R16 |
| **ENV-10** | ENTREPÔT_PREUVES | `Evidence warehouse: tall steel shelving with identical blank archive boxes, polished concrete floor, flat cold fluorescent light, a long steel table, light haze. 28mm lens.` | H04, O09 |
| **ENV-11** | SALLE_CONSEIL | `Boardroom: a very long polished table, burgundy leather chairs, a glass wall onto a dusk skyline, warm tungsten ceiling spots, low golden sun through the glass. 28mm lens.` | R01, R09, R10, R13 |
| **ENV-12** | ATELIER_COUTURE | `Deserted tailor's workshop: a wooden rolling garment rail, an oak valet stand, a three-panel antique fitting mirror with spotted glass, a pine floor, slatted shutters letting in warm light and floating dust. 35mm lens.` | R17, P01, P04, P05 |
| **ENV-13** | COULOIR_PRISON | `Federal detention corridor: polished concrete floor, grey steel cell doors with narrow reinforced glass slots, flat fluorescent light, painted cinder-block walls, ventilation hum implied. 24mm lens.` | K10, O01 |
| **ENV-14** | GRILLE_NASSAU | `Wrought-iron gate in a whitewashed wall, tropical garden behind, harsh midday sun, hard black shadows, palm leaves. 35mm lens.` | N24 |
| **ENV-15** | PARKING | `Office parking row in front of a modern low-rise in harsh midday sun: a small grey compact sedan, scuffed and unwashed, between a black luxury saloon and a glossy red sports car, all unbranded. 35mm lens.` | R19 |

**Remarque sur `ENV-04` :** c'est aussi **la table du Hook** (la pièce BTC posée sur le plateau en acier au centre d'une grande table de chêne vide). C'est volontaire : le même décor ouvre et ferme la vidéo.

---

## 2. PERSONNAGES (mannequins)
 
> **Règle absolue :** **corps blanc mat lisse et continu, sans coupure ni jointure de robot**. Tête chauve et lisse sur tous les mannequins, sans exception. L'identité passe par la corpulence, le vêtement et les chaussures. Le vrai visage n'apparaît **jamais** dans une génération IA : uniquement sur les cartes preuve (`REAL-xx`).
> **Gestion dans Google Flow :** 1 image maître de face en pied par personnage (`CHR-XXX_master.jpg`). L'option **Body** de Flow gère automatiquement les différentes vues (trois-quarts, dos, profil, mains/poignets) sans dérive anatomique.

### 2.1 Nomenclature des slots personnages dans Google Flow

| Slot dans Google Flow | Fichier maître importé | Rôle / Tenue clé | Déclinaisons Body Flow |
|---|---|---|---|
| **CHR-SBF** | `CHR-SBF_master.jpg` | Sam Bankman-Fried (t-shirt anthracite, cargo, baskets grises) | `_master` (face), `_back` (dos), `_hands` (poignets) |
| **CHR-ELL** | `CHR-ELL_master.jpg` | Caroline Ellison (cardigan beige, lunettes or, talons) | `_master` (face), `_back` (dos/laptop), `_medium` |
| **CHR-CZ** | `CHR-CZ_master.jpg` | Changpeng Zhao (costume anthracite, richelieus cirés) | `_master` (face), `_back` (skyline), `_hands` (smartphone) |
| **CHR-RAY** | `CHR-RAY_master.jpg` | John Ray III (costume 3 pièces bleu nuit, lunettes) | `_master` (face), `_medium` (table), `_hands` (mallette) |
| **CHR-WANG** | `CHR-WANG_master.jpg` | Gary Wang (pull sombre, souliers noirs) | `_master` (face), `_hands` (clavier), `_back` (sortie) |
| **CHR-SING** | `CHR-SING_master.jpg` | Nishad Singh (chemise bleue, souliers marron) | `_master` (face), `_back` (sortie tribunal) |
| **CHR-SAL** | `CHR-SAL_master.jpg` | Ryan Salame (costume gris moyen sans cravate) | `_master` (face), `_medium` (barre témoins) |
| **CHR-LD** | `CHR-LD_master.jpg` | Romain sceptique (toge crème, tunique sombre, souliers cuir) | `_master` (face), `_medium` (geste roue) |
| **CHR-ENQ** | `CHR-ENQ_master.jpg` | Enquêteurs (costume sombre, gants blancs) | `_master` (face), `_hands` (fouille cartons) |
| **CHR-POL** | `CHR-POL_master.jpg` | Police bahaméenne (uniforme marine, casquette, bottes) | `_master` (face), `_hands` (chaîne et cadenas) |

### 2.2 Tableau détaillé des personnages et utilisations

| ID Flow | Nom & Description | Sujet à générer (MAN + tenue) | Signature | Utilisé dans |
|---|---|---|---|---|
| **CHR-SBF** | Sam Bankman-Fried — « le génie ascétique » | `[MAN]` + `slouched build with rounded shoulders, an oversized faded anthracite cotton t-shirt, dark cargo shorts with bellows pockets, worn grey sneakers with no logo` | T-shirt anthracite, short cargo, baskets grises | H11, H13, N01, R04, R12, R20, B19, K07, K13, P05, P11 |
| **CHR-ELL** | Caroline Ellison | `[MAN]` + `small slight build, round thin gold-framed glasses resting on the faceless head, an oversized beige chunky cable-knit cardigan over a dark collared shirt, tailored dark trousers, classic dark brown high-heeled pumps` | Lunettes rondes dorées, cardigan beige, talons | N09, K13 |
| **CHR-CZ** | Changpeng Zhao | `[MAN]` + `tall slim build, tailored anthracite wool suit, crisp white shirt, dark textured tie, mirror-polished black oxford shoes` | Richelieus cirés miroir | N07, N20 |
| **CHR-RAY** | John Ray III | `[MAN]` + `broad-shouldered build, tailored navy three-piece suit, white shirt, dark silk tie, white pocket square, thin round glasses, polished dark brown leather shoes` | Costume trois pièces bleu nuit, pochette blanche | N27, N30 |
| **CHR-WANG** | Gary Wang | `[MAN]` + `slim quiet build, a plain dark sweater, plain trousers, plain black leather shoes` | Pull sombre, souliers noirs | B09, K15 |
| **CHR-SING** | Nishad Singh | `[MAN]` + `slim build, a light blue shirt with rolled sleeves, dark trousers, brown leather shoes` | Chemise bleu clair | K15 |
| **CHR-SAL** | Ryan Salame | `[MAN]` + `medium build, a well-cut mid-grey suit, white shirt, no tie, black leather shoes` | Costume gris moyen | K11 |
| **CHR-LD** | Le « sceptique » de la publicité | `[MAN]` + `upright build, a long-sleeved dark charcoal tunic covering the whole torso and arms, with a thick draped cream-coloured wool Roman toga over it, a rope belt, and closed brown leather Roman shoes` | Toge romaine crème sur tunique sombre, souliers cuir | H10, R27 |
| **CHR-EXT-A** | Investisseurs / hedge funds (figurants) | `[MAN]` + `anthracite tailored suit, pale shirt, dark tie, dark leather shoes` — **3 variantes de corpulence** | Costume anthracite | N14, R10, R13 |
| **CHR-EXT-B** | Avocats Binance | `[MAN]` + `black suit, white shirt, dark leather shoes, carrying a black leather briefcase` — **3 variantes** | Mallette noire | N19 |
| **CHR-ENQ** | Enquêteurs | `[MAN]` + `plain dark suit, white cotton gloves, black leather shoes, no badge, no insignia` | Gants blancs | H04 |
| **CHR-POL** | Police bahaméenne | `[MAN]` + `dark navy uniform shirt, uniform cap, no insignia, black boots` | Uniforme sans écusson | N24 |

**Contrôle d'identité dans Flow :** chaque personnage doit être reconnaissable **de dos et en silhouette**. Si deux mannequins se ressemblent trop, jouer sur la corpulence avant d'ajouter des accessoires.

---

## 3. OBJETS (props) — un objet = une image maître

> Chaque sujet ci-dessous se génère avec le **préfixe objets (PRP)** du §0.
> **États** entre parenthèses : à produire en images séparées.

### 3.1 Les 6 objets totems (leitmotivs)

| ID | Objet | Sujet à générer (EN) | États | Utilisé dans |
|---|---|---|---|---|
| **PRP-BTC** | Pièce Bitcoin | `A single heavy gold coin with a plain engraved edge and a simple embossed symbol, lying flat, slightly worn` | A propre · B poussiéreuse | H05, H06, O14 |
| **PRP-COUPELLE** | Plateau en acier | `A shallow stainless-steel surgical dish, brushed finish, empty` | — | H05, H06, O14 |
| **PRP-CLE** | Clé de voiture usée | `A scratched car key with a worn black plastic head, chipped, on a rusty brass ring` | — | R18, B02, P06 |
| **PRP-POUF** | Pouf poire bleu | `A worn blue velvet beanbag chair, creased and flattened` | A occupé · B vide | R12, R20, P06 |
| **PRP-FTT** | Jeton FTT | `A heavy round brushed-black-and-gold metal token, plain face with no lettering` | A neuf · B fissuré · C nu (laiton brut) | N05, N16, B12, B13, B15 |
| **PRP-TV** | Téléviseur CRT | `An old cathode-ray television set with a curved glass screen, switched off, on a low wooden table` | A éteint · B allumé (lueur grise) | H09, H10, R27 |

### 3.2 Hook et Nine Days

| ID | Objet | Sujet à générer (EN) | Utilisé dans |
|---|---|---|---|
| **PRP-MONTRE** | Montre mécanique | `A luxury mechanical wristwatch lying on dark lacquered wood, plain dial with no brand` | H02 |
| **PRP-ROUE** | Roue de pierre | `A roughly hewn round stone wheel, about knee-high, on a bare floor` | H10 |
| **PRP-MENOTTES** | Menottes | `Steel handcuffs, closed, resting on a dark surface` | H11 |
| **PRP-IMP** | Imprimante matricielle | `A beige dot-matrix printer with continuous perforated paper feeding out of it` | N02 |
| **PRP-FEUILLE_BILAN** | Feuille de bilan | `A continuous-feed printout with a faint pre-printed column grid, otherwise blank` | N02, N04, P12 |
| **PRP-LOUPE** | Loupe | `A detective's magnifying glass with a brass ring and a wooden handle` | N04 |
| **PRP-TOUR_VERRE** | Maquette en verre | `A small scale-model skyscraper made of solid clear glass` | N06 |
| **PRP-TOUR_CARTES** | Maquette en cartes | `A small scale-model skyscraper built from stacked plain white playing cards` | N06 |
| **PRP-SMARTPHONE** | Smartphone | `A dark modern smartphone, screen dark` | N20 |
| **PRP-TEL_FIXES** | Téléphones fixes | `Three black corded landline telephone handsets on a desk` | N12, N14 |
| **PRP-TICKER** | Téléscripteur | `A vintage ticker-tape machine under a glass dome with a paper tape` | N12 |
| **PRP-SOURIS** | Souris de bureau | `A plain grey office computer mouse with its cable` | N15 |
| **PRP-CLAVIER** | Clavier mécanique | `A mechanical keyboard, plain keycaps with no lettering` | N15, B09, B10 |
| **PRP-CONTRAT** | Contrat vierge | `A two-page stapled contract, blank pages with only a faint border` | N18, N22 |
| **PRP-STYLO** | Stylo / plume | `A black ballpoint pen and a black fountain pen side by side` | N18, B03, M07, K09 |
| **PRP-CLASSEURS** | Classeurs | `A set of thick binders in beige and in burgundy leather, plain spines` | N19, R09, K14, P07, O13 |
| **PRP-CHEMISES** | Chemises cartonnées | `Several beige cardboard folders, plain, loosely stacked` + `a thick grey folder overflowing with papers` | N25, B06, M02 |
| **PRP-TAMPON** | Tampon encreur | `A wooden rubber stamp with an inked pad, face blank` | N25, R10, M08, O02 |
| **PRP-BADGE** | Badge d'accès | `A plastic magnetic employee access badge on a lanyard, blank` | N26 |
| **PRP-VALISE** | Mallette de cuir | `A black leather briefcase with two brass latches` | N27 |
| **PRP-CARTON_ENRON** | Carton poussiéreux | `A dusty cardboard archive box with a blank label` | N27 |
| **PRP-LAMPE** | Lampe de banquier | `A brass banker's lamp with a green glass shade, switched on` | B01, N30, O14 |
| **PRP-LUNETTES** | Lunettes | `A pair of thin round reading glasses` | N30, P07 |

### 3.3 The Rise

| ID | Objet | Sujet à générer (EN) | Utilisé dans |
|---|---|---|---|
| **PRP-CALENDRIER** | Calendrier mural | `A paper wall calendar with a leather-look backing, pages intact, plain numerals` + `a small cardboard desk calendar` | R02, K05, O04 |
| **PRP-PLAQUE_ACIER** | Plaque d'acier | `A thick brushed-steel plate, blank` | R07 |
| **PRP-PLAQUE_VERRE** | Plaque de verre | `A rectangular sheet of clear glass with a thin cyan edge-lit glow` | R07 |
| **PRP-PORTANT** | T-shirt et short sur cintre | `A faded black cotton t-shirt and crumpled beige cargo shorts hanging on a wooden hanger, with a small hand-stitched cloth tag` | R17, P04 |
| **PRP-PLAID** | Plaid gris | `A crumpled grey wool plaid with frayed edges` | R20, B17 |
| **PRP-LIVRE_EA** | Livre aux pages découpées | `A leather-bound book whose inner pages are cut out to form a hidden compartment` | R22 |
| **PRP-URNES** | Urnes de vote | `Two oak ballot boxes with a slot, one tied with a blue ribbon, one with a red ribbon` | R25 |

### 3.4 The Breakdown

| ID | Objet | Sujet à générer (EN) | Utilisé dans |
|---|---|---|---|
| **PRP-CARNET** | Bloc-notes jaune | `A yellow legal pad, blank, with a spiral-bound marbled notebook beside it` | B02, B03, K12 |
| **PRP-TIROIR** | Meuble à tiroirs | `A wooden filing cabinet with a pulled-out drawer full of aligned beige folders with blank tabs` | B04, B05 |
| **PRP-ENVELOPPE** | Enveloppe kraft | `A sealed kraft envelope` + `a cardboard box with a blank label` | B05 |
| **PRP-ACTE** | Acte notarié | `An official notarised document with a blind embossed seal, no readable text` | B08 |
| **PRP-MONITEUR_BEIGE** | Moniteur beige | `An old beige CRT computer monitor, screen dark` | B09 |
| **PRP-PRESSE** | Presse manuelle | `A small cast-iron manual hand press with a lever and a plain round brass blank` | B12 |
| **PRP-BALANCE** | Balance en laiton | `A cast-iron two-pan scale with brass pans, empty` | B13, B15, K16, O13 |
| **PRP-VERRE** | Verre d'eau | `A clear glass of tap water` | B16, P10 |
| **PRP-SUCRE** | Morceau de sucre | `A single plain white sugar cube` | B16 |
| **PRP-TASSE** | Tasse / thé | `A half-empty ceramic cup of tea` | B17 |

### 3.5 The Numbers, The Reckoning, The Pattern, Outro

| ID | Objet | Sujet à générer (EN) | Utilisé dans |
|---|---|---|---|
| **PRP-CALCULATRICE** | Calculatrice mécanique | `A beige mechanical desk adding machine with a roll of white paper tape` | M01 |
| **PRP-CARTONS_PREUVES** | Cartons de preuves | `A large unmarked brown archive box, lid on, plus a box of stapled blank bank slips` | M03 |
| **PRP-CERTIFICAT** | Certificat d'actions | `An ornate stock certificate on laid paper with a decorative border, no readable text` | M06 |
| **PRP-REGISTRE** | Registre comptable | `A large open accounting ledger with ruled columns` | M07, O02 |
| **PRP-CHEQUE** | Chèque | `A blank bank cheque, plain` + `a cast-iron paperweight` | M08, M12 |
| **PRP-PAPIER_MM** | Papier millimétré | `Orange graph paper pinned on a wooden drawing board with a steel ruler and a grey pencil` | M10, M11 |
| **PRP-MARTEAU** | Marteau de juge | `A wooden judge's gavel on a sounding block` | K01 |
| **PRP-CLEF_CELLULE** | Clé de cellule | `A heavy wrought-iron cell key` | K03 |
| **PRP-BLOCS** | Cinq blocs de bois | `Five solid wooden blocks of decreasing length — one long beam, one medium, one small — plus two flat engraved lines on a tabletop with no block` | K16 |
| **PRP-MIROIR** | Miroir d'essayage | `A three-panel antique fitting mirror with spotted aged glass` | P05 |
| **PRP-SOURIS_JEU** | Souris de joueur | `A black gaming mouse with a tangled cable on a leather desk pad` | P09 |
| **PRP-LIASSE** | Liasse de chèques | `A stack of banded blank cheques` | P12 |
| **PRP-VHS** | Cassette VHS | `A worn VHS cassette in a black plastic case, blank label` | P12 |
| **PRP-DOSSIER_APPEL** | Mémoire d'appel | `A thick spiral-bound legal brief, plain white cover` | O06 |
| **PRP-PETITION** | Pétition | `A single sheet of formal letterhead paper on a green blotter, a closed pen beside it` | O10 |
| **PRP-BOITE_ARCHIVE** | Boîte d'archives | `A cardboard archive box with a blank label` | O09 |
| **PRP-CHAINE** | Chaîne et cadenas | `A heavy steel chain and a large padlock` | N24 |

---

## 4. GRAPHIQUES (GFX) — rien de ceci n'est généré par Flow

| Famille | Éléments | Outil |
|---|---|---|
| **Titre maître** | `FTX — NINE DAYS TO ZERO` | `generate_main_title.py` |
| **Cartes de chapitre (×6)** | `02 THE RISE`, `03 THE BREAKDOWN`, `04 THE NUMBERS`, `05 THE RECKONING`, `06 THE PATTERN` (+ l'ouverture « Nine Days » traitée par le titre maître) | `generate_chapter_card.py --pos left --duration 4.0` |
| **Cartes-dates (×6)** | 2 nov · 6 nov · 7-8 nov · 9 nov · 10 nov · 11 nov 2022 | `generate_title_card.py` |
| **Cartes chiffrées** | 32 Md$ · 1 BTC ≈ 20 000 $ · 1,96 Md$ · 11 Md$ de créances · Salame 7,5 ans · Ellison 2 ans · Déc. 2044 · Vote 100-0 | `generate_title_card.py` |
| **Compteurs / courbes (Remotion)** | Compteur JOUR 1→9 · retraits cumulés 72 h · cours du FTT · frise 2→11 nov · split NEW YORK/TOKYO · route SF→Tokyo | Remotion `financial-forensics` (`#38BDF8`) |
| **Tampons** | `14,6 Md$` · `NON-BINDING` · `APPROVED` · `GUILTY ×7` · `REJECTED` · `RELEASED` · `118 %` · `DISTRIBUTION EN COURS` | tampon animé + son |
| **Maquettes d'écran (génériques)** | Bandeau « BREAKING — FTX CHAPTER 11 — $32B TO ZERO » · « ERROR 403 » · « DELETE VIDEO » · virement 214 M$ · registre comptable · `allow_negative = True` · message interne « reserves » | Remotion / Pillow, **sans logo réel** |
| **Surbrillances** | Ligne « FTT 5,82 Md$ » · trois mots du communiqué Binance · mot « LIQUIDATE » · « COMPLETE FAILURE OF CORPORATE CONTROLS » | `generate_evidence_card.py` |
| **Étiquettes d'objets** | Labels de dossiers, cartons, badges, tiroirs, étiquette du cintre | Pillow |
| **Couvertures de magazine (inventées)** | « THE NEXT BUFFETT? », « LE ROI DES MOINS DE 30 ANS » | Pillow, **aucun titre réel** |
| **Carte de fin** | `FINANCIAL FORENSICS — DOSSIER 02 CLOS` + abonnement | `generate_subscribe_cta.py --theme dark-gold --lang fr` |

---

## 5. ARCHIVES RÉELLES (REAL) — l'ancrage documentaire

> Chaque ligne = une pièce à **sourcer et à documenter** (origine, droits). Les décisions de justice fédérales américaines sont en général réutilisables ; les photos d'agence et captures de médias ne le sont pas sans analyse.

| ID | Pièce | Source suggérée (depuis votre liste de sources) | Utilisé dans |
|---|---|---|---|
| **REAL-01** | Portrait d'archive de SBF | Dépêches Reuters / AP | H12 |
| **REAL-02** | Siège de FTX à Nassau, crépuscule | Photo documentaire | H08, N29 |
| **REAL-03** | Siège de Nassau, plein jour | Photo documentaire | R03 |
| **REAL-04** | FTX Arena (Miami), nuit | Photo documentaire | H03, R26 |
| **REAL-05** | SBF endormi sous son bureau (photo virale) | Archive presse | R21 |
| **REAL-06** | Monoplace de F1 aux couleurs de FTX | Archive presse | R26 |
| **REAL-07** | Propriétés des Bahamas | Reuters via CBC News | B07 |
| **REAL-08** | Tweet de CZ (liquidation du FTT) | Capture archivée | N08 |
| **REAL-09** | Tweet de Caroline Ellison (22 $) | Capture archivée | N10 |
| **REAL-10** | Communiqué / tweet de Binance du 9 nov. | CoinDesk (Binance walks away) | N21 |
| **REAL-11** | Article CoinDesk du 2 nov. 2022 | CoinDesk | K06 |
| **REAL-12** | Portrait Sequoia (supprimé) | Archive web ; NPR / Business Insider | R11 |
| **REAL-13** | Audition au Congrès | Archive presse | R24 |
| **REAL-14** | Portrait de John Ray III | Archive presse | N28 |
| **REAL-15** | Ordonnance de confiscation (11,02 Md$) | CourtListener | M04 |
| **REAL-16** | Jugement de condamnation (300 mois) | Tribunal fédéral SDNY | K10 |
| **REAL-17** | Décision d'appel, juin 2026 | Courthouse News Service | O07 |
| **REAL-18** | Ordonnance de Kaplan (nouveau procès rejeté) | Tribunal fédéral SDNY | O08 |
| **REAL-19** | Vote du Sénat 100-0 | CoinDesk (16 juil. 2026), document du Sénat | O11 |
| **REAL-20** | Coupure de presse sur la grâce de CZ | Archive presse | O11 |
| **REAL-21 à 24** | Photos d'archive de Salame, Ellison, Wang, Singh | AP News / NYT | K02 |

---

## 6. BIBLIOTHÈQUE SONORE (SFX)

| Chapitre | Sons clés |
|---|---|
| **Hook** | `breaker-trip` · fans spool-down · tic-tac amplifié · cliquetis de pièce sur acier · reverb de chambre forte · tiroir blindé · CRT whine · clic de menottes · `camera-click.wav` · 9 pulsations de basse |
| **Nine Days** | clavier lourd · imprimante matricielle · tampon d'huissier · pièce creuse en plastique · cartes qui vibrent · notifications · sonneries étouffées · grille de fer · stylo sur verre · chaises métalliques · chaîne + cadenas · tampon titanesque · lunettes sur bois · bip d'erreur **générique** |
| **The Rise** | verres de cristal · whoosh grave · pages arrachées · vagues · cha-ching · quatre coups de marteau · tampon plastique · clics de souris gaming · sub-bass drop · projecteur de scène · clé sur table · chœur lointain · rafale d'obturateurs · stade étouffé · battement de cœur |
| **The Breakdown** | clic de lampe · papier kraft · tiroir en chêne · frappe unique sur Entrée · ventilateur de moniteur · presse manuelle · compas · jetons sur parquet · gonds de porte |
| **The Numbers** | impression à aiguilles · carton qui s'ouvre · punaise dans le liège · plume sur papier · tampon · pièces de cuivre · crayon sur papier millimétré · violoncelle grave |
| **The Reckoning** | marteau de juge · fer sur carton · tampons ×7 · horloge de tribunal · serrure du jury · sténotype · verrou de cellule · portes capitonnées · bois sur bois |
| **The Pattern** | plancher qui craque · balancier · autocollant arraché · tissu de coton · clé sur acajou · lunettes en écaille · clic de souris · gong de bronze |
| **Outro** | ventilation pénitentiaire · tampon bleu · verrou électrique · boîte sur étagère métallique · marteau du Sénat · clic de lampe · **silence absolu 1,5 s** |

---

## 7. MATRICE DE RÉEMPLOI — ce qui revient, et pourquoi

| Objet | Apparitions | Fonction narrative |
|---|---|---|
| **PRP-BTC + PRP-COUPELLE** | H05, H06, O14 | La pièce de l'ouverture revient poussiéreuse à la fin |
| **PRP-CLE** | R18, B02, P06 | La Corolla : du « détail de génie » au « costume moral » |
| **PRP-POUF + PRP-PLAID** | R12, R20, P06 | La nonchalance qui masque le détournement |
| **PRP-TV** | H09, H10, R27 | La publicité du Super Bowl (la même télé) |
| **PRP-FTT** | N05, N16, B12, B13, B15 | Le jeton : né, cassé, démonté |
| **PRP-BALANCE** | B13, B15, K16, O13 | Garantie → asymétrie des peines → vérité |
| **PRP-LAMPE** | B01, N30, O14 | La lumière de l'enquête : allumée au chapitre 3, éteinte à la fin |
| **ENV-04 (la table)** | 13 plans | Le décor d'enquête qui structure toute la seconde moitié |
| **PRP-CARNET** | B02, B03, K12 | Les notes d'Ellison font écho au bloc-notes de l'enquêteur |

### États à produire (continuité)

| Objet | États |
|---|---|
| **PRP-BTC** | A propre (Hook) → B voilé de poussière (Outro) |
| **PRP-FTT** | A neuf → B fissuré en deux → C laiton brut (presse) |
| **PRP-TV** | A éteint → B lueur grise |
| **ENV-09** | A tout fermé → B un tiroir ouvert, plateau vide → C chambre forte vide |
| **PRP-POUF** | A occupé → B vide |
| **PRP-LAMPE** | A allumée → B éteinte |

---

## 8. Arborescence cible

```
episodes/02-ftx/
├── Montage.md                      # le conducteur
├── Objets_Atomiques.md             # ce registre
├── assets/
│   ├── image-ai/
│   │   ├── environments/           # ENV-01 … ENV-15 (+ variantes)
│   │   ├── characters/             # CHR-xxx : face, 3/4, dos, profil, mains
│   │   └── props/                  # PRP-xxx (+ états -A, -B, -C)
│   ├── videos-flow/                # H01_…_take2.mp4, N06_…, etc.
│   ├── real/                       # REAL-01 … REAL-24 + fiche de droits
│   ├── custom-graphics/            # GFX : cartes, compteurs, tampons
│   └── sfx/                        # bibliothèque sonore
```

## 9. Checklist de validation d'un asset

- [ ] Aucun texte ni logo lisible
- [ ] Fond neutre (objet / personnage) ou décor **vide** (ENV)
- [ ] Mannequin : tête lisse, **sans cheveux**, **aucune jointure ni coupure** (corps et mains lisses, parfaitement humains, pas d'aspect robot)
- [ ] Même blanc mat, même texture que les autres personnages
- [ ] Usure et poussière visibles (pas de rendu « neuf plastique »)
- [ ] Nom de fichier conforme à `ID_nom_état.jpg`


---

## Annexe A — Ajouts v2.1

| ID | Objet | Sujet à générer (EN) | Utilisé dans |
|---|---|---|---|
| **PRP-FOND_PAPIER** | Fond de papier vierge (document hybride) | `A sheet of blank aged paper lying flat on dark wood, visible paper fibres, a soft cast shadow, a very slight curl at one corner, no text, no printing, no logo` + **variantes** `(papier journal jauni · papier à en-tête crème · papier millimétré · chèque vierge à bords tramés · carte postale)` | M08, N02, B08, R09, K02, O10 |
| **PRP-DIORAMA_COUPE** | Maquette d'immeuble en coupe | `A handmade cutaway scale model of a three-storey office building on a workshop table; each storey is a small room with tiny desks and cardboard walls; thin clear pneumatic tubes connect the floors; visible glue, paint wear and pencil marks; no text` | B14b |
| **PRP-CAPSULES** | Capsules pneumatiques | `Three small paper-and-brass pneumatic capsules lying on a workshop table, plain` | B14b |

**Deux voies pour un document, au choix :** (a) **image complète** produite par Nano Banana Pro, texte compris, relue mot à mot ; (b) `PRP-FOND_PAPIER` + typographie d'époque et tampon en GFX, quand la typographie doit être parfaite. Dans les deux cas le texte et les nombres sont dictés par la voix off (règle 12 du `Montage.md`).


---

## Annexe B — Images dessinées (chaîne photo → dessin → page de cahier → plan)

> Méthode décrite au §16.2 de `Montage.md`. Les prompts ci-dessous sont pour **Nano Banana Pro** (étapes 2 et 3) puis **Flow** (étape 4). Chaque dessin est un asset atomique à part entière, réutilisable comme `PRP-xx`.

### B.1 Objets supports (à générer une fois)

| ID | Objet | Sujet à générer (EN) |
|---|---|---|
| **PRP-CAHIER_PAGE** | Page de cahier d'enquêteur | `An open spiral-bound notebook lying flat on a dark oak table, a blank squared page on the right, worn corners, a few faint coffee rings, soft lamp light from the left, no text, no writing` — **variantes** `(bloc jaune · papier millimétré · page d'agenda · carnet à couverture marbrée)` |
| **PRP-CRAYON** | Crayon et gomme | `A worn HB pencil, a sharpener and a grey eraser on a wooden table` |

### B.2 Étapes et prompts types

**Étape 2 — Version dessinée** (1 référence : l'objet)
```
Redraw the object from the reference as a hand-drawn graphite pencil sketch on plain off-white paper: HB pencil line, soft cross-hatching for shadows, a few visible construction lines, small handwritten capital-letter French annotations with thin arrows, no colour, no photograph, slightly imperfect proportions as if drawn by a person.
```

**Étape 3 — Page de cahier** (2 références : [1] le dessin, [2] `PRP-CAHIER_PAGE`)
```
Place the pencil drawing from reference 1 onto the open notebook page from reference 2, as if it had been drawn directly on that page: same graphite pressure and line quality, the page's squares still visible through the drawing, matching paper grain and lighting. Keep the annotations exactly as written. Add nothing else.
```

**Étape 4 — Plan vidéo** (Flow, *Frames to Video* avec l'image de l'étape 3 en première image)
```
Locked-off top-down shot of the notebook page. A slow push-in of 4%. The pencil tip enters frame and adds one short stroke to the drawing, then lifts away. Soft lamp light, a faint breath of air moves the page corner. [STYLE]
```
(Autres mouvements possibles : le coin de page qui se soulève, une main qui tourne la page, un surligneur qui souligne un mot. **Un seul mouvement par plan.**)

### B.3 Dessins à produire pour FTX

| ID | Dessin | Source (étape 1) | Remplace ou complète | Annotation manuscrite (à relire) |
|---|---|---|---|---|
| **DRAW-01** | Deux cercles reliés par une flèche | — (tracé direct) | B03 | « FTX » · « ALAMEDA » |
| **DRAW-02** | Boucle fermée du FTT en 4 étapes | `PRP-FTT` | B14 | « FTX CRÉE » → « ALAMEDA DÉTIENT » → « EMPRUNTE » → « SOUTIENT LE COURS » |
| **DRAW-03** | Immeuble en coupe, un étage par société, tubes entre les étages | `PRP-DIORAMA_COUPE` | B14b | « FTX » (haut) · « ALAMEDA » (bas) |
| **DRAW-04** | Balance : jetons FTT contre billets | `PRP-BALANCE` | B13 | « GARANTIE ? » |
| **DRAW-05** | Deux racks reliés par un faisceau de câbles | `ENV-03` (variante) | R28 | « SERVEURS FTX » · « SERVEURS ALAMEDA » |
| **DRAW-06** | Parcours d'un dépôt client vers quatre destinations | — | B06 | « DÉPÔT CLIENT » → « ALAMEDA » → « PERTES / STARTUPS / IMMOBILIER / DONS » |
| **DRAW-07** | Carte de Nassau avec les propriétés repérées | photo réelle de Nassau | B07 | « NASSAU » · « ± 300 M$ » |
| **DRAW-08** | Frise des neuf jours à la main | `PRP-CALENDRIER` | N29 | « 2 NOV » … « 11 NOV » |
| **DRAW-09** | Courbe 32 Md$ → 0 | `PRP-CALCULATRICE` | M01 (variante) | « JAN 2022 : 32 Md$ » · « NOV 2022 : 0 » |
| **DRAW-10** | Courbe plate contre courbe qui monte, zone hachurée | `PRP-PAPIER_MM` | M10 | « COURS GELÉ » · « LE MANQUE À GAGNER » |

**Règle de validation :** chaque mot et chaque chiffre de l'annotation est comparé au script avant l'étape 4. Une faute d'orthographe ou un chiffre faux dans un dessin est pire qu'un texte incrusté en GFX : dans ce cas, refaire l'étape 3 ou passer par le GFX pour cette annotation.