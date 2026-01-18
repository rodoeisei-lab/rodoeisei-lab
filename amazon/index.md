---
title: 道具棚
description: 労働衛生の現場で使いやすい道具をまとめています。
eyebrow: Amazon
lead: 現場での選定や共有がしやすい、定番アイテムをカテゴリ別に紹介します。
permalink: /amazon/
---

<div class="amazon-page">
  <div class="affiliate-disclosure">
    <p>Amazonのアソシエイトとして、{{ site.title }}は適格販売により収入を得ています。</p>
  </div>

  <nav class="amazon-category-nav" aria-label="Amazonカテゴリ">
    <span>カテゴリ：</span>
    <ul>
      {% for category in site.data.amazon %}
      <li><a href="#{{ category.title | slugify }}">{{ category.title }}</a></li>
      {% endfor %}
    </ul>
  </nav>

  {% for category in site.data.amazon %}
  <section class="amazon-category" id="{{ category.title | slugify }}">
    <header class="amazon-category-header">
      <h2>{{ category.title }}</h2>
      <ul class="amazon-category-guide">
        {% for line in category.guide %}
        <li>{{ line }}</li>
        {% endfor %}
      </ul>
    </header>

    <div class="cards">
      {% for item in category.items %}
      <article class="card">
        <span class="badge">{{ category.title }}</span>
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
  </section>
  {% endfor %}
</div>
