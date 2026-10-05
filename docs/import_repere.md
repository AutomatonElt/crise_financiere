# Import de repères dans Kdenlive — Documentation de référence
### Comment passer d'une feuille de montage (timecodes) à une timeline Kdenlive balisée automatiquement

---

## 1. Objectif

Éviter de recréer à la main chaque repère de montage (40-55 par épisode) en cliquant dans l'interface. À la place : générer un fichier à partir de la feuille de montage, l'importer d'un coup, et se retrouver avec une timeline entièrement balisée avant même d'avoir posé un seul asset.

---

## 2. Ce qui NE fonctionne PAS — essayé et écarté

### 2.1 Export/Import JSON de repères natif
Kdenlive (menu **Repères → Exporter des repères...**) sait exporter les repères en JSON. La documentation officielle indique que ce JSON peut être ré-importé. **Mais dans la version testée (26.04.3), aucune commande "Importer des repères" n'a été retrouvée dans l'interface** — ni dans le menu Repères, ni dans le clic droit sur la timeline, ni dans le clic droit sur le Moniteur de clip, ni dans le menu contextuel du panneau Repères. Recherche faite aussi via **Configuration → Configurer les raccourcis clavier** (qui liste toutes les actions de l'app, même celles non exposées dans un menu) : rien trouvé sous "import", "repère" ou "marqueur".

**Conclusion : cette voie est une impasse dans cette version. Ne pas y retourner sans revérifier si une mise à jour de Kdenlive l'a ajoutée.**

### 2.2 CapCut Web (écarté avant même d'essayer Kdenlive)
Pas de garantie d'import XML sur la version web (contrairement à CapCut Desktop), et performance documentée comme faible sur les projets longs/multi-couches — exactement notre cas (26 min, plusieurs pistes). Écarté par prudence plutôt que par test direct.

---

## 3. Méthode qui fonctionne : import de projet OpenTimelineIO (OTIO)
te 
Kdenlive supporte l'import **d'un projet entier** au format standard OpenTimelineIO — pas juste des repères isolés, mais un fichier de timeline complet dont les repères font partie. Officiellement documenté, testé et confirmé fonctionnel.

### Où la trouver
**Fichier → OpenTimelineIO import**

### Confirmation empirique (testée le [date de ce test])
Un fichier `.otio` minimal (3 repères, 2 pistes vides) importé dans un nouveau projet vide a produit :
- 3 repères visibles dans le panneau "Repères" (comme de vrais repères de timeline, pas des marqueurs de clip)
- 3 repères visibles directement sur la règle de la timeline, avec noms lisibles
- Aucune altération du reste du projet lors de l'import dans le vrai projet de travail (à condition de choisir fusion, pas remplacement, si l'option est proposée)

---

## 4. Bug découvert et correctif — le champ `"rate"` est ignoré à l'import des repères

### Le problème
Le schéma OTIO standard exprime une position temporelle via un objet `RationalTime` avec deux champs : `"rate"` (fréquence d'images) et `"value"` (nombre d'unités à cette fréquence — normalement des **frames**). Exemple : pour placer un repère à 48,52 secondes dans un projet à 30fps, le standard voudrait `"rate": 30.0, "value": 1456` (1456 frames ÷ 30fps = 48,52s).

**Kdenlive (version 26.04.3) ignore le champ `"rate"` au moment de l'import d'un repère, et traite `"value"` comme un nombre de SECONDES brutes, pas de frames.**

### Preuve (test à 3 repères)

| Repère | Frames envoyées (`value`) | Position attendue | Position réellement obtenue | Explication |
|---|---|---|---|---|
| Test 1 | 2 | 0:00.08 | 00:00:**02**:00 | 2 lu comme 2 secondes |
| Test 2 | 1456 | 0:48.52 | 00:**24:16**:00 | 1456 lu comme 1456 secondes (= 24min16s) |
| Test 3 | 7587 | 4:12.91 | **02:06:27**:00 | 7587 lu comme 7587 secondes (= 2h06min27s) |

Les trois écarts sont **exactement** reproductibles par la formule `secondes_obtenues = value_envoyée`, peu importe le `"rate"` déclaré. Confirmé sur 3 points distincts, donc traité comme un comportement fiable, pas un hasard.

