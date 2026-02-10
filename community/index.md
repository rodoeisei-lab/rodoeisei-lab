---
title: コミュニティ
description: 労働衛生の実務者が悩みや気づきを共有できる場。
permalink: /community/
---

<section class="section">
  <h2>できること</h2>
  <p>全国の労働衛生担当者が、相談・質問・知見共有を行うための入口です。現場の悩みや一次情報の気づきを、実務目線で持ち寄れます。</p>

  <ul>
    <li>日々の実務で迷った点の相談</li>
    <li>法令・通達・公的資料に基づく質問と整理</li>
    <li>現場で使える工夫や学びの共有</li>
  </ul>

  <h2>参加先</h2>
  <p>目的に応じて、使いやすい場を選んでください。</p>

  <div class="cta-buttons">
    {% if site.community.discussions_url %}
      <a class="cta-primary" href="{{ site.community.discussions_url }}" target="_blank" rel="noopener">GitHub Discussionsへ</a>
    {% else %}
      <span class="cta-tertiary">GitHub Discussions（準備中）</span>
    {% endif %}
    {% if site.community.discord_invite_url %}
      <a class="cta-secondary" href="{{ site.community.discord_invite_url }}" target="_blank" rel="noopener">Discordに参加</a>
    {% else %}
      <span class="cta-tertiary">Discord（準備中）</span>
    {% endif %}
  </div>
</section>

<section class="section">
  <h2>ガイドライン</h2>
  <ul>
    <li>個人名・会社名・所在地・機密情報・健康情報は書かず、匿名化して投稿してください。</li>
    <li>一次情報（法令・通達・公的資料）を優先し、推測は「推測」と明記してください。</li>
    <li>医療・法務の断定はしないでください。緊急時は所属先の産業医等へ相談してください。</li>
    <li>誹謗中傷・営業・スパムは禁止です。宣伝は指定スレッドのみで行ってください。</li>
  </ul>
</section>
