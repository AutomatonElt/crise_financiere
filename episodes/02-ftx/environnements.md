# TOUS LES ENVIRONNEMENTS — DU DÉBUT À LA FIN
### Un seul document, dans l'ordre. Mode manuel (sans agent). Chaque prompt est complet : on le colle tel quel.

---

## 0. Comment ça marche (à lire une fois)

1. **Réglages :** modèle **Nano Banana Pro**, format **16:9**, nombre de résultats = **1**.
2. **Un prompt = une image.** Vous collez le prompt, vous générez, vous renommez l'image avec son identifiant (comme vous l'avez fait pour `ENV-10`).
3. **Référence à joindre :** quand une ligne dit « **Référence : ENV-01** », ajoutez cette image avec le bouton **+** *avant* de coller le prompt. Sans elle, vous obtenez une autre pièce.
4. **Chaque prompt se termine par la même phrase de règles.** Je l'ai écrite dans chaque prompt pour qu'il n'y ait rien à assembler.
5. **Cochez au fur et à mesure** dans le tableau ci-dessous.

## 1. Tableau de suivi (22 images)

| # | Identifiant | Référence à joindre | État |
|---|---|---|---|
| 1 | `ENV-01` penthouse | — | ✅ fait (prompt au §0bis) |
| 2 | `ENV-04` salle d'enquête (claire) | — | ✅ fait (prompt au §0bis) |
| 3 | `ENV-09` coffres | — | ✅ fait (prompt au §0bis) |
| 4 | `ENV-10` entrepôt de preuves | — | ✅ fait (prompt au §0bis, retouche facultative §A) |
| 5 | `ENV-03` serveurs | — | ⚠️ à restaurer ou régénérer (§B) |
| 6 | `ENV-01X` vitre sous la pluie | `ENV-01` | ☐ |
| 7 | `ENV-01_V2` coin du téléviseur | `ENV-01` | ☐ |
| 8 | `ENV-04_NUIT` table de nuit | `ENV-04` | ☐ |
| 9–19 | `ENV-02` · `ENV-05` · `ENV-05X` · `ENV-06` · `ENV-07` · `ENV-08` · `ENV-11` · `ENV-12` · `ENV-13` · `ENV-14` · `ENV-15` | — | ☐ |
| 20–26 | Vues et états « plus tard » : `ENV-02_JOUR` · `ENV-03_ALLEE` · `ENV-04_V2` · `ENV-04_V3` · `ENV-09_B` · `ENV-09_C` | Voir §E | ☐ |

**Ordre à suivre :** §A → §B → §C (Hook) → §D (reste de la vidéo) → §E (plus tard, à la demande).

---

## §0bis. Les 4 décors déjà faits — prompts d'origine (pour les régénérer si besoin)

> Ces prompts ont produit les images que vous avez validées. Gardez-les : si une image est supprimée ou si vous voulez en refaire une version, collez-les tels quels. Aucune référence à joindre.

### 1. `ENV-01` — le penthouse
```
Contemporary open-plan penthouse living room in Nassau at night, wide view from the entrance, 24mm lens, eye level. Fixed layout: a floor-to-ceiling glass wall on the LEFT looking onto a dark ocean with a few distant lights; a light oak floor; a comfortable low grey sofa and a low coffee table in the centre, with two closed laptops and two soda cans on the table; a modern flat-screen television, switched off, on a low white media unit in the RIGHT-hand corner; a blue fabric beanbag against the BACK wall; one floor lamp giving warm light; cables neatly run along the wall. Warm lamps at 2700K and a soft blue glow from the screens. Calm, comfortable, modern, not luxurious. 16:9, photographic realism, natural film grain, no people, no text, no logos, no signage, no dirt or debris. One image only.
```

### 2. `ENV-04` — la salle d'enquête (claire)
```
Modern project room seen from the END of a long, completely EMPTY matte walnut-veneer table, camera at eye level along the table, 35mm lens. The table is bare: no lamp, no objects, no papers, nothing on it. LEFT wall: floor-to-ceiling windows with white horizontal blinds letting in soft cold daylight. RIGHT wall: a grey metal filing cabinet. BACK wall: smooth white plaster with a large framed cork pin board. Linear LED pendant lights above the table, switched on, warm. Pale polished concrete floor. Calm, clean, contemporary. 16:9, photographic realism, natural film grain, no people, no text, no logos, no signage, no dirt or debris. One image only.
```

