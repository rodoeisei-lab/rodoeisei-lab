---
title: 動画・YouTube連動記事
description: 労働衛生×AIラボの長編解説とShortsを、作業環境測定、個人ばく露測定、資格、局所排気装置などのテーマ別に整理し、対応する詳しい解説記事へ案内します。
eyebrow: 労働衛生×AIラボ
lead: 動画で全体像をつかみ、対応する記事と一次情報で内容を確認できる学習ページです。
permalink: /videos/
---

{% assign youtube = site.data.youtube %}
<div class="video-hub">
  <section class="video-hub__intro" aria-labelledby="video-purpose">
    <h2 id="video-purpose">動画から、詳しい記事と一次情報へ</h2>
    <p>主要動画を入口に、テーマの全体像を短時間でつかみ、対応記事で条件・根拠・注意点を確認できます。掲載動画はYouTube上で再生され、このページでは自動再生やiframe埋め込みを行いません。</p>
  </section>

  <section aria-labelledby="featured-video">
    <h2 id="featured-video">注目動画</h2>
    {% for video in youtube.videos %}{% if video.featured %}<div class="video-featured">{% include video-card.html video=video featured=true %}</div>{% endif %}{% endfor %}
  </section>

  <section aria-labelledby="long-videos">
    <h2 id="long-videos">長編解説</h2>
    <p>背景や実務上の考え方を、順を追って学べる動画です。</p>
    <div class="video-grid">{% for video in youtube.videos %}{% if video.format == "long" and video.featured != true %}{% include video-card.html video=video %}{% endif %}{% endfor %}</div>
  </section>

  <section aria-labelledby="short-videos">
    <h2 id="short-videos">Shorts</h2>
    <p>用語や判断のポイントを短く確認できる縦型動画です。</p>
    <div class="video-grid">{% for video in youtube.videos %}{% if video.format == "short" %}{% include video-card.html video=video %}{% endif %}{% endfor %}</div>
  </section>

  <section aria-labelledby="linked-videos">
    <h2 id="linked-videos">対応記事がある動画</h2>
    <ul class="video-article-links">{% for video in youtube.videos %}{% if video.article_url %}<li><a href="{{ video.article_url | relative_url }}">{{ video.article_label | default: video.title }}</a><span>{{ video.topic }}</span></li>{% endif %}{% endfor %}</ul>
  </section>

  <section class="video-hub__guide" aria-labelledby="video-use">
    <h2 id="video-use">動画と記事の使い分け</h2>
    <div><article><h3>動画で全体像をつかむ</h3><p>初めてのテーマは、長編解説やShortsで用語と論点の位置関係を確認します。</p></article><article><h3>記事で条件を確かめる</h3><p>実務へ適用する前に、対応記事の注意点と一次情報を読み、対象・施行日・例外を確認します。</p></article></div>
  </section>

  <section class="video-channel" aria-labelledby="youtube-channel">
    <h2 id="youtube-channel">YouTubeチャンネル</h2>
    <p>新しい動画や、このページに掲載していない動画は「{{ youtube.channel.name }}」で確認できます。</p>
    <a class="video-link video-link--youtube" href="{{ youtube.channel.url }}" target="_blank" rel="noopener noreferrer">労働衛生×AIラボをYouTubeで見る（外部）</a>
  </section>

  <section aria-labelledby="information-note">
    <h2 id="information-note">情報確認上の注意</h2>
    <p>動画は公開時点の情報を解説しています。法令・告示・通達や試験情報は改正されることがあるため、実務判断では対応記事に掲載した一次情報と最新の公式情報を確認してください。動画は法的助言や個別事業場の判断を代替するものではありません。</p>
  </section>

  <p class="video-hub__checked"><strong>最終確認日：</strong>{{ youtube.channel.checked_at | date: "%Y年%-m月%-d日" }}</p>
</div>
