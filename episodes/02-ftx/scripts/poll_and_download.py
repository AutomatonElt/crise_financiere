#!/usr/bin/env python3
"""
Surveillance et téléchargement d'une vidéo SnapGen en cours.
"""

import os
import sys
import time
import requests
from pathlib import Path
from dotenv import load_dotenv

WORKSPACE_ROOT = Path(__file__).resolve().parents[3]
ENV_FILE = WORKSPACE_ROOT / ".env"
load_dotenv(ENV_FILE)

SNAPGEN_API_KEY = os.getenv("SNAPGEN_API_KEY")
HEADERS = {"x-api-key": SNAPGEN_API_KEY}
HISTORY_ENDPOINT = "https://api.snapgen.ai/uapi/v1/history"


def poll_and_download(uuid: str, output_path: str, max_minutes: int = 20):
    output_file = Path(output_path).resolve()
    output_file.parent.mkdir(parents=True, exist_ok=True)

    poll_url = f"{HISTORY_ENDPOINT}/{uuid}"
    start_time = time.time()
    timeout = max_minutes * 60

    print(f"[+] Surveillance de la tâche {uuid} (max {max_minutes} min)...")

    while time.time() - start_time < timeout:
        time.sleep(10)
        try:
            resp = requests.get(poll_url, headers=HEADERS, timeout=30)
            if resp.status_code != 200:
                print(f"[!] Erreur polling HTTP {resp.status_code}")
                continue

            data = resp.json()
            status = data.get("status")
            pct = data.get("status_percentage", 0)
            elapsed = int(time.time() - start_time)

            print(f"    [{elapsed}s] Statut: {status} | Progression: {pct}%")

            if status == 2:  # Completed
                video_url = None
                gen_video = data.get("generated_video", [])
                if gen_video and len(gen_video) > 0:
                    video_url = gen_video[0].get("video_url") or gen_video[0].get("file_download_url")

                if not video_url:
                    video_url = data.get("file_download_url") or data.get("generate_result")

                if not video_url:
                    print(f"[-] Statut terminé mais aucune URL trouvée dans la réponse: {data}")
                    return False

                print(f"[+] Vidéo prête ! Téléchargement depuis {video_url}...")
                dl = requests.get(video_url, timeout=180)
                if dl.status_code == 200:
                    with open(output_file, "wb") as f:
                        f.write(dl.content)
                    print(f"[✓] SUCCÈS ! Vidéo enregistrée dans {output_file} ({len(dl.content):,} octets)")
                    return True
                else:
                    print(f"[-] Erreur de téléchargement HTTP {dl.status_code}")
                    return False

            elif status == 3:  # Failed
                err = data.get("error_message") or data.get("error_code")
                print(f"[-] La génération a échoué: {err}")
                return False

        except Exception as e:
            print(f"[!] Exception polling: {e}")

    print("[-] Timeout dépassé.")
    return False


if __name__ == "__main__":
    uuid = sys.argv[1] if len(sys.argv) > 1 else "7e14f16a-c166-11f1-a746-b6d250aca0bb"
    out = sys.argv[2] if len(sys.argv) > 2 else "episodes/02-ftx/assets/generated-videos/H01_take1.mp4"
    success = poll_and_download(uuid, out, max_minutes=25)
    sys.exit(0 if success else 1)
