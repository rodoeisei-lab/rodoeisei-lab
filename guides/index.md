---
title: 解説
description: 粉じん・有機溶剤・作業環境測定・労基署対策など、一次情報ベースの解説一覧。
eyebrow: Guides
lead: 難易度や読む目的に合わせて、今必要な情報だけを素早く拾える構成に整理します。
permalink: /guides/
---

<h2 id="getting-started">まず最初に読む（全体像）</h2>
<p>はじめて読む方向けに、全体像をつかむ3本を先に案内します。</p>
<div class="cards" style="margin-bottom: 24px;">
  <article class="card">
    <h3>フィットテスト導入の最小セット</h3>
    <p>制度導入の要点と最小フローを把握。</p>
    <a href="{{ "/guides/fit-test/" | relative_url }}">この記事から始める →</a>
  </article>
  <article class="card">
    <h3>作業環境測定の超入門（準備中）</h3>
    <p>測定対象と頻度の全体像を整理。</p>
    <a href="{{ "/guides/" | relative_url }}">解説一覧を見る →</a>
  </article>
  <article class="card">
    <h3>有機溶剤の基礎（準備中）</h3>
    <p>現場で押さえるべき最低限の用語を整理。</p>
    <a href="{{ "/guides/" | relative_url }}">解説一覧を見る →</a>
  </article>
</div>

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
