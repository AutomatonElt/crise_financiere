#!/usr/bin/env python3
"""
implement_v4_titles_otio.py
---------------------------
Résout définitivement le problème de masquage par V2_MAIN en créant la piste
V4_TITLES au sommet de la pile vidéo Kdenlive :

Structure finale des pistes vidéo (du bas vers le haut dans Kdenlive) :
- Piste 0 (Video 1, bas)      : V1_BACKGROUND (Fond / Noir propre)
- Piste 1 (Video 2, milieu)   : V2_MAIN (Rushs et B-roll principaux)
- Piste 2 (Video 3, dessus)   : V3_OVERLAYS (Chapitres et fiches personnages)
- Piste 3 (Video 4, sommet)   : V4_TITLES (Chiffres $5M, repère Sofia, animations)
Puis les 4 pistes Audio (A1_MASTER_VOICE, A2_MUSIC_BED, A3_SFX_WHOOSH, A4_SECONDARY_AUDIO).
"""

import os
import shutil
import json
import opentimelineio as otio

BASE_DIR = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp"
EPISODE_DIR = os.path.join(BASE_DIR, "episodes/01-ruja-ignatova")
TEXTE_CARD_DIR = os.path.join(EPISODE_DIR, "assets/texte_card")
OTIO_PATH = os.path.join(EPISODE_DIR, "rudja2.otio")
BAK_PATH = os.path.join(EPISODE_DIR, "rudja2.otio.bak")

FPS = 25.0

def rt(frames):
    return otio.opentime.RationalTime(round(frames), FPS)

def sec_to_frames(sec):
    return round(sec * FPS)

def create_clip(name, rel_path, dur_frames, is_audio=False):
    full_path = os.path.join(BASE_DIR, rel_path)
    if not os.path.exists(full_path):
        raise FileNotFoundError(f"Fichier média manquant : {full_path}")
    
    media_ref = otio.schema.ExternalReference(
        target_url=full_path,
        available_range=otio.opentime.TimeRange(rt(0), rt(dur_frames))
    )
    clip = otio.schema.Clip(
        name=name,
        media_reference=media_ref,
        source_range=otio.opentime.TimeRange(rt(0), rt(dur_frames))
    )
    return clip

