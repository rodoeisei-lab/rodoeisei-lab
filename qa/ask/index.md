---
title: 質問する
description: 労働衛生に関する質問を匿名化して送るための受付ページ。
permalink: /qa/ask/
---

<section class="section">
  <h2>質問受付</h2>
  <p>労働衛生に関する質問を受け付けます。送信前に、以下の注意事項を必ず確認してください。</p>

  {% if site.qa_form_url %}
  <div class="cta-buttons">
    <a class="cta-primary" href="{{ site.qa_form_url }}" target="_blank" rel="noopener">フォームへ</a>
    <span class="cta-secondary">匿名で送信できます</span>
  </div>

  <div class="qa-form-embed">
    <iframe
      src="{{ site.qa_form_url }}"
      title="質問フォーム"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen>
    </iframe>
  </div>
  {% else %}
  <div class="cta-buttons">
    <span class="cta-tertiary">質問フォームは現在準備中です。</span>
  </div>
  <p>
    Googleフォームを作成し、公開URLを <code>_config.yml</code> の
    <code>qa_form_url</code> に設定すると、このページにボタンと埋め込みが表示されます。
  </p>
  {% endif %}
</section>

<section class="section">
  <h2>送信前の注意事項</h2>
  <ul>
    <li>個人名・会社名・所在地・機密情報・健康情報など、特定につながる情報は書かないでください。</li>
    <li>内容は匿名化し、第三者が特定できない形にして送信してください。</li>
    <li>回答は一般的な情報提供を目的とし、法令や一次情報の確認を前提にしてください。</li>
    <li>回答は医療・法務の最終判断を行うものではありません（免責）。</li>
    <li>緊急性がある場合は、所属先の産業医・法務担当・関係機関へ直接相談してください。</li>
  </ul>
</section>
