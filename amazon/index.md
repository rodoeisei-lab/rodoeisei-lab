---
title: おすすめ商品（Amazon）
description: 労働衛生の現場で使いやすいAmazon商品をまとめています。
eyebrow: Amazon
lead: 現場での選定や共有がしやすい、定番アイテムをAmazonカテゴリ別に紹介します。
permalink: /amazon/
---

<div class="amazon-page">
  <div class="affiliate-disclosure">
    <p>Amazonのアソシエイトとして、{{ site.title }}は適格販売により収入を得ています。</p>
  </div>

  <section class="amazon-category" id="fixed-recommendations">
    <header class="amazon-category-header">
      <h2>固定おすすめ（アフィリンク）</h2>
      <ul class="amazon-category-guide">
        <li>アフィリンク済みの定番アイテムを先頭に集約。</li>
        <li>必要に応じて各カテゴリの詳細へ移動できます。</li>
      </ul>
    </header>

    <div class="cards">
      {% for category in site.data.amazon %}
      {% for item in category.items %}
      {% if item.url contains 'amzn.to' %}
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
      {% endif %}
      {% endfor %}
      {% endfor %}
    </div>
  </section>

  <nav class="amazon-category-nav" aria-label="Amazonカテゴリ">
    <span>カテゴリ：</span>
    <ul>
      <li><a href="#fixed-recommendations">固定おすすめ</a></li>
      {% for category in site.data.amazon %}
      <li><a href="#{{ category.id | default: category.title | slugify }}">{{ category.title }}</a></li>
      {% endfor %}
    </ul>
  </nav>

  {% for category in site.data.amazon %}
  <section class="amazon-category" id="{{ category.id | default: category.title | slugify }}">
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
      {% unless item.url contains 'amzn.to' %}
      <article class="card">
        <span class="badge">{{ category.title }}</span>
        <h3>{{ item.name }}</h3>
        <p class="card-meta">{{ item.note }}</p>
        <ul>
          {% for bullet in item.bullets %}
          <li>{{ bullet }}</li>
          {% endfor %}
        </ul>
        {% if item.url != "" %}
        <a class="card-button" href="{{ item.url }}" target="_blank" rel="noopener">Amazonで見る</a>
        {% else %}
        <a class="card-button" href="https://www.amazon.co.jp/s?k={{ item.name | url_encode }}" target="_blank" rel="noopener">Amazonで見る</a>
        <!-- TODO: replace with affiliate link -->
        {% endif %}
      </article>
      {% endunless %}
      {% endfor %}
    </div>
  </section>
  {% endfor %}
</div>
