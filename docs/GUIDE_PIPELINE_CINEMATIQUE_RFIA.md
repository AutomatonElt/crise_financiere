# 🎬 Guide & Documentation du Pipeline Cinématique RFIA

> **Emplacement des Skills :** `.agents/skills/`  
> 1. `rfia-direction-artistique/SKILL.md`  
> 2. `rfia-personnages-realistes/SKILL.md`  
> 3. `rfia-realisation-video/SKILL.md`  

---

## 📌 Présentation Générale

Ce pipeline est inspiré de la méthode cinématographique avancée développée par Romain (RFIA Studio). Il a été conçu pour éliminer les trois plus grands écueils de la création vidéo par IA :
1. **L'incohérence visuelle** entre les plans (couleurs, météo, optique divergentes).
2. **L'Uncanny Valley** (visages cireux, peaux plastiques, yeux vitreux).
3. **Les hallucinations physiques et le coût exorbitant** des générations vidéo continues.

---

## 🛠️ Inventaire des 3 Skills Intégrés

### 1. `rfia-direction-artistique`
* **Chemin :** `.agents/skills/rfia-direction-artistique/SKILL.md`
* **Rôle :** Directeur artistique cinéma & architecte de bibles visuelles.
* **Mission :**
  - Analyser des références visuelles (ShotDeck, photogrammes, archives).
  - Verrouiller **6 à 10 invariants** (palette de couleurs, climat, type de lumière, optique, texture).
  - Définir **3 à 5 variables autorisées** (focale, distance de caméra, intensité dramatique).
  - Générer des **prompts JSON agnostiques premium** pour verrouiller les images clés de chaque biome/décor.

