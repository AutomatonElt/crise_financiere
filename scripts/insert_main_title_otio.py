#!/usr/bin/env python3
"""
Insertion du Titre Principal dans la timeline Kdenlive OTIO (rudja2.otio)
------------------------------------------------------------------------
- Point de coupure : 48.00s (juste après '...actually knows if she's still alive.')
- Durée du titre   : 5.00s (125 frames @ 25 FPS)
- Silence vocal    : Gap de 5.00s sur A1_MASTER_VOICE (aucune voix sur le titre)
- Silence musical  : Coupure de la musique sur A2_MUSIC_BED à 48.00s, reprise ultérieure
- Son Whoosh       : main_title_cryptoqueen_shimmer_whoosh.wav sur A3_SFX_WHOOSH de 48.00s à 53.00s
- Décalage propre  : Tout le contenu aval (+5.00s) préservant l'alignement millimétré des cartes/chapitres
"""

import os
import sys
import copy
import json
import opentimelineio as otio

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(HERE)
OTIO_PATH = os.path.join(ROOT_DIR, "episodes/01-ruja-ignatova/rudja2.otio")

TITLE_VIDEO = os.path.join(ROOT_DIR, "episodes/01-ruja-ignatova/assets/texte_card/main_title_cryptoqueen_shimmer.mp4")
TITLE_SFX = os.path.join(ROOT_DIR, "episodes/01-ruja-ignatova/assets/texte_card/main_title_cryptoqueen_shimmer_whoosh.wav")

FPS = 25.0
SPLIT_SEC = 48.00
TITLE_DUR_SEC = 3.80

SPLIT_FRAMES = int(round(SPLIT_SEC * FPS))      # 1200 frames
TITLE_FRAMES = int(round(TITLE_DUR_SEC * FPS))  # 95 frames


def create_clip(name, path, duration_frames, is_audio=False):
    rate = FPS
    start_time = otio.opentime.RationalTime(0, rate)
    dur_time = otio.opentime.RationalTime(duration_frames, rate)
    time_range = otio.opentime.TimeRange(start_time, dur_time)
    
    media_ref = otio.schema.ExternalReference(
        target_url=path,
        available_range=time_range
    )
    media_ref.metadata["kdenlive"] = {
        "clip_type": 1 if is_audio else 2,
        "resource": path
    }
    
    clip = otio.schema.Clip(
        name=name,
        media_reference=media_ref,
        source_range=time_range
    )
    clip.metadata["kdenlive"] = {
        "clip_type": 1 if is_audio else 2,
        "kdenlive:id": name,
        "resource": path
    }
    return clip


def create_gap(duration_frames):
    rate = FPS
    dur_time = otio.opentime.RationalTime(duration_frames, rate)
    return otio.schema.Gap(duration=dur_time)


