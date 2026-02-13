---
title: 用語集
description: 初学者と実務担当者向けに、管理濃度・TWA・フィットテストなど労働衛生キーワードを短く確認できる用語集。
eyebrow: 用語集
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
    {% capture data_attrs %}data-glossary-card data-search="{{ search_text | strip | escape }}"{% endcapture %}
    {% capture body %}
      {% if entry.reading %}
        <p class="guide-meta">よみ: {{ entry.reading }}</p>
      {% endif %}
      <p>{{ entry.short }}</p>
      <p class="glossary-detail">{{ entry.detail | newline_to_br }}</p>
      {% if entry.term == "フィットテスト" or entry.term == "フィットファクタ" %}
        <p><a href="{{ '/guides/fit-test/' | relative_url }}">この用語が出てくる「フィットテスト導入ガイド」を読む</a></p>
        <p><a href="{{ '/updates/ppe-checklist/' | relative_url }}">運用面の更新情報「PPE点検ルール」を確認する</a></p>
      {% elsif entry.term == "管理区分" or entry.term == "作業環境測定" %}
        <p><a href="{{ '/guides/work-env-measurement-intro/' | relative_url }}">測定評価の流れを「作業環境測定の超入門」で確認する</a></p>
        <p><a href="{{ '/updates/' | relative_url }}">測定制度に関する最新の更新情報を見る</a></p>
      {% elsif entry.term == "有機溶剤中毒予防規則" %}
        <p><a href="{{ '/guides/organic-solvent-basics/' | relative_url }}">有機溶剤の基本対策をガイドで確認する</a></p>
        <p><a href="{{ '/updates/' | relative_url }}">規則改正の有無を最新アップデートで確認する</a></p>
      {% endif %}
    {% endcapture %}
    {% assign related_meta = nil %}
    {% if entry.related %}
      {% capture related_meta %}関連: {{ entry.related | join: " / " }}{% endcapture %}
    {% endif %}
    {% include list-card.html
      class="glossary-card"
      title=entry.term
      body=body
      tags=entry.tags
      meta=related_meta
      data_attrs=data_attrs
    %}
  {% endfor %}
</div>

## 分かること
- 主要な労働衛生用語の最小定義と文脈の違い。
- 似ている用語の使い分けと、関連語のつながり。
- 現場説明でよく問われるキーワードの要点。

## 対象読者
- 用語の意味を短時間で確認したい現場担当者。
- 解説記事を読む前に基礎語彙を揃えたい学習者。
- 監督署対応で正確な用語説明が必要な管理者。

## 使い方
1. 検索欄に用語や関連語（例：管理濃度、TWA）を入力します。
2. カード内の「よみ」「関連」欄で似た語を拾い、併読します。
3. 用語の背景を知りたい場合は解説ページへ移動します。

## FAQ
### Q1. 読み方がわからない用語はどう探しますか？
**A.** 読み仮名が分からなくても、略語や関連語を入力して検索できます。

### Q2. 用語の定義が現場の運用と違うときは？
**A.** 所轄の運用や最新法令の解釈が優先されるため、解説ページと合わせて要確認です。

### Q3. 用語カードの情報は更新されますか？
**A.** 更新情報ページで追加・更新の履歴を追えます。

## 関連ページ
- [用語の背景と実務手順を解説ページで確認する]({{ "/guides/" | relative_url }})
- [道具棚]({{ "/products/" | relative_url }})
- [労基署対策]({{ "/inspection/" | relative_url }})
- [資格対策]({{ "/licenses/" | relative_url }})
- [関連制度の変更点を最新アップデートで確認する]({{ "/updates/" | relative_url }})

<script src="{{ '/assets/js/glossary-search.js' | relative_url }}" defer></script>
