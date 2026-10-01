---
title: 保存した記事・閲覧履歴
description: この端末で保存した労働衛生の解説と、最近読んだ記事を確認できます。
lead: 続きから学ぶための、端末内の読書リストです。
permalink: /reading-list/
noindex: true
pagefind_ignore: true
sitemap: false
---

<div class="reading-list-page">
  <p>記事ページの「この記事を保存」で追加できます。保存と閲覧履歴はこのブラウザ内に保存され、別の端末とは同期されません。</p>
  <noscript><p>この一覧を表示するにはJavaScriptを有効にしてください。<a href="{{ '/learn/' | relative_url }}">学習ロードマップ</a>はそのまま利用できます。</p></noscript>
  <p data-reading-status role="status"></p>
  <section aria-labelledby="saved-title"><h2 id="saved-title">保存した記事</h2><ul class="reading-list" data-saved-list></ul></section>
  <section aria-labelledby="history-title"><h2 id="history-title">最近読んだ記事</h2><p>直近12件を表示します。</p><ul class="reading-list" data-history-list></ul><button type="button" class="btn-step" data-clear-history>閲覧履歴を消去</button></section>
  <p><a class="card-link" href="{{ '/learn/' | relative_url }}">学習ロードマップへ →</a></p>
</div>
{% assign reading_pages = site.pages | where: 'layout', 'article' %}
{% assign reading_catalog = site.guides | concat: site.updates | concat: site.posts | concat: reading_pages %}
<script type="application/json" id="reading-catalog">[{% assign written = 0 %}{% for item in reading_catalog %}{% unless item.status == 'wip' or item.status == 'internal' or item.published == false %}{% if written > 0 %},{% endif %}{"url":{{ item.url | relative_url | jsonify }},"title":{{ item.title | jsonify }}}{% assign written = written | plus: 1 %}{% endunless %}{% endfor %}]</script>
<script src="{{ '/assets/js/article-reading.js' | relative_url }}" defer></script>
