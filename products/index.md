---
title: 道具棚
description: 保護具・測定器材・記録テンプレの選定ポイント。
eyebrow: 道具棚
lead: 現場で迷いやすい「選定・更新・保守」をシンプルに整理します。
permalink: /products/
---

{% for section in site.data.products %}
<section class="tools-category">
  <h2>{{ section.title }}</h2>
  <ul class="tools-guide">
    {% for line in section.guide %}
    <li>{{ line }}</li>
    {% endfor %}
  </ul>
  <div class="cards">
    {% for card in section.cards %}
    <article class="card">
      <h3>{{ card.title }}</h3>
      <p>{{ card.description }}</p>
      {% if card.link %}
      {% assign link_prefix = card.link | slice: 0, 2 %}
      {% assign link_mailto = card.link | slice: 0, 7 %}
      {% assign link_tel = card.link | slice: 0, 4 %}
      {% if card.link contains "://" or link_prefix == "//" or link_prefix == "#" or link_mailto == "mailto:" or link_tel == "tel:" %}
      <a href="{{ card.link }}">{{ card.link_label }}</a>
      {% else %}
      <a href="{{ card.link | relative_url }}">{{ card.link_label }}</a>
      {% endif %}
      {% else %}
      <p class="card-meta">準備中</p>
      {% endif %}
    </article>
    {% endfor %}
  </div>
  <div class="tools-alternatives">
    {% for alt in section.alternatives %}
    <span>{{ alt }}</span>
    {% endfor %}
  </div>
</section>
{% endfor %}

## 分かること
- 保護具・測定器材・テンプレの選定基準と更新タイミング。
- 現場で迷いやすい比較ポイント（費用・適合・運用負荷）。
- 選定後の維持管理で必要な記録の観点。

## 対象読者
- これから保護具や測定機器を選定する担当者。
- 既存の道具を更新・見直したい管理者。
- 記録テンプレを整えたい現場リーダー。

## 使い方
1. カテゴリごとに必要な道具の概要を把握します。
2. カードの解説とリンクで選定ポイントを確認します。
3. 迷う場合は「代替案」の候補から再検討します。

## FAQ
### Q1. どの道具が必須か判断できません。
**A.** 取り扱う物質と作業工程により変わるため、解説ページで要点を確認してから選定してください。

### Q2. 購入後に見直すタイミングは？
**A.** 法令改正、設備更新、現場の不具合が出たときが見直しの合図です。

### Q3. テンプレはどこで活用すべきですか？
**A.** 点検記録や教育記録の基礎として、監督署対応の資料整理にも使えます。

## 関連ページ
- [解説一覧](/guides/)
- [用語集](/glossary/)
- [労基署対策](/inspection/)
- [資格対策](/licenses/)
- [最新アップデート](/updates/)
