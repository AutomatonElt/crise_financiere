# Dossier de Référence Visuelle & Plans CAD — Pont Akashi Kaikyō

> **Projet :** *« The Earthquake That Stretched a Bridge Before It Even Opened »*  
> **Dossiers créés :**  
> - `temp/Docs_science/Akashi/references/` : Plans d'élévation, coupes techniques réelles, blueprints CAD, archives officielles et photos de terrain.  
> - `temp/Docs_science/Akashi/images/` : Images IA cinématiques 16:9 haute fidélité générées selon la bible visuelle (`plan.md`).

---

## 1. Plans Techniques & Blueprints pour la Modélisation Blender

Pour modéliser le pont dans Blender avec une exactitude d'ingénieur, voici les blueprints orthographiques et schémas cotés rassemblés directement depuis les rapports primaires de la **Honshu-Shikoku Bridge Authority (WCEE Nicee #2794)** et de la **JB-Honshi** :

| Fichier Blueprint / Référence | Type & Échelle | Utilisation dans Blender |
|---|---|---|
| [`blueprint_akashi_orthographic_reference.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/references/blueprint_akashi_orthographic_reference.png) | **Master Blueprint 4K** (3840×2160) | **Fond de vue principal (Front/Side/Top)** : Élévation complète 3 911 m, travées 960 m / 1 990 m / 960 m, élévation de tour (282,8 m), coupe transversale du treillis (35,5 m × 14 m) et tableau des cotes. |
| [`fig2_displacement_foundations.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/references/fig2_displacement_foundations.png) | Plan officiel WCEE | **Élévation latérale & vue en plan** des 4 massifs (1A, 2P, 3P, 4A) avec les vecteurs de déplacement mesurés après le séisme de Kobe (+0,8m ~ 1,0m). |
| [`fig5_bridge_deformation_cables.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/references/fig5_bridge_deformation_cables.png) | Schéma de déformation WCEE | **Courbe caténaire des câbles** : modélisation de la remontée de la flèche de 1,3 m au centre et de l'allongement des tronçons de treillis (+800 mm au centre, +340 mm côté Awaji). |
| [`fig8_tower_foundation_mesh.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/references/fig8_tower_foundation_mesh.png) | Maillage structurel EF | **Géométrie du pilonne métallique et du caisson** : proportions des entretoises en X, inclinaison des jambes et assise du caisson cylindrique de 80 m de diamètre. |
| [`fig1_geological_profile.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/references/fig1_geological_profile.png) | Coupe géologique | **Coupe du sol marin sous le détroit** : couche de Kobe, formation d'Akashi, socle de granit et localisation des failles. |
| [`wcee_2794_akashi_earthquake.pdf`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/references/wcee_2794_akashi_earthquake.pdf) | Rapport d'ingénierie complet | Article de référence original de la Honshu-Shikoku Bridge Authority avec toutes les données mesurées au millimètre. |

---

## 2. Photos Réelles du Chantier & Éléments Constructifs (JB-Honshi & Musées)

| Fichier Image | Sujet & Correspondance Script | Détails techniques visibles |
|---|---|---|
| [`construction_plan_04.jpg`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/references/construction_plan_04.jpg) | **Soufflerie (Plan S032)** | Modèle réduit grandeur de 40 mètres du pont complet testé dans la soufflerie géante à 80 m/s (180 mph). |
| [`construction_technology_05.jpg`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/references/construction_technology_05.jpg) | **Levage du tablier (Plan S066, B3)** | Barge de positionnement et levage par câble des tronçons de treillis d'acier depuis la mer. |
| [`construction_technology_03.jpg`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/references/construction_technology_03.jpg) | **Pose des câbles (Plan S036, B2)** | Tirage des câbles pilotes et déroulement des brins préfabriqués (méthode PPWS). |
| [`construction_technology_04.jpg`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/references/construction_technology_04.jpg) | **Amortisseurs (Plan S040)** | Amortisseurs à masse accordée (TMD) installés à l'intérieur des tours pour contrer le vent et les séismes. |
| [`cable_cut_model_wires.jpg`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/references/cable_cut_model_wires.jpg) | **Section du câble (Plan S078)** | Modèle réel en coupe du câble principal montrant l'assemblage compact des 36 830 fils d'acier galvanisé. |
| [`main_cable_clamp_catwalk.jpg`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/references/main_cable_clamp_catwalk.jpg) | **Colliers de suspentes (Plan S070)** | Gros plan sur le collier d'acier serrant le câble principal, la passerelle de service (*catwalk*) et les suspentes verticales. |
| [`truss_girder_interior_underside.jpg`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/references/truss_girder_interior_underside.jpg) | **Structure interne du treillis (B3/B4)** | Vue intérieure sous le tablier : triangulation en acier, poutres transversales et passerelle technique centrale. |
| [`aerial_view_full_span_2004.jpg`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/references/aerial_view_full_span_2004.jpg) | **Survol aérien réel (L1/L13)** | Cliché haute résolution (5 Mo) du détroit d'Akashi, montrant les deux côtes et la courbure naturelle du pont. |
| [`nojima_fault_side_view.jpg`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/references/nojima_fault_side_view.jpg) | **Faille de Nojima réelle (Plan S046)** | Rupture de surface préservée sous abri au musée d'Hokudan sur l'île d'Awaji. |
| [`nojima_fault_coupe.jpg`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/references/nojima_fault_coupe.jpg) | **Coupe de faille géologique (Plan S046)** | Tranchée montrant le plan de glissement vertical et latéral de plus d'un mètre dans le sol. |

---

## 3. Images IA Cinématiques Générées (Pipeline Vidéo / Seedance)

Toutes les images ont été générées au format **16:9** cinématographique 35mm avec grain argentique, sans visages reconnaissables, sans gore ni destructions graphiques, conformément aux directives strictes de monétisation YouTube et à la bible de `plan.md` :

| ID Plan | Fichier Image | Description visuelle & Utilisation Seedance |
|---|---|---|
| **S002** | [`S002_kobe_nuit.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/images/S002_kobe_nuit.png) | **Kobe avant l'aube (5h46)** : Vue depuis les collines, toits de tuiles sombres traditionnels, mont Rokko, fenêtres éclairées, lumières du port au loin. |
| **S003** | [`S003_ref_aube.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/images/S003_ref_aube.png) | **Plan Héros 1 (État B2)** : Les deux tours d'acier émergeant du détroit dans la brume à l'aube, câbles caténaires tendus sans tablier, caissons circulaires dans l'eau. |
| **S006** | [`S006_tuiles.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/images/S006_tuiles.png) | **Frémissement des tuiles** : Gros plan sur les tuiles en céramique japonaise qui vibrent et glissent légèrement au déclenchement de la secousse. |
| **S009** | [`S009_ferry_quai.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/images/S009_ferry_quai.png) | **Ferry à quai** : Ferry de passagers amarré au port de Kobe de nuit, amarres tendues par les ondulations de l'eau. |
| **S010** | [`S010_lampe.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/images/S010_lampe.png) | **Lampe suspendue** : Ampoule nue oscillant dans une pièce traditionnelle en bois, projetant un cône de lumière vacillante sur les cloisons. |
| **S019 / S083** | [`S019_ref_crepuscule.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/images/S019_ref_crepuscule.png) | **Plan Héros 2 (État B4, Final)** : Le pont complet au crépuscule, ciel orange et violet, éclairage routier et tours illuminées, bateaux sur l'eau. |
| **S023** | [`S023_ferry_traversee.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/images/S023_ferry_traversee.png) | **Traversée en ferry** : Bateau traversant le détroit dans la lumière douce du matin, silhouettes d'usagers au bastingage, sillage blanc. |
| **S025** | [`S025_ferry_brume.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/images/S025_ferry_brume.png) | **Ferry des années 50 dans la brume** : Navire historique émergeant du brouillard dense (rappel du drame de 1955), atmosphère feutrée et mélancolique sans naufrage. |
| **S041** | [`S041_maisons_lumieres.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/images/S041_maisons_lumieres.png) | **Extinction des lumières à Kobe** : Même cadrage que S002, fenêtres plongées dans le noir complet après le séisme, mince brume de poussière s'élevant. |
| **S043** | [`S043_ingenieurs_dos.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/images/S043_ingenieurs_dos.png) | **Ingénieurs sur le massif d'ancrage** : Trois ingénieurs de dos en casques blancs et vestes de chantier sur la plateforme en béton brut observant la tour dans la brume. |
| **S046** | [`S046_faille_surface.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/images/S046_faille_surface.png) | **Décrochement de la faille de Nojima** : Vue aérienne sur les rizières d'Awaji montrant une route de campagne sectionnée et décalée latéralement d'un mètre. |
| **S049 / S015** | [`S049_theodolite.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/images/S049_theodolite.png) | **Géomètre au théodolite** : Instrument optique de précision au premier plan sur la rive rocheuse, silhouette d'opérateur de dos, tour du pont au loin dans la brume. |

---

## 4. Données Clés pour la Scène 3D Blender

Dans Blender, placez l'axe du pont le long de l'axe X (ou Y) avec les coordonnées suivantes :
- **Origine (0, 0, 0)** : Niveau de la mer (EL ±0,0 m) au centre du pont.
- **Tour Honshu (2P)** : $X = -995,0\text{ m}$ (avant séisme : $-995,0\text{ m}$ ; après séisme : $-995,4\text{ m}$)
- **Tour Awaji (3P)** : $X = +995,0\text{ m}$ (avant séisme : $+995,0\text{ m}$ ; après séisme : $+995,6\text{ m}$)
- **Sommet des pylônes** : $Z = +282,8\text{ m}$
- **Tablier en treillis métallique** : Largeur $Y = 35,5\text{ m}$, Hauteur $Z = 14,0\text{ m}$, hauteur sous tablier (tirant d'air marin) $= +65,0\text{ m}$.
- **Fondations sous-marines** : Cylindres de $\varnothing 80\text{ m}$, descendant à $Z = -60\text{ m}$.
