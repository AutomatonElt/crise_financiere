#!/usr/bin/env python3
"""
Générateur Universel de Titres & Repères Cinéma (Financial Forensics)
---------------------------------------------------------------------
100% Réutilisable pour n'importe quel épisode, n'importe quel texte et n'importe quelle durée.

Fonctionnalités :
- Vidéo ProRes 4444 avec canal alpha (transparence totale à superposer sur n'importe quel plan).
- Typographie lourde sans cadre, identité Cyan (#38BDF8) et Blanc Glacier (#E0F2FE).
- Supporte 1 ou 2 lignes de texte.
- Calcul automatique des durées : vitesse de frappe, pause entre lignes, et temps de maintien (Hold).
- Synchronisation audio lettre par lettre à partir du fichier clavier fourni par l'utilisateur
  (_shared/sfx/typing/soumages-keyboard-typing-579122.mp3).
- Coupure nette du son dès que la dernière lettre est tapée.

Exemples d'utilisation :
-----------------------
# Titre standard date + lieu (durée calculée automatiquement) :
python scripts/generate_title_card.py \
    --line1 "OCTOBRE 2017" \
    --line2 "SOFIA — ATHÈNES" \
    --out "episodes/01-ruja-ignatova/assets/custom-graphics/title_01.mov"

# Titre sur 1 seule ligne (ex: montant ou révélation) :
python scripts/generate_title_card.py \
    --line1 "4 MILLIARDS DE DOLLARS" \
    --out "episodes/01-ruja-ignatova/assets/custom-graphics/title_montant.mov"

# Personnalisation des couleurs et du temps de maintien (hold) :
python scripts/generate_title_card.py \
    --line1 "NOVEMBRE 2022" \
    --line2 "BAHAMAS // SIÈGE DE FTX" \
    --hold 4.0 \
    --color1 "#F59E0B" \
    --out "episodes/02-ftx/assets/custom-graphics/title_ftx.mov"
"""

import argparse
import json
import os
import subprocess
import sys
from typing import Optional
import numpy as np
import scipy.signal as signal
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(HERE)
REMOTION_DIR = os.path.join(ROOT_DIR, "financial-forensics")
DEFAULT_AUDIO_SOURCE = os.path.join(ROOT_DIR, "_shared", "sfx", "typing", "soumages-keyboard-typing-579122.mp3")


def extract_clicks_from_audio(audio_path: str, sr: int = 48000):
    """Extrait les claquements réels de touches depuis le fichier audio utilisateur."""
    if not os.path.exists(audio_path):
        print(f"⚠️ Fichier source introuvable: {audio_path}")
        return []

    data, orig_sr = sf.read(audio_path)
    if data.ndim == 1:
        data = np.stack([data, data], axis=-1)

    if orig_sr != sr:
        num_samples = int(len(data) * sr / orig_sr)
        data = signal.resample(data, num_samples)

    mono = np.mean(data, axis=1)
    peaks, _ = signal.find_peaks(np.abs(mono), height=0.10, distance=int(0.05 * sr))

    clicks = []
    half_win = int(0.005 * sr)
    post_win = int(0.055 * sr)
    fade = int(0.010 * sr)

    for p in peaks:
        start = max(0, p - half_win)
        end = min(len(data), p + post_win)
        if end - start == half_win + post_win:
            chunk = data[start:end].copy()
            chunk[-fade:] *= np.linspace(1, 0, fade)[:, None]
            clicks.append(chunk)

    return clicks


def generate_typing_audio(
    duration_sec: float,
    line1: str,
    line2: str,
    start_sec_line1: float,
    start_sec_line2: float,
    chars_per_sec: int,
    source_audio_path: str = DEFAULT_AUDIO_SOURCE,
    sr: int = 48000,
    fps: int = 25,
) -> np.ndarray:
    total_samples = int(duration_sec * sr)
    audio = np.zeros((total_samples, 2), dtype=np.float32)

    clicks = extract_clicks_from_audio(source_audio_path, sr)
    if not clicks:
        print("⚠️ Aucun clic extrait, audio muet.")
        return audio

    frames_per_char = max(1, round(fps / chars_per_sec))
    time_per_char = frames_per_char / fps

    def add_line_clicks(line_text: str, start_time: float):
        for i, char in enumerate(line_text):
            char_time = start_time + i * time_per_char
            idx = int(char_time * sr)
            if idx < total_samples:
                c = clicks[np.random.randint(0, len(clicks))].copy()
                gain = np.random.uniform(0.88, 1.05)
                c *= gain
                end_idx = min(idx + len(c), total_samples)
                audio[idx:end_idx] += c[: end_idx - idx]

    if line1:
        add_line_clicks(line1, start_sec_line1)
    if line2:
        add_line_clicks(line2, start_sec_line2)

    peak = np.max(np.abs(audio))
    if peak > 0:
        audio = (audio / peak) * 0.85

    return audio


