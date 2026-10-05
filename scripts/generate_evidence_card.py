#!/usr/bin/env python3
"""
Générateur Universel de Fiches Photos & Archives Réelles (EvidenceCard)
-----------------------------------------------------------------------
Affiche une photo d'archive, de lieu ou de personnage :
- 100% TRANSPARENT autour de la zone de photo (Canal Alpha ProRes 4444).
- Position par défaut : À DROITE de l'écran (droite, gauche ou centre).
- Animation vivante : subtile flottaison organique et lent drift sans fixité.
- Deux styles au choix :
  * 'clean' (par défaut) : photo pure flottante avec ombre portée cinéma naturelle (aucun encombrement).
  * 'print' : tirage photo / passe-partout élégant papier d'archive (bordure ivoire discrète).
- Son de caméra au déclenchement : optionnel (--sound ou --no-sound), personnalisable.
"""

import argparse
import base64
import json
import mimetypes
import os
import subprocess
import sys
import numpy as np
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(HERE)
REMOTION_DIR = os.path.join(ROOT_DIR, "financial-forensics")
DEFAULT_SHUTTER_AUDIO = os.path.join(ROOT_DIR, "_shared", "sfx", "camera-shutter", "79190__nathan_lomeli__iphone-camera-click.wav")


def encode_image_to_data_uri(image_path: str) -> str:
    """Convertit l'image locale en Data URI base64 pour Remotion."""
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image introuvable : {image_path}")

    mime_type, _ = mimetypes.guess_type(image_path)
    if not mime_type:
        mime_type = "image/jpeg"

    with open(image_path, "rb") as f:
        encoded = base64.b64encode(f.read()).decode("utf-8")

    return f"data:{mime_type};base64,{encoded}"


def generate_shutter_audio(
    duration_sec: float,
    shutter_audio_path: str = DEFAULT_SHUTTER_AUDIO,
    sr: int = 48000,
) -> np.ndarray:
    total_samples = int(duration_sec * sr)
    audio = np.zeros(total_samples, dtype=np.float32)

    if os.path.exists(shutter_audio_path):
        shutter_data, orig_sr = sf.read(shutter_audio_path)
        if shutter_data.ndim > 1:
            shutter_data = np.mean(shutter_data, axis=1)

        # Détection du début franc du clic (seuil 0.08)
        threshold = 0.08
        significant_indices = np.where(np.abs(shutter_data) > threshold)[0]
        if len(significant_indices) > 0:
            start_offset = max(0, significant_indices[0] - int(0.002 * orig_sr))
            # Le double clic dure ~0.35s. On coupe net à 0.38s max avec un fade out de 15ms
            # pour un arrêt immédiat et net sans aucune traîne résiduelle.
            max_click_samples = int(0.38 * orig_sr)
            click_slice = shutter_data[start_offset: start_offset + max_click_samples].copy()
            fade_len = int(0.015 * orig_sr)
            if len(click_slice) > fade_len:
                click_slice[-fade_len:] *= np.linspace(1.0, 0.0, fade_len)
            shutter_data = click_slice

        if orig_sr != sr:
            import scipy.signal as signal
            num_samples = int(len(shutter_data) * sr / orig_sr)
            shutter_data = signal.resample(shutter_data, num_samples)

        start_idx = int(0.01 * sr)
        end_idx = min(total_samples, start_idx + len(shutter_data))
        audio[start_idx:end_idx] = shutter_data[: end_idx - start_idx]

        peak = np.max(np.abs(audio))
        if peak > 0:
            audio = (audio / peak) * 0.90

    return audio


