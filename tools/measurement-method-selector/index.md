---
title: 測定方法の選択ナビ｜A・B測定、C・D測定、個人ばく露測定の使い分け
description: 測定の目的から、A・B測定、C・D測定（個人サンプリング法）、個人ばく露測定、確認測定、第3管理区分の保護具選定測定、溶接ヒューム測定の確認先を整理します。
eyebrow: 実務ツール
lead: 「身体にポンプを付けるか」ではなく、何を評価する測定なのかから候補を絞ります。
permalink: /tools/measurement-method-selector/
---

<link rel="stylesheet" href="{{ '/assets/css/practical-tools.css' | relative_url }}">

<div class="practical-tool" data-measurement-selector>
  <section class="practical-tool__intro" aria-labelledby="measurement-selector-purpose-title">
    <p class="section-kicker">測定制度の使い分け</p>
    <h2 id="measurement-selector-purpose-title">目的から、確認する測定を絞る</h2>
    <p>A・B測定、C・D測定、個人ばく露測定、確認測定は、試料採取機器の見た目が似ていても<strong>評価する対象と根拠が異なります</strong>。このナビは、最初に確認する制度・測定方法を目的から整理するための入口です。</p>
    <ul class="practical-tool__notes">
      <li>このナビだけで法令上の測定義務・対象物質・実施者要件を確定しません。</li>
      <li>作業環境測定で管理区分を求める場合と、個人のばく露を濃度基準値等と比較する場合を区別します。</li>
      <li>2026年10月1日施行の個人ばく露測定に係る実施者要件は、測定目的・根拠法令ごとに確認してください。</li>
    </ul>
  </section>

  <section class="practical-tool__shell" aria-labelledby="measurement-selector-title">
    <div class="practical-tool__panel">
      <form id="measurementSelectorForm" class="practical-tool__form">
        <label class="practical-tool__field" for="measurementPurpose">
          <span>まず、何を確認したいですか？</span>
          <select id="measurementPurpose" required>
            <option value="">選択してください</option>
            <option value="work-environment">作業場を評価し、管理区分を求めたい</option>
            <option value="exposure">作業者のばく露の程度を把握したい</option>
            <option value="concentration-standard">濃度基準値への適合を確認したい</option>
            <option value="third-class">改善困難な第3管理区分で、呼吸用保護具選定のための濃度を確認したい</option>
            <option value="welding">金属アーク溶接等作業の溶接ヒューム濃度を確認したい</option>
          </select>
        </label>

        <div id="measurementSelectorFollowup" class="practical-tool__input-panel" hidden>
          <label class="practical-tool__field" for="measurementSamplingPreference">
            <span>作業環境測定で、個人サンプリング法（C・D測定）を検討していますか？</span>
            <select id="measurementSamplingPreference">
              <option value="unknown">まだ決めていない</option>
              <option value="yes">検討している</option>
              <option value="no">A・B測定を検討している</option>
            </select>
          </label>
        </div>

        <div class="practical-tool__actions">
          <button class="practical-tool__submit" type="submit">確認先を表示する</button>
          <button id="measurementSelectorReset" class="practical-tool__text-button" type="button">リセット</button>
        </div>
      </form>
    </div>

    <aside id="measurementSelectorResult" class="practical-tool__result" aria-live="polite" tabindex="-1">
      <p class="section-kicker">確認先</p>
      <h2 id="measurementSelectorResultTitle">目的を選択してください</h2>
      <p id="measurementSelectorResultPrimary" class="practical-tool__result-primary">測定名より先に、何を評価するかを決めます。</p>
      <div id="measurementSelectorResultBody" class="practical-tool__reference">
        <p>選択後に、候補となる測定、評価対象、次に確認するページを表示します。</p>
      </div>
    </aside>
  </section>

  <section class="practical-tool__section" aria-labelledby="measurement-selector-comparison-title">
    <h2 id="measurement-selector-comparison-title">名称が似ている測定を区別する</h2>
    <div class="record-table-wrap">
      <table class="record-table">
        <thead><tr><th>測定</th><th>主な評価対象</th><th>結果の使い方</th></tr></thead>
        <tbody>
          <tr><td>A・B測定</td><td>単位作業場所</td><td>作業環境評価基準に基づき管理区分を評価</td></tr>
          <tr><td>C・D測定（個人サンプリング法）</td><td>単位作業場所</td><td>対象物質・条件を確認し、管理区分を評価</td></tr>
          <tr><td>個人ばく露測定</td><td>労働者の呼吸域におけるばく露</td><td>リスクアセスメント、対策前後など目的に応じて評価</td></tr>
          <tr><td>確認測定</td><td>濃度基準値設定物質へのばく露</td><td>リスクアセスメント結果等を踏まえ、濃度基準値との関係を確認</td></tr>
          <tr><td>第3管理区分の保護具選定測定</td><td>改善困難な場所での有害物濃度</td><td>要求防護係数を求め、呼吸用保護具の選定へつなげる</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="practical-tool__section" aria-labelledby="measurement-selector-source-title">
    <h2 id="measurement-selector-source-title">関連ページ・一次情報</h2>
    <div class="practical-tool__reference">
      <ul>
        <li><a href="{{ '/guides/personal-sampling-target-substances/' | relative_url }}">個人サンプリング法の対象物質</a>：C・D測定を選択できる対象を確認します。</li>
        <li><a href="{{ '/qa/personal-sampling-ab-measurement/' | relative_url }}">個人サンプリング法はA・B測定の代わりになる？</a>：使い分けを確認します。</li>
        <li><a href="{{ '/qa/personal-exposure-measurement-2026/' | relative_url }}">2026年10月から、個人ばく露測定は誰が実施する？</a>：実施者要件を確認します。</li>
        <li><a href="{{ '/tools/respirator-protection-factor/' | relative_url }}">第3管理区分の要求防護係数計算</a>：保護具選定用の比を参考計算します。</li>
        <li><a href="https://jsite.mhlw.go.jp/tottori-roudoukyoku/newpage_02867.html" target="_blank" rel="noopener noreferrer">鳥取労働局「個人ばく露測定等関連（令和8年10月～）」</a>（2026年9月8日確認）。</li>
        <li><a href="https://www.mhlw.go.jp/web/t_doc?dataId=74087000&dataType=0&pageNo=1" target="_blank" rel="noopener noreferrer">厚生労働省「作業環境測定基準」</a>。</li>
      </ul>
    </div>
  </section>
</div>

<script type="module" src="{{ '/assets/js/measurement-method-selector.mjs' | relative_url }}"></script>
