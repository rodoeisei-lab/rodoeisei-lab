---
title: 解説
description: 現場担当者と管理者向けに、粉じん・有機溶剤・作業環境測定・労基署対応の実務解説を一覧化。
eyebrow: ガイド
lead: 難易度や読む目的に合わせて、今必要な情報だけを素早く拾える構成に整理します。
permalink: /guides/
---

<div class="filter-search">
  <label class="sr-only" for="cardSearch">検索</label>
  <input id="cardSearch" type="search" name="q" placeholder="例：粉じん、リスクアセスメント、フィットテスト…">
</div>
<p id="cardNoResults" class="no-results" hidden>該当する解説がありません。</p>
{% assign tag_list = "" | split: "" %}
{% assign tag_source = site.guides | where: "status", "published" %}
{% for guide in tag_source %}
  {% if guide.tags %}
    {% for tag in guide.tags %}
      {% unless tag_list contains tag %}
        {% assign tag_list = tag_list | push: tag %}
      {% endunless %}
    {% endfor %}
  {% endif %}
{% endfor %}
{% assign tag_list = tag_list | sort %}
{% if tag_list.size > 0 %}
<div class="tag-chips">
  <a class="tag-chip" href="{{ '/guides/' | relative_url }}">すべて</a>
  {% for tag in tag_list %}
    <a class="tag-chip" href="{{ '/guides/?tag=' | relative_url }}{{ tag | uri_escape }}">{{ tag }}</a>
  {% endfor %}
</div>
{% endif %}

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

## 分かること
- 粉じん・有機溶剤・測定・法令対応の論点整理。
- 目的別（入門/現場判断/監督署対応）の読み分け。
- 主要テーマごとの一次情報の当たりどころ。

## 対象読者
- はじめて衛生管理に関わる担当者。
- 現場判断の根拠を整理したい管理者。
- 監督署対応に向けて基礎を固めたい方。

## 使い方
1. 「まず最初に読む」から全体像を把握します。
2. 目的に近い解説カードを選び、必要な章だけ読みます。
3. 迷った用語は用語集で確認してから戻ります。

## FAQ
### Q1. どの記事から読むべきですか？
**A.** 迷ったら「まず最初に読む（全体像）」の3本から始めるのがおすすめです。

### Q2. 法令や数値の確認はどこでするべき？
**A.** 記事内の一次情報の参照先を起点に、最新の法令や通達で要確認です。

### Q3. 追加してほしいテーマはどこから依頼できますか？
**A.** お問い合わせページから希望テーマと背景を送ってください。

## 関連ページ
- [用語集]({{ "/glossary/" | relative_url }})
- [道具棚]({{ "/products/" | relative_url }})
- [労基署対策]({{ "/inspection/" | relative_url }})
- [資格対策]({{ "/licenses/" | relative_url }})
- [最新アップデート]({{ "/updates/" | relative_url }})

<script src="{{ '/assets/js/card-filter.js' | relative_url }}" defer></script>
