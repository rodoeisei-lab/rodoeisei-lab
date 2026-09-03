---
title: 解説
description: 現場担当者と管理者向けに、粉じん・有機溶剤・作業環境測定・労基署対応の実務解説を一覧化。
eyebrow: ガイド
lead: 難易度や読む目的に合わせて、今必要な情報だけを素早く拾える構成に整理します。
permalink: /guides/
---

<div class="guides-hub">
  <section class="guides-hub__intro">
    <p class="section-kicker">解説ライブラリ</p>
    <h2>目的に合う解説へ、迷わず進む</h2>
    <p>まず基礎を読むか、テーマから探すか、キーワードで直接検索できます。</p>
  </section>

  <section class="guides-hub__search" aria-labelledby="guide-search-title">
    <div>
      <p class="section-kicker">キーワード検索</p>
      <h2 id="guide-search-title">必要な解説を探す</h2>
    </div>
    <div class="filter-search">
      <label for="cardSearch">検索キーワード</label>
      <input id="cardSearch" type="search" name="q" placeholder="例：粉じん、リスクアセスメント、フィットテスト">
    </div>
    <p id="cardNoResults" class="no-results" hidden>該当する解説がありません。</p>
  </section>

  <section class="guides-hub__section" aria-labelledby="getting-started">
    <div class="guides-hub__heading">
      <p class="section-kicker">最初の3本</p>
      <h2 id="getting-started">作業環境測定を基礎から読む</h2>
      <p>全体像 → 測定デザイン → サンプリングの順で読むと、測定の流れをつかみやすくなります。</p>
    </div>
    {% assign featured_guides = site.guides | where: "status", "published" | where: "featured", true %}
    <div class="cards guides-cards">
      {% for guide in featured_guides limit:3 %}
        {% include guide_card.html guide=guide %}
      {% endfor %}
    </div>
  </section>

  <section class="guides-hub__section" aria-labelledby="guide-themes-title">
    <div class="guides-hub__heading">
      <p class="section-kicker">テーマ別</p>
      <h2 id="guide-themes-title">分野から探す</h2>
    </div>
    <nav class="guides-topic-grid" aria-label="解説テーマ">
      <a href="{{ '/work-environment-measurement/' | relative_url }}"><strong>作業環境測定</strong><span>A・B・C・D測定、デザイン、サンプリング</span></a>
      <a href="{{ '/chemical-management/' | relative_url }}"><strong>化学物質管理</strong><span>SDS、リスクアセスメント、濃度基準値</span></a>
      <a href="{{ '/personal-exposure-measurement/' | relative_url }}"><strong>個人ばく露測定</strong><span>呼吸域、対象者選定、評価と対策</span></a>
      <a href="{{ '/local-exhaust-ventilation/' | relative_url }}"><strong>局所排気装置</strong><span>フード、ダクト、制御風速、改善</span></a>
      <a href="{{ '/guides/fit-test/' | relative_url }}"><strong>保護具・フィットテスト</strong><span>呼吸用保護具の選択と密着性確認</span></a>
      <a href="{{ '/licenses/' | relative_url }}"><strong>資格・キャリア</strong><span>作業環境測定士、オキュペイショナルハイジニスト、労働衛生コンサルタント</span></a>
    </nav>
  </section>

  <section class="guides-hub__section" aria-labelledby="recent-guides-title">
    <div class="guides-hub__heading">
      <p class="section-kicker">最近更新</p>
      <h2 id="recent-guides-title">最近更新した解説</h2>
    </div>
    {% assign recent_guides = site.guides | where: "status", "published" | sort: "updated" | reverse %}
    <div class="cards guides-cards guides-cards--recent">
      {% for guide in recent_guides limit:6 %}
        {% include guide_card.html guide=guide %}
      {% endfor %}
    </div>
  </section>

  <section class="guides-hub__section" aria-labelledby="all-guides-title">
    <div class="guides-hub__heading">
      <p class="section-kicker">一覧</p>
      <h2 id="all-guides-title">すべての解説</h2>
      <p>キーワード検索と組み合わせて、必要なテーマを絞り込めます。</p>
    </div>
    {% assign published_guides = site.guides | where: "status", "published" | sort: "updated" | reverse %}
    <div class="cards guides-cards">
      {% for guide in published_guides %}
        {% include guide_card.html guide=guide %}
      {% endfor %}
    </div>
  </section>
</div>

<script src="{{ '/assets/js/card-filter.js' | relative_url }}" defer></script>
