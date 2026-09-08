---
title: 第3管理区分の要求防護係数計算ツール
description: 改善困難な第3管理区分で呼吸用保護具を選定する際の要求防護係数を、有機溶剤・特定化学物質・鉛・粉じん・混合有機溶剤について参考計算します。
eyebrow: 実務ツール
lead: 測定結果 C と管理濃度等 C₀ から、要求防護係数 PFᵣ＝C/C₀ を計算します。
permalink: /tools/respirator-protection-factor/
---

<link rel="stylesheet" href="{{ '/assets/css/practical-tools.css' | relative_url }}">

<div class="practical-tool" data-protection-factor-tool>
  <section class="practical-tool__intro" aria-labelledby="protection-factor-purpose-title">
    <p class="section-kicker">第3管理区分・呼吸用保護具</p>
    <h2 id="protection-factor-purpose-title">要求防護係数を計算し、必要性能を確認する</h2>
    <p>作業環境管理専門家が改善困難と判断した第3管理区分の場所で、個別規則に基づき呼吸用保護具を選定する際の<strong>要求防護係数 PFᵣ</strong>を参考計算します。使用する呼吸用保護具は、原則として<strong>要求防護係数を上回る指定防護係数</strong>を有するものを確認します。</p>
    <ul class="practical-tool__notes">
      <li>入力する C は、採用した測定方法に応じて法令上使用する濃度値を確認してください。</li>
      <li>有機溶剤・特定化学物質は管理濃度を C₀ とします。鉛は C₀＝0.05 mg/m³、粉じんは遊離けい酸含有率 Q から C₀＝3.0/(1.19Q+1) mg/m³ を計算します。</li>
      <li>混合有機溶剤では、法令上の換算値を C として入力し、C₀＝1として計算します。</li>
      <li>このツールは保護具の商品・吸収缶・フィルタを自動選定しません。対象物質、形状、指定防護係数、除毒能力、破過、フィット等を別途確認してください。</li>
    </ul>
  </section>

  <section class="practical-tool__shell" aria-labelledby="protection-factor-calculator-title">
    <div class="practical-tool__panel">
      <form id="protectionFactorForm" class="practical-tool__form" novalidate>
        <label class="practical-tool__field" for="protectionFactorType">
          <span id="protection-factor-calculator-title">対象</span>
          <select id="protectionFactorType">
            <option value="organic">有機溶剤</option>
            <option value="specified">特定化学物質</option>
            <option value="lead">鉛</option>
            <option value="dust">粉じん</option>
            <option value="mixed-organic">混合有機溶剤（換算値）</option>
          </select>
        </label>

        <div class="practical-tool__field-grid">
          <label class="practical-tool__field" for="protectionFactorC">
            <span id="protectionFactorCLabel">採用する濃度 C</span>
            <input id="protectionFactorC" type="number" min="0" step="any" inputmode="decimal" placeholder="例：2.5" required>
            <small id="protectionFactorCHelp">第一評価値、B/D測定値、個人サンプリングによる測定値等から、規定に従い採用する値を入力します。</small>
          </label>

          <label id="protectionFactorC0Field" class="practical-tool__field" for="protectionFactorC0">
            <span>管理濃度 C₀</span>
            <input id="protectionFactorC0" type="number" min="0" step="any" inputmode="decimal" placeholder="例：1">
            <small>C と同じ濃度単位で入力します。</small>
          </label>

          <label id="protectionFactorQField" class="practical-tool__field" for="protectionFactorQ" hidden>
            <span>遊離けい酸含有率 Q（%）</span>
            <input id="protectionFactorQ" type="number" min="0" max="100" step="any" inputmode="decimal" placeholder="例：10">
            <small>C₀＝3.0/(1.19Q+1) mg/m³ を計算します。</small>
          </label>
        </div>

        <p id="protectionFactorFixed" class="record-summary"></p>
        <p id="protectionFactorError" class="practical-tool__error" role="alert" hidden></p>

        <div class="practical-tool__actions">
          <button class="practical-tool__submit" type="submit">要求防護係数を計算する</button>
          <button id="protectionFactorExample" class="practical-tool__secondary" type="button">例を入力</button>
          <button id="protectionFactorReset" class="practical-tool__text-button" type="button">リセット</button>
        </div>
      </form>
    </div>

    <aside id="protectionFactorResult" class="practical-tool__result" aria-live="polite" tabindex="-1">
      <p class="section-kicker">計算結果</p>
      <h2 id="protectionFactorResultTitle">数値を入力してください</h2>
      <p id="protectionFactorResultPrimary" class="practical-tool__result-primary">PFᵣ ＝ C ÷ C₀</p>
      <p id="protectionFactorResultSummary" class="practical-tool__result-summary">指定防護係数は、計算した要求防護係数を上回る必要があります。</p>
      <dl id="protectionFactorResultDetails" class="practical-tool__result-details" hidden>
        <div><dt>採用値 C</dt><dd id="protectionFactorResultC"></dd></div>
        <div><dt>基準値 C₀</dt><dd id="protectionFactorResultC0"></dd></div>
        <div><dt>要求防護係数</dt><dd id="protectionFactorResultPf"></dd></div>
        <div><dt>必要条件</dt><dd id="protectionFactorResultCondition"></dd></div>
      </dl>
    </aside>
  </section>

  <section class="practical-tool__section" aria-labelledby="protection-factor-c-title">
    <h2 id="protection-factor-c-title">C に何を使うか</h2>
    <div class="record-table-wrap">
      <table class="record-table">
        <thead><tr><th>測定の形</th><th>告示上の考え方</th></tr></thead>
        <tbody>
          <tr><td>A測定またはC測定のみ</td><td>第一評価値を使用する場面があります。</td></tr>
          <tr><td>A＋B測定 / C＋D測定</td><td>第一評価値とB/D測定値の最大値を比較し、規定に従い大きい値を使用します。</td></tr>
          <tr><td>身体装着型の濃度測定</td><td>測定値のうち最大値を使用する規定があります。</td></tr>
          <tr><td>混合有機溶剤</td><td>各溶剤の濃度÷管理濃度を合計した換算値を用い、管理濃度相当値は1とします。</td></tr>
        </tbody>
      </table>
    </div>
    <p class="record-summary">対象規則と採用した測定方法で細部が異なります。ツールが C の採用値を自動判定するものではありません。</p>
  </section>

  <section class="practical-tool__section" aria-labelledby="protection-factor-source-title">
    <h2 id="protection-factor-source-title">根拠・関連ページ</h2>
    <div class="practical-tool__reference">
      <ul>
        <li><a href="https://www.mhlw.go.jp/web/t_doc?dataId=74ab8992&dataType=0&pageNo=1" target="_blank" rel="noopener noreferrer">厚生労働省「第三管理区分に区分された場所に係る有機溶剤等の濃度の測定の方法等」</a>：要求防護係数、指定防護係数、フィットファクタ等（2026年9月8日確認）。</li>
        <li><a href="https://www.mhlw.go.jp/web/t_doc?dataId=00tc7171&dataType=1&pageNo=1" target="_blank" rel="noopener noreferrer">厚生労働省「同告示の適用等について」</a>：測定値 C の採用と保護具選定の考え方。</li>
        <li><a href="{{ '/qa/third-control-class/' | relative_url }}">第3管理区分になった場合の対応順序</a>：設備・工程改善を含めて確認します。</li>
        <li><a href="{{ '/tools/mixed-organic-solvent/' | relative_url }}">混合有機溶剤の換算値計算</a>：換算値 C を求める場合に使用します。</li>
      </ul>
    </div>
  </section>
</div>

<script type="module" src="{{ '/assets/js/respirator-protection-factor.mjs' | relative_url }}"></script>
