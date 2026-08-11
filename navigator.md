---
layout: page
title: 質問から探す
description: 作業環境測定や化学物質管理について質問文を入力すると、労働衛生ラボ内の確認済み案内と関連ページを表示します。
eyebrow: チャット型サイト案内
lead: 知りたいことを文章で入力すると、公開中の記事から近い情報を案内します。
permalink: /navigator/
pagefind_ignore: true
---

<div class="navigator-page">
  <section class="navigator-intro" aria-labelledby="navigator-intro-title">
    <div>
      <p class="navigator-status">試験版</p>
      <h2 id="navigator-intro-title">労働衛生ナビ</h2>
      <p>よくある質問には確認済みの短い案内を表示し、あわせてPagefindで関連する公開ページを探します。</p>
    </div>
    <p class="navigator-intro-note"><strong>生成AIではありません。</strong>サイトにない内容を推測して回答する機能ではなく、公開済み情報への案内です。</p>
  </section>

  <section
    class="navigator-shell"
    id="site-navigator"
    aria-labelledby="navigator-title"
    data-pagefind-module="{{ '/pagefind/pagefind.js' | relative_url }}"
    data-pagefind-base="{{ '/pagefind/' | relative_url }}"
    data-baseurl="{{ site.baseurl }}"
  >
    <div class="navigator-shell-header">
      <div>
        <p class="section-kicker">質問から記事を探す</p>
        <h2 id="navigator-title">何を知りたいですか？</h2>
      </div>
      <button class="navigator-clear" id="navigator-clear" type="button" hidden>表示を消す</button>
    </div>

    <div class="navigator-log" id="navigator-log" role="log" aria-live="polite" aria-relevant="additions text">
      <div class="navigator-message navigator-message--guide">
        <p>作業環境測定、化学物質管理、個人ばく露測定などについて、質問文のまま入力してください。</p>
      </div>
    </div>

    <div class="navigator-suggestions" aria-label="質問例">
      <p>質問例</p>
      <div>
        <button type="button" data-navigator-question="A測定とB測定の違いは？">A測定とB測定の違い</button>
        <button type="button" data-navigator-question="SDSはどこを確認する？">SDSの確認箇所</button>
        <button type="button" data-navigator-question="個人ばく露測定とは？">個人ばく露測定とは</button>
      </div>
    </div>

    <form class="navigator-form" id="navigator-form" role="search" action="{{ '/search/' | relative_url }}" method="get">
      <label for="navigator-query">質問を入力</label>
      <div>
        <input
          id="navigator-query"
          name="q"
          type="search"
          inputmode="search"
          autocomplete="off"
          maxlength="120"
          placeholder="例：局所排気装置の制御風速とは？"
          required
        >
        <button type="submit">質問する</button>
      </div>
    </form>

    <p class="navigator-privacy">質問内容は外部のAIサービスへ送信せず、このページ内の検索にだけ使用します。</p>
    <noscript><p class="navigator-error">この機能にはJavaScriptが必要です。通常の<a href="{{ '/search/' | relative_url }}">サイト内検索</a>をご利用ください。</p></noscript>
  </section>

  <aside class="navigator-caution" aria-label="利用上の注意">
    <strong>利用上の注意</strong>
    <p>法令や制度は改正されることがあります。個別案件の最終判断には使用せず、案内先の記事にある確認日と、厚生労働省・e-Govなどの一次情報を確認してください。</p>
  </aside>
</div>

<script id="navigator-answers" type="application/json">{{ site.data.navigator_answers | jsonify }}</script>
<script id="navigator-library" type="application/json">{{ site.data.content_library | jsonify }}</script>
<script src="{{ '/assets/js/site-navigator.js' | relative_url }}" defer></script>
