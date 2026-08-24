#!/usr/bin/env python3
"""Generate branded 1200x630 PNG cards for public articles.

Pillow and a Japanese TrueType/OpenType font are required. The font is supplied
at generation time so generated images can be committed without bundling a font.
Example:

    python3 scripts/assets/generate_og_images.py --font /path/to/NotoSansJP.ttf
"""

from __future__ import annotations

import argparse
import hashlib
from pathlib import Path
import re

from PIL import Image, ImageColor, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[2]
OUTPUT_DIR = ROOT / "assets" / "images" / "og" / "articles"
WIDTH = 1200
HEIGHT = 630

THEMES = {
    "measurement": ("#0F6CBD", "#DCEEFE", "#083B66"),
    "chemical": ("#07847A", "#D9F4EF", "#064E49"),
    "ventilation": ("#3157A4", "#E2EAFE", "#1E3568"),
    "exposure": ("#C45D35", "#FBE9E1", "#71351F"),
    "ai": ("#7356B8", "#EEE8FB", "#3E2C70"),
    "consultant": ("#A76A00", "#FFF1CF", "#684200"),
    "fit": ("#267A91", "#DDF2F6", "#164A59"),
    "roadmap": ("#3B6E4F", "#E3F2E8", "#23442F"),
    "general": ("#2563A8", "#E3EEFA", "#173C63"),
}

TITLE_LINES = {
    "ai-use-occupational-health-basics": [
        "生成AIを労働衛生で安全に使う方法",
        "実務・学習の確認手順",
    ],
    "chemical-management-basics": [
        "職場の化学物質管理とは？",
        "SDS確認から対策・見直しまで",
    ],
    "chemical-risk-assessment-basics": [
        "化学物質の",
        "リスクアセスメントとは？",
        "実施手順を解説",
    ],
    "chemical-substance-manager-ppe-manager": [
        "化学物質管理者と",
        "保護具着用管理責任者とは？",
        "選任要件・役割の違い",
    ],
    "create-simple-guide": [
        "CREATE-SIMPLEの使い方",
        "入力項目・結果の見方・注意点",
    ],
    "fit-test": ["フィットテスト導入の", "最小セット"],
    "hygiene-committee-agenda": [
        "衛生委員会の議題を",
        "現場改善につなげる方法",
    ],
    "local-exhaust-inspection": [
        "局所排気装置は、どの頻度で",
        "点検し、何を記録する？",
    ],
    "local-exhaust-ventilation-basics": [
        "局所排気装置とは？",
        "フード・ダクト・排風機の基本",
    ],
    "management-concentration-exposure-limits": [
        "管理濃度・濃度基準値・",
        "許容濃度の違い",
        "何と比較する数値か",
    ],
    "occupational-health-consultant-basics": [
        "労働衛生コンサルタントとは？",
        "試験・受験資格・登録の全体像",
    ],
    "organic-solvent-basics": [
        "有機溶剤中毒予防規則の基本",
        "SDS確認から現場管理まで",
    ],
    "operator-skill-expansion-roadmap": [
        "運営者スキル拡充ロードマップ",
        "Jekyll・SEO・外部連携",
    ],
    "personal-exposure-measurement-basics": [
        "個人ばく露測定とは？",
        "目的・進め方と作業環境測定との関係",
    ],
    "sds-reading": [
        "SDSの読み方",
        "実務で確認したい項目",
    ],
    "skin-hazard-chemicals-protective-gloves": [
        "皮膚等障害化学物質等とは？",
        "化学防護手袋の選び方・使い方",
    ],
    "third-control-class": [
        "第3管理区分になったら？",
        "原因確認から改善・再測定まで",
    ],
    "work-environment-measurement-design-sampling": [
        "作業環境測定の",
        "デザイン・サンプリング",
        "測定計画の全体像",
    ],
    "work-environment-measurement-design": [
        "作業環境測定のデザインとは？",
        "測定点とA・B・C・D測定を整理",
    ],
    "work-environment-measurement-sampling": [
        "作業環境測定のサンプリングとは？",
        "物質の状態から捕集方法を考える",
    ],
}


def parse_front_matter(path: Path) -> dict[str, str]:
    lines = path.read_text(encoding="utf-8").splitlines()
    if not lines or lines[0].strip() != "---":
        return {}

    values: dict[str, str] = {}
    for line in lines[1:]:
        if line.strip() == "---":
            break
        match = re.match(r"^([A-Za-z0-9_]+):\s*(.*?)\s*$", line)
        if not match:
            continue
        key, value = match.groups()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
            value = value[1:-1]
        values[key] = value
    return values


