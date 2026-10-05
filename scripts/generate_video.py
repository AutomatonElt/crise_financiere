"""
Génère des vidéos via SnapGenAI (Kling 3.0 ou Grok) à partir de prompts texte,
avec option d'image-to-video pour cohérence visuelle.

Usage:
    python generate_video.py --jobs jobs.json
    python generate_video.py --prompt "..." --out video.mp4 --provider grok
    python generate_video.py --prompt "..." --ref-image path/to/image.png --out video.mp4 --provider grok
    python generate_video.py --extend <uuid> --prompt "Continue..." --out video_ext.mp4

Nécessite dans .env :
    SNAPGEN_API_KEY=sk_...
"""

import os
import sys
import json
import time
import argparse
import requests
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

API_KEY = os.environ.get("SNAPGEN_API_KEY")
if not API_KEY:
    raise SystemExit("SNAPGEN_API_KEY doit être défini dans .env")

BASE_URL = "https://api.snapgen.ai/uapi/v1"
HEADERS = {"x-api-key": API_KEY}

# Status codes from API docs: 0=pending, 1=processing, 2=completed, 3=error
STATUS_PENDING = 0
STATUS_PROCESSING = 1
STATUS_COMPLETED = 2
STATUS_ERROR = 3

POLL_INTERVAL = 10  # seconds between status checks
MAX_POLL_TIME = 600  # 10 minutes max


# Provider configs
PROVIDERS = {
    "kling": {
        "endpoint": "/video-gen/kling",
        "model": "kling-video-3-0",
        "mode": "professional",
        "aspect_ratio": "16:9",
        "durations": [3, 4, 5, 6, 7, 8, 9, 10, 15],
        "ref_image_key": "ref_images",
    },
    "grok": {
        "endpoint": "/video-gen/grok",
        "model": "grok-3",
        "mode": "custom",
        "aspect_ratio": "landscape",
        "durations": [6, 10, 15],
        "ref_image_key": "files",
        "extra_fields": {"resolution": "720p", "skip_audio": "true"},
    },
}


def submit_video(prompt, provider="kling", model=None, mode=None,
                 aspect_ratio=None, duration=5, ref_image=None, resolution=None):
    """Submit a video generation request. Returns the response JSON."""
    cfg = PROVIDERS.get(provider, PROVIDERS["kling"])
    
    # Resolve params with provider defaults
    model = model or cfg["model"]
    mode = mode or cfg["mode"]
    aspect_ratio = aspect_ratio or cfg["aspect_ratio"]
    
    data = {
        "prompt": prompt,
        "model": model,
        "mode": mode,
        "aspect_ratio": aspect_ratio,
        "duration": str(duration),
    }
    
    # Add provider-specific fields
    if "extra_fields" in cfg:
        for k, v in cfg["extra_fields"].items():
            data[k] = v
    if resolution and provider == "grok":
        data["resolution"] = resolution

    files = {}
    try:
        if ref_image and os.path.exists(ref_image):
            files[cfg["ref_image_key"]] = open(ref_image, "rb")

        print(f"Soumission ({provider}): {prompt[:80]}...")
        if ref_image:
            print(f"  Image ref: {ref_image}")
        print(f"  Model: {model}, Mode: {mode}, AR: {aspect_ratio}, Duration: {duration}s")
        if provider == "grok":
            print(f"  Resolution: {data.get('resolution', '480p')}, Skip audio: {data.get('skip_audio')}")

        response = requests.post(
            f"{BASE_URL}{cfg['endpoint']}",
            headers=HEADERS,
            data=data,
            files=files if files else None,
        )

        if response.status_code != 200:
            print(f"Erreur {response.status_code}: {response.text}")
            return None

        result = response.json()
        print(f"  -> id={result.get('id')}, uuid={result.get('uuid')}, "
              f"status={result.get('status')}, "
              f"credits={result.get('estimated_credit')}")
        return result

    finally:
        for f in files.values():
            f.close()


def extend_video(uuid, prompt, provider="grok"):
    """Extend an existing video using its last frame as reference."""
    endpoint = f"/video-extend/{provider}"
    
    print(f"Extension ({provider}) de {uuid}...")
    print(f"  Prompt: {prompt[:80]}...")
    
    response = requests.post(
        f"{BASE_URL}{endpoint}",
        headers=HEADERS,
        data={"prompt": prompt, "ref_history": uuid},
    )
    
    if response.status_code != 200:
        print(f"Erreur {response.status_code}: {response.text}")
        return None
    
    result = response.json()
    print(f"  -> id={result.get('id')}, uuid={result.get('uuid')}, "
          f"status={result.get('status')}, "
          f"credits={result.get('estimated_credit')}")
    return result


