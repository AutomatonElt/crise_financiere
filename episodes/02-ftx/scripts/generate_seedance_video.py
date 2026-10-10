#!/usr/bin/env python3
"""
Génération de vidéo Seedance via l'API SnapGen pour Financial Forensics.
Supporte le modèle sd-2-5-lower (Seedance 2.5 Lower 720p).
"""

import os
import sys
import time
import argparse
import requests
from pathlib import Path
from dotenv import load_dotenv

WORKSPACE_ROOT = Path(__file__).resolve().parents[3]
ENV_FILE = WORKSPACE_ROOT / ".env"
load_dotenv(ENV_FILE)

SNAPGEN_API_KEY = os.getenv("SNAPGEN_API_KEY")
if not SNAPGEN_API_KEY:
    print("[-] Erreur: SNAPGEN_API_KEY introuvable dans .env")
    sys.exit(1)

API_ENDPOINT = "https://api.snapgen.ai/uapi/v1/video-gen/seedance"
HISTORY_ENDPOINT = "https://api.snapgen.ai/uapi/v1/history"
HEADERS = {"x-api-key": SNAPGEN_API_KEY}


def generate_seedance_video(
    prompt: str,
    output_path: str,
    ref_images: list = None,
    model: str = "sd-2-5-lower",
    mode: str = "lower",
    duration: int = 5,
    aspect_ratio: str = "16:9",
    timeout: int = 900,
):
    output_file = Path(output_path).resolve()
    output_file.parent.mkdir(parents=True, exist_ok=True)

    print(f"[+] Soumission de la tâche de génération vidéo à SnapGen API...")
    print(f"    Modèle: {model} | Mode: {mode} | Durée: {duration}s | Ratio: {aspect_ratio}")
    print(f"    Prompt: {prompt[:120]}...")

    data = {
        "prompt": prompt,
        "model": model,
        "mode": mode,
        "duration": str(duration),
        "aspect_ratio": aspect_ratio,
    }

    files = []
    opened_files = []
    if ref_images:
        for img_path in ref_images:
            p = Path(img_path).resolve()
            if p.exists():
                print(f"    Image de référence: {p.name} ({p.stat().st_size:,} octets)")
                f = open(p, "rb")
                opened_files.append(f)
                files.append(("ref_images", (p.name, f, "image/jpeg")))
            else:
                print(f"[!] Fichier de référence introuvable: {img_path}")

    try:
        if files:
            resp = requests.post(API_ENDPOINT, headers=HEADERS, data=data, files=files, timeout=60)
        else:
            resp = requests.post(API_ENDPOINT, headers=HEADERS, data=data, timeout=60)
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
    print(f"[+] Tâche créée ! ID: {task_id}, UUID: {uuid}, Statut initial: {status}")

    # Polling pour le résultat
    poll_url = f"{HISTORY_ENDPOINT}/{uuid}"
    start_time = time.time()

    print("[+] En attente de la fin de la génération vidéo...")
    while time.time() - start_time < timeout:
        time.sleep(6)
        try:
            poll_resp = requests.get(poll_url, headers=HEADERS, timeout=30)
            if poll_resp.status_code != 200:
                print(f"[!] Polling code {poll_resp.status_code}, réessai...")
                continue

            poll_data = poll_resp.json()
            curr_status = poll_data.get("status")
            pct = poll_data.get("status_percentage", 0)
            elapsed = int(time.time() - start_time)

            print(f"    Progression: {pct}% (Statut: {curr_status}, écoulé: {elapsed}s)")

            if curr_status == 2:  # Completed
                # Chercher l'URL de téléchargement
                video_url = None
                gen_video = poll_data.get("generated_video") or poll_data.get("generated_media")
                if isinstance(gen_video, list) and len(gen_video) > 0:
                    video_url = gen_video[0].get("file_download_url") or gen_video[0].get("video_url")
                elif isinstance(gen_video, dict):
                    video_url = gen_video.get("file_download_url") or gen_video.get("video_url")

                if not video_url:
                    video_url = poll_data.get("file_download_url") or poll_data.get("generate_result")

                if not video_url:
                    print(f"[-] Tâche terminée mais aucune URL de vidéo trouvée: {poll_data}")
                    return False

                print(f"[+] Génération réussie ! Téléchargement de la vidéo depuis {video_url}...")
                dl_resp = requests.get(video_url, timeout=120)
                if dl_resp.status_code == 200:
                    with open(output_file, "wb") as out_f:
                        out_f.write(dl_resp.content)
                    print(f"[✓] Vidéo sauvegardée avec succès: {output_file} ({len(dl_resp.content):,} octets)")
                    return True
                else:
                    print(f"[-] Échec du téléchargement HTTP {dl_resp.status_code}")
                    return False

            elif curr_status == 3:  # Failed
                err_msg = poll_data.get("error_message") or poll_data.get("error_code")
                print(f"[-] La génération a échoué: {err_msg}")
                return False

        except Exception as e:
            print(f"[!] Exception pendant le polling: {e}")

    print("[-] Timeout dépassé avant la fin de la génération.")
    return False


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Générer une vidéo Seedance via SnapGen API")
    parser.add_argument("--prompt", required=True, help="Prompt textuel")
    parser.add_argument("--out", required=True, help="Chemin du fichier vidéo MP4 de sortie")
    parser.add_argument("--ref", action="append", default=[], help="Image de référence")
    parser.add_argument("--duration", type=int, default=5, help="Durée en secondes (5, 10, 15)")
    parser.add_argument("--model", default="sd-2-5-lower", help="Modèle Seedance")
    parser.add_argument("--mode", default="lower", help="Mode de génération")
    args = parser.parse_args()

    success = generate_seedance_video(
        prompt=args.prompt,
        output_path=args.out,
        ref_images=args.ref,
        model=args.model,
        mode=args.mode,
        duration=args.duration,
    )
    sys.exit(0 if success else 1)
