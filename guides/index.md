---
title: 解説
description: 粉じん・有機溶剤・作業環境測定・労基署対策など、一次情報ベースの解説一覧。
eyebrow: Guides
lead: 難易度や読む目的に合わせて、今必要な情報だけを素早く拾える構成に整理します。
permalink: /guides/
---

<div class="cards">
  {% for guide in site.guides %}
  <article class="card">
    <div class="article-meta">
      {% if guide.level %}<span class="badge">{{ guide.level }}</span>{% endif %}
      {% if guide.reading_time %}<span class="badge">{{ guide.reading_time }}</span>{% endif %}
    </div>
    <h3>{{ guide.title }}</h3>
    <p>{{ guide.summary }}</p>
    <a href="{{ guide.url | relative_url }}">記事を読む →</a>
  </article>
  {% endfor %}
</div>
