#!/usr/bin/env python3
"""
Générateur & Calibrateur Universel de Vidéos — Financial Forensics
Standardise n'importe quel clip vidéo (Google Flow, Seedance, archives, etc.)
vers la norme stricte de la chaîne et de la timeline Kdenlive :
- Résolution : 1920x1080 (Full HD centré, scale + crop sans distorsion)
- Fréquence d'images : 25.0 FPS strict (désynchronisation évitée sur la timeline)
- Format de pixel : yuv420p (compatibilité maximale NLE/OTIO)
- Audio : AAC 48000 Hz stéréo (si piste audio présente)
- Encodage : H.264 CRF 18 (qualité master visuellement sans perte)
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path


def probe_video(input_path: Path):
    cmd = [
        "ffprobe",
        "-v", "quiet",
        "-print_format", "json",
        "-show_streams",
        "-show_format",
        str(input_path)
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        return {}
    try:
        return json.loads(res.stdout)
    except json.JSONDecodeError:
        return {}


def calibrate_video(
    input_path: str | Path,
    output_path: str | Path = None,
    fps: int = 25,
    width: int = 1920,
    height: int = 1080,
    crf: int = 18,
    duration: float = None,
    mute: bool = False,
    mode: str = "fill"
) -> Path:
    inp = Path(input_path).resolve()
    if not inp.exists():
        raise FileNotFoundError(f"Fichier d'entrée introuvable : {inp}")

    if output_path is None:
        out = inp.parent / f"{inp.stem}_{fps}fps_{height}p.mp4"
    else:
        out = Path(output_path).resolve()

    out.parent.mkdir(parents=True, exist_ok=True)

    info = probe_video(inp)
    streams = info.get("streams", [])
    has_audio = any(s.get("codec_type") == "audio" for s in streams)

    print(f"[+] Calibration en cours : {inp.name} -> {out.name}")
    print(f"    Norme : {width}x{height} @ {fps}.0 FPS (CRF {crf}, mode: {mode})")

    # Filtre vidéo sans déformation géométrique (respect strict du ratio d'aspect) :
    # - mode 'fill' : couvre 1920x1080 et recadre au centre (zoom proportionnel sans bandes noires)
    # - mode 'fit'  : affiche 100% de l'image et ajoute des barres noires (pillarbox/letterbox)
    if mode == "fit":
        vf_filter = (
            f"scale={width}:{height}:force_original_aspect_ratio=decrease:flags=lanczos,"
            f"pad={width}:{height}:(ow-iw)/2:(oh-ih)/2,"
            f"fps={fps}"
        )
    else:
        vf_filter = (
            f"scale={width}:{height}:force_original_aspect_ratio=increase:flags=lanczos,"
            f"crop={width}:{height},"
            f"fps={fps}"
        )

    cmd = [
        "ffmpeg", "-y",
        "-i", str(inp)
    ]

    if duration is not None:
        cmd.extend(["-t", f"{duration:.3f}"])

    cmd.extend([
        "-vf", vf_filter,
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", str(crf),
        "-pix_fmt", "yuv420p"
    ])

    if mute or not has_audio:
        cmd.append("-an")
    else:
        cmd.extend([
            "-c:a", "aac",
            "-b:a", "192k",
            "-ar", "48000"
        ])

    cmd.append(str(out))

    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        print(f"[-] Erreur FFmpeg : {res.stderr}", file=sys.stderr)
        raise RuntimeError(f"Erreur durant la calibration de {inp.name}")

    print(f"[✓] Vidéo calibrée avec succès : {out}")
    return out


def main():
    parser = argparse.ArgumentParser(
        description="Calibrateur de vidéo universel pour la timeline Kdenlive (25 FPS, 1080p, H.264)."
    )
    parser.add_argument("input", help="Chemin du fichier vidéo d'entrée (MP4, MOV, WebM, etc.)")
    parser.add_argument("-o", "--out", help="Chemin du fichier de sortie (optionnel)")
    parser.add_argument("--fps", type=int, default=25, help="Fréquence d'images (défaut: 25)")
    parser.add_argument("--width", type=int, default=1920, help="Largeur en pixels (défaut: 1920)")
    parser.add_argument("--height", type=int, default=1080, help="Hauteur en pixels (défaut: 1080)")
    parser.add_argument("--crf", type=int, default=18, help="Qualité H.264 CRF (défaut: 18)")
    parser.add_argument("-d", "--duration", type=float, help="Durée maximale en secondes (optionnel)")
    parser.add_argument("--mute", action="store_true", help="Supprimer la piste audio")
    parser.add_argument(
        "--mode",
        choices=["fill", "fit"],
        default="fill",
        help="Mode de cadrage : 'fill' (plein écran centré, pas de barres) ou 'fit' (barres noires si ratio différent, 100%% image)"
    )

    args = parser.parse_args()

    try:
        calibrate_video(
            input_path=args.input,
            output_path=args.out,
            fps=args.fps,
            width=args.width,
            height=args.height,
            crf=args.crf,
            duration=args.duration,
            mute=args.mute,
            mode=args.mode
        )
    except Exception as e:
        print(f"[-] Erreur : {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
