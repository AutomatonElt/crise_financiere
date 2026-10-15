#!/usr/bin/env python3
"""
Wrapper universel pour la génération rapide d'images Google Flow via Nano Banana 2.1 (Google AI Pro).

Usage:
  python3 scripts/generate_flow_image.py --prompt "Description..." --name "mandel_ledger" --category "characters"
  python3 scripts/generate_flow_image.py -p "Hangar 1992..." -n "virginia_warehouse" -c "biomes"
"""

import sys
import os
import argparse
import subprocess

def main():
    parser = argparse.ArgumentParser(description="Générateur d'images rapide Google Flow (Nano Banana 2.1)")
    parser.add_argument("--prompt", "-p", required=True, help="Description visuelle de l'image")
    parser.add_argument("--name", "-n", default="flow_asset", help="Nom du fichier généré")
    parser.add_argument("--category", "-c", default="general", choices=["characters", "biomes", "b-roll", "evidence", "general"], help="Dossier de destination")
    parser.add_argument("--out", "-o", default=None, help="Chemin explicite du dossier de sortie")
    parser.add_argument("--timeout", "-t", type=int, default=90000, help="Délai d'attente maximum en ms")

    args = parser.parse_args()

    mcp_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "google-flow-mcp"))
    generator_script = os.path.join(mcp_dir, "generate-flow-asset.js")

    if not os.path.exists(generator_script):
        print(f"❌ Erreur: Script introuvable à {generator_script}")
        sys.exit(1)

    cmd = [
        "node",
        generator_script,
        "--prompt", args.prompt,
        "--name", args.name,
        "--timeout", str(args.timeout)
    ]

    if args.out:
        cmd.extend(["--out", os.path.abspath(args.out)])
    else:
        cmd.extend(["--category", args.category])

    try:
        res = subprocess.run(cmd, cwd=mcp_dir, check=True)
        sys.exit(res.returncode)
    except subprocess.CalledProcessError as e:
        print(f"❌ Échec de la commande de génération (code {e.returncode})")
        sys.exit(e.returncode)

if __name__ == "__main__":
    main()
