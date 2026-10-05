# HOOK FTX (0:00 → 0:45) — PLAN DE PRODUCTION GOOGLE FLOW
### Ce qu'on prépare, dans quel ordre, avec quels prompts

> **Périmètre :** uniquement les 13 coupes du Hook de `Montage.md` (H01 à H13). Les assets non nécessaires au Hook (ENV-02, ENV-05…) sont reportés.
> **Volume :** 16 images maîtres · 9 générations vidéo (2 prises chacune, soit ~18 clips) · 3 photos réelles · 6 éléments GFX.

---

## 0. Avant de générer : deux points à régler sur la voix off

| Phrase du Hook | Problème | Proposition |
|---|---|---|
| « son fondateur de **vingt-neuf ans** » | Sam Bankman-Fried est né le 6 mars 1992 : il avait **30 ans** en novembre 2022 | « de trente ans » |
| « l'équivalent d'**environ un bitcoin** en réserves immédiatement disponibles » | C'est le chiffre le plus fort de la vidéo, et je n'ai pas retrouvé de source précise dans votre liste | Ajouter la source dans vos notes, ou reformuler (« une réserve dérisoire ») tant qu'elle manque |

Corrigez avant de relancer la voix off : le montage se cale sur elle, pas l'inverse.

---

## 1. Les 4 blocs de prompt à garder sous la main

**STYLE vidéo** (à coller à la fin de chaque prompt Veo)
```
Photographed on a 35mm cinema lens, shallow depth of field, natural film grain, muted slightly desaturated colour grade, practical light sources only, visible real-world imperfections (dust, scuffs, fingerprints), slow motivated camera, ambient sound only, no music, no speech, no on-screen text, no logos.
```

**MAN** (descripteur mannequin, à coller dans chaque prompt de personnage)
```
Smooth matte white mannequin with a perfectly human, natural anatomy, sculpted as one single continuous seamless surface like a smooth white plaster statue. Faceless egg-shaped head with no hair, no ears and no facial features. Neck, shoulders, arms, elbows, wrists, hands, fingers, legs and knees completely smooth and continuous: no joints, no seams, no cuts, no gaps, no segmentation, no mechanical parts, not a robot, not a wooden artist's doll. Hands are natural human hands with five softly sculpted fingers. Plain light-grey seamless background, soft even studio light, photographic, no text.
```

**Préfixe objets** (images de props)
```
Isolated product photograph on a plain mid-grey seamless background, soft single-source light from the upper left, sharp detail, authentic wear and a little dust, no text, no logos. Subject:
```

