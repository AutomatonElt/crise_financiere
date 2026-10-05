#!/usr/bin/env python3
"""
scripts/fix_kdenlive_chains.py
------------------------------
Corrige la structure MLT / Kdenlive de rudja_animation.kdenlive :
1. Déplace les chaînes chain191..chain222 juste après chain190 (avant les playlists).
2. Ajoute à chaque chaîne :
   - kdenlive:folderid = -1
   - kdenlive:id = 301..332
   - kdenlive:control_uuid = {UUID}
   - kdenlive:clip_type = 0
   - kdenlive:file_size = taille du fichier
   - kdenlive:file_hash = md5
   - métadonnées vidéo (1920x1080, h264, 25fps)
3. Dans playlist8 (V1_MAIN) :
   - Associe chaque entrée à sa chaîne chain191..chain222
   - Met à jour la propriété kdenlive:id vers 301..332 (correspondant exactement au bin clip !)
4. Dans main_bin :
   - Assure que chaque chaîne chain191..chain222 a son entrée propre.
"""

import os
import sys
import uuid
import hashlib
import xml.etree.ElementTree as ET

BASE_DIR = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp"
EPISODE_DIR = os.path.join(BASE_DIR, "episodes/01-ruja-ignatova")
KDENLIVE_PATH = os.path.join(EPISODE_DIR, "rudja_animation.kdenlive")
BACKUP_PATH = os.path.join(EPISODE_DIR, "rudja_animation.kdenlive.bak")
ANIM_DIR = os.path.join(EPISODE_DIR, "assets/footage-animated")

FPS = 25.0


