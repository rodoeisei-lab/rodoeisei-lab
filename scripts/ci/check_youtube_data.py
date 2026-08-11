#!/usr/bin/env python3
"""Validate manually curated YouTube metadata without network access."""
import argparse, datetime, json, re, subprocess
from pathlib import Path

ID = re.compile(r"^[A-Za-z0-9_-]{11}$")
DATE = re.compile(r"^\d{4}-\d{2}-\d{2}$")

def generated_path(site, url):
    clean=url.strip('/')
    return site / clean / 'index.html' if clean else site / 'index.html'

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--site-dir', default='_site'); args=ap.parse_args()
    ruby = "require 'yaml'; require 'json'; puts JSON.generate(YAML.unsafe_load_file('_data/youtube.yml'))"
    result = subprocess.run(['ruby', '-e', ruby], text=True, capture_output=True, check=True)
    data=json.loads(result.stdout)
    videos=data.get('videos') or []; errors=[]; ids=set(); urls=set(); featured=0
    if len(videos)!=15: errors.append(f'expected 15 videos, got {len(videos)}')
    for i,v in enumerate(videos,1):
        vid=str(v.get('id','')); url=str(v.get('url','')); published=v.get('published_at')
        if not ID.fullmatch(vid): errors.append(f'video {i}: invalid id {vid!r}')
        if vid in ids: errors.append(f'video {i}: duplicate id {vid}')
        if url in urls: errors.append(f'video {i}: duplicate URL {url}')
        ids.add(vid); urls.add(url)
        if v.get('format') not in ('long','short'): errors.append(f'video {vid}: invalid format')
        if not str(v.get('title','')).strip(): errors.append(f'video {vid}: empty title')
        date_text=published.isoformat() if isinstance(published, datetime.date) else str(published)
        if not DATE.fullmatch(date_text): errors.append(f'video {vid}: invalid published_at')
        featured += bool(v.get('featured'))
        article=v.get('article_url')
        if article and not generated_path(Path(args.site_dir), article).is_file(): errors.append(f'video {vid}: missing article page {article}')
    if featured > 1: errors.append(f'multiple featured videos: {featured}')
    if errors: raise SystemExit('\n'.join(errors))
    print(f'YouTube data valid: {len(videos)} unique videos, {featured} featured.')
if __name__=='__main__': main()
