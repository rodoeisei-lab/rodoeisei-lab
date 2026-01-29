---
title: 用語集
description: 現場で迷いやすい用語を短く整理。
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
- [解説一覧](/guides/)
- [道具棚](/products/)
- [労基署対策](/inspection/)
- [資格対策](/licenses/)
- [最新アップデート](/updates/)

<script src="{{ '/assets/js/glossary-search.js' | relative_url }}" defer></script>
