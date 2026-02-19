---
title: 現場の質問フォーム（Q&A）
description: 現場担当者・衛生管理者向けに、労働衛生の実務疑問を匿名投稿できるQ&A質問フォーム。
permalink: /qa/ask/
---

<section class="section">
  <h2>送信前の注意事項</h2>
  <ul>
    <li>個人情報/企業名/場所が特定できる情報は書かないでください。</li>
    <li>回答は匿名化して記事として公開する場合があります。送信時点で公開可否に同意したものとして取り扱います。</li>
    <li>回答は一般的な情報提供であり、法的助言ではありません（免責）。</li>
  </ul>
</section>

<section class="section">
  <h2>質問フォーム</h2>
  {% assign qa_embed_url = site.google_form_qa_embed_url | default: page.google_form_qa_embed_url %}
  {% assign qa_link_url = site.qa_form_url | default: page.qa_form_url | default: qa_embed_url %}
  {% if qa_embed_url and qa_embed_url != "" %}
  <p>以下のフォームから匿名で質問を送信できます。</p>
  <div class="qa-form-embed">
    <iframe
      src="{{ qa_embed_url }}"
      title="現場の質問フォーム"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen>
    </iframe>
  </div>
  <p>
    フォームが表示されない場合は、
    <a href="{{ qa_link_url }}" target="_blank" rel="noopener">別タブでフォームを開く</a>
    から送信してください。
  </p>
  {% elsif qa_link_url and qa_link_url != "" %}
  <p>質問フォームは現在準備中です。埋め込み表示に対応するまで、別タブでご利用ください。</p>
  <p>
    <a href="{{ qa_link_url }}" target="_blank" rel="noopener">別タブでフォームを開く</a>
  </p>
  {% else %}
  <p>質問フォームは現在準備中です。公開までお待ちください。</p>
  {% endif %}
</section>

<section class="section">
  <h2>質問から記事化までの流れ</h2>
  <ol>
    <li>フォームから匿名投稿</li>
    <li>内容を整理・一般化</li>
    <li>記事として公開（個人・企業情報は削除）</li>
  </ol>
</section>
