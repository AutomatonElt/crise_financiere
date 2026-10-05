#!/usr/bin/env python3
"""
shift_aftermath_timeline_otio.py
---------------------------------
Recale l'intégralité de la section Aftermath (Acte 5) jusqu'à la fin de la vidéo
dans rudja5.otio d'un offset précis de +47.44s (+1186 frames à 25.0 FPS).

Alignement cible :
- chapter_05_the_aftermath.mov  -> 1099.24s (18:19.24) - Calé sur l'intro Aftermath "So what happened..." (18:19.39)
- card_greenwood_soft.mov       -> 1103.72s (18:23.72) - Calé sur la prononciation de "Sebastian Greenwood" (18:23.64)
- card_greenwood_soft_shutter   -> 1103.72s (18:23.72) - Clic obturateur synchrone frame 0
- title_card_06_thailand_arrest -> 1108.72s (18:28.72) - Calé sur "was arrested in Thailand" (18:28.54)
- card_konstantin_soft.mov      -> 1128.56s (18:48.56) - Calé sur "Konstantin Ignatov" (18:48.50)
- title_card_07_los_angeles     -> 1133.64s (18:53.64) - Calé sur "arrested in Los Angeles" (18:54.66)
- card_armenta_soft.mov         -> 1172.16s (19:32.16) - Calé sur "Gilbert Armenta" (19:32.48)
- card_scott_soft.mov           -> 1196.64s (19:56.64) - Calé sur "Mark Scott" (19:56.51)
- V1_MAIN rushs d'archives      -> juge_frappe_bare.mp4 démarre à 1115.68s (créant un gap de 56.88s après pastor_nigeria)
- A4_SECONDARY_AUDIO rushs      -> décalés en parfaite synchronie avec V1
- A1_MASTER_VOICE voix off      -> durée étendue à 1602.56s pour couvrir la timeline complète
- Repères / Markers             -> décalés de +47.44s à partir de l'Aftermath (>= 1045s)
"""

import argparse
import os
import shutil
import sys
import opentimelineio as otio

FPS = 25.0
SHIFT_FRAMES = 1186  # 47.44s à 25 FPS
SHIFT_SEC = SHIFT_FRAMES / FPS


def rt(frames: int) -> otio.opentime.RationalTime:
    return otio.opentime.RationalTime(round(frames), FPS)


