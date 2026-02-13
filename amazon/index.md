---
title: おすすめ商品（Amazon）
description: 現場担当者向けに、労働衛生で使う保護具・測定器・備品のAmazonおすすめ商品をカテゴリ別に紹介。
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
      {% assign raw_url = item.url | to_s | strip %}
      {% if raw_url contains '://' %}
        {% assign item_url = raw_url %}
      {% else %}
        {% assign item_url = 'https://' | append: raw_url %}
      {% endif %}
      <article class="card">
        <span class="badge">{{ category.title }}</span>
        <h3>{{ item.name }}</h3>
        <p class="card-meta">{{ item.note }}</p>
        <ul>
          {% for bullet in item.bullets %}
          <li>{{ bullet }}</li>
          {% endfor %}
        </ul>
        <a class="card-button" href="{{ item_url }}" target="_blank" rel="noopener noreferrer sponsored">Amazonで見る</a>
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
        {% assign raw_url = item.url | to_s | strip %}
        {% if raw_url != "" %}
          {% if raw_url contains '://' %}
            {% assign item_url = raw_url %}
          {% elsif raw_url contains 'amzn.to' or raw_url contains 'amazon.' %}
            {% assign item_url = 'https://' | append: raw_url %}
          {% else %}
            {% assign item_url = 'https://www.amazon.co.jp/s?k=' | append: raw_url | url_encode %}
          {% endif %}
        <a class="card-button" href="{{ item_url }}" target="_blank" rel="noopener noreferrer">Amazonで見る</a>
        {% else %}
        <a class="card-button" href="https://www.amazon.co.jp/s?k={{ item.name | url_encode }}" target="_blank" rel="noopener noreferrer">Amazonで見る</a>
        <!-- TODO: replace with affiliate link -->
        {% endif %}
      </article>
      {% endunless %}
      {% endfor %}
    </div>
  </section>
  {% endfor %}
</div>
