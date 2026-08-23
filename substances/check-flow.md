---
title: 物質検索の後の確認フロー
description: 対象物質・制度検索の結果から、作業環境測定、濃度基準値の確認測定、リスクアセスメントのどれを確認するかを整理する実務用フローです。
eyebrow: Chemical substance routing
lead: 物質名だけで測定の要否を決めず、SDSと実際の作業条件を起点に、確認する制度と方法を分けます。
permalink: /substances/check-flow/
---

<div class="substance-check-flow">
  <section class="substance-check-flow__intro" aria-labelledby="check-flow-intro-title">
    <p class="substance-check-flow__eyebrow">検索結果を次の行動へ</p>
    <h2 id="check-flow-intro-title">物質が見つかった後に、確認すること</h2>
    <p>対象物質・制度検索は、法令と基準を調べる入口です。物質名が一致しても、製品中の含有率、作業内容、使用量、発散の状態、屋内・屋外、設備などで適用と確認方法が変わります。検索結果だけから、作業環境測定や個人ばく露測定の要否を確定しないでください。</p>
    <div class="substance-check-flow__intro-actions">
      <a class="cta-secondary" href="{{ '/substances/' | relative_url }}">対象物質・制度検索に戻る</a>
      <a class="cta-tertiary" href="{{ '/chemical-management/' | relative_url }}">化学物質管理の全体像を見る</a>
    </div>
  </section>

  <nav class="substance-check-flow__jump" aria-label="確認フローの目次">
    <a href="#prepare"><span>01</span>まずそろえる情報</a>
    <a href="#route"><span>02</span>検索結果ごとの確認ルート</a>
    <a href="#measurement"><span>03</span>測定目的の使い分け</a>
    <a href="#record"><span>04</span>判断と記録</a>
  </nav>

  <section id="prepare" class="substance-check-flow__section" aria-labelledby="prepare-title">
    <div class="substance-check-flow__heading">
      <p class="substance-check-flow__eyebrow">01｜出発点</p>
      <h2 id="prepare-title">製品情報と作業条件をそろえる</h2>
      <p>物質名だけでなく、SDSと現場の使い方を同じ単位で確認します。製品名で検索結果が出なくても、成分名で確認する必要があります。</p>
    </div>
    <ul class="substance-check-flow__checklist">
      <li><strong>製品・成分</strong><span>製品名、供給者、最新版のSDS、成分名、含有率、CAS RN、危険有害性情報</span></li>
      <li><strong>作業の内容</strong><span>使用量、頻度、作業時間、加熱・噴霧・研磨などの発散条件、清掃・保守を含む作業</span></li>
      <li><strong>作業場の条件</strong><span>屋内・屋外、発散源と作業者の位置、全体換気・局所排気装置、密閉化、保護具</span></li>
    </ul>
  </section>

  <section id="route" class="substance-check-flow__section" aria-labelledby="route-title">
    <div class="substance-check-flow__heading">
      <p class="substance-check-flow__eyebrow">02｜制度を分ける</p>
      <h2 id="route-title">検索結果ごとの確認ルート</h2>
      <p>一つの製品が複数の制度に関係することがあります。該当するルートを並行して確認します。</p>
    </div>
    <div class="substance-check-flow__route-grid">
      <article id="special-regulations" class="substance-check-flow__route-card">
        <p class="substance-check-flow__route-label">第2種有機溶剤・特定化学物質</p>
        <h3>特別規則と指定作業場を確認する</h3>
        <p>物質区分に加え、製品の含有率、対象作業、作業場所、適用除外を確認します。作業環境測定は、物質名の掲載だけで決まるものではなく、指定作業場や各規則の条件を確認します。</p>
        <div class="substance-check-flow__route-links">
          <a href="{{ '/guides/organic-solvent-basics/' | relative_url }}">有機則の確認ポイント</a>
          <a href="{{ '/guides/work-env-measurement-intro/' | relative_url }}">作業環境測定の基礎</a>
        </div>
      </article>
      <article id="concentration-standard" class="substance-check-flow__route-card substance-check-flow__route-card--accent">
        <p class="substance-check-flow__route-label">濃度基準値設定物質</p>
        <h3>リスクアセスメントから確認測定の要否を考える</h3>
        <p>濃度基準値のある物質では、まずリスクアセスメントと作業実態から、ばく露の程度を確認します。屋内作業で濃度基準値を超えるおそれを把握した場合は、技術上の指針に沿って、労働者の呼吸域で確認測定を行います。</p>
        <p class="substance-check-flow__route-note"><strong>注意：</strong>濃度基準値設定物質を、個人ばく露測定を一律に行う物質として扱いません。作業条件と評価の目的から必要性・方法を決めます。</p>
        <div class="substance-check-flow__route-links">
          <a href="{{ '/guides/management-concentration-exposure-limits/' | relative_url }}">濃度の指標を整理する</a>
          <a href="{{ '/guides/personal-exposure-measurement-basics/' | relative_url }}">個人ばく露測定の基礎</a>
        </div>
      </article>
      <article id="risk-assessment" class="substance-check-flow__route-card">
        <p class="substance-check-flow__route-label">検索で見つからない・掲載外の物質</p>
        <h3>リスクアセスメント対象かを別途確認する</h3>
        <p>この検索は、有機則・特化則・濃度基準値の入口です。掲載がないことは、リスクアセスメント、ラベル表示、SDS交付などの対象外を意味しません。SDSと公式の対象物質検索、リスクアセスメント支援情報で確認します。</p>
        <div class="substance-check-flow__route-links">
          <a href="https://anzeninfo.mhlw.go.jp/anzen/gmsds/gmsds640.html" target="_blank" rel="noopener">ラベル・SDS対象物質検索 <span aria-hidden="true">↗</span></a>
          <a href="{{ '/guides/create-simple-guide/' | relative_url }}">CREATE-SIMPLEの使い方</a>
        </div>
      </article>
    </div>
  </section>

  <section id="measurement" class="substance-check-flow__section" aria-labelledby="measurement-title">
    <div class="substance-check-flow__heading">
      <p class="substance-check-flow__eyebrow">03｜目的で選ぶ</p>
      <h2 id="measurement-title">同じ「測定」でも、確認したいことが違う</h2>
      <p>身体にサンプラーを装着するかどうかではなく、何を評価し、どの基準・根拠に照らすかで使い分けます。</p>
    </div>
    <div class="comparison-table-wrap">
      <table class="comparison-table substance-check-flow__table">
        <thead>
          <tr><th scope="col">確認したいこと</th><th scope="col">主な方法・見方</th><th scope="col">最初に確認する根拠</th></tr>
        </thead>
        <tbody>
          <tr><th scope="row">指定作業場の空気環境を管理したい</th><td>作業環境測定。作業場と対象作業に応じて、デザイン、サンプリング、評価方法を確認する。</td><td>労働安全衛生法令、作業環境測定法令、各特別規則</td></tr>
          <tr><th scope="row">濃度基準値以下かを確認したい</th><td>リスクアセスメントで超過のおそれを確認し、必要に応じて労働者の呼吸域で確認測定を行う。</td><td>労働安全衛生規則第577条の2、濃度の基準の適用等に関する技術上の指針</td></tr>
          <tr><th scope="row">高ばく露作業や対策効果を把握したい</th><td>目的に応じた個人ばく露測定、作業観察、換気設備の確認などを組み合わせる。測定時間と比較する指標を先に決める。</td><td>目的に対応する法令・指針、SDS、社内のリスクアセスメント</td></tr>
        </tbody>
      </table>
    </div>
    <aside class="substance-check-flow__notice" aria-label="測定の使い分けに関する注意">
      <strong>置き換えないことが重要です。</strong>
      <p>作業環境測定の結果だけで個人のばく露管理を完了とせず、確認測定だけで指定作業場の作業環境測定を代替しません。複数の制度が重なる場合は、それぞれの目的と根拠を記録します。</p>
    </aside>
  </section>

  <section id="record" class="substance-check-flow__section" aria-labelledby="record-title">
    <div class="substance-check-flow__heading">
      <p class="substance-check-flow__eyebrow">04｜判断を残す</p>
      <h2 id="record-title">次の行動と根拠を一緒に記録する</h2>
      <p>該当・非該当だけでなく、どの資料と作業条件を確認して判断したかを残すと、SDS更新、工程変更、再評価の際に見直しやすくなります。</p>
    </div>
    <ol class="substance-check-flow__steps">
      <li><span>1</span><div><strong>対象を特定する</strong><p>製品名ではなく成分、含有率、対象作業を記録する。</p></div></li>
      <li><span>2</span><div><strong>根拠を確認する</strong><p>現行の法令、告示、技術上の指針、公式の対象物質検索を確認する。</p></div></li>
      <li><span>3</span><div><strong>確認方法を決める</strong><p>作業環境測定、確認測定、簡易評価、設備点検などから目的に合う方法を選ぶ。</p></div></li>
      <li><span>4</span><div><strong>対策と見直し条件を決める</strong><p>代替、密閉化、換気、作業方法、保護具を検討し、工程・SDS・法令の変更時に再確認する。</p></div></li>
    </ol>
  </section>

  <section class="substance-check-flow__sources" aria-labelledby="check-flow-sources-title">
    <h2 id="check-flow-sources-title">一次情報・公式ツール</h2>
    <ul>
      <li><a href="https://laws.e-gov.go.jp/law/350CO0000000244" target="_blank" rel="noopener">e-Gov法令検索「作業環境測定法施行令」<span aria-hidden="true"> ↗</span></a><span>指定作業場の確認</span></li>
      <li><a href="https://laws.e-gov.go.jp/law/347M50002000032" target="_blank" rel="noopener">e-Gov法令検索「労働安全衛生規則」<span aria-hidden="true"> ↗</span></a><span>濃度基準値に関する規定</span></li>
      <li><a href="https://www.mhlw.go.jp/content/11300000/001576216.pdf" target="_blank" rel="noopener">厚生労働省「濃度の基準の適用等に関する技術上の指針」<span aria-hidden="true"> ↗</span></a><span>確認測定の実施条件・方法</span></li>
      <li><a href="https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000046255_00002.html" target="_blank" rel="noopener">厚生労働省「濃度基準値設定物質の分析が可能な作業環境測定機関一覧について」<span aria-hidden="true"> ↗</span></a><span>確認測定の考え方</span></li>
      <li><a href="https://anzeninfo.mhlw.go.jp/user/anzen/kag/ankgc07.htm" target="_blank" rel="noopener">職場のあんぜんサイト「化学物質のリスクアセスメント実施支援」<span aria-hidden="true"> ↗</span></a><span>リスクアセスメントの支援情報</span></li>
    </ul>
    <p>最終確認日：2026年8月23日。制度改正や告示の更新があり得るため、個別の適用は必ず現行の一次情報で確認してください。</p>
  </section>
</div>
