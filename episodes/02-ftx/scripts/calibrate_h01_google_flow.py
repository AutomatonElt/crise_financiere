#!/usr/bin/env python3
"""
Script de calibration et d'assemblage automatique pour le Plan H01 (Google Flow).
Supporte :
1. La calibration d'un seul clip (3.00s, 1080p, 25fps).
2. L'assemblage automatique de deux clips (ex: Vue aérienne 1.8s + Porte d'entrée 1.2s = 3.00s).
"""

import sys
import subprocess
import tempfile
from pathlib import Path

WORKSPACE = Path(__file__).resolve().parents[3]
OUTPUT_DEFAULT = WORKSPACE / "episodes/02-ftx/assets/generated-videos/H01_stakeout_3s_1080p.mp4"


def run_ffmpeg(cmd):
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        print(f"[-] Erreur FFmpeg : {res.stderr}")
        sys.exit(1)


def calibrate_single(input_path: str, output_path: str, duration: float = 3.0):
    input_file = Path(input_path).resolve()
    output_file = Path(output_path).resolve()

    if not input_file.exists():
        print(f"[-] Fichier introuvable : {input_file}")
        sys.exit(1)

    output_file.parent.mkdir(parents=True, exist_ok=True)
    print(f"[+] Calibration en 1080p 25fps ({duration}s) de : {input_file.name}")

    cmd = [
        "ffmpeg", "-y",
        "-i", str(input_file),
        "-t", f"{duration:.2f}",
        "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=25",
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-an",
        str(output_file)
    ]
    run_ffmpeg(cmd)
    print(f"[✓] Terminé : {output_file}")


def stitch_two(clip_a: str, clip_b: str, output_path: str = str(OUTPUT_DEFAULT)):
    output_file = Path(output_path).resolve()
    output_file.parent.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as tmpdir:
        tmp_a = Path(tmpdir) / "part_a.mp4"
        tmp_b = Path(tmpdir) / "part_b.mp4"
        concat_txt = Path(tmpdir) / "concat.txt"

        print(f"[+] Préparation de l'enchaînement :")
        print(f"    Clip A (Vue Aérienne) -> 1.80s")
        print(f"    Clip B (Porte d'entrée) -> 1.20s")

        calibrate_single(clip_a, str(tmp_a), duration=1.80)
        calibrate_single(clip_b, str(tmp_b), duration=1.20)

        with open(concat_txt, "w") as f:
            f.write(f"file '{tmp_a}'\nfile '{tmp_b}'\n")

        print(f"[+] Assemblage du Master H01 (3.00s total, 75 images 25fps)...")
        cmd = [
            "ffmpeg", "-y",
            "-f", "concat",
            "-safe", "0",
            "-i", str(concat_txt),
            "-c", "copy",
            str(output_file)
        ]
        run_ffmpeg(cmd)
        print(f"[✓] Master H01 assemblé avec succès : {output_file}")


if __name__ == "__main__":
    if len(sys.argv) == 2:
        calibrate_single(sys.argv[1], str(OUTPUT_DEFAULT), duration=3.0)
    elif len(sys.argv) >= 3:
        # Deux vidéos à fusionner
        stitch_two(sys.argv[1], sys.argv[2], str(OUTPUT_DEFAULT))
    else:
        print("Usage:")
        print("  Pour 1 vidéo  : python3 calibrate_h01_google_flow.py <video.mp4>")
        print("  Pour 2 vidéos : python3 calibrate_h01_google_flow.py <vue_aerienne.mp4> <porte_entree.mp4>")
        sys.exit(1)
