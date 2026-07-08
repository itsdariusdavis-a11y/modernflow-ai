#!/usr/bin/env python3
"""Static Ad Generator - Phase 3: Image generation via FAL API.

Reads prompts.json from a brand folder, uploads product reference images to
FAL storage, fires each prompt at ChatGPT Images 2.0 (openai/gpt-image-2),
downloads the results into organized output folders, and builds an HTML
gallery.

Usage (from the repository root):

    export FAL_KEY="your-key-here"
    python .claude/skills/static-ad-generator/references/generate_ads.py --brand brands/acme
    python .claude/skills/static-ad-generator/references/generate_ads.py --brand brands/acme --templates 1,7,13
    python .claude/skills/static-ad-generator/references/generate_ads.py --brand brands/acme --quality medium --variations 3

Requires: pip install requests
"""

import argparse
import html
import json
import mimetypes
import os
import re
import sys
import time
from pathlib import Path

try:
    import requests
except ImportError:
    sys.exit("Missing dependency: pip install requests")

FAL_RUN_BASE = "https://fal.run"
FAL_UPLOAD_INITIATE = "https://rest.alpha.fal.ai/storage/upload/initiate?storage_type=fal-cdn-v3"
TEXT_TO_IMAGE_ENDPOINT = "openai/gpt-image-2"
EDIT_ENDPOINT = "openai/gpt-image-2/edit"

# aspect_ratio -> explicit image_size. All dimensions are multiples of 16
# (gpt-image-2 requirement), max edge 3840px.
ASPECT_RATIO_SIZES = {
    "1:1": {"width": 1024, "height": 1024},
    "4:5": {"width": 1024, "height": 1280},
    "5:4": {"width": 1280, "height": 1024},
    "9:16": {"width": 720, "height": 1280},
    "16:9": {"width": 1280, "height": 720},
    "3:4": {"width": 960, "height": 1280},
    "4:3": {"width": 1280, "height": 960},
    "2:3": {"width": 848, "height": 1280},
    "3:2": {"width": 1280, "height": 848},
}
DEFAULT_SIZE = ASPECT_RATIO_SIZES["1:1"]

PRODUCT_IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}
REQUEST_TIMEOUT = 600  # generation at high quality can take a couple minutes
MAX_RETRIES = 3


def fal_key():
    key = os.environ.get("FAL_KEY", "").strip()
    if not key:
        sys.exit(
            "FAL_KEY is not set. Get a key at https://fal.ai/dashboard/keys and run:\n"
            '  export FAL_KEY="your-key-here"'
        )
    return key


def auth_headers():
    return {"Authorization": f"Key {fal_key()}"}


def slugify(name):
    return re.sub(r"[^a-z0-9]+", "-", str(name).lower()).strip("-") or "template"


def upload_product_images(brand_dir):
    """Upload every image in product-images/ to FAL storage; return public URLs."""
    images_dir = brand_dir / "product-images"
    if not images_dir.is_dir():
        return []
    files = sorted(
        p for p in images_dir.iterdir()
        if p.is_file() and p.suffix.lower() in PRODUCT_IMAGE_EXTENSIONS
    )
    urls = []
    for path in files:
        content_type = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        print(f"  Uploading {path.name} ...", flush=True)
        init = requests.post(
            FAL_UPLOAD_INITIATE,
            headers={**auth_headers(), "Content-Type": "application/json"},
            json={"file_name": path.name, "content_type": content_type},
            timeout=60,
        )
        init.raise_for_status()
        info = init.json()
        put = requests.put(
            info["upload_url"],
            data=path.read_bytes(),
            headers={"Content-Type": content_type},
            timeout=300,
        )
        put.raise_for_status()
        urls.append(info["file_url"])
    return urls


