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
