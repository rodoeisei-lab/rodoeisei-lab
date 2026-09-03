#!/usr/bin/env python3
"""Verify page-type metadata and the search page's query-string handoff."""

from __future__ import annotations

import argparse
from datetime import datetime
import json
from pathlib import Path
import re
import struct
from urllib.parse import urlsplit


def require(path: Path, snippets: list[str]) -> None:
    if not path.is_file():
        raise SystemExit(f"Missing generated page: {path}")
    html = path.read_text(encoding="utf-8")
    missing = [snippet for snippet in snippets if snippet not in html]
    if missing:
        raise SystemExit(f"{path} is missing expected content: {missing}")


def article_structured_data(html: str) -> dict[str, object] | None:
    for raw_json in re.findall(
        r'<script type="application/ld\+json">\s*(\{.*?\})\s*</script>',
        html,
        flags=re.DOTALL,
    ):
        payload = json.loads(raw_json)
        if payload.get("@type") == "Article":
            return payload
    return None


def parse_iso_date(value: object, path: Path, field: str) -> datetime:
    if not isinstance(value, str):
        raise SystemExit(f"{path} has a non-string {field}")
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError as exc:
        raise SystemExit(f"{path} has an invalid {field}: {value}") from exc


def meta_content(html: str, attribute: str, key: str, path: Path) -> str:
    match = re.search(
        rf'<meta\s+{attribute}="{re.escape(key)}"\s+content="([^"]*)"\s*/?>',
        html,
    )
    if not match or not match.group(1).strip():
        raise SystemExit(f"{path} is missing non-empty {key} metadata")
    return match.group(1).strip()


def built_asset_path(site: Path, url: str, path: Path) -> Path:
    parts = [part for part in urlsplit(url).path.split("/") if part]
    try:
        asset_index = parts.index("assets")
    except ValueError as exc:
        raise SystemExit(f"{path} has an image outside /assets/: {url}") from exc
    return site.joinpath(*parts[asset_index:])


