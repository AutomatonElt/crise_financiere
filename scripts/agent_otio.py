#!/usr/bin/env python3
"""
Agent OTIO - Financial Forensics Pipeline
Génère et re-conforme les timelines OpenTimelineIO pour Kdenlive (7 pistes standardisées)
avec un système de labels compact et direct [PISTE]_[INDEX] | [SLUG] (ex: V2_001 | FBI_POSTER),
normalisation 25 FPS et synchronisation complète du fichier visual_mapping.json.
"""

import argparse
import json
import os
import re
import sys
import traceback
import opentimelineio as otio

FPS = 25.0


def clean_short_slug(name: str) -> str:
    base = os.path.basename(name)
    base = os.path.splitext(base)[0]
    base = re.sub(r'^[0-9]+[-_]', '', base)
    base = re.sub(r'^(thumbnail[-_][a-z][-_]|fbi[-_])', '', base, flags=re.IGNORECASE)
    base = re.sub(r'[^a-zA-Z0-9]+', '_', base).strip('_').upper()
    parts = [p for p in base.split('_') if p]
    if not parts:
        return 'CLIP'
    short = '_'.join(parts[:3])
    if len(short) > 20:
        short = '_'.join(parts[:2])
    return short[:22].rstrip('_') or 'CLIP'


def get_section_info(sec_name: str):
    sec = sec_name.upper().strip()
    if 'HOOK' in sec: return 'HOOK', 'Hook'
    if 'WHOOSH' in sec: return 'WHOOSH', sec_name
    if 'HISTOIRE' in sec: return 'HIST', 'Histoire'
    if 'BREAKDOWN' in sec: return 'BRK', 'Breakdown'
    if 'NUMBERS' in sec: return 'NUM', 'Numbers'
    if 'AFTERMATH' in sec: return 'AFT', 'Aftermath'
    if 'PATTERN' in sec: return 'PAT', 'Pattern'
    if 'OUTRO' in sec: return 'OUTRO', 'Outro'
    code = re.sub(r'[^A-Z]', '', sec)[:5] or 'SEC'
    return code, sec_name


def format_tc(seconds: float) -> str:
    if seconds is None: return '00:00:00'
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    return f'{h:02d}:{m:02d}:{s:02d}'


def to_rational_time(sec: float, fps: float = FPS) -> otio.opentime.RationalTime:
    return otio.opentime.RationalTime(round(sec * fps), fps)


