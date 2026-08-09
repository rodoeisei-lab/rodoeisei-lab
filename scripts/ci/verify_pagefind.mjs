#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const outputDir = path.resolve("_site/pagefind");
const requiredAssets = ["pagefind.js", "pagefind-ui.js", "pagefind-ui.css"];

for (const asset of requiredAssets) {
  const assetPath = path.join(outputDir, asset);
  if (!fs.existsSync(assetPath) || fs.statSync(assetPath).size === 0) {
    throw new Error(`Pagefind asset is missing or empty: ${assetPath}`);
  }
}

const pagefind = await import(pathToFileURL(path.join(outputDir, "pagefind.js")));
await pagefind.init();

async function search(query) {
  const response = await pagefind.search(query);
  return Promise.all(response.results.map((result) => result.data()));
}

const allPages = await search(null);
if (allPages.length <= 1) {
  throw new Error(`Pagefind indexed only ${allPages.length} page(s); expected multiple public pages.`);
}

for (const expectedPath of ["/learn/", "/regulations/", "/guides/work-env-measurement-intro/"]) {
  if (!allPages.some((page) => page.url.includes(expectedPath))) {
    throw new Error(`Major public page is missing from Pagefind: ${expectedPath}`);
  }
}

for (const query of ["作業環境測定", "フィットテスト"]) {
  const results = await search(query);
  if (results.length === 0) {
    throw new Error(`Pagefind returned no results for required query: ${query}`);
  }
}

for (const query of ["GC2014", "月末在庫メモ"]) {
  const results = await search(query);
  if (results.length !== 0) {
    throw new Error(`Excluded content appeared in Pagefind for query: ${query}`);
  }
}

const excludedPaths = [
  "/work-ops-hub/",
  "/inventory-memo.html",
  "/skills/",
  "/reports/",
  "/guides/organic-solvent-basics/",
  "/search/",
  "/404.html",
];
for (const page of allPages) {
  if (excludedPaths.some((excluded) => page.url.includes(excluded))) {
    throw new Error(`Excluded URL appeared in Pagefind: ${page.url}`);
  }
}

console.log(`Verified Pagefind index: ${allPages.length} public pages and required queries passed.`);