### 3. `ENV-09` — la salle des coffres
```
Modern bank safe-deposit room, 28mm lens, camera at eye level facing the wall. Fixed layout: a floor-to-ceiling wall of brushed stainless-steel safe-deposit boxes with small keyholes and tiny plain numbers runs along the LEFT side, every drawer closed; at the far end a modern circular vault door in polished steel stands slightly open. Clean pale polished floor, even cool LED lighting. Secure, clean, contemporary: nothing crumbling. 16:9, photographic realism, natural film grain, no people, no logos, no signage, no dirt or debris. One image only.
```

### 4. `ENV-10` — l'entrepôt de preuves
```
Modern evidence storage room, 28mm lens, camera at eye level looking down a central aisle. Tall white-painted metal shelving on both sides holding identical blank white archive boxes with no markings, a sealed pale concrete floor, a long stainless steel table in the foreground, bright even LED light. Very clean. 16:9, photographic realism, natural film grain, no people, no text, no logos, no signage, no dirt or debris. One image only.
```
*(Si vous voulez la table nue dès la génération, ajoutez : « The steel table is completely bare, nothing on it. »)*

---

## §A. Retouche facultative d'`ENV-10` (table nue)
**Référence : `ENV-10`**
```
Take the reference image and remove every object from the stainless steel table in the foreground, so that the table is completely bare. Keep the room, the shelving, the boxes, the lighting and the camera position exactly the same. 16:9, photographic realism, natural film grain, no people, no text, no logos. One image only.
```
**Nom :** `ENV-10` (remplace la version actuelle)

---

## §B. `ENV-03` — la salle des serveurs

**D'abord : menu de gauche → Corbeille.** Si votre première `ENV-03` y est, restaurez-la et passez au §C. Sinon :
```
Long symmetrical corridor of black server racks in a modern, clean data centre, centred, low camera angle, 24mm lens. Small blinking LEDs on the racks, polished concrete floor, overhead cable trays, a row of ceiling light tubes switched on along the corridor, cold cyan glow (5600K), faint haze. Nothing on the floor. 16:9, photographic realism, natural film grain, no people, no text, no logos, no signage, no dirt or debris. One image only.
```
**Nom :** `ENV-03`

---

## §C. Les 3 vues du Hook (dérivées d'images que vous avez déjà)

### 6. `ENV-01X` — la vitre sous la pluie · **Référence : `ENV-01`**
```
Same room as the reference image: identical walls, floor, furniture, objects and light sources. Only the camera changes. The camera is outside on a rain-soaked terrace at night, looking in through the floor-to-ceiling glass wall into the room. Raindrops running down the glass, a faint reflection of the ocean in the glass, warm interior light. Inside, near the glass wall, add a plain light-oak table with a single simple chair; add no other new object. 35mm lens, locked-off, medium-wide. 16:9, photographic realism, natural film grain, no people, no text, no logos. One image only.
```

### 7. `ENV-01_V2` — le coin du téléviseur · **Référence : `ENV-01`**
```
Same room as the reference image: identical walls, floor, furniture, objects and light sources. Only the camera changes. The camera is low and square-on to the modern flat-screen television in the right-hand corner, the television centred in a medium shot on its low white media unit, the room dim around it, the screen switched off, a soft glow from elsewhere in the room on the wall. 35mm lens. Do not add or remove any object. 16:9, photographic realism, natural film grain, no people, no text, no logos. One image only.
```

### 8. `ENV-04_NUIT` — la table de nuit · **Référence : `ENV-04`**
```
Same room as the reference image: same completely empty walnut table, same walls, windows, cabinet and pin board, same camera position. Only the lighting changes: it is night, a low-key scene. The windows on the left show dark blue night through closed blinds; the ceiling LED lines are switched off; one narrow warm spotlight cone falls from above on the centre of the table, leaving the rest of the room in deep shadow with only a faint cool edge light on the walls. The table stays completely empty. 16:9, photographic realism, natural film grain, no people, no text, no logos. One image only.
```

