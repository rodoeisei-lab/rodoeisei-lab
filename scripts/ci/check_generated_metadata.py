#!/usr/bin/env python3
"""Verify page-type metadata and the search page's query-string handoff."""

from __future__ import annotations

import argparse
from datetime import datetime
import json
from pathlib import Path
import re


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


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--site-dir", default="_site")
    args = parser.parse_args()
    site = Path(args.site_dir)

    website = ['<meta property="og:type" content="website">']
    require(site / "index.html", website + ['"@type": "WebSite"'])
    for route in ("learn", "regulations", "search", "chemical-management", "ai-use", "occupational-health-consultant", "videos", "tools", "products", "amazon", "about", "privacy", "contact"):
        require(site / route / "index.html", website + ['"@type": "WebPage"'])

    require(
        site / "index.html",
        [
            "/chemical-management/",
            "/occupational-health-consultant/",
            "/about/",
            "/privacy/",
            "/contact/",
        ],
    )
    require(
        site / "about" / "index.html",
        ["第一種作業環境測定士", "臨床検査技師", "生成AIの利用方針"],
    )
    require(
        site / "privacy" / "index.html",
        ["GitHub Pagesのアクセスログ", "localStorage", "Googleフォーム"],
    )
    require(
        site / "occupational-health-consultant" / "index.html",
        ["/guides/occupational-health-consultant-basics/"],
    )
    home_html = (site / "index.html").read_text(encoding="utf-8")
    if "/guides/organic-solvent-basics/" in home_html:
        raise SystemExit("Home page links to the work-in-progress organic solvent guide")

    require(
        site / "guides" / "organic-solvent-basics" / "index.html",
        ['<meta name="robots" content="noindex, nofollow">', "data-pagefind-ignore"],
    )

    sitemap = site / "sitemap.xml"
    if not sitemap.is_file():
        raise SystemExit(f"Missing generated sitemap: {sitemap}")
    if "/guides/organic-solvent-basics/" in sitemap.read_text(encoding="utf-8"):
        raise SystemExit("Work-in-progress organic solvent guide appeared in sitemap.xml")

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
        if "datePublished" not in structured_data or "dateModified" not in structured_data:
            raise SystemExit(f"{article_path} must include stable publication and modification dates")
        published_at = parse_iso_date(structured_data["datePublished"], article_path, "datePublished")
        modified_at = parse_iso_date(structured_data["dateModified"], article_path, "dateModified")
        if published_at > modified_at:
            raise SystemExit(f"{article_path} has datePublished after dateModified")
    require(site / "videos" / "index.html", ['"@type": "WebPage"', "-l2ISaUncV4"])
    public_routes_without_placeholders = (
        "guides",
        "work-environment-measurement",
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
    if "library-category__empty" in videos_html:
        raise SystemExit("Videos page renders an empty category")
    content_library = Path("_data/content_library.yml").read_text(encoding="utf-8")
    populated_categories = {
        line.split(":", 1)[1].strip().strip('"\'')
        for line in content_library.splitlines()
        if line.startswith("  category:")
    }
    if videos_html.count('class="library-category"') != len(populated_categories):
        raise SystemExit("Videos page must render only categories that currently contain items")

    require(site / "guides" / "work-environment-measurement-design-sampling" / "index.html", ['"@type": "Article"', "https://www.youtube.com/watch?v=-l2ISaUncV4"])
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
