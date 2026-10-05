#!/usr/bin/env python3
"""
Génère une feuille de montage bilingue (EN timecodé + FR) à partir :
- du script anglais (production)
- de la traduction française (validation)
- des timestamps mot par mot extraits de la voix off

[NOUVEAUTÉ] - Génère également le 'visual_mapping.json' qui traduit les 
crochets [VISUEL: xxx] en timecodes absolus, labels structurels (ex: HOOK_01) 
pour le Segment 4 de l'Agent OTIO !
"""

import re
import json
import argparse
import difflib


def normalize(word: str) -> str:
    return re.sub(r"[^a-zàâäéèêëïîôöùûüç0-9']", "", word.lower())


def clean_section_for_label(section: str) -> str:
    """ Nettoie une section pour servir de préfixe de label. Ex: '1. Hook (0:00)' -> 'HOOK' """
    s = re.sub(r'^[0-9\.]+\s*', '', section)
    s = s.split('(')[0].strip().upper()
    return re.sub(r'[^A-Z]', '', s)[:10]


def parse_script(path: str):
    """
    Retourne une liste de cues : {"section": str, "text": str, "visual": str|None}
    en ignorant headers, notes.
    """
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    blocks = [b.strip() for b in re.split(r"\n\s*\n", content) if b.strip()]

    cues = []
    current_section = ""
    stop = False

    for block in blocks:
        if stop: break
        first_line = block.splitlines()[0].strip()

        if first_line.startswith("#"):
            section_name = re.sub(r"^#+\s*", "", first_line)
            section_name = re.sub(r"^[A-Z\sÀ-Ü'ÉÈ]+—.*$", section_name, section_name)
            current_section = section_name
            if "notes de production" in section_name.lower():
                stop = True
            continue

        if first_line.startswith(">"): continue
        if set(block) <= {"-"}: continue
        if block.startswith("*") and block.endswith("*") and not block.startswith("**"): continue

        if first_line.startswith("[VISUEL"):
            if cues:
                cues[-1]["visual"] = (cues[-1]["visual"] or "") + (" " if cues[-1]["visual"] else "") + block
            continue

        cues.append({"section": current_section, "text": block.replace("\n", " "), "visual": None})

    return cues


def align_cues_to_timestamps(en_cues, words):
    script_words = []
    script_word_cue_idx = []
    for idx, cue in enumerate(en_cues):
        for w in re.findall(r"[A-Za-z']+", cue["text"]):
            nw = normalize(w)
            if nw:
                script_words.append(nw)
                script_word_cue_idx.append(idx)

    transcribed_words = [normalize(w.get("word", "")) for w in words]

    matcher = difflib.SequenceMatcher(None, script_words, transcribed_words, autojunk=False)
    blocks = matcher.get_matching_blocks()

    cue_start = [None] * len(en_cues)
    cue_end = [None] * len(en_cues)

    for block in blocks:
        for offset in range(block.size):
            script_i = block.a + offset
            trans_i = block.b + offset
            cue_idx = script_word_cue_idx[script_i]
            t_start = words[trans_i].get("start", 0)
            t_end = words[trans_i].get("end", 0)
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
    parser.add_argument("--words", default="episodes/01-ruja-ignatova/transcription/voiceover_en_words.json")
    parser.add_argument("--en", default="scripts/Ruja Ignatova.md")
    parser.add_argument("--fr", default="scripts/Ruja Ignatova (FR - validation).md")
    parser.add_argument("--out", default="episodes/01-ruja-ignatova/montage/Feuille de montage ruja ignatova.md")
    parser.add_argument("--json", default="episodes/01-ruja-ignatova/montage/visual_mapping.json")
    args = parser.parse_args()

    with open(args.words, "r", encoding="utf-8") as f:
        words = json.load(f)

    en_cues = parse_script(args.en)
    fr_cues = parse_script(args.fr)

    n = min(len(en_cues), len(fr_cues))
    en_cues = en_cues[:n]
    fr_cues = fr_cues[:n]

    cue_start, cue_end = align_cues_to_timestamps(en_cues, words)

    lines = ["# Feuille de montage — EN timecodé + FR\n"]
    current_section = None
    section_counter = {}
    visual_mappings = []

    for i, (en_cue, fr_cue) in enumerate(zip(en_cues, fr_cues)):
        if en_cue["section"] != current_section:
            current_section = en_cue["section"]
            lines.append(f"\n## {current_section}\n")

        c_start = cue_start[i] if cue_start[i] is not None else 0.0
        c_end = cue_end[i] if cue_end[i] is not None else 0.0

        tc = f"[{format_timecode(c_start)} → {format_timecode(c_end)}]"
        lines.append(f"\n{tc}")
        lines.append(f'EN: "{en_cue["text"]}"')
        lines.append(f'FR: "{fr_cue["text"]}"')
        
        if en_cue["visual"]:
            lines.append(en_cue["visual"])
            # ----- Génération du JSON pour l'Agent OTIO -----
            raw_vis = en_cue["visual"].replace("[VISUEL :", "").replace("[VISUEL:", "").replace("]", "").strip()
            
            pfx = clean_section_for_label(en_cue["section"]) or "VIS"
            section_counter[pfx] = section_counter.get(pfx, 0) + 1
            label = f"{pfx}_{section_counter[pfx]:02d}"
            
            # Deviner la piste et le mode
            track = "V2_MAIN"
            mode = "INTERCUT"
            
            if "logo" in raw_vis.lower() or "titre" in raw_vis.lower() or "texte" in raw_vis.lower():
                track = "V3_OVERLAYS"
                mode = "HOLD"
            elif "carte" in raw_vis.lower() or "photo" in raw_vis.lower():
                mode = "HOLD"
                
            visual_mappings.append({
                "label": label,
                "description": raw_vis,
                "track": track,
                "mode": mode,
                "asset_path": f"assets/PLACEHOLDER_{label}.mp4",
                "start_time": round(c_start, 2),
                "end_time": round(c_end, 2)
            })

    with open(args.out, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print(f"Feuille de montage générée -> {args.out} ({n} cues)")
    
    with open(args.json, "w", encoding="utf-8") as f:
        json.dump(visual_mappings, f, indent=2, ensure_ascii=False)
    print(f"Mapping visuel JSON généré -> {args.json} ({len(visual_mappings)} entrées)")


if __name__ == "__main__":
    main()
