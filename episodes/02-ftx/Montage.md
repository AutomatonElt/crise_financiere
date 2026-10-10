# MONTAGE — FTX : NINE DAYS TO ZERO
### Conducteur v3 pour Google Flow (Gemini Omni Flash) — Financial Forensics, Épisode 02

> **Statut :** cette version remplace le conducteur v2 (Veo 3.1). Elle intègre trois choses : le passage à **Gemini Omni Flash** (plus d'images de référence, clips plus longs, édition par conversation), les **assets modernes** réellement générés (décors, mannequins, objets), et le **Hook final** (anciennement dans `Hook_Video_Prompts.md`). Tous les identifiants (`ENV-04_NUIT`, `CHR-SBF`, `PRP-BTC_COUPELLE`…) renvoient à `Environnements_Tous_Les_Prompts.md`, `Objets_Tous_Les_Prompts.md` et `Objets_Atomiques.md`.
> **Chemin cible :** `episodes/02-ftx/Montage.md` (je n'ai pas accès à votre disque : placez le fichier à cet endroit).

---

## 0. Comment lire ce document

| Code | Méthode | Usage |
|---|---|---|
| **FLOW-I** | **Références multiples** : décor + personnage + objets (de 5 à 10 images selon la plateforme, **à vérifier dans votre Flow**) | Méthode par défaut quand l'exactitude de la position n'est pas critique |
| **FLOW-F** | **Première image** (devient l'ouverture exacte du plan), avec ou sans **dernière image** | Quand un objet doit être exactement à sa place ou qu'un état change (tiroir qui s'ouvre) |
| **FLOW-T** | Texte seul | Plans sans personnage ni objet récurrent |
| **FLOW-E** | **Édition par conversation** d'un clip déjà généré | Corriger un détail sans tout régénérer (§3.6) |
| **GFX** | Scripts maison / Remotion | Compteurs, courbes, cartes-dates, tampons animés |
| **REAL** | Archive réelle (`generate_evidence_card.py`) | Vrais visages, tweets, décisions de justice |

**Les numéros entre crochets** (`[1]`, `[2]`, `[3]`…) indiquent simplement l'**ordre des références**, il n'y a plus de plafond à trois. Là où un plan en liste trois, vous pouvez en ajouter d'autres (un second objet, une vue supplémentaire du décor).
**1 génération = 2 ou 3 coupes.** Omni Flash produit des clips de 3 à 10 s : on génère 6 à 8 s (jusqu'à 10 s pour une poussée très lente) et on y prélève 2 à 3 passages de 2 à 3 s. Le conducteur compte **≈ 110 générations**.

---

## 1. Décisions prises sur l'existant

| Constat dans les anciennes versions | Décision |
|---|---|
| **Deux Hooks concurrents** (13 plans / 0:45 et 21 plans / 0:51) | **Un seul Hook**, 13 coupes, calé sur la voix off de 0:45 |
| **Tour de verre FTX** vue en drone, qui s'effondre | Supprimée : plan le plus « faux » possible, et le siège n'était pas une tour de verre. Remplacée par la salle des serveurs + photos réelles |
| **Rembobinage « verre brisé »**, caméra qui traverse une vitre, zoom *dans* un écran | Supprimés : ce sont des morphings. Remplacés par des **coupes franches + raccords** |
| **Texte, chiffres, tampons, bilans** générés dans la vidéo | **Jamais dans la vidéo.** Le texte naît dans une image fixe (Nano Banana Pro, relue mot à mot) ou en GFX, puis on anime très peu |
| **SBF avec cheveux bouclés** | **Tête chauve partout**, identité par les vêtements (t-shirt anthracite, short cargo, **baskets grises**) et les objets |
| **Une métaphore par phrase** | **Une métaphore par séquence maximum**, physique, simple, tactile |
| **Logos réels** (chaînes d'info, magazines) | Remplacés par des **génériques inventés** |
| **Textes inventés présentés comme des preuves** | Fictions : illisibles, ou marqués « RECONSTITUTION » |
| **Prompts « 8k, Unreal Engine 5, hyper-detailed »** | Remplacés par un **langage photographique** |
| **Lieux vieillis et délabrés** (poussière, brique, bois ancien, câbles qui traînent) | **Moderne, propre, confortable, sans luxe.** Le réalisme vient de la matière et de la lumière, pas de la saleté |
| **Objets anciens** (imprimante matricielle, moniteur beige, calculatrice mécanique, cassette VHS, vieux téléviseur CRT) | **Versions modernes** (imprimante laser, moniteur plat, calculatrice imprimante, clé USB, téléviseur plat) |
| **Limite de 3 ingrédients** (Veo 3.1) | **Plus de références** avec Omni Flash : le collage d'objets et la plupart des images de départ composées deviennent **facultatifs** (§3.3) |

---

## 2. Les 12 règles anti-artificiel

1. **Zéro texte dans la vidéo générée.** Les modèles vidéo déforment le texte dès qu'il bouge. Tout ce qui se lit naît dans une **image fixe** (Nano Banana Pro, relue mot à mot) ou en GFX, puis on anime l'image avec un mouvement minimal (poussée de caméra, coin de page qui se soulève).
2. **Zéro morphing.** Pas de reconstruction à l'envers, pas de traversée de matière, pas de transformation d'objet. Une action = un geste physique simple.
3. **Mannequins : mouvements lents, rares et lisibles.** Dos, profil, silhouette, mains. Jamais de course, de foule qui bouge, de gros plan sur la tête.
4. **Une seule idée de mouvement par prise** : soit le mannequin, soit la caméra, soit la lumière.
5. **Caméra motivée.** Trépied verrouillé (idéal pour incruster un écran), poussée lente de 3 à 6 %, léger souffle d'épaule. Pas de travelling aérien, pas de dolly à travers un mur.
6. **Matières réelles, lieux propres.** Reflets doux, grain de film, chute naturelle de la lumière, tout petits détails de vie (une trace de doigt sur une vitre). **Jamais de saleté, de débris ni d'objets anciens** sauf si l'histoire l'exige (un registre en cuir).
7. **Cohérence par références.** Chaque plan récurrent part des mêmes images maîtres. On ne « redécrit » jamais un personnage ou un décor dans le prompt.
8. **Lumière à deux températures** : tungstène chaud (2700 K) et fill bleu froid (5600 K). Le rouge n'apparaît qu'à partir du 9 novembre.
9. **Respirations.** Après chaque révélation forte : 1 à 2 s de silence ou de plan fixe.
10. **Le réel ancre, le fictif illustre.** Chaque minute environ, une preuve réelle rappelle que « tout cela est arrivé pour de vrai ».
11. **Objets avant gestes.** Quand l'IA doit choisir, elle filme un objet immobile ou un geste minimal, jamais une action complexe.
12. **Le chiffre à l'écran = le chiffre dit en voix off, à la même image.**

---

## 3. Protocole Google Flow (Gemini Omni Flash)

### 3.0 Ce que fait le modèle, et ce qui reste incertain
**Sources concordantes :** Gemini Omni Flash accepte du texte, des **images de référence** et des **clips vidéo de référence** ; il génère des clips de **3 à 10 s** avec **audio natif synchronisé** ; il permet l'**édition conversationnelle** (corriger un clip par une consigne), la **prolongation** et l'**interpolation** entre images. La **première image** devient l'ouverture exacte du plan, alors que les **images de référence guident l'apparence sans être recopiées à l'identique**. Il refuse les **personnes réelles nommées** (sans importance ici : nos personnages sont des mannequins, et les vraies photos passent par les cartes preuve hors Flow).

**À vérifier dans votre interface Flow :**
- **Le nombre maximal d'images de référence.** Les sources donnent **5, 7 ou 10** selon la plateforme et la version. Comptez 5 par prudence, montez à 7 ou 10 si votre Flow le permet.
- **La résolution.** Plusieurs sources donnent 720p en natif, avec 1080p ou 4K selon les outils. Vérifiez la résolution d'export et l'option d'agrandissement avant le montage final.
- **Le statut.** Le modèle est en préversion publique : le comportement peut changer.

### 3.1 Ordre de travail
1. **Images maîtres** : décors, mannequins (importés dans l'onglet *Personnages*, option **Body** pour dos / mains / trois-quarts), objets. Voir `Environnements_Tous_Les_Prompts.md` et `Objets_Tous_Les_Prompts.md`.
2. **Fond simple pour les références d'objets** : un objet sur fond uni est mieux reconnu.
3. **Essais en mode rapide**, puis relance en qualité maximale des seules prises retenues. Vérifiez le coût en crédits.
4. **Générer 6 à 8 s** (10 s pour les poussées très lentes), garder le meilleur passage de 2 à 4 s. **2 prises par plan.**
5. **Nommage :** `H05_coin-dish_take2.mp4` (ID du plan + sujet + prise).
6. **Audio du modèle :** ambiance de référence seulement. Les SFX définitifs viennent de votre bibliothèque.

### 3.2 Préfixe de références (à coller en tête de chaque prompt FLOW-I)
```
Reference images: image 1 is the room, image 2 is the white mannequin, image 3 is [objet], image 4 is [objet]. Use them to keep identity, materials and layout consistent.
```
(adaptez la liste : une ligne par référence réellement fournie)

### 3.3 Quelle méthode pour quel plan ?
| Situation | Méthode | Pourquoi |
|---|---|---|
| Décor seul | **FLOW-F** : l'image du décor en première image | L'ouverture est exacte |
| Décor + mannequin + 1 à 4 objets, **position non critique** | **FLOW-I** : tout en références | Plus rapide : aucune image à composer |
| **Un objet doit être exactement au centre / à un endroit précis**, ou le **mannequin exactement assis à un endroit** | **FLOW-F** avec une **image de départ composée** (Nano Banana Pro) | Les références guident mais ne copient pas : seule la première image fixe la position |
| **Un état change** (tiroir fermé → ouvert) | **FLOW-F** première image **+ dernière image** | Le modèle interpole entre deux états maîtrisés |
| Une **petite correction** sur un bon clip | **FLOW-E** | Évite de régénérer |
| Un **geste répété** (tampon, clic) | Référence **vidéo** (jusqu'à 3 clips de 3 s ou moins, si votre Flow l'accepte) | Même mouvement d'un plan à l'autre |

**Règle d'économie :** le collage `PACK_TABLE` et les images de départ composées ne servent plus que lorsque la position exacte compte.

### 3.4 Bloc STYLE (à coller en fin de **chaque** prompt)
```
Photorealistic, natural film grain, clean modern surfaces, tiny lived-in details only, no dirt, no debris. Ambient sound only, no music, no speech, no on-screen text, no logos.
```

### 3.5 Structure d'un prompt
`[Cadrage + caméra]` → `[Action dans l'ordre du temps]` → `[Lumière]` → `[Audio]` → `[STYLE]`.
Une seule action, des verbes simples (*slides*, *clicks*, *lifts*), jamais d'adjectifs de rendu (*stunning*, *epic*, *hyper-detailed*). Avec une première image fournie, le prompt ne décrit que **le mouvement**.

### 3.6 Corriger sans régénérer (FLOW-E)
Sur un clip réussi à 80 %, demandez une retouche ciblée :
```
Keep the same shot, framing, lighting and camera movement. Change only this: [CHANGEMENT PRÉCIS]. Everything else stays identical.
```
Exemples : « remove the paper note from the glass », « make the coin's edge sharper in the last second », « the rain is lighter, same everything else ».

### 3.7 Limites à connaître
- La **durée** maximale est de 10 s : tout plan plus long se monte en deux clips.
- Les **références ne sont pas recopiées à l'identique** : si l'exactitude compte, passez par la première image.
- Un modèle en **préversion** : ne pas bâtir tout le projet sur un comportement non vérifié. Testez par le pilote (§16.6).

---

## 4. Carte de rétention

| Chapitre | TC | Coupes | Palette | Signature sonore | Rupture de rythme | Motif qui revient |
|---|---|---|---|---|---|---|
| **Hook** | 0:00–0:45 | ~3,5 s | Noir, cyan froid | Disjoncteurs, tic-tac | Silence net avant le titre | La pièce BTC |
| **The Nine Days** | 0:45–5:48 | 1,5–3 s | Cyan → ambre → rouge | Frappes de clavier, notifications | Une carte-date par jour : le compte à rebours *est* le montage | Le jeton FTT, le bureau SBF |
| **The Rise** | 5:48–9:06 | 2,5–4 s | Or, tungstène chaud | Verres en cristal, camera-click | Lenteur et faste : on laisse le spectateur *croire* | La clé Corolla, le pouf |
| **The Breakdown** | 9:06–12:19 | 3–4 s | Beige, bois, laiton | Papier, stylo, balance | Le rythme *ralentit* : la mécanique s'explique à voix posée | La table d'enquête, la balance |
| **The Numbers** | 12:19–14:03 | 2–3 s | Orange papier millimétré | Ruban de calculatrice | Le graphique « manque à gagner » hachuré à la main | Le chèque 118 % |
| **The Reckoning** | 14:03–16:33 | 2,5–4 s | Acajou, gris tribunal | Marteau, verrou | Les cinq blocs de bois : l'asymétrie se *voit* | La balance, le dossier SBF |
| **The Pattern** | 16:33–17:47 | 3–5 s | Or poussiéreux | Tissu, plancher qui craque | Un plan fixe long : le costume | La clé, le t-shirt |
| **Outro** | 17:47–19:19 | 3–5 s | Noir, silence | Verrou, interrupteur | Retour à la pièce du Hook, puis noir complet | La pièce BTC sous la poussière |

**Principe de rétention :** la vidéo s'ouvre sur un objet (une pièce sur un plateau) et se referme sur ce même objet, voilé de poussière. Entre les deux, **aucune séquence ne dure plus de 25 s sans changement de nature d'image** (plan physique → carte-date → preuve réelle → graphique).

---

## 5. HOOK — 0:00 à 0:45
*13 coupes, 9 générations, 6 images de départ composées.* Cinq plans sont des cartes (GFX/REAL) : ils tiennent les chiffres, Flow tient la matière.

### 5.0 Prérequis
- [ ] `PRP-BTC_COUPELLE` retouchée : **symbole Bitcoin** sur la pièce
- [ ] `ENV-03` sans chariot ni feuille collée
- [ ] `ENV-04_NUIT`, `ENV-01X`, `ENV-01_V2`, `ENV-09_B` générées
- [ ] Deux corrections de voix off : « vingt-neuf ans » → **trente ans** ; « environ un bitcoin en réserves » → à sourcer ou à reformuler

### 5.1 Les 6 images de départ à composer (Nano Banana Pro, 1 résultat chacune)
Elles fixent la position exacte des objets et des mannequins. Joignez les références dans l'ordre, renommez avec le nom indiqué.

**`H02_depart`** · Référence : [1] `PRP-MONTRE`
```
Extreme macro of the wristwatch from the reference image lying on dark lacquered wood, raking light from the left, the dial and the second hand in sharp focus, very shallow depth of field. In the soft out-of-focus background, a computer monitor glowing cold blue. Keep the watch exactly as in the reference: no numerals, no lettering. Photographic, natural film grain, no text, no logos. 16:9.
```
**`H04_depart`** · Références : [1] `ENV-10` · [2] `CHR-ENQ`
```
Place the white mannequin from reference 2 standing in the central aisle of the evidence storage room of reference 1, in a dark suit and white cotton gloves, holding a white archive box already lifted off a shelf with its lid off, looking down into it. Medium-wide shot, 28mm. Keep the room exactly as in reference 1. No writing on any box. Photographic, natural film grain, no text, no logos. 16:9.
```
**`H05_depart`** · Références : [1] `ENV-04_NUIT` · [2] `PRP-BTC_COUPELLE`
```
Place the stainless steel dish with the gold coin from reference 2 at the exact centre of the walnut table in reference 1, at correct scale and perspective (the dish about 25 cm wide), lit by the single narrow warm spotlight cone from above that is already present in reference 1. Keep the room, the table and everything else exactly as in reference 1; the rest of the room stays in deep shadow. Photographic, natural film grain, no text, no logos. 16:9.
```
**`H10_depart`** · Références : [1] `CHR-LD` · [2] `PRP-ROUE`
```
The white mannequin in a toga from reference 1 standing in front of the stone wheel from reference 2 on a bare studio floor against a flat painted backdrop. Hard side light, commercial-set look. Photographic, natural film grain, no text, no logos. 16:9.
```
**`H11_depart`** · Références : [1] `CHR-SBF` (option *Body → mains / gros plan*) · [2] `PRP-MENOTTES` · ✅ **VALIDÉ**
```
Tight macro on the crossed wrists of the white mannequin from reference 1. The steel handcuffs from reference 2 are open and held just above the wrists by a white-gloved hand. A trace of blue and red light on the metal. Plain dark background. Photographic, natural film grain, no text, no logos. 16:9.
```
*(Fichier enregistré : `episodes/02-ftx/assets/image-ai/starting_frames/H11_depart.jpg`)*
**`H13_depart`** · Références : [1] `ENV-01X` · [2] `CHR-SBF`
```
Place the white mannequin from reference 2 inside the room of reference 1, seated on the simple chair at the light-oak table, seen from outside through the glass wall: elbows on the table, head in his hands, wearing the same anthracite t-shirt, cargo shorts and grey sneakers. Keep the rain, the glass and the room exactly as in reference 1. Faint cool monitor reflections on his shoulders. Photographic, natural film grain, no text, no logos. 16:9.
```
**Contrôle avant d'animer :** un seul mannequin à la fois · tête lisse, mains à cinq doigts · objets à leur place et à l'échelle · aucun texte lisible · lumière conforme au plan.

### 5.2 Les 9 plans vidéo
> **Ordre de production :** ① H05 · ② H07 · ③ H01 (le pilote), puis les six autres. **Première image** = l'image indiquée. **Références** = à joindre en plus.

**① H05 + H06 · 0:13–0:19 · FLOW-F · 8 s · 2 coupes**
VO : « ...que de l'équivalent d'environ un bitcoin en réserves immédiatement disponibles... / Un seul bitcoin, d'une valeur d'environ vingt mille dollars à l'époque... »
Première image : `H05_depart` · Références : `ENV-04_NUIT`, `PRP-BTC_COUPELLE`
```
Locked-off start, then a very slow push-in on the dish. The first four seconds stay wide on the dish on the table; the last four end in extreme macro on the coin's edge and its Bitcoin symbol. The light cone stays steady. Nothing else moves. Audio: faint reverberation of an empty room, one clear metallic tick. [STYLE]
```
Coupe A (3 s, large) = H05. Coupe B (3 s, macro) = H06 + GFX « 1 BTC ≈ 20 000 $ ».
**Si la pièce change de forme :** « the camera is almost still, only a 3% push-in », ou deux générations (une large, une macro).
**Plan de respiration** : c'est l'image qui reviendra dans l'outro.

**② H07 · 0:19–0:24 · FLOW-F · 6 s**
VO : « ...derrière plus de huit milliards de dollars que les clients pensaient en sécurité sur leurs comptes. »
Première image : `ENV-09` · Dernière image : `ENV-09_B` · Références : `ENV-09`
```
Locked-off camera with a very slow push-in of 3%. One drawer at mid-height on the left wall slides open about five centimetres by itself and stops, revealing an empty felt-lined tray. Every other drawer stays closed. Nothing else moves. Audio: a heavy metal drawer sliding on its runners, then silence. [STYLE]
```
**Si la dernière image n'est pas acceptée :** première image seule avec le même prompt, ou coupe sèche entre `ENV-09` et `ENV-09_B` avec le bruit du tiroir. *Clin d'œil Spaggiari : le coffre qu'on croit plein.*

**③ H01 · 0:00–0:03 · FLOW-F · 6 s**
VO : « À son niveau le plus bas... »
Première image : `ENV-03` · Références : `ENV-03`
```
Locked-off camera, no movement. The rows of ceiling light tubes along the corridor switch off one bank after another, starting at the far end and moving toward the camera, until only the small blinking LEDs on the server racks and a faint cold cyan glow remain. Nothing else moves. Audio: a heavy electrical breaker clunk as each bank goes out, cooling fans slowing down. [STYLE]
```
**On garde :** les 3 s de l'extinction, les 0,5 premières secondes éclairées. **Si tout s'éteint d'un coup :** acceptable, un seul « clac ».

**④ H13 · 0:42–0:45 · FLOW-F · 6 s**
VO : « Voici à quoi ces neuf jours ressemblaient réellement de l'intérieur. »
Première image : `H13_depart` · Références : `ENV-01X`, `ENV-01`, `CHR-SBF`
```
The mannequin is completely motionless. Only the rain moves: drops run down the glass and streak the reflection of the ocean. Faint cool reflections slide slowly across his shoulders. A very slow push-in of 4%. Audio: heavy rain on glass, a far-off rumble. [STYLE]
```
**Raccord :** coupe sèche au noir à 0:45, puis `generate_main_title.py` « FTX — NINE DAYS TO ZERO ». La caméra reste dehors.

**⑤ H04 · 0:09–0:13 · FLOW-F + GFX · 6 s**
VO : « ...selon des messages internes examinés plus tard par les enquêteurs... »
Première image : `H04_depart` · Références : `ENV-10`, `CHR-ENQ`
```
Locked-off medium-wide shot. The mannequin slowly lifts a bundle of papers out of the open archive box and leafs through them with a steady hand. Nothing else moves. The papers show no readable writing. Audio: paper rustling, a faint ventilation hum. [STYLE]
```
Post : message interne flouté en GFX, mot « reserves » surligné, sur la dernière seconde.

**⑥ H09 · 0:28–0:32 · FLOW-F · 6 s**
VO : « ...pour passer d'une valorisation de trente-deux milliards de dollars à la faillite. »
Première image : `ENV-01_V2` · Références : `ENV-01`, `PRP-TV`
```
Locked-off tripod shot, no camera movement. The television screen switches on to a flat cold blue-grey glow with a very faint flicker, casting soft light onto the wall and the white media unit. Nothing is displayed on the screen. Nothing else moves. Audio: a soft electrical click and a low hum. [STYLE]
```
**Caméra immobile** : indispensable pour incruster le bandeau « BREAKING — FTX CHAPTER 11 — $32B TO ZERO » (générique, sans logo de chaîne réelle).

**⑦ H10 · 0:32–0:37 · FLOW-F + GFX · 6 s**
VO : « ...pour passer d'une publicité diffusée pendant le Super Bowl... »
Première image : `H10_depart` · Références : `CHR-LD`, `PRP-ROUE`
```
Static medium shot, camera locked. The mannequin extends one arm and waves the stone wheel away with the back of his hand, then turns his head away in dismissal. The wheel does not move. Audio: a muffled stadium crowd, one dry stone scrape. [STYLE]
```
Post : plaque incrustée dans l'écran de H09 (coupe punch-in, **pas de zoom à travers l'écran**). Aucun logo NFL. Réutilisée dans The Rise.

**⑧ H11 · 0:37–0:40 · FLOW-F · 4 s**
VO : « ...à une inculpation pénale. »
Première image : `H11_depart` · Références : `CHR-SBF`, `PRP-MENOTTES`
```
Tight macro, camera locked. The white-gloved hand lowers the handcuffs and snaps them shut around the crossed wrists in one clean motion. Blue and red light sweeps once across the frame. Audio: one sharp metallic click, a distant siren. [STYLE]
```
**Si les mains se déforment :** plan B, les menottes seules refermées sur une barre de bois, avec le balayage bleu et rouge.

**⑨ H02 · 0:03–0:06 · Stock Réel Macro 1080p (Remplacement IA validé) · 3 s**
VO : « ...dans les dernières heures avant son effondrement... »
Source : `PRP-REVEIL_DOMESTIQUE_1080p.mp4` (`7033607-hd_1920_1080_25fps.mp4`)
Audio : `freesound_community-ticking-clock_1-27477.mp3` (vrai enregistrement micro analogique)
Fichier monté : `episodes/02-ftx/assets/generated-videos/H02_cut_3s.mp4` (1920x1080, 25 fps, 3,00s)
```
Gros plan macro sur un réveil domestique traditionnel. L'aiguille des secondes bat à une cadence physique rigoureuse de 1 seconde par seconde (frames 13, 38, 63). 
Chaque claquement acoustique réel est calé pile sur le saut de la trotteuse (< 0,1 ms d'écart). Ambiance feutrée, zéro écran d'ordinateur.
```
*Note arbitrage :* L'IA (Seedance 2.5) avait tendance à accélérer la trotteuse de façon artificielle. Le passage au footage réel 1080p avec calage acoustique offre un rendu cinéma plus pesant et authentique.

### 5.3 Plans sans Flow
| Plan | Contenu |
|---|---|
| **H03 · 0:06–0:09** | `REAL-04` (FTX Arena) + carte `generate_title_card.py` « 32 000 000 000 $ » / « JANVIER 2022 » |
| **H08 · 0:24–0:28** | `REAL-02` (siège de Nassau) + compteur Remotion JOUR 1 → 9, une pulsation de basse par chiffre |
| **H12 · 0:40–0:42** | `generate_evidence_card.py --image sbf-real-portrait.jpg --style clean --pos center --duration 2.5`, `camera-click.wav`. *Seul vrai visage de l'ouverture.* |
| **0:45** | Coupe au noir, `generate_main_title.py` |

### 5.4 Tableau de montage du Hook
| Plan | TC | Voix off | Source | Coupe retenue |
|---|---|---|---|---|
| H01 | 0:00–0:03 | « À son niveau le plus bas... » | Seedance 2.5 (ENV-03) | `H01_cut_3s.mp4` (extinction néons validée) |
| H02 | 0:03–0:06 | « ...avant son effondrement... » | Stock 1080p + Freesound | `H02_cut_3s.mp4` (cadence 1s exacte + vrai tic-tac) |
| H03 | 0:06–0:09 | « ...trente-deux milliards... » | REAL-04 + GFX | poussée lente |
| H04 | 0:09–0:13 | « ...examinés par les enquêteurs... » | ⑤ + GFX | l'enquêteur, puis message flouté |
| H05 | 0:13–0:16 | « ...un bitcoin en réserves... » | ① coupe A | plan large du plateau |
| H06 | 0:16–0:19 | « ...vingt mille dollars... » | ① coupe B + GFX | macro de la pièce |
| H07 | 0:19–0:24 | « ...huit milliards... en sécurité... » | ② | le tiroir qui s'ouvre |
| H08 | 0:24–0:28 | « Il a fallu neuf jours... » | REAL-02 + Remotion | compteur 1 → 9 |
| H09 | 0:28–0:32 | « ...à la faillite. » | ⑥ + GFX | bandeau d'information |
| H10 | 0:32–0:37 | « ...publicité... Super Bowl... » | ⑦ | roue rejetée, dans la télé |
| H11 | 0:37–0:40 | « ...inculpation pénale. » | ⑧ | menottes, coupe sèche |
| H12 | 0:40–0:42 | « Son nom était Sam Bankman-Fried. » | REAL-01 | visage réel |
| H13 | 0:42–0:45 | « ...de l'intérieur. » | ④ | vitre sous la pluie, puis noir |

---

## 6. THE NINE DAYS — 0:45 à 5:48
**Logique :** chaque jour a sa **carte-date** (`generate_title_card.py`) qui sert de métronome. Entre deux cartes, 2 à 4 coupes physiques. Les images passent du bleu froid à l'ambre, puis au rouge à partir du 9 novembre.

### 6.1 — 2 novembre (0:45–1:35)

**N01 · FLOW-I · gén. 6 s** · VO : « 2 novembre. »
Réf. : [1] `ENV-02` · [2] `CHR-SBF` (de dos)
```
Locked-off shot from behind a white mannequin hunched over a desk, lit only by a blue monitor glow. Dark room, a lamp off to the side, the screen faces away from camera. Nothing happens except a slight breathing movement. [STYLE]
```
Post : carte « 2 NOVEMBRE 2022 », `--pos center --hold 1.0`. Son : machine à écrire / clavier lourd.

**N02 · FLOW-I · gén. 6 s** · VO : « ...bilan financier interne ayant fuité d'Alameda Research... »
Réf. : [3] `PRP-IMP` + `PRP-FEUILLE_BILAN`
```
Top-down shot of a modern white laser printer on a table, one blank printed sheet sliding out into the output tray. The sheet is blank except for faint printed table grid lines. Hard lamp light from the right. [STYLE]
```
Post : en-tête « CONFIDENTIAL // ALAMEDA RESEARCH BALANCE SHEET » et chiffres en GFX. Son : bruit sec d'une imprimante laser qui éjecte une page.

**N03 · GFX sur la plaque N02** · VO : « Alameda déclare quatorze virgule six milliards de dollars d'actifs. »
Tampon rouge animé sur « 14,6 Md$ ». Son : clac d'huissier.

**N04 · FLOW-I · gén. 6 s** · VO : « ...environ six milliards de dollars de cette somme sont constitués de FTT... »
Réf. : [3] `PRP-LOUPE` + `PRP-FEUILLE_BILAN`
```
Macro shot: a hand holds a magnifying glass above a printed sheet on a wooden table. The glass slowly moves left to right across the page, enlarging the paper grain beneath it. The hand is steady, hard lamp light. [STYLE]
```
Post : sous la loupe, ligne surlignée « FTT : 5,82 Md$ » en GFX.

**N05 · FLOW-I · gén. 4 s** · VO : « ...le token que FTX avait lui-même créé à partir de rien... »
Réf. : [3] `PRP-FTT`
```
Macro shot: a heavy round brushed-metal token drops onto a bare wooden table, bounces twice with a hollow sound and settles. Low raking light. [STYLE]
```
Son : rebond creux, sans poids (plastique).

**N06 · FLOW-I · gén. 6 s** · VO : « Alameda n'était pas simplement proche de FTX. Toute sa structure financière reposait sur le propre papier financier de FTX. »
Réf. : [3] `PRP-TOUR_VERRE` + `PRP-TOUR_CARTES`
```
Static medium shot of two small scale-model skyscrapers on a conference table: one made of solid glass, the other built entirely from stacked playing cards. A breath of air passes through the room and the card tower begins to tremble. [STYLE]
```
Son : bruissement de cartes qui vibrent. *Seule métaphore de la séquence.*

### 6.2 — 6 novembre (1:35–2:30)

**N07 · FLOW-I · gén. 6 s** · VO : « 6 novembre. Changpeng Zhao — CZ... annonce sur Twitter... »
Réf. : [1] `ENV-06` · [2] `CHR-CZ` (de dos)
```
Locked-off wide shot from behind a tall white mannequin in a tailored anthracite suit, standing at a floor-to-ceiling window over a night skyline. His right hand holds a phone at waist height. Polished black shoes catch the city lights on the floor. [STYLE]
```
Post : carte « 6 NOVEMBRE 2022 » (`--pos top-left`). Son : deux frappes de clavier lourdes.

**N08 · REAL** · VO : « ...liquider la totalité de sa position en FTT, en invoquant de "récentes révélations". »
Carte preuve du tweet réel de CZ, mot « LIQUIDATE » surligné en rouge. Son : `camera-click.wav` + vent froid.

**N09 · FLOW-I · gén. 6 s** · VO : « Quelques minutes plus tard, Caroline Ellison... »
Réf. : [1] `ENV-01` · [2] `CHR-ELL`
```
Medium shot of a small white mannequin in a beige chunky cardigan and round gold glasses, seated cross-legged on a couch among takeaway boxes and empty cans, typing with both hands on a laptop on her knees. Blue screen glow on the glasses. Slight handheld breathing. [STYLE]
```
Son : clavier mitraillette.

**N10 · REAL** · VO : « ...propose publiquement de racheter directement les tokens de CZ à vingt-deux dollars pièce. »
Carte preuve du tweet d'Ellison réel, zoom sur « $22 ». Son : notification Twitter stridente.

**N11 · FLOW-T · gén. 4 s** · VO : « ...une tentative de limiter les dégâts en temps réel. »
```
Macro top-down of a thick white chalk line drawn across a dark wooden table. Dirty water begins to seep across the wood from the top of frame and smears the chalk away. Cold side light. [STYLE]
```
Post : « $22.00 FLOOR » écrit en GFX style craie, puis effacé avec l'eau. Son : gouttes précipitées.

### 6.3 — 7 et 8 novembre (2:30–3:45)

**N12 · FLOW-I · gén. 6 s** · VO : « 7 et 8 novembre. La panique ne se limite plus à Twitter. »
Réf. : [1] `ENV-07` · [3] `PRP-TEL_FIXES` + `PRP-TICKER`
```
Wide locked-off shot of an empty trading floor at night. Phones on every desk light up one after another and a ticker-tape machine starts chattering in the foreground. Red and amber warning lights pulse faintly. Nobody is present. [STYLE]
```
Post : carte « 7-8 NOVEMBRE 2022 / LA PANIQUE GÉNÉRALE ». Son : sonneries de téléphone étouffées, alertes.

**N13 · GFX** · VO : « ...les clients retirent environ six milliards de dollars de FTX. »
Courbe Remotion des retraits cumulés 72 h (0 → 6 Md$) sur une plaque sombre d'`ENV-03`. Compteur central. *Remplace l'animation « tuyau-vanne » qui était trop clip-art.*

**N14 · FLOW-I · gén. 6 s** · VO : « Les hedge funds ... commencent à retirer leur argent. »
Réf. : [1] `ENV-07` · [2] `CHR-EXT-A`
```
Medium shot of three white mannequins in dark tailored suits at a long desk. Each in turn puts down a black landline handset, closes a leather briefcase and walks out of frame toward a dark doorway. Soft practical desk lamps, marble floor. [STYLE]
```
Son : claquement d'attaché-case, pas sur marbre.

**N15 · FLOW-I · gén. 4 s** · VO : « Les influenceurs... commencent à supprimer leurs anciennes publications. »
Réf. : [3] `PRP-SOURIS` + `PRP-CLAVIER`
```
Close-up of a white mannequin hand on a computer mouse, a large monitor in front glowing white-blue. The index finger clicks rapidly, three, four, five times. Locked-off camera, blank screen (content added in post). [STYLE]
```
Post : UI Remotion « DELETE VIDEO », miniatures qui deviennent des rectangles gris « CONTENT DELETED ». Son : clics, corbeille qui se vide.

**N16 · FLOW-I + GFX · gén. 4 s** · VO : « Le prix du FTT s'effondre sous les vingt-deux dollars... »
Réf. : [3] `PRP-FTT`
```
Medium shot: a heavy round token falls from table height onto a stone floor and cracks cleanly in two. A faint echo, low light. [STYLE]
```
Post : courbe rouge 22 $ → 14 $ → 8 $ → 3 $ en GFX, superposée.

**N17 · FLOW-I + GFX · gén. 6 s** · VO : « Le matin du 8 novembre, FTX suspend complètement les retraits. »
Réf. : [1] `ENV-08`
```
Locked-off wide shot of a marble bank hall. At the teller position a heavy steel security gate slides down and locks with a hard final stop. Cold light from above. No customers, no text. [STYLE]
```
Post : UI « ERROR 403 — WITHDRAWALS TEMPORARILY SUSPENDED » en GFX sur un écran de guichet. Son : grille de fer qui claque.

**N18 · FLOW-I · gén. 4 s** · VO : « ...Binance signe une lettre d'intention non contraignante... »
Réf. : [3] `PRP-CONTRAT` + `PRP-STYLO`
```
Top-down shot of a black glass table. A blank two-page contract lies centred, a black pen resting on it with no hand holding it. Slow push-in, soft overhead light. [STYLE]
```
Post : en-têtes « FTX / BINANCE » et tampon « NON-BINDING » en GFX.

### 6.4 — 9 novembre (3:45–4:35)

**N19 · FLOW-I · gén. 8 s** · VO : « 9 novembre. L'équipe de Binance passe moins de deux jours à examiner réellement les comptes de FTX. Puis elle se retire. »
Réf. : [1] `ENV-04` · [2] `CHR-EXT-B` · [3] `PRP-CLASSEURS`
```
Medium shot across an oak table: three white mannequins in dark suits open binders, turn three pages, stop, then slam the binders shut together and stand, pushing their chairs back. Last, they walk out through a glass door which swings shut. Flat window light through venetian blinds. [STYLE]
```
Post : carte « 9 NOVEMBRE 2022 / L'INSPECTION BINANCE ». Son : chaises métalliques, porte coupe-feu.

**N20 · FLOW-I · gén. 4 s** · VO : « Et cette fois, Zhao ne reste pas silencieux sur les raisons. »
Réf. : [2] `CHR-CZ` · [3] `PRP-SMARTPHONE`
```
Close shot of a faceless white mannequin in a dark suit lit only by the glow of a phone held in both hands. The right thumb presses the screen once. Everything else is in darkness. [STYLE]
```
Son : whoosh numérique d'un message qui part.

**N21 · REAL + GFX** · VO : « Dans un tweet, Binance évoque ce qu'elle appelle la due diligence... »
Communiqué Binance réel, trois mots surlignés successivement en rouge (« CORPORATE DUE DILIGENCE », « MISHANDLED CUSTOMER FUNDS », « REGULATORY INVESTIGATIONS »), un bip sourd par surlignage.

**N22 · FLOW-I · gén. 6 s** · VO : « ...décide que le risque n'en valait pas la peine. »
Réf. : [1] `ENV-04` · [3] `PRP-CONTRAT`
```
Locked-off shot of a long glossy table. A document slides slowly from the far side toward camera, stops at the edge of frame, then a gloved hand pushes it back across the table and withdraws. Single lamp, shallow focus. [STYLE]
```
*Remplace la scène du canot de sauvetage doré qui s'éloigne d'un paquebot : plus simple, plus lisible, nettement moins artificielle.*

### 6.5 — 10 novembre (4:35–5:00)

**N23 · FLOW-I · gén. 6 s** · VO : « 10 novembre. Bankman-Fried annonce la dissolution progressive d'Alameda. »
Réf. : [1] `ENV-02`
```
Locked-off wide shot of an open-plan office at night. Monitors switch off one by one, a desk lamp flickers twice and dies, the room falls into darkness except for a single standby LED. [STYLE]
```
Post : carte « 10 NOVEMBRE 2022 / DISSOLUTION D'ALAMEDA ». Son : clics d'interrupteurs, ronronnement des tours qui s'éteint.

**N24 · FLOW-I + GFX · gén. 6 s** · VO : « ...gèle les actifs restants de FTX dans le pays. »
Réf. : [1] `ENV-14` · [2] `CHR-POL` · [3] `PRP-CHAINE`
```
Medium shot in bright tropical sun. A white mannequin in a dark uniform wraps a heavy steel chain around the bars of a wrought-iron gate and snaps a large padlock shut. Hard sunlight, deep shadows, palm leaves moving slightly. [STYLE]
```
Post : avis officiel punaisé (texte et armoiries en GFX). Son : chaîne qui s'enroule, cadenas qui claque.

### 6.6 — 11 novembre et John Ray III (5:00–5:48)

**N25 · FLOW-I · gén. 4 s** · VO : « 11 novembre. FTX, Alameda et près de cent trente entités affiliées déposent le bilan... »
Réf. : [3] `PRP-CHEMISES` + `PRP-TAMPON`
```
Wide shot of a very tall stack of cardboard folders on a courthouse table. A rubber stamp, unmarked, is lowered heavily onto the top folder and the whole stack sways and slumps sideways. Flat institutional light. [STYLE]
```
Post : carte « 11 NOVEMBRE 2022 / CHAPITRE 11 : 130 ENTITÉS », texte du tampon incrusté. Son : tampon titanesque avec réverbération.

**N26 · FLOW-I · gén. 4 s** · VO : « Bankman-Fried démissionne de son poste de PDG. »
Réf. : [3] `PRP-BADGE`
```
Macro on a plastic magnetic ID badge in a hand. The hand opens, the badge falls onto a wooden floor and slides under a piece of furniture into shadow. [STYLE]
```
Post : photo/intitulé du badge en GFX. Son : plastique sur parquet.

**N27 · FLOW-I · gén. 6 s** · VO : « L'homme nommé pour lui succéder... est John Ray III. »
Réf. : [1] `ENV-04` · [2] `CHR-RAY` · [3] `PRP-VALISE`
```
Medium shot: a white mannequin in a navy three-piece suit sets a black leather briefcase on an empty oak table and clicks the two latches open. Behind him, on a shelf, a cardboard archive box. Cold window light. [STYLE]
```
Post : étiquette du carton « ENRON CORP. — 2001 » (`PRP-CARTON_ARCHIVE`) en GFX. Son : fermoirs de mallette.

**N28 · REAL** · carte preuve : photo d'archive de John Ray III (`--style print`).

**N29 · GFX** · VO : « Neuf jours. Trente-deux milliards de dollars sur le papier... »
Frise Remotion 2 nov → 11 nov, chaque jour plus rouge. Photos réelles du siège de Nassau en début et fin de frise. Roulement de tambour sourd qui s'arrête net.

**N30 · FLOW-I · gén. 6 s** · VO : « Lorsque Ray prend les commandes, sa première évaluation publique est sans détour... »
Réf. : [1] `ENV-04` · [2] `CHR-RAY` · [3] `PRP-LAMPE`
```
Medium shot of a white mannequin seated at a polished wooden table, reading a document under a green banker's lamp. He lifts his head, removes round glasses and sets them down on the table with a slow gesture of weariness. Warm lamp pool, cold window behind. [STYLE]
```
Post : surbrillance « COMPLETE FAILURE OF CORPORATE CONTROLS » sur le document en GFX. Son : lunettes posées sur le bois, soupir.

**N31 · GFX · fin d'acte** · VO : « ...tenait essentiellement ses comptes sur un simple tableur. »
Écran divisé : couverture de magazine **inventée** (« THE NEXT BUFFETT? ») à gauche, tableur amateur (police fantaisie, cases jaunes, formule fautive) qui envahit l'écran. Curseur qui clignote. Bip d'erreur **générique** (pas le son Windows).

---

## 7. THE RISE — 5:48 à 9:06
**Logique :** ironie dramatique. Le spectateur connaît la chute : on lui laisse *croire* au faste. Coupes plus lentes (3 à 5 s), tungstène chaud, camera-click à chaque preuve réelle. Le vide se glisse dans les détails (clé usée, pouf, plateau vide).

**R01 · FLOW-I · gén. 6 s** · Carte de chapitre `generate_chapter_card.py` (« 02 / L'ILLUSION / THE RISE »)
Réf. : [1] `ENV-11`
```
Slow pull-back along a very long empty boardroom table at golden hour. Low orange sunlight rakes across the polished wood from tall windows, dust floating in the light. Nothing and nobody in the room. [STYLE]
```
*Remplace la maquette dorée de Wall Street (trop « décor de jeu vidéo »).* Son : verres en cristal lointains, whoosh grave.

**R02 · FLOW-I · gén. 4 s** · VO : « ...onze mois plus tôt. »
Réf. : [3] `PRP-CALENDRIER`
```
Macro of a paper wall calendar on a mahogany table. A hand tears off one page after another, quickly, each torn sheet dropping out of frame. Warm lamp light. [STYLE]
```
Post : **inverser la prise au montage** (de « Novembre » vers « Janvier 2022 »). Les mois s'écrivent en GFX. Son : pages arrachées à grande vitesse, passées à l'envers.

**R03 · REAL · 2 s** · Photo réelle du siège de Nassau en plein jour (`REAL-03`), palmiers, marbre. Son : vagues tropicales.

**R04 · FLOW-I · gén. 6 s** · VO : « Sam Bankman-Fried fonde Alameda Research en 2017... »
Réf. : [1] `ENV-02` · [2] `CHR-SBF`
```
Locked-off medium shot of a white mannequin in an anthracite t-shirt seated in front of four vertical monitors in a small drab office. Daylight through large windows, a neat cable tray, a half-empty cup on the desk. Barely any movement. [STYLE]
```
Post : carte « NOVEMBRE 2017 / FONDATION D'ALAMEDA RESEARCH » (`--pos bottom-left`).

**R05 · GFX** · VO : « ...le Bitcoin se négociait à un prix nettement plus élevé au Japon et en Corée du Sud... »
Split Remotion : « NEW YORK // $10 000 » (blanc) / « TOKYO // $11 500 » (or, mention « KIMCHI PREMIUM »).
**R06 · GFX** · VO : « ...en déplaçant des cryptomonnaies entre ces marchés... »
Animation sobre : ligne de route San Francisco → Tokyo, pièces qui partent d'un côté et réapparaissent de l'autre. Cha-ching mécanique calé sur chaque pièce. *Remplace le câble sous-marin 3D.*

**R07 · FLOW-I · gén. 4 s** · VO : « En 2019, il crée FTX... »
Réf. : [3] `PRP-PLAQUE_ACIER` + `PRP-PLAQUE_VERRE`
```
Top-down shot of a workshop bench. A thick brushed-steel plate lies centred. A sheet of glass, lit from beneath with a cyan glow, is lowered by a hand until it covers the steel plate completely. Network cables on the bench begin to glow cyan. [STYLE]
```
Post : gravures « ALAMEDA RESEARCH » et « FTX EXCHANGE — 2019 » en GFX.

**R08 · GFX** · VO : « En janvier 2022, FTX lève des fonds sur la base d'une valorisation de trente-deux milliards... »
Carte « VALORISATION : JANVIER 2022 / 32 000 000 000 $ » puis quatre sceaux dorés sur marbre noir (SEQUOIA, SOFTBANK, TEMASEK, BLACKROCK), un coup de marteau par sceau. Plaque marbre noir vierge : texte en GFX.

**R09 · FLOW-I · gén. 6 s** · VO : « Environ quatre-vingt-six investisseurs injectent au total près de deux milliards de dollars. »
Réf. : [1] `ENV-11` · [3] `PRP-CLASSEURS`
```
Wide locked-off shot of a long boardroom table covered with many burgundy leather-bound folders stacked into small towers. A gloved hand reaches in and sets an oversized blank cheque on top of the nearest tower. Warm tungsten light. [STYLE]
```
Post : montant « 1 960 000 000 $ » sur le chèque en GFX.

**R10 · FLOW-I · gén. 6 s** · VO : « En pratique, la due diligence ressemblait beaucoup à une validation de marque. »
Réf. : [1] `ENV-11` · [2] `CHR-EXT-A` · [3] `PRP-TAMPON`
```
Medium shot of two white mannequins in expensive suits at a table with a thick, unopened dossier. Without opening it, one of them presses a rubber stamp on the cover, lifts it, and smiles by leaning slightly back in satisfaction. Soft window light. [STYLE]
```
Post : mot « APPROVED » imprimé en GFX sous le tampon. Son : coup de tampon plastique désinvolte.

**R11 · REAL + GFX** · VO : « Sequoia publie un portrait élogieux — depuis supprimé... »
Archive de l'article, passage du jeu vidéo surligné. `camera-click.wav`.

**R12 · FLOW-I · gén. 8 s** · VO : « ...jouait à un jeu vidéo pendant la présentation elle-même... »
Réf. : [1] `ENV-02` · [2] `CHR-SBF` · [3] `PRP-POUF`
```
Medium shot of a white mannequin slumped on a worn blue beanbag, feet on the edge of a desk, wearing a headset. A monitor beside him throws abstract, colourful bursts of light onto his chest. His fingers move on a mouse in short bursts. Slight handheld breathing. [STYLE]
```
Post : écran incrusté avec des éclats abstraits **sans interface lisible** (pas de jeu réel identifiable). Son : clics de souris très rapides, sorts étouffés.

**R13 · FLOW-I · gén. 6 s** · VO : « Les partenaires présents... y voient du génie. Et investissent plus de deux cents millions de dollars. »
Réf. : [1] `ENV-11` · [2] `CHR-EXT-A`
```
Close medium shot of three white mannequins in suits seated side by side, their heads nodding slowly and slightly out of rhythm, lit by the pale glow of a laptop screen in front of them. Dark boardroom behind. [STYLE]
```
Post : écran de virement « TRANSFER CONFIRMED : 214 000 000,00 $ » en GFX. Son : bip bancaire, applaudissements étouffés.

**R14 · FLOW-I · gén. 6 s** · VO : « Presque personne ne pose la question la plus simple qu'une banque poserait... »
Réf. : [1] `ENV-09`
```
High-angle shot looking down at a heavy round bank vault door standing slightly open on pitch-black darkness. The camera is almost still, a faint cold light on the steel rim. [STYLE]
```
Son : silence soudain, écho de pas sur marbre.

**R15 · GFX** · VO : « ...pouvons-nous vérifier indépendamment que l'argent est réellement là ? »
Carte centrée « POUVONS-NOUS VÉRIFIER INDÉPENDAMMENT QUE L'ARGENT EST LÀ ? », écho de tribunal sur chaque mot. Puis carte rouge « NON. » après 1 s de noir.

**R16 · FLOW-I · gén. 6 s** · VO : « La réponse, comme on allait le découvrir, était non. »
Réf. : [1] `ENV-09`
```
Slow push-in through the open round door of a vault toward its interior. Empty steel shelves from floor to ceiling, a single beam of cold light from above, fine dust floating. Nothing on any shelf. [STYLE]
```
Son : sub-bass, grincement de porte lourde.

**R17 · FLOW-I · gén. 6 s** · VO : « L'image publique de Bankman-Fried a joué ici un rôle immense... »
Réf. : [1] `ENV-12` · [3] `PRP-PORTANT`
```
Low-angle locked-off shot in a dark tailor's workshop. A faded black t-shirt and crumpled beige cargo shorts hang on a wooden hanger on a rolling rail. A theatrical spotlight clicks on and lights the clothes alone. [STYLE]
```
Son : clic de projecteur de scène.

**R18 · FLOW-I · gén. 6 s** · VO : « Il conduisait une modeste Toyota Corolla. »
Réf. : [3] `PRP-CLE`
```
Macro on a scratched car key with a worn plastic head on a rusty ring, tossed onto a glass table beside a plain conference badge lanyard. It slides slightly and stops. Cold side light. [STYLE]
```
Post : badge sans logo, texte « FORUM » en GFX générique. Plan réutilisé dans The Pattern et The Breakdown.

**R19 · FLOW-I · gén. 6 s** · VO : « ...on le photographiait endormi à son bureau sous une couverture... » *(précédé par la voiture)*
Réf. : [1] `ENV-15`
```
Locked-off wide shot of a parking row in front of an office building. A small grey compact sedan, scuffed and unwashed, sits between a black luxury saloon and a glossy red sports car, all unbranded. Harsh midday sun. [STYLE]
```

**R20 · FLOW-I · gén. 6 s** · VO : « ...toujours vêtu d'un simple t-shirt et d'un short cargo... »
Réf. : [1] `ENV-02` · [2] `CHR-SBF` · [3] `PRP-POUF` + `PRP-PLAID`
```
Low-angle locked-off shot under a cluttered desk. A white mannequin lies curled on a worn blue beanbag under a grey plaid, motionless apart from slight breathing. Tangled cables beside him. Dim, warm desk-lamp light. [STYLE]
```

**R21 · REAL** · carte preuve : la photo virale réelle de SBF endormi (`--style clean`). `camera-click.wav`.

**R22 · FLOW-I · gén. 6 s** · VO : « ...adhérer au principe de "gagner pour donner"... »
Réf. : [3] `PRP-LIVRE_EA`
```
Top-down shot of a leather-bound book on a brass lectern. A white mannequin hand turns the cover; the pages inside are cut out to form a hidden compartment. Warm spotlight, deep shadow around. [STYLE]
```
Post : titre sur la couverture en GFX. Son : chœur lointain, feutré.

**R23 · GFX** · VO : « Les journalistes adoraient le contraste... »
Défilé de couvertures **inventées** (titres du type « LE ROI DES MOINS DE 30 ANS »), avec portrait SBF en silhouette. Bruissement de journaux. *Pas de couvertures réelles : droits et marques.*

**R24 · REAL** · VO : « Il témoigne devant le Congrès américain... »
Photo d'archive de l'audition, rafale d'obturateurs.

**R25 · FLOW-I · gén. 6 s** · VO : « Il verse près de quarante millions de dollars... à des candidats des deux grands partis. »
Réf. : [3] `PRP-URNES`
```
Medium shot of two oak ballot boxes on a wooden table, one tied with a blue ribbon, one with a red ribbon. Two white mannequin hands slide thick kraft envelopes into the slots at the same moment. Soft side light. [STYLE]
```
Son : froissement feutré d'enveloppes épaisses.

**R26 · REAL + GFX** · VO : « Le logo de FTX apparaît dans des arènes de NBA et sur des voitures de Formule 1. »
Photo réelle `REAL-04` (arène), puis `REAL-06` (monoplace). Son : parquet qui couine, moteur de F1.

**R27 · RÉUTIL H09 + H10** · VO : « Dans une publicité diffusée pendant le Super Bowl... Larry David... »
Plaque TV `H09` + génération `H10` (mannequin en toge, roue rejetée). Deux autres coupes de rejet : une génération `H10` ne suffit pas à produire « toilettes » et « ampoule ». **Décision :** garder la roue seule comme gag principal, enchaîner avec la carte « DON'T BE LIKE LARRY. DON'T MISS OUT ON FTX. » en GFX. Aucun logo NFL.

**R28 · FLOW-I · gén. 6 s** · VO : « ...FTX et Alameda n'avaient en réalité jamais été deux entreprises véritablement séparées. »
Réf. : [1] `ENV-03`
```
Slow push-in between two facing server racks in a dark basement. A thick bundle of braided cables runs from one rack to the other across the aisle; a slow red glow pulses along the cable tray like a heartbeat. [STYLE]
```
Post : plaques « FTX » et « ALAMEDA » sur les racks en GFX. Son : battement de cœur sourd.

**R29 · GFX · fin d'acte** · Les deux logos en verre se superposent et fusionnent en une seule entité opaque. Coupure sur accord de basse.

---

## 8. THE BREAKDOWN — 9:06 à 12:19
**Logique :** le chapitre *ralentit*. Une seule pièce (`ENV-04`), une seule lampe, des gestes précis. La mécanique est expliquée comme un enquêteur la dessinerait sur un bloc-notes. Coupes de 4 à 6 s : l'œil se pose, la voix explique.

**B01 · FLOW-I · gén. 6 s** · Carte `generate_chapter_card.py` (« 03 / LE MÉCANISME / THE BREAKDOWN »)
Réf. : [1] `ENV-04` · [3] `PRP-LAMPE`
```
Top-down shot of a dark oak table. A hand reaches in and clicks on a brass banker's lamp: golden light reveals a worn leather desk pad and a blotter. Everything else stays in shadow. [STYLE]
```
Son : clic mécanique franc de l'interrupteur.

**B02 · FLOW-I · gén. 6 s** · VO : « Retirez la Corolla et la publicité du Super Bowl. Le mécanisme réel est presque désespérément simple. »
Réf. : [1] `ENV-04` · [3] `PRP-CLE` + `PRP-CARNET`
```
Close shot of a table. A gloved white hand pushes aside a scratched car key and a coffee cup, leaving only a yellow legal pad and a black ballpoint pen at the centre. Lamp light, shallow focus. [STYLE]
```

**B03 · FLOW-I · gén. 6 s** · VO : « ...deux cercles reliés par une flèche. »
Réf. : [3] `PRP-CARNET` + `PRP-STYLO`
```
Macro on the tip of a black ballpoint pen drawing two simple circles on yellow legal paper, then a single straight arrow connecting them. Steady hand, slow strokes, lamp light from the left. [STYLE]
```
Post : étiquettes « FTX » et « ALAMEDA » écrites en GFX dans les cercles.

**B04 · FLOW-I · gén. 6 s** · VO : « FTX disait explicitement... que l'argent... resterait sur leurs propres comptes. »
Réf. : [1] `ENV-04` · [3] `PRP-TIROIR`
```
Medium shot of a wooden filing cabinet. A hand pulls out the top drawer on its wooden runners: inside, beige folders neatly aligned, each with a handwritten tab. Warm side light. [STYLE]
```
Post : étiquette en laiton « DÉPÔTS CLIENTS » et noms en GFX. Son : tiroir en chêne sur rails de bois.

**B05 · FLOW-I · gén. 6 s** · VO : « Les procureurs ont ensuite établi que ce n'était pas vrai. »
Réf. : [3] `PRP-ENVELOPPE` + `PRP-TIROIR`
```
Medium shot: a hand slips a sealed kraft envelope into a folder in a filing drawer, then, a moment later, quietly takes it out again and slides it into a cardboard box on the floor under the desk. Hand movement slow and silent. [STYLE]
```
Post : clause « Vos fonds restent votre propriété exclusive » (pour B04), étiquette « ALAMEDA » sur le carton. Son : froissement de kraft feutré.

**B06 · FLOW-I · gén. 8 s** · VO : « ...couvrir les pertes de trading d'Alameda, financer des investissements..., acheter de l'immobilier..., et effectuer ces dons politiques. »
Réf. : [3] `PRP-CHEMISES`
```
Top-down shot of a desk. Four cardboard folders open one after another, left to right, each revealing loosely scattered papers: struck-through receipts, stapled business cards, folded site plans, torn cheque stubs. All writing unreadable. Steady lamp light. [STYLE]
```
Post : intitulés « Pertes de trading », « Startups », « Immobilier Nassau », « Dons politiques » en GFX.

**B07 · REAL + GFX** · VO : « L'immobilier à lui seul représentait près de trois cents millions de dollars... »
Photographies de presse réelles des propriétés (`REAL-07`) étalées en vue zénithale, étiquette « PENTHOUSE ALBANY // 30 000 000 $ ». *Fallback si droits impossibles : plaques génériques + mention « Illustration ».*

**B08 · FLOW-I · gén. 4 s** · VO : « ...enregistrées comme "résidences pour le personnel clé". »
Réf. : [3] `PRP-ACTE`
```
Macro on an official notarised document with a blind embossed seal pressed into the paper. A hand unfolds it slowly and flattens the crease. Raking light shows the relief of the seal. [STYLE]
```
Post : paragraphe surligné en GFX.

**B09 · FLOW-I · gén. 8 s** · VO : « Pour rendre cela possible, il fallait un élément d'ingénierie bien précis... »
Réf. : [1] `ENV-04` · [2] `CHR-WANG` · [3] `PRP-MONITEUR` + `PRP-CLAVIER`
```
Medium shot of a quiet white mannequin in a dark sweater seated at a modern desktop monitor, hands on a mechanical keyboard. Plain plaster walls, a ray of sun through venetian blinds. He types one line, then pauses with his hands hovering above the keys. Very still. [STYLE]
```
Post : ligne `allow_negative = True` (blanc sur noir, sobre) en GFX. Son : une seule frappe sourde sur Entrée.

**B10 · FLOW-I · gén. 4 s** · VO : « Gary Wang... a plus tard témoigné qu'il avait implémenté cette modification sur instruction de Bankman-Fried. »
Réf. : [3] `PRP-CLAVIER`
```
Close shot beside the keyboard: a hand slowly withdraws from the keys and rests on the table. A blank yellow sticky note sits next to the keyboard. Very quiet, only the hum of a monitor fan. [STYLE]
```
Post : **recommandation :** laisser le Post-it **illisible ou marqué « RECONSTITUTION »**. La phrase « Gary : allow negative on Alameda account. — SBF » est une fiction : ne pas la présenter comme une pièce à conviction.

**B11 · GFX** · VO : « Tous les autres comptes... déclenchaient une alerte. Celui d'Alameda, non. »
Registre comptable simple. Ligne 1 : solde −150 $, boîte de dialogue grise générique « Alerte : marge insuffisante ». Ligne 2 : compte Alameda −8 000 000 000 $, aucune boîte, rien ne clignote. Bip discret puis silence total.

**B12 · FLOW-I · gén. 4 s** · VO : « Puis il y a le problème du FTT. FTX a créé le FTT à partir de rien... »
Réf. : [3] `PRP-PRESSE` + `PRP-FTT`
```
Macro on a small cast-iron hand press. A hand pulls the lever down on a plain round brass blank; the lever rises, leaving a smooth coin with no marking. Warm raking light. [STYLE]
```
Post : gravure « FTT » en GFX sur le jeton. Son : presse manuelle qui s'abaisse.

**B13 · FLOW-I · gén. 6 s** · VO : « ...utilisé comme s'il s'agissait d'une véritable garantie. »
Réf. : [3] `PRP-BALANCE` + `PRP-FTT`
```
Medium shot of a cast-iron two-pan scale on a wooden table. A handful of plain metal tokens sits in the left pan; a stack of banknotes is lowered onto the right pan by a hand. The scale tips toward the banknotes. Warm lamp light. [STYLE]
```

**B14 · GFX** · VO : « FTX crée le token. Alameda le détient. Alameda emprunte... Une boucle fermée. »
Schéma sur bloc-notes jaune, tracé au compas : FTX → ALAMEDA → EMPRUNT → SOUTIEN DU COURS, la boucle se referme. Son : pointe de compas qui crisse. *Plus propre en GFX qu'en vidéo générée.*

**B15 · FLOW-I · gén. 6 s** · VO : « Et dès que quelqu'un demande combien vaut réellement la garantie, toute la boucle s'effondre. »
Réf. : [3] `PRP-BALANCE` + `PRP-FTT`
```
Locked-off shot of the same scale, now balanced. A hand removes one token from the left pan; the pan lifts abruptly, the scale swings violently and the remaining tokens roll off and spill across the wooden floor. [STYLE]
```
Son : choc métallique, jetons qui roulent sur un vieux parquet.

**B16 · FLOW-I · gén. 6 s** · VO : « ...jusqu'au moment où suffisamment de personnes demandent à voir l'argent réel. »
Réf. : [3] `PRP-VERRE` + `PRP-SUCRE`
```
Macro shot of a clear glass of water filled to the brim. A hand lowers a plain sugar cube into it; the cube slowly softens and dissolves into the water, small grains falling. Soft window light. [STYLE]
```
Post : trait de marqueur « $ » sur le sucre en GFX (non demandé à l'IA).

**B17 · FLOW-I · gén. 6 s** · VO : « C'était le costume moral que Bankman-Fried portait publiquement. »
Réf. : [1] `ENV-02` · [3] `PRP-PLAID` + `PRP-TASSE`
```
Slow lateral move across a modest, tidy desk: an ergonomic grey mesh chair with a crumpled grey plaid over the back, a half-empty cup of tea, an open mathematics textbook. Soft daylight. The mood of a diligent student. [STYLE]
```

**B18 · FLOW-I · gén. 6 s** · VO : « Les investisseurs voyaient un fondateur qui dormait à son bureau... Les régulateurs... Les clients... »
Réf. : [1] `ENV-04`
```
Slow top-down slide across a wooden desk, passing over three paper items one after another: a newspaper clipping, an official form, a rectangular event ticket. All writing is unreadable. Warm lamp light. [STYLE]
```
Post : trois titres/éléments en GFX (coupure « Le milliardaire qui vit comme un moine » **inventée**, formulaire de régulateur générique, ticket sans marque).

**B19 · FLOW-I · gén. 8 s** · VO : « Le mécanisme était caché en pleine lumière, derrière une personnalité conçue pour rendre la surveillance presque inutile. »
Réf. : [1] `ENV-02` · [2] `CHR-SBF`
```
Locked-off wide shot from a corridor through a half-open door. Inside, a white mannequin sits at a desk, seen from behind, lit by a single hanging bulb. The door slowly swings closed; its shadow narrows the lit space to a thin slit, then black. [STYLE]
```
Son : porte lourde qui se referme, gonds qui grincent. Fin d'acte.

---

## 9. THE NUMBERS — 12:19 à 14:03
**Logique :** les chiffres sont des sentences. Peu de décor, beaucoup de papier. Le climax visuel est le graphique tracé à la main (« le manque à gagner ») : c'est la seule image du chapitre qu'on doit pouvoir se rappeler.

**M01 · FLOW-I · gén. 6 s** · Carte de chapitre (« 04 / L'AUDIT DU SINISTRE / THE NUMBERS ») · VO : « À son sommet, en janvier 2022, FTX était valorisée à trente-deux milliards... »
Réf. : [3] `PRP-CALCULATRICE`
```
Macro on the paper tape of a modern printing desk calculator. It prints two lines in quick succession and the roll advances one notch. First line in black ink, second in red. Hard lamp light from above. [STYLE]
```
Post : « JAN 2022 : 32 000 000 000,00 $ » (noir) puis « NOV 2022 : 0,00 $ » (rouge) en GFX. Son : deux impressions sèches de la calculatrice.

**M02 · FLOW-I · gén. 4 s** · VO : « ...l'entreprise devait plus de onze milliards de dollars... »
Réf. : [3] `PRP-CHEMISES`
```
Medium shot on a wooden desk: a thick grey folder is opened by a hand and overflows with invoices and formal notices, papers sliding out and fanning across the table. Lamp light. [STYLE]
```
Post : carte « TOTAL DES CRÉANCES / 11 400 000 000 $ » (`--pos bottom-right`) — **à reconfirmer** : le script dit « plus de onze milliards ».

**M03 · FLOW-I · gén. 6 s** · VO : « ...environ huit milliards de dollars de fonds clients détournés... »
Réf. : [3] `PRP-CARTONS_PREUVES`
```
Medium shot of a large unmarked brown archive box on a table. A white-gloved hand lifts the lid: inside, thousands of stapled bank slips packed tightly. Flat cold light. [STYLE]
```
Post : pochoir « EXHIBIT 1 — CUSTOMER MISAPPROPRIATION » en GFX (c'est un habillage de reconstitution, pas une pièce réelle).

**M04 · REAL + GFX** · VO : « ...le juge Lewis Kaplan a ordonné à Bankman-Fried de confisquer onze virgule zéro deux milliards de dollars... »
Ordonnance de confiscation réelle (document judiciaire fédéral public), montant surligné (11 020 000 000 $), signature visible. `camera-click.wav`.

**M05 · FLOW-I · gén. 6 s** · VO : « ...La procédure de faillite a passé près de deux ans à retrouver des actifs dispersés... »
Réf. : [1] `ENV-04`
```
Slow push-in on a cork board on a white plaster wall, pinned with blank glossy photo prints. A hand connects them one by one with red wool thread, pressing each pin in with a thumb. Warm lamp light. [STYLE]
```
Post : photos réelles (villa, marina, bureaux) incrustées sur les épreuves vierges. Son : punaise dans le liège.

**M06 · FLOW-I · gén. 4 s** · VO : « ...et même une participation dans l'entreprise d'intelligence artificielle Anthropic. »
Réf. : [3] `PRP-CERTIFICAT`
```
Macro on an ornate stock certificate printed on laid paper with a decorative border; a hand slides it into the pool of light. No readable text. [STYLE]
```
Post : en-tête et mention en GFX. **Retirer la mention « Vendu par la faillite : ~884 000 000 $ »** : ce chiffre n'est pas dans le script, vérifiez-le ou supprimez-le.

**M07 · FLOW-I · gén. 4 s** · VO : « ...98 % des créanciers soient approuvés pour recevoir 118 %... »
Réf. : [3] `PRP-REGISTRE` + `PRP-STYLO`
```
Close shot of an open accounting ledger. A wooden ruler guides a fountain pen that ticks one line in a column with a single firm stroke. Warm side light. [STYLE]
```
Post : colonne « 98 % DES CLIENTS APPROUVÉS » en GFX.

**M08 · FLOW-I · gén. 4 s** · VO : « ...les paiements en espèces commençant en janvier. »
Réf. : [3] `PRP-CHEQUE` + `PRP-TAMPON`
```
Tight shot of a blank cheque on a wooden table. A rubber stamp comes down with a firm knock and lifts away. Shallow focus. [STYLE]
```
Post : « 118 % DE LA VALEUR DE DÉPÔT » et tampon vert « DISTRIBUTION EN COURS — JANVIER 2025 » en GFX.

**M09 · FLOW-I · gén. 4 s** · VO : « ...La plupart des victimes... ne récupèrent jamais plus que quelques centimes par dollar. »
```
Macro shot: three copper one-cent coins drop one after another onto a worn wooden table, clinking lightly and settling close together. Low side light. [STYLE]
```
**Décision :** ne pas afficher « 0,04 $ par dollar » (chiffre inventé). Rester sur « quelques centimes ».

**M10 · FLOW-I · gén. 8 s** · VO : « Mais comme le prix des cryptomonnaies... a fortement augmenté... »
Réf. : [3] `PRP-PAPIER_MM`
```
Top-down shot of orange graph paper pinned on a wooden drawing board. A hand with a steel ruler draws a perfectly horizontal flat line at the bottom in black pen, then a second line in thick red pencil that climbs steeply to the top right, breaking through the grid. Hard lamp light, pencil scratching audible. [STYLE]
```
Post : étiquettes « Cours gelé — nov. 2022 (16 500 $) » et « 2024-2025 » en GFX. **Image-maîtresse du chapitre.**

**M11 · FLOW-I · gén. 6 s** · VO : « Ils n'ont pas seulement perdu ce qu'ils avaient déposé... »
Réf. : [3] `PRP-PAPIER_MM`
```
Macro on the empty space between two drawn lines on graph paper. A hand fills the area with nervous grey pencil hatching, stroke after stroke, until it is solid. Hard lamp light. [STYLE]
```
Post : « LE MANQUE À GAGNER » en lettres capitales manuscrites (GFX). Son : crayon qui frotte, rythmé.

**M12 · FLOW-I · gén. 6 s** · VO : « Elle ne pouvait pas récupérer les années de hausse potentielles qui avaient disparu en même temps que la confiance. »
Réf. : [1] `ENV-04` · [3] `PRP-CHEQUE`
```
Wide shot of an empty oak table, a cast-iron paperweight on a cheque, the graph paper beside it. The camera pulls back slowly; the room is deserted, only the banker's lamp lit. [STYLE]
```
Son : violoncelle grave qui s'éteint dans le silence. Fin d'acte.

---

## 10. THE RECKONING — 14:03 à 16:33
**Logique :** l'asymétrie doit se *voir*. Tout converge vers les cinq blocs de bois (K16). Le tribunal est filmé avec froideur : plans fixes, lumière à 90°, aucune musique d'émotion.

**K01 · FLOW-I · gén. 4 s** · Carte de chapitre (« 05 / LE PROCÈS / THE RECKONING »)
Réf. : [1] `ENV-05` · [3] `PRP-MARTEAU`
```
Static macro on a judge's wooden gavel resting on its sounding block beside a blotter and a cut-glass water carafe. A hand lifts the gavel and strikes once. Cold light from tall windows. [STYLE]
```
Son : un coup de marteau unique, réverbéré.

**K02 · FLOW-I · gén. 4 s** · VO : « Cinq personnes au cœur de cette affaire savaient précisément ce qui arrivait à l'argent des clients. »
Réf. : [1] `ENV-05`
```
Top-down shot of a clerk's table: five beige folders lie side by side, each topped with a blank rectangle clipped on. Flat cold light. [STYLE]
```
Post : photos réelles d'archive (SBF, Salame, Ellison, Wang, Singh) incrustées sur les cinq rectangles.

**K03 · FLOW-I · gén. 4 s** · VO : « Une seule d'entre elles se trouve actuellement dans une prison fédérale. »
Réf. : [3] `PRP-CLEF_CELLULE`
```
Medium shot: a hand sets a heavy steel cell key on the first of five folders with a dull thud. Over the other four folders, the same hand lays an unmarked rubber stamp one after another. [STYLE]
```
Post : mention « COOPÉRATION » sur les quatre dossiers en GFX.

**K04 · GFX** · VO : « ...reconnu coupable des sept chefs d'accusation... »
Sept tampons « GUILTY » en rouge, cadence rapide, sur la première page d'un acte d'accusation. Sept frappes rythmées.

**K05 · FLOW-I · gén. 4 s** · VO : « ...un procès commencé au début d'octobre 2023 et qui s'est terminé par un verdict de culpabilité le 2 novembre. »
Réf. : [3] `PRP-CALENDRIER`
```
Macro on a desk calendar with a leather blotter. A page is turned back and the corner is folded over with a fingernail. Soft side light. [STYLE]
```
Post : « 2 NOVEMBRE 2023 » sur la page en GFX.

**K06 · FLOW-I · gén. 6 s** · VO : « Exactement un an jour pour jour après l'article de CoinDesk... »
Réf. : [1] `ENV-05`
```
Top-down shot of a wooden table: two sheets of paper lie left and right, one yellowed, one white. A hand lays a wooden ruler between them and holds it there. Silent room, flat light. [STYLE]
```
Post : l'article de CoinDesk du 2 nov. 2022 à gauche, la feuille de verdict à droite (REAL).

**K07 · FLOW-I · gén. 6 s** · VO : « À la barre, il a affirmé n'avoir jamais eu l'intention de frauder qui que ce soit... »
Réf. : [1] `ENV-05` · [2] `CHR-SBF`
```
Medium shot of a white mannequin in a rumpled dark suit with a crooked tie, seated at the witness stand. A gooseneck microphone in front of him and a glass of water with one small bubble clinging to the side. Slow push-in of 4%. Cold side light. [STYLE]
```

**K08 · FLOW-I · gén. 8 s** · VO : « Le jury a rejeté cette défense en moins de cinq heures. »
Réf. : [1] `ENV-05`
```
Locked-off medium shot of a plain white courtroom wall clock in a dark wooden frame. Through the shot, the hour hand moves steadily forward in a continuous time-lapse. At the end, a heavy oak door at the back of the room opens. [STYLE]
```
**Fallback :** trois plans fixes de l'horloge (13 h, 15 h 30, 18 h) enchaînés avec fondu, si Omni Flash déforme la rotation des aiguilles.
Son : tic-tac, déclic de serrure.

**K09 · FLOW-I · gén. 4 s** · VO : « ...évasif à un degré que le juge disait avoir rarement observé... »
Réf. : [3] `PRP-STYLO`
```
Close-up of a typed transcript page on a desk. A black fountain pen firmly underlines one line with a single slow stroke. All text unreadable. Lamp light from the right. [STYLE]
```
Post : transcription factice, soulignement sur « EVASIVE ». Marquer « RECONSTITUTION ».

**K10 · REAL + FLOW-I · gén. 4 s** · VO : « En mars 2024, Kaplan le condamne à vingt-cinq ans de prison fédérale... »
Document de condamnation réel (300 mois). Puis :
Réf. : [1] `ENV-13`
```
Locked-off shot of a grey steel detention-block door in a long corridor. The external bolt slides across and drops into place with a final metallic clack. Cold fluorescent light. [STYLE]
```
Son : `camera-click.wav` puis verrou lourd.

**K11 · GFX + FLOW-I · gén. 6 s** · VO : « Ryan Salame... plaide coupable en septembre 2023... »
Réf. : [1] `ENV-05` · [2] `CHR-SAL`
```
Medium shot of a tidy white mannequin in a well-cut suit standing alone in an empty courtroom witness box. The chair beside him is empty and the microphone points at nothing. Cold side light. [STYLE]
```
Post : carte « RYAN SALAME / 7 ANS ET DEMI DE PRISON ».

**K12 · FLOW-I · gén. 4 s** · VO : « Caroline Ellison... témoigne contre lui pendant trois jours au procès. »
Réf. : [3] `PRP-CARNET`
```
Macro on a spiral-bound marbled-cover notebook lying on a witness-stand ledge. A hand with bare nails turns a page slowly: handwritten calculations in blue ballpoint, unreadable. Cold side light. [STYLE]
```

**K13 · FLOW-I · gén. 6 s** · VO : « Elle décrit en détail comment les fonds des clients étaient utilisés... »
Réf. : [1] `ENV-05` · [2] `CHR-ELL` + `CHR-SBF`
```
Wide shot of a dim courtroom. A small mannequin in a beige cardigan and round glasses sits in the witness box, her head turned toward the defence table, where another mannequin sits in the foreground, seen from behind, motionless like marble. Slow push-in of 3%. [STYLE]
```
Post : carte « CAROLINE ELLISON / 2 ANS DE PRISON ».

**K14 · FLOW-I · gén. 4 s** · VO : « Gary Wang... et Nishad Singh... plaident tous deux coupables rapidement et coopèrent largement. »
Réf. : [1] `ENV-05` · [3] `PRP-CLASSEURS`
```
Close shot of two open binders side by side on an oak table, each holding a stack of printouts with a paper clip. Flat cold light. Nothing readable. [STYLE]
```
Post : tampon « SUBSTANTIAL ASSISTANCE CONFIRMED » (à valider : formule de reconstitution).

**K15 · FLOW-I · gén. 6 s** · VO : « Tous deux n'écopent d'aucune peine de prison... »
Réf. : [1] `ENV-05X` · [2] `CHR-WANG` + `CHR-SING`
```
Wide shot from behind: two white mannequins push open both heavy leather-padded courtroom doors and walk out onto stone steps in daylight, descending calmly. The light is warm and bright compared with the interior. [STYLE]
```
Son : portes capitonnées, pas à l'air libre.

**K16 · FLOW-I · gén. 8 s · MAÎTRE-PLAN** · VO : « Alignez ces cinq personnes et le schéma est précis, pas seulement inconfortable... »
Réf. : [1] `ENV-05` · [3] `PRP-BLOCS`
```
Top-down shot of a judge's table. Five solid wooden blocks are placed side by side in a row, like a graduated rule: one very long beam, then a medium block, then a small block, then two flat engraved lines on the table with no block. A brass scale of justice stands beside them. Slow push-in, flat light. [STYLE]
```
Post : étiquettes « SBF 25 ANS », « SALAME 7,5 ANS », « ELLISON 2 ANS », « WANG 0 », « SINGH 0 » en GFX. Son : bois qui frotte sur la table, portes capitonnées qui se ferment. Fin d'acte.

---

## 11. THE PATTERN — 16:33 à 17:47
**Logique :** un seul concept (le costume). Tempo lent, plans longs, silence. On reprend les objets rencontrés au fil de la vidéo (clé, t-shirt, pouf) : le spectateur reconnaît et *comprend* à retardement.

**P01 · FLOW-I · gén. 6 s** · Carte de chapitre (« 06 / L'ANATOMIE DU MASQUE / THE PATTERN »)
Réf. : [1] `ENV-12`
```
Locked-off shot of a solid oak valet stand in a shadowy corner of a deserted tailor's workshop. A slanted sunbeam lights the floating dust around an empty wooden hanger. Slight creak of the floor. [STYLE]
```

**P02 · FLOW-I · gén. 4 s** · VO : « Retirez toute la marque crypto, et une chose ressort. »
```
Macro on an ordinary wooden door. A fingernail lifts the corner of a turquoise vinyl sticker and peels it off slowly, leaving bare worn wood. [STYLE]
```
Post : logo « FTX » sur l'autocollant (GFX).

**P03 · FLOW-I · gén. 4 s** · VO : « ...pas emprunté sa crédibilité à un CV prestigieux... »
```
Medium shot: a hand sweeps a row of leather-bound certificates and company charts off a wooden table into a cardboard box, where they land with a heavy sound. Soft top light. [STYLE]
```
*Aucun nom d'université lisible.*

**P04 · FLOW-I · gén. 6 s** · VO : « ...l'apparence de quelqu'un qui ne se souciait pas du tout de l'argent. »
Réf. : [1] `ENV-12` · [3] `PRP-PORTANT`
```
Medium shot of a faded black cotton t-shirt and crumpled beige cargo shorts on a wooden hanger on a workshop rail, a small cloth tag stitched on by hand. Warm light through shutters. Slight sway. [STYLE]
```
Post : étiquette « Uniforme officiel » en GFX.

**P05 · FLOW-I · gén. 6 s** · VO (suite)
Réf. : [1] `ENV-12` · [2] `CHR-SBF` · [3] `PRP-MIROIR`
```
Wide shot of a white mannequin in a black t-shirt and cargo shorts seated on a raw wooden stool in profile, arms hanging, facing an old three-panel fitting mirror. The mirror is spotted with age and the reflection stays soft and out of focus. Quiet, warm light. [STYLE]
```
**Attention :** les reflets sont un point faible d'Omni Flash. Garder le miroir flou ; sinon, remplacer par un plan de dos.

**P06 · RÉUTIL B02/R18** · VO : « Un milliardaire qui conduisait une Corolla et dormait sous son bureau ne ressemblait pas à quelqu'un qui avait besoin de voler. »
Macro de la clé (`PRP-CLE`) sur table d'acajou, puis plan bas sous le bureau (reprise de R20 : pouf, plaid, baskets). *Aucune nouvelle génération : ces objets sont déjà là, c'est leur reprise qui fait sens.*

**P07 · FLOW-I · gén. 6 s** · VO : « ...n'a pensé à vérifier s'il le faisait. »
Réf. : [3] `PRP-LUNETTES` + `PRP-CLASSEURS`
```
Close shot of two pairs of reading glasses folded on the cover of a thick closed folder on a desk. Nobody turns the first page. Dust catches the lamp light. [STYLE]
```
Post : titre « ÉTATS FINANCIERS FTX » en GFX.

**P08 · FLOW-I · gén. 4 s** · VO (suite)
```
Medium shot of three empty framed portraits on a wall, their glass reflecting a lamp so that the pictures behind stay hidden. A slight hum of a lamp. [STYLE]
```
Post : visages « jeune prodige » par incrustation (REAL, si droits).

**P09 · FLOW-I · gén. 6 s** · VO : « Même le moment qui aurait dû déclencher des signaux d'alarme... un jeu vidéo pendant une présentation à neuf chiffres... »
Réf. : [3] `PRP-SOURIS_JEU`
```
Macro on a leather desk pad with a gold fountain pen and a stapled contract beside a black gaming mouse with a tangled cable. A white mannequin finger clicks the mouse button once, carelessly. Hushed office, soft light. [STYLE]
```
Post : annotation manuscrite **volontairement illisible**. Ne pas inventer le texte « He's in another dimension. Genius. ». Son : clic plastique aigu.

**P10 · FLOW-I · gén. 4 s** · VO : « La crédibilité ne vient pas seulement de l'expertise ou des institutions. »
Réf. : [3] `PRP-VERRE`
```
Close shot of a simple glass of tap water, half full, on bare wood over a clean white blotter. Natural light passes through the water and casts a pure, plain shadow. Quiet. [STYLE]
```

**P11 · FLOW-I · gén. 6 s** · VO : « Parfois, elle vient du fait de ressembler au genre de personne qui n'aurait aucune raison de mentir. »
Réf. : [1] `ENV-02` · [2] `CHR-SBF`
```
Medium locked-off shot of a white mannequin in a black t-shirt and cargo shorts standing in a room with his hands in his pockets and shoulders slightly rounded, head tipped forward. A child-like stillness. Soft window light. [STYLE]
```

**P12 · FLOW-I · gén. 6 s** · VO : « ...près de deux milliards de dollars de capital-risque et une publicité au Super Bowl avant qu'un seul bilan ne soit examiné... »
Réf. : [3] `PRP-LIASSE` + `PRP-CLE_USB`
```
Medium shot on an oak table: a stack of banded cheques and a small black USB flash drive on a short lanyard. The camera tilts down; under them lies a closed envelope with an untouched adhesive seal, a fine veil of dust on it. [STYLE]
```
Post : bande « 1 960 000 000 $ » en GFX. Son : gong de bronze. Fin d'acte.

---

## 12. OUTRO — 17:47 à 19:19
**Logique :** les destins divergent, puis tout se tait. On referme la boucle ouverte au Hook : la pièce, sous la poussière.

**O01 · FLOW-I · gén. 4 s** · VO : « Sam Bankman-Fried ne devrait pas être libéré avant décembre 2044... »
Réf. : [1] `ENV-13`
```
Locked-off shot of a thick steel cell door painted industrial grey, a small reinforced-glass observation slot at eye level and a riveted card holder beside it. Faint ventilation hum. [STYLE]
```
Post : étiquette « DATE DE SORTIE ESTIMÉE : 12/2044 » (carte `--pos bottom-left`, « DÉCEMBRE 2044 / LIBÉRATION PRÉVUE »). **Ne pas afficher un numéro d'écrou réel** sans vérification.

**O02 · FLOW-I · gén. 4 s** · VO : « Caroline Ellison est sortie de détention fédérale en janvier 2026, après quatorze mois. »
Réf. : [3] `PRP-REGISTRE` + `PRP-TAMPON`
```
Medium shot of a large prison ledger lying open on a laminate counter. A hand writes a short line in blue ballpoint, then presses a blue ink stamp on it. Flat fluorescent light. [STYLE]
```
Post : « Ellison, Caroline — peine purgée (14 mois) » et « RELEASED — JAN 2026 » en GFX.

**O03 · FLOW-T · gén. 4 s**
```
Medium locked-off shot of a wrought-iron pedestrian gate opening onto a misty winter street at dawn. A small white mannequin in a dark coat, seen from behind, walks away slowly into the fog. Cold blue light. [STYLE]
```
Son : verrou électrique qui libère le portillon.

**O04 · FLOW-I · gén. 4 s** · VO : « Ryan Salame purge toujours sa peine de sept ans et demi. »
Réf. : [3] `PRP-CALENDRIER`
```
Macro on a small cardboard calendar on a bare metal shelf. A pencil draws crosses through the days one by one in neat rows, halfway through a very long grid. Raking light. [STYLE]
```

**O05 · FLOW-T · gén. 4 s** · VO : « Gary Wang et Nishad Singh n'ont jamais passé une seule nuit en détention fédérale. »
```
Low shot at ankle height: two pairs of plain city shoes of white mannequins walking calmly on a wet city pavement among blurred, anonymous mannequin legs. Soft grey daylight. [STYLE]
```

**O06 · FLOW-I · gén. 4 s** · VO : « Bankman-Fried avait encore un recours... la Cour d'appel du deuxième circuit... »
Réf. : [3] `PRP-DOSSIER_APPEL`
```
Close shot of a thick spiral-bound legal brief on a wooden table; a thumb rapidly riffles the pages from front to back. Hard lamp light. Nothing readable. [STYLE]
```

**O07 · REAL + GFX** · VO : « En juin 2026, un collège de trois juges a rejeté chacun de leurs arguments... »
Première page de la décision d'appel (juin 2026), ligne « CONVICTION AND FORFEITURE AFFIRMED IN FULL » surlignée, tampon rouge « REJECTED ». `camera-click.wav`.

**O08 · REAL + GFX** · VO : « ...Kaplan avait déjà rejeté... qualifiant cette tentative... de stratégie destinée à sauver sa réputation. »
Ordonnance du juge, une seule phrase soulignée. **Ne reprendre une citation entre guillemets que si elle est vérifiée mot pour mot.** Sinon, paraphrase à l'écran.

**O09 · FLOW-I · gén. 4 s** · VO : « En août, la procédure d'appel était officiellement close. »
Réf. : [1] `ENV-10` · [3] `PRP-BOITE_ARCHIVE`
```
Medium shot of a clerk's hands closing the lid of a cardboard archive box and sliding it onto a bottom shelf of a steel rack in a dark warehouse. Soft cold light, dust. [STYLE]
```
Post : étiquette « DOSSIER SBF // CLOS AOÛT 2026 » en GFX.

**O10 · FLOW-I · gén. 4 s** · VO : « Il reste désormais une demande de grâce présidentielle... »
Réf. : [3] `PRP-PETITION`
```
Top-down shot of a single sheet of formal letterhead paper on a green blotter, a closed pen next to it with its cap on. Oblique light. Nobody around. [STYLE]
```
Post : en-tête « PETITION FOR EXECUTIVE CLEMENCY » en GFX.

**O11 · REAL + GFX** · VO : « ...la même administration a déjà gracié Changpeng Zhao... Mais... le vote a été de cent voix contre zéro. »
Coupure de presse réelle sur la grâce de Zhao à gauche, pétition à droite. Puis document officiel du vote (Roll Call), « 100 » cerclé de rouge, carte « VOTE DU SÉNAT AMÉRICAIN / 100 CONTRE — 0 POUR ». Coup de marteau.

**O12 · FLOW-I · gén. 4 s** · VO : « Quelque part dans tout cela se trouve la véritable leçon de cette affaire... »
Réf. : [1] `ENV-04`
```
Wide locked-off shot of the oak investigation table, now empty and quiet. Monitors off, folders sealed in boxes. Only a low ambient hum. The banker's lamp is the only light. [STYLE]
```

**O13 · FLOW-I · gén. 6 s** · VO : « ...ce qu'un jury, un juge — et peut-être un jour un président — sont prêts à pardonner... »
Réf. : [3] `PRP-BALANCE` + `PRP-CLASSEURS`
```
Close shot of a brass scale on the table. A hand sets a worn black binder on the left pan; the pan sinks slowly until it touches the wood and the scale finds balance. Warm lamp light. [STYLE]
```
Post : étiquette « TOUTE LA VÉRITÉ » en GFX.

**O14 · FLOW-I · gén. 8 s · PLAN FINAL** · VO : « ...et exactement quelle quantité de vérité il faut d'abord remettre entre leurs mains pour espérer l'obtenir. »
Réf. : [1] `ENV-04` · [3] `PRP-BTC` + `PRP-COUPELLE` + `PRP-LAMPE`
```
Locked-off macro on the stainless steel dish from the opening, the single gold coin still in its centre, now covered by a fine veil of dust. A white-gloved hand enters frame and clicks off the banker's lamp. Total blackness, then silence. [STYLE]
```
Son : clic de lampe, **1,5 s de silence absolu**.
Carte de fin : `generate_subscribe_cta.py --theme dark-gold --lang fr --pos bottom-right --scale 1.1 --duration 5.0` + filigrane « FINANCIAL FORENSICS — DOSSIER 02 CLOS ».

---

## 13. Ordre de production conseillé

1. **Jour 1 — Assets** : décors (`Environnements_Tous_Les_Prompts.md`), personnages (déjà faits), objets (`Objets_Tous_Les_Prompts.md`). Le Hook ne demande que `ENV-01`, `ENV-01X`, `ENV-01_V2`, `ENV-03`, `ENV-04_NUIT`, `ENV-09`, `ENV-09_B`, `ENV-10` et les 5 objets du Lot 1.
2. **Jour 2 — Hook** : H01 à H13 en priorité, puis monter la séquence complète avec la voix off. Si le Hook tient seul, le reste suit.
3. **Jour 3 — The Nine Days.** Ce chapitre porte la rétention des 5 premières minutes.
4. **Jours 4 à 6 — The Rise, The Breakdown, The Numbers.**
5. **Jour 7 — The Reckoning, The Pattern, l'Outro.**
6. **Jour 8 — Sound design, étalonnage, relecture rétention.**

## 14. Contrôle qualité de chaque plan Flow (3 questions)

- Y a-t-il du **texte déformé ou qui change** dans la vidéo, ou un **logo** ? → refuser, régénérer. (Un texte fixe produit par Nano Banana Pro se relit mot à mot et chiffre à chiffre avant d'être animé.)
- Le mannequin a-t-il un **visage, des cheveux, un doigt en trop** ? → refuser.
- Le mouvement est-il un **geste physique plausible** (un objet qui tombe, une main qui pose) ? Sinon → refuser.

## 15. Points à vérifier avant publication

| Point | Pourquoi |
|---|---|
| **« âgé de vingt-neuf ans »** (Hook) | Sam Bankman-Fried est né le 6 mars 1992 : il avait **30 ans** en novembre 2022 |
| **« dix mois plus tôt »** (Hook) vs **« onze mois plus tôt »** (The Rise) | Même repère temporel, deux valeurs |
| **« l'équivalent d'environ un bitcoin en réserves »** | Chiffre central du Hook, je n'ai pas retrouvé de source précise dans votre liste |
| **884 M$ / Anthropic** (ancien plan) | Chiffre absent du script ; retiré de M06 |
| **0,04 $ par dollar** (ancien plan) | Chiffre inventé ; retiré de M09 |
| **Citations à l'écran** (Kaplan, Post-it, note Sequoia) | Reconstitutions ou paraphrases : ne pas les présenter comme des pièces authentiques |
| **Numéro d'écrou réel** (O01) | Ne l'afficher que s'il est vérifié et public |
| **Droits des photos de presse** (`REAL-0x`) | Statut à documenter pour chaque archive ; les ordonnances fédérales américaines sont en général réutilisables, pas les photos d'agence |
| **Gemini Omni Flash : limite de références, résolution, statut** | Sources divergentes : 5, 7 ou 10 images ; 720p natif selon les outils ; modèle en préversion. À vérifier dans votre Flow avant de planifier les plans à nombreux objets |
| **Divulgation YouTube « contenu synthétique »** | Les reconstitutions sont stylisées (mannequins), mais vérifiez la règle selon le rendu final ; les générations Flow portent un filigrane SynthID invisible |


---

## 16. Ajustements v2.1 d'après deux vidéos de référence

> **Source :** un découpage scène par scène des deux vidéos de référence, rédigé par un autre assistant IA et que vous m'avez transmis. Je n'ai pas pu voir les vidéos moi-même : ce qui suit est donc une **hypothèse de travail à valider sur pilote**, pas un constat. Ce découpage confirme l'approche déjà retenue (objets en gros plan, graphiques en renfort, sons calés) et suggère les cinq ajustements ci-dessous.

### 16.1 Cadence : 2 à 3 s par plan, avec des plafonds
Les durées de la colonne « Coupes » du §4 ont été resserrées. **Règle générale : aucun plan ne dépasse 3,5 s**, sauf cinq « plans de respiration » volontaires : H05 (la pièce), K16 (les cinq blocs), P05 (le miroir), M10 (le graphique) et O14 (le plan final). Ils ont 5 à 8 s. Un rythme rapide en continu fatigue ; ces cinq pauses sont ce qui rend la vitesse supportable.
Conséquence au montage : chaque génération de 6 à 8 s fournit **2 à 3 coupes** de 2 à 3 s.

### 16.2 La chaîne d'images Nano Banana (correction de la version précédente)
**Correction :** j'avais limité Flow à produire une feuille vierge et laissé tout le texte à vos scripts. C'était trop restrictif. Dans Flow, **Nano Banana Pro** produit des images fixes avec du texte lisible, accepte plusieurs images de référence (le nombre exact dépend de votre version : à vérifier) et sait *transformer* une image selon une consigne. C'est ce qui permet le rendu des références. La limite réelle est ailleurs : le texte **dans une vidéo qui bouge** (le modèle vidéo). La règle devient donc : **le texte naît dans une image fixe, puis l'image est animée très peu.**

**La chaîne en 4 étapes (exemple : l'enquêteur dessine l'objet dans son cahier)**
1. **Image source** : l'objet ou le lieu tel qu'il existe déjà dans votre registre (`PRP-BALANCE`, `ENV-03`…), ou une photo réelle.
2. **Version dessinée** (Nano Banana Pro, 1 référence) : l'objet redessiné au crayon.
3. **Page de cahier** (Nano Banana Pro, 2 références : le dessin + une page de cahier réelle `PRP-CAHIER_PAGE`) : le dessin posé sur la page comme s'il y avait été tracé, avec les annotations manuscrites.
4. **Plan vidéo** (Flow, *Frames to Video* avec la page comme première image, ou *Ingredients*) : mouvement minimal, voir les prompts du registre (Annexe B).

**Où appliquer cette chaîne dans le conducteur**
- Partout où le plan dit « en GFX » pour un document, un schéma, un chèque, un bilan, une coupure de presse, un acte : vous pouvez produire l'**image finie** dans Nano Banana Pro (texte compris) au lieu d'un fond vierge + incrustation.
- **Gardez le GFX** pour les éléments qui exigent une typographie parfaite ou des nombres vérifiés au chiffre près (compteurs, courbes, cartes-dates, tampons animés). Dans tous les cas, **relisez chaque mot et chaque chiffre** de l'image avant de l'animer (règle 12).
- Les schémas dessinés (cercles FTX/Alameda, boucle FTT, chronologie des neuf jours, courbes, plan de Nassau, parcours des dépôts) sont listés avec leurs prompts en **Annexe B du registre** : `DRAW-01` à `DRAW-10`.

**Pour que tous les dessins aient la même main :** à chaque nouveau dessin, joignez **le dernier dessin validé** comme référence de style (même crayon HB, mêmes hachures, même écriture manuscrite en majuscules).

### 16.3 Le calcul visible
Les références écrivent à l'écran les chiffres que dit la voix. À adopter pour FTX aux trois moments où le spectateur doit « comprendre par les chiffres » :
- **N13 :** la courbe des retraits (6 Md$) se construit en synchro avec « soixante-douze heures ».
- **B13–B15 :** la balance (garantie / jetons) accompagnée d'une légende chiffrée discrète (« 6 Md$ de FTT »).
- **M10–M11 :** les deux lignes du graphique, annotées avec les valeurs dites (« 16 500 $ » → hausse).
Ces nombres sont incrustés **à l'image près** sur le mot prononcé (règle 12).

### 16.4 Diorama en coupe (nouveau plan B14b)
Les références utilisent une maquette en coupe pour rendre un lieu invisible tangible. Pour FTX, la relation FTX/Alameda se prête bien à ce procédé : un **immeuble de bureaux en coupe, un étage par société, relié par des tubes pneumatiques** dans lesquels descendent des enveloppes.
**B14b · FLOW-I · gén. 8 s** · VO : « FTX crée le token. Alameda le détient. Alameda emprunte… » (à intercaler avant le schéma B14)
Réf. : [3] `PRP-DIORAMA_COUPE`
```
Slow lateral move along a handmade cutaway scale model of a three-storey office building on a workshop table. Each storey is a small room with tiny desks. Thin clear pneumatic tubes link the floors. A small paper capsule travels down a tube from the top floor to the bottom floor, then another. Hard lamp light from the left, visible model-making glue and paint wear. [STYLE]
```
**Fallback si les capsules se déforment :** capsules animées en GFX dans les tubes (plaque sans capsules).
Les étiquettes « FTX » et « ALAMEDA » sont ajoutées en GFX.

### 16.5 Le son, calé à l'image
Les références soulignent des bruitages synchronisés « au millimètre » (papier, serrure, craie). Règle pour le montage final : **chaque geste visible a son SFX, posé à l'image près**, et la voix off laisse au moins une demi-seconde d'air avant les trois plans-clés (H05, M10, K16) pour que le son existe seul.

### 16.6 Pilote avant de produire les ~110 générations
Avant tout, produire **un pilote de 5 plans (≈ 20 s)** : H05+H06 (la pièce), H07 (le casier), N05 (le jeton), B12 (la presse), M10 (le graphique). Critères : les 3 questions du §14 + « un spectateur distrait croit-il à une image filmée ? ». Si deux plans sur cinq échouent, **ne pas lancer la suite** : corriger d'abord le bloc STYLE ou les images maîtres.