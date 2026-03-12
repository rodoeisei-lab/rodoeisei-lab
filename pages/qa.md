---
layout: page
title: 公開Q&A
permalink: /qa/
description: 現場でよく出る労働衛生の疑問を、質問→回答→根拠の形で整理した公開Q&A一覧です。
---

現場でよく出る労働衛生の疑問を、
質問→回答→根拠の形で整理した知見データベース。

このページでは、
実務者から寄せられた質問をもとに、
法令・通達・現場経験を整理して回答しています。

<div class="qa-grid">
  {% for q in site.data.questions %}
  <article class="qa-card">
    <h2><a href="{{ q.url | relative_url }}">{{ q.title }}</a></h2>
    <p class="qa-answer">{{ q.key_answer }}</p>
    <ul class="qa-tags" aria-label="タグ">
      {% for tag in q.tags %}
      <li><span class="qa-tag">{{ tag }}</span></li>
      {% endfor %}
    </ul>
    <p class="qa-date">投稿日: {{ q.date }}</p>
    <a class="btn-read" href="{{ q.url | relative_url }}">詳細を見る</a>
  </article>
  {% endfor %}
</div>

## 質問を投稿する

現場で困っていることがあれば投稿してください。
匿名でもOKです。

- [GitHub Issueで投稿する]({{ site.community.question_issue_url }})
- [Googleフォームで投稿する]({{ site.qa_form_url }})
