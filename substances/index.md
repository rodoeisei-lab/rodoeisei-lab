---
title: 対象物質・制度検索
description: 第2種有機溶剤、特定化学物質、濃度基準値設定物質を制度別に検索し、作業環境測定・リスクアセスメントの確認入口を見つけるページです。
eyebrow: Chemical substances
lead: 物質名・CAS RN・制度区分から、確認する法令と濃度基準値を探せます。
permalink: /substances/
---

{% assign registry = site.data.substance_registry %}
{% assign records = registry.records %}

<div class="substance-registry">
  <section class="substance-registry__intro" aria-labelledby="substance-registry-intro-title">
    <p class="substance-registry__eyebrow">制度別の確認入口</p>
    <h2 id="substance-registry-intro-title">対象物質を、制度から探す</h2>
    <p>有機則・特化則・濃度基準値を横断して検索できます。同じ物質が複数の制度に表示されることがあります。該当性の判断では、物質名、含有率、作業内容、作業場所、設備、適用除外などを最新の一次情報で確認してください。</p>
    <div class="substance-registry__intro-links">
      <a href="{{ '/chemical-management/' | relative_url }}"><strong>化学物質管理の流れ</strong><span>把握からリスク低減までを確認</span></a>
      <a href="{{ '/work-environment-measurement/' | relative_url }}"><strong>作業環境測定の基礎</strong><span>測定計画と改善の考え方</span></a>
      <a href="{{ '/guides/personal-exposure-measurement-basics/' | relative_url }}"><strong>個人ばく露測定の基礎</strong><span>目的と使い分けを確認</span></a>
    </div>
  </section>

  <aside class="substance-registry__notice" aria-labelledby="substance-registry-notice-title">
    <h2 id="substance-registry-notice-title">検索結果の読み方</h2>
    <ul>
      <li><strong>第2種有機溶剤：</strong>有機則第1条の区分と、安衛令別表第六の二を確認する入口です。</li>
      <li><strong>特定化学物質：</strong>安衛令別表第三の類別を表示します。特別管理物質などの細分類は、個別の法令で確認してください。</li>
      <li><strong>濃度基準値：</strong>八時間・短時間濃度基準値、採取・分析方法を確認できます。確認測定を含むばく露状況の確認方法は、作業条件に応じて検討します。</li>
    </ul>
    <p><strong>CAS RNは参考情報です。</strong>濃度基準値等一覧でも、対象物質の当否はCAS RNではなく物質名で確認するよう示されています。</p>
  </aside>

  <section class="substance-registry__routes" aria-labelledby="substance-registry-routes-title">
    <div class="substance-registry__section-heading">
      <p class="substance-registry__eyebrow">検索結果の次に</p>
      <h2 id="substance-registry-routes-title">確認する制度と測定を、目的で分ける</h2>
      <p>物質が見つかっただけで、測定の要否・方法は決まりません。製品SDSと作業条件を合わせて、次の確認ルートへ進みます。</p>
    </div>
    <div class="substance-registry__route-grid">
      <a class="substance-registry__route-card" href="{{ '/substances/check-flow/#special-regulations' | relative_url }}">
        <span>第2種有機溶剤・特定化学物質</span>
        <strong>特別規則と指定作業場を確認</strong>
        <small>含有率、対象作業、作業場所、適用除外を合わせて確認</small>
      </a>
      <a class="substance-registry__route-card substance-registry__route-card--accent" href="{{ '/substances/check-flow/#concentration-standard' | relative_url }}">
        <span>濃度基準値設定物質</span>
        <strong>リスクアセスメントから確認測定へ</strong>
        <small>超過のおそれと屋内作業の条件から、必要な確認を考える</small>
      </a>
      <a class="substance-registry__route-card" href="{{ '/substances/check-flow/#risk-assessment' | relative_url }}">
        <span>検索で見つからない物質</span>
        <strong>SDS・公式対象物質検索を確認</strong>
        <small>掲載外でもリスクアセスメント対象外とは限らない</small>
      </a>
    </div>
    <a class="substance-registry__route-action" href="{{ '/substances/check-flow/' | relative_url }}">物質検索の後の確認フローを見る <span aria-hidden="true">→</span></a>
  </section>

  <section class="substance-registry__search" aria-labelledby="substance-search-title">
    <div class="substance-registry__section-heading">
      <p class="substance-registry__eyebrow">検索・絞り込み</p>
      <h2 id="substance-search-title">{{ records.size }}件の制度別レコード</h2>
    </div>

    <div class="substance-filter-controls">
      <div class="substance-filter-controls__group" role="group" aria-label="よく使う制度区分で絞り込み">
        <button class="substance-filter-button is-active" type="button" data-substance-filter="all" aria-pressed="true">すべて</button>
        <button class="substance-filter-button" type="button" data-substance-filter="organic-second" aria-pressed="false">第2種有機溶剤</button>
        <button class="substance-filter-button" type="button" data-substance-filter="specified" aria-pressed="false">特化則</button>
        <button class="substance-filter-button" type="button" data-substance-filter="concentration" aria-pressed="false">濃度基準値</button>
      </div>
      <label class="substance-search-field" for="substanceSearch">
        <span>物質名・別名・CAS RNで検索</span>
        <input id="substanceSearch" type="search" inputmode="search" autocomplete="off" placeholder="例：アセトン、ベンゼン、67-64-1" aria-controls="substanceResults">
      </label>
      <div class="substance-select-grid">
        <label for="substanceSystem"><span>制度</span><select id="substanceSystem"><option value="all">すべて</option><option value="organic-solvent">有機則</option><option value="specified-chemical">特化則</option><option value="concentration-standard">濃度基準値</option></select></label>
        <label for="substanceStatus"><span>施行状況</span><select id="substanceStatus"><option value="all">すべて</option><option value="current">施行済み・現行</option><option value="upcoming">施行予定</option></select></label>
      </div>
    </div>

    <p id="substanceResultStatus" class="substance-result-status" role="status" aria-live="polite">全{{ records.size }}件を表示しています。</p>
    <p id="substanceNoResults" class="substance-no-results" hidden>条件に合う物質が見つかりませんでした。物質名の一部、別名、CAS RNで再度検索してください。</p>

    <div id="substanceResults" class="substance-results">
      {% for record in records %}
      <article class="substance-card" data-substance-card data-search="{{ record.search_text | escape }}" data-system="{{ record.system_key }}" data-category="{{ record.category | escape }}" data-status="{{ record.status }}">
        <header class="substance-card__header">
          <div class="substance-card__badges">
            <span class="substance-badge substance-badge--system">{{ record.system | escape }}</span>
            <span class="substance-badge">{{ record.category | escape }}</span>
            {% if record.status == "upcoming" %}<span class="substance-badge substance-badge--upcoming">{{ record.status_label | escape }}</span>{% endif %}
          </div>
          <h3>{{ record.name | escape }}</h3>
          <p class="substance-card__basis">{{ record.law_basis | escape }}</p>
        </header>

        {% if record.system_key == "concentration-standard" %}
        <dl class="substance-value-grid">
          <div><dt>八時間濃度基準値</dt><dd>{{ record.eight_hour_value | default: "－" | escape }}</dd></div>
          <div><dt>短時間濃度基準値</dt><dd>{{ record.short_term_value | default: "－" | escape }}</dd></div>
          {% if record.cas_rns.size > 0 %}<div class="substance-value-grid__wide"><dt>CAS RN（参考）</dt><dd>{{ record.cas_rns | join: " / " | escape }}</dd></div>{% endif %}
          <div class="substance-value-grid__wide"><dt>適用期日</dt><dd>{{ record.application_date | default: record.status_label | escape }}</dd></div>
        </dl>
        {% endif %}

        <p class="substance-card__guidance">{{ record.guidance | escape }}</p>
        <details class="substance-card__details">
          <summary>根拠・測定方法を見る</summary>
          {% if record.system_key == "concentration-standard" %}
          <dl class="substance-detail-list">
            <div><dt>試料採取方法</dt><dd>{{ record.sampling_method | default: "公式一覧で確認" | escape }}</dd></div>
            <div><dt>分析方法</dt><dd>{{ record.analysis_method | default: "公式一覧で確認" | escape }}</dd></div>
            {% if record.application_date_source %}<div><dt>適用期日（原表記）</dt><dd>{{ record.application_date_source | escape }}</dd></div>{% endif %}
          </dl>
          {% endif %}
          <div class="substance-card__source-links">
            <a href="{{ record.source_url | escape }}" target="_blank" rel="noopener">{{ record.source_label | escape }}<span aria-hidden="true"> ↗</span></a>
            {% if record.classification_url %}<a href="{{ record.classification_url | escape }}" target="_blank" rel="noopener">{{ record.classification_label | escape }}<span aria-hidden="true"> ↗</span></a>{% endif %}
          </div>
        </details>
      </article>
      {% endfor %}
    </div>
  </section>

  <section class="substance-registry__scope" aria-labelledby="substance-registry-scope-title">
    <div>
      <p class="substance-registry__eyebrow">この第1版の範囲</p>
      <h2 id="substance-registry-scope-title">制度確認の入口から、順次拡張します</h2>
      <p>現在は、有機則・特化則・濃度基準値を掲載しています。リスクアセスメント対象物の網羅、特別管理物質・特別有機溶剤などの細分類、作業環境測定の対象業務の詳細一覧は、根拠資料を確認しながら追加します。</p>
    </div>
    <div class="substance-registry__source-panel">
      <strong>データ更新日：{{ registry.generated_at | escape }}</strong>
      <p>制度改正や告示の更新により内容が変わります。最終確認は一次情報で行ってください。</p>
      <ul>
        {% for source in registry.sources %}
        <li><a href="{{ source.url | escape }}" target="_blank" rel="noopener">{{ source.label | escape }}<span aria-hidden="true"> ↗</span></a><small>{{ source.used_for | escape }}</small></li>
        {% endfor %}
      </ul>
    </div>
  </section>
</div>

<script src="{{ '/assets/js/substance-registry.js' | relative_url }}" defer></script>
