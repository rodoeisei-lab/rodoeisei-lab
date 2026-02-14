---
title: 道具棚
description: 衛生管理者・現場リーダー向けに、保護具・測定器材・記録テンプレの選定と更新ポイントを整理。
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
      {% assign link_url = nil %}
      {% if card.link %}
        {% assign link_prefix = card.link | slice: 0, 2 %}
        {% assign link_mailto = card.link | slice: 0, 7 %}
        {% assign link_tel = card.link | slice: 0, 4 %}
        {% if card.link contains "://" or link_prefix == "//" or link_prefix == "#" or link_mailto == "mailto:" or link_tel == "tel:" %}
          {% assign link_url = card.link %}
        {% else %}
          {% assign link_url = card.link | relative_url %}
        {% endif %}
      {% endif %}
      {% assign meta_text = nil %}
      {% if link_url == nil %}
        {% assign meta_text = "準備中" %}
      {% endif %}
      {% capture card_body %}
      {% if card.amazon_link %}
      <p><a class="card-link" href="{{ card.amazon_link }}" target="_blank" rel="noopener noreferrer sponsored">Amazonリンク →</a></p>
      {% endif %}
      {% endcapture %}
      {% include list-card.html
        class="product-card"
        title=card.title
        description=card.description
        meta=meta_text
        body=card_body
        link_url=link_url
        link_label=card.link_label
      %}
    {% endfor %}
  </div>
  <div class="tools-alternatives">
    {% for alt in section.alternatives %}
    <span>{{ alt[0] }}: {{ alt[1] }}</span>
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
- [解説一覧]({{ "/guides/" | relative_url }})
- [用語集]({{ "/glossary/" | relative_url }})
- [労基署対策]({{ "/inspection/" | relative_url }})
- [資格対策]({{ "/licenses/" | relative_url }})
- [最新アップデート]({{ "/updates/" | relative_url }})
