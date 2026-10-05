#!/usr/bin/env python3
"""
Insertion des Cartes des Lieux (Location Title Cards) dans la timeline OTIO
--------------------------------------------------------------------------
Insère les 9 cartes des lieux avec leurs sons de frappe clavier synchronisés :
1. title_card_01_sofia_athens.mov           [  0.00s -   6.48s] (Sofia - Athènes, vol Ryanair)
2. title_card_02_konstanz_germany.mov       [ 61.20s -  68.64s] (Bulgarie & Allemagne, Université de Constance)
3. title_card_03_sofia_foundation.mov       [118.00s - 123.76s] (2014, Fondation de OneCoin à Sofia)
4. title_card_04_wembley_london.mov         [253.00s - 259.72s] (Juin 2016, Wembley Arena Londres)
5. title_card_05_sdny_indictment.mov        [421.20s - 429.04s] (12 Octobre 2017, SDNY Indictment)
6. title_card_06_thailand_arrest.mov        [1061.28s - 1067.36s] (2018, Arrestation Greenwood à Koh Samui)
7. title_card_07_los_angeles_arrest.mov     [1086.20s - 1092.52s] (Mars 2019, Arrestation Konstantin à Los Angeles)
8. title_card_08_ionian_sea.mov             [1235.00s - 1241.72s] (Novembre 2018, Yacht Mer Ionienne)
9. title_card_09_cape_town.mov              [1336.00s - 1343.04s] (Janvier 2026, Piste Le Cap Afrique du Sud)

Pistes cibles :
- Vidéos : V3_TITLES
- Audio  : A3_SFX_WHOOSH (sons de clavier typing calés)
"""

import os
import sys
import copy
import json
import opentimelineio as otio

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(HERE)
OTIO_PATH = os.path.join(ROOT_DIR, "episodes/01-ruja-ignatova/rudja2.otio")
TEXTE_CARD_DIR = os.path.join(ROOT_DIR, "episodes/01-ruja-ignatova/assets/texte_card")

FPS = 25.0
TOTAL_FRAMES = 40270  # 1610.80s

LOCATION_CARDS = [
    {
        "id": "title_card_01_sofia_athens",
        "video": os.path.join(TEXTE_CARD_DIR, "title_card_01_sofia_athens.mov"),
        "audio": os.path.join(TEXTE_CARD_DIR, "title_card_01_sofia_athens_typing.wav"),
        "start_sec": 0.00,
        "dur_sec": 6.48,
        "frames": 162,
    },
    {
        "id": "title_card_02_konstanz_germany",
        "video": os.path.join(TEXTE_CARD_DIR, "title_card_02_konstanz_germany.mov"),
        "audio": os.path.join(TEXTE_CARD_DIR, "title_card_02_konstanz_germany_typing.wav"),
        "start_sec": 61.20,
        "dur_sec": 7.44,
        "frames": 186,
    },
    {
        "id": "title_card_03_sofia_foundation",
        "video": os.path.join(TEXTE_CARD_DIR, "title_card_03_sofia_foundation.mov"),
        "audio": os.path.join(TEXTE_CARD_DIR, "title_card_03_sofia_foundation_typing.wav"),
        "start_sec": 118.00,
        "dur_sec": 5.76,
        "frames": 144,
    },
    {
        "id": "title_card_04_wembley_london",
        "video": os.path.join(TEXTE_CARD_DIR, "title_card_04_wembley_london.mov"),
        "audio": os.path.join(TEXTE_CARD_DIR, "title_card_04_wembley_london_typing.wav"),
        "start_sec": 253.00,
        "dur_sec": 6.72,
        "frames": 168,
    },
    {
        "id": "title_card_05_sdny_indictment",
        "video": os.path.join(TEXTE_CARD_DIR, "title_card_05_sdny_indictment.mov"),
        "audio": os.path.join(TEXTE_CARD_DIR, "title_card_05_sdny_indictment_typing.wav"),
        "start_sec": 421.20,
        "dur_sec": 7.84,
        "frames": 196,
    },
    {
        "id": "title_card_06_thailand_arrest",
        "video": os.path.join(TEXTE_CARD_DIR, "title_card_06_thailand_arrest.mov"),
        "audio": os.path.join(TEXTE_CARD_DIR, "title_card_06_thailand_arrest_typing.wav"),
        "start_sec": 1061.28,
        "dur_sec": 6.08,
        "frames": 152,
    },
    {
        "id": "title_card_07_los_angeles_arrest",
        "video": os.path.join(TEXTE_CARD_DIR, "title_card_07_los_angeles_arrest.mov"),
        "audio": os.path.join(TEXTE_CARD_DIR, "title_card_07_los_angeles_arrest_typing.wav"),
        "start_sec": 1086.20,
        "dur_sec": 6.32,
        "frames": 158,
    },
    {
        "id": "title_card_08_ionian_sea",
        "video": os.path.join(TEXTE_CARD_DIR, "title_card_08_ionian_sea.mov"),
        "audio": os.path.join(TEXTE_CARD_DIR, "title_card_08_ionian_sea_typing.wav"),
        "start_sec": 1235.00,
        "dur_sec": 6.72,
        "frames": 168,
    },
    {
        "id": "title_card_09_cape_town",
        "video": os.path.join(TEXTE_CARD_DIR, "title_card_09_cape_town.mov"),
        "audio": os.path.join(TEXTE_CARD_DIR, "title_card_09_cape_town_typing.wav"),
        "start_sec": 1336.00,
        "dur_sec": 7.04,
        "frames": 176,
    },
]


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


