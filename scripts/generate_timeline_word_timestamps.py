#!/usr/bin/env python3
"""
Générateur des Repères Temporels de Mots sur la Timeline (Kdenlive / OTIO)
--------------------------------------------------------------------------
Prend en compte la coupure / pause de 3.80s insérée à 48.00s pour le Titre Principal.

Règles de décalage :
- Mots avant 48.00s (Hook) : Inchangés (timeline_start = original_start)
- Mots à partir de 48.00s  : Décalés de +3.80s (timeline_start = original_start + 3.80)

Sortie :
- episodes/01-ruja-ignatova/transcription/voiceover_en_words_timeline.json
"""

import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(HERE)

WORDS_SRC = os.path.join(ROOT_DIR, "episodes/01-ruja-ignatova/transcription/voiceover_en_words.json")
WORDS_TIMELINE_OUT = os.path.join(ROOT_DIR, "episodes/01-ruja-ignatova/transcription/voiceover_en_words_timeline.json")

SPLIT_SEC = 48.00
SHIFT_SEC = 3.80
FPS = 25.0


def main():
    print(f"📖 Lecture de la transcription originale : {WORDS_SRC}")
    with open(WORDS_SRC, "r", encoding="utf-8") as f:
        words = json.load(f)

    timeline_words = []
    before_count = 0
    after_count = 0

    for w in words:
        orig_start = float(w["start"])
        orig_end = float(w["end"])
        text = w["word"]

        if orig_start < SPLIT_SEC:
            tl_start = round(orig_start, 3)
            tl_end = round(orig_end, 3)
            before_count += 1
        else:
            tl_start = round(orig_start + SHIFT_SEC, 3)
            tl_end = round(orig_end + SHIFT_SEC, 3)
            after_count += 1

        tl_frame = int(round(tl_start * FPS))

        timeline_words.append({
            "word": text,
            "timeline_start": tl_start,
            "timeline_end": tl_end,
            "timeline_frame": tl_frame,
            "original_start": round(orig_start, 3),
            "original_end": round(orig_end, 3)
        })

    with open(WORDS_TIMELINE_OUT, "w", encoding="utf-8") as f:
        json.dump(timeline_words, f, indent=2, ensure_ascii=False)

    print(f"✅ {len(timeline_words)} mots synchronisés sur la timeline Kdenlive :")
    print(f"   - {before_count} mots dans le Hook (< 48.00s, non décalés)")
    print(f"   - {after_count} mots dans l'Histoire (>= 48.00s, décalés de +{SHIFT_SEC}s)")
    print(f"📁 Fichier généré : {WORDS_TIMELINE_OUT}")


if __name__ == "__main__":
    main()
