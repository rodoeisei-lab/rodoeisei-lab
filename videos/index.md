---
title: 動画・記事ライブラリ
description: YouTube、note、労働衛生ラボの記事をテーマ単位でまとめ、分野・媒体・難易度・所要時間から探せる学習ライブラリです。
eyebrow: 動画・記事ライブラリ
lead: 同じテーマを、動画でつかみ、記事で確認し、必要に応じてnoteで読み進められます。
permalink: /videos/
---

{% assign library = site.data.content_library | sort: "published_at" | reverse %}
<div class="library-page">
  <section class="library-roles" aria-labelledby="library-roles-title">
    <p class="section-kicker">媒体の使い分け</p>
    <h2 id="library-roles-title">目的に合わせて、見る・読む・確認する</h2>
    <div>
      <article><h3>YouTube</h3><p>短時間で全体像やポイントをつかむ</p></article>
      <article><h3>労働衛生ラボ</h3><p>要点、注意点、一次情報への導線を確認する</p></article>
      <article><h3>note</h3><p>用意があるテーマは文章で順番に読み進める</p></article>
    </div>
  </section>

  <section aria-labelledby="latest-library-title">
    <div class="library-section-heading">
      <p class="section-kicker">新しい順</p>
      <h2 id="latest-library-title">新着テーマ</h2>
      <p>新しく追加したテーマから3件を表示しています。</p>
    </div>
    <div class="library-grid">
      {% for item in library limit:3 %}{% include content-library-card.html item=item %}{% endfor %}
    </div>
  </section>

  <section class="library-discovery" data-library-filter aria-labelledby="library-filter-title">
    <div class="library-section-heading">
      <p class="section-kicker">検索・絞り込み</p>
      <h2 id="library-filter-title">必要なテーマを絞る</h2>
      <p>キーワード、分野、媒体、難易度、使える時間から絞り込めます。</p>
    </div>
    <div class="library-filter-grid">
      <label class="library-filter-search"><span>キーワード</span><input type="search" data-library-query placeholder="例：個人ばく露、局所排気、93単位"></label>
      <label><span>分野</span><select data-library-category>
        <option value="">すべて</option>
        <option value="作業環境測定">作業環境測定</option>
        <option value="個人ばく露測定">個人ばく露測定</option>
        <option value="局所排気装置">局所排気装置</option>
        <option value="資格・キャリア">資格・キャリア</option>
        <option value="職場環境・騒音">職場環境・騒音</option>
      </select></label>
      <label><span>媒体</span><select data-library-medium>
        <option value="">すべて</option>
        <option value="site">サイト記事あり</option>
        <option value="youtube">YouTubeあり</option>
        <option value="note">noteあり</option>
      </select></label>
      <label><span>難易度</span><select data-library-level>
        <option value="">すべて</option>
        <option value="beginner">入門</option>
        <option value="intermediate">中級</option>
      </select></label>
      <label><span>使える時間</span><select data-library-time>
        <option value="">指定なし</option>
        <option value="3">3分程度</option>
        <option value="10">10分以内</option>
        <option value="deep">じっくり</option>
      </select></label>
    </div>
    <div class="library-filter-status">
      <p data-library-count aria-live="polite"></p>
      <button type="button" data-library-reset>条件をリセット</button>
    </div>
  </section>

  <details class="learning-compass" data-learning-compass data-baseurl="{{ site.baseurl }}">
    <summary>
      <span class="learning-compass__summary-copy">
        <span class="section-kicker">学習コンパス</span>
        <strong>何から見ればいいか迷ったとき</strong>
        <span>目的と使える時間から、今の1本を案内します。</span>
      </span>
      <span class="learning-compass__summary-action" aria-hidden="true"><span>条件を選ぶ</span><span>閉じる</span></span>
    </summary>
    <div class="learning-compass__body">
      <form class="learning-compass__form">
        <label><span><b>1</b>目的</span><select name="purpose"><option value="overview">まず全体像を知りたい</option><option value="practice">実務で確認したい</option><option value="qualification">資格学習に使いたい</option></select></label>
        <label><span><b>2</b>使える時間</span><select name="time"><option value="3">3分</option><option value="10">10分</option><option value="deep">じっくり</option></select></label>
        <label><span><b>3</b>学び方</span><select name="format"><option value="auto">おまかせ</option><option value="youtube">動画</option><option value="note">文章</option><option value="site">一次情報まで確認</option></select></label>
      </form>
      <div class="learning-compass__result" aria-live="polite" aria-atomic="true"></div>
      <aside class="learning-history" data-learning-history hidden></aside>
    </div>
  </details>

  <script type="application/json" id="learning-library-data">{{ site.data.content_library | jsonify }}</script>
  <script type="application/json" id="learning-youtube-data">{{ site.data.youtube.videos | jsonify }}</script>

  <section id="library-all" aria-labelledby="all-library-title">
    <div class="library-section-heading">
      <p class="section-kicker">全テーマ</p>
      <h2 id="all-library-title">動画・記事をまとめて探す</h2>
      <p>媒体がすべて揃っていないテーマも掲載しています。表示されているボタンから利用できる媒体へ進めます。</p>
    </div>
    <p class="library-page__notice">サイト記事を実務へ適用する前に、一次情報と最終確認日も確認してください。</p>
    <div class="library-grid" data-library-results>
      {% for item in library %}{% include content-library-card.html item=item %}{% endfor %}
    </div>
    <p class="library-filter-empty" data-library-empty hidden>条件に一致するテーマがありません。条件を減らして再度お試しください。</p>
  </section>

  <section class="library-all-links" aria-labelledby="library-all-title"><h2 id="library-all-title">媒体ごとの一覧を見る</h2><div><a href="https://www.youtube.com/channel/UCT2gRzcZrwl8W64LOGUb3cw" target="_blank" rel="noopener noreferrer">YouTubeチャンネルをすべて見る<span class="sr-only">（外部サイト）</span></a><a href="https://note.com/eisei_ai_channel" target="_blank" rel="noopener noreferrer">noteの記事をすべて見る<span class="sr-only">（外部サイト）</span></a><a href="{{ '/guides/' | relative_url }}">サイトの解説一覧を見る</a></div></section>

  <aside class="library-caution"><h2>一次情報の確認について</h2><p>YouTubeとnoteは理解を助ける関連教材です。法令・制度は改正されるため、実務上の判断では厚生労働省、e-Gov法令検索、告示・通達などの最新の一次情報を確認してください。</p></aside>
</div>

<script src="{{ '/assets/js/content-library-filter.js' | relative_url }}" defer></script>
