#!/usr/bin/env bash
set -euo pipefail

# Keep the independently published work tools and internal material available at
# their existing URLs, but hide them from Pagefind while it scans the built site.
site_dir="_site"
stash_dir="$(mktemp -d)"
excluded=(work-ops-hub skills reports inventory-memo.html)

restore_excluded() {
  for path in "${excluded[@]}"; do
    if [[ -e "$stash_dir/$path" ]]; then
      mkdir -p "$site_dir/$(dirname "$path")"
      mv "$stash_dir/$path" "$site_dir/$path"
    fi
  done
  rm -rf "$stash_dir"
}
trap restore_excluded EXIT

for path in "${excluded[@]}"; do
  if [[ -e "$site_dir/$path" ]]; then
    mkdir -p "$stash_dir/$(dirname "$path")"
    mv "$site_dir/$path" "$stash_dir/$path"
  fi
done

# Pagefind automatically reads pagefind.yml from the working directory.
# Its current CLI does not support the former `--config` option.
npx --yes pagefind@1.4.0

test -f "$site_dir/pagefind/pagefind.js"
test -f "$site_dir/pagefind/pagefind-ui.js"
test -f "$site_dir/pagefind/pagefind-ui.css"
