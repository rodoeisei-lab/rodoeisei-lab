#!/usr/bin/env python3
"""Loss-aware image optimization helper for static assets."""

from __future__ import annotations

from pathlib import Path

ASSET_DIR = Path("assets/images")
TARGET_EXTS = {".png", ".jpg", ".jpeg", ".webp"}


def optimize_with_pillow() -> int:
    try:
        from PIL import Image
    except Exception:
        print("⚠️ Pillow is not available; skipping raster optimization.")
        return 0

    optimized = 0
    for path in sorted(ASSET_DIR.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in TARGET_EXTS:
            continue

        original_bytes = path.read_bytes()
        before = len(original_bytes)

        with Image.open(path) as img:
            save_kwargs = {"optimize": True}
            if path.suffix.lower() in {".jpg", ".jpeg"}:
                save_kwargs["quality"] = 85
                save_kwargs["progressive"] = True
            img.save(path, **save_kwargs)

        after = path.stat().st_size
        if after <= before:
            optimized += 1
        else:
            # Keep quality-first behavior if optimization worsens size.
            path.write_bytes(original_bytes)

    print(f"✅ Image optimization completed. optimized_files={optimized}")
    return 0


def main() -> int:
    if not ASSET_DIR.exists():
        print(f"⚠️ {ASSET_DIR} not found; skipping optimization.")
        return 0
    return optimize_with_pillow()


if __name__ == "__main__":
    raise SystemExit(main())