def process_timeline():
    print(f"🎬 Chargement du projet OTIO : {OTIO_PATH}")
    timeline = otio.adapters.read_from_file(OTIO_PATH)
    
    for track in timeline.tracks:
        track_name = track.name
        curr_frame = 0
        new_children = []
        
        print(f"\nTraitement de la piste : {track_name} ({track.kind})")
        
        if track_name == "V1_MAIN":
            for item in track:
                dur_frames = item.duration().to_frames()
                start_f = curr_frame
                end_f = curr_frame + dur_frames
                
                if end_f <= SPLIT_FRAMES or start_f >= SPLIT_FRAMES:
                    new_children.append(item)
                else:
                    # L'élément chevauche SPLIT_FRAMES (ex: New York federal courthouse.mp4)
                    cut_offset = SPLIT_FRAMES - start_f
                    rem_frames = dur_frames - cut_offset
                    
                    # Partie 1 avant 48.0s
                    orig_src_start = item.source_range.start_time.to_frames() if item.source_range else 0
                    rate = item.duration().rate
                    
                    part1 = copy.deepcopy(item)
                    part1.source_range = otio.opentime.TimeRange(
                        otio.opentime.RationalTime(orig_src_start, rate),
                        otio.opentime.RationalTime(cut_offset, rate)
                    )
                    new_children.append(part1)
                    
                    # Insertion de la vidéo du Titre Principal (48.0s -> 53.0s)
                    title_clip = create_clip(
                        name=os.path.basename(TITLE_VIDEO),
                        path=TITLE_VIDEO,
                        duration_frames=TITLE_FRAMES,
                        is_audio=False
                    )
                    new_children.append(title_clip)
                    
                    # Partie 2 après 53.0s
                    part2 = copy.deepcopy(item)
                    part2.source_range = otio.opentime.TimeRange(
                        otio.opentime.RationalTime(orig_src_start + cut_offset, rate),
                        otio.opentime.RationalTime(rem_frames, rate)
                    )
                    new_children.append(part2)
                    print(f"  ✓ V1_MAIN scindé à {SPLIT_SEC}s : {item.name} ({cut_offset}f) + Titre ({TITLE_FRAMES}f) + Suite ({rem_frames}f)")
                
                curr_frame = end_f

        elif track_name == "V2_OVERLAYS":
            # Sur V2, 48.00s tombe pile entre un Gap (41.92-48.00) et chapter_02 (48.00-52.48)
            # On prolonge le Gap de 125 frames (5.0s) pour laisser le titre respirer seul sur V1
            for item in track:
                dur_frames = item.duration().to_frames()
                start_f = curr_frame
                end_f = curr_frame + dur_frames
                
                if end_f == SPLIT_FRAMES and isinstance(item, otio.schema.Gap):
                    # Prolonger ce gap
                    extended_gap = create_gap(dur_frames + TITLE_FRAMES)
                    new_children.append(extended_gap)
                    print(f"  ✓ V2_OVERLAYS gap étendu de {dur_frames}f à {dur_frames + TITLE_FRAMES}f ({SPLIT_SEC}s -> {SPLIT_SEC + TITLE_DUR_SEC}s)")
                elif start_f < SPLIT_FRAMES and end_f > SPLIT_FRAMES and isinstance(item, otio.schema.Gap):
                    extended_gap = create_gap(dur_frames + TITLE_FRAMES)
                    new_children.append(extended_gap)
                    print(f"  ✓ V2_OVERLAYS gap traversant étendu de {dur_frames}f à {dur_frames + TITLE_FRAMES}f")
                else:
                    new_children.append(item)
                    
                curr_frame = end_f

        elif track_name == "V3_TITLES":
            # Gap traversant 48.00s étendu de 125 frames
            for item in track:
                dur_frames = item.duration().to_frames()
                start_f = curr_frame
                end_f = curr_frame + dur_frames
                
                if start_f < SPLIT_FRAMES and end_f > SPLIT_FRAMES and isinstance(item, otio.schema.Gap):
                    extended_gap = create_gap(dur_frames + TITLE_FRAMES)
                    new_children.append(extended_gap)
                    print(f"  ✓ V3_TITLES gap étendu de {dur_frames}f à {dur_frames + TITLE_FRAMES}f")
                else:
                    new_children.append(item)
                    
                curr_frame = end_f

        elif track_name == "A1_MASTER_VOICE":
            # Coupure de la voix à 48.0s, Gap de 5.0s, reprise de la voix à 53.0s
            for item in track:
                dur_frames = item.duration().to_frames()
                start_f = curr_frame
                end_f = curr_frame + dur_frames
                
                if start_f < SPLIT_FRAMES and end_f > SPLIT_FRAMES:
                    cut_offset = SPLIT_FRAMES - start_f
                    rem_frames = dur_frames - cut_offset
                    rate = item.duration().rate
                    orig_src_start = item.source_range.start_time.to_frames() if item.source_range else 0
                    
                    # Voix partie 1 (Hook : 0 à 48.0s)
                    part1 = copy.deepcopy(item)
                    part1.source_range = otio.opentime.TimeRange(
                        otio.opentime.RationalTime(orig_src_start, rate),
                        otio.opentime.RationalTime(cut_offset, rate)
                    )
                    new_children.append(part1)
                    
                    # SILENCE VOCAL (48.0s à 53.0s)
                    voice_gap = create_gap(TITLE_FRAMES)
                    new_children.append(voice_gap)
                    
                    # Voix partie 2 (reprise 'Let\'s rewind' à 53.0s)
                    part2 = copy.deepcopy(item)
                    part2.source_range = otio.opentime.TimeRange(
                        otio.opentime.RationalTime(orig_src_start + cut_offset, rate),
                        otio.opentime.RationalTime(rem_frames, rate)
                    )
                    new_children.append(part2)
                    print(f"  ✓ A1_MASTER_VOICE scindé : Voix 1 ({cut_offset}f) + SILENCE VOCAL ({TITLE_FRAMES}f) + Voix 2 ({rem_frames}f)")
                else:
                    new_children.append(item)
                    
                curr_frame = end_f

        elif track_name == "A2_MUSIC_BED":
            # Coupure de la musique du hook à 48.0s, silence musical de 48.0s à 53.0s
            rem_frames = 0
            for item in track:
                dur_frames = item.duration().to_frames()
                start_f = curr_frame
                end_f = curr_frame + dur_frames
                
                if start_f < SPLIT_FRAMES and end_f > SPLIT_FRAMES:
                    # Clip de musique traversant 48.0s : on l'arrête net à 48.0s
                    cut_offset = SPLIT_FRAMES - start_f
                    rem_frames = dur_frames - cut_offset
                    rate = item.duration().rate
                    orig_src_start = item.source_range.start_time.to_frames() if item.source_range else 0
                    
                    trimmed_music = copy.deepcopy(item)
                    trimmed_music.source_range = otio.opentime.TimeRange(
                        otio.opentime.RationalTime(orig_src_start, rate),
                        otio.opentime.RationalTime(cut_offset, rate)
                    )
                    new_children.append(trimmed_music)
                    
                    # SILENCE MUSICAL pendant le titre (5.0s = 125f)
                    music_gap = create_gap(TITLE_FRAMES)
                    new_children.append(music_gap)
                    print(f"  ✓ A2_MUSIC_BED : musique coupée à {SPLIT_SEC}s + SILENCE MUSICAL ({TITLE_FRAMES}f)")
                elif start_f >= SPLIT_FRAMES:
                    if isinstance(item, otio.schema.Gap) and rem_frames > 0:
                        extended_gap = create_gap(dur_frames + rem_frames)
                        new_children.append(extended_gap)
                        rem_frames = 0
                    else:
                        new_children.append(item)
                else:
                    new_children.append(item)
                    
                curr_frame = end_f

        elif track_name == "A3_SFX_WHOOSH":
            # Scission du gap à 48.0s pour insérer le SFX whoosh du titre
            for item in track:
                dur_frames = item.duration().to_frames()
                start_f = curr_frame
                end_f = curr_frame + dur_frames
                
                if start_f < SPLIT_FRAMES and end_f > SPLIT_FRAMES and isinstance(item, otio.schema.Gap):
                    gap1_f = SPLIT_FRAMES - start_f
                    gap2_f = end_f - SPLIT_FRAMES
                    
                    # Gap avant 48.0s
                    new_children.append(create_gap(gap1_f))
                    
                    # Whoosh SFX (48.0s -> 53.0s)
                    whoosh_clip = create_clip(
                        name=os.path.basename(TITLE_SFX),
                        path=TITLE_SFX,
                        duration_frames=TITLE_FRAMES,
                        is_audio=True
                    )
                    new_children.append(whoosh_clip)
                    
                    # Gap après 53.0s
                    new_children.append(create_gap(gap2_f))
                    print(f"  ✓ A3_SFX_WHOOSH : Gap1 ({gap1_f}f) + WHOOSH CLIP ({TITLE_FRAMES}f) + Gap2 ({gap2_f}f)")
                else:
                    new_children.append(item)
                    
                curr_frame = end_f

        elif track_name == "A4_SECONDARY_AUDIO":
            # Gap traversant 48.00s étendu de 125 frames
            for item in track:
                dur_frames = item.duration().to_frames()
                start_f = curr_frame
                end_f = curr_frame + dur_frames
                
                if start_f < SPLIT_FRAMES and end_f > SPLIT_FRAMES and isinstance(item, otio.schema.Gap):
                    extended_gap = create_gap(dur_frames + TITLE_FRAMES)
                    new_children.append(extended_gap)
                    print(f"  ✓ A4_SECONDARY_AUDIO gap étendu de {dur_frames}f à {dur_frames + TITLE_FRAMES}f")
                else:
                    new_children.append(item)
                    
                curr_frame = end_f

        # Remplacement des enfants de la piste
        del track[:]
        track.extend(new_children)

    # Écriture du nouveau fichier OTIO
    otio.adapters.write_to_file(timeline, OTIO_PATH)
    print(f"\n✅ Projet OTIO sauvegardé avec succès dans : {OTIO_PATH}")

    # Synchronisation de visual_mapping.json
    def format_tc(seconds: float) -> str:
        if seconds is None: return "00:00:00"
        h = int(seconds // 3600)
        m = int((seconds % 3600) // 60)
        s = int(seconds % 60)
        return f"{h:02d}:{m:02d}:{s:02d}"

    markers_data = []
    if hasattr(timeline.tracks, "markers"):
        for m in timeline.tracks.markers:
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
    for tr in timeline.tracks:
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

    vm_path = os.path.join(ROOT_DIR, "episodes/01-ruja-ignatova/montage/visual_mapping.json")
    with open(vm_path, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2)
    print(f"✓ visual_mapping.json resynchronisé avec {len(catalog)} entrées ({vm_path})")


if __name__ == "__main__":
    process_timeline()