def poll_status(uuid):
    """Poll generation status until completed or error. Returns final response JSON."""
    print(f"\nPolling {uuid}...")
    elapsed = 0

    while elapsed < MAX_POLL_TIME:
        response = requests.get(
            f"{BASE_URL}/history/{uuid}",
            headers=HEADERS,
        )

        if response.status_code != 200:
            print(f"  Erreur poll {response.status_code}: {response.text}")
            time.sleep(POLL_INTERVAL)
            elapsed += POLL_INTERVAL
            continue

        result = response.json()
        status = result.get("status")
        pct = result.get("status_percentage", 0)

        # Status can be int or string depending on endpoint
        if isinstance(status, str):
            status_lower = status.lower()
            if status_lower in ("completed", "2"):
                status = STATUS_COMPLETED
            elif status_lower in ("error", "3"):
                status = STATUS_ERROR
            elif status_lower in ("processing", "1"):
                status = STATUS_PROCESSING
            else:
                status = STATUS_PENDING

        if status == STATUS_COMPLETED:
            print(f"  -> Completed ({pct}%)")
            return result
        elif status == STATUS_ERROR:
            error_msg = result.get("error_message", "Unknown error")
            print(f"  -> Error: {error_msg}")
            return result
        else:
            print(f"  -> Status: {status} ({pct}%) - {elapsed}s elapsed")
            time.sleep(POLL_INTERVAL)
            elapsed += POLL_INTERVAL

    print(f"  -> Timeout after {MAX_POLL_TIME}s")
    return None


def download_video(url, output_path):
    """Download video from URL to local file."""
    print(f"Téléchargement: {url}")
    response = requests.get(url, stream=True)
    if response.status_code != 200:
        print(f"Erreur download {response.status_code}")
        return False

    total = int(response.headers.get("content-length", 0))
    downloaded = 0
    with open(output_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
            downloaded += len(chunk)
            if total > 0:
                pct = (downloaded / total) * 100
                print(f"\r  {pct:.1f}% ({downloaded // 1024}KB / {total // 1024}KB)",
                      end="", flush=True)
    print(f"\n  -> Saved: {output_path} ({downloaded // 1024}KB)")
    return True


def extract_video_url(result):
    """Extract video URL from completed response."""
    # Primary: generated_video array (SnapGenAI/Kling format)
    generated_videos = result.get("generated_video", [])
    if generated_videos:
        for v in generated_videos:
            if isinstance(v, dict):
                url = v.get("video_url") or v.get("url") or v.get("file_url")
                if url:
                    return url
            elif isinstance(v, str) and v.startswith("http"):
                return v

    # Fallback: media_files
    media_files = result.get("media_files", [])
    if media_files:
        for media in media_files:
            if isinstance(media, dict):
                url = media.get("url") or media.get("video_url") or media.get("file_url")
                if url:
                    return url
            elif isinstance(media, str) and media.startswith("http"):
                return media

    # Fallback: check for response field or video_url
    url = result.get("response") or result.get("video_url") or result.get("url")
    if url and isinstance(url, str) and url.startswith("http"):
        return url

    # Fallback: check media_urls
    media_urls = result.get("media_urls", [])
    if media_urls and isinstance(media_urls, list):
        for u in media_urls:
            if isinstance(u, str) and u.startswith("http"):
                return u

    return None


def process_job(job):
    """Process a single video generation job.
    
    Job format:
    {
        "prompt": "...",
        "out": "path/to/video.mp4",
        "provider": "grok",                # "kling" or "grok" (default: kling)
        "model": "grok-3",                 # optional, overrides provider default
        "mode": "custom",                  # optional
        "aspect_ratio": "landscape",        # optional
        "duration": 6,                      # optional (kling: 3-15, grok: 6/10/15)
        "resolution": "720p",              # optional (grok only: 480p/720p)
        "ref_image": "path/to/image.png"   # optional
    }
    """
    prompt = job["prompt"]
    out_path = job["out"]
    provider = job.get("provider", "kling")
    model = job.get("model")
    mode = job.get("mode")
    aspect_ratio = job.get("aspect_ratio")
    duration = job.get("duration", 5)
    resolution = job.get("resolution")
    ref_image = job.get("ref_image")

    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)

    # Submit
    submit_result = submit_video(
        prompt=prompt,
        provider=provider,
        model=model,
        mode=mode,
        aspect_ratio=aspect_ratio,
        duration=duration,
        ref_image=ref_image,
        resolution=resolution,
    )

    if not submit_result:
        print(f"Échec soumission pour {out_path}")
        return False

    uuid = submit_result.get("uuid")
    if not uuid:
        print(f"Pas d'UUID dans la réponse: {submit_result}")
        return False

    # Poll
    final_result = poll_status(uuid)
    if not final_result:
        print(f"Échec polling pour {out_path}")
        return False

    # Extract URL
    video_url = extract_video_url(final_result)
    if not video_url:
        print(f"Pas d'URL vidéo dans la réponse finale:")
        print(json.dumps(final_result, indent=2, ensure_ascii=False))
        return False

    # Download
    return download_video(video_url, out_path)


