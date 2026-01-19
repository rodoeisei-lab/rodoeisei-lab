---
title: 道具棚
description: 保護具・測定器材・記録テンプレの選定ポイント。
eyebrow: Tools
lead: 現場で迷いやすい「選定・更新・保守」をシンプルに整理します。
permalink: /products/
---

{% for section in site.data.products %}
<section class="tools-category">
  <h2>{{ section.title }}</h2>
  <ul class="tools-guide">
    {% for line in section.guide %}
    <li>{{ line }}</li>
    {% endfor %}
  </ul>
  <div class="cards">
    {% for card in section.cards %}
    <article class="card">
      <h3>{{ card.title }}</h3>
      <p>{{ card.description }}</p>
      {% if card.link %}
      <a href="{{ card.link | relative_url }}">{{ card.link_label }}</a>
      {% else %}
      <p class="card-meta">準備中</p>
      {% endif %}
    </article>
    {% endfor %}
  </div>
  <div class="tools-alternatives">
    {% for alt in section.alternatives %}
    <span>{{ alt }}</span>
    {% endfor %}
  </div>
</section>
{% endfor %}