**Validation :** `ENV-01X` : on reconnaît la pièce à travers la vitre · `ENV-01_V2` : même téléviseur, même meuble blanc · `ENV-04_NUIT` : table vide, un seul cône de lumière.

---

## §D. Les 11 décors du reste de la vidéo (aucune référence)

### 9. `ENV-02` — le poste de travail de SBF
```
Contemporary open-plan workspace at night, 28mm lens. Fixed layout: one long white desk in the centre with six monitors in a row, all switched off; a neat cable tray; an ergonomic grey mesh chair in front of the desk; a blue fabric beanbag next to the desk with a grey blanket on it; a cup of tea and a closed notebook on the desk; white walls, pale floor. One warm desk lamp on the RIGHT and cool blue window light from the LEFT. 16:9, photographic realism, natural film grain, no people, no text, no logos, no signage, no dirt or debris, not luxurious. One image only.
```

### 10. `ENV-05` — le tribunal
```
Modern federal courtroom, 28mm lens, camera at eye level looking from the back of the room toward the front. Fixed layout: light oak veneer panelling; the witness stand with a gooseneck microphone on the RIGHT; a clerk's table in the centre foreground; a defence table on the LEFT; a plain wall clock above the BACK doors; tall windows with soft neutral daylight coming from the LEFT; a pale ceiling with soft even lighting. 16:9, photographic realism, natural film grain, no people, no text, no logos, no signage, no dirt or debris. One image only.
```

### 11. `ENV-05X` — les marches du tribunal
```
Stone steps of a clean neoclassical courthouse in daylight, empty, heavy doors at the top, long soft shadows, 28mm lens. No flags, no signs, no inscriptions. 16:9, photographic realism, natural film grain, no people, no text, no logos. One image only.
```

### 12. `ENV-06` — le bureau du dirigeant
```
Executive corner office at night, 35mm lens. A floor-to-ceiling window over a dense generic city skyline with no readable signs, a minimal light-wood desk, a pale floor, cool city light with a single warm desk lamp. 16:9, photographic realism, natural film grain, no people, no text, no logos, not luxurious. One image only.
```

### 13. `ENV-07` — la salle de marché
```
Empty modern trading floor at night, 28mm lens. Rows of white desks, each with several dark monitors and a plain black landline handset; a ticker-tape machine under a glass dome in the foreground; a pale floor; soft warm desk lamps; one plain green emergency exit light with no lettering. 16:9, photographic realism, natural film grain, no people, no text, no logos, no signage, not luxurious. One image only.
```

### 14. `ENV-08` — le hall de banque
```
Modern bank branch hall at night, 24mm lens. Pale stone floor, glass, brushed-steel teller counters on the LEFT with one security gate open, a modern polished vault door at the far end, even cool LED light. 16:9, photographic realism, natural film grain, no people, no text, no logos, no signage, not luxurious. One image only.
```

### 15. `ENV-11` — la salle de conseil
```
Modern boardroom, 28mm lens. A long, completely empty white-and-oak table, grey fabric chairs, a glass wall on the LEFT onto a dusk skyline, warm LED ceiling lights, soft golden dusk light on the table. 16:9, photographic realism, natural film grain, no people, no text, no logos, not luxurious. One image only.
```

### 16. `ENV-12` — l'atelier de couture
```
Contemporary tailor's atelier, bright and empty, 35mm lens. Bright white walls, a pale concrete floor, a minimalist steel garment rail on the LEFT with a single empty wooden hanger, a simple wooden valet stand in the BACK corner, a three-panel full-length mirror with a thin black frame on the RIGHT, soft daylight through large windows. 16:9, photographic realism, natural film grain, no people, no text, no logos, no dirt or debris. One image only.
```

### 17. `ENV-13` — le couloir de détention
```
Modern federal detention corridor, 24mm lens, camera looking down the corridor. Light-grey painted walls, a clean polished floor, grey steel cell doors on both sides with narrow reinforced glass slots, bright even LED light. 16:9, photographic realism, natural film grain, no people, no text, no logos, no signage, no numbers on the doors. One image only.
```

