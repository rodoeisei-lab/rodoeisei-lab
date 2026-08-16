---
title: 最新アップデート
description: 労働衛生に関する法改正・通達・公的資料のうち、一次情報と内容を確認できた更新だけを掲載するページです。
eyebrow: 更新情報
lead: 一次情報、対象、施行時期を確認できた更新から掲載します。
permalink: /updates/
updated_at: 2026-08-16
noindex: true
pagefind_ignore: true
---

{% assign updates_sorted = site.updates | where: "status", "published" | sort: "updated" | reverse %}

{% if updates_sorted.size > 0 %}
<div class="filter-search">
  <label class="sr-only" for="cardSearch">検索</label>
  <input id="cardSearch" type="search" name="q" placeholder="例：改正、省令、管理濃度…">
</div>
<p id="cardNoResults" class="no-results" hidden>該当する更新がありません。</p>

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

<section class="section updates-log">
  <h2>更新ログ</h2>
  <div class="card updates-log-card">
    <div class="updates-log-grid updates-log-header">
      <span>日付</span>
      <span>タイトル</span>
      <span>対象</span>
      <span>いつから</span>
      <span>リンク</span>
    </div>
    {% for update in updates_sorted %}
      {% assign update_title = update.title | default: update.slug | default: update.basename | default: "更新情報" %}
      <div class="updates-log-grid">
        <span>{{ update.updated | default: "日付未記入" }}</span>
        <span>{{ update_title }}</span>
        <span>{{ update.target | default: "対象未記入" }}</span>
        <span>{{ update.effective_from | default: "要確認" }}</span>
        <span><a href="{{ update.url | relative_url }}">詳細</a></span>
      </div>
    {% endfor %}
  </div>
</section>
{% else %}
<div class="card">
  <h2>現在、公開中の更新情報はありません</h2>
  <p>法改正や通達について、一次情報、対象、施行時期を確認できたものから追加します。</p>
  <p>現行の法令を確認する場合は、法令・規則ページからe-Gov法令検索などの公式情報へ進んでください。</p>
  <p><a href="{{ '/regulations/' | relative_url }}">法令・規則を確認する →</a></p>
</div>
{% endif %}

## 分かること
- 法改正・通達・JIS/ISOの更新概要と影響範囲。
- いつから適用か、誰に影響があるかの整理。
- 内容確認に使用した一次情報。

## 対象読者
- 法改正の影響を素早く把握したい管理者。
- 監督署対応や社内説明の準備をしたい方。
- 更新情報を継続的に追いたい担当者。

## 使い方
1. 一覧カードで「更新日・影響」を確認します。
2. 詳細ページで背景と対応の要点をチェックします。
3. 重要更新は解説ページや資料に反映します。

## FAQ
### Q1. 更新情報はいつ追加されますか？
**A.** 法改正や通達が出たタイミングで随時追加します。

### Q2. 影響度の判断基準は？
**A.** 現場対応の必要性と期限の近さを基準に要約しています。

### Q3. 追加したい更新情報がある場合は？
**A.** お問い合わせから情報源と要点を送ってください。

## 関連ページ
- [更新内容の背景を解説記事で確認する]({{ "/guides/" | relative_url }})
- [労基署対策]({{ "/inspection/" | relative_url }})
- [資格対策]({{ "/licenses/" | relative_url }})
- [通達や測定で出る専門用語を用語集で確認する]({{ "/glossary/" | relative_url }})
- [SNSリンク集]({{ "/sns-links/" | relative_url }})

<script src="{{ '/assets/js/card-filter.js' | relative_url }}" defer></script>
