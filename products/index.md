---
title: 道具棚｜保護具・簡易測定器の選び方
description: 呼吸用保護具、保護めがね、耳栓、作業用手袋、簡易測定器を商品名から選ばないための確認項目を整理。
eyebrow: 道具棚
lead: 商品を見る前に、対象物・必要性能・サイズ・管理方法を確認するためのページです。
permalink: /products/
---

<div class="tools-shelf">
  <section class="tools-intro" aria-labelledby="shelf-start-title">
    <p class="section-kicker">使い方</p>
    <h2 id="shelf-start-title">作業条件から道具を絞る</h2>
    <ol class="tool-selection-steps">
      <li><strong>危険源を確認</strong><span>粉じん、ガス・蒸気、飛来物、騒音、薬品などを特定します。</span></li>
      <li><strong>必要性能を決定</strong><span>法令、リスクアセスメント、SDS、メーカー資料から必要な区分や性能を決めます。</span></li>
      <li><strong>着用者・運用に合わせる</strong><span>サイズ、フィット、交換、保守、教育まで現場で回るかを確認します。</span></li>
      <li><strong>商品を確認</strong><span>条件を満たす候補として、商品ページや販売ページを確認します。</span></li>
    </ol>
    <p><a class="cta-secondary" href="{{ '/amazon/' | relative_url }}">掲載中のAmazon商品5件を見る</a></p>
  </section>

  <nav class="tool-category-nav" aria-label="道具棚のカテゴリ">
    <span>カテゴリ</span>
    <ul>
      {% for section in site.data.products %}
      <li><a href="#{{ section.id }}">{{ section.title }}</a></li>
      {% endfor %}
    </ul>
  </nav>

  {% for section in site.data.products %}
  <section class="tools-category" id="{{ section.id }}">
    <header class="tools-category-header">
      <p class="section-kicker">{{ forloop.index | prepend: '0' }}</p>
      <h2>{{ section.title }}</h2>
      <p>{{ section.summary }}</p>
    </header>

    <div class="tool-check-grid">
      {% for check in section.checks %}
      <article class="tool-check-item">
        <span class="tool-check-number" aria-hidden="true">{{ forloop.index }}</span>
        <div>
          <h3>{{ check.label }}</h3>
          <p>{{ check.detail }}</p>
        </div>
      </article>
      {% endfor %}
    </div>

    <p class="tool-warning"><strong>注意：</strong>{{ section.warning }}</p>

    <div class="tool-category-actions">
      <a class="cta-secondary" href="{{ section.amazon_url | relative_url }}">関連するAmazon掲載商品を見る</a>
      {% if section.related_url %}
      <a class="link-action" href="{{ section.related_url | relative_url }}">{{ section.related_label }} →</a>
      {% endif %}
    </div>
  </section>
  {% endfor %}

  <section class="tools-policy" aria-labelledby="shelf-final-title">
    <p class="section-kicker">最終確認</p>
    <h2 id="shelf-final-title">販売ページだけで選定を完結させない</h2>
    <p>Amazonの商品説明やレビューは候補確認には便利ですが、法令への適合、使用可能時間、必要な保護性能を保証する資料ではありません。正式な選定では、メーカーの仕様書・取扱説明書と現場条件を照合してください。</p>
  </section>
</div>
