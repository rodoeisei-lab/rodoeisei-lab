---
title: 最新アップデート
description: 法改正・通達・JIS/ISOの最新動向を要点で整理。
eyebrow: 更新情報
lead: 「何が変わる？誰に影響？いつから？」の3点だけ先に掴める一覧を目指します。
permalink: /updates/
---

{% assign updates_sorted = site.updates | sort: "updated" | reverse %}

<div class="cards updates-cards">
  {% for update in updates_sorted %}
    {% assign update_title = update.title | default: update.slug | default: update.basename | default: "更新情報" %}
    {% assign update_summary = update.summary | default: update.excerpt | strip_html | truncate: 120 %}
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
      link_url=update.url | relative_url
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

<section class="section updates-template">
  <h2>更新追加のテンプレ</h2>
  <div class="card">
    <p>タイトル未入力でも一覧が崩れないようにしていますが、追加時は以下の項目を埋めてください。</p>
    <pre><code>---
layout: article
title: ここに更新タイトル
summary: 変更点の要約（1〜2行）
category: Updates
impact: 影響: 中
updated: 2025-04-01
target: 対象（例: 衛生管理者）
effective_from: 2025-04-15
lead: 先に伝えたい結論や注意点（任意）
---</code></pre>
  </div>
</section>

## 分かること
- 法改正・通達・JIS/ISOの更新概要と影響範囲。
- いつから適用か、誰に影響があるかの整理。
- 追加更新時の記載ルールとテンプレ。

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
- [解説一覧](/guides/)
- [労基署対策](/inspection/)
- [資格対策](/licenses/)
- [用語集](/glossary/)
- [SNSリンク集](/sns/)
