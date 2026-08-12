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
  "/navigator/",
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

  for (const expectedPath of ["/learn/", "/regulations/", "/work-environment-measurement/", "/chemical-management/", "/local-exhaust-ventilation/", "/ai-use/", "/occupational-health-consultant/", "/guides/work-env-measurement-intro/", "/guides/chemical-management-basics/", "/guides/chemical-substance-manager-ppe-manager/", "/guides/local-exhaust-ventilation-basics/", "/guides/ai-use-occupational-health-basics/", "/guides/occupational-health-consultant-basics/", "/videos/", "/guides/work-environment-measurement-design/", "/guides/work-environment-measurement-sampling/"]) {
    if (!allPages.some((page) => page.url.includes(expectedPath))) {
      throw new Error(`Major public page is missing from Pagefind: ${expectedPath}`);
    }
  }

  for (const query of ["労働衛生コンサルタント", "受験資格", "口述試験", "労働衛生工学", "保健衛生", "作業環境測定士"]) {
    const results = await search(query);
    if (!results.some((page) => page.url.includes("/occupational-health-consultant/") || page.url.includes("/guides/occupational-health-consultant-basics/"))) {
      throw new Error(`Consultant category or basics article is missing for query: ${query}`);
    }
  }

  for (const query of ["生成AI", "ハルシネーション", "機密情報"]) {
    const results = await search(query);
    if (!results.some((page) => page.url.includes("/ai-use/") || page.url.includes("/guides/ai-use-occupational-health-basics/"))) {
      throw new Error(`AI category or basics article is missing for query: ${query}`);
    }
  }

  for (const query of ["作業環境測定", "化学物質管理", "フィットテスト"]) {
    const results = await search(query);
    if (results.length === 0) {
      throw new Error(`Pagefind returned no results for required query: ${query}`);
    }
  }

  const chemicalResults = await search("化学物質管理");
  if (!chemicalResults.some((page) => page.url.includes("/guides/chemical-management-basics/"))) {
    throw new Error("Chemical management search did not return the introduction article.");
  }

  for (const query of ["SDS", "リスクアセスメント"]) {
    const results = await search(query);
    if (!results.some((page) => page.url.includes("/guides/chemical-management-basics/"))) {
      throw new Error(`Chemical management introduction article is missing for query: ${query}`);
    }
  }

  for (const query of ["化学物質管理者", "保護具着用管理責任者"]) {
    const results = await search(query);
    if (!results.some((page) => page.url.includes("/guides/chemical-substance-manager-ppe-manager/"))) {
      throw new Error(`Chemical or PPE manager article is missing for query: ${query}`);
    }
  }

  for (const query of ["局所排気装置", "制御風速", "フード"]) {
    const results = await search(query);
    if (!results.some((page) => page.url.includes("/local-exhaust-ventilation/") || page.url.includes("/guides/local-exhaust-ventilation-basics/"))) {
      throw new Error(`Local exhaust ventilation content is missing for query: ${query}`);
    }
  }

  const measurementResults = await search("作業環境測定");
  if (!measurementResults.some((page) =>
    page.url.includes("/work-environment-measurement/") ||
    page.url.includes("/guides/work-env-measurement-intro/"),
  )) {
    throw new Error("Work environment measurement search did not return the category or introduction page.");
  }


  for (const query of ["YouTube", "動画", "note", "デザイン", "サンプリング", "A測定", "B測定", "C測定", "D測定"]) {
    const results = await search(query);
    if (!results.some((page) => page.url.includes("/videos/") || page.url.includes("/guides/work-environment-measurement-design/") || page.url.includes("/guides/work-environment-measurement-sampling/"))) {
      throw new Error(`Content library or related article is missing for query: ${query}`);
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
