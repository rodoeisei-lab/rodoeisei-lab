---
title: 混合有機溶剤の換算値・管理区分計算ツール
description: 2種類以上の有機溶剤について、測定点ごとの換算値を求め、1日測定のA/B測定から第一・第二評価値と管理区分を参考計算します。
eyebrow: 実務ツール
lead: 各溶剤の濃度を管理濃度で割って測定点ごとに合算し、混合有機溶剤の評価を途中計算まで確認できます。
permalink: /tools/mixed-organic-solvent/
---

<link rel="stylesheet" href="{{ '/assets/css/practical-tools.css' | relative_url }}">

<div class="practical-tool" data-mixed-organic-tool>
  <section class="practical-tool__intro" aria-labelledby="mixed-organic-purpose-title">
    <p class="section-kicker">混合有機溶剤・1日測定</p>
    <h2 id="mixed-organic-purpose-title">測定点ごとの換算から、管理区分まで確認する</h2>
    <p>2種類以上の有機溶剤について、各測定点で <strong>C＝C₁/E₁＋C₂/E₂＋…</strong> の換算値を求め、その換算値を測定値、管理濃度に相当する値を1として、A測定・必要に応じたB測定の管理区分を参考計算します。</p>
    <ul class="practical-tool__notes">
      <li>入力値はブラウザ内で計算し、サイトへ送信・保存しません。</li>
      <li>物質名を選ぶと、登録している管理濃度を自動使用します。対象物質・適用条件・最新の管理濃度は必ず一次資料で確認してください。</li>
      <li>この初版は1日測定のA/B測定を対象とします。2日間測定、C/D測定は自動計算の対象外です。</li>
      <li>ND・定量下限未満の表記は自動処理しません。評価に採用する数値へ置き換えたうえで入力してください。</li>
    </ul>
  </section>

  <section class="practical-tool__shell" aria-labelledby="mixed-organic-calculator-title">
    <div class="practical-tool__panel">
      <form id="mixedOrganicForm" class="practical-tool__form" novalidate>
        <fieldset class="practical-tool__mode">
          <legend id="mixed-organic-calculator-title">測定方法</legend>
          <div class="practical-tool__mode-options">
            <label><input type="radio" name="mixedOrganicMeasurementMode" value="a" checked><span>A測定のみ</span></label>
            <label><input type="radio" name="mixedOrganicMeasurementMode" value="ab"><span>A＋B測定</span></label>
          </div>
        </fieldset>

        <div id="mixedOrganicComponents" class="practical-tool__input-panel" aria-label="混合する有機溶剤"></div>

        <div class="practical-tool__actions">
          <button id="mixedOrganicAdd" class="practical-tool__secondary" type="button">溶剤を追加する</button>
        </div>
        <p class="record-summary">2種類以上、最大8種類まで。A測定値・B測定値は、すべての溶剤で同じ測定点の順番にしてください。</p>

        <p id="mixedOrganicError" class="practical-tool__error" role="alert" hidden></p>
        <div class="practical-tool__actions">
          <button class="practical-tool__submit" type="submit">換算値と管理区分を計算する</button>
          <button id="mixedOrganicExample" class="practical-tool__secondary" type="button">例を入力</button>
          <button id="mixedOrganicReset" class="practical-tool__text-button" type="button">リセット</button>
        </div>
      </form>
    </div>

    <div>
      <aside id="mixedOrganicPlaceholder" class="practical-tool__result" aria-label="計算結果の説明">
        <p class="section-kicker">計算結果</p>
        <h2>ここに結果を表示します</h2>
        <p class="practical-tool__placeholder">管理区分だけでなく、測定点ごとの換算値と「各濃度÷各管理濃度」の内訳まで表示します。</p>
      </aside>

      <aside id="mixedOrganicResult" class="practical-tool__result" aria-live="polite" tabindex="-1" hidden>
        <p class="section-kicker">参考判定</p>
        <h2 id="mixedOrganicResultTitle"></h2>
        <p id="mixedOrganicResultPrimary" class="practical-tool__result-primary"></p>
        <p id="mixedOrganicResultSummary" class="practical-tool__result-summary"></p>
        <dl class="practical-tool__result-details">
          <div><dt>第1評価値</dt><dd id="mixedOrganicResultEa1"></dd></div>
          <div><dt>第2評価値</dt><dd id="mixedOrganicResultEa2"></dd></div>
          <div><dt>B測定 最大換算値</dt><dd id="mixedOrganicResultB"></dd></div>
          <div><dt>幾何平均</dt><dd id="mixedOrganicResultGm"></dd></div>
          <div><dt>幾何標準偏差</dt><dd id="mixedOrganicResultGsd"></dd></div>
          <div><dt>A測定点数</dt><dd id="mixedOrganicResultPoints"></dd></div>
        </dl>
        <p class="practical-tool__formula">判定には丸める前の換算値・評価値を使用します。表示値は見やすさのため丸めています。</p>
      </aside>
    </div>
  </section>

  <section class="practical-tool__section" aria-labelledby="mixed-organic-breakdown-title">
    <h2 id="mixed-organic-breakdown-title">測定点ごとの換算内訳</h2>
    <div id="mixedOrganicBreakdown" class="practical-tool__reference">
      <p>計算後に、各測定点の換算値と内訳を表示します。</p>
    </div>
  </section>

  <section class="practical-tool__section" aria-labelledby="mixed-organic-rule-title">
    <h2 id="mixed-organic-rule-title">計算の考え方</h2>
    <div class="practical-tool__reference">
      <h3>1. 測定点ごとに換算する</h3>
      <p>各溶剤の測定値 C₁、C₂…を、それぞれの管理濃度 E₁、E₂…で割り、合計した値をその測定点の換算値 C とします。</p>
      <p class="practical-tool__formula">C ＝ C₁/E₁ ＋ C₂/E₂ ＋ …</p>
      <h3>2. 換算値をA/B測定値として評価する</h3>
      <p>換算値を測定値とみなし、管理濃度に相当する値を1として第一評価値・第二評価値と管理区分を求めます。B測定を実施した場合は、換算したB測定値も含めて判定します。</p>
    </div>
  </section>

  <section class="practical-tool__section" aria-labelledby="mixed-organic-limit-title">
    <h2 id="mixed-organic-limit-title">入力前に確認すること</h2>
    <div class="practical-tool__reference">
      <ul>
        <li><strong>定量下限未満：</strong>作業環境評価基準では、採用した試料採取方法・分析方法による定量下限未満の測定点は、定量下限の値を測定値とみなします。このツールでは自動置換しません。</li>
        <li><strong>管理濃度の1/10未満：</strong>管理濃度の1/10を測定値とみなして評価できる規定があります。このツールでは採用の判断を行わず、入力された数値をそのまま使います。</li>
        <li><strong>特別有機溶剤：</strong>特化則で有機則の作業環境測定結果を評価する場面では、特別有機溶剤を含む場合があります。ツールには対象候補を表示しますが、適用の有無は作業内容・含有率・法令適用を確認してください。</li>
      </ul>
    </div>
  </section>

  <section class="practical-tool__section" aria-labelledby="mixed-organic-source-title">
    <h2 id="mixed-organic-source-title">根拠・関連ページ</h2>
    <div class="practical-tool__reference">
      <ul>
        <li><a href="https://www.mhlw.go.jp/web/t_doc?dataId=74088000" target="_blank" rel="noopener noreferrer">厚生労働省「作業環境評価基準」</a>：第2条第4項の混合有機溶剤の換算、第3条の評価値計算を確認（2026年9月8日確認）。</li>
        <li><a href="{{ '/tools/management-class/' | relative_url }}">管理区分判定ツール</a>：単一物質・粉じんのA/B測定を計算します。</li>
        <li><a href="{{ '/guides/organic-solvent-basics/' | relative_url }}">有機溶剤の基礎</a>：対象物質と有機則の基本を確認します。</li>
        <li><a href="{{ '/substances/' | relative_url }}">物質検索</a>：法令対象や濃度情報の確認に使います。</li>
      </ul>
    </div>
  </section>
</div>

<script type="module" src="{{ '/assets/js/mixed-organic-solvent-calculator.mjs' | relative_url }}"></script>
