---
title: 測定・点検の実施頻度と記録保存期間の早見表
description: 有機溶剤、特定化学物質、鉛、粉じん、騒音、局所排気装置の測定・点検頻度と主な記録保存期間を一覧で確認できます。
eyebrow: 実務早見表
lead: 「次はいつ測るか」「記録を何年残すか」を、対象ごとに素早く確認するための一覧です。
permalink: /tools/measurement-records/
---

<link rel="stylesheet" href="{{ '/assets/css/practical-tools.css' | relative_url }}">

<div class="practical-tool" data-record-reference>
  <section class="practical-tool__intro" aria-labelledby="record-reference-title">
    <p class="section-kicker">測定・点検・記録</p>
    <h2 id="record-reference-title">頻度と保存期間を、対象ごとに並べて確認する</h2>
    <p>作業環境測定と設備の定期自主検査で、実務上よく確認する頻度・保存期間をまとめています。対象作業や装置の適用条件まで自動判定するページではありません。</p>
    <ul class="practical-tool__notes">
      <li>法令・ガイドラインは2026年9月6日に厚生労働省の一次情報で確認しています。</li>
      <li>特定化学物質や特別有機溶剤等は、物質・作業場によって30年保存などの例外があります。個別条文を必ず確認してください。</li>
      <li>第3管理区分に対する個人サンプリング測定等など、通常の定期測定と異なる追加措置はこの表の主欄には含めていません。</li>
    </ul>
  </section>

  <section class="record-tools" aria-labelledby="record-table-title">
    <div class="practical-tool__filter">
      <label>
        キーワード
        <input id="recordSearch" type="search" autocomplete="off" placeholder="例：粉じん、局所排気、3年">
      </label>
      <label>
        種類
        <select id="recordCategory">
          <option value="all">すべて</option>
          <option value="measurement">作業環境測定</option>
          <option value="inspection">設備の点検・検査</option>
        </select>
      </label>
    </div>

    <p id="recordSummary" class="record-summary" aria-live="polite"></p>

    <div class="record-table-wrap">
      <table class="record-table">
        <thead>
          <tr>
            <th id="record-table-title">対象</th>
            <th>主な実施頻度</th>
            <th>主な保存期間</th>
            <th>実務上の注意</th>
          </tr>
        </thead>
        <tbody>
          <tr data-record-row data-category="measurement" data-search="有機溶剤 作業環境測定 6月 半年 3年 特別有機溶剤 30年">
            <td>有機溶剤の作業環境測定</td>
            <td class="record-frequency">6月以内ごとに1回</td>
            <td class="record-retention">3年間</td>
            <td>有機則第28条の対象屋内作業場。特別有機溶剤等は特化則の適用関係により長期保存となる場合があるため、物質ごとに確認します。<br><a class="record-source" href="https://www.mhlw.go.jp/web/t_doc?dataId=74090000" target="_blank" rel="noopener noreferrer">厚生労働省：有機溶剤中毒予防規則</a></td>
          </tr>
          <tr data-record-row data-category="measurement" data-search="特定化学物質 特化物 作業環境測定 6月 半年 3年 30年">
            <td>特定化学物質の作業環境測定</td>
            <td class="record-frequency">6月以内ごとに1回</td>
            <td class="record-retention">原則3年間</td>
            <td>特化則第36条。対象物質・作業場によって測定記録を30年間保存する規定があります。「特化物＝すべて3年」とは扱わず、対象物質を条文で確認します。<br><a class="record-source" href="https://www.mhlw.go.jp/web/t_doc?dataId=74097000&dataType=0" target="_blank" rel="noopener noreferrer">厚生労働省：特定化学物質障害予防規則</a></td>
          </tr>
          <tr data-record-row data-category="measurement" data-search="鉛 作業環境測定 1年 一年 3年">
            <td>鉛の作業環境測定</td>
            <td class="record-frequency">1年以内ごとに1回</td>
            <td class="record-retention">3年間</td>
            <td>鉛則第52条の対象屋内作業場。測定だけでなく評価記録も3年間保存します。<br><a class="record-source" href="https://www.mhlw.go.jp/web/t_doc?dataId=74094000&dataType=0" target="_blank" rel="noopener noreferrer">厚生労働省：鉛中毒予防規則</a></td>
          </tr>
          <tr data-record-row data-category="measurement" data-search="粉じん 作業環境測定 6月 半年 7年 遊離けい酸">
            <td>粉じんの作業環境測定</td>
            <td class="record-frequency">6月以内ごとに1回</td>
            <td class="record-retention">7年間</td>
            <td>粉じん則第26条。土石・岩石・鉱物に係る特定粉じん作業では、原則として遊離けい酸含有率の確認も必要です。一定条件で特例許可の制度があります。<br><a class="record-source" href="https://www.mhlw.go.jp/web/t_doc?dataId=74107000&dataType=0&pageNo=1" target="_blank" rel="noopener noreferrer">厚生労働省：粉じん障害防止規則</a></td>
          </tr>
          <tr data-record-row data-category="measurement" data-search="騒音 作業環境測定 6月 半年 3年 85dB ガイドライン">
            <td>騒音作業の測定</td>
            <td class="record-frequency">6月以内ごとに1回</td>
            <td class="record-retention">3年間</td>
            <td>2023年改訂の騒音障害防止ガイドライン。別表第1は法令上の測定義務がある屋内作業場、別表第2等では継続して第Ⅰ管理区分・85dB未満など一定条件で定期測定を省略できる場合があります。<br><a class="record-source" href="https://www.mhlw.go.jp/web/t_doc?dataId=00tc7618&dataType=1" target="_blank" rel="noopener noreferrer">厚生労働省：騒音障害防止のためのガイドライン</a></td>
          </tr>
          <tr data-record-row data-category="inspection" data-search="局所排気装置 プッシュプル 除じん 定期自主検査 1年 一年 3年 有機溶剤 特化物 粉じん 鉛">
            <td>局所排気装置等の定期自主検査</td>
            <td class="record-frequency">1年以内ごとに1回</td>
            <td class="record-retention">3年間</td>
            <td>有機則・特化則・鉛則・粉じん則などで対象となる局所排気装置等。長期間使用しない場合や再使用時の扱いなど、各規則の適用条件を確認します。<br><a class="record-source" href="https://www.mhlw.go.jp/web/t_doc?dataId=00tb5578&dataType=1" target="_blank" rel="noopener noreferrer">厚生労働省：局所排気装置の定期自主検査指針等</a></td>
          </tr>
        </tbody>
      </table>
    </div>
    <p id="recordEmpty" class="record-empty" hidden>該当する項目がありません。</p>
  </section>

  <section class="practical-tool__section" aria-labelledby="record-caution-title">
    <h2 id="record-caution-title">「3年」とだけ覚えない</h2>
    <div class="practical-tool__reference">
      <p>保存期間は規則ごとに異なります。特に粉じんは7年間で、有機溶剤・特定化学物質には長期保存となる例外があります。測定対象を決めた時点で、測定頻度と保存期間をセットで確認すると漏れを減らせます。</p>
      <p>設備の定期自主検査も、対象装置と適用規則を確認してから年間予定に組み込みます。作業環境測定の実施月だけで管理すると、局所排気装置の検査期限を見落とすことがあります。</p>
    </div>
  </section>

  <section class="practical-tool__section" aria-labelledby="record-related-title">
    <h2 id="record-related-title">関連ページ</h2>
    <div class="practical-tool__reference">
      <ul>
        <li><a href="{{ '/regulations/' | relative_url }}">法令・規則から調べる</a></li>
        <li><a href="{{ '/local-exhaust-ventilation/' | relative_url }}">局所排気装置の実務を確認する</a></li>
        <li><a href="{{ '/tools/management-class/' | relative_url }}">管理区分判定ツール</a></li>
      </ul>
    </div>
  </section>
</div>

<script src="{{ '/assets/js/practical-tools.js' | relative_url }}" defer></script>
