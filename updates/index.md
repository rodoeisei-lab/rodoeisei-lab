---
title: 最新アップデート
description: 法改正・通達・JIS/ISOの最新動向を要点で整理。
eyebrow: 更新情報
lead: 「何が変わる？誰に影響？いつから？」の3点だけ先に掴める一覧を目指します。
permalink: /updates/
---

<div class="cards">
  {% for update in site.updates %}
  {% assign update_title = update.title | default: update.slug | default: update.basename | default: "更新情報" %}
  {% assign update_summary = update.summary | default: update.excerpt | strip_html | truncate: 120 %}
  <article class="card">
    <div class="article-meta">
      {% if update.updated %}<span class="badge">{{ update.updated }}</span>{% endif %}
      {% if update.impact %}<span class="badge">{{ update.impact }}</span>{% endif %}
    </div>
    <h3>{{ update_title }}</h3>
    {% if update_summary %}<p>{{ update_summary }}</p>{% endif %}
    <a href="{{ update.url | relative_url }}">詳細を見る →</a>
  </article>
  {% endfor %}
</div>

<section style="margin-top: 32px;">
  <h2>更新ログ</h2>
  <div class="card">
    <ul>
      <li>2025-03-15｜粉じん測定の確認ポイントを更新｜現場担当者｜2025-03-20から｜<a href="{{ "/guides/" | relative_url }}">解説一覧</a></li>
      <li>2025-03-08｜労基署対応のチェックリストを追加｜衛生管理者｜2025-03-10から｜<a href="{{ "/inspection/" | relative_url }}">労基署対策</a></li>
      <li>2025-03-01｜資格対策の導入ページを整理｜受験予定者｜2025-03-05から｜<a href="{{ "/licenses/" | relative_url }}">資格対策</a></li>
    </ul>
  </div>
</section>

<section style="margin-top: 32px;">
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
