---
title: 検索
description: 解説記事と最新アップデートを横断し、粉じん・有機溶剤・管理濃度などのキーワードで探せる検索ページ。
permalink: /search/
---

<div class="filter-search">
  <label class="sr-only" for="cardSearch">検索</label>
  <input id="cardSearch" type="search" name="q" placeholder="例：個人ばく露測定、管理濃度、フィットテスト…">
</div>
<p id="cardNoResults" class="no-results" hidden>該当するコンテンツがありません。</p>

<section class="section">
  <h2>解説</h2>
  {% assign published_guides = site.guides | where: "status", "published" | sort: "updated" | reverse %}
  <div class="cards guides-cards">
    {% for guide in published_guides %}
      {% include guide_card.html guide=guide %}
    {% endfor %}
  </div>

  {% assign wip_guides = site.guides | where: "status", "wip" | sort: "title" %}
  {% if wip_guides.size > 0 %}
    <h3>準備中</h3>
    <div class="cards guides-cards">
      {% for guide in wip_guides %}
        {% include guide_card.html guide=guide %}
      {% endfor %}
    </div>
  {% endif %}
</section>

<section class="section">
  <h2>最新情報</h2>
  {% assign updates_sorted = site.updates | sort: "updated" | reverse %}
  <div class="cards updates-cards">
    {% for update in updates_sorted %}
      {% assign update_title = update.title | default: update.slug | default: update.basename | default: "更新情報" %}
      {% assign update_summary = update.summary | default: update.excerpt | strip_html | truncate: 120 %}
      {% assign update_impact = update.impact | default: "" %}
      {% assign update_target = update.target | default: "" %}
      {% assign update_effective = update.effective_from | default: "" %}
      {% assign update_updated = update.updated | default: "" %}
      {% assign search_text = update_title | append: " " | append: update_summary | append: " " | append: update_impact | append: " " | append: update_target | append: " " | append: update_effective | append: " " | append: update_updated | strip | strip_newlines %}
      {% capture data_attrs %}data-filter-card data-search="{{ search_text | escape }}" data-tags=""{% endcapture %}
      {% assign badges = "" | split: "|" %}
      {% if update.updated %}
        {% assign badges = badges | push: update.updated %}
      {% endif %}
      {% if update.impact %}
        {% assign badges = badges | push: update.impact %}
      {% endif %}
      {% include list-card.html
        class="update-card"
        title=update_title
        description=update_summary
        badges=badges
        data_attrs=data_attrs
        link_url=update.url
        link_label="詳細を見る →"
      %}
    {% endfor %}
  </div>
</section>

<script src="{{ '/assets/js/card-filter.js' | relative_url }}" defer></script>