def process_timeline(preview_path: str, out_otio_path: str, out_json_path: str):
    if not os.path.exists(preview_path):
        raise FileNotFoundError(f"Fichier preview introuvable : {preview_path}")

    print(f"-> Lecture de la timeline source : {preview_path}")
    preview_tl = otio.adapters.read_from_file(preview_path)

    # 1. Extraction des marqueurs
    markers_data = []
    for m in preview_tl.tracks.markers:
        t = float(m.marked_range.start_time.value)
        comment = m.comment or m.name or ''
        sec = 'HOOK'
        if ' - ' in comment:
            sec = comment.split(' - ')[0].strip()
        elif '#' in comment:
            sec = comment.split(' - ')[0].strip()
        code, full_sec = get_section_info(sec)
        markers_data.append({
            'time': t,
            'comment': comment,
            'section_code': code,
            'section_name': full_sec,
            'marker_obj': m
        })
    markers_data.sort(key=lambda x: x['time'])

    def find_active_marker(t_sec):
        active = markers_data[0] if markers_data else None
        for m in markers_data:
            if m['time'] <= t_sec:
                active = m
            else:
                break
        return active

    # 2. Timeline standard 7 pistes à 25 FPS
    timeline = otio.schema.Timeline("Ruja Ignatova Rebuild")
    timeline.metadata['kdenlive'] = {'version': '26.04.3'}
    timeline.metadata['fps'] = FPS

    t_v3 = otio.schema.Track(name="V3_OVERLAYS", kind=otio.schema.TrackKind.Video)
    t_v2 = otio.schema.Track(name="V2_MAIN", kind=otio.schema.TrackKind.Video)
    t_v1 = otio.schema.Track(name="V1_BACKGROUND", kind=otio.schema.TrackKind.Video)
    t_a1 = otio.schema.Track(name="A1_MASTER_VOICE", kind=otio.schema.TrackKind.Audio)
    t_a2 = otio.schema.Track(name="A2_MUSIC_BED", kind=otio.schema.TrackKind.Audio)
    t_a3 = otio.schema.Track(name="A3_SFX_WHOOSH", kind=otio.schema.TrackKind.Audio)
    t_a4 = otio.schema.Track(name="A4_SECONDARY_AUDIO", kind=otio.schema.TrackKind.Audio)

    # Injection des repères dans la Stack OTIO (Kdenlive lit value comme secondes)
    for md in markers_data:
        m_name = md['comment'] if md['comment'] else f"{md['section_code']} @ {format_tc(md['time'])}"
        new_m = otio.schema.Marker(
            name=m_name,
            color=otio.schema.MarkerColor.PURPLE,
            marked_range=otio.opentime.TimeRange(
                start_time=otio.opentime.RationalTime(md['time'], 30.0),
                duration=otio.opentime.RationalTime(1.0, 30.0)
            ),
            comment=md['comment']
        )
        new_m.metadata['kdenlive'] = {'type': 0}
        timeline.tracks.markers.append(new_m)

    catalog = []

    # 3. Piste V2_MAIN (Piste vidéo principale)
    if len(preview_tl.tracks) > 1:
        src_v2 = preview_tl.tracks[1]
        curr_t = 0.0
        v2_idx = 0
        for item in src_v2:
            dur = item.duration().to_seconds()
            if isinstance(item, otio.schema.Gap):
                gap = otio.schema.Gap(
                    source_range=otio.opentime.TimeRange(
                        start_time=to_rational_time(0.0),
                        duration=to_rational_time(dur)
                    )
                )
                t_v2.append(gap)
                curr_t += dur
                continue

            v2_idx += 1
            t_start = curr_t
            t_end = curr_t + dur
            m_info = find_active_marker(t_start)

            code_id = f"V2_{v2_idx:03d}"
            slug = clean_short_slug(item.name)
            label = f"{code_id} | {slug}"

            cloned = item.clone()
            cloned.name = label

            if isinstance(item, otio.schema.Transition):
                if hasattr(item, 'in_offset') and item.in_offset:
                    cloned.in_offset = to_rational_time(item.in_offset.to_seconds())
                if hasattr(item, 'out_offset') and item.out_offset:
                    cloned.out_offset = to_rational_time(item.out_offset.to_seconds())
            elif hasattr(item, 'source_range') and item.source_range:
                start_in_media = item.source_range.start_time.to_seconds()
                cloned.source_range = otio.opentime.TimeRange(
                    start_time=to_rational_time(start_in_media),
                    duration=to_rational_time(dur)
                )

            asset_path = ''
            if hasattr(item, 'media_reference') and item.media_reference:
                asset_path = getattr(item.media_reference, 'target_url', '') or ''
                cloned.media_reference.name = label

            t_v2.append(cloned)

            catalog.append({
                'id': code_id,
                'label': label,
                'track': 'V2_MAIN',
                'track_id': 'V2',
                'track_index': v2_idx,
                'start_time': round(t_start, 2),
                'end_time': round(t_end, 2),
                'duration': round(dur, 2),
                'timecode': f'{format_tc(t_start)} -> {format_tc(t_end)}',
                'section': m_info['comment'] if m_info else '',
                'section_code': m_info['section_code'] if m_info else 'GEN',
                'asset_name': item.name,
                'asset_path': asset_path,
                'type': 'transition' if isinstance(item, otio.schema.Transition) else ('image' if asset_path.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')) else 'video')
            })
            curr_t += dur

    # 4. Piste V3_OVERLAYS (Titres, Habillages, Graphismes)
    if len(preview_tl.tracks) > 2:
        src_v3 = preview_tl.tracks[2]
        curr_t = 0.0
        v3_idx = 0
        for item in src_v3:
            dur = item.duration().to_seconds()
            if isinstance(item, otio.schema.Gap):
                gap = otio.schema.Gap(
                    source_range=otio.opentime.TimeRange(
                        start_time=to_rational_time(0.0),
                        duration=to_rational_time(dur)
                    )
                )
                t_v3.append(gap)
                curr_t += dur
                continue

            v3_idx += 1
            t_start = curr_t
            t_end = curr_t + dur
            m_info = find_active_marker(t_start)

            code_id = f"V3_{v3_idx:03d}"
            slug = clean_short_slug(item.name)
            label = f"{code_id} | {slug}"

            cloned = item.clone()
            cloned.name = label

            if hasattr(item, 'source_range') and item.source_range:
                start_in_media = item.source_range.start_time.to_seconds()
                cloned.source_range = otio.opentime.TimeRange(
                    start_time=to_rational_time(start_in_media),
                    duration=to_rational_time(dur)
                )

            asset_path = ''
            if hasattr(item, 'media_reference') and item.media_reference:
                asset_path = getattr(item.media_reference, 'target_url', '') or ''
                cloned.media_reference.name = label

            t_v3.append(cloned)

            catalog.append({
                'id': code_id,
                'label': label,
                'track': 'V3_OVERLAYS',
                'track_id': 'V3',
                'track_index': v3_idx,
                'start_time': round(t_start, 2),
                'end_time': round(t_end, 2),
                'duration': round(dur, 2),
                'timecode': f'{format_tc(t_start)} -> {format_tc(t_end)}',
                'section': m_info['comment'] if m_info else '',
                'section_code': m_info['section_code'] if m_info else 'GEN',
                'asset_name': item.name,
                'asset_path': asset_path,
                'type': 'overlay'
            })
            curr_t += dur

    # 5. Piste A1_MASTER_VOICE (Voix off)
    if len(preview_tl.tracks) > 3:
        src_a1 = preview_tl.tracks[3]
        for item in src_a1:
            dur = item.duration().to_seconds()
            cloned = item.clone()
            cloned.name = "A1_001 | VOICEOVER_MASTER_EN"
            if hasattr(cloned, 'media_reference') and cloned.media_reference:
                cloned.media_reference.name = "VOICEOVER_MASTER_EN"
            start_in_media = item.source_range.start_time.to_seconds() if (hasattr(item, 'source_range') and item.source_range) else 0.0
            cloned.source_range = otio.opentime.TimeRange(
                start_time=to_rational_time(start_in_media),
                duration=to_rational_time(dur)
            )
            t_a1.append(cloned)

    # 6. Piste A4_SECONDARY_AUDIO (Audio secondaire / SFX / Graphismes avec son)
    if len(preview_tl.tracks) > 4:
        src_a4 = preview_tl.tracks[4]
        curr_t = 0.0
        a4_idx = 0
        for item in src_a4:
            dur = item.duration().to_seconds()
            if isinstance(item, otio.schema.Gap):
                gap = otio.schema.Gap(
                    source_range=otio.opentime.TimeRange(
                        start_time=to_rational_time(0.0),
                        duration=to_rational_time(dur)
                    )
                )
                t_a4.append(gap)
                curr_t += dur
                continue

            a4_idx += 1
            t_start = curr_t
            t_end = curr_t + dur
            m_info = find_active_marker(t_start)

            code_id = f"A4_{a4_idx:03d}"
            slug = clean_short_slug(item.name)
            label = f"{code_id} | {slug}"

            cloned = item.clone()
            cloned.name = label

            start_in_media = item.source_range.start_time.to_seconds() if (hasattr(item, 'source_range') and item.source_range) else 0.0
            cloned.source_range = otio.opentime.TimeRange(
                start_time=to_rational_time(start_in_media),
                duration=to_rational_time(dur)
            )

            asset_path = ''
            if hasattr(item, 'media_reference') and item.media_reference:
                asset_path = getattr(item.media_reference, 'target_url', '') or ''
                cloned.media_reference.name = label

            t_a4.append(cloned)

            catalog.append({
                'id': code_id,
                'label': label,
                'track': 'A4_SECONDARY_AUDIO',
                'track_id': 'A4',
                'track_index': a4_idx,
                'start_time': round(t_start, 2),
                'end_time': round(t_end, 2),
                'duration': round(dur, 2),
                'timecode': f'{format_tc(t_start)} -> {format_tc(t_end)}',
                'section': m_info['comment'] if m_info else '',
                'section_code': m_info['section_code'] if m_info else 'GEN',
                'asset_name': item.name,
                'asset_path': asset_path,
                'type': 'secondary_audio'
            })
            curr_t += dur

    for tr in [t_v3, t_v2, t_v1, t_a1, t_a2, t_a3, t_a4]:
        timeline.tracks.append(tr)

    otio.adapters.write_to_file(timeline, out_otio_path)
    print(f"-> Succès : Timeline OTIO exportée vers {out_otio_path} (cadence: {FPS} FPS)")

    if out_json_path:
        os.makedirs(os.path.dirname(os.path.abspath(out_json_path)), exist_ok=True)
        with open(out_json_path, 'w', encoding='utf-8') as f:
            json.dump(catalog, f, indent=2, ensure_ascii=False)
        print(f"-> Succès : {len(catalog)} entrées exportées vers {out_json_path}")


def main():
    parser = argparse.ArgumentParser(description="Agent OTIO - Financial Forensics")
    parser.add_argument("--import-preview", default="episodes/01-ruja-ignatova/rudja_preview.otio")
    parser.add_argument("--out", default="episodes/01-ruja-ignatova/01-ruja-ignatova-auto.otio")
    parser.add_argument("--json", default="episodes/01-ruja-ignatova/montage/visual_mapping.json")
    args = parser.parse_args()

    process_timeline(args.import_preview, args.out, args.json)


if __name__ == "__main__":
    main()
