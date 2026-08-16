---
title: 個人ばく露測定を基礎から学ぶ
description: 個人ばく露測定について、測定目的、対象者の選定、呼吸域でのサンプリング、測定時間、結果の評価、作業環境測定との関係を実務の流れに沿って整理します。
eyebrow: 個人ばく露測定
lead: 作業者がどの程度化学物質にばく露しているかを把握し、対策につなげるための考え方を基礎から確認します。
permalink: /personal-exposure-measurement/
---

<div class="chemical-hub">
<section class="chemical-intro" aria-labelledby="exposure-about">
<p class="chemical-section-label">基礎</p>
<h2 id="exposure-about">個人ばく露測定とは</h2>
<p>代表的には、作業者の身体に試料採取機器を装着し、顔の近くの<strong>呼吸域の空気中にある有害物質濃度</strong>を把握する測定です。作業者の移動や作業内容の変化を含めて確認できますが、体内へ実際に吸収された量や健康影響を直接測る検査ではありません。</p>
</section>

<section class="chemical-section" aria-labelledby="exposure-differences">
<div class="chemical-section-heading"><p class="chemical-section-label">目的を混同しない</p><h2 id="exposure-differences">最初に区別したい測定</h2></div>
<dl class="chemical-definitions">
<div><dt>個人ばく露測定</dt><dd>呼吸域濃度から作業中のばく露の程度を把握し、リスク評価や対策に用います。一般的な自主測定を含み、目的に応じて評価指標を決めます。</dd></div>
<div><dt>確認測定</dt><dd>濃度基準値が定められた物質について、リスクアセスメントの結果等から必要と判断した場合に、労働者のばく露の程度を確認する測定です。すべての物質・作業に一律に必要なものではありません。</dd></div>
<div><dt>個人サンプリング法による作業環境測定</dt><dd>労働者に機器を装着しますが、個人の健康リスクそのものではなく作業場を評価する法定の作業環境測定です。C測定・D測定の結果を作業環境評価基準に基づく管理区分の決定に用います。</dd></div>
</dl>
</section>

<section class="chemical-section" aria-labelledby="exposure-flow">
<div class="chemical-section-heading"><p class="chemical-section-label">計画から改善まで</p><h2 id="exposure-flow">個人ばく露測定の実務の流れ</h2></div>
<ol class="chemical-steps">
<li><span class="chemical-step-number">01</span><span><strong>測定目的と評価基準を決める</strong><small>濃度基準値との比較、対策前後、保護具選定、作業間の差、法令上の必要性のどれを確認するか決めます。</small></span></li>
<li><span class="chemical-step-number">02</span><span><strong>作業内容を事前調査する</strong><small>物質、工程、量、時間、発散源、換気、動き、皮膚接触、保護具、清掃・保守・異常時作業を確認します。</small></span></li>
<li><span class="chemical-step-number">03</span><span><strong>対象となる作業と作業者を選ぶ</strong><small>均等ばく露作業を整理し、高ばく露が想定される作業、最大ばく露労働者、通常を代表する日を検討します。無作為に1人だけ選ぶものではありません。</small></span></li>
<li><span class="chemical-step-number">04</span><span><strong>測定をデザインする</strong><small>物質、採取・分析方法、人数、測定時間、短時間作業、作業記録、定量下限を決めます。</small></span></li>
<li><span class="chemical-step-number">05</span><span><strong>サンプリングを行う</strong><small>採取口を呼吸域へ配置し、適切なポンプ・捕集材を選び、前後の流量、装着状態、作業内容と時間を記録します。</small></span></li>
<li><span class="chemical-step-number">06</span><span><strong>分析・評価する</strong><small>測定濃度、時間荷重平均、八時間・短時間濃度基準値、ばらつきと評価基準を確認します。管理濃度とは区別します。</small></span></li>
<li><span class="chemical-step-number">07</span><span><strong>対策と再確認につなげる</strong><small>代替、密閉化、<a href="{{ '/guides/local-exhaust-ventilation-basics/' | relative_url }}">局所排気</a>、全体換気、作業方法・時間、保護具を見直し、対策後に再測定します。</small></span></li>
</ol>
</section>

