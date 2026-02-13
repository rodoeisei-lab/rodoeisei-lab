---
layout: home
title: 労働衛生ラボ
description: 現場と法令の「あいだ」をつなぐ学習サイト
---

{% assign latest_guide = site.guides | where: "status", "published" | sort: "updated" | reverse | first %}
{% assign latest_update = site.updates | sort: "updated" | reverse | first %}

<div class="cards">
  {% if latest_guide %}
    {% include list-card.html
      title="最新の解説"
      description=latest_guide.summary
      link_url=latest_guide.url
      link_label="解説を読む →"
    %}
  {% endif %}
  {% if latest_update %}
    {% include list-card.html
      title="最新の更新"
      description=latest_update.summary
      link_url=latest_update.url
      link_label="更新を見る →"
    %}
  {% endif %}
  {% include list-card.html
    title="学習の入口"
    description="解説・資格・用語集など目的別に整理しています。"
    link_url="/learn/"
    link_label="学習へ →"
  %}
</div>