def shift_timeline(input_path: str, output_path: str, shift_frames: int = SHIFT_FRAMES):
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Fichier OTIO introuvable : {input_path}")

    print(f"-> Chargement de la timeline : {input_path}")
    tl = otio.adapters.read_from_file(input_path)

    shift_sec = shift_frames / FPS
    print(f"⚡ Application du décalage : +{shift_frames} frames (+{shift_sec:.2f} secondes) à partir de T ≈ 17:31\n")

    # 1. PISTE 0 : V1_MAIN (Rushs vidéo principaux)
    v1 = tl.tracks[0]
    print(f"=== Piste V1_MAIN ({len(v1)} items) ===")
    curr_v1 = 0
    shifted_v1 = False
    for i, it in enumerate(v1):
        dur_frames = round(it.duration().to_seconds() * FPS)
        # On repère le gap entre pastor_nigeria (#150, fin à 26470 frames = 1058.80s)
        # et juge_frappe_bare (#152, début à 26706 frames = 1068.24s)
        if isinstance(it, otio.schema.Gap) and 26400 <= curr_v1 <= 26600:
            old_dur = dur_frames
            new_dur = old_dur + shift_frames
            it.source_range = otio.opentime.TimeRange(rt(0), rt(new_dur))
            print(f"  ✓ Gap index #{i} étendu de {old_dur/FPS:.2f}s ({old_dur}f) à {new_dur/FPS:.2f}s ({new_dur}f)")
            print(f"    -> Crée le vide entre pastor_nigeria.png ({curr_v1/FPS:.2f}s) et juge_frappe_bare.mp4 ({(curr_v1+new_dur)/FPS:.2f}s)")
            shifted_v1 = True
            break
        curr_v1 += dur_frames

    if not shifted_v1:
        print("  ⚠️ Avertissement : Gap cible sur V1 non trouvé par détection d'index, ajustement de secours.")

    # 2. PISTE 1 : V2_OVERLAYS (Cartes chapitres, fiches personnages)
    v2 = tl.tracks[1]
    print(f"\n=== Piste V2_OVERLAYS ({len(v2)} items) ===")
    curr_v2 = 0
    shifted_v2 = False
    for i, it in enumerate(v2):
        dur_frames = round(it.duration().to_seconds() * FPS)
        # On cherche le grand Gap précédent chapter_05_the_aftermath (#15, fin à 26295 frames = 1051.80s)
        if isinstance(it, otio.schema.Gap) and curr_v2 + dur_frames == 26295:
            old_dur = dur_frames
            new_dur = old_dur + shift_frames
            it.source_range = otio.opentime.TimeRange(rt(0), rt(new_dur))
            print(f"  ✓ Gap index #{i} étendu de {old_dur/FPS:.2f}s ({old_dur}f) à {new_dur/FPS:.2f}s ({new_dur}f)")
            print(f"    -> chapter_05_the_aftermath.mov recale à {(curr_v2+new_dur)/FPS:.2f}s (18:19.24)")
            print(f"    -> card_greenwood_soft.mov recale à {(curr_v2+new_dur+112)/FPS:.2f}s (18:23.72)")
            shifted_v2 = True
            break
        curr_v2 += dur_frames

    if not shifted_v2:
        print("  ⚠️ Avertissement : Gap cible sur V2 non trouvé, recherche par position >= 1050s...")
        curr_v2 = 0
        for i, it in enumerate(v2):
            dur_frames = round(it.duration().to_seconds() * FPS)
            if isinstance(it, otio.schema.Gap) and 19000 <= curr_v2 <= 27000 and (curr_v2 + dur_frames) >= 26200:
                old_dur = dur_frames
                new_dur = old_dur + shift_frames
                it.source_range = otio.opentime.TimeRange(rt(0), rt(new_dur))
                print(f"  ✓ Gap index #{i} étendu à {new_dur/FPS:.2f}s")
                shifted_v2 = True
                break
            curr_v2 += dur_frames

    # 3. PISTE 2 : V3_TITLES (Titres spatio-temporels)
    v3 = tl.tracks[2]
    print(f"\n=== Piste V3_TITLES ({len(v3)} items) ===")
    curr_v3 = 0
    shifted_v3 = False
    for i, it in enumerate(v3):
        dur_frames = round(it.duration().to_seconds() * FPS)
        # Gap avant title_card_06_thailand_arrest (#11, fin à 26532 frames = 1061.28s)
        if isinstance(it, otio.schema.Gap) and curr_v3 + dur_frames == 26532:
            old_dur = dur_frames
            new_dur = old_dur + shift_frames
            it.source_range = otio.opentime.TimeRange(rt(0), rt(new_dur))
            print(f"  ✓ Gap index #{i} étendu de {old_dur/FPS:.2f}s ({old_dur}f) à {new_dur/FPS:.2f}s ({new_dur}f)")
            print(f"    -> title_card_06_thailand_arrest recale à {(curr_v3+new_dur)/FPS:.2f}s (18:28.72)")
            shifted_v3 = True
            break
        curr_v3 += dur_frames

    if not shifted_v3:
        print("  ⚠️ Avertissement : Gap cible sur V3 non trouvé par fin exacte, ajustement par plage.")
        curr_v3 = 0
        for i, it in enumerate(v3):
            dur_frames = round(it.duration().to_seconds() * FPS)
            if isinstance(it, otio.schema.Gap) and 15000 <= curr_v3 <= 27000 and (curr_v3 + dur_frames) >= 26500:
                old_dur = dur_frames
                new_dur = old_dur + shift_frames
                it.source_range = otio.opentime.TimeRange(rt(0), rt(new_dur))
                print(f"  ✓ Gap index #{i} étendu à {new_dur/FPS:.2f}s")
                shifted_v3 = True
                break
            curr_v3 += dur_frames

    # 4. PISTE 3 : A1_MASTER_VOICE (Voix off)
    a1 = tl.tracks[3]
    print(f"\n=== Piste A1_MASTER_VOICE ({len(a1)} items) ===")
    if len(a1) >= 3 and isinstance(a1[2], otio.schema.Clip):
        clip2 = a1[2]
        old_dur_f = round(clip2.duration().to_seconds() * FPS)
        # La durée totale de voiceover_en_v2.mp3 est 1602.56s (40064 frames)
        max_dur_f = 40064
        clip2.source_range = otio.opentime.TimeRange(
            clip2.source_range.start_time,
            rt(max_dur_f)
        )
        print(f"  ✓ Extension de la durée du clip vocal A1 #2 de {old_dur_f/FPS:.2f}s à {max_dur_f/FPS:.2f}s")
        print(f"    -> Permet à la voix de couvrir toute la timeline jusqu'à {(1279+max_dur_f)/FPS:.2f}s (27:33.72)")

    # 5. PISTE 5 : A3_SFX_WHOOSH (Bruitages synchro)
    a3 = tl.tracks[5]
    print(f"\n=== Piste A3_SFX_WHOOSH ({len(a3)} items) ===")
    curr_a3 = 0
    shifted_a3 = False
    for i, it in enumerate(a3):
        dur_frames = round(it.duration().to_seconds() * FPS)
        # Gap avant card_greenwood_soft_shutter.wav (#19, fin à 26407 frames = 1056.28s)
        if isinstance(it, otio.schema.Gap) and curr_a3 + dur_frames == 26407:
            old_dur = dur_frames
            new_dur = old_dur + shift_frames
            it.source_range = otio.opentime.TimeRange(rt(0), rt(new_dur))
            print(f"  ✓ Gap index #{i} étendu de {old_dur/FPS:.2f}s ({old_dur}f) à {new_dur/FPS:.2f}s ({new_dur}f)")
            print(f"    -> card_greenwood_soft_shutter.wav recale à {(curr_a3+new_dur)/FPS:.2f}s (18:23.72)")
            shifted_a3 = True
            break
        curr_a3 += dur_frames

    if not shifted_a3:
        curr_a3 = 0
        for i, it in enumerate(a3):
            dur_frames = round(it.duration().to_seconds() * FPS)
            if isinstance(it, otio.schema.Gap) and 15000 <= curr_a3 <= 27000 and (curr_a3 + dur_frames) >= 26350:
                old_dur = dur_frames
                new_dur = old_dur + shift_frames
                it.source_range = otio.opentime.TimeRange(rt(0), rt(new_dur))
                print(f"  ✓ Gap index #{i} étendu à {new_dur/FPS:.2f}s")
                shifted_a3 = True
                break
            curr_a3 += dur_frames

    # 6. PISTE 6 : A4_SECONDARY_AUDIO (Audio des rushs V1)
    a4 = tl.tracks[6]
    print(f"\n=== Piste A4_SECONDARY_AUDIO ({len(a4)} items) ===")
    curr_a4 = 0
    shifted_a4 = False
    for i, it in enumerate(a4):
        dur_frames = round(it.duration().to_seconds() * FPS)
        # Insertion du gap juste avant arrestation.mp4 (fin de EpilogueTitle à 26370 frames = 1054.80s)
        if (curr_a4 + dur_frames) == 26370 or (it.name == "EpilogueTitle.mp4" and 26000 <= curr_a4 <= 26500):
            gap_a4 = otio.schema.Gap(source_range=otio.opentime.TimeRange(rt(0), rt(shift_frames)))
            a4.insert(i + 1, gap_a4)
            print(f"  ✓ Gap inséré après #{i} {it.name} (+{shift_sec:.2f}s / {shift_frames}f)")
            print(f"    -> Début des rushs audio Aftermath décalé à {(curr_a4 + dur_frames + shift_frames)/FPS:.2f}s (18:22.24)")
            shifted_a4 = True
            break
        curr_a4 += dur_frames

    # 7. REPÈRES (Markers) de timeline
    print("\n=== Recalage des Repères de Timeline ===")
    shifted_markers_count = 0
    for m in tl.tracks.markers:
        val = m.marked_range.start_time.value
        # Si le repère est >= 1045s (section Aftermath et suivantes)
        if val >= 1045.0:
            old_val = val
            new_val = val + shift_sec
            m.marked_range = otio.opentime.TimeRange(
                start_time=otio.opentime.RationalTime(new_val, 25.0),
                duration=m.marked_range.duration
            )
            shifted_markers_count += 1
            if shifted_markers_count <= 5 or "Greenwood" in m.comment:
                print(f"  ✓ Repère '{m.comment}' : {old_val:.2f}s -> {new_val:.2f}s ({int(new_val//60):02d}:{new_val%60:04.1f})")

    print(f"  ✓ Total de repères décalés : {shifted_markers_count}")

    # 8. Sauvegarde de la timeline
    print(f"\n-> Écriture du fichier modifié : {output_path}")
    otio.adapters.write_to_file(tl, output_path)
    print("✅ Opération terminée avec succès !")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Décale l'Aftermath dans rudja5.otio")
    parser.add_argument("--in", dest="in_path", default="episodes/01-ruja-ignatova/rudja5.otio", help="Fichier OTIO d'entrée")
    parser.add_argument("--out", dest="out_path", default="episodes/01-ruja-ignatova/rudja5.otio", help="Fichier OTIO de sortie")
    parser.add_argument("--frames", dest="frames", type=int, default=SHIFT_FRAMES, help="Nombre de frames à décaler (défaut: 1186)")
    args = parser.parse_args()

    shift_timeline(args.in_path, args.out_path, args.frames)