<section class="chemical-section" aria-labelledby="published-title">
<div class="chemical-section-heading"><p class="chemical-section-label">関連記事</p><h2 id="published-title">現在読める解説</h2></div>
<ul class="chemical-roadmap">{% for article in site.data.personal_exposure_measurement %}{% if article.status == "published" and article.url %}<li class="chemical-roadmap__item--published"><a href="{{ article.url | relative_url }}"><span>{{ article.section }}</span><strong>{{ article.title }}</strong><p>{{ article.description }}</p><small class="chemical-status chemical-status--published">公開中・記事を読む</small></a></li>{% endif %}{% endfor %}</ul>
</section>

<section class="chemical-section" aria-labelledby="related-fields"><div class="chemical-section-heading"><p class="chemical-section-label">使い分け</p><h2 id="related-fields">作業環境測定・化学物質管理との関係</h2></div>
<p>個人ばく露測定は、化学物質管理で実際の作業条件におけるばく露を把握する手段の一つです。法定の作業環境測定、確認測定、自主測定は、根拠・目的・評価方法を確認して使い分けます。</p>
<p><a href="{{ '/work-environment-measurement/' | relative_url }}">作業環境測定を基礎から学ぶ</a> ／ <a href="{{ '/chemical-management/' | relative_url }}">化学物質管理を基礎から学ぶ</a></p></section>

<section class="chemical-section" aria-labelledby="official-title"><div class="chemical-section-heading"><p class="chemical-section-label">根拠を確認</p><h2 id="official-title">一次情報</h2></div>
<div class="chemical-official-links">
<a href="https://www.mhlw.go.jp/content/11300000/001732756.pdf"><strong>個人ばく露測定等関係の施行通達（基発0730第2号）</strong><span>厚生労働省・2026年7月30日</span></a>
<a href="https://www.mhlw.go.jp/content/11300000/001576216.pdf"><strong>濃度基準の適用等に関する技術上の指針</strong><span>厚生労働省</span></a>
<a href="https://www.mhlw.go.jp/web/t_doc?dataId=74087000&amp;dataType=0&amp;pageNo=1"><strong>作業環境測定基準</strong><span>厚生労働省</span></a>
<a href="https://www.mhlw.go.jp/content/11300000/001243055.pdf"><strong>作業環境測定基準等の改正告示の適用通達</strong><span>厚生労働省</span></a>
<a href="https://www.mhlw.go.jp/stf/newpage_32871.html"><strong>濃度基準値</strong><span>厚生労働省</span></a>
<a href="https://laws.e-gov.go.jp/law/347AC0000000057"><strong>労働安全衛生法</strong><span>e-Gov法令検索</span></a>
<a href="https://laws.e-gov.go.jp/law/350AC0000000028"><strong>作業環境測定法</strong><span>e-Gov法令検索</span></a>
</div></section>

<section class="chemical-section" aria-labelledby="reform-title"><div class="chemical-section-heading"><p class="chemical-section-label">施行前の制度</p><h2 id="reform-title">2026年10月1日の制度改正</h2></div>
<aside class="chemical-disclaimer"><strong>2026年8月11日時点では施行予定です</strong><p>公表済みの改正では、2026年10月1日から個人ばく露測定が作業環境測定の一部として法令上明確に位置づけられ、指定作業場等で行う測定の実施者要件などが定められます。これは、すべての自主的な個人ばく露測定を一律に同じ資格者だけが行うという意味ではありません。測定目的、対象作業場、根拠条文ごとに要件を確認してください。</p></aside></section>

<section class="chemical-section" aria-labelledby="review-title"><div class="chemical-section-heading"><p class="chemical-section-label">利用上の注意</p><h2 id="review-title">最終確認日と注意事項</h2></div>
<p>最終確認日：2026年8月11日。個別の適用は物質、作業、場所、測定目的等で異なります。最新の法令、告示、通達、技術上の指針を確認してください。2026年10月1日の施行後に内容を再確認します。</p></section>
</div>
