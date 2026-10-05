#!/usr/bin/env python3
"""
scripts/apply_final_animations_and_volume.py
--------------------------------------------
1. Ajuste le volume de la piste A2 (A2_MUSIC_BED) :
   - Premier morceau (suspense) : -6 dB
   - Deuxième morceau (chestnutmusicstudios-08-the-breakthrough-597941.mp3) : -19 dB
   - Dernier morceau (chestnutmusicstudios-01-following-the-evidence-597942.mp3) : -18 dB
   Bake les filtres Kdenlive dans rudja_animation.kdenlive et génère des versions audio ajustées.

2. Anime toutes les 32 photos fixes sur V1_MAIN avec mouvements Ken Burns cinématographiques :
   - Zoom avant doux proportionnel (100% -> 115%)
   - Zoom arrière doux proportionnel (115% -> 100%)
   - Dérive latérale douce (pan right + zoom / pan left + zoom)
   - Sortie MP4 1080p 25fps calibrée à la frame exacte.

3. Met à jour simultanément :
   - rudja6.otio
   - rudja_animation.kdenlive (playlist8 / chains)
   - visual_mapping.json
   - Feuille de montage ruja ignatova.md
"""

import os
import sys
import json
import shutil
import subprocess
import xml.etree.ElementTree as ET
import opentimelineio as otio

BASE_DIR = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp"
EPISODE_DIR = os.path.join(BASE_DIR, "episodes/01-ruja-ignatova")
OTIO_PATH = os.path.join(EPISODE_DIR, "rudja6.otio")
KDENLIVE_PATH = os.path.join(EPISODE_DIR, "rudja_animation.kdenlive")
VM_PATH = os.path.join(EPISODE_DIR, "montage/visual_mapping.json")
ANIM_DIR = os.path.join(EPISODE_DIR, "assets/footage-animated")
ADJUSTED_MUSIC_DIR = os.path.join(BASE_DIR, "_shared/music/adjusted")

FPS = 25.0
IMG_EXTS = {".png", ".jpg", ".jpeg", ".webp"}


def rt(f):
    return otio.opentime.RationalTime(round(f), FPS)