def render_title_card(
    line1: str,
    line2: str = "",
    out_path: str = "episodes/01-ruja-ignatova/assets/custom-graphics/title_card_01_sofia_athens.mov",
    duration_sec: Optional[float] = None,
    hold_sec: float = 3.0,
    start_sec_line1: float = 0.32,
    start_sec_line2: Optional[float] = None,
    chars_per_sec: int = 14,
    color_line1: str = "#38BDF8",  # Cyan / Bleu clair lumineux
    color_line2: str = "#E0F2FE",  # Blanc glacier
    position: str = "bottom-left", # Position à l'écran
    source_audio: str = DEFAULT_AUDIO_SOURCE,
    fps: int = 25,
):
    frames_per_char = max(1, round(fps / chars_per_sec))
    start_frame_1 = int(round(start_sec_line1 * fps))
    end_frame_1 = start_frame_1 + len(line1) * frames_per_char

    # Calcul automatique de la ligne 2 si non spécifié (+0.4s de pause)
    if line2:
        if start_sec_line2 is None:
            start_frame_2 = end_frame_1 + int(round(0.40 * fps))
            start_sec_line2 = start_frame_2 / fps
        else:
            start_frame_2 = int(round(start_sec_line2 * fps))
        end_frame_2 = start_frame_2 + len(line2) * frames_per_char
    else:
        start_frame_2 = 0
        start_sec_line2 = 0.0
        end_frame_2 = end_frame_1

    end_typing_frame = max(end_frame_1, end_frame_2)
    end_typing_sec = end_typing_frame / fps

    # Calcul automatique de la durée totale si non fournie (fin frappe + hold + 0.5s fondu)
    if duration_sec is None:
        duration_sec = end_typing_sec + hold_sec + 0.50
        duration_frames = int(round(duration_sec * fps))
    else:
        duration_frames = int(round(duration_sec * fps))
        hold_sec = max(0.0, (duration_frames - 12) / fps - end_typing_sec)

    props = {
        "line1": line1,
        "line2": line2,
        "startFrameLine1": start_frame_1,
        "startFrameLine2": start_frame_2,
        "charsPerSecond": chars_per_sec,
        "colorLine1": color_line1,
        "colorLine2": color_line2,
        "position": position,
        "durationInFrames": duration_frames,
    }

    props_json = json.dumps(props)
    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    abs_out_path = os.path.abspath(out_path)

    base_without_ext, _ = os.path.splitext(abs_out_path)
    temp_mov_video = base_without_ext + "_temp_video.mov"
    wav_out_path = base_without_ext + "_typing.wav"

    print("\n" + "=" * 65)
    print("🎬 GÉNÉRATEUR UNIVERSEL DE TITRE CINÉMA & CLAVIER SYNCHRONISÉ")
    print("=" * 65)
    print(f"🔹 Ligne 1 : '{line1}' [Couleur: {color_line1}]")
    if line2:
        print(f"🔹 Ligne 2 : '{line2}' [Couleur: {color_line2}]")
    print(f"📍 Position: {position}")
    print(f"🎵 Audio   : {os.path.basename(source_audio)}")
    print(f"⏱️  Frappe  : {start_sec_line1:.2f}s -> {end_typing_sec:.2f}s (arrête net à {end_typing_sec:.2f}s)")
    print(f"⏳ Hold    : {hold_sec:.2f}s de maintien fixe à l'écran")
    print(f"🎞️  Durée   : {duration_sec:.2f}s ({duration_frames} frames @ {fps}fps)")
    print(f"📁 Sortie  : {abs_out_path}")
    print("=" * 65)

    # 1. Rendu vidéo Remotion ProRes 4444 avec Alpha
    cmd_remotion = [
        "npx", "remotion", "render",
        "TitleCard",
        temp_mov_video,
        f"--props={props_json}",
        f"--frames=0-{duration_frames - 1}",
        "--codec=prores",
        "--prores-profile=4444",
        "--pixel-format=yuva444p10le",
        "--gl=angle",
        "--concurrency=4",
        "--quiet",
    ]

    print("\n1️⃣  Rendu vidéo transparente ProRes 4444...")
    res_remotion = subprocess.run(cmd_remotion, cwd=REMOTION_DIR, capture_output=True, text=True)
    if res_remotion.returncode != 0:
        print("❌ Erreur Remotion :", res_remotion.stderr)
        sys.exit(1)

    # 2. Génération audio synchronisée
    print("2️⃣  Génération des frappes de touches calées...")
    audio_data = generate_typing_audio(
        duration_sec=duration_sec,
        line1=line1,
        line2=line2,
        start_sec_line1=start_sec_line1,
        start_sec_line2=start_sec_line2,
        chars_per_sec=chars_per_sec,
        source_audio_path=source_audio,
        sr=48000,
        fps=fps,
    )
    sf.write(wav_out_path, audio_data, 48000)
    print(f"   Audio WAV généré : {wav_out_path}")

    # 3. Muxing FFmpeg avec mapping explicite
    print("3️⃣  Muxing de la vidéo et du son synchronisé...")
    cmd_mux = [
        "ffmpeg", "-y",
        "-i", temp_mov_video,
        "-i", wav_out_path,
        "-map", "0:v:0",
        "-map", "1:a:0",
        "-c:v", "copy",
        "-c:a", "pcm_s16le",
        abs_out_path,
    ]
    res_mux = subprocess.run(cmd_mux, capture_output=True, text=True)
    if res_mux.returncode != 0:
        print("❌ Erreur Mux FFmpeg :", res_mux.stderr)
        sys.exit(1)

    if os.path.exists(temp_mov_video):
        os.remove(temp_mov_video)

    print(f"\n✅ TERMINÉ ! Fichier prêt pour le montage :")
    print(f"   🎥 {abs_out_path}")


