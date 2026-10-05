#!/usr/bin/env python3
"""
Générateur de Document / Pièce à Conviction 3D avec Caméra Virtuelle & Reflets Spéculaires
-----------------------------------------------------------------------------------------
Technologie : Three.js + React Three Fiber + Remotion + WebGL
Rendu : Travelling cinématographique lent, reflets de lumière spéculaire balayant le document,
        profondeur de champ avec micro-poussières en 3D, ombre douce portée et biseau papier.
"""

import argparse
import base64
import json
import mimetypes
import os
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT_DIR = HERE.parent
REMOTION_DIR = ROOT_DIR / "financial-forensics"
DEFAULT_WHOOSH_AUDIO = ROOT_DIR / "_shared" / "sfx" / "whoosh" / "whoosh_medium.wav"


def encode_image_to_data_uri(image_path: Path) -> str:
    if not image_path.exists():
        raise FileNotFoundError(f"Image introuvable : {image_path}")

    mime_type, _ = mimetypes.guess_type(str(image_path))
    if not mime_type:
        mime_type = "image/jpeg"

    with open(image_path, "rb") as f:
        encoded = base64.b64encode(f.read()).decode("utf-8")

    return f"data:{mime_type};base64,{encoded}"


def render_3d_document(
    image_path: str,
    out_path: str,
    title: str = "EXHIBIT FORENSIC",
    duration_sec: float = 5.0,
    fps: int = 25,
    sound: bool = True,
    transparent: bool = False,
    aspect_ratio: float = 16 / 9,
):
    abs_image = Path(image_path).resolve()
    abs_out = Path(out_path).resolve()
    duration_frames = int(round(duration_sec * fps))

    print("\n" + "=" * 70)
    print("🎥 3D & CAMÉRA VIRTUELLE (Three.js / React Three Fiber / Remotion)")
    print("=" * 70)
    print(f"📄 Image / Document : {abs_image.name}")
    print(f"🏷️  Titre document   : {title}")
    print(f"📐 Ratio d'aspect   : {aspect_ratio:.3f}")
    print(f"⏱️  Durée            : {duration_sec:.2f}s ({duration_frames} frames @ {fps}fps)")
    print(f"✨ Transparence     : {'Canal Alpha (ProRes)' if transparent else 'Décor Forensic Sombre 3D'}")
    print(f"💾 Fichier sortie   : {abs_out}")
    print("=" * 70 + "\n")

    image_data_uri = encode_image_to_data_uri(abs_image)

    props = {
        "imageSrc": image_data_uri,
        "documentTitle": title,
        "aspectRatio": aspect_ratio,
        "durationInFrames": duration_frames,
        "transparent": transparent,
    }

    abs_out.parent.mkdir(parents=True, exist_ok=True)
    temp_props_file = abs_out.with_suffix(".props.json")
    temp_video = abs_out.with_name(f"temp_{abs_out.name}")

    with open(temp_props_file, "w", encoding="utf-8") as f:
        json.dump(props, f)

    is_mov = abs_out.suffix.lower() == ".mov"
    codec_args = (
        ["--codec=prores", "--prores-profile=4444", "--pixel-format=yuva444p10le"]
        if (is_mov or transparent)
        else ["--codec=h264", "--crf=16"]
    )

    remotion_cmd = [
        "npx",
        "remotion",
        "render",
        "Forensic3DDocument",
        str(temp_video),
        f"--props={temp_props_file}",
        *codec_args,
        f"--frames=0-{duration_frames - 1}",
        "--concurrency=2",
        "--quiet",
    ]

    print("🚀 Rendu 3D en cours (Travelling virtuel + simulation spéculaire)...")
    subprocess.run(remotion_cmd, cwd=str(REMOTION_DIR), check=True)

    if sound and DEFAULT_WHOOSH_AUDIO.exists():
        print(f"🔊 Ajout du sound design Whoosh cinématique ({DEFAULT_WHOOSH_AUDIO.name})...")
        audio_codec = ["-c:a", "pcm_s16le"] if is_mov else ["-c:a", "aac", "-b:a", "192k"]
        ffmpeg_cmd = [
            "ffmpeg",
            "-y",
            "-i",
            str(temp_video),
            "-i",
            str(DEFAULT_WHOOSH_AUDIO),
            "-filter_complex",
            f"[1:a]apad=whole_dur={duration_sec:.2f}[aout]",
            "-map",
            "0:v:0",
            "-map",
            "[aout]",
            "-c:v",
            "copy",
            *audio_codec,
            "-shortest",
            str(abs_out),
        ]
        subprocess.run(ffmpeg_cmd, capture_output=True, check=True)
        if temp_video.exists():
            temp_video.unlink()
    else:
        if temp_video.exists():
            temp_video.replace(abs_out)

    if temp_props_file.exists():
        temp_props_file.unlink()

    print(f"\n✅ [SUCCÈS] Document 3D généré avec succès : {abs_out}")
    print(f"   Taille : {os.path.getsize(abs_out) / (1024 * 1024):.2f} Mo\n")
    return abs_out


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Générateur 3D Forensic Document")
    parser.add_argument("--image", required=True, help="Chemin vers l'image ou document")
    parser.add_argument("--out", required=True, help="Chemin du fichier vidéo de sortie (.mp4 ou .mov)")
    parser.add_argument("--title", default="SDNY EVIDENCE EXHIBIT", help="Titre ou référence judiciaire")
    parser.add_argument("--duration", type=float, default=5.0, help="Durée en secondes (défaut: 5.0)")
    parser.add_argument("--ratio", type=float, default=16 / 9, help="Ratio d'aspect (ex: 1.777 pour 16:9, 0.707 pour A4 vertical)")
    parser.add_argument("--transparent", action="store_true", help="Export avec transparence alpha (ProRes 4444)")
    parser.add_argument("--no-sound", action="store_true", help="Désactiver le son")

    args = parser.parse_args()
    render_3d_document(
        image_path=args.image,
        out_path=args.out,
        title=args.title,
        duration_sec=args.duration,
        aspect_ratio=args.ratio,
        transparent=args.transparent,
        sound=not args.no_sound,
    )