### Le correctif
**Mettre directement le nombre de secondes (décimal) dans le champ `"value"`, et laisser `"rate": 30.0` inchangé dans le schéma** (il ne semble pas gêner, juste ignoré pour ce calcul précis). Concrètement : pour un repère à 48,52 secondes, écrire `"value": 48.52`, pas `"value": 1456`.

Validé sur le fichier complet à 55 repères réimporté dans le vrai projet — toutes les positions sont tombées juste (à l'arrondi à la seconde près, l'affichage Kdenlive ne montrant pas les frames sur cette vue).

---

## 5. Schéma du fichier — gabarit réutilisable

```json
{
    "OTIO_SCHEMA": "Timeline.1",
    "metadata": { "kdenlive": { "version": "26.04.3" } },
    "name": "nom-du-fichier",
    "global_start_time": null,
    "tracks": {
        "OTIO_SCHEMA": "Stack.1",
        "metadata": {},
        "name": "tracks",
        "source_range": null,
        "effects": [],
        "markers": [
            {
                "OTIO_SCHEMA": "Marker.2",
                "metadata": { "kdenlive": { "type": 0 } },
                "name": "Nom court du repère",
                "color": "PURPLE",
                "marked_range": {
                    "OTIO_SCHEMA": "TimeRange.1",
                    "duration": { "OTIO_SCHEMA": "RationalTime.1", "rate": 30.0, "value": 1.0 },
                    "start_time": { "OTIO_SCHEMA": "RationalTime.1", "rate": 30.0, "value": 48.52 }
                },
                "comment": "Description complète du moment"
            }
        ],
        "enabled": true,
        "color": null,
        "children": [
            { "OTIO_SCHEMA": "Track.1", "metadata": {}, "name": "", "source_range": null,
              "effects": [], "markers": [], "enabled": true, "color": null, "children": [], "kind": "Video" },
            { "OTIO_SCHEMA": "Track.1", "metadata": {}, "name": "", "source_range": null,
              "effects": [], "markers": [], "enabled": true, "color": null, "children": [], "kind": "Audio" }
        ]
    }
}
```

**Point critique à retenir : les repères de timeline (par opposition aux marqueurs de clip) doivent être placés dans le tableau `"markers"` au niveau `tracks` (le `Stack` racine) — pas dans le tableau `"markers"` d'un `Track` ni d'un `Clip`.** C'est l'erreur initiale qui a fait échouer le tout premier test (le repère s'était retrouvé imbriqué dans le clip audio).

---

## 6. Procédure complète pour un nouvel épisode

1. Finaliser la feuille de montage (timecodes vérifiés contre la transcription mot-par-mot du voiceover final, pas contre les estimations du script)
2. Convertir chaque ligne de la feuille en entrée `(nom, secondes, commentaire)`
3. Générer le fichier `.otio` avec le gabarit ci-dessus — **valeur en secondes décimales dans `"value"`, jamais en frames**
4. Dans Kdenlive : créer/ouvrir le projet, importer l'audio final sur A1 (calé à 0:00:00:00 avec Home + magnétisme)
5. **Fichier → OpenTimelineIO import** → sélectionner le fichier `.otio`
6. Vérifier les 2-3 premiers repères avant de faire confiance aux suivants
7. Enregistrer le projet sous un nom clair immédiatement après (éviter de laisser un projet nommé "Sequence 1" par défaut)

---

## 7. Checklist avant d'importer sur un nouvel épisode

- [ ] Les timecodes viennent de la transcription réelle (JSON mot-par-mot), pas des estimations du script
- [ ] Toutes les valeurs `"value"` sont en **secondes décimales**, pas en frames
- [ ] Les repères sont dans `tracks → markers`, pas dans un `Track` ou un `Clip`
- [ ] L'audio est déjà posé et calé à 0:00:00:00 avant l'import des repères
- [ ] Le projet est enregistré sous un nom définitif avant de commencer à poser les assets
- [ ] Après import : les 2-3 premiers repères sont vérifiés visuellement avant de continuer

---

## 8. Fichiers de référence produits pour l'épisode Ruja Ignatova

| Fichier | Contenu |
|---|---|
| `test-3-reperes.otio` | Fichier de test initial (3 repères) — a servi à découvrir le bug de `rate` |
| `reperes-complets-ruja-ignatova.otio` | Fichier final — 55 repères, valeurs corrigées en secondes |