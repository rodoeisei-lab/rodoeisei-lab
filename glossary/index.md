---
title: 用語集
description: 現場で迷いやすい用語を短く整理。
eyebrow: Glossary
lead: 管理区分・所定地点・フィットファクタなど、最小の定義から確認できます。
permalink: /glossary/
---

<div class="glossary-search">
  <label class="glossary-search-label" for="glossarySearch">用語を検索</label>
  <input
    id="glossarySearch"
    type="search"
    placeholder="用語を検索（例：管理濃度、TWA、フィットテスト）"
    aria-describedby="glossaryNoResults"
  />
</div>

<p id="glossaryNoResults" class="glossary-empty" hidden>該当なし</p>

<div class="cards glossary-cards">
  {% for entry in site.data.glossary %}
    {% assign tags_text = "" %}
    {% assign related_text = "" %}
    {% if entry.tags %}
      {% assign tags_text = entry.tags | join: " " %}
    {% endif %}
    {% if entry.related %}
      {% assign related_text = entry.related | join: " " %}
    {% endif %}
    {% capture search_text %}{{ entry.term }} {{ entry.reading }} {{ entry.short }} {{ entry.detail | strip_newlines }} {{ tags_text }} {{ related_text }}{% endcapture %}
    <article class="card glossary-card" data-glossary-card data-search="{{ search_text | strip | escape }}">
      <h3>{{ entry.term }}</h3>
      {% if entry.reading %}
        <p class="guide-meta">よみ: {{ entry.reading }}</p>
      {% endif %}
      <p>{{ entry.short }}</p>
      <p class="glossary-detail">{{ entry.detail | newline_to_br }}</p>
      {% if entry.tags %}
        <div class="guide-tags">
          {% for tag in entry.tags %}
            <span class="guide-tag">{{ tag }}</span>
          {% endfor %}
        </div>
      {% endif %}
      {% if entry.related %}
        <p class="guide-meta">関連: {{ entry.related | join: " / " }}</p>
      {% endif %}
    </article>
  {% endfor %}
</div>

<script src="{{ '/assets/js/glossary-search.js' | relative_url }}" defer></script>
