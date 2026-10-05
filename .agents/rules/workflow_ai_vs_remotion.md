# Règle de Workflow : IA Générative (Google Flow) vs Scripts / Remotion

Cette règle dicte la stratégie visuelle et la séparation des responsabilités entre la génération d'images/vidéos par IA et le motion design. Elle doit être appliquée par tous les agents travaillant sur le montage et la création des vidéos.

## 1. Ce qui est délégué à l'IA (Google Flow / Veo)
**La combinaison organique, physique et la mise en scène.**
L'IA est responsable de prendre de **multiples ingrédients d'entrée** (images) et de les fusionner dans une même scène vidéo réaliste et cohérente.
*   **Capacité multi-ingrédients :** Le système permet de donner à l'IA plusieurs images comme "points de départ" (ex: un article de presse + un livre + une table) ainsi qu'un personnage via un tag (ex: `@SBF`).
*   **Rôle de l'IA :** C'est l'IA qui gère l'interaction physique entre ces éléments (le personnage qui prend le livre sur la table et lit l'article), en gérant les ombres, les lumières et le réalisme. Il ne faut pas pré-composer ou post-composer ce genre d'interaction physique complexe manuellement.

## 2. Ce qui est délégué aux Scripts et à Remotion
**L'habillage graphique de précision, les données et la typographie.**
Remotion et les scripts Python (comme `generate_evidence_card.py`, `generate_title_card.py`) ne servent pas à combiner des objets physiques. Ils sont strictement réservés à :
*   L'animation des textes et la typographie pure.
*   L'animation des chiffres à l'écran (ex: un compteur qui monte à `$32,000,000,000`).
*   L'apparition des dates, des lieux, et des fiches signalétiques (titres de chapitres, boutons d'abonnement).

## Résumé pour les Agents
Ne jamais proposer de combiner un objet dans les mains d'un personnage via ImageMagick ou Remotion. Si des objets physiques doivent interagir avec un environnement ou un personnage, donnez simplement les images multiples de ces objets en "ingrédients" à l'IA Google Flow et laissez-la générer l'action. Réservez le code (Remotion/Python) uniquement pour faire clignoter du texte, des nombres ou des interfaces graphiques par-dessus la vidéo terminée.