def call_fal(endpoint, payload):
    """Synchronous POST to fal.run with retry + backoff."""
    url = f"{FAL_RUN_BASE}/{endpoint}"
    last_error = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = requests.post(
                url,
                headers={**auth_headers(), "Content-Type": "application/json"},
                json=payload,
                timeout=REQUEST_TIMEOUT,
            )
            if resp.status_code in (429, 500, 502, 503, 504):
                raise requests.HTTPError(f"HTTP {resp.status_code}: {resp.text[:300]}")
            resp.raise_for_status()
            return resp.json()
        except (requests.ConnectionError, requests.Timeout, requests.HTTPError) as err:
            last_error = err
            if attempt < MAX_RETRIES:
                wait = 5 * (2 ** (attempt - 1))
                print(f"    Attempt {attempt} failed ({err}); retrying in {wait}s ...", flush=True)
                time.sleep(wait)
    raise RuntimeError(f"FAL request failed after {MAX_RETRIES} attempts: {last_error}")


def extract_image_urls(result):
    images = result.get("images") or []
    urls = []
    for img in images:
        url = img.get("url") if isinstance(img, dict) else img
        if url:
            urls.append(url)
    if not urls and result.get("image", {}).get("url"):
        urls.append(result["image"]["url"])
    return urls


def download(url, dest):
    resp = requests.get(url, timeout=300)
    resp.raise_for_status()
    dest.write_bytes(resp.content)


def build_gallery(brand_dir, brand_name, entries):
    cards = []
    for entry in entries:
        images_html = "".join(
            f'<a href="{html.escape(rel)}" target="_blank">'
            f'<img src="{html.escape(rel)}" loading="lazy" alt="{html.escape(entry["name"])}"></a>'
            for rel in entry["images"]
        )
        status = "" if entry["images"] else '<p class="failed">generation failed</p>'
        cards.append(
            f'<section class="card"><h2>{entry["number"]:02d} — {html.escape(entry["name"])}'
            f' <span class="meta">{html.escape(entry["aspect_ratio"])}'
            f'{" · product ref" if entry["needs_product_images"] else ""}</span></h2>'
            f'<div class="imgs">{images_html}</div>{status}'
            f'<details><summary>Prompt</summary><pre>{html.escape(entry["prompt"])}</pre></details>'
            f"</section>"
        )
    page = f"""<!doctype html>
<html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(brand_name)} — Generated Ads</title>
<style>
  body {{ font-family: -apple-system, system-ui, sans-serif; margin: 2rem auto; max-width: 1100px; padding: 0 1rem; background:#fafafa; color:#111; }}
  h1 {{ margin-bottom: .25rem; }}
  .card {{ background:#fff; border:1px solid #e5e5e5; border-radius:12px; padding:1rem 1.25rem; margin:1.25rem 0; }}
  .meta {{ font-size:.75rem; color:#888; font-weight:400; }}
  .imgs {{ display:flex; flex-wrap:wrap; gap:.75rem; }}
  .imgs img {{ max-width:320px; width:100%; height:auto; border-radius:8px; border:1px solid #eee; }}
  details {{ margin-top:.75rem; }}
  pre {{ white-space:pre-wrap; font-size:.75rem; background:#f5f5f5; padding: .75rem; border-radius:8px; overflow-x:auto; }}
  .failed {{ color:#b00; font-size:.85rem; }}
</style></head><body>
<h1>{html.escape(brand_name)} — Generated Static Ads</h1>
<p>{len(entries)} templates rendered. Click any image to open full size.</p>
{"".join(cards)}
</body></html>
"""
    gallery = brand_dir / "outputs" / "index.html"
    gallery.parent.mkdir(parents=True, exist_ok=True)
    gallery.write_text(page, encoding="utf-8")
    return gallery


