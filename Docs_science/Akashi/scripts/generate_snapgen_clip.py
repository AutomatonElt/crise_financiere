#!/usr/bin/env python3
"""
Génération de vidéos SnapGen pour le projet Akashi:
- Supporte Seedance 2.5 lower (sd-2-5-lower, mode: lower)
- Supporte Veo 3.1 Fast / Gemini (veo-3.1-fast, mode_image: frame)
- Gère l'upload d'images de référence (ref_images)
- Polling automatique et téléchargement du MP4
"""

import os
import sys
import time
import argparse
import requests
from pathlib import Path
from dotenv import load_dotenv

ENV_PATH = Path("/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/.env")
load_dotenv(ENV_PATH)

SNAPGEN_API_KEY = os.getenv("SNAPGEN_API_KEY")
if not SNAPGEN_API_KEY:
    print("[-] Erreur: SNAPGEN_API_KEY introuvable dans .env")
    sys.exit(1)

HEADERS = {"x-api-key": SNAPGEN_API_KEY}
HISTORY_ENDPOINT = "https://api.snapgen.ai/uapi/v1/history"


def generate_video(
    prompt: str,
    output_path: str,
    model: str = "sd-2-5-lower",
    ref_image: str = None,
    duration: int = 5,
    aspect_ratio: str = "16:9",
    timeout: int = 900
):
    output_file = Path(output_path).resolve()
    output_file.parent.mkdir(parents=True, exist_ok=True)

    print(f"\n==========================================")
    print(f"[+] Démarrage de la génération vidéo SnapGen")
    print(f"    Modèle       : {model}")
    print(f"    Durée        : {duration}s")
    print(f"    Aspect Ratio : {aspect_ratio}")
    print(f"    Prompt       : {prompt[:100]}...")
    if ref_image:
        print(f"    Référence    : {ref_image}")
    print(f"==========================================\n")

    files = []
    opened_files = []

    if model.startswith("sd-") or "seedance" in model:
        endpoint = "https://api.snapgen.ai/uapi/v1/video-gen/seedance"
        data = {
            "prompt": prompt,
            "model": model,
            "mode": "lower",
            "duration": str(duration),
            "aspect_ratio": aspect_ratio,
        }
        if ref_image and Path(ref_image).exists():
            f = open(ref_image, "rb")
            opened_files.append(f)
            files.append(("ref_images", (Path(ref_image).name, f, "image/jpeg")))

    elif model.startswith("veo") or "gemini" in model:
        endpoint = "https://api.snapgen.ai/uapi/v1/video-gen/veo"
        actual_model = "veo-3.1-fast" if "fast" in model else ("veo-3.1" if "3.1" in model else "veo-2")
        data = {
            "prompt": prompt,
            "model": actual_model,
            "resolution": "720p",
            "duration": str(duration),
            "aspect_ratio": aspect_ratio,
            "mode_image": "frame"
        }
        if ref_image and Path(ref_image).exists():
            f = open(ref_image, "rb")
            opened_files.append(f)
            files.append(("ref_images", (Path(ref_image).name, f, "image/jpeg")))
    else:
        print(f"[-] Modèle non reconnu: {model}")
        return False

    try:
        print(f"[+] Envoi de la requête POST vers {endpoint}...")
        if files:
            resp = requests.post(endpoint, headers=HEADERS, data=data, files=files, timeout=60)
        else:
            resp = requests.post(endpoint, headers=HEADERS, data=data, timeout=60)
    finally:
        for f in opened_files:
            f.close()

    if resp.status_code != 200:
        print(f"[-] Erreur HTTP {resp.status_code}: {resp.text}")
        return False

    res_json = resp.json()
    task_id = res_json.get("id")
    uuid = res_json.get("uuid")
    status = res_json.get("status")
    credit = res_json.get("estimated_credit")
    print(f"[+] Requête acceptée ! Task ID: {task_id}, UUID: {uuid}, Crédits estimés: {credit}")

    poll_url = f"{HISTORY_ENDPOINT}/{uuid}"
    start_time = time.time()

    print("[+] Polling de la tâche en cours...")
    while time.time() - start_time < timeout:
        time.sleep(6)
        try:
            poll_resp = requests.get(poll_url, headers=HEADERS, timeout=30)
            if poll_resp.status_code != 200:
                print(f"[!] Polling HTTP {poll_resp.status_code}, nouvelle tentative...")
                continue

            poll_data = poll_resp.json()
            curr_status = poll_data.get("status")
            pct = poll_data.get("status_percentage", 0)
            elapsed = int(time.time() - start_time)

            print(f"    -> Progression: {pct}% (Statut: {curr_status}, temps: {elapsed}s)")

            if curr_status == 2:  # Succès
                video_url = None
                gen_video = poll_data.get("generated_video") or poll_data.get("generated_media")
                if isinstance(gen_video, list) and len(gen_video) > 0:
                    video_url = gen_video[0].get("file_download_url") or gen_video[0].get("video_url")
                elif isinstance(gen_video, dict):
                    video_url = gen_video.get("file_download_url") or gen_video.get("video_url")

                if not video_url:
                    video_url = poll_data.get("file_download_url") or poll_data.get("generate_result")

                if not video_url:
                    print(f"[-] Statut 2 mais aucune URL vidéo disponible: {poll_data}")
                    return False

                print(f"\n[+] Vidéo prête ! Téléchargement depuis {video_url}...")
                dl = requests.get(video_url, timeout=120)
                if dl.status_code == 200:
                    with open(output_file, "wb") as f:
                        f.write(dl.content)
                    print(f"[✓] Fichier vidéo enregistré dans : {output_file} ({len(dl.content):,} octets)\n")
                    return True
                else:
                    print(f"[-] Erreur de téléchargement: HTTP {dl.status_code}")
                    return False

            elif curr_status == 3:  # Échec
                err = poll_data.get("error_message") or poll_data.get("error_code")
                print(f"[-] Génération échouée: {err}")
                return False

        except Exception as e:
            print(f"[!] Exception polling: {e}")

    print("[-] Timeout dépassé.")
    return False


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Générer une vidéo SnapGen (Seedance ou Veo)")
    parser.add_argument("--prompt", required=True, help="Prompt textuel")
    parser.add_argument("--out", required=True, help="Chemin du fichier de sortie MP4")
    parser.add_argument("--model", default="sd-2-5-lower", choices=["sd-2-5-lower", "veo-3.1-fast", "veo-2"], help="Modèle à utiliser")
    parser.add_argument("--ref", default=None, help="Chemin d'une image de référence")
    parser.add_argument("--duration", type=int, default=5, help="Durée en secondes")
    args = parser.parse_args()

    ok = generate_video(
        prompt=args.prompt,
        output_path=args.out,
        model=args.model,
        ref_image=args.ref,
        duration=args.duration,
    )
    sys.exit(0 if ok else 1)
