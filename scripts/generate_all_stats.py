#!/usr/bin/env python3
"""
Générateur Batch de Toutes les Cartes Chiffres / Shock Stats (Financial Forensics - Ep 01)
-----------------------------------------------------------------------------------------
Génère les cartes graphiques centrées de tous les montants et chiffres clés du script :
- ProRes 4444 avec canal alpha (transparence totale)
- Centrage parfait à l'écran (--pos center)
- Son de frappe clavier synchronisé lettre par lettre
- 100% Anglais
"""

import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(HERE)
GENERATE_SCRIPT = os.path.join(HERE, "generate_title_card.py")
OUT_DIR = os.path.join(ROOT_DIR, "episodes", "01-ruja-ignatova", "assets", "texte_card")

STATS = [
    {
        "filename": "stat_01_fbi_reward_5m.mov",
        "line1": "FBI BOUNTY REWARD",
        "line2": "$5,000,000",
        "hold": 3.2,
    },
    {
        "filename": "stat_02_total_losses_4b.mov",
        "line1": "TOTAL STOLEN FUNDS",
        "line2": "$4,000,000,000+",
        "hold": 3.2,
    },
    {
        "filename": "stat_03_victims_3_5m.mov",
        "line1": "GLOBAL VICTIMS",
        "line2": "3,500,000+ PEOPLE",
        "hold": 3.0,
    },
    {
        "filename": "stat_04_global_countries.mov",
        "line1": "INTERNATIONAL REACH",
        "line2": "175 COUNTRIES",
        "hold": 3.0,
    },
    {
        "filename": "stat_05_package_tiers.mov",
        "line1": "ONECOIN PACKAGES",
        "line2": "€110 — €27,500",
        "hold": 3.0,
    },
    {
        "filename": "stat_06_missing_funds_3_4b.mov",
        "line1": "UNACCOUNTED FOR",
        "line2": "$3.4 BILLION",
        "hold": 3.2,
    },
    {
        "filename": "stat_07_unrecovered_rate.mov",
        "line1": "STOLEN ASSETS",
        "line2": "90%+ NEVER FOUND",
        "hold": 3.0,
    },
    {
        "filename": "stat_08_greenwood_forfeiture.mov",
        "line1": "GREENWOOD FORFEITURE",
        "line2": "$300,000,000",
        "hold": 3.0,
    },
    {
        "filename": "stat_09_scott_laundered.mov",
        "line1": "SCOTT LAUNDERED",
        "line2": "$400,000,000",
        "hold": 3.0,
    },
]


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    print("=" * 65)
    print("📊 GÉNÉRATION BATCH DES CARTES CHIFFRES / MONTANTS CLÉS (ÉPISODE 01)")
    print("=" * 65)

    for idx, stat in enumerate(STATS, 1):
        out_file = os.path.join(OUT_DIR, stat["filename"])
        print(f"\n[{idx}/{len(STATS)}] Génération : {stat['line1']} // {stat['line2']}")
        cmd = [
            sys.executable,
            GENERATE_SCRIPT,
            "--line1", stat["line1"],
            "--line2", stat["line2"],
            "--pos", "center",
            "--hold", str(stat["hold"]),
            "--out", out_file,
        ]
        res = subprocess.run(cmd)
        if res.returncode != 0:
            print(f"❌ Erreur lors de la génération de {stat['filename']}", file=sys.stderr)
            sys.exit(1)

    print("\n" + "=" * 65)
    print(f"🎉 SUCCÈS : {len(STATS)} cartes chiffres générées dans :")
    print(f"📁 {OUT_DIR}")
    print("=" * 65)


if __name__ == "__main__":
    main()
