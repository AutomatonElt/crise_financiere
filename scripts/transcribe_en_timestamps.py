"""
Transcrit une voix off anglaise (ex: export ElevenLabs) avec Groq Whisper
et extrait les timestamps mot par mot.

Usage:
    python transcribe_en_timestamps.py --audio voiceover_en.mp3 --out-prefix voiceover_en

Sortie:
    <out-prefix>_words.json   -> liste de {"word": str, "start": float, "end": float}
"""

import os
import json
import argparse
import subprocess
from dotenv import load_dotenv
from groq import Groq

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))


def get_duration(path: str) -> float:
    result = subprocess.run(
        [
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            path,
        ],
        capture_output=True, text=True,
    )
    return float(result.stdout.strip())


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--audio", default="voiceover_en.mp3", help="Fichier audio de la voix off (ElevenLabs export)")
    parser.add_argument("--out-prefix", default="voiceover_en", help="Préfixe des fichiers de sortie")
    parser.add_argument("--chunk-seconds", type=int, default=300, help="Taille des segments envoyés à Whisper (secondes)")
    args = parser.parse_args()

    if not os.path.exists(args.audio):
        raise SystemExit(
            f"Fichier introuvable : {args.audio}\n"
            f"Place ton export ElevenLabs dans ce dossier, ou passe --audio <chemin>."
        )

    total_duration = get_duration(args.audio)
    print(f"Durée : {total_duration:.1f}s")

    num_chunks = int(total_duration // args.chunk_seconds) + 1
    print(f"Découpage en {num_chunks} segment(s)...")

    all_words = []

    for i in range(num_chunks):
        start = i * args.chunk_seconds
        chunk_file = f"_chunk_en_{i:03d}.mp3"

        subprocess.run(
            [
                "ffmpeg", "-y", "-i", args.audio,
                "-ss", str(start), "-t", str(args.chunk_seconds),
                "-acodec", "libmp3lame", "-b:a", "128k",
                chunk_file,
            ],
            capture_output=True,
        )

        if not os.path.exists(chunk_file) or os.path.getsize(chunk_file) < 100:
            if os.path.exists(chunk_file):
                os.remove(chunk_file)
            continue

        print(f"Transcription segment {i + 1}/{num_chunks}...")
        with open(chunk_file, "rb") as f:
            result = client.audio.transcriptions.create(
                model="whisper-large-v3",
                file=f,
                language="en",
                response_format="verbose_json",
                timestamp_granularities=["word"],
            )

        words = getattr(result, "words", None) or []
        for w in words:
            # w peut être un dict ou un objet selon la version du SDK
            word_text = w["word"] if isinstance(w, dict) else w.word
            w_start = w["start"] if isinstance(w, dict) else w.start
            w_end = w["end"] if isinstance(w, dict) else w.end
            all_words.append({
                "word": word_text,
                "start": round(w_start + start, 3),
                "end": round(w_end + start, 3),
            })

        os.remove(chunk_file)

    out_path = f"{args.out_prefix}_words.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(all_words, f, ensure_ascii=False, indent=2)

    print(f"\n{len(all_words)} mots extraits -> {out_path}")


if __name__ == "__main__":
    main()