def main():
    parser = argparse.ArgumentParser(description="Generate static ads via ChatGPT Images 2.0 on FAL")
    parser.add_argument("--brand", required=True, help="Path to the brand folder (contains prompts.json)")
    parser.add_argument("--templates", help="Comma-separated template numbers to run, e.g. 1,7,13")
    parser.add_argument("--quality", choices=["low", "medium", "high"], default="high")
    parser.add_argument("--variations", type=int, default=1, help="Images per prompt (1-4)")
    args = parser.parse_args()

    brand_dir = Path(args.brand).resolve()
    prompts_file = brand_dir / "prompts.json"
    if not prompts_file.is_file():
        sys.exit(f"prompts.json not found in {brand_dir}. Run Phase 2 first.")

    fal_key()  # fail fast if the key is missing

    data = json.loads(prompts_file.read_text(encoding="utf-8"))
    brand_name = data.get("brand", brand_dir.name)
    prompts = data.get("prompts", [])

    selected = None
    if args.templates:
        selected = {int(n) for n in args.templates.split(",") if n.strip()}
        prompts = [p for p in prompts if p.get("template_number") in selected]
    if not prompts:
        sys.exit("No prompts matched. Check --templates against prompts.json.")

    needs_refs = any(p.get("needs_product_images") for p in prompts)
    product_urls = []
    if needs_refs:
        print(f"Uploading product images for {brand_name} ...")
        product_urls = upload_product_images(brand_dir)
        if not product_urls:
            print(
                "  WARNING: no images found in product-images/. "
                "Product-reference templates will fall back to text-to-image."
            )

    num_images = max(1, min(args.variations, 4))
    entries, succeeded, failed = [], 0, 0
    total = len(prompts)

    for i, item in enumerate(prompts, 1):
        number = item.get("template_number", i)
        name = slugify(item.get("template_name", f"template-{number}"))
        prompt = item.get("prompt", "").strip()
        aspect = item.get("aspect_ratio", "1:1")
        image_size = ASPECT_RATIO_SIZES.get(aspect, DEFAULT_SIZE)
        use_edit = bool(item.get("needs_product_images")) and bool(product_urls)

        out_dir = brand_dir / "outputs" / f"{number:02d}-{name}"
        out_dir.mkdir(parents=True, exist_ok=True)
        (out_dir / "prompt.txt").write_text(prompt + "\n", encoding="utf-8")

        endpoint = EDIT_ENDPOINT if use_edit else TEXT_TO_IMAGE_ENDPOINT
        payload = {
            "prompt": prompt,
            "image_size": image_size,
            "quality": args.quality,
            "num_images": num_images,
            "output_format": "png",
        }
        if use_edit:
            payload["image_urls"] = product_urls

        mode = "edit+refs" if use_edit else "text-to-image"
        print(f"[{i}/{total}] #{number:02d} {name} ({aspect}, {mode}, {args.quality}) ...", flush=True)

        saved = []
        try:
            result = call_fal(endpoint, payload)
            urls = extract_image_urls(result)
            if not urls:
                raise RuntimeError(f"No images in response: {json.dumps(result)[:300]}")
            for v, url in enumerate(urls, 1):
                dest = out_dir / f"{name}_v{v}.png"
                download(url, dest)
                saved.append(str(dest.relative_to(brand_dir / "outputs")))
            succeeded += 1
            print(f"    Saved {len(saved)} image(s) -> {out_dir.relative_to(brand_dir)}")
        except Exception as err:  # keep the batch going; report at the end
            failed += 1
            print(f"    FAILED: {err}", flush=True)

        entries.append({
            "number": number,
            "name": name,
            "prompt": prompt,
            "aspect_ratio": aspect,
            "needs_product_images": bool(item.get("needs_product_images")),
            "images": saved,
        })

    gallery = build_gallery(brand_dir, brand_name, entries)
    print(f"\nDone: {succeeded} succeeded, {failed} failed out of {total} templates.")
    print(f"Gallery: {gallery}")
    if failed:
        rerun = ",".join(str(e["number"]) for e in entries if not e["images"])
        print(f"Re-run failures with: --templates {rerun}")
        sys.exit(1)


if __name__ == "__main__":
    main()