def main():
    print("=== Implémentation de la piste V4_TITLES au sommet de la pile ===")
    if not os.path.exists(OTIO_PATH):
        raise FileNotFoundError(f"Fichier OTIO introuvable : {OTIO_PATH}")

    shutil.copy2(OTIO_PATH, BAK_PATH)
    print(f"✓ Sauvegarde créée : {BAK_PATH}")

    tl = otio.adapters.read_from_file(OTIO_PATH)
    total_timeline_frames = sec_to_frames(1607.0)

    # Récupération des pistes existantes
    # Dans l'état actuel :
    # tl.tracks[0] = V1_BACKGROUND
    # tl.tracks[1] = V2_MAIN
    # tl.tracks[2] = V3_OVERLAYS
    # tl.tracks[3] = A1_MASTER_VOICE
    # tl.tracks[4] = A2_MUSIC_BED
    # tl.tracks[5] = A3_SFX_WHOOSH
    # tl.tracks[6] = A4_SECONDARY_AUDIO
    v2 = tl.tracks[1]
    v3 = tl.tracks[2]
    a1 = tl.tracks[3]
    a2 = tl.tracks[4]
    a3 = tl.tracks[5]
    a4 = tl.tracks[6]

    # 1. PISTE V1_BACKGROUND (Fond propre / gap de base)
    new_v1 = otio.schema.Track(name="V1_BACKGROUND", kind=otio.schema.TrackKind.Video)
    new_v1.append(otio.schema.Gap(source_range=otio.opentime.TimeRange(rt(0), rt(total_timeline_frames))))

    # 2. PISTE V4_TITLES (Tout au sommet, au-dessus de V3 et V2)
    # Reçoit les chiffres affichés à l'écran, cartes de repères textuels et animations :
    # - title_card_01_sofia_athens.mov [0.00s - 6.48s]
    # - title_5_million_dollars.mov [11.72s - 14.40s] (Le chiffre $5 Million)
    # - 09-mining-comparison.mp4 [548.00s - 554.00s]
    v4_events = [
        (sec_to_frames(0.00), 162, "title_card_01_sofia_athens.mov", "episodes/01-ruja-ignatova/assets/texte_card/title_card_01_sofia_athens.mov"),
        (sec_to_frames(11.72), 67, "title_5_million_dollars.mov", "episodes/01-ruja-ignatova/assets/texte_card/title_5_million_dollars.mov"),
        (sec_to_frames(548.00), 150, "09-mining-comparison.mp4", "episodes/01-ruja-ignatova/assets/custom-graphics/09-mining-comparison.mp4")
    ]

    new_v4 = otio.schema.Track(name="V4_TITLES", kind=otio.schema.TrackKind.Video)
    curr_frame = 0
    for s_frame, d_frames, c_name, c_path in v4_events:
        if s_frame > curr_frame:
            new_v4.append(otio.schema.Gap(source_range=otio.opentime.TimeRange(rt(0), rt(s_frame - curr_frame))))
            curr_frame = s_frame
        clip = create_clip(c_name, c_path, d_frames)
        new_v4.append(clip)
        curr_frame += d_frames

    if curr_frame < total_timeline_frames:
        new_v4.append(otio.schema.Gap(source_range=otio.opentime.TimeRange(rt(0), rt(total_timeline_frames - curr_frame))))

    # 3. Réorganisation complète des 8 pistes dans l'ordre strict Kdenlive :
    # Video 1 (en bas)   : V1_BACKGROUND
    # Video 2            : V2_MAIN
    # Video 3            : V3_OVERLAYS (Chapitres + Fiches personnages)
    # Video 4 (au sommet): V4_TITLES (Chiffres $5M, Titre Sofia, etc. -> VISIBLE À 100% SANS ÊTRE CACHÉ !)
    # Audio 1            : A1_MASTER_VOICE
    # Audio 2            : A2_MUSIC_BED
    # Audio 3            : A3_SFX_WHOOSH
    # Audio 4            : A4_SECONDARY_AUDIO
    final_tracks = [
        new_v1, # Index 0 -> Video 1
        v2,     # Index 1 -> Video 2
        v3,     # Index 2 -> Video 3
        new_v4, # Index 3 -> Video 4 (au-dessus de tout !)
        a1,     # Index 4 -> Audio 1
        a2,     # Index 5 -> Audio 2
        a3,     # Index 6 -> Audio 3
        a4      # Index 7 -> Audio 4
    ]

    tl.tracks.clear()
    for tr in final_tracks:
        tl.tracks.append(tr)

    otio.adapters.write_to_file(tl, OTIO_PATH)
    print(f"🎉 Timeline OpenTimelineIO mise à jour : {OTIO_PATH}")

    # 4. Resynchronisation du catalogue visual_mapping.json
    def format_tc(seconds: float) -> str:
        if seconds is None: return "00:00:00"
        h = int(seconds // 3600)
        m = int((seconds % 3600) // 60)
        s = int(seconds % 60)
        return f"{h:02d}:{m:02d}:{s:02d}"

    markers_data = []
    for m in tl.tracks.markers:
        t = float(m.marked_range.start_time.value)
        comment = m.comment or m.name or ""
        markers_data.append({"time": t, "comment": comment})
    markers_data.sort(key=lambda x: x["time"])

    def find_active_marker(t_sec):
        active = markers_data[0] if markers_data else None
        for m in markers_data:
            if m["time"] <= t_sec:
                active = m
            else:
                break
        return active

    catalog = []
    for tr in tl.tracks:
        curr_t = 0.0
        clip_idx = 0
        for item in tr:
            dur = item.duration().to_seconds()
            if isinstance(item, otio.schema.Gap):
                curr_t += dur
                continue
            clip_idx += 1
            t_start = curr_t
            t_end = curr_t + dur
            m_info = find_active_marker(t_start)
            asset_path = ""
            if hasattr(item, "media_reference") and item.media_reference:
                asset_path = getattr(item.media_reference, "target_url", "") or ""
            
            catalog.append({
                "track": tr.name,
                "track_index": clip_idx,
                "asset_name": item.name,
                "asset_path": asset_path,
                "start_time": round(t_start, 2),
                "end_time": round(t_end, 2),
                "duration": round(dur, 2),
                "timecode": f"{format_tc(t_start)} -> {format_tc(t_end)}",
                "section": m_info["comment"] if m_info else "",
            })
            curr_t += dur

    vm_path = os.path.join(EPISODE_DIR, "montage/visual_mapping.json")
    with open(vm_path, "w") as f:
        json.dump(catalog, f, indent=2)
    print(f"✓ visual_mapping.json resynchronisé avec {len(catalog)} entrées")

    print("\n--- Vérification finale des pistes ---")
    final_tl = otio.adapters.read_from_file(OTIO_PATH)
    for i, tr in enumerate(final_tl.tracks):
        dur = tr.duration().to_seconds()
        clips = [c for c in tr if not isinstance(c, otio.schema.Gap)]
        print(f"Piste {i} [{str(tr.kind):5s}] : {tr.name:18s} | Durée = {dur:.2f}s | Clips = {len(clips):2d}")

if __name__ == "__main__":
    main()
