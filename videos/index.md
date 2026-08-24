---
title: 動画・記事ライブラリ
description: YouTubeで概要をつかみ、noteで読み進め、労働衛生ラボの記事で要点・一次情報・更新内容を確認できるテーマ別ライブラリです。
eyebrow: YouTube・note連動
lead: ひとつのテーマを、動画でつかみ、noteで読み、サイトで要点と一次情報を確認できます。
permalink: /videos/
---

{% assign library = site.data.content_library %}
<div class="library-page">
  <section class="library-roles" aria-labelledby="library-roles-title">
    <h2 id="library-roles-title">3つの媒体を、学び方に合わせて</h2>
    <div><article><h3>YouTube</h3><p>図や音声で全体像をつかむ</p></article><article><h3>note</h3><p>文章で順番に読み進める</p></article><article><h3>労働衛生ラボ</h3><p>要点・一次情報・更新内容を確認する</p></article></div>
  </section>

  <details class="learning-compass" data-learning-compass data-baseurl="{{ site.baseurl }}">
    <summary>
      <span class="learning-compass__summary-copy">
        <span class="section-kicker">学習コンパス</span>
        <strong>目的と時間から、今の1本を選ぶ</strong>
        <span>3つの条件から、動画・note・サイト記事を案内します。</span>
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

  <section aria-labelledby="latest-library-title">
    <p class="section-kicker">新しい順に掲載</p><h2 id="latest-library-title">新着テーマ</h2>
    <p class="library-page__notice">サイト記事を実務へ適用する前に、一次情報と最終確認日も確認してください。</p>
    <div class="library-grid">{% for item in library limit:3 %}{% include content-library-card.html item=item %}{% endfor %}</div>
  </section>

  {% assign categories = "作業環境測定|化学物質管理|個人ばく露測定|局所排気装置|労働衛生コンサルタント・資格|AI活用|その他の労働衛生" | split: "|" %}
  {% assign category_ids = "work-environment-measurement|chemical-management|personal-exposure|local-exhaust|consultant|ai-use|other" | split: "|" %}
  <nav class="library-category-nav" aria-labelledby="library-category-title">
    <h2 id="library-category-title">カテゴリから探す</h2>
    <div>{% for category in categories %}{% assign category_items = library | where: "category", category %}{% if category_items.size > 0 %}<a href="#{{ category_ids[forloop.index0] }}">{{ category }}</a>{% endif %}{% endfor %}</div>
  </nav>

  {% for category in categories %}{% assign category_items = library | where: "category", category %}{% if category_items.size > 0 %}<section class="library-category" id="{{ category_ids[forloop.index0] }}" aria-labelledby="{{ category_ids[forloop.index0] }}-title"><h2 id="{{ category_ids[forloop.index0] }}-title">{{ category }}</h2><div class="library-grid">{% for item in category_items %}{% include content-library-card.html item=item %}{% endfor %}</div></section>{% endif %}{% endfor %}

  <section class="library-all-links" aria-labelledby="library-all-title"><h2 id="library-all-title">それぞれの一覧を見る</h2><div><a href="https://www.youtube.com/channel/UCT2gRzcZrwl8W64LOGUb3cw" target="_blank" rel="noopener noreferrer">YouTubeチャンネルをすべて見る<span class="sr-only">（外部サイト）</span></a><a href="https://note.com/eisei_ai_channel" target="_blank" rel="noopener noreferrer">noteの記事をすべて見る<span class="sr-only">（外部サイト）</span></a><a href="{{ '/guides/' | relative_url }}">サイトの解説一覧を見る</a></div></section>
  <aside class="library-caution"><h2>一次情報の確認について</h2><p>YouTubeとnoteは理解を助ける関連教材であり、法令上の根拠資料ではありません。法令・制度は改正されるため、実務上の判断では厚生労働省、e-Gov法令検索、告示・通達などの最新の一次情報を確認してください。</p></aside>
</div>