def png_dimensions(path: Path) -> tuple[int, int]:
    if not path.is_file():
        raise SystemExit(f"Missing generated OGP image: {path}")
    header = path.read_bytes()[:24]
    if len(header) < 24 or header[:8] != b"\x89PNG\r\n\x1a\n" or header[12:16] != b"IHDR":
        raise SystemExit(f"OGP image is not a valid PNG: {path}")
    return struct.unpack(">II", header[16:24])


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--site-dir", default="_site")
    args = parser.parse_args()
    site = Path(args.site_dir)

    website = ['<meta property="og:type" content="website">']
    require(site / "index.html", website + ['"@type": "WebSite"'])
    for route in ("learn", "regulations", "search", "chemical-management", "substances", "ai-use", "occupational-health-consultant", "occupational-hygienist", "videos", "tools", "products", "amazon", "about", "privacy", "contact"):
        require(site / route / "index.html", website + ['"@type": "WebPage"'])

    require(
        site / "index.html",
        [
            "/chemical-management/",
            "/licenses/",
            "/about/",
            "/privacy/",
            "/contact/",
        ],
    )
    require(
        site / "about" / "index.html",
        ["第一種作業環境測定士", "生成AIの利用方針"],
    )
    require(
        site / "privacy" / "index.html",
        ["GitHub Pagesのアクセスログ", "localStorage", "Googleフォーム"],
    )
    require(
        site / "occupational-health-consultant" / "index.html",
        ["/guides/occupational-health-consultant-basics/"],
    )
    require(
        site / "occupational-hygienist" / "index.html",
        [
            "/guides/occupational-hygienist-basics/",
            "/guides/occupational-hygienist-93-credits/",
            "/guides/occupational-hygienist-evaluation-exam/",
            "/guides/occupational-hygienist-from-measurer/",
        ],
    )
    home_html = (site / "index.html").read_text(encoding="utf-8")
    home_og_image = meta_content(home_html, "property", "og:image", site / "index.html")
    if not urlsplit(home_og_image).path.endswith("/assets/images/og-default.png"):
        raise SystemExit(f"Home page must use the raster default OGP image: {home_og_image}")
    if meta_content(home_html, "name", "twitter:image", site / "index.html") != home_og_image:
        raise SystemExit("Home page OGP and X card images must match")
    if meta_content(home_html, "property", "og:image:type", site / "index.html") != "image/png":
        raise SystemExit("Home page must declare image/png")
    if meta_content(home_html, "property", "og:image:width", site / "index.html") != "1200":
        raise SystemExit("Home page must declare a 1200px OGP image width")
    if meta_content(home_html, "property", "og:image:height", site / "index.html") != "630":
        raise SystemExit("Home page must declare a 630px OGP image height")
    meta_content(home_html, "property", "og:image:alt", site / "index.html")
    meta_content(home_html, "name", "twitter:image:alt", site / "index.html")
    if png_dimensions(built_asset_path(site, home_og_image, site / "index.html")) != (1200, 630):
        raise SystemExit("Home page OGP image must be exactly 1200x630")
    organic_solvent_guide_route = "/guides/organic-solvent-basics/"
    organic_solvent_guide = site / "guides" / "organic-solvent-basics" / "index.html"
    require(
        organic_solvent_guide,
        [
            '<meta property="og:type" content="article">',
            '"@type": "Article"',
            "製品名だけで「有機則の対象だろう」",
            "/guides/chemical-management-basics/",
        ],
    )
    organic_solvent_html = organic_solvent_guide.read_text(encoding="utf-8")
    if '<meta name="robots" content="noindex, nofollow">' in organic_solvent_html:
        raise SystemExit("Published organic solvent guide is still marked noindex")

    sitemap = site / "sitemap.xml"
    if not sitemap.is_file():
        raise SystemExit(f"Missing generated sitemap: {sitemap}")
    sitemap_html = sitemap.read_text(encoding="utf-8")
    if organic_solvent_guide_route not in sitemap_html:
        raise SystemExit("Published organic solvent guide is missing from sitemap.xml")
    for private_route in ("/templates/qa-article/", "/pages/qa-template/"):
        if private_route in sitemap_html:
            raise SystemExit(f"Editorial Q&A template appeared in sitemap.xml: {private_route}")

    editorial_template_markers = (
        "Q&A記事テンプレート（編集用）",
        "Q&Aテンプレート: ここに質問タイトル",
    )
    for generated_page in site.rglob("*.html"):
        generated_html = generated_page.read_text(encoding="utf-8")
        marker = next(
            (candidate for candidate in editorial_template_markers if candidate in generated_html),
            None,
        )
        if marker:
            raise SystemExit(
                f"Editorial Q&A template leaked into the public site: {generated_page} ({marker})"
            )

    require(
        site / "qa" / "third-control-class" / "index.html",
        [
            '<meta property="og:type" content="article">',
            '"@type": "Article"',
            "原因確認、発散源・設備・工程の改善",
            "/inspection/",
            "/guides/work-env-measurement-intro/",
            "/guides/management-concentration-exposure-limits/",
            "/guides/organic-solvent-basics/",
        ],
    )
    require(
        site / "qa" / "hygiene-committee-agenda" / "index.html",
        [
            '<meta property="og:type" content="article">',
            '"@type": "Article"',
            "担当者・期限・確認方法",
            "毎月1回以上",
            "/contact/",
        ],
    )
    require(
        site / "glossary" / "index.html",
        ["/guides/organic-solvent-basics/"],
    )

    substance_registry_path = Path("_data/substance_registry.json")
    if not substance_registry_path.is_file():
        raise SystemExit("Missing generated substance registry data")
    substance_registry = json.loads(substance_registry_path.read_text(encoding="utf-8"))
    records = substance_registry.get("records")
    if substance_registry.get("schema_version") != 1 or not isinstance(records, list):
        raise SystemExit("Substance registry data has an unsupported schema")
    expected_system_counts = {
        "organic-solvent": 45,
        "specified-chemical": 75,
        "concentration-standard": 270,
    }
    actual_system_counts = {
        system_key: sum(
            1 for record in records if record.get("system_key") == system_key
        )
        for system_key in expected_system_counts
    }
    if actual_system_counts != expected_system_counts:
        raise SystemExit(
            "Substance registry record counts changed; review the official-source update: "
            f"{actual_system_counts}"
        )
    for record in records:
        if not all(record.get(field) for field in ("id", "name", "system_key", "category", "source_url")):
            raise SystemExit(f"Substance registry record is missing required data: {record}")

    substance_page = site / "substances" / "index.html"
    require(
        substance_page,
        [
            "対象物質・制度検索",
            "第2種有機溶剤",
            "アセトン",
            "溶接ヒューム",
            "アクリル酸",
            "濃度基準値設定物質",
            "CAS RNは参考情報",
            "確認測定を含むばく露状況の確認方法",
            "/assets/js/substance-registry.js",
        ],
    )
    substance_html = substance_page.read_text(encoding="utf-8")
    if "個人ばく露測定対象物質" in substance_html:
        raise SystemExit("Substance page must not call a whole list individual-exposure-measurement targets")
    substance_check_flow = site / "substances" / "check-flow" / "index.html"
    require(
        substance_check_flow,
        [
            "物質検索の後の確認フロー",
            "濃度基準値設定物質",
            "確認測定",
            "指定作業場",
            "掲載がないことは、リスクアセスメント、ラベル表示、SDS交付などの対象外を意味しません。",
            "/substances/",
        ],
    )
    if "個人ばく露測定対象物質" in substance_check_flow.read_text(encoding="utf-8"):
        raise SystemExit("Substance check flow must not call a whole list individual-exposure-measurement targets")

    require(
        site / "guides" / "occupational-health-consultant-basics" / "index.html",
        ['<meta property="og:type" content="article">', '"@type": "Article"'],
    )
    if "/search/?q=労働衛生コンサルタント" in home_html:
        raise SystemExit("Home page still links consultant category to search")

    require(
        site / "guides" / "work-env-measurement-intro" / "index.html",
        [
            '<meta property="og:type" content="article">',
            '"@type": "Article"',
            '<meta name="author" content="労働衛生ラボ編集部">',
            '"author":',
            "執筆・編集：",
            "/about/",
            '<meta property="article:published_time" content="2026-01-20T00:00:00+00:00">',
            '<meta property="article:modified_time" content="2026-08-10T00:00:00+00:00">',
            '"datePublished": "2026-01-20T00:00:00+00:00"',
            '"dateModified": "2026-08-10T00:00:00+00:00"',
            "公開日：2026-01-20",
            "更新日：2026-08-10",
        ],
    )
    article_images: dict[Path, str] = {}
    article_titles: dict[Path, str] = {}
    for article_path in site.rglob("index.html"):
        article_html = article_path.read_text(encoding="utf-8")
        feedback_section = re.search(
            r'<section class="article-feedback".*?</section>',
            article_html,
            flags=re.DOTALL,
        )
        if feedback_section and re.search(
            r'<a\b[^>]*\bhref\s*=\s*["\']\s*["\'][^>]*>',
            feedback_section.group(0),
        ):
            raise SystemExit(f"{article_path} contains an empty feedback link")
        structured_data = article_structured_data(article_html)
        if structured_data is None or '<meta name="robots" content="noindex, nofollow">' in article_html:
            continue
        if "/contact/" not in article_html:
            raise SystemExit(f"{article_path} is missing the article-to-contact path")
        headline = structured_data.get("headline")
        if not isinstance(headline, str) or not headline.strip():
            raise SystemExit(f"{article_path} must include a non-empty Article headline")
        article_titles[article_path] = headline.strip()
        og_image = meta_content(article_html, "property", "og:image", article_path)
        twitter_image = meta_content(article_html, "name", "twitter:image", article_path)
        og_image_alt = meta_content(article_html, "property", "og:image:alt", article_path)
        twitter_image_alt = meta_content(article_html, "name", "twitter:image:alt", article_path)
        if not urlsplit(og_image).path.endswith(".png"):
            raise SystemExit(f"{article_path} must use a PNG OGP image: {og_image}")
        if "/assets/images/og/articles/" not in urlsplit(og_image).path:
            raise SystemExit(f"{article_path} must use an article-specific OGP image: {og_image}")
        if twitter_image != og_image or structured_data.get("image") != og_image:
            raise SystemExit(f"{article_path} has inconsistent OGP, X card, and JSON-LD images")
        if twitter_image_alt != og_image_alt:
            raise SystemExit(f"{article_path} has inconsistent OGP and X image alt text")
        if meta_content(article_html, "property", "og:image:type", article_path) != "image/png":
            raise SystemExit(f"{article_path} must declare image/png")
        if meta_content(article_html, "property", "og:image:width", article_path) != "1200":
            raise SystemExit(f"{article_path} must declare a 1200px OGP image width")
        if meta_content(article_html, "property", "og:image:height", article_path) != "630":
            raise SystemExit(f"{article_path} must declare a 630px OGP image height")
        image_path = built_asset_path(site, og_image, article_path)
        if png_dimensions(image_path) != (1200, 630):
            raise SystemExit(f"{article_path} OGP image must be exactly 1200x630: {image_path}")
        article_images[article_path] = og_image
        if "datePublished" not in structured_data or "dateModified" not in structured_data:
            raise SystemExit(f"{article_path} must include stable publication and modification dates")
        published_at = parse_iso_date(structured_data["datePublished"], article_path, "datePublished")
        modified_at = parse_iso_date(structured_data["dateModified"], article_path, "dateModified")
        if published_at > modified_at:
            raise SystemExit(f"{article_path} has datePublished after dateModified")
    if len(set(article_images.values())) != len(article_images):
        duplicates = sorted(
            image
            for image in set(article_images.values())
            if list(article_images.values()).count(image) > 1
        )
        raise SystemExit(f"Public articles must not share OGP images: {duplicates}")
    duplicate_titles = sorted(
        title
        for title in set(article_titles.values())
        if list(article_titles.values()).count(title) > 1
    )
    if duplicate_titles:
        raise SystemExit(f"Public articles must not share the same title: {duplicate_titles}")
    require(site / "videos" / "index.html", ['"@type": "WebPage"', "-l2ISaUncV4"])
    require(
        site / "analysis" / "index.html",
        [
            "/guides/work-environment-analysis-basics/",
            "/guides/gc-analysis-basics/",
            "/guides/atomic-absorption-analysis-basics/",
            "/guides/analytical-limits-basics/",
        ],
    )
    public_routes_without_placeholders = (
        "guides",
        "work-environment-measurement",
        "analysis",
        "chemical-management",
        "personal-exposure-measurement",
        "ai-use",
        "occupational-health-consultant",
        "local-exhaust-ventilation",
        "tools",
        "videos",
        "licenses",
    )
    placeholder_phrases = ("準備中", "今後追加予定の記事", "次回追加予定")
    for route in public_routes_without_placeholders:
        route_html = (site / route / "index.html").read_text(encoding="utf-8")
        found = [phrase for phrase in placeholder_phrases if phrase in route_html]
        if found:
            raise SystemExit(f"Public route /{route}/ exposes unfinished content: {found}")

    videos_html = (site / "videos" / "index.html").read_text(encoding="utf-8")
    require(
        site / "videos" / "index.html",
        [
            "data-library-filter",
            "data-library-results",
            "/assets/js/content-library-filter.js",
            "learning-youtube-data",
        ],
    )
    content_library = Path("_data/content_library.yml").read_text(encoding="utf-8")
    library_item_count = sum(
        1 for line in content_library.splitlines() if line.startswith("- slug:")
    )
    if library_item_count < 10:
        raise SystemExit(f"Content library is unexpectedly small: {library_item_count}")
    if videos_html.count("data-library-card") < library_item_count:
        raise SystemExit("Videos page does not render every content-library theme")

    require(site / "guides" / "work-environment-measurement-design-sampling" / "index.html", ['"@type": "Article"', "https://www.youtube.com/watch?v=-l2ISaUncV4"])
    require(
        site / "guides" / "personal-exposure-measurement-basics" / "index.html",
        ["nRqshwTlfWk", "UiC5mOc5f-I"],
    )
    require(
        site / "guides" / "occupational-hygienist-93-credits" / "index.html",
        ["znlaYTwWewE"],
    )
    require(
        site / "guides" / "work-environment-measurement-sampling" / "index.html",
        ["/guides/management-concentration-exposure-limits/"],
    )
    intro_html = (site / "guides" / "chemical-management-basics" / "index.html").read_text(encoding="utf-8")
    if "article-youtube" in intro_html:
        raise SystemExit("Article without youtube_videos rendered an empty video module")
    require(
        site / "guides" / "chemical-substance-manager-ppe-manager" / "index.html",
        [
            '<meta property="og:type" content="article">',
            '"@type": "Article"',
            "選任事由の発生日から14日以内",
            "/chemical-management/",
        ],
    )
    require(
        site / "guides" / "management-concentration-exposure-limits" / "index.html",
        [
            '<meta property="og:type" content="article">',
            '"@type": "Article"',
            "2026年10月1日",
            "/chemical-management/",
            "/guides/personal-exposure-measurement-basics/",
        ],
    )
    require(
        site / "guides" / "create-simple-guide" / "index.html",
        [
            '<meta property="og:type" content="article">',
            '"@type": "Article"',
            "CREATE-SIMPLE ver.3.2.1",
            "リスクレベルⅡ-B",
            "/chemical-management/",
            "/guides/management-concentration-exposure-limits/",
        ],
    )
    require(
        site / "guides" / "sds-reading" / "index.html",
        [
            '<meta property="og:type" content="article">',
            '"@type": "Article"',
            "SDSは「保管資料」ではなく、現場確認の出発点",
            "第3項",
            "/substances/",
            "/substances/check-flow/",
        ],
    )
    require(
        site / "guides" / "chemical-risk-assessment-basics" / "index.html",
        [
            '<meta property="og:type" content="article">',
            '"@type": "Article"',
            "リスクアセスメントは「書類作成」ではなく、対策を決める工程",
            "製品単位ではなく「作業単位」で分ける",
            "/guides/sds-reading/",
            "/substances/check-flow/",
        ],
    )

    tools_html = (site / "tools" / "index.html").read_text(encoding="utf-8")
    require(
        site / "tools" / "index.html",
        [
            "/products/",
            "/amazon/",
            "選定基準と商品一覧を混ぜない",
        ],
    )
    products_html = (site / "products" / "index.html").read_text(encoding="utf-8")
    require(
        site / "products" / "index.html",
        [
            "作業条件から道具を絞る",
            "化学防護手袋として紹介している商品ではありません",
            "/amazon/#hand-protection",
        ],
    )
    if "amzn.to" in products_html:
        raise SystemExit("Products page contains a direct Amazon affiliate link; keep affiliate links on /amazon/")

    amazon_html = (site / "amazon" / "index.html").read_text(encoding="utf-8")
    require(
        site / "amazon" / "index.html",
        [
            "Amazonのアソシエイトとして、労働衛生ラボは適格販売により収入を得ています。",
            "B00AEZILG6",
            "B0D5YGFY1J",
            "B019CCJHT6",
            "B003AQDR1A",
            "B0CVRWB5C1",
        ],
    )
    if amazon_html.count("https://amzn.to/") != 5:
        raise SystemExit("Amazon page must preserve exactly the five existing affiliate links")
    if amazon_html.count('rel="noopener noreferrer sponsored"') != 5:
        raise SystemExit("Every Amazon affiliate link must be marked sponsored")
    if amazon_html.count("Amazonリンクはアフィリエイトリンクです。") != 5:
        raise SystemExit("Every Amazon affiliate link needs a nearby disclosure")
    if "薬品の取り扱い作業に" in amazon_html or "薬品の取り扱い作業に" in tools_html:
        raise SystemExit("General-purpose grip gloves must not be described as chemical-protection gloves")

    require(
        site / "search" / "index.html",
        [
            'new URLSearchParams(window.location.search).get("q")',
            "search.triggerSearch(query.replace",
        ],
    )

    print("Generated metadata and search query handoff are valid.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