### 18. `ENV-14` — la grille de Nassau
```
A contemporary black-steel gate set in a white rendered wall, a lush tropical garden behind it, strong midday sun, crisp shadows, palm leaves, 35mm lens. 16:9, photographic realism, natural film grain, no people, no text, no logos, no signage, no plaque. One image only.
```

### 19. `ENV-15` — le parking
```
Office parking row in front of a modern low-rise building in midday sun, 35mm lens. A small plain grey compact sedan, clean, parked between a black luxury saloon on its LEFT and a glossy red sports car on its RIGHT. All three cars are unbranded: no badges, no logos, no readable licence plates. 16:9, photographic realism, natural film grain, no people, no text, no signage. One image only.
```

**Validation du §D :** aucun texte lisible · `ENV-05` : box des témoins à droite, horloge au-dessus des portes · `ENV-11` : table vide · `ENV-13` : aucun numéro sur les portes · `ENV-15` : aucune plaque lisible.

---

## §E. Vues et états « plus tard » (à générer seulement quand le chapitre arrive)

### 20. `ENV-02_JOUR` · **Référence : `ENV-02`**
```
Same room as the reference image: identical desk, monitors, chair, beanbag, objects and layout. Only the lighting changes: it is a dull overcast daytime, soft grey daylight through large windows on the LEFT, no desk lamp lit. Do not add or remove any object. 16:9, photographic realism, natural film grain, no people, no text, no logos. One image only.
```

### 21. `ENV-03_ALLEE` · **Référence : `ENV-03`**
```
Same data centre as the reference image: identical racks, floor, lighting and colour. Only the camera changes: it is now inside an aisle between two facing server racks, looking along the aisle at eye level, with a thick bundle of braided cables running across the aisle from one rack to the other along a cable tray, and a faint red indicator light on the tray. Do not add other objects. 24mm lens. 16:9, photographic realism, natural film grain, no people, no text, no logos. One image only.
```

### 22. `ENV-04_V2` — plongée sur la table · **Référence : `ENV-04`**
```
Same room as the reference image, same completely empty walnut table. Only the camera changes: it is directly above the table, looking straight down, the table filling the frame with a little of the pale floor visible at the edges. Same soft cold daylight and warm light pools. Do not add any object. 16:9, photographic realism, natural film grain, no people, no text, no logos. One image only.
```

### 23. `ENV-04_V3` — vers le tableau de liège · **Référence : `ENV-04`**
```
Same room as the reference image, same completely empty walnut table. Only the camera changes: it is at table height at the side of the table near the windows, looking along the table toward the cork pin board on the back wall. Same lighting, same objects (none on the table). 35mm lens. 16:9, photographic realism, natural film grain, no people, no text, no logos. One image only.
```

### 24. `ENV-09_B` — un tiroir entrouvert · **Référence : `ENV-09`**
```
Same safe-deposit room as the reference image, identical in every detail, with all drawers closed except ONE at mid-height on the left wall, which is open about five centimetres. Inside the opening, an empty felt-lined tray is visible. Do not change anything else. 16:9, photographic realism, natural film grain, no people, no text, no logos. One image only.
```

### 25. `ENV-09_C` — la chambre forte vide · **Référence : `ENV-09`**
```
Same building and same polished steel finish as the reference image. The camera is now just inside the open round vault door, looking into the vault: empty brushed-steel shelves from floor to ceiling on both sides, a single beam of cold light from above, a clean pale floor, completely empty. Nothing on any shelf. 24mm lens. 16:9, photographic realism, natural film grain, no people, no text, no logos. One image only.
```

---

## 2. Récapitulatif : combien de générations ?

| Bloc | Images | Quand |
|---|---|---|
| §A–B | 1 à 2 | Maintenant |
| §C | 3 | Maintenant |
| §D | 11 | Après §C |
| §E | 6 | Plus tard, à la demande |
| **Total à faire avant le pilote vidéo** | **4 à 5** (§A, §B, §C) | |

**Vous n'avez pas besoin du §D ni du §E pour commencer le Hook.** Le Hook utilise : `ENV-01`, `ENV-01X`, `ENV-01_V2`, `ENV-03`, `ENV-04_NUIT`, `ENV-09`, `ENV-10`. Les objets (étape suivante) sont dans `Prompts_Manuels_Hook.md`, §3.