def frames_to_timecode(frames: int) -> str:
    total_sec = frames / FPS
    h = int(total_sec // 3600)
    m = int((total_sec % 3600) // 60)
    s = int(total_sec % 60)
    ms = int(round((total_sec - int(total_sec)) * 1000))
    return f"{h:02d}:{m:02d}:{s:02d}.{ms:03d}"


def get_file_hash_and_size(filepath):
    if not os.path.exists(filepath):
        return "0", 0
    fsize = os.path.getsize(filepath)
    hasher = hashlib.md5()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest(), fsize


def main():
    print("🔧 Correction de rudja_animation.kdenlive...")
    tree = ET.parse(KDENLIVE_PATH)
    root = tree.getroot()

    # Sauvegarde
    tree.write(BACKUP_PATH, encoding="utf-8", xml_declaration=True)
    print(f"Sauvegarde créée : {BACKUP_PATH}")

    # 1. Identifier et retirer les chaînes chain191..chain222 où qu'elles soient
    anim_chains = {}
    for elem in list(root):
        eid = elem.get("id", "")
        if elem.tag == "chain" and eid.startswith("chain") and eid[5:].isdigit():
            num = int(eid[5:])
            if 191 <= num <= 222:
                anim_chains[num] = elem
                root.remove(elem)

    # 2. Trouver l'index de chain190 pour insérer juste après
    idx_190 = -1
    for idx, elem in enumerate(root):
        if elem.tag == "chain" and elem.get("id") == "chain190":
            idx_190 = idx
            break

    if idx_190 == -1:
        # Chercher le premier playlist
        for idx, elem in enumerate(root):
            if elem.tag == "playlist":
                idx_190 = idx - 1
                break

    insert_pos = idx_190 + 1
    print(f"Position d'insertion des chaînes : {insert_pos}")

    # Liste triée des fichiers animés
    anim_files = sorted([f for f in os.listdir(ANIM_DIR) if f.startswith("anim_") and f.endswith(".mp4")])
    assert len(anim_files) == 32, f"Expected 32 animated files, got {len(anim_files)}"

    # 3. Créer ou reconstruire les chaînes avec métadonnées Kdenlive complètes
    chain_mapping = {}
    for i in range(32):
        chain_num = 191 + i
        chain_id = f"chain{chain_num}"
        kid = 301 + i
        mp4_fname = anim_files[i]
        mp4_full = os.path.join(ANIM_DIR, mp4_fname)
        mp4_rel = f"assets/footage-animated/{mp4_fname}"
        
        # Extraire dur_frames du nom (ex: anim_01_..._75f.mp4)
        dur_frames = int(mp4_fname.rsplit("_", 1)[1].replace("f.mp4", ""))
        tc_out = frames_to_timecode(dur_frames - 1)
        md5_hash, fsize = get_file_hash_and_size(mp4_full)
        clip_uuid = f"{{{uuid.uuid4()}}}"

        # Construire l'élément chain Kdenlive complet
        c = ET.Element("chain", id=chain_id, out=tc_out)
        
        props = [
            ("length", str(dur_frames)),
            ("eof", "pause"),
            ("resource", mp4_rel),
            ("mlt_service", "avformat-novalidate"),
            ("seekable", "1"),
            ("format", "3"),
            ("audio_index", "-1"),
            ("video_index", "0"),
            ("mute_on_pause", "0"),
            ("meta.media.nb_streams", "1"),
            ("meta.media.0.stream.type", "video"),
            ("meta.media.0.stream.frame_rate", "25"),
            ("meta.media.0.codec.width", "1920"),
            ("meta.media.0.codec.height", "1080"),
            ("meta.media.0.codec.name", "h264"),
            ("meta.media.width", "1920"),
            ("meta.media.height", "1080"),
            ("kdenlive:clipname", mp4_fname),
            ("kdenlive:folderid", "-1"),
            ("kdenlive:id", str(kid)),
            ("kdenlive:control_uuid", clip_uuid),
            ("kdenlive:clip_type", "0"),
            ("kdenlive:file_size", str(fsize)),
            ("kdenlive:file_hash", md5_hash),
        ]
        for pname, pval in props:
            p = ET.SubElement(c, "property", name=pname)
            p.text = pval

        root.insert(insert_pos + i, c)
        chain_mapping[i] = {
            "chain_id": chain_id,
            "kid": str(kid),
            "tc_out": tc_out,
            "frames": dur_frames,
            "fname": mp4_fname,
            "uuid": clip_uuid
        }

    # 4. Mettre à jour playlist8 (V1_MAIN)
    pl8 = root.find(".//playlist[@id='playlist8']")
    entries_p1 = [e for e in pl8.findall("entry") if e.get("producer") in [f"chain{191+k}" for k in range(32)] or e.get("producer") in [f"producer{k}" for k in range(1, 22)]]
    print(f"Entrées photo cibles dans playlist8 : {len(entries_p1)}")

    for i, entry in enumerate(entries_p1):
        if i >= 32: break
        info = chain_mapping[i]
        entry.set("producer", info["chain_id"])
        entry.set("in", "00:00:00.000")
        entry.set("out", info["tc_out"])
        
        # Mettre à jour kdenlive:id
        kid_p = entry.find("property[@name='kdenlive:id']")
        if kid_p is None:
            kid_p = ET.SubElement(entry, "property", name="kdenlive:id")
        kid_p.text = info["kid"]

    # 5. Mettre à jour main_bin
    main_bin = root.find(".//playlist[@id='main_bin']")
    if main_bin is not None:
        # Nettoyer les entrées existantes pour chain191..chain222
        for e in list(main_bin.findall("entry")):
            pr = e.get("producer", "")
            if pr.startswith("chain") and pr[5:].isdigit() and 191 <= int(pr[5:]) <= 222:
                main_bin.remove(e)

        # Ajouter proprement les 32 chaînes dans main_bin
        for i in range(32):
            info = chain_mapping[i]
            be = ET.SubElement(main_bin, "entry")
            be.set("producer", info["chain_id"])
            be.set("in", "00:00:00.000")
            be.set("out", info["tc_out"])

    tree.write(KDENLIVE_PATH, encoding="utf-8", xml_declaration=True)
    print("✓ rudja_animation.kdenlive corrigé avec succès !")


if __name__ == "__main__":
    main()
