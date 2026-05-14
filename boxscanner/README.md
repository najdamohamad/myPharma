# Box Scanner

Process medicine photos into standardized transparent PNG cutouts for the MyPharma app.

## Setup

```bash
pip install -r medicine-cutouts/requirements.txt
pip install -r medicine-images/requirements.txt   # for image scraper
```

## Fetch images from the web (optional)

To find candidate images for a medicine without taking your own photos:

```bash
# From mypharma root:
npm run fetch-images -- Paracetamol

# Or manually:
python boxscanner/medicine-images/fetch_medicine_images.py "Ibuprofène" -o boxscanner/raw -v
```

This uses DuckDuckGo image search, downloads candidates, scores them by size and aspect ratio, and saves the best 3 to `boxscanner/raw` as `{medicine}_candidate_1.jpg`, `_2.jpg`, `_3.jpg`. Then run `npm run process-cutouts` to create cutouts.

## Usage

Process raw medicine photos and output cutouts to the app's assets:

```bash
# From mypharma root:
npm run process-cutouts

# Or manually:
python boxscanner/medicine-cutouts/process_cutouts.py \
  --input boxscanner/raw \
  --output assets/images/medicines \
  --size 768 1024 \
  --target_width_ratio 0.8
```

### Arguments

| Argument | Required | Default | Description |
|----------|----------|---------|-------------|
| `--input` | Yes | - | Input directory (or file) with raw jpg/png |
| `--output` | Yes | - | Output directory for processed PNGs |
| `--size` | No | 768 1024 | Canvas size (width height) |
| `--target_width_ratio` | No | 0.8 | Object width as fraction of canvas width |
| `--name-pattern` | No | `{stem}_cutout` | Output filename pattern (`{stem}` = input stem) |

### Behavior

For each image:

1. Remove background (rembg)
2. Normalize to portrait canvas with transparency
3. Object is horizontally centered, bottom-aligned (~6% bottom margin)
4. Scaled so bbox width ≈ 80% of canvas
5. Save as `{stem}_cutout.png` (or custom pattern) in output/
6. Save debug images in `output/_debug/`
