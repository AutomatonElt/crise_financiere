#!/usr/bin/env python3
"""
reorder_and_align_all_cards_otio.py
-----------------------------------
1. Réordonne les pistes vidéo dans l'ordre compositing natif de Kdenlive :
   - Piste 0 (Video 1 en bas)  : V1_BACKGROUND
   - Piste 1 (Video 2 au milieu): V2_MAIN
   - Piste 2 (Video 3 au-dessus): V3_OVERLAYS (Textes, cartes, chapitres avec canal alpha)
2. Positionne les 7 cartes de chapitres (ChapterCard) aux repères exacts de l'enquête.
3. Positionne toutes les fiches de personnages (EvidenceCard 'soft') aux moments où leurs noms sont prononcés.
4. Synchronise les déclencheurs audio sur A3_SFX_WHOOSH.
5. Re-conforme visual_mapping.json.
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
    print("=== Reconfiguration des pistes & alignement des Chapitres et Cartes ===")
    if not os.path.exists(OTIO_PATH):
        raise FileNotFoundError(f"Fichier OTIO introuvable : {OTIO_PATH}")

    # Sauvegarde
    shutil.copy2(OTIO_PATH, BAK_PATH)
    print(f"✓ Sauvegarde créée : {BAK_PATH}")

    tl = otio.adapters.read_from_file(OTIO_PATH)
    total_timeline_frames = sec_to_frames(1607.0)
    print(f"Durée totale de la timeline : 1607.0s ({total_timeline_frames} frames @ {FPS} FPS)")

    # 1. Comblement propre des gaps de rushs sur V2_MAIN
    # Trouvé dans les pistes : V2 est actuellement à l'index 1
    v2 = tl.tracks[1]
    curr_frame = 0
    for i, item in enumerate(v2):
        d = round(item.duration().to_seconds() * FPS)
        # Trou à 1074.96s (9.0s) -> man_travel.mp4
        if isinstance(item, otio.schema.Gap) and abs(curr_frame - sec_to_frames(1074.96)) <= 1:
            print(f"-> Remplacement du Gap V2 à {curr_frame/FPS:.2f}s par man_travel.mp4 (9s)")
            v2[i] = create_clip("man_travel.mp4", "episodes/01-ruja-ignatova/assets/footage-reel/man_travel.mp4", d)
        # Trou à 1399.96s (5.0s) -> bitecoin_video.mp4
        elif isinstance(item, otio.schema.Gap) and abs(curr_frame - sec_to_frames(1399.96)) <= 1:
            print(f"-> Remplacement du Gap V2 à {curr_frame/FPS:.2f}s par bitecoin_video.mp4 (5s)")
            v2[i] = create_clip("bitecoin_video.mp4", "episodes/01-ruja-ignatova/assets/footage-reel/bitecoin_video.mp4", d)
        # Trou à 1553.96s (6.0s) -> reward_money.mp4
        elif isinstance(item, otio.schema.Gap) and abs(curr_frame - sec_to_frames(1553.96)) <= 1:
            print(f"-> Remplacement du Gap V2 à {curr_frame/FPS:.2f}s par reward_money.mp4 (6s)")
            v2[i] = create_clip("reward_money.mp4", "episodes/01-ruja-ignatova/assets/footage-reel/reward_money.mp4", d)
        curr_frame += d

    # 2. Construction de V1_BACKGROUND (Piste 0 - fond)
    v1_events = [
        (sec_to_frames(0.0), 162, "title_card_01_sofia_athens.mov", "episodes/01-ruja-ignatova/assets/texte_card/title_card_01_sofia_athens.mov"),
        (sec_to_frames(11.72), 67, "title_5_million_dollars.mov", "episodes/01-ruja-ignatova/assets/texte_card/title_5_million_dollars.mov"),
        (sec_to_frames(548.00), 150, "09-mining-comparison.mp4", "episodes/01-ruja-ignatova/assets/custom-graphics/09-mining-comparison.mp4")
    ]
    new_v1 = otio.schema.Track(name="V1_BACKGROUND", kind=otio.schema.TrackKind.Video)
    curr_frame = 0
    for s_frame, d_frames, c_name, c_path in v1_events:
        if s_frame > curr_frame:
            new_v1.append(otio.schema.Gap(source_range=otio.opentime.TimeRange(rt(0), rt(s_frame - curr_frame))))
            curr_frame = s_frame
        clip = create_clip(c_name, c_path, d_frames)
        new_v1.append(clip)
        curr_frame += d_frames
    if curr_frame < total_timeline_frames:
        new_v1.append(otio.schema.Gap(source_range=otio.opentime.TimeRange(rt(0), rt(total_timeline_frames - curr_frame))))

    # 3. Construction de V3_OVERLAYS (Piste 2 - sommet de la pile vidéo, au-dessus de V2)
    # Comprend les 7 chapitres + toutes les fiches personnages + illustrations spécifiques
    v3_events = [
        # Chapitre 01 (Hook : The Woman Who Vanished With $4 Billion)
        (sec_to_frames(0.00), 112, "chapter_01_woman_who_vanished.mov", "episodes/01-ruja-ignatova/assets/texte_card/chapter_01_woman_who_vanished.mov"),
        # Fiche Personnage Ruja Ignatova
        (sec_to_frames(36.92), sec_to_frames(5.0), "card_ruja_soft.mov", "episodes/01-ruja-ignatova/assets/texte_card/card_ruja_soft.mov"),
        # Chapitre 02 (Histoire : The Story)
        (sec_to_frames(48.00), 112, "chapter_02_the_story.mov", "episodes/01-ruja-ignatova/assets/texte_card/chapter_02_the_story.mov"),
        # Fiche Personnage Sebastian Greenwood (Histoire)
        (sec_to_frames(108.20), sec_to_frames(5.0), "card_greenwood_soft.mov", "episodes/01-ruja-ignatova/assets/texte_card/card_greenwood_soft.mov"),
        # Fiche Personnage Bjørn Bjercke (Histoire)
        (sec_to_frames(324.72), sec_to_frames(5.0), "card_bjercke_soft.mov", "episodes/01-ruja-ignatova/assets/texte_card/card_bjercke_soft.mov"),
        # Chapitre 03 (The Breakdown / Le Mécanisme)
        (sec_to_frames(438.00), 112, "chapter_03_the_breakdown.mov", "episodes/01-ruja-ignatova/assets/texte_card/chapter_03_the_breakdown.mov"),
        # Chapitre 04 (The Numbers / Les Chiffres)
        (sec_to_frames(769.00), 112, "chapter_04_the_numbers.mov", "episodes/01-ruja-ignatova/assets/texte_card/chapter_04_the_numbers.mov"),
        # Chapitre 05 (The Aftermath / Les Conséquences)
        (sec_to_frames(1048.00), 112, "chapter_05_the_aftermath.mov", "episodes/01-ruja-ignatova/assets/texte_card/chapter_05_the_aftermath.mov"),
        # Fiche Personnage Sebastian Greenwood (Aftermath rappel arrestation)
        (sec_to_frames(1052.48), sec_to_frames(5.0), "card_greenwood_soft.mov", "episodes/01-ruja-ignatova/assets/texte_card/card_greenwood_soft.mov"),
        # Fiche Personnage Konstantin Ignatov (Aftermath)
        (sec_to_frames(1077.32), sec_to_frames(5.0), "card_konstantin_soft.mov", "episodes/01-ruja-ignatova/assets/texte_card/card_konstantin_soft.mov"),
        # Fiche Personnage Gilbert Armenta (Aftermath)
        (sec_to_frames(1120.92), sec_to_frames(5.0), "card_armenta_soft.mov", "episodes/01-ruja-ignatova/assets/texte_card/card_armenta_soft.mov"),
        # Fiche Personnage Mark Scott (Aftermath)
        (sec_to_frames(1145.40), sec_to_frames(5.0), "card_scott_soft.mov", "episodes/01-ruja-ignatova/assets/texte_card/card_scott_soft.mov"),
        # B-roll existant comptage argent
        (sec_to_frames(1151.00), sec_to_frames(5.0), "comptage_argent.mp4", "episodes/01-ruja-ignatova/assets/ia-video/comptage_argent.mp4"),
        # IA image existante café Le Cap
        (sec_to_frames(1347.00), sec_to_frames(9.0), "03-cafe-cape-town.png", "episodes/01-ruja-ignatova/assets/ia-image/03-cafe-cape-town.png"),
        # Chapitre 06 (The Pattern / Le Modèle)
        (sec_to_frames(1397.00), 112, "chapter_06_the_pattern.mov", "episodes/01-ruja-ignatova/assets/texte_card/chapter_06_the_pattern.mov"),
        # Chapitre 07 (Epilogue / Outro)
        (sec_to_frames(1548.00), 112, "chapter_07_epilogue.mov", "episodes/01-ruja-ignatova/assets/texte_card/chapter_07_epilogue.mov"),
        # Fiche Personnage Charles Ponzi (Outro)
        (sec_to_frames(1587.80), sec_to_frames(5.0), "card_ponzi_soft.mov", "episodes/01-ruja-ignatova/assets/texte_card/card_ponzi_soft.mov"),
    ]

    new_v3 = otio.schema.Track(name="V3_OVERLAYS", kind=otio.schema.TrackKind.Video)
    curr_frame = 0
    for s_frame, d_frames, c_name, c_path in v3_events:
        if s_frame > curr_frame:
            new_v3.append(otio.schema.Gap(source_range=otio.opentime.TimeRange(rt(0), rt(s_frame - curr_frame))))
            curr_frame = s_frame
        clip = create_clip(c_name, c_path, d_frames)
        new_v3.append(clip)
        curr_frame += d_frames

    if curr_frame < total_timeline_frames:
        new_v3.append(otio.schema.Gap(source_range=otio.opentime.TimeRange(rt(0), rt(total_timeline_frames - curr_frame))))

    # 4. Synchronisation de A3_SFX_WHOOSH
    a3_events = [
        (sec_to_frames(0.0), 162, "title_card_01_sofia_athens.mov", "episodes/01-ruja-ignatova/assets/texte_card/title_card_01_sofia_athens.mov"),
        (sec_to_frames(11.72), 67, "title_5_million_dollars.mov", "episodes/01-ruja-ignatova/assets/texte_card/title_5_million_dollars.mov"),
        (sec_to_frames(36.92), sec_to_frames(5.0), "card_ruja_soft_shutter.wav", "episodes/01-ruja-ignatova/assets/texte_card/card_ruja_soft_shutter.wav"),
        (sec_to_frames(108.20), sec_to_frames(5.0), "card_greenwood_soft_shutter.wav", "episodes/01-ruja-ignatova/assets/texte_card/card_greenwood_soft_shutter.wav"),
        (sec_to_frames(324.72), sec_to_frames(5.0), "card_bjercke_soft_shutter.wav", "episodes/01-ruja-ignatova/assets/texte_card/card_bjercke_soft_shutter.wav"),
        (sec_to_frames(1052.48), sec_to_frames(5.0), "card_greenwood_soft_shutter.wav", "episodes/01-ruja-ignatova/assets/texte_card/card_greenwood_soft_shutter.wav"),
        (sec_to_frames(1077.32), sec_to_frames(5.0), "card_konstantin_soft_shutter.wav", "episodes/01-ruja-ignatova/assets/texte_card/card_konstantin_soft_shutter.wav"),
        (sec_to_frames(1120.92), sec_to_frames(5.0), "card_armenta_soft_shutter.wav", "episodes/01-ruja-ignatova/assets/texte_card/card_armenta_soft_shutter.wav"),
        (sec_to_frames(1145.40), sec_to_frames(5.0), "card_scott_soft_shutter.wav", "episodes/01-ruja-ignatova/assets/texte_card/card_scott_soft_shutter.wav"),
        (sec_to_frames(1587.80), sec_to_frames(5.0), "card_ponzi_soft_shutter.wav", "episodes/01-ruja-ignatova/assets/texte_card/card_ponzi_soft_shutter.wav"),
    ]

    new_a3 = otio.schema.Track(name="A3_SFX_WHOOSH", kind=otio.schema.TrackKind.Audio)
    curr_frame = 0
    for s_frame, d_frames, c_name, c_path in a3_events:
        if s_frame > curr_frame:
            new_a3.append(otio.schema.Gap(source_range=otio.opentime.TimeRange(rt(0), rt(s_frame - curr_frame))))
            curr_frame = s_frame
        clip = create_clip(c_name, c_path, d_frames, is_audio=True)
        new_a3.append(clip)
        curr_frame += d_frames

    if curr_frame < total_timeline_frames:
        new_a3.append(otio.schema.Gap(source_range=otio.opentime.TimeRange(rt(0), rt(total_timeline_frames - curr_frame))))

    # Pistes Audio existantes
    a1 = tl.tracks[3]
    a2 = tl.tracks[4]
    a4 = tl.tracks[6]

    # 5. RE-ORGANISATION DES PISTES DANS L'ORDRE KDENLIVE :
    # Dans Kdenlive, les pistes vidéo s'empilent du bas vers le haut :
    # Piste 0 = Video 1 (V1_BACKGROUND)
    # Piste 1 = Video 2 (V2_MAIN)
    # Piste 2 = Video 3 (V3_OVERLAYS -> au-dessus de V2 !)
    # Suivies des pistes audio A1, A2, A3, A4
    new_tracks = [
        new_v1, # Piste 0 -> Video 1
        v2,     # Piste 1 -> Video 2
        new_v3, # Piste 2 -> Video 3 (au-dessus !)
        a1,     # Piste 3 -> Audio 1
        a2,     # Piste 4 -> Audio 2
        new_a3, # Piste 5 -> Audio 3
        a4      # Piste 6 -> Audio 4
    ]

    # Vider et réinsérer dans l'ordre strict
    tl.tracks.clear()
    for tr in new_tracks:
        tl.tracks.append(tr)

    otio.adapters.write_to_file(tl, OTIO_PATH)
    print(f"🎉 Timeline OpenTimelineIO écrite avec succès : {OTIO_PATH}")

    # Vérification finale
    print("\n--- Vérification finale des 7 pistes ---")
    final_tl = otio.adapters.read_from_file(OTIO_PATH)
    for i, tr in enumerate(final_tl.tracks):
        dur = tr.duration().to_seconds()
        clips = [c for c in tr if not isinstance(c, otio.schema.Gap)]
        print(f"Piste {i} [{str(tr.kind):5s}] : {tr.name:18s} | Durée = {dur:.2f}s | Clips = {len(clips):2d}")

if __name__ == "__main__":
    main()
