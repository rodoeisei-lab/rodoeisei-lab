#!/usr/bin/env node

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";

const siteDir = path.resolve("_site");
const outputDir = path.resolve("_site/pagefind");
const requiredAssets = ["pagefind.js", "pagefind-ui.js", "pagefind-ui.css"];
const excludedPaths = [
  "/work-ops-hub/",
  "/inventory-memo.html",
  "/skills/",
  "/reports/",
  "/guides/organic-solvent-basics/",
  "/search/",
  "/404.html",
];

for (const asset of requiredAssets) {
  const assetPath = path.join(outputDir, asset);
  if (!fs.existsSync(assetPath) || fs.statSync(assetPath).size === 0) {
    throw new Error(`Pagefind asset is missing or empty: ${assetPath}`);
  }
}

const server = http.createServer((request, response) => {
  try {
    const requestPath = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
    const filePath = path.resolve(siteDir, `.${requestPath}`);
    if (!filePath.startsWith(`${siteDir}${path.sep}`)) {
      response.writeHead(403).end();
      return;
    }

    const contents = fs.readFileSync(filePath);
    response.writeHead(200, {
      "Content-Type": filePath.endsWith(".wasm") ? "application/wasm" : "application/octet-stream",
    });
    response.end(contents);
  } catch {
    response.writeHead(404).end();
  }
});

try {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Could not determine the Pagefind test server address.");
  }

  const pagefind = await import(pathToFileURL(path.join(outputDir, "pagefind.js")));
  await pagefind.options({ basePath: `http://127.0.0.1:${address.port}/pagefind/` });
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
    const excludedResult = results.find((page) =>
      excludedPaths.some((excluded) => page.url.includes(excluded)),
    );
    if (excludedResult) {
      throw new Error(`Excluded URL appeared in Pagefind results for ${query}: ${excludedResult.url}`);
    }
  }

  for (const page of allPages) {
    if (excludedPaths.some((excluded) => page.url.includes(excluded))) {
      throw new Error(`Excluded URL appeared in Pagefind: ${page.url}`);
    }
  }

  console.log(`Verified Pagefind index: ${allPages.length} public pages and required queries passed.`);
} finally {
  if (server.listening) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}
