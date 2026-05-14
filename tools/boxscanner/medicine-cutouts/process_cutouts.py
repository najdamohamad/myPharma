#!/usr/bin/env python3
"""
Process medicine photos into standardized transparent PNG cutouts for mobile app.
"""

import argparse
import sys
from pathlib import Path

from PIL import Image
from rembg import remove


SUPPORTED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}
PADDING_RATIO = 0.02  # 2% safety padding around bbox
BOTTOM_MARGIN_RATIO = 0.06


def gather_images(input_dir: Path) -> list[Path]:
    """Recursively gather image paths."""
    files = []
    for p in input_dir.rglob("*"):
        if p.is_file() and p.suffix.lower() in SUPPORTED_EXTENSIONS:
            files.append(p)
    return sorted(files)


def get_bbox_from_alpha(img: Image.Image) -> tuple[int, int, int, int] | None:
    """Get bounding box of non-transparent pixels. Returns (x1, y1, x2, y2) or None."""
    if img.mode != "RGBA":
        return None
    alpha = img.split()[3]
    bbox = alpha.getbbox()
    return bbox


def process_image(
    input_path: Path,
    output_dir: Path,
    canvas_w: int,
    canvas_h: int,
    target_width_ratio: float,
) -> None:
    """Process one image: remove bg, normalize to canvas, save cutout and debug."""
    output_dir.mkdir(parents=True, exist_ok=True)
    debug_dir = output_dir / "_debug"
    debug_dir.mkdir(parents=True, exist_ok=True)

    stem = input_path.stem
    cutout_path = output_dir / f"{stem}_cutout.png"
    debug_orig = debug_dir / f"{stem}_1_original.png"
    debug_raw = debug_dir / f"{stem}_2_bg_removed.png"
    debug_final = debug_dir / f"{stem}_3_canvas.png"

    # Load original
    img = Image.open(input_path).convert("RGB")
    orig_w, orig_h = img.size

    # Debug: save original
    img.save(debug_orig)

    # Remove background
    img_rgba = remove(img)
    img_rgba.save(debug_raw)

    # Bounding box with padding
    bbox = get_bbox_from_alpha(img_rgba)
    if bbox is None:
        print(f"{input_path}: no transparent pixels, skipping", file=sys.stderr)
        return

    x1, y1, x2, y2 = bbox
    bbox_w, bbox_h = x2 - x1, y2 - y1
    padding = int(max(bbox_w, bbox_h) * PADDING_RATIO)
    x1 = max(0, x1 - padding)
    y1 = max(0, y1 - padding)
    x2 = min(img_rgba.width, x2 + padding)
    y2 = min(img_rgba.height, y2 + padding)
    padded_w = x2 - x1
    padded_h = y2 - y1

    target_width = int(canvas_w * target_width_ratio)
    scale = target_width / padded_w
    new_w = int(padded_w * scale)
    new_h = int(padded_h * scale)

    cropped = img_rgba.crop((x1, y1, x2, y2))
    resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)

    # Canvas: 768x1024, transparent, bottom-aligned with 6% margin
    canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    bottom_margin = int(canvas_h * BOTTOM_MARGIN_RATIO)
    paste_x = (canvas_w - new_w) // 2
    paste_y = canvas_h - bottom_margin - new_h
    canvas.paste(resized, (paste_x, paste_y), resized)

    canvas.save(cutout_path)
    canvas.save(debug_final)

    print(
        f"{input_path}: original={orig_w}x{orig_h} bbox={bbox_w}x{bbox_h} "
        f"scale={scale:.4f} output={cutout_path}"
    )


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Process medicine photos into standardized transparent PNG cutouts.",
    )
    parser.add_argument(
        "--input",
        required=True,
        type=Path,
        help="Input directory with raw jpg/png",
    )
    parser.add_argument(
        "--output",
        required=True,
        type=Path,
        help="Output directory for processed png",
    )
    parser.add_argument(
        "--size",
        nargs=2,
        type=int,
        default=[768, 1024],
        metavar=("W", "H"),
        help="Canvas size W H (default: 768 1024)",
    )
    parser.add_argument(
        "--target_width_ratio",
        type=float,
        default=0.8,
        help="Target bbox width as fraction of canvas width (default: 0.8)",
    )
    args = parser.parse_args()

    if not args.input.exists():
        print(f"--input does not exist: {args.input}", file=sys.stderr)
        sys.exit(1)

    args.input = args.input.resolve()
    args.output = args.output.resolve()
    canvas_w, canvas_h = args.size

    if args.input.is_file():
        files = [args.input] if args.input.suffix.lower() in SUPPORTED_EXTENSIONS else []
    else:
        files = gather_images(args.input)

    if not files:
        print("No images found.", file=sys.stderr)
        sys.exit(1)

    for path in files:
        try:
            process_image(
                path,
                args.output,
                canvas_w,
                canvas_h,
                args.target_width_ratio,
            )
        except Exception as e:
            print(f"{path}: error: {e}", file=sys.stderr)


if __name__ == "__main__":
    main()
