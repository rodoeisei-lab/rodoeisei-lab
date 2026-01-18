---
title: 最新アップデート
description: 法改正・通達・JIS/ISOの最新動向を要点で整理。
eyebrow: Updates
lead: 「何が変わる？誰に影響？いつから？」の3点だけ先に掴める一覧を目指します。
permalink: /updates/
---

<div class="cards">
  {% for update in site.updates %}
  <article class="card">
    <div class="article-meta">
      {% if update.updated %}<span class="badge">{{ update.updated }}</span>{% endif %}
      {% if update.impact %}<span class="badge">{{ update.impact }}</span>{% endif %}
    </div>
    <h3>{{ update.title }}</h3>
    <p>{{ update.summary }}</p>
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
