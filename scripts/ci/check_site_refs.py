#!/usr/bin/env python3
"""CI checks for built Jekyll site.

- Detect zero-byte images (source and built outputs)
- Detect missing internal assets referenced from HTML (img/src, srcset, meta content)
- Detect basic broken internal links
"""

from __future__ import annotations

import argparse
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico", ".avif"}
SKIP_SCHEMES = ("http://", "https://", "mailto:", "tel:", "javascript:", "data:")


class RefCollector(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.refs: list[tuple[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_map = {k: v for k, v in attrs if v}

        if tag in {"a", "link"} and attr_map.get("href"):
            self.refs.append((f"{tag}@href", attr_map["href"]))

        if tag in {"img", "script", "iframe", "source"} and attr_map.get("src"):
            self.refs.append((f"{tag}@src", attr_map["src"]))

        if attr_map.get("srcset"):
            for part in attr_map["srcset"].split(","):
                candidate = part.strip().split(" ")[0]
                if candidate:
                    self.refs.append((f"{tag}@srcset", candidate))

        if tag == "meta" and attr_map.get("content"):
            p = (attr_map.get("property") or "").lower()
            n = (attr_map.get("name") or "").lower()
            if p.startswith("og:image") or n in {"twitter:image", "twitter:image:src"}:
                self.refs.append(("meta@content", attr_map["content"]))


def is_skipped_url(url: str) -> bool:
    u = url.strip()
    return not u or u.startswith("#") or u.startswith(SKIP_SCHEMES)


def normalize_site_path(url: str, baseurl: str) -> str:
    path = urlsplit(url).path
    if baseurl and path.startswith(baseurl + "/"):
        path = path[len(baseurl) :]
    if not path.startswith("/"):
        path = "/" + path
    return path


def resolve_site_target(site_dir: Path, normalized_path: str) -> Path:
    rel = normalized_path.lstrip("/")
    target = site_dir / rel

    if target.exists():
        return target

    if normalized_path.endswith("/"):
        idx = site_dir / rel / "index.html"
        if idx.exists():
            return idx

    if not target.suffix:
        as_dir = site_dir / rel / "index.html"
        if as_dir.exists():
            return as_dir
        as_html = site_dir / f"{rel}.html"
        if as_html.exists():
            return as_html

    return target


def check_zero_byte_images(paths: list[Path]) -> list[str]:
    failures: list[str] = []
    for base in paths:
        if not base.exists():
            continue
        for p in base.rglob("*"):
            if not p.is_file():
                continue
            if p.suffix.lower() in IMAGE_EXTS and p.stat().st_size == 0:
                failures.append(f"0-byte image: {p}")

    for must_file in (Path("og.jpg"), Path("favicon.ico")):
        if must_file.exists() and must_file.stat().st_size == 0:
            failures.append(f"0-byte required image: {must_file}")

    return failures


def check_html_refs(site_dir: Path, baseurl: str, exclude_prefixes: list[str]) -> list[str]:
    failures: list[str] = []
    html_files = sorted(site_dir.rglob("*.html"))

    for html_file in html_files:
        parser = RefCollector()
        parser.feed(html_file.read_text(encoding="utf-8"))

        for attr, raw_url in parser.refs:
            url = raw_url.strip()
            if is_skipped_url(url):
                continue

            normalized_path = normalize_site_path(url, baseurl)
            if any(normalized_path.startswith(prefix) for prefix in exclude_prefixes):
                continue

            target = resolve_site_target(site_dir, normalized_path)
            if target.exists():
                continue

            is_asset_ref = attr in {"img@src", "source@src", "img@srcset", "source@srcset", "meta@content"}
            ext = Path(urlsplit(url).path).suffix.lower()
            if is_asset_ref or ext in IMAGE_EXTS:
                failures.append(f"{html_file}: missing asset ({attr}) -> {url}")
            elif attr == "a@href":
                failures.append(f"{html_file}: broken internal link -> {url}")

    return failures


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--site-dir", default="_site")
    parser.add_argument("--baseurl", default="")
    parser.add_argument(
        "--exclude-prefix",
        action="append",
        default=["/pagefind/"],
        help="Path prefixes (site-root absolute) to ignore",
    )
    args = parser.parse_args()

    site_dir = Path(args.site_dir)
    if not site_dir.exists():
        print(f"ERROR: site directory not found: {site_dir}")
        return 2

    exclude_prefixes = [p if p.startswith("/") else f"/{p}" for p in args.exclude_prefix]

    failures: list[str] = []
    failures.extend(check_zero_byte_images([Path("assets"), site_dir]))
    failures.extend(check_html_refs(site_dir, args.baseurl, exclude_prefixes))

    if failures:
        print("❌ CI quality gate failed. Found issues:")
        for f in failures:
            print(f" - {f}")
        return 1

    print("✅ CI quality gate passed: no missing internal refs or zero-byte images detected.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
