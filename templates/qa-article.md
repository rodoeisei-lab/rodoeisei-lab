# Q&A記事テンプレート（編集用）

このファイルは公開用ではありません。`_config.yml` の `exclude` により、GitHub Pages・サイトマップ・サイト内検索の対象から外れます。

新しいQ&Aを作るときは、以下を `pages/qa/` に新規ファイルとしてコピーし、すべてのプレースホルダーを置き換えてから公開してください。`slug` はURLになるため、既存記事と重複させません。

```yaml
---
layout: article
article_type: qa
status: published
title: "質問を結論形で記載する"
description: "このQ&Aで分かることを、120字程度で記載する"
slug: qa-topic-name
date: 2026-08-19
modified: 2026-08-19
author: 労働衛生ラボ編集部
tags:
  - 作業環境測定
  - 関連するテーマ
og_image: /assets/images/og/articles/qa-topic-name.png
og_image_alt: "Q&Aの要点が伝わる画像の代替テキスト"
---
```

`og_image` には、この記事専用の1200×630px PNGを指定します。公開前に、画像・公開日・更新日・根拠の一次情報へのリンクを確認してください。

## 質問

質問文を、判断したい場面が分かる形で記載します。

## 結論

最初に、実務で取るべき対応を1〜3文で記載します。

## 理由

- 判断の前提
- 例外や注意点
- 次に確認する事項

## 現場での判断ポイント

- 実施者
- 確認する記録・設備・作業条件
- 対応後の確認方法

## 根拠（法令・通達・一次情報）

- [根拠の名称](https://example.com/)

## 関連記事

- [関連する解説記事タイトル]({{ '/learn/' | relative_url }})
