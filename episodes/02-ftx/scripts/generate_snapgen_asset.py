#!/usr/bin/env python3
"""
Snapgen Image Asset Generator for Financial Forensics
Uses Snapgen API (Nano Banana Pro / Gemini Image) to generate consistent 16:9 cinematic documentary plates.
Includes robust retry logic and error resilience.
"""

import os
import sys
import time
import argparse
import requests
from pathlib import Path
from dotenv import load_dotenv

# Load .env from workspace root
WORKSPACE_ROOT = Path(__file__).resolve().parents[3]
ENV_FILE = WORKSPACE_ROOT / ".env"
load_dotenv(ENV_FILE)

SNAPGEN_API_KEY = os.getenv("SNAPGEN_API_KEY")
if not SNAPGEN_API_KEY:
    print("[-] Error: SNAPGEN_API_KEY not found in .env")
    sys.exit(1)

API_BASE = "https://api.snapgen.ai/uapi/v1"
HEADERS = {"x-api-key": SNAPGEN_API_KEY}


def safe_request(method, url, max_retries=5, **kwargs):
    """Wrapper around requests with automatic retry on timeout or connection error."""
    for attempt in range(1, max_retries + 1):
        try:
            if method.lower() == "post":
                return requests.post(url, **kwargs)
            else:
                return requests.get(url, **kwargs)
        except (requests.exceptions.RequestException, Exception) as e:
            if attempt == max_retries:
                print(f"[-] Network error after {max_retries} attempts: {e}")
                raise
            wait_sec = attempt * 4
            print(f"[!] Network warning on attempt {attempt}: {e}. Retrying in {wait_sec}s...")
            time.sleep(wait_sec)


def generate_image(prompt: str, output_path: str, model: str = "nano-banana-pro",
                   aspect_ratio: str = "16:9", resolution: str = "1K",
                   style: str = "None", ref_files: list = None, timeout: int = 240):
    output_file = Path(output_path).resolve()
    output_file.parent.mkdir(parents=True, exist_ok=True)

    print(f"[+] Submitting generation task to Snapgen API...")
    print(f"    Model: {model} | Aspect Ratio: {aspect_ratio} | Resolution: {resolution}")
    print(f"    Prompt: {prompt[:120]}...")

    url = f"{API_BASE}/generate_image"
    data = {
        "prompt": prompt,
        "model": model,
        "aspect_ratio": aspect_ratio,
        "resolution": resolution,
    }
    if style and style != "None":
        data["style"] = style

    files_payload = []
    opened_files = []
    if ref_files:
        for rf in ref_files:
            rf_path = Path(rf).resolve()
            if rf_path.exists():
                f = open(rf_path, "rb")
                opened_files.append(f)
                files_payload.append(("files", (rf_path.name, f, "image/jpeg")))
            else:
                print(f"[!] Warning: reference file {rf} not found.")

    try:
        if files_payload:
            resp = safe_request("post", url, headers=HEADERS, data=data, files=files_payload, timeout=60)
        else:
            resp = safe_request("post", url, headers=HEADERS, data=data, timeout=60)
    finally:
        for f in opened_files:
            f.close()

    if not resp or resp.status_code != 200:
        msg = resp.text if resp else "No response"
        print(f"[-] API submission failed with HTTP {getattr(resp, 'status_code', 'ERR')}: {msg}")
        return False

    res_json = resp.json()
    uuid = res_json.get("uuid")
    task_id = res_json.get("id")
    if not uuid:
        print(f"[-] No UUID returned: {res_json}")
        return False

    print(f"[+] Task created successfully (ID: {task_id}, UUID: {uuid}). Polling for result...")

    poll_url = f"{API_BASE}/history/{uuid}"
    start_time = time.time()

    while time.time() - start_time < timeout:
        time.sleep(5)
        try:
            poll_resp = safe_request("get", poll_url, headers=HEADERS, timeout=30)
            if not poll_resp or poll_resp.status_code != 200:
                continue

            poll_data = poll_resp.json()
            status = poll_data.get("status")
            pct = poll_data.get("status_percentage", 0)

            if status == 2:  # Completed
                gen_images = poll_data.get("generated_image", [])
                image_url = None
                if gen_images:
                    image_url = gen_images[0].get("image_url") or gen_images[0].get("file_download_url")

                if not image_url:
                    image_url = poll_data.get("generate_result")

                if not image_url:
                    print("[-] Status completed but image URL is missing.")
                    return False

                print(f"[+] Generation succeeded! Downloading image...")
                dl_resp = safe_request("get", image_url, timeout=120)
                if dl_resp and dl_resp.status_code == 200:
                    with open(output_file, "wb") as f:
                        f.write(dl_resp.content)
                    print(f"[✓] Successfully saved asset to: {output_file} ({len(dl_resp.content):,} bytes)")
                    return True
                else:
                    print(f"[-] Failed to download image from {image_url}")
                    return False

            elif status == 3:  # Failed
                err = poll_data.get("error_message") or "Unknown error"
                print(f"[-] Generation failed on Snapgen: {err}")
                return False
            else:
                elapsed = int(time.time() - start_time)
                print(f"    Generating... ({elapsed}s elapsed, progress: {pct}%)")

        except Exception as e:
            print(f"[!] Polling warning: {e}")

    print(f"[-] Timeout reached ({timeout}s) waiting for generation.")
    return False


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate image using Snapgen API")
    parser.add_argument("--prompt", required=True, help="Image prompt")
    parser.add_argument("--output", required=True, help="Output image file path")
    parser.add_argument("--model", default="nano-banana-pro", help="Model name")
    parser.add_argument("--aspect_ratio", default="16:9", help="Aspect ratio (16:9, 1:1, etc.)")
    parser.add_argument("--resolution", default="1K", help="Resolution (1K, 2K, 4K)")
    parser.add_argument("--style", default="None", help="Artistic style")
    parser.add_argument("--ref", action="append", help="Reference image paths")

    args = parser.parse_args()
    success = generate_image(
        prompt=args.prompt,
        output_path=args.output,
        model=args.model,
        aspect_ratio=args.aspect_ratio,
        resolution=args.resolution,
        style=args.style,
        ref_files=args.ref
    )
    sys.exit(0 if success else 1)
