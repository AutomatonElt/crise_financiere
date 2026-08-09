"""
Transcrit un fichier audio avec Groq Whisper (français).

Usage:
    python transcribe.py --audio episodes/06-frank-bourassa/audio.mp3 --out episodes/06-frank-bourassa/assets/transcript-source.txt

Si --out n'est pas fourni, le transcript est affiché uniquement.
"""

import os
import argparse
import subprocess
from dotenv import load_dotenv
from groq import Groq

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))


def main():
    parser = argparse.ArgumentParser(description="Transcrit un audio avec Groq Whisper")
    parser.add_argument("--audio", required=True, help="Chemin du fichier audio à transcrire")
    parser.add_argument("--out", default=None, help="Fichier de sortie pour le transcript")
    parser.add_argument("--language", default="fr", help="Langue de l'audio (défaut: fr)")
    parser.add_argument("--chunk-seconds", type=int, default=300, help="Taille des segments (secondes)")
    args = parser.parse_args()

    if not os.path.exists(args.audio):
        raise SystemExit(f"Fichier audio introuvable : {args.audio}")

    # Get audio duration
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", args.audio],
        capture_output=True, text=True
    )
    total_duration = float(result.stdout.strip())
    print(f"Duration: {total_duration:.1f}s")

    num_chunks = int(total_duration // args.chunk_seconds) + 1
    print(f"Splitting into {num_chunks} chunks...")

    full_text = []
    for i in range(num_chunks):
        start = i * args.chunk_seconds
        chunk_file = f"chunk_{i:03d}.mp3"
        subprocess.run([
            "ffmpeg", "-y", "-i", args.audio,
            "-ss", str(start), "-t", str(args.chunk_seconds),
            "-acodec", "libmp3lame", "-b:a", "64k",
            chunk_file
        ], capture_output=True)

        if not os.path.exists(chunk_file) or os.path.getsize(chunk_file) < 100:
            if os.path.exists(chunk_file):
                os.remove(chunk_file)
            continue

        size = os.path.getsize(chunk_file)
        print(f"Transcribing chunk {i+1}/{num_chunks} ({size//1024}KB)...")
        with open(chunk_file, "rb") as f:
            result = client.audio.transcriptions.create(
                model="whisper-large-v3",
                file=f,
                language=args.language,
            )
        full_text.append(result.text)
        print(result.text[:200] + "...")
        os.remove(chunk_file)

    transcript = "\n".join(full_text)
    print("\n=== FULL TRANSCRIPT ===\n")
    print(transcript)

    if args.out:
        os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
        with open(args.out, "w", encoding="utf-8") as f:
            f.write(transcript)
        print(f"\nSaved to {args.out}")


if __name__ == "__main__":
    main()
