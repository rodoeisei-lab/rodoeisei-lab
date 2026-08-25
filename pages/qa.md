---
layout: page
title: 公開Q&A
permalink: /qa/
description: 現場でよく出る労働衛生の疑問を、質問・結論・理由・根拠の順で確認できる公開Q&A一覧です。
eyebrow: Q&A
lead: 現場の疑問を、結論と根拠から確認できます。
---

<div class="qa-hub">
  <section class="card" aria-labelledby="qa-directory-title">
    <h2 id="qa-directory-title">掲載中のQ&A</h2>
    <p>現在は8件を公開しています。検索欄またはカテゴリから、確認したい質問を絞り込めます。</p>
    <p><small>法令・制度に関する判断では、各回答の注意事項と最新の一次情報も確認してください。</small></p>
  </section>

  <div class="filter-search">
    <label class="sr-only" for="cardSearch">公開Q&Aを検索</label>
    <input id="cardSearch" type="search" name="q" placeholder="例：第3管理区分、個人ばく露測定、SDS、有機溶剤">
  </div>
  <p id="cardNoResults" class="no-results" hidden>該当するQ&Aがありません。別の言葉で検索してください。</p>

  <nav class="tag-chips" aria-label="Q&Aのカテゴリ">
    <a class="tag-chip" href="{{ '/qa/' | relative_url }}">すべて</a>
    <a class="tag-chip" href="{{ '/qa/?tag=' | relative_url }}{{ '作業環境測定' | uri_escape }}">作業環境測定</a>
    <a class="tag-chip" href="{{ '/qa/?tag=' | relative_url }}{{ '局所排気装置' | uri_escape }}">局所排気装置</a>
    <a class="tag-chip" href="{{ '/qa/?tag=' | relative_url }}{{ '個人ばく露測定' | uri_escape }}">個人ばく露測定</a>
    <a class="tag-chip" href="{{ '/qa/?tag=' | relative_url }}{{ '化学物質管理' | uri_escape }}">化学物質管理</a>
    <a class="tag-chip" href="{{ '/qa/?tag=' | relative_url }}{{ '有機溶剤' | uri_escape }}">有機溶剤</a>
    <a class="tag-chip" href="{{ '/qa/?tag=' | relative_url }}{{ '衛生委員会' | uri_escape }}">衛生委員会</a>
  </nav>

  <h2>質問一覧</h2>
  <section class="qa-list" aria-label="公開Q&A一覧">
    <article
      class="qa-list-card"
      data-filter-card
      data-search="第3管理区分 作業環境測定 粉じん 有機溶剤 原因 発生源対策 再測定"
      data-tags="作業環境測定|粉じん|有機溶剤"
    >
      <span class="qa-list-category">作業環境測定</span>
      <h2>作業環境測定で第3管理区分になった場合、まず何を優先して対応すべき？</h2>
      <p>測定条件と作業実態から原因を確認し、発生源対策と対策後の再測定へ進む基本順序を整理します。</p>
      <a href="{{ '/qa/third-control-class/' | relative_url }}">回答を見る →</a>
    </article>

    <article
      class="qa-list-card"
      data-filter-card
      data-search="個人サンプリング法 A測定 B測定 C測定 D測定 作業環境測定 個人ばく露測定 代わり"
      data-tags="作業環境測定|個人ばく露測定|個人サンプリング法"
    >
      <span class="qa-list-category">作業環境測定</span>
      <h2>個人サンプリング法は、A・B測定の代わりになる？</h2>
      <p>個人サンプリング法によるC・D測定と、A・B測定、一般的な個人ばく露測定の違いを整理します。</p>
      <a href="{{ '/qa/personal-sampling-ab-measurement/' | relative_url }}">回答を見る →</a>
    </article>

    <article
      class="qa-list-card"
      data-filter-card
      data-search="個人ばく露測定 2026年10月 資格 実施者 作業環境測定士 オキュペイショナルハイジニスト サンプリング"
      data-tags="個人ばく露測定|作業環境測定|制度改正"
    >
      <span class="qa-list-category">個人ばく露測定</span>
      <h2>2026年10月から、個人ばく露測定は誰が実施する？</h2>
      <p>対象となる測定と、デザイン・サンプリング・分析を担う実施体制の確認点を整理します。</p>
      <a href="{{ '/qa/personal-exposure-measurement-2026/' | relative_url }}">回答を見る →</a>
    </article>

    <article
      class="qa-list-card"
      data-filter-card
      data-search="化学物質 リスクアセスメント 見直し 毎年 SDS 更新 製品変更 工程変更 濃度基準値"
      data-tags="化学物質管理|リスクアセスメント|SDS"
    >
      <span class="qa-list-category">化学物質管理</span>
      <h2>化学物質のリスクアセスメントは、毎年見直す必要がある？</h2>
      <p>年1回の形式的な更新ではなく、製品・工程・SDSなどの変化をきっかけに見直す方法を整理します。</p>
      <a href="{{ '/qa/risk-assessment-review/' | relative_url }}">回答を見る →</a>
    </article>

    <article
      class="qa-list-card"
      data-filter-card
      data-search="SDS 安全データシート 第15項 第3項 成分 含有率 危険有害性 保護具 換気"
      data-tags="化学物質管理|SDS|安全データシート"
    >
      <span class="qa-list-category">化学物質管理</span>
      <h2>SDSは、第15項だけ確認すればよい？</h2>
      <p>製品・成分・危険有害性・ばく露防止・法令情報を、現場の作業条件と照合する順番を整理します。</p>
      <a href="{{ '/qa/sds-check-order/' | relative_url }}">回答を見る →</a>
    </article>

    <article
      class="qa-list-card"
      data-filter-card
      data-search="第2種有機溶剤 有機則 SDS 第3項 成分 含有率 製品名 対象物質検索"
      data-tags="有機溶剤|化学物質管理|SDS"
    >
      <span class="qa-list-category">有機溶剤</span>
      <h2>第2種有機溶剤かどうかは、どう確認する？</h2>
      <p>製品名ではなく、SDSの成分・含有率と現行法令を照合する確認手順を整理します。</p>
      <a href="{{ '/qa/second-organic-solvent-check/' | relative_url }}">回答を見る →</a>
    </article>

    <article
      class="qa-list-card"
      data-filter-card
      data-search="局所排気装置 点検 定期自主検査 作業主任者 周期 記録 有機則 特化則 鉛則 粉じん則"
      data-tags="局所排気装置|設備管理"
    >
      <span class="qa-list-category">局所排気装置</span>
      <h2>局所排気装置は、どの頻度で点検し、何を記録する？</h2>
      <p>一律の周期で判断せず、作業主任者による点検と定期自主検査を区別して、適用規則ごとに確認します。</p>
      <a href="{{ '/qa/local-exhaust-inspection/' | relative_url }}">回答を見る →</a>
    </article>

    <article
      class="qa-list-card"
      data-filter-card
      data-search="衛生委員会 議題 形骸化 現場課題 議事録 担当者 期限 安全衛生体制"
      data-tags="衛生委員会|安全衛生体制"
    >
      <span class="qa-list-category">衛生委員会</span>
      <h2>衛生委員会の議題が形骸化しているとき、どう立て直す？</h2>
      <p>現場のデータから改善テーマを決め、担当者・期限・次回の確認までを議事録に残す進め方を整理します。</p>
      <a href="{{ '/qa/hygiene-committee-agenda/' | relative_url }}">回答を見る →</a>
    </article>
  </section>

  <section class="card">
    <h2>一覧にないテーマを探す</h2>
    <p>公開Q&A以外の解説記事や用語は、サイト内検索または労働衛生ナビから探せます。</p>
    <p><a href="{{ '/search/' | relative_url }}">サイト内検索へ →</a></p>
    <p><a href="{{ '/navigator/' | relative_url }}">労働衛生ナビへ →</a></p>
  </section>
</div>

<script src="{{ '/assets/js/card-filter.js' | relative_url }}" defer></script>