def main():
    parser = argparse.ArgumentParser(
        description="Générateur Universel de Titre Cinéma (ProRes 4444 Alpha + Clavier calé)"
    )
    parser.add_argument("--line1", required=True, help="Texte de la ligne 1 (ex: OCTOBRE 2017)")
    parser.add_argument("--line2", default="", help="Texte de la ligne 2 (optionnel, ex: SOFIA — ATHÈNES)")
    parser.add_argument("--out", required=True, help="Chemin du fichier de sortie .mov")
    parser.add_argument("--duration", type=float, default=None, help="Durée totale en s (calculée automatiquement si omise)")
    parser.add_argument("--hold", type=float, default=3.0, help="Secondes de maintien fixe après la frappe (défaut: 3.0s)")
    parser.add_argument("--start1", type=float, default=0.32, help="Début frappe ligne 1 en s (défaut: 0.32s)")
    parser.add_argument("--start2", type=float, default=None, help="Début ligne 2 en s (automatique si omis)")
    parser.add_argument("--speed", type=int, default=14, help="Caractères par seconde (défaut: 14)")
    parser.add_argument("--color1", default="#38BDF8", help="Couleur ligne 1 (défaut: #38BDF8 cyan)")
    parser.add_argument("--color2", default="#E0F2FE", help="Couleur ligne 2 (défaut: #E0F2FE blanc glacier)")
    parser.add_argument(
        "--position", "--pos",
        dest="position",
        default="bottom-left",
        choices=["bottom-left", "bottom-right", "top-left", "top-right", "center"],
        help="Position à l'écran : bottom-left (défaut), bottom-right, top-left, top-right, center",
    )
    parser.add_argument("--audio", default=DEFAULT_AUDIO_SOURCE, help="Chemin du fichier audio clavier source")
    parser.add_argument("--fps", type=int, default=25, help="FPS (défaut: 25)")
    args = parser.parse_args()

    render_title_card(
        line1=args.line1,
        line2=args.line2,
        out_path=args.out,
        duration_sec=args.duration,
        hold_sec=args.hold,
        start_sec_line1=args.start1,
        start_sec_line2=args.start2,
        chars_per_sec=args.speed,
        color_line1=args.color1,
        color_line2=args.color2,
        position=args.position,
        source_audio=args.audio,
        fps=args.fps,
    )


if __name__ == "__main__":
    main()