def build_track_with_clips(original_track, clips_to_insert, is_audio=False):
    """
    Conserve tous les clips existants non-gap, et insère les nouveaux clips
    dans les zones de Gap sans collision ni décalage temporel global.
    """
    # 1. Extraire tous les clips existants (sauf ceux qu'on remplace/met à jour)
    existing_events = []
    curr = 0
    for item in original_track:
        dur = item.duration().to_frames()
        if not isinstance(item, otio.schema.Gap):
            # Ne pas dupliquer title_card_01 si déjà présent
            if not any(c["id"] in item.name for c in clips_to_insert):
                existing_events.append({
                    "start_f": curr,
                    "dur_f": dur,
                    "end_f": curr + dur,
                    "item": item
                })
        curr += dur

    # 2. Ajouter les nouveaux clips
    all_events = list(existing_events)
    for c in clips_to_insert:
        start_f = int(round(c["start_sec"] * FPS))
        dur_f = c["frames"]
        file_path = c["audio"] if is_audio else c["video"]
        clip_obj = create_clip(
            name=os.path.basename(file_path),
            path=file_path,
            duration_frames=dur_f,
            is_audio=is_audio
        )
        all_events.append({
            "start_f": start_f,
            "dur_f": dur_f,
            "end_f": start_f + dur_f,
            "item": clip_obj
        })

    # Trier par temps de début
    all_events.sort(key=lambda x: x["start_f"])

    # 3. Assembler avec des Gaps
    new_children = []
    cursor_f = 0
    for ev in all_events:
        start_f = ev["start_f"]
        dur_f = ev["dur_f"]
        
        if start_f > cursor_f:
            new_children.append(create_gap(start_f - cursor_f))
            cursor_f = start_f
        elif start_f < cursor_f:
            print(f"⚠️ Avertissement : Chevauchement détecté à {start_f}f (curseur à {cursor_f}f) pour {ev['item'].name}")
            # Ajuster le début si nécessaire
            start_f = cursor_f

        new_children.append(ev["item"])
        cursor_f = start_f + dur_f

    # Gap final pour atteindre TOTAL_FRAMES
    if cursor_f < TOTAL_FRAMES:
        new_children.append(create_gap(TOTAL_FRAMES - cursor_f))

    return new_children


def main():
    print(f"🎬 Chargement du projet OTIO : {OTIO_PATH}")
    timeline = otio.adapters.read_from_file(OTIO_PATH)

    v3_track = None
    a3_track = None
    for t in timeline.tracks:
        if t.name == "V3_TITLES":
            v3_track = t
        elif t.name == "A3_SFX_WHOOSH":
            a3_track = t

    if not v3_track or not a3_track:
        print("❌ Erreur : Pistes V3_TITLES ou A3_SFX_WHOOSH introuvables !")
        sys.exit(1)

    print("\n📍 Intégration des 9 Cartes des Lieux sur V3_TITLES...")
    new_v3_children = build_track_with_clips(v3_track, LOCATION_CARDS, is_audio=False)
    del v3_track[:]
    v3_track.extend(new_v3_children)
    print(f"  ✓ V3_TITLES assemblé : {len(v3_track)} éléments, {sum(c.duration().to_frames() for c in v3_track)} frames")

    print("\n🔊 Intégration des Sons Clavier (Typing) sur A3_SFX_WHOOSH...")
    new_a3_children = build_track_with_clips(a3_track, LOCATION_CARDS, is_audio=True)
    del a3_track[:]
    a3_track.extend(new_a3_children)
    print(f"  ✓ A3_SFX_WHOOSH assemblé : {len(a3_track)} éléments, {sum(c.duration().to_frames() for c in a3_track)} frames")

    # Sauvegarde OTIO
    otio.adapters.write_to_file(timeline, OTIO_PATH)
    print(f"\n✅ Projet OTIO sauvegardé avec succès dans : {OTIO_PATH}")

    # Synchronisation de visual_mapping.json
    def format_tc(seconds: float) -> str:
        if seconds is None: return "00:00:00"
        h = int(seconds // 3600)
        m = int((seconds % 3600) // 60)
        s = int(seconds % 60)
        return f"{h:02d}:{m:02d}:{s:02d}"

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
                "section": f"Event {clip_idx}",
            })
            curr_t += dur

    vm_path = os.path.join(ROOT_DIR, "episodes/01-ruja-ignatova/montage/visual_mapping.json")
    with open(vm_path, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2)
    print(f"✓ visual_mapping.json resynchronisé avec {len(catalog)} entrées ({vm_path})")


if __name__ == "__main__":
    main()
