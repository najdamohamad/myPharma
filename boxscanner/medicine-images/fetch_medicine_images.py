#!/usr/bin/env python3
"""
Fetch candidate images for a medicine from web image search.
Uses DuckDuckGo (via duckduckgo-search) and downloads with requests.
Outputs the 3 best candidates to boxscanner/raw for processing by process_cutouts.
"""

import argparse
import io
import re
import sys
import tempfile
from pathlib import Path

import requests
from PIL import Image

SUPPORTED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}
MIN_DIMENSION = 200
MIN_PIXELS = 150_000
IDEAL_ASPECT = 3 / 4  # Portrait box
ASPECT_TOLERANCE = 0.5
DOWNLOAD_TIMEOUT = 15
HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}


def _get_ddgs():
    try:
        from duckduckgo_search import DDGS
        return DDGS
    except ImportError:
        print(
            "Install dependencies: pip install -r boxscanner/medicine-images/requirements.txt",
            file=sys.stderr,
        )
        sys.exit(1)


def sanitize_name(name: str) -> str:
    """Make a safe filename from medicine name."""
    s = re.sub(r"[^\w\s-]", "", name)
    s = re.sub(r"[\s_]+", "_", s).strip("_")
    return s or "medicine"


def build_search_query(medicine_name: str) -> str:
    """Build a query to favor product/box photos."""
    return f"{medicine_name} medicine box product photo"


def score_image(path: Path) -> float | None:
    """
    Score an image for suitability as medicine box cutout.
    Higher = better. Returns None if image is invalid/too small.
    """
    try:
        with Image.open(path) as img:
            w, h = img.size
    except Exception:
        return None

    if w < MIN_DIMENSION or h < MIN_DIMENSION:
        return None
    if w * h < MIN_PIXELS:
        return None

    aspect = w / h
    aspect_diff = abs(aspect - IDEAL_ASPECT)
    aspect_score = max(0, 1 - aspect_diff / ASPECT_TOLERANCE)

    # Prefer larger images (more detail for rembg)
    size_score = min(1.0, (w * h) / (1200 * 1200))

    return 0.6 * aspect_score + 0.4 * size_score


def download_image(url: str, dest: Path) -> Path | None:
    """Download image from URL. Saves to dest with appropriate extension. Returns path on success, None on failure."""
    try:
        r = requests.get(url, timeout=DOWNLOAD_TIMEOUT, headers=HEADERS)
        r.raise_for_status()
        data = r.content
        if len(data) < 1024:
            return None
        img = Image.open(io.BytesIO(data))
        img.load()
        ext = ".jpg"
        fmt = img.format
        if fmt and fmt.lower() in ("png", "jpeg", "webp", "gif"):
            ext = f".{fmt.lower()}"
        final_path = dest.with_suffix(ext)
        with open(final_path, "wb") as f:
            f.write(data)
        return final_path
    except Exception:
        return None


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Fetch top 3 candidate images for a medicine from web image search.",
    )
    parser.add_argument(
        "medicine_name",
        type=str,
        help="Name of the medicine (e.g. Paracetamol, Ibuprofène)",
    )
    parser.add_argument(
        "--output",
        "-o",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "raw",
        help="Output directory (default: boxscanner/raw)",
    )
    parser.add_argument(
        "--download-limit",
        type=int,
        default=20,
        help="Max image URLs to try before picking top 3 (default: 20)",
    )
    parser.add_argument(
        "--verbose",
        "-v",
        action="store_true",
        help="Print extra info",
    )
    args = parser.parse_args()

    medicine = args.medicine_name.strip()
    if not medicine:
        print("Provide a medicine name.", file=sys.stderr)
        sys.exit(1)

    safe_name = sanitize_name(medicine)
    query = build_search_query(medicine)
    DDGS = _get_ddgs()

    if args.verbose:
        print(f"Searching: '{query}'", file=sys.stderr)

    # Collect image URLs from DuckDuckGo
    urls: list[str] = []
    try:
        with DDGS() as ddgs:
            for r in ddgs.images(query, max_results=args.download_limit):
                url = r.get("image")
                if url and isinstance(url, str) and url.startswith("http"):
                    urls.append(url)
    except Exception as e:
        print(f"Search failed: {e}", file=sys.stderr)
        sys.exit(1)

    if not urls:
        print("No image URLs found. Try a different medicine name or check your connection.", file=sys.stderr)
        sys.exit(1)

    if args.verbose:
        print(f"Found {len(urls)} URLs, downloading...", file=sys.stderr)

    candidates: list[tuple[float, Path]] = []
    with tempfile.TemporaryDirectory(prefix="med_images_") as tmpdir:
        tmp = Path(tmpdir)
        for i, url in enumerate(urls):
            saved = download_image(url, tmp / f"img_{i}")
            if saved and (score := score_image(saved)) is not None:
                candidates.append((score, saved))
                if args.verbose:
                    print(f"  Downloaded and scored: {saved.name}", file=sys.stderr)
            if len(candidates) >= 10:
                break

        if not candidates:
            print("No suitable images found. Try a different medicine name or check your connection.", file=sys.stderr)
            sys.exit(1)

        candidates.sort(key=lambda x: -x[0])
        top3 = candidates[:3]

        args.output.mkdir(parents=True, exist_ok=True)
        for i, (_, src) in enumerate(top3, 1):
            ext = src.suffix.lower()
            if ext == ".jpeg":
                ext = ".jpg"
            dest = args.output / f"{safe_name}_candidate_{i}{ext}"
            with open(src, "rb") as f_in, open(dest, "wb") as f_out:
                f_out.write(f_in.read())
            print(dest)

        if args.verbose:
            print(
                f"Saved 3 candidates to {args.output}. Run process-cutouts to create cutouts.",
                file=sys.stderr,
            )


if __name__ == "__main__":
    main()
