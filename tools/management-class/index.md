---
title: 管理区分判定ツール
description: 物質名からの管理濃度設定、粉じんのQ・K値換算に対応した、1日測定の管理区分参考計算ツールです。
eyebrow: 実務ツール
lead: 物質名の選択または粉じんのQ・K値入力から、A/B測定の第1・第2・第3管理区分を確認できます。
permalink: /tools/management-class/
---

<div class="management-class-tool" data-management-class-tool>
  <section class="management-class-tool__intro" aria-labelledby="management-class-purpose-title">
    <p class="section-kicker">A/B測定・1日測定</p>
    <h2 id="management-class-purpose-title">管理区分の計算を、途中の値まで見える形にする</h2>
    <p>単位作業場所ごとのA測定値、必要に応じて実施したB測定値、管理濃度を入力すると、第一評価値・第二評価値を計算し、第1・第2・第3管理区分を表示します。物質名を選べば登録値を入力し、粉じんなら遊離けい酸含有率Qから管理濃度を計算します。判定には丸める前の計算値を使います。</p>
    <ul class="management-class-tool__intro-list">
      <li>入力値はブラウザ内で計算し、サイトへ送信・保存しません。</li>
      <li>物質名の登録値は作業環境評価基準の別表をもとにしています。別名・成分表示・改正は必ず確認します。</li>
      <li>結果は計算補助です。正式な報告書・法令適用の最終判断には使いません。</li>
    </ul>
  </section>

  <section class="management-class-tool__calculator" aria-labelledby="management-class-calculator-title">
    <div class="management-class-tool__form-wrap">
      <div class="management-class-tool__heading">
        <p class="section-kicker">入力</p>
        <h2 id="management-class-calculator-title">測定結果を入力する</h2>
        <p>先に対象を選ぶと、必要な入力欄だけを表示します。数値は改行・スペース・カンマ区切りに対応しています。</p>
      </div>

      <form id="managementClassForm" class="management-class-tool__form" novalidate>
        <fieldset class="management-class-tool__mode-selector">
          <legend>対象 <em>必須</em></legend>
          <div class="management-class-tool__mode-options">
            <label>
              <input type="radio" name="managementClassMode" value="chemical" checked>
              <span><strong>気中有害物質</strong><small>物質名または手入力の管理濃度で計算</small></span>
            </label>
            <label>
              <input type="radio" name="managementClassMode" value="dust">
              <span><strong>粉じん</strong><small>Qから管理濃度を計算し、必要ならK値で換算</small></span>
            </label>
          </div>
          <p id="managementClassModeHelp" class="management-class-tool__mode-help" aria-live="polite"></p>
        </fieldset>

        <div id="managementClassChemicalPanel" class="management-class-tool__input-panel">
          <div class="management-class-tool__substance-grid">
            <label class="management-class-tool__field">
              <span>物質の分類</span>
              <select id="managementClassSubstanceCategory">
                <option value="popular">よく使う物質</option>
                <option value="organic">有機溶剤</option>
                <option value="specified">特化物・金属等</option>
                <option value="lead">鉛</option>
                <option value="all">すべての登録物質</option>
              </select>
              <small>絞り込んでから物質名を選べます。</small>
            </label>
            <label class="management-class-tool__field">
              <span>物質名 <em>任意</em></span>
              <select id="managementClassSubstance" aria-describedby="managementClassSubstanceNote"></select>
              <small>選ぶと管理濃度と単位を自動入力します。</small>
            </label>
          </div>
          <p id="managementClassSubstanceNote" class="management-class-tool__substance-note" aria-live="polite"></p>

          <div class="management-class-tool__field-grid">
            <label class="management-class-tool__field">
              <span>管理濃度 <em>必須</em></span>
              <input id="managementClassConcentration" type="text" inputmode="decimal" autocomplete="off" placeholder="例：20" aria-describedby="managementClassConcentrationHelp">
              <small id="managementClassConcentrationHelp">登録外の物質や確認済みの値は、ここで手入力します。</small>
            </label>
            <label class="management-class-tool__field">
              <span>単位 <em>必須</em></span>
              <input id="managementClassUnit" type="text" autocomplete="off" placeholder="例：ppm">
              <small>A・B測定値と同じ単位にします。</small>
            </label>
          </div>
        </div>

        <div id="managementClassDustPanel" class="management-class-tool__input-panel management-class-tool__dust-panel" hidden>
          <div class="management-class-tool__field-grid management-class-tool__field-grid--dust">
            <label class="management-class-tool__field">
              <span>遊離けい酸含有率 Q <em>必須</em></span>
              <input id="managementClassDustQ" type="text" inputmode="decimal" autocomplete="off" placeholder="例：5" aria-describedby="managementClassDustQHelp">
              <small id="managementClassDustQHelp">0〜100（％）を入力します。管理濃度 E＝3.0／（1.19Q＋1）で計算します。</small>
            </label>
            <div id="managementClassDustPreview" class="management-class-tool__dust-preview" aria-live="polite"></div>
          </div>

          <fieldset class="management-class-tool__dust-input-mode">
            <legend>粉じんの測定値の入力方法</legend>
            <label>
              <input type="radio" name="managementClassDustInputMode" value="relative" checked>
              <span><strong>相対濃度（cpm）× K値</strong><small>粉じん計の指示値をK値で質量濃度に換算します。</small></span>
            </label>
            <label>
              <input type="radio" name="managementClassDustInputMode" value="mass">
              <span><strong>質量濃度を直接入力</strong><small>すでにmg/m³として確定した値を使います。</small></span>
            </label>
          </fieldset>

          <label id="managementClassDustKField" class="management-class-tool__field">
            <span>K値 <em>必須</em></span>
            <input id="managementClassDustK" type="text" inputmode="decimal" autocomplete="off" placeholder="例：0.001" aria-describedby="managementClassDustKHelp">
            <small id="managementClassDustKHelp">質量濃度変換係数を mg/m³/cpm で入力します。使用するK値の決定方法・有効性は別途確認してください。</small>
          </label>
        </div>

        <p id="managementClassInputNotice" class="management-class-tool__input-notice" role="status" hidden></p>

        <label class="management-class-tool__field management-class-tool__field--measurements">
          <span><span id="managementClassAMeasurementsLabel">A測定値</span><em>5点以上</em></span>
          <textarea id="managementClassAMeasurements" rows="7" spellcheck="false" placeholder="例：&#10;9&#10;11&#10;12&#10;13&#10;15" aria-describedby="managementClassAHelp"></textarea>
          <small id="managementClassAHelp">1日測定のA測定値を入力します。著しく狭い単位作業場所など、5点未満が認められる例外はこのツールの対象外です。</small>
          <span id="managementClassAStatus" class="management-class-tool__measurement-status" aria-live="polite" hidden></span>
        </label>

        <label class="management-class-tool__toggle" for="managementClassBEnabled">
          <input id="managementClassBEnabled" type="checkbox">
          <span><strong>B測定を実施した</strong><small>発散源近接作業などでB測定を実施した場合に選びます。</small></span>
        </label>

        <div id="managementClassBPanel" class="management-class-tool__b-panel" hidden>
          <label class="management-class-tool__field management-class-tool__field--measurements">
            <span><span id="managementClassBMeasurementsLabel">B測定値</span><em>1点以上</em></span>
            <textarea id="managementClassBMeasurements" rows="4" spellcheck="false" placeholder="例：18&#10;22" aria-describedby="managementClassBHelp"></textarea>
            <small id="managementClassBHelp">複数ある場合はすべて入力します。判定には最大値を使用します。</small>
            <span id="managementClassBStatus" class="management-class-tool__measurement-status" aria-live="polite" hidden></span>
          </label>
        </div>

        <p id="managementClassError" class="management-class-tool__error" role="alert" hidden></p>

        <div class="management-class-tool__actions">
          <button class="management-class-tool__submit" type="submit">管理区分を判定する</button>
          <button id="managementClassExample" class="management-class-tool__secondary" type="button">例を入力</button>
          <button id="managementClassReset" class="management-class-tool__text-button" type="button">入力をリセット</button>
        </div>
      </form>
    </div>

    <div class="management-class-tool__result-wrap">
      <aside id="managementClassResultGuide" class="management-class-tool__result-guide" aria-labelledby="management-class-result-guide-title">
        <p class="section-kicker">判定結果</p>
        <h2 id="management-class-result-guide-title">ここに結果を表示します</h2>
        <p>選択した物質または粉じん条件、第一・第二評価値、B測定の最大値、最終の管理区分と判定理由を表示します。</p>
        <dl>
          <div><dt>対象・管理濃度</dt><dd>物質名の登録値、または粉じんのQから算出</dd></div>
          <div><dt>第1評価値</dt><dd>高濃度側5%に相当する推定値</dd></div>
          <div><dt>第2評価値</dt><dd>算術平均濃度の推定値</dd></div>
          <div><dt>B測定</dt><dd>実施時は最大値を判定に使用</dd></div>
        </dl>
      </aside>

      <aside id="managementClassResult" class="management-class-tool__result" aria-live="polite" tabindex="-1" hidden>
        <p class="management-class-tool__result-kicker">参考判定</p>
        <p id="managementClassResultSubject" class="management-class-tool__result-subject"></p>
        <h2 id="managementClassResultLabel"></h2>
        <p id="managementClassResultSummary" class="management-class-tool__result-summary"></p>
        <p id="managementClassResultInput" class="management-class-tool__result-input"></p>

        <dl class="management-class-tool__result-values">
          <div><dt>第1評価値</dt><dd id="managementClassResultEa1"></dd></div>
          <div><dt>第2評価値</dt><dd id="managementClassResultEa2"></dd></div>
          <div><dt>B測定 最大値</dt><dd id="managementClassResultB"></dd></div>
          <div><dt>幾何平均</dt><dd id="managementClassResultGm"></dd></div>
          <div><dt>幾何標準偏差</dt><dd id="managementClassResultGsd"></dd></div>
        </dl>

        <div class="management-class-tool__reason">
          <p id="managementClassResultAReason"></p>
          <p id="managementClassResultBReason"></p>
        </div>

        <div class="management-class-tool__next-action">
          <strong>次に確認すること</strong>
          <p id="managementClassResultAction"></p>
        </div>

        <button id="managementClassCopy" class="management-class-tool__copy" type="button">結果をコピー</button>
      </aside>
    </div>
  </section>

  <section class="management-class-tool__rules" aria-labelledby="management-class-rules-title">
    <div class="management-class-tool__heading">
      <p class="section-kicker">判定のしくみ</p>
      <h2 id="management-class-rules-title">A測定とB測定の、より厳しい区分を採用する</h2>
      <p>このツールは、1日測定のA測定値から評価値を計算し、B測定を実施した場合はその最大値も加えて判定します。</p>
    </div>

    <div class="management-class-tool__rule-grid">
      <article>
        <h3>A測定の判定</h3>
        <dl>
          <div><dt>第1管理区分</dt><dd>第1評価値 ＜ 管理濃度</dd></div>
          <div><dt>第2管理区分</dt><dd>第1評価値 ≧ 管理濃度 かつ 第2評価値 ≦ 管理濃度</dd></div>
          <div><dt>第3管理区分</dt><dd>第2評価値 ＞ 管理濃度</dd></div>
        </dl>
      </article>
      <article>
        <h3>B測定の判定</h3>
        <dl>
          <div><dt>第1管理区分</dt><dd>B測定値 ＜ 管理濃度</dd></div>
          <div><dt>第2管理区分</dt><dd>管理濃度 ≦ B測定値 ≦ 管理濃度 × 1.5</dd></div>
          <div><dt>第3管理区分</dt><dd>B測定値 ＞ 管理濃度 × 1.5</dd></div>
        </dl>
      </article>
    </div>

    <details class="management-class-tool__formula">
      <summary>評価値の計算式を確認する</summary>
      <div>
        <p>第1評価値：log EA₁ = log M₁ + 1.645 × √{(log σ₁)² + 0.084}</p>
        <p>第2評価値：log EA₂ = log M₁ + 1.151 × {(log σ₁)² + 0.084}</p>
        <p>M₁はA測定値の幾何平均、σ₁は幾何標準偏差です。このツールでは、A測定値の対数の不偏標準偏差（n−1で除す）を使用しています。</p>
        <p>粉じんの管理濃度：E = 3.0／（1.19Q＋1）。Qは遊離けい酸含有率（％）です。相対濃度で入力した場合は、各測定値にK値（mg/m³/cpm）を掛けてから評価します。</p>
      </div>
    </details>
  </section>

  <section class="management-class-tool__scope" aria-labelledby="management-class-scope-title">
    <div>
      <p class="section-kicker">利用上の注意</p>
      <h2 id="management-class-scope-title">入力前に、計算の対象かを確認する</h2>
      <p>数式が合っていても、測定方法や採用値が評価基準に合わなければ、管理区分は正しく決まりません。</p>
    </div>
    <div class="management-class-tool__scope-grid">
      <article>
        <h3>この版の対象</h3>
        <ul>
          <li>別表に管理濃度がある単一物質、または手入力した管理濃度のA測定・任意のB測定</li>
          <li>粉じんの遊離けい酸含有率Qからの管理濃度算定</li>
          <li>相対濃度（cpm）とK値による質量濃度換算、または質量濃度の直接入力</li>
          <li>同一作業日のA測定値</li>
        </ul>
      </article>
      <article>
        <h3>この版の対象外</h3>
        <ul>
          <li>連続する2作業日にわたる評価</li>
          <li>C・D測定、騒音の評価</li>
          <li>混合有機溶剤の換算値、複数物質の合算評価</li>
          <li>遊離けい酸含有率の分析、K値の決定・妥当性確認</li>
          <li>定量下限未満などの採用値を決める処理</li>
        </ul>
      </article>
    </div>
  </section>

  <section class="management-class-tool__references" aria-labelledby="management-class-reference-title">
    <p class="section-kicker">根拠・関連ページ</p>
    <h2 id="management-class-reference-title">最終確認は一次情報と測定条件で行う</h2>
    <ul>
      <li><a href="https://laws.e-gov.go.jp/" target="_blank" rel="noopener noreferrer">e-Gov法令検索</a>：作業環境評価基準（昭和63年労働省告示第79号）第2条・第3条、別表を確認</li>
      <li><a href="https://www.jaish.gr.jp/horei/hor1-18/hor1-18-2-1-2.html" target="_blank" rel="noopener noreferrer">作業環境評価基準 別表（安全衛生情報センター）</a>：物質名から設定する管理濃度の根拠。表の値は温度25℃・1気圧の空気中の濃度です。</li>
      <li><a href="https://www.jaish.gr.jp/anzen/hor/hombun/hor1-31/hor1-31-13-1-0.htm" target="_blank" rel="noopener noreferrer">質量濃度変換係数に関する通達（安全衛生情報センター）</a>：相対濃度指示方法で用いるK値の扱いを確認</li>
      <li><a href="https://www.jaish.gr.jp/anzen/hor/hombun/hor1-18/hor1-18-1-1-0.htm" target="_blank" rel="noopener noreferrer">作業環境測定基準（安全衛生情報センター）</a>：A測定・B測定の測定点、実施条件を確認</li>
      <li><a href="{{ '/guides/management-concentration-exposure-limits/' | relative_url }}">管理濃度・濃度基準値・許容濃度の違い</a>：比較する指標を取り違えないための解説</li>
      <li><a href="{{ '/qa/third-control-class/' | relative_url }}">第3管理区分になった場合のQ&amp;A</a>：判定後の確認・改善の進め方</li>
    </ul>
  </section>
</div>

<script type="module" src="{{ '/assets/js/management-class-calculator.mjs' | relative_url }}"></script>
