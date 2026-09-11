---
title: TWA計算ツール｜時間加重平均濃度を計算
description: 複数の濃度とばく露時間から区間加重平均と8時間TWAを計算し、任意のばく露限度との比率も確認できます。
eyebrow: 実務ツール
lead: 作業ごとに濃度が変わる日のばく露を、時間加重平均としてまとめて確認できます。
permalink: /tools/twa-calculator/
---

<link rel="stylesheet" href="{{ '/assets/css/practical-tools.css' | relative_url }}">

<div class="practical-tool" data-twa-calculator>
  <section class="practical-tool__intro" aria-labelledby="twa-purpose-title">
    <p class="section-kicker">個人ばく露・時間加重平均</p>
    <h2 id="twa-purpose-title">濃度×時間を足し合わせ、8時間TWAへ換算する</h2>
    <p>作業1、作業2、休憩前後など、濃度が異なる区間を入力すると、入力区間の時間加重平均と8時間TWA参考値を計算します。任意でばく露限度を入力すれば、その値に対する比率も表示します。</p>
    <ul class="practical-tool__notes">
      <li>すべての濃度は同じ単位で入力してください。</li>
      <li>8時間TWAは Σ（濃度×時間）÷8 で計算します。未入力時間は「ばく露不明」です。対象時間分がそろうまで8時間TWAと限度比は表示しません。</li>
      <li>ばく露限度の選択、長時間勤務時の補正、短時間ばく露限度や天井値の評価は、この計算とは別に確認してください。</li>
    </ul>
  </section>

  <section class="practical-tool__shell" aria-labelledby="twa-calculator-title">
    <div class="practical-tool__panel">
      <form id="twaForm" class="practical-tool__form" novalidate>
        <div>
          <p class="section-kicker">入力</p>
          <h2 id="twa-calculator-title">作業ごとの濃度と時間</h2>
        </div>

        <div class="practical-tool__field-grid">
          <label class="practical-tool__field">
            <span>濃度の単位</span>
            <input id="twaUnit" type="text" autocomplete="off" placeholder="例：ppm または mg/m³">
            <small>各区間で共通の単位を入力します。</small>
          </label>
          <label class="practical-tool__field">
            <span>比較するばく露限度 <em>任意</em></span>
            <input id="twaLimit" type="text" inputmode="decimal" autocomplete="off" placeholder="例：10">
            <small>入力した場合だけ、8時間TWAとの比率を表示します。</small>
          </label>
        </div>

        <label class="practical-tool__field">
          <span>対象時間（時間）</span>
          <input id="twaTargetHours" type="text" inputmode="decimal" value="8" aria-describedby="twa-time-help">
          <small id="twa-time-help">通常は8時間。8時間超の勤務は勤務全体の時間を入力します（上限24時間）。分母は常に8時間です。</small>
        </label>
        <p>区間は重複させず、休憩なども含めて入力してください。勤務が8時間未満の場合も、残りの時間のばく露を確認します。<strong>ばく露0と判断できる区間だけ、濃度「0」と時間を明示入力</strong>してください。未測定・不明・定量下限未満を自動的に0にしないでください。両方空欄の行は区間として数えません。</p>

        <div id="twaRows" class="twa-rows" aria-label="濃度とばく露時間の入力行"></div>
        <button id="twaAddRow" class="practical-tool__secondary twa-add-row" type="button">区間を追加</button>

        <p id="twaError" class="practical-tool__error" role="alert" hidden></p>
        <div class="practical-tool__actions">
          <button class="practical-tool__submit" type="submit">TWAを計算する</button>
          <button id="twaExample" class="practical-tool__secondary" type="button">例を入力</button>
          <button id="twaReset" class="practical-tool__text-button" type="button">リセット</button>
        </div>
      </form>
    </div>

    <div>
      <aside id="twaPlaceholder" class="practical-tool__result" aria-label="TWA計算結果の説明">
        <p class="section-kicker">計算結果</p>
        <h2>ここに8時間TWAを表示します</h2>
        <p class="practical-tool__placeholder">入力時間の合計、区間加重平均、濃度×時間の総和も表示します。</p>
      </aside>
      <aside id="twaResult" class="practical-tool__result" aria-live="polite" tabindex="-1" hidden>
        <p class="section-kicker">8時間TWA参考値</p>
        <p id="twaResultPrimary" class="practical-tool__result-primary"></p>
        <p id="twaResultSummary" class="practical-tool__result-summary"></p>
        <dl class="practical-tool__result-details">
          <div><dt>未把握時間</dt><dd id="twaMissingHours"></dd></div>
          <div><dt>入力時間合計</dt><dd id="twaTotalHours"></dd></div>
          <div><dt>入力区間の加重平均</dt><dd id="twaObserved"></dd></div>
          <div><dt>Σ（濃度×時間）</dt><dd id="twaDose"></dd></div>
          <div><dt>ばく露限度比</dt><dd id="twaRatio"></dd></div>
        </dl>
        <p id="twaResultFormula" class="practical-tool__formula"></p>
      </aside>
    </div>
  </section>

  <section class="practical-tool__section" aria-labelledby="twa-reading-title">
    <h2 id="twa-reading-title">2つの平均値を混同しない</h2>
    <div class="practical-tool__reference">
      <h3>入力区間の加重平均</h3>
      <p>入力した時間だけを分母にします。例えば4時間分だけ測定・推定した場合、その4時間内の平均濃度を確認する値です。</p>
      <h3>8時間TWA</h3>
      <p>濃度×時間の総和を8時間で割った値です。このツールでは対象時間全体の入力を確認してから8時間に規格化します。例えば濃度10で4時間だけ入力した場合、入力区間の平均は10ですが、残り4時間が不明なら8時間TWAは算出しません。残り4時間のばく露0が確認でき、0×4時間を追加した場合に限り、8時間TWAは5になります。</p>
      <h3>短時間ばく露は別評価</h3>
      <p>8時間TWAが低くても、短時間に高濃度へばく露する作業は別の基準で確認が必要な場合があります。このツールはSTELや天井値の判定を行いません。</p>
    </div>
  </section>

  <section class="practical-tool__section" aria-labelledby="twa-related-title">
    <h2 id="twa-related-title">関連ページ</h2>
    <div class="practical-tool__reference">
      <ul>
        <li><a href="{{ '/personal-exposure-measurement/' | relative_url }}">個人ばく露測定を確認する</a></li>
        <li><a href="{{ '/guides/management-concentration-exposure-limits/' | relative_url }}">管理濃度・濃度基準値・許容濃度の違い</a></li>
        <li><a href="{{ '/tools/air-sampling-calculator/' | relative_url }}">採気量・必要採取時間を計算する</a></li>
      </ul>
    </div>
  </section>
</div>

<script src="{{ '/assets/js/twa-core.js' | relative_url }}" defer></script>
<script src="{{ '/assets/js/practical-tools.js' | relative_url }}" defer></script>
