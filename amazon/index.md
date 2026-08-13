---
title: Amazonで探せる労働衛生の道具
description: 防じんマスク、保護めがね、耳栓、作業用手袋、照度計のAmazon掲載商品5件を用途と注意点付きで紹介。
eyebrow: Amazon商品一覧
lead: 既存の5商品を、購入前の確認事項とメーカー情報が分かる形に整理しました。
permalink: /amazon/
---

<div class="amazon-page">
  <aside class="affiliate-disclosure" aria-label="広告について">
    <strong>広告について</strong>
    <p>Amazonのアソシエイトとして、労働衛生ラボは適格販売により収入を得ています。</p>
    <p>「Amazonで確認する」ボタンはアフィリエイトリンクです。リンク経由の購入で当サイトに紹介料が入る場合がありますが、購入者の支払額は変わりません。</p>
  </aside>

  <section class="amazon-listing-policy" id="fixed-recommendations" aria-labelledby="amazon-policy-title">
    <p class="section-kicker">掲載ルール</p>
    <h2 id="amazon-policy-title">5件を用途別に掲載</h2>
    <ul>
      <li>価格は掲載せず、販売状況と価格はAmazonの商品ページで確認します。</li>
      <li>掲載順はランキングではありません。</li>
      <li>保護具は商品名だけで決めず、先に<a href="{{ '/products/' | relative_url }}">道具棚の選定基準</a>を確認します。</li>
      <li>商品名とリンク先は2026年8月13日に確認しています。</li>
    </ul>
  </section>

  <nav class="amazon-category-nav" aria-label="Amazon商品のカテゴリ">
    <span>カテゴリ</span>
    <ul>
      {% for category in site.data.amazon %}
      <li><a href="#{{ category.id }}">{{ category.title }}</a></li>
      {% endfor %}
    </ul>
  </nav>

  {% for category in site.data.amazon %}
  <section class="amazon-category" id="{{ category.id }}">
    <header class="amazon-category-header">
      <p class="section-kicker">{{ forloop.index | prepend: '0' }}</p>
      <h2>{{ category.title }}</h2>
      <p>{{ category.selection_note }}</p>
    </header>

    <div class="amazon-product-grid">
      {% for item in category.items %}
      <article class="amazon-product-card">
        <div class="amazon-product-badges">
          <span class="badge">掲載商品</span>
          <span class="affiliate-label">広告</span>
        </div>
        <h3>{{ item.name }}</h3>
        <p class="amazon-product-use"><strong>向く用途：</strong>{{ item.use_case }}</p>

        <div class="amazon-product-checks">
          <h4>購入前に確認</h4>
          <ul>
            {% for check in item.checks %}
            <li>{{ check }}</li>
            {% endfor %}
          </ul>
        </div>

        <p class="amazon-product-caution"><strong>注意：</strong>{{ item.caution }}</p>

        <div class="amazon-product-actions">
          <a class="card-button amazon-button" href="{{ item.url }}" target="_blank" rel="noopener noreferrer sponsored">Amazonで確認する</a>
          {% if item.source_url %}
          <a class="link-action" href="{{ item.source_url }}" target="_blank" rel="noopener noreferrer">{{ item.source_label }} →</a>
          {% endif %}
        </div>
        <p class="affiliate-inline">Amazonリンクはアフィリエイトリンクです。</p>
        <p class="amazon-product-meta">ASIN：{{ item.asin }} ／ リンク先確認：{{ item.checked_at }}</p>
      </article>
      {% endfor %}
    </div>
  </section>
  {% endfor %}

  <aside class="amazon-final-note">
    <h2>購入後も現場で確認する</h2>
    <p>届いた商品の型式・サイズ・使用期限・取扱説明書を確認し、実際の作業条件に適合しない場合は使用しないでください。商品ページの内容や販売者は変更されることがあります。</p>
  </aside>
</div>