**Préfixe décors** (images d'environnements)
```
Wide photograph, no people, no readable text, no logos, natural film grain, practical lighting, real surfaces with dust and wear. Scene:
```

---

## 2. Organisation du projet dans Flow

1. Créez **un projet** nommé `FTX_02_HOOK`. Le libellé exact des boutons varie selon la version de Flow : repérez les modes **Ingredients to Video** et **Frames to Video**, et le choix du modèle d'image (**Nano Banana Pro**).
2. **Réglages de départ :** format 16:9, modèle vidéo en version rapide (**Fast**) pour les essais. On relance en qualité maximale uniquement les prises retenues.
3. **Si Flow n'offre pas de dossiers**, utilisez des préfixes de nom : `CHR_`, `ENV_`, `PRP_`, `REAL_`, `H05_take1`.
4. **Une fiche texte `STYLE.txt`** avec les blocs du §1 pour copier-coller sans erreur.
5. **Enregistrement des images maîtres :** chaque image générée est sauvegardée sous son identifiant dans son sous-dossier respectif :
   - `assets/image-ai/characters/` pour les mannequins (`CHR-SBF_master.jpg`, `CHR-SBF_macro_wrists.jpg`...)
   - `assets/image-ai/environments/` pour les décors vides (`ENV-04_table_oak.jpg`, `ENV-09_vault_closed.jpg`...)
   - `assets/image-ai/props/` pour les objets isolés (`PRP-BTC_coupelle.jpg`, `PRP-TV_crt.jpg`...)

## 3. Assets à préparer — ordre de génération

### Phase 1 — Les mannequins maîtres (GÉNÉRÉS & VALIDÉS)
Les 10 images maîtres sont déjà générées dans `assets/image-ai/characters/` (corps lisses en plâtre blanc, mains anatomiques, chaussures incluses).
Importez-les directement dans Google Flow dans l'onglet/slot **Characters** sous leurs identifiants exacts :
- **`CHR-SBF`** ← `CHR-SBF_master.jpg` (SBF : t-shirt anthracite, short cargo, baskets grises)
- **`CHR-ELL`** ← `CHR-ELL_master.jpg` (Caroline Ellison : cardigan beige, lunettes or, talons)
- **`CHR-CZ`** ← `CHR-CZ_master.jpg` (Changpeng Zhao : costume anthracite, richelieus cirés)
- **`CHR-RAY`** ← `CHR-RAY_master.jpg` (John Ray III : costume 3 pièces marine, lunettes)
- **`CHR-WANG`** ← `CHR-WANG_master.jpg` (Gary Wang : pull sombre, souliers noirs)
- **`CHR-SING`** ← `CHR-SING_master.jpg` (Nishad Singh : chemise bleue, souliers marron)
- **`CHR-SAL`** ← `CHR-SAL_master.jpg` (Ryan Salame : costume gris moyen sans cravate)
- **`CHR-LD`** ← `CHR-LD_master.jpg` (Romain sceptique : toge crème, tunique sombre, souliers cuir)
- **`CHR-ENQ`** ← `CHR-ENQ_master.jpg` (Enquêteur : costume sombre, gants blancs)
- **`CHR-POL`** ← `CHR-POL_master.jpg` (Police bahaméenne : uniforme marine, casquette)

**Génération automatique des angles via l'option Body dans Flow :**
Vous n'avez pas besoin de générer des images d'angles manuellement à l'avance. Dans Flow, à partir de chaque image maître importée :
- Pour les plans de dos (ex: **H13** avec SBF assis de dos) : sélectionnez l'option Body **Back**.
- Pour les plans de mains/poignets (ex: **H11** avec les poignets de SBF) : sélectionnez l'option Body **Hands / Close-up**.
- Pour les plans 3/4 ou buste : sélectionnez l'option Body **Medium / Three-quarter**.

> **Point de contrôle A (VALIDÉ) :** Les 10 mannequins maîtres sont validés dans `assets/image-ai/characters/`. Le corps et les mains sont lisses, sans coupures ni jointures robotiques. Vous pouvez passer directement à la Phase 2 (décors).

### Phase 2 — Les décors vides (6 images)

**ENV-03 · SERVEURS**
```
[préfixe décors] Long symmetrical corridor of black server racks stretching into darkness, blinking small LEDs, polished concrete floor, overhead cable trays, a bank of ceiling light tubes switched on, cold cyan glow (5600K), faint haze. 24mm lens, low angle, centred.
```

**ENV-04 · LA TABLE** (la table du Hook, la même qu'à la fin de la vidéo)
```
[préfixe décors] A very large, completely empty dark oak table in a quiet investigation room, a brass banker's lamp switched off on its far end, venetian blinds with thin window light, a wooden filing cabinet and a cork board on a plain brick wall in the background. Warm 2700K light pools, cold window fill. 35mm lens, eye level, the centre of the table clear and uncluttered.
```

**ENV-09 · SALLE DES COFFRES** (état A : tout fermé)
```
[préfixe décors] Basement safe-deposit room: a floor-to-ceiling wall of numbered steel boxes with brass key locks, every drawer closed, a heavy round vault door standing slightly open at the far end, cold top light, fine dust floating in the air. 28mm lens. Numbers are small, plain and not important.
```

**ENV-10 · ENTREPÔT DE PREUVES**
```
[préfixe décors] Evidence warehouse: tall steel shelving with identical blank archive boxes, polished concrete floor, flat cold fluorescent light, a long steel table, light haze. 28mm lens. No markings on any box.
```

**ENV-01 · PENTHOUSE (intérieur)**
```
[préfixe décors] Luxury penthouse living room in Nassau at night. Floor-to-ceiling glass wall onto a dark ocean, cold white marble floor with tangled black cables, glass meeting tables with takeaway boxes and soda cans, an old cathode-ray television on a low table in one corner, a worn blue beanbag against a wall. Warm lamps at 2700K, blue monitor spill. 24mm lens, eye level.
```

**ENV-01X · PENTHOUSE (vu de la terrasse sous la pluie)**
```
[préfixe décors] Seen from a rain-soaked terrace at night through a floor-to-ceiling glass wall into a luxury penthouse living room. Raindrops running down the glass, a faint reflection of the ocean, warm interior light, a glass table inside with a stool beside it. 35mm lens, locked-off.
```

> **Point de contrôle B :** montrez-moi ENV-04 et ENV-09. Ce sont les deux décors qui portent les plans-clés (H05 et H07).

### Phase 3 — Les objets (5 images)

**PRP-BTC_COUPELLE · pièce sur plateau** (une seule image)
```
[préfixe objets] A single heavy gold coin with a plain engraved edge and a simple embossed symbol, lying flat in the centre of a shallow brushed stainless-steel surgical dish. One hard overhead light cone, the surface around the dish in darkness.
```
**PRP-TV · téléviseur CRT**
```
[préfixe objets] An old cathode-ray television set with a curved glass screen, switched off, on a low wooden table, slight dust on the glass. Seen from the front at eye level.
```
**PRP-ROUE · roue de pierre**
```
[préfixe objets] A roughly hewn round stone wheel, about knee-high, standing on a bare studio floor against a flat painted backdrop.
```
**PRP-MENOTTES · menottes**
```
[préfixe objets] Steel handcuffs, closed, resting on a dark surface, scratched metal, hard side light.
```
**PRP-MONTRE · montre mécanique**
```
[préfixe objets] A luxury mechanical wristwatch lying on dark lacquered wood, plain dial with no brand, seen from above at a slight angle.
```

### Phase 4 — Archives réelles et éléments GFX (hors Flow)

**3 photos réelles à sourcer** (ne pas les générer)

| ID | Pièce | Plan | Conseil |
|---|---|---|---|
| `REAL-04` | FTX Arena (Miami), de nuit, logo visible | H03 | Cherchez d'abord des images à licence libre (Wikimedia Commons), puis les banques d'images |
| `REAL-02` | Siège de FTX à Nassau, crépuscule | H08 | Même démarche ; une photo réelle vaut mieux qu'un bâtiment inventé |
| `REAL-01` | Portrait d'archive de SBF | H12 | Fichier attendu : `episodes/02-ftx/assets/real-footage/sbf-real-portrait.jpg` |

**6 éléments GFX**

| Plan | Élément | Contenu exact |
|---|---|---|
| H03 | Carte chiffrée | « 32 000 000 000 $ » en cyan `#38BDF8`, mention « JANVIER 2022 » |
| H04 | Message interne flouté | Interface de messagerie générique, mot « reserves » surligné en jaune |
| H06 | Carte chiffrée | « 1 BTC ≈ 20 000 $ » |
| H08 | Compteur Remotion | JOUR 1 → JOUR 9, une pulsation de basse sèche par chiffre |
| H09 | Bandeau d'information | « BREAKING — FTX CHAPTER 11 — $32B TO ZERO », aucun logo de chaîne réelle |
| H12 / fin | Carte preuve et titre maître | Voir commandes ci-dessous |

```bash
# H03 — carte chiffrée
.venv/bin/python scripts/generate_title_card.py --line1 "32 000 000 000 $" --line2 "JANVIER 2022" --pos center --hold 2.5

# H12 — vrai visage de SBF (son : camera-click.wav)
.venv/bin/python scripts/generate_evidence_card.py \
    --image "episodes/02-ftx/assets/real-footage/sbf-real-portrait.jpg" \
    --style clean --pos center --duration 2.5 \
    --out "episodes/02-ftx/assets/texte_card/card_sbf_real.mov"

# 0:45 — titre maître
.venv/bin/python scripts/generate_main_title.py   # arguments habituels de votre pipeline
```

---

## 4. Les 9 générations vidéo, dans l'ordre de production

> **Ordre :** on commence par les plans les plus importants et les plus risqués (H05, H07, H01), pas par H01. Si ces trois passent, le reste passera.
> **Chaque génération :** 8 s (sauf indication), 2 prises, on garde le meilleur passage de 2 à 4 s.
> **Ingrédients :** chargez les images dans l'ordre indiqué, puis préfixez le prompt par la ligne « Reference 1 is… ».

### ① H05 + H06 — La pièce (plan-signature)
**Ingrédients :** [1] `ENV-04` · [2] `PRP-BTC_COUPELLE`
```
Reference 1 is the room. Reference 2 is the dish with the coin.
Slow push-in toward the single gold coin lying in the centre of the stainless steel dish, placed on the large empty dark oak table from reference 1. One hard overhead light cone, everything else in darkness. The first four seconds stay wide on the dish, the last four end in macro on the coin's engraved edge. [STYLE]
```
**On garde :** coupe A (3 s, plan large) pour H05, coupe B (3 s, macro) pour H06.
**Si ça rate :** la pièce change de forme ou le plateau se déplace → réduire le mouvement : « the camera is almost still, only a 3% push-in », ou découper en deux générations (une large, une macro).

### ② H07 — Le mur de casiers (clin d'œil Spaggiari)
**Ingrédients :** [1] `ENV-09`
```
Reference 1 is the room.
Slow lateral dolly along the wall of numbered metal safe-deposit boxes. Near the end of the move, one drawer slides open by itself a few centimetres and stops: inside, an empty felt-lined tray. Cool top light, slight dust in the beam. [STYLE]
```
**On garde :** le moment où le tiroir s'ouvre (2,5 à 3 s).
**Si ça rate :** le tiroir ne s'ouvre pas ou se multiplie → **plan B** : deux images fixes (casier fermé / casier ouvert vide, générées avec Nano Banana Pro) enchaînées par un coupe-sèche avec le bruit de tiroir.

### ③ H01 — Les lumières qui s'éteignent
**Ingrédients :** [1] `ENV-03`
```
Reference 1 is the room.
Locked-off low-angle wide shot down the corridor of server racks. The ceiling light banks are on, then switch off one bank after another from the far end toward the camera until only the small blinking LEDs remain. [STYLE]
```
**On garde :** les 3 s avec l'extinction progressive. Les 0,5 premières secondes doivent rester éclairées.
**Si ça rate :** les lumières s'éteignent toutes d'un coup → c'est acceptable (un « clac » unique de disjoncteur). Sinon, utiliser deux images fixes (allumé / éteint) et un fondu rapide en 4 images.

### ④ H13 — La vitre sous la pluie (dernier plan avant le titre)
**Ingrédients :** [1] `ENV-01X` · [2] `CHR-SBF` (de dos, assis)
```
Reference 1 is the room. Reference 2 is the white mannequin.
Locked-off medium shot from the terrace, through the floor-to-ceiling glass wall in heavy rain at night. Inside, the white mannequin from reference 2 sits alone at the glass table, elbows on his knees, head in his hands, wearing an anthracite t-shirt and cargo shorts. Red reflections from monitors slide across his shoulders. Very slow push-in of 4%. [STYLE]
```
**Si ça rate :** le mannequin bouge trop → préciser « the mannequin is motionless, only the rain moves ».

### ⑤ H04 — Les enquêteurs
**Ingrédients :** [1] `ENV-10` · [2] `CHR-ENQ`
```
Reference 1 is the room. Reference 2 is the white mannequin.
Medium-wide locked-off shot. Two mannequins like reference 2, in dark suits and white gloves, lift the lids off archive boxes on the steel shelves and slowly leaf through papers. Flat cold fluorescent light, no readable writing on any box or page. [STYLE]
```
**Si ça rate :** deux mannequins bougent mal → ne garder qu'un mannequin à l'écran ; l'effet est le même.
**Post :** incruster le message interne flouté (GFX) sur la dernière seconde.

### ⑥ H09 — Le téléviseur
**Ingrédients :** [1] `ENV-01` · [3] `PRP-TV`
```
Reference 1 is the room. Reference 2 is the television.
Locked-off tripod shot, no camera movement. The old cathode-ray television from reference 2 on its low table in a dark room. The screen is a flat blue-grey glow with faint scanlines and gentle flicker, casting light on the wall behind. Nothing is shown on the screen. [STYLE]
```
**Important :** caméra **immobile** (trépied). C'est ce qui permet d'incruster ensuite le bandeau d'information sans suivi de mouvement.

### ⑦ H10 — Le « sceptique » et la roue
**Ingrédients :** [2] `CHR-LD` · [3] `PRP-ROUE`
```
Reference 1 is the white mannequin in a toga. Reference 2 is the stone wheel.
Static medium shot on a bare studio floor against a flat painted backdrop, with a commercial-set look. The mannequin stands in front of the stone wheel and waves it away with the back of one hand, then turns his head away. Hard side light. [STYLE]
```
**Post :** cette plaque est incrustée dans l'écran de H09 (coupe punch-in, **pas de zoom à travers l'écran**). Elle servira aussi dans The Rise.

### ⑧ H11 — Les menottes
**Ingrédients :** [2] `CHR-SBF` (poignets) · [3] `PRP-MENOTTES`
```
Reference 1 is the mannequin's wrists. Reference 2 is the handcuffs.
Tight macro on the crossed wrists of the faceless white mannequin from reference 1. A white-gloved hand snaps the steel handcuffs from reference 2 shut around them. Blue and red police light sweeps across the frame from out of shot. Cut right after the click. [STYLE]
```
**Si ça rate** (les mains sont le point faible de l'IA) : **plan B** sans mains : les menottes seules, refermées sur une barre de bois, avec un balayage de lumière bleue et rouge.

### ⑨ H02 — La montre
**Ingrédients :** [3] `PRP-MONTRE`
```
Reference 1 is the watch.
Extreme macro of the mechanical wristwatch from reference 1 lying on dark lacquered wood, the second hand sweeping in short ticks, raking light from the left. In the soft out-of-focus background a monitor glows, flickers and goes black. The ticking continues. [STYLE]
```
**Durée de génération :** 4 s suffisent.

---

## 5. Tableau de montage du Hook (0:00 → 0:45)

| Plan | TC | Voix off (début) | Source | Coupe retenue |
|---|---|---|---|---|
| H01 | 0:00–0:03 | « À son niveau le plus bas... » | Flow ③ | extinction des lumières |
| H02 | 0:03–0:06 | « ...dans les dernières heures avant son effondrement... » | Flow ⑨ | macro de la montre |
| H03 | 0:06–0:09 | « ...valorisée à trente-deux milliards... » | `REAL-04` + GFX | poussée de 6 % |
| H04 | 0:09–0:13 | « ...messages internes examinés plus tard... » | Flow ⑤ + GFX | enquêteurs, puis message flouté |
| H05 | 0:13–0:16 | « ...un bitcoin en réserves... » | Flow ① coupe A | plan large du plateau |
| H06 | 0:16–0:19 | « ...vingt mille dollars à l'époque... » | Flow ① coupe B + GFX | macro de la pièce |
| H07 | 0:19–0:24 | « ...huit milliards... en sécurité... » | Flow ② | le tiroir qui s'ouvre |
| H08 | 0:24–0:28 | « Il a fallu neuf jours... » | `REAL-02` + Remotion | compteur 1 → 9 |
| H09 | 0:28–0:32 | « ...à la faillite. » | Flow ⑥ + GFX | bandeau d'information |
| H10 | 0:32–0:37 | « ...une publicité diffusée pendant le Super Bowl... » | Flow ⑦ | roue rejetée, dans la télé |
| H11 | 0:37–0:40 | « ...à une inculpation pénale. » | Flow ⑧ | menottes (coupe sèche) |
| H12 | 0:40–0:42 | « Son nom était Sam Bankman-Fried. » | `REAL-01` + carte preuve | visage réel, `camera-click` |
| H13 | 0:42–0:45 | « ...de l'intérieur. » | Flow ④ | vitre sous la pluie, puis noir |

**Après H13 :** coupe sèche au noir, puis le titre maître à 0:45.

---

## 6. Déroulé conseillé (une séance)

1. **Phase 1** (3 images) → **point de contrôle A**.
2. **Phases 2 et 3** (11 images) → **point de contrôle B**.
3. **Sourcer les 3 photos réelles** pendant que les images se génèrent.
4. **Pilote vidéo** : ① H05+H06, ② H07, ③ H01, avec 2 prises chacun en mode Fast.
5. Si au moins 2 pilotes sur 3 passent les 3 questions du `Montage.md` §14 → **générer les 6 autres plans**.
6. Sinon → **corriger avant de continuer** (prompt plus simple, mouvement plus court, ou plan B).
7. **Montage provisoire** avec la voix off corrigée, en laissant 0,5 s d'air avant la pièce (H05) et avant le titre.
8. **Sound design** : un SFX par geste visible, posé à l'image près (liste dans `Objets_Atomiques.md` §6).

## 7. Ce que vous pouvez me renvoyer pour valider

- Les 3 images de **CHR-SBF** (point A).
- **ENV-04** et **ENV-09** (point B).
- La meilleure prise de **H05** et de **H07**.

Je vous dirai ce qui fonctionne et ce qu'il faut ajuster dans le STYLE ou dans les prompts avant d'attaquer le reste.