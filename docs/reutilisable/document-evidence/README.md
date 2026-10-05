# 📄 Composant : Document Evidence Highlighter & Redaction (Surlignage & Déclassification)

Ce composant permet de mettre en scène une pièce judiciaire, un extrait d'audit interne, un contrat ou un email fuité compromettant, avec un **surlignage feutre or/jaune animé** de gauche à droite ou une **levée de censure (déclassification)**.

---

## 🎯 Quand l'utiliser ?

* 🔹 Révélation d'un document écrit accablant (email privé, note interne, SMS).
* 🔹 Mise en avant d'une clause contractuelle ou d'un chiffre falsifié dans un bilan comptable.
* 🔹 Présentation d'un acte d'accusation du DOJ / FBI avec mot-clé déclassifié.
* 🔹 Séquence narrative où la voix off cite textuellement une phrase du document.

---

## 📸 Styles & Modes Disponibles

| Mode / Style | Effet Visuel | Utilisation recommandée |
|---|---|---|
| **`mode="highlight"`** | Trait de feutre translucide or/jaune tracé de gauche à droite sur les mots clés avec lueur chaude et pop-out du texte. | Citation d'une phrase choc dans un email ou rapport. |
| **`mode="redaction"`** | Bande noire opaque de censure ("CLASSIFIED") qui glisse ou s'efface pour révéler le mot secret. | Déclassification d'un nom de code, lieu de fuite ou complice. |
| **`style="dark_legal"`** | Fond papier judiciaire sombre (`#0B0F19`) avec filigrane rouge `CONFIDENTIAL` et bordures subtiles. | Standard visuel cinématique de la chaîne. |
| **`style="transparent"`** | Document sans fond, exportable en ProRes 4444 pour superposition sur B-roll. | Incrustation directe sur des images de tribunaux ou bureaux. |

---

## 💻 Commande CLI

```bash
# Surlignage standard (durée 4.5s)
.venv/bin/python scripts/generate_document_evidence.py \
    --header "EXHIBIT B — INTERNAL MEMO" \
    --date "OCTOBER 20, 2014" \
    --sender "ruja.ignatova@onecoin.eu" \
    --recipient "sebastian.greenwood@onecoin.eu" \
    --subject "Strategy update" \
    --text "We are not mining coins. If things go bad, we take the money and run and blame someone else." \
    --highlight "take the money and run" \
    --mode highlight \
    --duration 4.5 \
    --out "episodes/01-ruja-ignatova/assets/evidence/doc_memo_run.mov"
```

---

## 🔊 Sound Design Recommandé

* **Entrée (Frame 0)** : Léger froissement de papier d'archive ou son d'obturateur (`camera-shutter/`).
* **Surlignage (Frame 22)** : Crissement feutré de marqueur / feutre (*felt-tip marker squeak*) calé exactement sur le tracé de la phrase.
* **Piste de destination** : Placer la vidéo sur `V2_OVERLAYS` ou `V1_MAIN` selon la mise en scène.
