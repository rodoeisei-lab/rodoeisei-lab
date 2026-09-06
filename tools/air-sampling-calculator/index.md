---
title: 採気量・気中濃度・必要採取時間の計算ツール
description: 流量と時間から採気量を計算し、捕集量から気中濃度へ換算。分析下限と目標濃度から必要採気量・採取時間も逆算できます。
eyebrow: 実務ツール
lead: サンプリング計画と分析結果の濃度換算を、同じ画面で確認できます。
permalink: /tools/air-sampling-calculator/
---

<link rel="stylesheet" href="{{ '/assets/css/practical-tools.css' | relative_url }}">

<div class="practical-tool" data-air-sampling-calculator>
  <section class="practical-tool__intro" aria-labelledby="air-sampling-purpose-title">
    <p class="section-kicker">サンプリング・分析</p>
    <h2 id="air-sampling-purpose-title">採る量、濃度、必要時間を相互に計算する</h2>
    <p>流量と時間から採気量を求める基本計算に加え、捕集した質量から気中濃度を求める計算、分析下限から必要な採気量と採取時間を逆算する計算に対応しています。</p>
    <ul class="practical-tool__notes">
      <li>入力値はブラウザ内で計算し、サイトへ送信・保存しません。</li>
      <li>単位換算を含む計算補助です。採用する分析法の定量下限、回収率、希釈倍率、ブランク補正などは別途確認してください。</li>
      <li>正式なサンプリング条件は、対象物質の測定基準・標準分析法・施設の手順を優先してください。</li>
    </ul>
  </section>

  <section class="practical-tool__shell" aria-labelledby="air-sampling-calculator-title">
    <div class="practical-tool__panel">
      <form id="airSamplingForm" class="practical-tool__form" novalidate>
        <fieldset class="practical-tool__mode">
          <legend id="air-sampling-calculator-title">何を計算しますか？</legend>
          <div class="practical-tool__mode-options">
            <label><input type="radio" name="airSamplingMode" value="volume" checked><span>採気量</span></label>
            <label><input type="radio" name="airSamplingMode" value="concentration"><span>気中濃度</span></label>
            <label><input type="radio" name="airSamplingMode" value="time"><span>必要採取時間</span></label>
          </div>
        </fieldset>

        <div class="practical-tool__input-panel" data-air-panel="volume">
          <div class="practical-tool__field-grid">
            <label class="practical-tool__field">
              <span>採取流量</span>
              <span class="practical-tool__compound"><input id="airSamplingFlow" type="text" inputmode="decimal" autocomplete="off" placeholder="例：10.9"><select aria-label="採取流量の単位" disabled><option>L/min</option></select></span>
              <small>平均流量として使用したい値を入力します。</small>
            </label>
            <label class="practical-tool__field">
              <span>採取時間</span>
              <span class="practical-tool__compound"><input id="airSamplingDuration" type="text" inputmode="decimal" autocomplete="off" placeholder="例：10"><select aria-label="採取時間の単位" disabled><option>min</option></select></span>
              <small>連続採取した時間を分で入力します。</small>
            </label>
          </div>
        </div>

        <div class="practical-tool__input-panel" data-air-panel="concentration" hidden>
          <div class="practical-tool__field-grid">
            <label class="practical-tool__field">
              <span>捕集量・試料中の量</span>
              <span class="practical-tool__compound"><input id="airSamplingMass" type="text" inputmode="decimal" autocomplete="off" placeholder="例：50"><select id="airSamplingMassUnit" aria-label="捕集量の単位"><option value="ug">µg</option><option value="mg">mg</option></select></span>
              <small>ブランク補正など必要な処理を済ませた量を入力します。</small>
            </label>
            <label class="practical-tool__field">
              <span>採気量</span>
              <span class="practical-tool__compound"><input id="airSamplingVolume" type="text" inputmode="decimal" autocomplete="off" placeholder="例：100"><select id="airSamplingVolumeUnit" aria-label="採気量の単位"><option value="L">L</option><option value="m3">m³</option></select></span>
              <small>流量×時間で得た採取空気量を入力します。</small>
            </label>
          </div>
        </div>

        <div class="practical-tool__input-panel" data-air-panel="time" hidden>
          <div class="practical-tool__field-grid">
            <label class="practical-tool__field">
              <span>分析下限（質量）</span>
              <span class="practical-tool__compound"><input id="airSamplingLoq" type="text" inputmode="decimal" autocomplete="off" placeholder="例：10"><select id="airSamplingLoqUnit" aria-label="分析下限の単位"><option value="ug">µg</option><option value="mg">mg</option></select></span>
              <small>試料として定量できる最小量など、計画に用いる質量下限を入力します。</small>
            </label>
            <label class="practical-tool__field">
              <span>目標気中濃度</span>
              <span class="practical-tool__compound"><input id="airSamplingTarget" type="text" inputmode="decimal" autocomplete="off" placeholder="例：0.1"><select id="airSamplingTargetUnit" aria-label="目標気中濃度の単位"><option value="mgm3">mg/m³</option><option value="ugm3">µg/m³</option></select></span>
              <small>この濃度を定量できるようにしたい、という目標値を入力します。</small>
            </label>
            <label class="practical-tool__field">
              <span>採取流量</span>
              <span class="practical-tool__compound"><input id="airSamplingRequiredFlow" type="text" inputmode="decimal" autocomplete="off" placeholder="例：1"><select aria-label="採取流量の単位" disabled><option>L/min</option></select></span>
              <small>使用するサンプラーの設定流量を入力します。</small>
            </label>
          </div>
        </div>

        <p id="airSamplingError" class="practical-tool__error" role="alert" hidden></p>
        <div class="practical-tool__actions">
          <button class="practical-tool__submit" type="submit">計算する</button>
          <button id="airSamplingExample" class="practical-tool__secondary" type="button">例を入力</button>
          <button id="airSamplingReset" class="practical-tool__text-button" type="button">リセット</button>
        </div>
      </form>
    </div>

    <div>
      <aside id="airSamplingPlaceholder" class="practical-tool__result" aria-label="計算結果の説明">
        <p class="section-kicker">計算結果</p>
        <h2>ここに結果を表示します</h2>
        <p class="practical-tool__placeholder">計算過程と単位換算も表示するため、報告書や分析計算を確認するときのダブルチェックに使えます。</p>
      </aside>
      <aside id="airSamplingResult" class="practical-tool__result" aria-live="polite" tabindex="-1" hidden>
        <p class="section-kicker">計算結果</p>
        <h2 id="airSamplingResultTitle"></h2>
        <p id="airSamplingResultPrimary" class="practical-tool__result-primary"></p>
        <p id="airSamplingResultSummary" class="practical-tool__result-summary"></p>
        <dl id="airSamplingResultDetails" class="practical-tool__result-details"></dl>
        <p id="airSamplingResultFormula" class="practical-tool__formula"></p>
      </aside>
    </div>
  </section>

  <section class="practical-tool__section" aria-labelledby="air-sampling-howto-title">
    <h2 id="air-sampling-howto-title">実務での使い分け</h2>
    <div class="practical-tool__reference">
      <h3>採気量</h3>
      <p>流量計の値と採取時間から、分析時に使う採取空気量を確認します。流量の前後差を平均して扱うなど、実際の手順は採用する測定方法に従ってください。</p>
      <h3>気中濃度</h3>
      <p>分析で得た試料中の量を採気量で割り、mg/m³へ換算します。希釈倍率や前処理液量を経て最終的に得た「試料中の量」を使う設計です。</p>
      <h3>必要採取時間</h3>
      <p>分析下限を質量として置き、目標気中濃度で割ると必要採気量を逆算できます。さらに採取流量で割ると必要時間が求まります。</p>
    </div>
  </section>

  <section class="practical-tool__section" aria-labelledby="air-sampling-related-title">
    <h2 id="air-sampling-related-title">関連ページ</h2>
    <div class="practical-tool__reference">
      <ul>
        <li><a href="{{ '/analysis/' | relative_url }}">分析：検量線・定量下限・精度管理を確認する</a></li>
        <li><a href="{{ '/guides/work-environment-analysis-basics/' | relative_url }}">作業環境測定の分析の全体像</a></li>
        <li><a href="{{ '/tools/management-class/' | relative_url }}">管理区分判定ツール</a></li>
      </ul>
    </div>
  </section>
</div>

<script src="{{ '/assets/js/practical-tools.js' | relative_url }}" defer></script>
