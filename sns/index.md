---
layout: page
title: SNSリンク集へ
description: 最新の更新告知はSNSでも先に流れます。
permalink: /sns-links/
---
{% assign home = site.data.home %}

<div class="sns-collection" id="main">
  <h1>SNSリンク集へ</h1>
  <p class="sns-lead">最新の更新告知はSNSでも先に流れます。</p>

  <article class="primary-topic-card sns-primary-topic">
    <div class="topic-leading"><div class="topic-icon">📘</div><div><span class="chip-highlight">おすすめ</span><h2>過去問（公式）</h2><p>年度別の過去問にすぐアクセス。</p></div></div>
    <a href="{{ '/past-exams/' | relative_url }}" class="primary-topic-btn">過去問を見る</a>
  </article>

  <div class="sns-links">{% for link in home.sns %}<a href="{{ link.url }}" target="_blank" rel="noopener" class="sns-link-card"><span class="sns-icon">{{ link.icon }}</span><div><strong>{{ link.title }}</strong><p>{{ link.description }}</p></div><span>開く ↗</span></a>{% endfor %}</div>
</div>
