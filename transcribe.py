import os
import subprocess
from dotenv import load_dotenv
from groq import Groq

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".venv-youtube", ".env"))

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Get audio duration
result = subprocess.run(
    ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", "audio2.mp3"],
    capture_output=True, text=True
)
total_duration = float(result.stdout.strip())
print(f"Duration: {total_duration:.1f}s")

# Split into ~5min chunks to stay under 25MB
chunk_seconds = 300
num_chunks = int(total_duration // chunk_seconds) + 1
print(f"Splitting into {num_chunks} chunks...")

full_text = []
for i in range(num_chunks):
    start = i * chunk_seconds
    chunk_file = f"chunk_{i:03d}.mp3"
    subprocess.run([
        "ffmpeg", "-y", "-i", "audio2.mp3",
        "-ss", str(start), "-t", str(chunk_seconds),
        "-acodec", "libmp3lame", "-b:a", "64k",
        chunk_file
    ], capture_output=True)

    size = os.path.getsize(chunk_file)
    if size < 100:
        os.remove(chunk_file)
        continue

    print(f"Transcribing chunk {i+1}/{num_chunks} ({size//1024}KB)...")
    with open(chunk_file, "rb") as f:
        result = client.audio.transcriptions.create(
            model="whisper-large-v3",
            file=f,
            language="fr",
        )
    full_text.append(result.text)
    print(result.text[:200] + "...")
    os.remove(chunk_file)

transcript = "\n".join(full_text)
print("\n=== FULL TRANSCRIPT ===\n")
print(transcript)

with open("transcript2.txt", "w", encoding="utf-8") as f:
    f.write(transcript)
print(f"\nSaved to transcript2.txt")