def render_evidence_card(
    image_path: str,
    out_path: str,
    style: str = "clean",
    position: str = "right",
    duration_sec: float = 5.0,
    card_width: int = 520,
    offset_y: int = 85,
    enable_sound: bool = True,
    audio_path: str = DEFAULT_SHUTTER_AUDIO,
    fps: int = 25,
):
    abs_image = os.path.abspath(image_path)
    abs_out = os.path.abspath(out_path)
    duration_frames = int(round(duration_sec * fps))

    style_desc = (
        "Photo pure sans cadre"
        if style == "clean"
        else "Bordure tirage d'archive"
        if style == "print"
        else "Bords doux & fondus flottants"
    )

    print("\n" + "=" * 65)
    print("📸 GÉNÉRATEUR FICHE PHOTO / ARCHIVE")
    print("=" * 65)
    print(f"🖼️  Image      : {os.path.basename(abs_image)}")
    print(f"🎨 Style      : {style.upper()} ({style_desc})")
    print(f"📍 Position   : {position.upper()} (Offset Y: +{offset_y}px vers le bas)")
    print(f"🔊 Son caméra : {'Activé (' + os.path.basename(audio_path) + ')' if enable_sound else 'Désactivé (Silencieux)'}")
    print(f"🎞️  Durée      : {duration_sec:.2f}s ({duration_frames} frames @ {fps}fps)")
    print(f"📁 Sortie     : {abs_out}")
    print("=" * 65)

    image_data_uri = encode_image_to_data_uri(abs_image)

    props = {
        "imageSrc": image_data_uri,
        "position": position,
        "frameStyle": style,
        "cardWidth": card_width,
        "offsetY": offset_y,
        "durationInFrames": duration_frames,
    }

    props_json = json.dumps(props)
    os.makedirs(os.path.dirname(abs_out), exist_ok=True)

    base_without_ext, _ = os.path.splitext(abs_out)
    temp_mov_video = base_without_ext + "_temp_video.mov"
    temp_props_file = base_without_ext + "_temp_props.json"
    wav_out_path = base_without_ext + "_shutter.wav"

    with open(temp_props_file, "w", encoding="utf-8") as f:
        f.write(props_json)

    # 1. Rendu vidéo Remotion ProRes 4444 avec Alpha (via fichier props pour éviter ARG_MAX)
    cmd_remotion = [
        "npx", "remotion", "render",
        "EvidenceCard",
        temp_mov_video,
        f"--props={temp_props_file}",
        f"--frames=0-{duration_frames - 1}",
        "--codec=prores",
        "--prores-profile=4444",
        "--pixel-format=yuva444p10le",
    ]

    print("\n1️⃣  Rendu vidéo transparente ProRes 4444 (Alpha total)...")
    res_remotion = subprocess.run(cmd_remotion, cwd=REMOTION_DIR, capture_output=True, text=True)
    
    if os.path.exists(temp_props_file):
        os.remove(temp_props_file)

    if res_remotion.returncode != 0:
        print("❌ Erreur Remotion :", res_remotion.stderr)
        sys.exit(1)

    # 2. Audio si activé
    if enable_sound:
        print("2️⃣  Génération de la piste audio (déclencheur caméra)...")
        audio_data = generate_shutter_audio(
            duration_sec=duration_sec,
            shutter_audio_path=audio_path,
            sr=48000,
        )
        sf.write(wav_out_path, audio_data, 48000)

        # 3. Muxing vidéo + audio
        print("3️⃣  Muxing vidéo transparente + audio caméra...")
        cmd_mux = [
            "ffmpeg", "-y",
            "-i", temp_mov_video,
            "-i", wav_out_path,
            "-map", "0:v:0",
            "-map", "1:a:0",
            "-c:v", "copy",
            "-c:a", "pcm_s16le",
            abs_out,
        ]
        res_mux = subprocess.run(cmd_mux, capture_output=True, text=True)
        if res_mux.returncode != 0:
            print("❌ Erreur Mux FFmpeg :", res_mux.stderr)
            sys.exit(1)

        if os.path.exists(temp_mov_video):
            os.remove(temp_mov_video)
    else:
        # Pas de son demandé : renommer directement la vidéo
        if os.path.exists(abs_out):
            os.remove(abs_out)
        os.rename(temp_mov_video, abs_out)
        print("2️⃣  Audio désactivé (vidéo muette générée).")

    print(f"\n✅ TERMINÉ ! Fichier généré avec succès :")
    print(f"   🎥 {abs_out}")


def main():
    parser = argparse.ArgumentParser(
        description="Générateur Universel de Fiche Photo / Archive Réelle (ProRes 4444 Alpha)"
    )
    parser.add_argument("--image", required=True, help="Chemin de la photo source (jpg/png/webp)")
    parser.add_argument("--out", required=True, help="Chemin de sortie du fichier vidéo .mov")
    parser.add_argument(
        "--style", "--border",
        dest="style",
        default="clean",
        choices=["clean", "print", "soft"],
        help="Style visuel : 'clean' (photo pure nette), 'print' (bordure tirage papier ivoire), 'soft' (bords doux et fondus)",
    )
    parser.add_argument(
        "--pos", "--position",
        dest="position",
        default="right",
        choices=["right", "left", "center", "bottom-right", "bottom-left"],
        help="Position à l'écran : right (défaut), left, center, bottom-right, bottom-left",
    )
    parser.add_argument("--offset-y", type=int, default=85, help="Décalage vertical en pixels vers le bas (défaut: 85)")
    parser.add_argument("--duration", type=float, default=5.0, help="Durée en secondes (défaut: 5.0s)")
    parser.add_argument("--width", type=int, default=520, help="Largeur du cadre en pixels (défaut: 520)")
    parser.add_argument(
        "--sound",
        dest="sound",
        action="store_true",
        default=True,
        help="Activer le son de caméra au début (activé par défaut)",
    )
    parser.add_argument(
        "--no-sound",
        dest="sound",
        action="store_false",
        help="Désactiver le son de caméra (génère une vidéo muette)",
    )
    parser.add_argument("--audio", default=DEFAULT_SHUTTER_AUDIO, help="Chemin d'un son d'obturateur personnalisé")
    parser.add_argument("--fps", type=int, default=25, help="Cadence FPS (défaut: 25)")
    args = parser.parse_args()

    render_evidence_card(
        image_path=args.image,
        out_path=args.out,
        style=args.style,
        position=args.position,
        duration_sec=args.duration,
        card_width=args.width,
        offset_y=args.offset_y,
        enable_sound=args.sound,
        audio_path=args.audio,
        fps=args.fps,
    )


if __name__ == "__main__":
    main()