def main():
    parser = argparse.ArgumentParser(
        description="Génère des vidéos via SnapGenAI (Kling ou Grok)"
    )
    parser.add_argument(
        "--jobs", help="Fichier JSON contenant la liste des jobs à générer",
    )
    parser.add_argument("--prompt", help="Prompt texte pour une seule vidéo")
    parser.add_argument("--out", help="Chemin de sortie pour une seule vidéo")
    parser.add_argument("--ref-image", help="Image de référence (image-to-video)")
    parser.add_argument("--provider", default="kling", choices=["kling", "grok"],
                        help="Provider: kling ou grok (default: kling)")
    parser.add_argument("--model", default=None, help="Modèle (override provider default)")
    parser.add_argument("--mode", default=None, help="Mode (kling: professional, grok: custom)")
    parser.add_argument("--aspect-ratio", default=None,
                        help="Ratio (kling: 16:9, grok: landscape)")
    parser.add_argument("--duration", type=int, default=None,
                        help="Durée (kling: 3-15, grok: 6/10/15)")
    parser.add_argument("--resolution", default=None, choices=["480p", "720p"],
                        help="Résolution (grok only)")
    parser.add_argument("--extend", default=None,
                        help="UUID d'une vidéo existante à étendre (grok only)")
    args = parser.parse_args()

    # Extend mode
    if args.extend and args.prompt:
        extend_result = extend_video(args.extend, args.prompt, provider=args.provider)
        if not extend_result:
            sys.exit(1)
        uuid = extend_result.get("uuid")
        if not uuid:
            print(f"Pas d'UUID: {extend_result}")
            sys.exit(1)
        final_result = poll_status(uuid)
        if not final_result:
            sys.exit(1)
        video_url = extract_video_url(final_result)
        if not video_url:
            print(json.dumps(final_result, indent=2, ensure_ascii=False))
            sys.exit(1)
        download_video(video_url, args.out or "extended_video.mp4")
        return

    # Resolve defaults from provider
    cfg = PROVIDERS.get(args.provider, PROVIDERS["kling"])
    duration = args.duration or (6 if args.provider == "grok" else 5)

    if args.jobs:
        with open(args.jobs, "r", encoding="utf-8") as f:
            jobs = json.load(f)

        print(f"{len(jobs)} vidéo(s) à générer\n")
        results = []
        for i, job in enumerate(jobs):
            print(f"\n{'='*60}")
            print(f"[{i+1}/{len(jobs)}] {job['out']}")
            print(f"{'='*60}")
            success = process_job(job)
            results.append({"out": job["out"], "success": success})

        print(f"\n{'='*60}")
        print("Récapitulatif:")
        for r in results:
            status = "✅" if r["success"] else "❌"
            print(f"  {status} {r['out']}")

    elif args.prompt and args.out:
        job = {
            "prompt": args.prompt,
            "out": args.out,
            "provider": args.provider,
            "duration": duration,
        }
        if args.model:
            job["model"] = args.model
        if args.mode:
            job["mode"] = args.mode
        if args.aspect_ratio:
            job["aspect_ratio"] = args.aspect_ratio
        if args.resolution:
            job["resolution"] = args.resolution
        if args.ref_image:
            job["ref_image"] = args.ref_image

        process_job(job)

    else:
        parser.print_help()
        print("\nExemples:")
        print('  python generate_video.py --jobs video-jobs.json')
        print('  python generate_video.py --prompt "A woman..." --out video.mp4 --provider grok --duration 6')
        print('  python generate_video.py --prompt "..." --ref-image img.png --out vid.mp4 --provider grok')
        print('  python generate_video.py --extend <uuid> --prompt "Continue..." --out vid_ext.mp4 --provider grok')


if __name__ == "__main__":
    main()
