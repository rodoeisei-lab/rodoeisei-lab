---
title: 解説
description: 粉じん・有機溶剤・作業環境測定・労基署対策など、一次情報ベースの解説一覧。
eyebrow: ガイド
lead: 難易度や読む目的に合わせて、今必要な情報だけを素早く拾える構成に整理します。
permalink: /guides/
---

<h2 id="getting-started">まず最初に読む（全体像）</h2>
<p>はじめて読む方向けに、全体像をつかむ3本を先に案内します。</p>
{% assign featured_guides = site.guides | where: "status", "published" | where: "featured", true %}
<div class="cards guides-cards">
  {% for guide in featured_guides %}
    {% include guide_card.html guide=guide %}
  {% endfor %}
</div>

<h2>解説一覧</h2>
{% assign published_guides = site.guides | where: "status", "published" | where_exp: "guide", "guide.featured != true" | sort: "updated" | reverse %}
<div class="cards guides-cards">
  {% for guide in published_guides %}
    {% include guide_card.html guide=guide %}
  {% endfor %}
</div>

<h2>準備中</h2>
{% assign wip_guides = site.guides | where: "status", "wip" | sort: "title" %}
<div class="cards guides-cards">
  {% for guide in wip_guides %}
    {% include guide_card.html guide=guide %}
  {% endfor %}
</div>
