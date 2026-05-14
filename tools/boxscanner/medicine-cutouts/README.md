# Medicine Cutouts

Process medicine photos into standardized transparent PNG cutouts for mobile app display.

## Setup

```bash
pip install -r requirements.txt
```

## Usage

```bash
python process_cutouts.py --input input --output output --size 768 1024 --target_width_ratio 0.8
```

### Arguments

| Argument | Required | Default | Description |
|----------|----------|---------|-------------|
| `--input` | Yes | - | Input directory (or file) with raw jpg/png |
| `--output` | Yes | - | Output directory for processed PNGs |
| `--size` | No | 768 1024 | Canvas size (width height) |
| `--target_width_ratio` | No | 0.8 | Object width as fraction of canvas width |

### Behavior

For each image:

1. Remove background (rembg)
2. Normalize to portrait canvas with transparency
3. Object is horizontally centered, bottom-aligned (~6% bottom margin)
4. Scaled so bbox width ≈ 80% of canvas
5. Save as `{stem}_cutout.png` in output/
6. Save debug images in `output/_debug/`:
   - `{stem}_1_original.png`
   - `{stem}_2_bg_removed.png`
   - `{stem}_3_canvas.png`

### Log per file

- original size
- bbox size
- final scale factor
- output path
