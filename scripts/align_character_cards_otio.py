#!/usr/bin/env python3
"""
align_character_cards_otio.py
-----------------------------
Positionne avec précision les cartes de personnages (EvidenceCard 'soft')
sur la piste V3_OVERLAYS et leurs effets sonores associés sur A3_SFX_WHOOSH
dans la timeline Kdenlive OpenTimelineIO (rudja2.otio).
"""

import os
import shutil
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

def create_clip(name, rel_path, start_frame, dur_frames, is_audio=False):
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
    print("=== Positionnement automatique des cartes de personnages sur V3 ===")
    if not os.path.exists(OTIO_PATH):
        raise FileNotFoundError(f"Fichier OTIO introuvable : {OTIO_PATH}")

    # Sauvegarde
    shutil.copy2(OTIO_PATH, BAK_PATH)
    print(f"✓ Sauvegarde créée : {BAK_PATH}")

    tl = otio.adapters.read_from_file(OTIO_PATH)
    total_timeline_frames = sec_to_frames(1607.0)
    print(f"Durée totale de la timeline : {1607.0}s ({total_timeline_frames} frames à {FPS} FPS)")

    # 1. Mise à jour de V2_MAIN pour combler le trou [1074.96 - 1083.96] avec man_travel.mp4
    v2 = tl.tracks[1]
    curr_v2 = 0
    for i, item in enumerate(v2):
        d = item.duration().value
        if isinstance(item, otio.schema.Gap) and curr_v2 == sec_to_frames(1074.96):
            print(f"-> Remplacement du Gap sur V2 à {curr_v2/FPS:.2f}s ({d} frames) par man_travel.mp4")
            man_travel_path = os.path.join(EPISODE_DIR, "assets/footage-reel/man_travel.mp4")
            man_clip = otio.schema.Clip(
                name="man_travel.mp4",
                media_reference=otio.schema.ExternalReference(
                    target_url=man_travel_path,
                    available_range=otio.opentime.TimeRange(rt(0), rt(225))
                ),
                source_range=otio.opentime.TimeRange(rt(0), rt(225))
            )
            v2[i] = man_clip
            break
        curr_v2 += d

    # 2. Reconstitution propre de V3_OVERLAYS
    # Définition ordonnée des clips V3 (start_frame, dur_frames, name, rel_path)
    v3_events = [
        # 1. Ruja Ignatova (Hook)
        (sec_to_frames(36.92), sec_to_frames(5.0), "card_ruja_soft.mov", "episodes/01-ruja-ignatova/assets/texte_card/card_ruja_soft.mov"),
        # 2. Sebastian Greenwood (Histoire)
        (sec_to_frames(108.20), sec_to_frames(5.0), "card_greenwood_soft.mov", "episodes/01-ruja-ignatova/assets/texte_card/card_greenwood_soft.mov"),
        # 3. Bjørn Bjercke (Histoire)
        (sec_to_frames(324.72), sec_to_frames(5.0), "card_bjercke_soft.mov", "episodes/01-ruja-ignatova/assets/texte_card/card_bjercke_soft.mov"),
        # 4. Sebastian Greenwood (Aftermath rappel)
        (sec_to_frames(1052.00), sec_to_frames(5.0), "card_greenwood_soft.mov", "episodes/01-ruja-ignatova/assets/texte_card/card_greenwood_soft.mov"),
        # 5. Konstantin Ignatov (Aftermath)
        (sec_to_frames(1077.32), sec_to_frames(5.0), "card_konstantin_soft.mov", "episodes/01-ruja-ignatova/assets/texte_card/card_konstantin_soft.mov"),
        # 6. Gilbert Armenta (Aftermath)
        (sec_to_frames(1120.92), sec_to_frames(5.0), "card_armenta_soft.mov", "episodes/01-ruja-ignatova/assets/texte_card/card_armenta_soft.mov"),
        # 7. Mark Scott (Aftermath)
        (sec_to_frames(1145.40), sec_to_frames(5.0), "card_scott_soft.mov", "episodes/01-ruja-ignatova/assets/texte_card/card_scott_soft.mov"),
        # 8. B-roll existant comptage argent
        (sec_to_frames(1151.00), sec_to_frames(5.0), "comptage_argent.mp4", "episodes/01-ruja-ignatova/assets/ia-video/comptage_argent.mp4"),
        # 9. IA image existante café Le Cap
        (sec_to_frames(1347.00), sec_to_frames(9.0), "03-cafe-cape-town.png", "episodes/01-ruja-ignatova/assets/ia-image/03-cafe-cape-town.png"),
        # 10. B-roll existant bitcoin
        (sec_to_frames(1398.00), sec_to_frames(5.0), "bitecoin_video.mp4", "episodes/01-ruja-ignatova/assets/footage-reel/bitecoin_video.mp4"),
        # 11. B-roll existant reward money
        (sec_to_frames(1550.00), 192, "reward_money.mp4", "episodes/01-ruja-ignatova/assets/footage-reel/reward_money.mp4"),
        # 12. Charles Ponzi (Outro)
        (sec_to_frames(1587.80), sec_to_frames(5.0), "card_ponzi_soft.mov", "episodes/01-ruja-ignatova/assets/texte_card/card_ponzi_soft.mov"),
    ]

    new_v3 = otio.schema.Track(name="V3_OVERLAYS", kind=otio.schema.TrackKind.Video)
    curr_frame = 0
    for s_frame, d_frames, c_name, c_path in v3_events:
        if s_frame > curr_frame:
            gap_dur = s_frame - curr_frame
            new_v3.append(otio.schema.Gap(source_range=otio.opentime.TimeRange(rt(0), rt(gap_dur))))
            curr_frame = s_frame
        clip = create_clip(c_name, c_path, 0, d_frames)
        new_v3.append(clip)
        curr_frame += d_frames

    if curr_frame < total_timeline_frames:
        gap_dur = total_timeline_frames - curr_frame
        new_v3.append(otio.schema.Gap(source_range=otio.opentime.TimeRange(rt(0), rt(gap_dur))))

    tl.tracks[0] = new_v3
    print(f"✓ Piste V3_OVERLAYS reconstruite avec succès ({len(v3_events)} clips, durée = {new_v3.duration().to_seconds():.2f}s)")

    # 3. Nettoyage de V1_BACKGROUND (suppression de l'ancienne carte ruja print)
    v1_events = [
        (sec_to_frames(0.0), 162, "title_card_01_sofia_athens.mov", "episodes/01-ruja-ignatova/assets/texte_card/title_card_01_sofia_athens.mov"),
        (sec_to_frames(11.72), 67, "title_5_million_dollars.mov", "episodes/01-ruja-ignatova/assets/texte_card/title_5_million_dollars.mov"),
        (sec_to_frames(548.00), 150, "09-mining-comparison.mp4", "episodes/01-ruja-ignatova/assets/custom-graphics/09-mining-comparison.mp4")
    ]
    new_v1 = otio.schema.Track(name="V1_BACKGROUND", kind=otio.schema.TrackKind.Video)
    curr_frame = 0
    for s_frame, d_frames, c_name, c_path in v1_events:
        if s_frame > curr_frame:
            gap_dur = s_frame - curr_frame
            new_v1.append(otio.schema.Gap(source_range=otio.opentime.TimeRange(rt(0), rt(gap_dur))))
            curr_frame = s_frame
        clip = create_clip(c_name, c_path, 0, d_frames)
        new_v1.append(clip)
        curr_frame += d_frames

    if curr_frame < total_timeline_frames:
        gap_dur = total_timeline_frames - curr_frame
        new_v1.append(otio.schema.Gap(source_range=otio.opentime.TimeRange(rt(0), rt(gap_dur))))

    tl.tracks[2] = new_v1
    print(f"✓ Piste V1_BACKGROUND nettoyée ({len(v1_events)} clips, durée = {new_v1.duration().to_seconds():.2f}s)")

    # 4. Synchronisation de A3_SFX_WHOOSH (Shutter audio pour chaque carte de personnage)
    a3_events = [
        (sec_to_frames(0.0), 162, "title_card_01_sofia_athens.mov", "episodes/01-ruja-ignatova/assets/texte_card/title_card_01_sofia_athens.mov"),
        (sec_to_frames(11.72), 67, "title_5_million_dollars.mov", "episodes/01-ruja-ignatova/assets/texte_card/title_5_million_dollars.mov"),
        (sec_to_frames(36.92), sec_to_frames(5.0), "card_ruja_soft_shutter.wav", "episodes/01-ruja-ignatova/assets/texte_card/card_ruja_soft_shutter.wav"),
        (sec_to_frames(108.20), sec_to_frames(5.0), "card_greenwood_soft_shutter.wav", "episodes/01-ruja-ignatova/assets/texte_card/card_greenwood_soft_shutter.wav"),
        (sec_to_frames(324.72), sec_to_frames(5.0), "card_bjercke_soft_shutter.wav", "episodes/01-ruja-ignatova/assets/texte_card/card_bjercke_soft_shutter.wav"),
        (sec_to_frames(1052.00), sec_to_frames(5.0), "card_greenwood_soft_shutter.wav", "episodes/01-ruja-ignatova/assets/texte_card/card_greenwood_soft_shutter.wav"),
        (sec_to_frames(1077.32), sec_to_frames(5.0), "card_konstantin_soft_shutter.wav", "episodes/01-ruja-ignatova/assets/texte_card/card_konstantin_soft_shutter.wav"),
        (sec_to_frames(1120.92), sec_to_frames(5.0), "card_armenta_soft_shutter.wav", "episodes/01-ruja-ignatova/assets/texte_card/card_armenta_soft_shutter.wav"),
        (sec_to_frames(1145.40), sec_to_frames(5.0), "card_scott_soft_shutter.wav", "episodes/01-ruja-ignatova/assets/texte_card/card_scott_soft_shutter.wav"),
        (sec_to_frames(1587.80), sec_to_frames(5.0), "card_ponzi_soft_shutter.wav", "episodes/01-ruja-ignatova/assets/texte_card/card_ponzi_soft_shutter.wav"),
    ]

    new_a3 = otio.schema.Track(name="A3_SFX_WHOOSH", kind=otio.schema.TrackKind.Audio)
    curr_frame = 0
    for s_frame, d_frames, c_name, c_path in a3_events:
        if s_frame > curr_frame:
            gap_dur = s_frame - curr_frame
            new_a3.append(otio.schema.Gap(source_range=otio.opentime.TimeRange(rt(0), rt(gap_dur))))
            curr_frame = s_frame
        clip = create_clip(c_name, c_path, 0, d_frames, is_audio=True)
        new_a3.append(clip)
        curr_frame += d_frames

    if curr_frame < total_timeline_frames:
        gap_dur = total_timeline_frames - curr_frame
        new_a3.append(otio.schema.Gap(source_range=otio.opentime.TimeRange(rt(0), rt(gap_dur))))

    tl.tracks[5] = new_a3
    print(f"✓ Piste A3_SFX_WHOOSH synchronisée ({len(a3_events)} sons, durée = {new_a3.duration().to_seconds():.2f}s)")

    # 5. Extension propre de A2_MUSIC_BED jusqu'à la fin
    a2 = tl.tracks[4]
    a2_dur_frames = sec_to_frames(sum(it.duration().to_seconds() for it in a2))
    if a2_dur_frames < total_timeline_frames:
        gap_dur = total_timeline_frames - a2_dur_frames
        a2.append(otio.schema.Gap(source_range=otio.opentime.TimeRange(rt(0), rt(gap_dur))))
        a2.source_range = otio.opentime.TimeRange(rt(0), rt(total_timeline_frames))
        print(f"✓ Piste A2_MUSIC_BED ajustée avec gap terminal jusqu'à {total_timeline_frames/FPS:.2f}s")

    # Écriture du fichier final
    otio.adapters.write_to_file(tl, OTIO_PATH)
    print(f"🎉 Timeline OpenTimelineIO écrite avec succès : {OTIO_PATH}")

    # Validation finale des 7 pistes
    print("\n--- Vérification finale des 7 pistes ---")
    final_tl = otio.adapters.read_from_file(OTIO_PATH)
    for i, tr in enumerate(final_tl.tracks):
        dur = tr.duration().to_seconds()
        clips = [c for c in tr if not isinstance(c, otio.schema.Gap)]
        kind_str = str(tr.kind)
        print(f"Piste {i} [{kind_str:5s}] : {tr.name:18s} | Durée = {dur:.2f}s | Clips = {len(clips):2d}")

if __name__ == "__main__":
    main()