def public_articles() -> list[tuple[Path, dict[str, str]]]:
    candidates = sorted((ROOT / "_guides").glob("*.md"))
    candidates.extend(sorted((ROOT / "pages" / "qa").glob("*.md")))
    articles: list[tuple[Path, dict[str, str]]] = []
    for path in candidates:
        meta = parse_front_matter(path)
        if meta.get("layout") == "article" and meta.get("status") == "published":
            articles.append((path, meta))
    return articles


def article_theme(path: Path, meta: dict[str, str]) -> str:
    slug = path.stem
    category = meta.get("category", "")
    if slug == "operator-skill-expansion-roadmap":
        return "roadmap"
    if slug == "fit-test":
        return "fit"
    if "化学物質" in category:
        return "chemical"
    if "局所排気" in category:
        return "ventilation"
    if "個人ばく露" in category:
        return "exposure"
    if "AI" in category:
        return "ai"
    if "コンサルタント" in category:
        return "consultant"
    if "作業環境測定" in category or "work-environment" in slug or "work-env" in slug:
        return "measurement"
    return "general"


def display_category(path: Path, meta: dict[str, str]) -> str:
    category = meta.get("category") or "労働衛生"
    if category != "Guides":
        return category
    return {
        "fit-test": "呼吸用保護具",
        "operator-skill-expansion-roadmap": "サイト運営",
        "work-env-measurement-intro": "作業環境測定",
    }.get(path.stem, "実務ガイド")


def blend_color(foreground: str, background: str, ratio: float) -> tuple[int, int, int]:
    fg = ImageColor.getrgb(foreground)
    bg = ImageColor.getrgb(background)
    return tuple(round(fg[index] * ratio + bg[index] * (1 - ratio)) for index in range(3))


def load_font(path: Path, size: int, weight: int) -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(str(path), size=size)
    try:
        font.set_variation_by_axes([weight])
    except (AttributeError, OSError, ValueError):
        pass
    return font


def text_width(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont) -> float:
    box = draw.textbbox((0, 0), text, font=font)
    return box[2] - box[0]


def wrap_title(
    draw: ImageDraw.ImageDraw,
    title: str,
    font: ImageFont.FreeTypeFont,
    max_width: int,
) -> list[str]:
    tokens = re.findall(r"[A-Za-z0-9][A-Za-z0-9.+/_・-]*|.", title)
    lines: list[str] = []
    current = ""
    closing = set("、。！？）」』】｜")
    for token in tokens:
        candidate = current + token
        if current and text_width(draw, candidate, font) > max_width:
            if token in closing:
                current = candidate
                continue
            lines.append(current)
            current = token
        else:
            current = candidate
    if current:
        lines.append(current)
    return lines


def title_layout(
    draw: ImageDraw.ImageDraw,
    title: str,
    font_path: Path,
    slug: str,
) -> tuple[ImageFont.FreeTypeFont, list[str], int]:
    for size in (62, 58, 54, 50, 46, 42):
        font = load_font(font_path, size, 700)
        lines = TITLE_LINES.get(slug) or wrap_title(draw, title, font, 720)
        line_height = round(size * 1.35)
        if (
            len(lines) <= 3
            and len(lines) * line_height <= 250
            and all(text_width(draw, line, font) <= 720 for line in lines)
        ):
            return font, lines, line_height
    raise ValueError(f"Title is too long for the OGP card: {title}")


def draw_measurement_icon(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], accent: str, dark: str) -> None:
    x1, y1, x2, y2 = box
    for row in range(3):
        for col in range(3):
            x = x1 + 52 + col * 92
            y = y1 + 55 + row * 88
            draw.ellipse((x - 12, y - 12, x + 12, y + 12), fill=accent)
    draw.rectangle((x1 + 25, y1 + 25, x2 - 25, y2 - 25), outline=dark, width=8)
    draw.line((x1 + 52, y1 + 55, x2 - 52, y2 - 55), fill=dark, width=7)
    draw.line((x2 - 72, y2 - 100, x2 - 40, y2 - 55, x2 - 92, y2 - 64), fill=dark, width=7, joint="curve")


def draw_chemical_icon(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], accent: str, dark: str) -> None:
    x1, y1, x2, y2 = box
    cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
    points = []
    for angle in range(0, 360, 60):
        import math

        rad = math.radians(angle - 30)
        points.append((cx + int(105 * math.cos(rad)), cy + int(105 * math.sin(rad))))
    draw.polygon(points, outline=dark, width=9)
    nodes = [points[0], points[2], points[4], (cx, cy)]
    for px, py in nodes:
        draw.ellipse((px - 18, py - 18, px + 18, py + 18), fill=accent)
    draw.line((points[0], (cx, cy), points[2]), fill=dark, width=8)
    draw.line(((cx, cy), points[4]), fill=dark, width=8)


