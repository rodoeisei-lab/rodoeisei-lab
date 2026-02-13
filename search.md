---
layout: page
title: サイト内検索
permalink: /search/
lead: ページや記事をキーワードで横断検索できます。
---

<link rel="stylesheet" href="{{ '/pagefind/pagefind-ui.css' | relative_url }}">

<div class="search-page" data-pagefind-body>
  <p class="search-page-intro">キーワードを入力すると、関連するページをすぐに表示します。</p>
  <div id="search-ui"></div>
</div>

<script src="{{ '/pagefind/pagefind-ui.js' | relative_url }}" defer></script>
<script>
  window.addEventListener("DOMContentLoaded", function () {
    new PagefindUI({
      element: "#search-ui",
      bundlePath: "{{ '/pagefind/' | relative_url }}",
      showSubResults: true,
      showImages: false,
      resetStyles: false,
      translations: {
        placeholder: "例: 有機溶剤 / 騒音 / 作業環境測定"
      }
    });
  });
</script>
