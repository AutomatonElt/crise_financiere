#!/usr/bin/env bash
set -euo pipefail

# Simple batch TTS generator for ElevenLabs v2
# Reads ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID from .env in the current folder

# Find a .env file by searching parent directories (so script can be run from the tts folder)
ENV_FILE=""
CURDIR="$PWD"
while [ "$CURDIR" != "/" ]; do
  if [ -f "$CURDIR/.env" ]; then
    ENV_FILE="$CURDIR/.env"
    break
  fi
  CURDIR=$(dirname "$CURDIR")
done
if [ -n "$ENV_FILE" ]; then
  # shellcheck disable=SC1091
  source "$ENV_FILE"
fi

if [ -z "${ELEVENLABS_API_KEY:-}" ] || [ -z "${ELEVENLABS_VOICE_ID:-}" ]; then
  echo "ERROR: ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID must be set in $ENV_FILE"
  exit 1
fi

VOICE_ID="$ELEVENLABS_VOICE_ID"
API_KEY="$ELEVENLABS_API_KEY"
API_URL="https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}"

# List of input text files (in order)
FILES=(
  "block_01_cold_open_and_countdown.txt"
  "block_02_whistleblower_and_breakdown.txt"
  "block_03_numbers_and_recovery.txt"
  "block_04_human_wreckage_and_outro.txt"
)

# Output format (mp3 or wav)
OUT_FORMAT="mp3"

for f in "${FILES[@]}"; do
  if [ ! -f "$f" ]; then
    echo "Missing file $f, skipping"
    continue
  fi
  base="${f%.*}"
  outfile="${base}.${OUT_FORMAT}"
  echo "Generating $outfile from $f ..."

  payload=$(python3 - <<PY
import json,sys
p=open(sys.argv[1],'r',encoding='utf-8').read()
# Use consistent model and voice settings for coherence
obj={
  'text': p,
  'model': 'eleven_multilingual_v2',
  'voice_settings': {
    'stability': 0.90,
    'similarity_boost': 0.90
  }
}
print(json.dumps(obj))
PY
  "$f")

  # POST the request
  curl -s -X POST "$API_URL" \
    -H "xi-api-key: $API_KEY" \
    -H "Content-Type: application/json" \
    --data-raw "$payload" \
    --output "$outfile"

  if [ $? -eq 0 ]; then
    echo "Saved $outfile"
  else
    echo "Failed to create $outfile"
  fi

  # Short pause between requests to be polite with rate limits
  sleep 1

done

echo "All done. Generated files:"
ls -1 *.${OUT_FORMAT} || true