### 2. `rfia-personnages-realistes`
* **Chemin :** `.agents/skills/rfia-personnages-realistes/SKILL.md`
* **Rôle :** Directeur de casting live-action & superviseur de continuité faciale.
* **Mission :**
  - Rendu 100 % photographique humain (pores localisés, asymétries anatomiques réelles, micro-plis d'expression, regard vivant).
  - Élimination formelle du rendu 3D, CGI, jeu vidéo ou retouche publicitaire ("no plastic skin").
  - Génération de **planches contact de casting** (face, dos, trois-quarts) en neutralisant la tête miniature pour éviter la pixellisation par le modèle vidéo.

### 3. `rfia-realisation-video`
* **Chemin :** `.agents/skills/rfia-realisation-video/SKILL.md`
* **Rôle :** Réalisateur, chef opérateur & superviseur de mise en scène vidéo multi-moteurs (Google Veo, Seedance, Wan, Kling, Runway, ou 2.5D Motion).
* **Mission :**
  - Application du **découpage en plans courts** (3 à 6 secondes maximum par clip).
  - Séparation stricte du mouvement de caméra et de l'action du sujet.
  - Verrouillage strict des références (`@image1` = identité visage, `@image2` = costume, `@image3` = décor).
  - Sound design obligatoire motivé (bruitages concrets de décor, silences, exclusion des voix/musiques parasites).

---

## 💡 Le Secret de Réalisation : Le Découpage en 5 Plans de Coupe

Pour toute action physique ou reconstitution complexe (ex: impression massive de billets, confrontation, manipulation de tickets, saisie informatique), **ne jamais demander à l'IA une scène d'action continue**.

Découper systématiquement en 5 plans :
1. **Plan 1 (Établissement - Large) :** Pose le décor, l'heure, l'atmosphère (ex: hangar vide Virginia 1992 à 4h du matin).
2. **Plan 2 (Amorce d'action - Moyen) :** Le personnage enclenche le mouvement.
3. **Plan 3 (Réaction - Gros plan visage) :** Le regard, la tension, la fatigue (on suggère l'action sans subir les bugs physiques de l'IA).
4. **Plan 4 (Insert Macro - Détail) :** Les doigts sur le clavier, le massicot qui tranche les coupons, l'encre qui sort.
5. **Plan 5 (Résolution - Large) :** Le résultat final (les cartons pleins jusqu'au plafond).

---

## 🧩 Règle de Séparation Modulaire (Décor Pur vs Props vs Habillage)

Pour garantir une rigueur documentaire absolue et éliminer les hallucinations de faux textes :
1. **Décor Pur (*Clean Plate*)** :
   * Les arrière-plans d'établissement ne doivent comporter **aucun texte ni cartouche de date/lieu** (les titres et repères temporels font partie de l'habillage graphique post-production sur la piste `V3_TITLES`).
   * Les surfaces de travail (bureaux, comptoirs) doivent être **propres et vides de faux documents** prêts à recevoir les objets.
2. **Props Narratifs Isolés sur Fond Neutre (*Evidence Inserts & Diegetic Props*)** :
   * **Étape A (Master Graphique 2D Haute Résolution)** : Rendu vectoriel de précision (formules KaTeX exactes, typographies certifiées, tickets officiels) sans hallucination d'IA.
   * **Étape B (Matérialisation Physique par IA sur FOND NEUTRE)** : L'asset graphique source est passé au générateur d'image en référence pour lui donner sa physicalité tangible (cahier relié d'époque, brochure avec plis réalistes, ticket volumétrique gratté avec pièce et copeaux, badge et clé USB).
   * **Règle Impérative du Fond Neutre Studio** : Les objets générés **doivent obligatoirement être détourés sur un fond neutre uni (gris/blanc studio)**. Zéro décor environnant, zéro meuble parasite, zéro arrière-plan de pièce. C'est ce fond neutre qui permet le découpage parfait, le masquage alpha propre et l'incrustation directe sur la surface vide du biome via le moteur vidéo ou de compositing.
3. **Assemblage Vidéo Multi-Références & Incrustation** :
   * C'est le générateur vidéo (ex: Kling, Veo, Wan) ou le logiciel de montage qui combine la scène :
     * `@image1` = Décor épuré (Clean plate)
     * `@image2` = Personnage validé
     * `@image3` = Prop physique matérialisé sur fond neutre

---

## 🔍 Protocole de Contrôle de Cohérence Post-Génération (Obligatoire)

Après **chaque** génération d'image (biome, personnage, prop), une **vérification visuelle systématique (`view_file`)** doit être effectuée avant toute validation :
1. **Contrôle de Cohérence DA** : L'image s'insère-t-elle sans rupture dans l'univers stylistique (ici Dark Graphic Novel : traits d'encre nets, cel-shading, contrastes) ?
2. **Contrôle de Cadrage & POV** : Le point de vue est-il ouvert et cinématique ? Le sujet ou la surface utile est-il accessible sans obstruction disproportionnée (ex: éviter les stores écrasant 40% du cadre ou les faux POV caissier) ?
3. **Contrôle Clean Plate & Surface Modulaire** : Absence stricte de faux textes/titres incrustés et surface de travail (bureau, comptoir) dégagée pour recevoir les props isolés.
4. **Authenticité des Props & Bannissement des Artifices Factices** :
   * Sur les documents de travail et notes personnelles (ex: feuille de calcul ou carnet intime), **bannir formellement** les faux cachets/tampons sensationnalistes (ex: « DOCUMENT DE RECHERCHE // INTERNE », « CONFIDENTIAL »), les en-têtes d'État déplacés et les faux blocs de signature administrative (« VERIFICAT & APROBAT »).
   * Ces artifices détruisent la crédibilité du documentaire. Les documents personnels doivent rester sobres, organiques et intimistes : écriture manuscrite de travail, calculs purs nets, sans mise en scène bureaucratique artificielle.
5. **Décision Sans Complaisance** : Si l'un des critères flanche, rejet immédiat et régénération avec prompt rectifié.

---

## 🔄 Utilisation avec nos Moteurs de Génération

| Besoin | Outil Utilisé | Règle Opérationnelle |
|---|---|---|
| **Images Clés & Décors** | Google Flow (Imagen 3 / Nano Banana 2) | Gratuit/Illimité avec l'abonnement Google AI Pro via MCP. |
| **Génération Vidéo** | Kling Video / Wan 2.1 / Veo | Générer 2 à 3 prises courtes (195 crédits au lieu de 990 sur Seedance). |
| **Montage & Assemblage** | Kdenlive + OTIO | Chevauchement de 3 à 50 millisecondes (*J-cut / L-cut*) pour lier les plans sans coupure abrupte. |
