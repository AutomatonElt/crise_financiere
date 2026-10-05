"""
Génère la voix off anglaise via ElevenLabs (Eleven Multilingual v2) à partir de
plusieurs blocs texte (< 10 000 caractères chacun, limite du modèle), en utilisant
Request Stitching (previous_request_ids) pour garder une prosodie cohérente entre
les blocs, puis concatène le tout en un seul fichier MP3 final.

Usage:
    python generate_voiceover.py \\
        --blocks ruja_tts_block1.txt ruja_tts_block2.txt ruja_tts_block3.txt \\
        --out voiceover_en.mp3

Nécessite dans .env :
    ELEVENLABS_API_KEY=...
    ELEVENLABS_VOICE_ID=...
"""

import os
import argparse
import subprocess
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

API_KEY = os.environ.get("ELEVENLABS_API_KEY")
VOICE_ID = os.environ.get("ELEVENLABS_VOICE_ID")

if not API_KEY or not VOICE_ID:
    raise SystemExit(
        "ELEVENLABS_API_KEY et ELEVENLABS_VOICE_ID doivent être définis dans .env"
    )

client = ElevenLabs(api_key=API_KEY)

MAX_CHARS = 10_000  # limite dure d'Eleven Multilingual v2 par requête


def generate_chunk(text: str, previous_request_ids: list, chunk_path: str):
    if len(text) > MAX_CHARS:
        raise SystemExit(
            f"Bloc trop long ({len(text)} caractères > {MAX_CHARS}) : {chunk_path}"
        )

    with client.text_to_speech.with_raw_response.convert(
        text=text,
        voice_id=VOICE_ID,
        model_id="eleven_multilingual_v2",
        output_format="mp3_44100_192",
        previous_request_ids=previous_request_ids[-3:],  # max 3 acceptés par l'API
    ) as response:
        request_id = response._response.headers.get("request-id")
        audio_data = b"".join(chunk for chunk in response.data)

    with open(chunk_path, "wb") as f:
        f.write(audio_data)

    return request_id


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--blocks", nargs="+", required=True,
        help="Fichiers texte, dans l'ordre de lecture (un par bloc < 10 000 caractères)",
    )
    parser.add_argument("--out", default="voiceover_en.mp3", help="Fichier de sortie final")
    parser.add_argument(
        "--keep-chunks", action="store_true",
        help="Ne pas supprimer les fichiers MP3 intermédiaires après concaténation",
    )
    parser.add_argument(
        "--seed-request-ids", nargs="*", default=[],
        help="Request IDs d'un précédent run pour continuer le stitching (ex: --seed-request-ids abc123 def456)",
    )
    args = parser.parse_args()

    request_ids = list(args.seed_request_ids)
    chunk_files = []

    for i, block_path in enumerate(args.blocks):
        with open(block_path, "r", encoding="utf-8") as f:
            text = f.read().strip()

        chunk_path = f"_voiceover_chunk_{i:02d}.mp3"
        print(f"[{i + 1}/{len(args.blocks)}] Génération de {block_path} ({len(text)} caractères)...")

        request_id = generate_chunk(text, request_ids, chunk_path)
        if request_id:
            request_ids.append(request_id)

        chunk_files.append(chunk_path)
        print(f"    -> {chunk_path} (request-id: {request_id})")

    concat_list_path = "_voiceover_concat.txt"
    with open(concat_list_path, "w", encoding="utf-8") as f:
        for cf in chunk_files:
            f.write(f"file '{cf}'\n")

    print(f"\nConcaténation en {args.out}...")
    subprocess.run(
        [
            "ffmpeg", "-y", "-f", "concat", "-safe", "0",
            "-i", concat_list_path,
            "-acodec", "libmp3lame", "-b:a", "192k",
            args.out,
        ],
        check=True,
        capture_output=True,
    )

    os.remove(concat_list_path)
    if not args.keep_chunks:
        for cf in chunk_files:
            os.remove(cf)

    print(f"\nTerminé -> {args.out}")


if __name__ == "__main__":
    main()
