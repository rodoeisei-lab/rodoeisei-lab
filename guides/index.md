---
title: 解説
description: 現場担当者と管理者向けに、粉じん・有機溶剤・作業環境測定・労基署対応の実務解説を一覧化。
eyebrow: ガイド
lead: 難易度や読む目的に合わせて、必要な情報を探せます。
permalink: /guides/
---

<div class="guides-hub">
  <section class="guides-hub__intro"><h2>読む順番からも、テーマからも探せます</h2><p>初めての方は<a href="{{ '/learn/' | relative_url }}">学習ロードマップ</a>へ。必要な解説が決まっている方は、キーワード・分野・難易度で絞り込めます。</p></section>
  {% assign published_guides = site.guides | where: 'status', 'published' | sort: 'updated' | reverse %}
  <section class="guides-hub__search" aria-labelledby="guide-search-title">
    <h2 id="guide-search-title">解説を絞り込む</h2>
    <div class="guide-filters">
      <label class="filter-search" for="cardSearch">キーワード<input id="cardSearch" type="search" name="q" placeholder="例：粉じん、SDS、フィットテスト" maxlength="100"></label>
      <label for="cardCategory">分野<select id="cardCategory"><option value="">すべての分野</option>{% assign categories = published_guides | map: 'category' | uniq | sort %}{% for category in categories %}<option value="{{ category | escape }}">{{ category }}</option>{% endfor %}</select></label>
      <label for="cardLevel">難易度<select id="cardLevel"><option value="">すべて</option><option>入門</option><option>基礎</option><option>実務</option><option>専門</option></select></label>
    </div>
    <p id="cardResultsStatus" role="status" aria-live="polite">全{{ published_guides.size }}件</p>
    <button type="button" class="btn-step" id="cardClear">絞り込みを解除</button>
    <p id="cardNoResults" class="no-results" hidden>該当する解説がありません。言葉を短くするか、分野・難易度を「すべて」に戻してください。<a href="{{ '/search/' | relative_url }}">本文も含めてサイト内検索する</a>こともできます。</p>
  </section>
  <section class="guides-hub__section" aria-labelledby="all-guides-title"><h2 id="all-guides-title">公開中の解説</h2>
    <div class="cards guides-cards">{% for guide in published_guides %}{% include guide_card.html guide=guide %}{% endfor %}</div>
  </section>
</div>
<script src="{{ '/assets/js/card-filter.js' | relative_url }}" defer></script>
