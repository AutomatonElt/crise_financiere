"""
Génère une feuille de montage bilingue (EN timecodé + FR) à partir :
- du script anglais (production)
- de la traduction française (validation)
- des timestamps mot par mot extraits de la voix off (transcribe_en_timestamps.py)

Usage:
    python build_cutting_script.py \\
        --words voiceover_en_words.json \\
        --en "scripts/Ruja Ignatova.md" \\
        --fr "scripts/Ruja Ignatova (FR - validation).md" \\
        --out "scripts/Ruja Ignatova - Feuille de montage.md"
"""

import re
import json
import argparse
import difflib


def normalize(word: str) -> str:
    return re.sub(r"[^a-zàâäéèêëïîôöùûüç0-9']", "", word.lower())


def parse_script(path: str):
    """
    Retourne une liste de cues : {"section": str, "text": str, "visual": str|None}
    en ignorant headers, notes de production, directions italiques et blockquotes.
    """
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    blocks = [b.strip() for b in re.split(r"\n\s*\n", content) if b.strip()]

    cues = []
    current_section = ""
    stop = False

    for block in blocks:
        if stop:
            break

        first_line = block.splitlines()[0].strip()

        # Header de section
        if first_line.startswith("#"):
            section_name = re.sub(r"^#+\s*", "", first_line)
            section_name = re.sub(r"^[A-Z\sÀ-Ü'ÉÈ]+—.*$", section_name, section_name)
            current_section = section_name
            if "notes de production" in section_name.lower():
                stop = True
            continue

        # Note de version tout en haut (> **Note...**)
        if first_line.startswith(">"):
            continue

        # Séparateur
        if set(block) <= {"-"}:
            continue

        # Direction de jeu en italique pure (ex: *Pic d'ouverture...*)
        if block.startswith("*") and block.endswith("*") and not block.startswith("**"):
            continue

        # Note visuelle -> rattachée au cue précédent
        if first_line.startswith("[VISUEL"):
            if cues:
                cues[-1]["visual"] = (cues[-1]["visual"] or "") + (" " if cues[-1]["visual"] else "") + block
            continue

        # Sinon: cue parlé
        cues.append({"section": current_section, "text": block.replace("\n", " "), "visual": None})

    return cues


def align_cues_to_timestamps(en_cues, words):
    """
    Aligne chaque cue anglais avec une plage de timestamps en utilisant
    un alignement de séquence sur les mots normalisés.
    """
    # Liste plate des mots du script EN (normalisés), taggés par index de cue
    script_words = []
    script_word_cue_idx = []
    for idx, cue in enumerate(en_cues):
        for w in re.findall(r"[A-Za-z']+", cue["text"]):
            nw = normalize(w)
            if nw:
                script_words.append(nw)
                script_word_cue_idx.append(idx)

    transcribed_words = [normalize(w["word"]) for w in words]

    matcher = difflib.SequenceMatcher(None, script_words, transcribed_words, autojunk=False)
    blocks = matcher.get_matching_blocks()

    # Pour chaque cue: min/max des timestamps des mots transcrits alignés
    cue_start = [None] * len(en_cues)
    cue_end = [None] * len(en_cues)

    for block in blocks:
        for offset in range(block.size):
            script_i = block.a + offset
            trans_i = block.b + offset
            cue_idx = script_word_cue_idx[script_i]
            t_start = words[trans_i]["start"]
            t_end = words[trans_i]["end"]
            if cue_start[cue_idx] is None or t_start < cue_start[cue_idx]:
                cue_start[cue_idx] = t_start
            if cue_end[cue_idx] is None or t_end > cue_end[cue_idx]:
                cue_end[cue_idx] = t_end

    return cue_start, cue_end


def format_timecode(seconds: float) -> str:
    if seconds is None:
        return "??:??:??"
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    return f"{h:02d}:{m:02d}:{s:02d}"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--words", default="voiceover_en_words.json")
    parser.add_argument("--en", default="scripts/Ruja Ignatova.md")
    parser.add_argument("--fr", default="scripts/Ruja Ignatova (FR - validation).md")
    parser.add_argument("--out", default="scripts/Ruja Ignatova - Feuille de montage.md")
    args = parser.parse_args()

    with open(args.words, "r", encoding="utf-8") as f:
        words = json.load(f)

    en_cues = parse_script(args.en)
    fr_cues = parse_script(args.fr)

    if len(en_cues) != len(fr_cues):
        print(
            f"⚠ Attention : {len(en_cues)} cues EN vs {len(fr_cues)} cues FR — "
            f"les deux scripts ne sont peut-être plus alignés paragraphe par paragraphe. "
            f"L'alignement se fera sur min(len)."
        )

    n = min(len(en_cues), len(fr_cues))
    en_cues = en_cues[:n]
    fr_cues = fr_cues[:n]

    cue_start, cue_end = align_cues_to_timestamps(en_cues, words)

    lines = ["# Feuille de montage — EN timecodé + FR\n"]
    current_section = None

    for i, (en_cue, fr_cue) in enumerate(zip(en_cues, fr_cues)):
        if en_cue["section"] != current_section:
            current_section = en_cue["section"]
            lines.append(f"\n## {current_section}\n")

        tc = f"[{format_timecode(cue_start[i])} → {format_timecode(cue_end[i])}]"
        lines.append(f"\n{tc}")
        lines.append(f'EN: "{en_cue["text"]}"')
        lines.append(f'FR: "{fr_cue["text"]}"')
        if en_cue["visual"]:
            lines.append(en_cue["visual"])

    with open(args.out, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")

    print(f"Feuille de montage générée -> {args.out} ({n} cues)")


if __name__ == "__main__":
    main()
