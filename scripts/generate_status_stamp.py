#!/usr/bin/env python3
"""
Générateur de Tampon Médico-Légal (Forensic Status Stamp)
=========================================================
Génère une animation percutante de tampon d'investigation avec impact violent,
rebond élastique, onde de choc circulaire et canal alpha ProRes 4444.

Exemples :
----------
# Tampon rouge "ARRESTED" classique :
python scripts/generate_status_stamp.py \\
    --text "ARRESTED" \\
    --subtext "25 OCT 2017 // SDNY" \\
    --color red \\
    --out "episodes/01-ruja-ignatova/assets/overlays/stamp_arrested.mov"

# Tampon or "CONFIDENTIAL" :
python scripts/generate_status_stamp.py \\
    --text "CONFIDENTIAL" \\
    --subtext "FBI SPECIAL INVESTIGATION" \\
    --color gold \\
    --angle -10 \\
    --out "episodes/01-ruja-ignatova/assets/overlays/stamp_confidential.mov"

# Tampon vert "DECLASSIFIED" :
python scripts/generate_status_stamp.py \\
    --text "DECLASSIFIED" \\
    --subtext "FOIA RELEASE 2024" \\
    --color green \\
    --out "episodes/01-ruja-ignatova/assets/overlays/stamp_declassified.mov"
"""

import argparse
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(HERE)
REMOTION_DIR = os.path.join(ROOT_DIR, "financial-forensics")


def main():
    parser = argparse.ArgumentParser(description="Générateur de Tampon Médico-Légal (Status Stamp)")
    parser.add_argument("--text", default="ARRESTED", help="Texte principal du tampon (ex: ARRESTED, GUILTY, FRAUD)")
    parser.add_argument("--subtext", default="SDNY // SPECIAL INVESTIGATION", help="Sous-titre / Date / Référence")
    parser.add_argument("--color", choices=["red", "gold", "green", "cyan"], default="red", help="Palette de couleur")
    parser.add_argument("--angle", type=float, default=-12.0, help="Angle d'inclinaison en degrés (défaut: -12)")
    parser.add_argument("--size", choices=["small", "medium", "large"], default="medium", help="Taille du tampon")
    parser.add_argument("--impact", type=int, default=8, help="Frame d'impact (défaut: 8)")
    parser.add_argument("--duration", type=float, default=3.5, help="Durée totale en secondes (défaut: 3.5s)")
    parser.add_argument("--fps", type=int, default=25, help="FPS (défaut: 25)")
    parser.add_argument("--out", required=True, help="Chemin de sortie (.mov ProRes 4444 ou .mp4)")

    args = parser.parse_args()

    duration_frames = int(round(args.duration * args.fps))
    props = {
        "text": args.text,
        "subText": args.subtext,
        "color": args.color,
        "rotation": args.angle,
        "size": args.size,
        "impactFrame": args.impact,
        "isOverlay": True,
        "durationInFrames": duration_frames,
    }

    out_path = os.path.abspath(args.out)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    is_prores = out_path.endswith(".mov")
    codec_args = (
        ["--codec=prores", "--prores-profile=4444", "--pixel-format=yuva444p10le"]
        if is_prores
        else ["--codec=h264"]
    )

    cmd = [
        "npx", "remotion", "render",
        "src/index.ts",
        "StatusStamp",
        out_path,
        f"--props={json.dumps(props)}",
        f"--frames=0-{duration_frames - 1}",
    ] + codec_args

    print(f"🎬 Rendu StatusStamp en cours -> {out_path} ({duration_frames} frames)...")
    res = subprocess.run(cmd, cwd=REMOTION_DIR)
    if res.returncode == 0:
        print(f"✅ Rendu terminé avec succès : {out_path}")
    else:
        print(f"❌ Erreur lors du rendu Remotion (code {res.returncode})", file=sys.stderr)
        sys.exit(res.returncode)


if __name__ == "__main__":
    main()