def draw_ventilation_icon(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], accent: str, dark: str) -> None:
    x1, y1, x2, y2 = box
    draw.polygon(
        [(x1 + 35, y1 + 45), (x2 - 80, y1 + 45), (x2 - 125, y1 + 135), (x1 + 35, y1 + 135)],
        outline=dark,
        fill=None,
    )
    draw.line((x2 - 82, y1 + 88, x2 - 38, y1 + 88, x2 - 38, y2 - 55), fill=dark, width=14)
    draw.ellipse((x2 - 105, y2 - 122, x2 + 10, y2 - 7), outline=dark, width=9)
    for offset in (0, 54, 108):
        y = y1 + 185 + offset
        draw.arc((x1 + 15, y - 28, x1 + 185, y + 28), 200, 340, fill=accent, width=10)
        draw.line((x1 + 155, y - 10, x1 + 184, y, x1 + 158, y + 16), fill=accent, width=8, joint="curve")


def draw_exposure_icon(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], accent: str, dark: str) -> None:
    x1, y1, x2, y2 = box
    cx = (x1 + x2) // 2
    draw.ellipse((cx - 60, y1 + 35, cx + 60, y1 + 155), outline=dark, width=10)
    draw.arc((cx - 135, y1 + 145, cx + 135, y2 + 30), 190, 350, fill=dark, width=12)
    zone = (cx + 55, y1 + 90)
    for radius in (35, 65, 95):
        draw.arc((zone[0] - radius, zone[1] - radius, zone[0] + radius, zone[1] + radius), 290, 70, fill=accent, width=8)


def draw_ai_icon(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], accent: str, dark: str) -> None:
    x1, y1, x2, y2 = box
    nodes = [
        (x1 + 55, y1 + 70),
        (x2 - 60, y1 + 45),
        (x1 + 90, y2 - 55),
        (x2 - 45, y2 - 70),
        ((x1 + x2) // 2, (y1 + y2) // 2),
    ]
    for start, end in ((0, 4), (1, 4), (2, 4), (3, 4), (0, 2), (1, 3)):
        draw.line((nodes[start], nodes[end]), fill=dark, width=7)
    for index, (x, y) in enumerate(nodes):
        radius = 28 if index == 4 else 18
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=accent, outline=dark, width=5)


def draw_consultant_icon(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], accent: str, dark: str) -> None:
    x1, y1, x2, y2 = box
    draw.rounded_rectangle((x1 + 55, y1 + 20, x2 - 55, y2 - 20), radius=16, outline=dark, width=9)
    for offset in (70, 125, 180):
        draw.line((x1 + 90, y1 + offset, x2 - 90, y1 + offset), fill=accent, width=8)
    draw.line((x1 + 105, y2 - 90, x1 + 145, y2 - 48, x2 - 90, y2 - 125), fill=dark, width=12, joint="curve")


def draw_fit_icon(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], accent: str, dark: str) -> None:
    x1, y1, x2, y2 = box
    cx = (x1 + x2) // 2
    draw.ellipse((cx - 95, y1 + 20, cx + 95, y2 - 15), outline=dark, width=10)
    draw.polygon(
        [(cx - 72, y1 + 130), (cx, y1 + 90), (cx + 72, y1 + 130), (cx + 55, y2 - 65), (cx - 55, y2 - 65)],
        fill=accent,
        outline=dark,
    )
    draw.line((cx - 72, y1 + 140, cx - 118, y1 + 115), fill=dark, width=8)
    draw.line((cx + 72, y1 + 140, cx + 118, y1 + 115), fill=dark, width=8)


def draw_roadmap_icon(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], accent: str, dark: str) -> None:
    x1, y1, x2, y2 = box
    points = [(x1 + 35, y2 - 55), (x1 + 120, y2 - 135), (x1 + 210, y2 - 210), (x2 - 45, y1 + 45)]
    draw.line(points, fill=dark, width=16, joint="curve")
    for x, y in points[:-1]:
        draw.ellipse((x - 18, y - 18, x + 18, y + 18), fill=accent)
    end_x, end_y = points[-1]
    draw.line((end_x - 50, end_y + 10, end_x, end_y, end_x - 15, end_y + 48), fill=dark, width=12, joint="curve")


