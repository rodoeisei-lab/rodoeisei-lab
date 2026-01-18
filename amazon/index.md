---
title: おすすめ商品
description: 労働衛生の現場で使いやすい道具をまとめています。
eyebrow: Amazon
lead: 現場での選定や共有がしやすい、定番アイテムをカテゴリ別に紹介します。
permalink: /amazon/
---

<div class="amazon-page">
  <div class="affiliate-disclosure">
    <p>Amazonのアソシエイトとして、{{ site.title }}は適格販売により収入を得ています。</p>
  </div>

  <div class="cards">
    {% for item in site.data.amazon %}
    <article class="card">
      <span class="badge">{{ item.category }}</span>
      <h3>{{ item.name }}</h3>
      <p class="card-meta">{{ item.note }}</p>
      <ul>
        {% for bullet in item.bullets %}
        <li>{{ bullet }}</li>
        {% endfor %}
      </ul>
      <a class="card-button" href="{{ item.url }}" target="_blank" rel="noopener sponsored">Amazonで見る</a>
    </article>
    {% endfor %}
  </div>
</div>