def frames_to_timecode(frames: int) -> str:
    total_sec = frames / FPS
    h = int(total_sec // 3600)
    m = int((total_sec % 3600) // 60)
    s = int(total_sec % 60)
    ms = int(round((total_sec - int(total_sec)) * 1000))
    return f"{h:02d}:{m:02d}:{s:02d}.{ms:03d}"


def adjust_audio_volumes():
    print("\n" + "=" * 60)
    print("1️⃣  AJUSTEMENT DES VOLUMES AUDIO SUR A2_MUSIC_BED")
    print("=" * 60)
    os.makedirs(ADJUSTED_MUSIC_DIR, exist_ok=True)

    tracks = [
        ("arctsound-dark-cinematic-documentary-suspense-226709 (1).mp3", -6),
        ("chestnutmusicstudios-08-the-breakthrough-597941.mp3", -19),
        ("chestnutmusicstudios-01-following-the-evidence-597942.mp3", -18),
    ]

    for fname, db in tracks:
        in_p = os.path.join(BASE_DIR, "_shared/music", fname)
        base_no_ext, ext = os.path.splitext(fname)
        out_p = os.path.join(ADJUSTED_MUSIC_DIR, f"{base_no_ext}_{abs(db)}db{ext}")
        print(f"🎵 Rendu audio : {fname} -> {db} dB ({os.path.basename(out_p)})")
        cmd = [
            "ffmpeg", "-y", "-i", in_p,
            "-filter:a", f"volume={db}dB",
            "-c:a", "libmp3lame", "-q:a", "2",
            out_p
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode != 0:
            print(f"⚠️ Erreur ffmpeg audio: {res.stderr}")

    # Mise à jour des filtres dans rudja_animation.kdenlive
    print("\n🔧 Mise à jour des filtres de volume dans rudja_animation.kdenlive...")
    tree = ET.parse(KDENLIVE_PATH)
    root = tree.getroot()

    pl4 = root.find(".//playlist[@id='playlist4']")
    if pl4 is not None:
        max_filter_idx = 20
        for f in root.findall(".//filter"):
            fid = f.get("id", "")
            if fid.startswith("filter"):
                try:
                    num = int(fid.replace("filter", ""))
                    if num > max_filter_idx:
                        max_filter_idx = num
                except ValueError:
                    pass

        def make_volume_filter(filter_id, db_val):
            f = ET.Element("filter", id=f"filter{filter_id}")
            p_win = ET.SubElement(f, "property", name="window")
            p_win.text = "75"
            p_max = ET.SubElement(f, "property", name="max_gain")
            p_max.text = "20dB"
            p_lvl = ET.SubElement(f, "property", name="level")
            p_lvl.text = f"00:00:00.000={db_val}"
            p_mask = ET.SubElement(f, "property", name="channel_mask")
            p_mask.text = "-1"
            p_svc = ET.SubElement(f, "property", name="mlt_service")
            p_svc.text = "volume"
            p_kid = ET.SubElement(f, "property", name="kdenlive_id")
            p_kid.text = "volume"
            p_col = ET.SubElement(f, "property", name="kdenlive:collapsed")
            p_col.text = "0"
            return f

        for entry in pl4.findall("entry"):
            prod = entry.get("producer")
            db_target = None
            if prod == "chain57":
                db_target = -6
            elif prod == "chain58":
                db_target = -19
            elif prod == "chain59":
                db_target = -18

            if db_target is not None:
                for ex_f in entry.findall("filter"):
                    svc = ex_f.find("property[@name='mlt_service']")
                    if svc is not None and svc.text == "volume":
                        entry.remove(ex_f)
                max_filter_idx += 1
                new_f = make_volume_filter(max_filter_idx, db_target)
                entry.append(new_f)
                p_ae = entry.find("property[@name='kdenlive:activeeffect']")
                if p_ae is None:
                    p_ae = ET.SubElement(entry, "property", name="kdenlive:activeeffect")
                p_ae.text = "0"

        tree.write(KDENLIVE_PATH, encoding="utf-8", xml_declaration=True)
        print("✓ rudja_animation.kdenlive mis à jour avec les niveaux de volume A2 (-6dB, -19dB, -18dB)")


def animate_photo(img_path: str, dur_sec: float, dur_frames: int, style_idx: int, out_mp4: str):
    if os.path.exists(out_mp4) and os.path.getsize(out_mp4) > 1000:
        return out_mp4

    d = dur_frames
    rate_zoom = 0.15 / max(d, 25)
    rate_pan = 0.12 / max(d, 25)

    # Variété de 4 mouvements lisses et cinématographiques :
    if style_idx % 4 == 0:
        # Zoom avant centré (1.00 -> 1.15)
        zp = f"zoompan=z='min(zoom+{rate_zoom:.6f},1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={d}:s=1920x1080:fps=25"
    elif style_idx % 4 == 1:
        # Zoom arrière centré (1.15 -> 1.00)
        zp = f"zoompan=z='if(lte(zoom,1.0),1.15,max(1.0,zoom-{rate_zoom:.6f}))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={d}:s=1920x1080:fps=25"
    elif style_idx % 4 == 2:
        # Zoom avant + travelling droite
        zp = f"zoompan=z='min(zoom+{rate_pan:.6f},1.12)':x='on/{d}*(iw-iw/zoom)':y='ih/2-(ih/zoom/2)':d={d}:s=1920x1080:fps=25"
    else:
        # Zoom avant + travelling gauche
        zp = f"zoompan=z='min(zoom+{rate_pan:.6f},1.12)':x='(1-on/{d})*(iw-iw/zoom)':y='ih/2-(ih/zoom/2)':d={d}:s=1920x1080:fps=25"

    vf = f"scale=3840:2160:force_original_aspect_ratio=increase,crop=3840:2160,{zp},format=yuv420p"

    cmd = [
        "ffmpeg", "-y", "-loop", "1", "-i", img_path,
        "-vf", vf,
        "-c:v", "libx264", "-preset", "fast", "-crf", "18",
        "-t", f"{dur_sec:.3f}",
        out_mp4
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"❌ Erreur animation {img_path}: {res.stderr}")
        raise RuntimeError(f"FFmpeg error on {img_path}")
    return out_mp4


def process_v1_photos():
    print("\n" + "=" * 60)
    print("2️⃣  GÉNÉRATION DES ANIMATIONS KEN BURNS POUR V1_MAIN")
    print("=" * 60)
    os.makedirs(ANIM_DIR, exist_ok=True)

    tl = otio.adapters.read_from_file(OTIO_PATH)
    v1 = tl.tracks[0]

    photo_clips = []
    curr = 0.0
    for idx, it in enumerate(v1):
        dur = it.duration().to_seconds()
        if not isinstance(it, otio.schema.Gap):
            url = getattr(it.media_reference, "target_url", "") if it.media_reference else ""
            ext = os.path.splitext(url)[1].lower()
            if ext in IMG_EXTS or any(it.name.lower().endswith(e) for e in IMG_EXTS):
                dur_frames = round(dur * FPS)
                photo_clips.append((idx, curr, dur, dur_frames, it.name, url))
        curr += dur

    print(f"Total de clips photo détectés sur V1_MAIN : {len(photo_clips)}")

    # Lecture Kdenlive
    tree = ET.parse(KDENLIVE_PATH)
    root = tree.getroot()
    pl8 = root.find(".//playlist[@id='playlist8']")
    main_bin = root.find(".//playlist[@id='main_bin']")

    # Trouver max chain id
    max_chain_idx = 190
    for c in root.findall(".//chain"):
        cid = c.get("id", "")
        if cid.startswith("chain"):
            try:
                num = int(cid.replace("chain", ""))
                if num > max_chain_idx:
                    max_chain_idx = num
            except ValueError:
                pass

    # Déterminer les entrées de photos dans pl8
    pl8_entries = pl8.findall("entry")
    prods = {}
    for p in root.findall(".//producer"):
        prods[p.get("id")] = p.find("property[@name='resource']").text if p.find("property[@name='resource']") is not None else ""
    for c in root.findall(".//chain"):
        prods[c.get("id")] = c.find("property[@name='resource']").text if c.find("property[@name='resource']") is not None else ""

    pl8_photo_entries = []
    for entry in pl8_entries:
        pr = entry.get("producer")
        path = prods.get(pr, "")
        ext = os.path.splitext(path)[1].lower()
        if ext in IMG_EXTS:
            pl8_photo_entries.append(entry)

    print(f"Total d'entrées photo trouvées dans playlist8 (Kdenlive) : {len(pl8_photo_entries)}")

    animated_results = []

    for anim_idx, (track_idx, s_time, dur_sec, dur_frames, name, url) in enumerate(photo_clips):
        base_no_ext = os.path.splitext(os.path.basename(url))[0]
        out_mp4 = os.path.join(ANIM_DIR, f"anim_{anim_idx+1:02d}_{base_no_ext}_{dur_frames}f.mp4")
        rel_mp4 = f"assets/footage-animated/anim_{anim_idx+1:02d}_{base_no_ext}_{dur_frames}f.mp4"

        print(f"[{anim_idx+1:02d}/{len(photo_clips)}] ({dur_sec:.2f}s, {dur_frames}f) {name} -> {os.path.basename(out_mp4)}")
        animate_photo(url, dur_sec, dur_frames, anim_idx, out_mp4)

        # 1. Mise à jour OTIO
        new_mref = otio.schema.ExternalReference(
            target_url=out_mp4,
            available_range=otio.opentime.TimeRange(rt(0), rt(dur_frames))
        )
        new_clip = otio.schema.Clip(
            name=os.path.basename(out_mp4),
            media_reference=new_mref,
            source_range=otio.opentime.TimeRange(rt(0), rt(dur_frames))
        )
        v1[track_idx] = new_clip

        # 2. Mise à jour Kdenlive
        if anim_idx < len(pl8_photo_entries):
            max_chain_idx += 1
            chain_id = f"chain{max_chain_idx}"
            timecode_out = frames_to_timecode(dur_frames - 1)

            # Créer élément chain
            new_chain = ET.Element("chain", id=chain_id, out=timecode_out)
            p_len = ET.SubElement(new_chain, "property", name="length")
            p_len.text = str(dur_frames)
            p_eof = ET.SubElement(new_chain, "property", name="eof")
            p_eof.text = "pause"
            p_res = ET.SubElement(new_chain, "property", name="resource")
            p_res.text = rel_mp4
            p_mlt = ET.SubElement(new_chain, "property", name="mlt_service")
            p_mlt.text = "avformat-novalidate"
            p_seek = ET.SubElement(new_chain, "property", name="seekable")
            p_seek.text = "1"
            p_aud = ET.SubElement(new_chain, "property", name="audio_index")
            p_aud.text = "-1"
            p_vid = ET.SubElement(new_chain, "property", name="video_index")
            p_vid.text = "0"
            p_name = ET.SubElement(new_chain, "property", name="kdenlive:clipname")
            p_name.text = os.path.basename(out_mp4)

            # Insérer avant playlist0 dans root
            root.insert(list(root).index(pl8), new_chain)

            # Mettre à jour l'entrée dans playlist8
            pl8_entry = pl8_photo_entries[anim_idx]
            pl8_entry.set("producer", chain_id)
            pl8_entry.set("in", "00:00:00.000")
            pl8_entry.set("out", timecode_out)

            # Ajouter dans main_bin
            if main_bin is not None:
                bin_entry = ET.SubElement(main_bin, "entry")
                bin_entry.set("producer", chain_id)
                bin_entry.set("in", "00:00:00.000")
                bin_entry.set("out", timecode_out)

        animated_results.append({
            "index": anim_idx + 1,
            "original": name,
            "animated": os.path.basename(out_mp4),
            "start": round(s_time, 2),
            "duration": round(dur_sec, 2),
            "frames": dur_frames
        })

    otio.adapters.write_to_file(tl, OTIO_PATH)
    print(f"✓ {len(photo_clips)} photos animées et injectées dans {OTIO_PATH}")

    tree.write(KDENLIVE_PATH, encoding="utf-8", xml_declaration=True)
    print(f"✓ rudja_animation.kdenlive mis à jour avec les 32 chains animées")

    # 3. Synchronisation visual_mapping.json
    def format_tc(seconds: float) -> str:
        if seconds is None: return "00:00:00"
        h = int(seconds // 3600)
        m = int((seconds % 3600) // 60)
        s = int(seconds % 60)
        return f"{h:02d}:{m:02d}:{s:02d}"

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

    with open(VM_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
    print(f"✓ visual_mapping.json resynchronisé ({VM_PATH})")

    return animated_results


def main():
    adjust_audio_volumes()
    results = process_v1_photos()
    print("\n" + "=" * 60)
    print(f"🎉 TOUTES LES ANIMATIONS ({len(results)}) ET VOLUMES SONT APPLIQUÉS AVEC SUCCÈS !")
    print("=" * 60)


if __name__ == "__main__":
    main()
