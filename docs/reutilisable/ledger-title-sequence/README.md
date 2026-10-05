# 🎬 Séquence de Titre Animée en 3 Temps — The Ledger (100% Procédurale & Paramétrable)

Ce composant est l'équivalent d'un **template After Effects professionnel entièrement automatisable** via React/Remotion et script Python CLI.

Contrairement à un simple montage d'images figées, **chaque élément est un calque indépendant modifiable à la volée** :
- Les **photos centrales** (bâtiment, cible, suspect principal).
- Les **documents et pièces d'archives** (bilan financier fuité, coupure de presse, tweet d'accusation).
- Les **légendes de polaroids** (`EXHIBIT A // COINDESK LEAK`).
- Les **titres monumentaux** (`NINE DAYS TO ZERO`) et leurs sous-titres spatio-temporels.
- Les **annotations manuscrites à la plume** tracées dynamiquement à l'écran (`Caveat` font).
- Le **cartouche gravé en laiton** avec le nom et rôle du protagoniste.
- Le **billboard final** avec le logo officiel en or sculpté, l'éclair laser cyan et les particules dorées en suspension.

---

## 🛠️ Tableau des Paramètres Éditables

| Paramètre CLI | Description | Exemple FTX | Exemple Madoff |
|---|---|---|---|
| `--p1-title` | Titre du Dossier (Phase 1) | `"NINE DAYS TO ZERO"` | `"L'ARNAQUE DU SIÈCLE"` |
| `--p1-subtitle` | Sous-titre spatio-temporel | `"THE COLLAPSE OF FTX • NOV 2022"` | `"WALL STREET • DÉCEMBRE 2008"` |
| `--p1-main-img` | Photo centrale du lieu | `ftx_real/ftx_hq.jpg` | `madoff_lipstick_building.jpg` |
| `--p1-left-img` | Pièce à conviction gauche | `ftx_real/coindesk_article.jpg` | `madoff_fake_statement.jpg` |
| `--p1-left-caption` | Légende archive gauche | `"EXHIBIT A // COINDESK LEAK"` | `"EXHIBIT A // FAKE BLOTTER"` |
| `--p1-right-img` | Pièce à conviction droite | `ftx_real/cz_tweet.jpg` | `sec_complaint.jpg` |
| `--p1-right-caption`| Légende archive droite | `"EXHIBIT B // CZ LIQUIDATION"` | `"EXHIBIT B // SEC FILING"` |
| `--p1-note-top` | Manuscrit haut gauche | `"8 billion dollars deficit"` | `"65 milliards de dollars"` |
| `--p1-note-bottom` | Manuscrit bas droite | `"Nassau, Bahamas"` | `"17th Floor Slush Fund"` |
| `--p2-name` | Nom du Suspect (Phase 2) | `"SAM BANKMAN-FRIED"` | `"BERNARD L. MADOFF"` |
| `--p2-role` | Rôle du Suspect | `"CEO & FOUNDER // FTX"` | `"FOUNDER // BMIS LLC"` |
| `--p2-suspect-img` | Portrait d'archive du suspect| `ftx_real/sbf_portrait.jpg` | `madoff_portrait.jpg` |
| `--p2-left-img` | Archive complice/témoin | `ftx_real/caroline_ellison.jpg` | `frank_diPascali.jpg` |
| `--p2-left-caption`| Légende complice | `"CAROLINE ELLISON // ALAMEDA"` | `"FRANK DILPASCALI // CFO"` |
| `--p2-right-img` | Archive lieu/arrestation | `ftx_real/albany_bahamas.jpg` | `madoff_penthouse.jpg` |
| `--p2-right-caption`| Légende lieu | `"ALBANY PENTHOUSE // $35M"` | `"MANHATTAN DUPLEX // $7M"` |
| `--p2-note-left` | Manuscrit gauche suspect | `"backdoor withdrawal code"` | `"split-strike conversion"` |
| `--p2-note-right` | Manuscrit droite suspect | `"11 November 2022 : Chapter 11"`| `"150 Years Imprisonment"` |
| `--channel` | Nom de la chaîne | `"THE LEDGER"` | `"THE LEDGER"` |
| `--tagline` | Devise / sous-titre | `"FINANCIAL FORENSICS"` | `"FINANCIAL FORENSICS"` |
| `--logo` | Logo officiel de marque | `brand/the_ledger_logo.png` | `brand/the_ledger_logo.png` |

---

## ⚡ Exemple d'Exécution en 1 Ligne de Commande

### Pour l'épisode FTX :
```bash
python3 scripts/generate_ledger_title_sequence.py \
  --p1-title "NINE DAYS TO ZERO" \
  --p1-subtitle "THE COLLAPSE OF FTX • NOVEMBER 2022" \
  --p1-main-img "ftx_real/ftx_hq.jpg" \
  --p1-left-img "ftx_real/coindesk_article.jpg" \
  --p1-left-caption "EXHIBIT A // COINDESK LEAK" \
  --p1-right-img "ftx_real/cz_tweet.jpg" \
  --p1-right-caption "EXHIBIT B // CZ LIQUIDATION" \
  --p1-note-top "8 billion dollars deficit" \
  --p1-note-bottom "Nassau, Bahamas" \
  --p2-name "SAM BANKMAN-FRIED" \
  --p2-role "CEO & FOUNDER // FTX & ALAMEDA RESEARCH" \
  --p2-suspect-img "ftx_real/sbf_portrait.jpg" \
  --p2-left-img "ftx_real/caroline_ellison.jpg" \
  --p2-left-caption "CAROLINE ELLISON // ALAMEDA" \
  --p2-right-img "ftx_real/albany_bahamas.jpg" \
  --p2-right-caption "ALBANY PENTHOUSE // $35M" \
  --p2-note-left "backdoor withdrawal code" \
  --p2-note-right "11 November 2022 : Chapter 11" \
  --out episodes/02-ftx/assets/texte_card/title_sequence_nine_days_to_zero.mp4
```