def draw_icon(draw: ImageDraw.ImageDraw, kind: str, box: tuple[int, int, int, int], accent: str, dark: str) -> None:
    if kind == "chemical":
        draw_chemical_icon(draw, box, accent, dark)
    elif kind == "ventilation":
        draw_ventilation_icon(draw, box, accent, dark)
    elif kind == "exposure":
        draw_exposure_icon(draw, box, accent, dark)
    elif kind == "ai":
        draw_ai_icon(draw, box, accent, dark)
    elif kind == "consultant":
        draw_consultant_icon(draw, box, accent, dark)
    elif kind == "fit":
        draw_fit_icon(draw, box, accent, dark)
    elif kind == "roadmap":
        draw_roadmap_icon(draw, box, accent, dark)
    else:
        draw_measurement_icon(draw, box, accent, dark)


def make_card(title: str, category: str, theme_name: str, slug: str, font_path: Path) -> Image.Image:
    accent, pale, dark = THEMES[theme_name]
    image = Image.new("RGB", (WIDTH, HEIGHT), "#EDF3F8")
    draw = ImageDraw.Draw(image)

    draw.rounded_rectangle((46, 42, 1154, 594), radius=34, fill="#DCE5EE")
    draw.rounded_rectangle((38, 34, 1146, 586), radius=34, fill="#FFFFFF")
    draw.rounded_rectangle((38, 34, 1146, 586), radius=34, outline="#D5E0EA", width=3)
    draw.rounded_rectangle((815, 34, 1146, 586), radius=34, fill=pale)
    draw.rectangle((815, 68, 1146, 552), fill=pale)

    digest = hashlib.sha256(slug.encode("utf-8")).digest()
    pattern_color = blend_color(accent, pale, 0.16)
    for index in range(5):
        radius = 20 + digest[index] % 42
        x = 835 + digest[index + 5] % 285
        y = 55 + digest[index + 10] % 490
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=pattern_color)

    brand_font = load_font(font_path, 31, 700)
    category_font = load_font(font_path, 27, 600)
    small_font = load_font(font_path, 21, 500)
    draw.text((76, 74), "労働衛生ラボ", font=brand_font, fill="#123B5D")
    draw.rounded_rectangle((76, 132, 76 + max(170, int(text_width(draw, category, category_font)) + 42), 178), radius=23, fill=pale)
    draw.text((97, 139), category, font=category_font, fill=dark)

    title_font, lines, line_height = title_layout(draw, title, font_path, slug)
    y = 211
    for line in lines:
        draw.text((76, y), line, font=title_font, fill="#102A43")
        y += line_height

    draw.rectangle((76, 515, 736, 523), fill=accent)
    draw.text((76, 537), "一次情報と実務をつなぐ労働衛生メディア", font=small_font, fill="#52697C")
    draw.text((881, 537), "rodoeisei-lab", font=small_font, fill=dark)

    draw_icon(draw, theme_name, (850, 155, 1110, 455), accent, dark)
    return image


def generate(font_path: Path, selected_slugs: set[str] | None = None) -> int:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    articles = public_articles()
    if not articles:
        raise SystemExit("No public articles found")

    if selected_slugs is not None:
        available_slugs = {path.stem for path, _ in articles}
        unknown_slugs = sorted(selected_slugs - available_slugs)
        if unknown_slugs:
            raise SystemExit(f"Unknown public article slug(s): {', '.join(unknown_slugs)}")
        articles = [(path, meta) for path, meta in articles if path.stem in selected_slugs]

    for path, meta in articles:
        title = meta.get("title")
        category = display_category(path, meta)
        if not title:
            raise SystemExit(f"Missing title: {path}")
        theme_name = article_theme(path, meta)
        image = make_card(title, category, theme_name, path.stem, font_path)
        output = OUTPUT_DIR / f"{path.stem}.png"
        image.save(output, format="PNG", optimize=True)
        print(f"generated {output.relative_to(ROOT)}")

    if selected_slugs is None:
        default = make_card(
            "現場と法令のあいだをつなぐ学習サイト",
            "労働衛生",
            "measurement",
            "og-default",
            font_path,
        )
        default.save(ROOT / "assets" / "images" / "og-default.png", format="PNG", optimize=True)
        print("generated assets/images/og-default.png")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--font", required=True, type=Path, help="Japanese TrueType/OpenType font")
    parser.add_argument(
        "--slug",
        action="append",
        default=[],
        help="Generate only this public article slug. Repeat for multiple cards.",
    )
    args = parser.parse_args()
    if not args.font.is_file():
        raise SystemExit(f"Font not found: {args.font}")
    selected_slugs = set(args.slug) if args.slug else None
    return generate(args.font, selected_slugs)


if __name__ == "__main__":
    raise SystemExit(main())
