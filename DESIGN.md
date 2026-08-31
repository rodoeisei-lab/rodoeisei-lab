# DESIGN.md

## 目的
このファイルは「労働衛生ラボ」のUI/UXに関する恒久的な設計基準です。
新しいページ、カード、ツール、記事UI、ナビゲーションを追加・変更するときは、まずこのファイルを参照してください。

目標は「信頼できる専門サイト」「初心者にも読みやすい」「スマホで迷わない」です。
見た目だけを派手にするのではなく、情報の優先順位・可読性・操作性を優先します。

## Design principles
1. **Trust first** — 行政・専門情報を扱うサイトとして、落ち着きと明瞭さを優先する。
2. **Readable before decorative** — 装飾より、見出し・本文・余白・コントラストを優先する。
3. **One clear hierarchy** — 1画面で「何が重要か」がすぐ分かる構造にする。
4. **Mobile is a first-class layout** — PC版を縮小するのではなく、スマホでも自然に読む・押す・探すことができるようにする。
5. **Reuse before invention** — 既存のCSS変数・コンポーネント・レイアウトを優先して再利用する。
6. **Avoid generic AI UI** — カード、グラデーション、ピル型ラベル、アイコン、影を必要以上に増やさない。

---

## Visual direction
キーワード:
- clean
- technical
- calm
- practical
- trustworthy
- human-readable

避ける方向:
- SaaSダッシュボード風の過度なカードUI
- ガラス表現、ネオン、強いグロー
- 大きすぎるグラデーション
- 目的のないイラストやAI画像
- ページごとに別ブランドに見える色・角丸・影

---

## Color system
既存の `assets/css/main.css` のCSS変数を基準にする。

| Role | Token | Value | Usage |
| --- | --- | --- | --- |
| Page background | `--color-bg` | `#f4f7fa` | ページ背景 |
| Surface | `--color-surface` | `#ffffff` | カード・本文面 |
| Muted surface | `--color-surface-muted` | `#edf3f7` | 補助背景 |
| Text | `--color-text` | `#152238` | 本文・見出し |
| Secondary text | `--color-text-secondary` | `#48586c` | 補足 |
| Muted text | `--color-text-muted` | `#6b7a8d` | 日付・補助情報 |
| Primary | `--color-primary` | `#103b5c` | ブランド、主要操作 |
| Primary hover | `--color-primary-hover` | `#092c47` | hover |
| Link | `--color-link` | `#0b6093` | 本文リンク |
| Soft blue | `--color-blue-soft` | `#eaf3f8` | 情報ボックス |
| Accent | `--color-accent` | `#e0a12d` | 強調・区切り |
| Strong accent | `--color-accent-strong` | `#8b5700` | アクセント上の文字 |
| Soft accent | `--color-accent-soft` | `#fff4da` | 注意・補助背景 |
| Border | `--color-border` | `#d3e0e9` | 境界線 |

### Color rules
- 基本は **白 + ネイビー/ブルー + 少量の黄系アクセント**。
- 黄系アクセントは「重要箇所の目印」として使い、広い面積を塗りつぶさない。
- 新しい色を直接ハードコードする前に、既存トークンで表現できないか確認する。
- 恒久的に新色が必要なら、CSS変数として追加し、このファイルにも追記する。
- 同じ意味に複数の似た青・黄を増やさない。

---

## Typography
Font stack:
`-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic", Meiryo, system-ui, sans-serif`

### Type hierarchy
- Body: 16px / line-height 1.7–1.8
- Article body: 17px / line-height 約1.82
- Small metadata: 13–14px
- Card title: 18–20px
- Section heading: 23–30px
- Page title: 30–46px, responsive

### Typography rules
- 本文を不必要に太字にしない。
- 1段落を長くしすぎない。
- 見出し階層を飛ばさない。
- 英字の大文字や極端なletter-spacingを装飾目的で多用しない。
- 本文幅は長くしすぎず、記事は原則 `--article: 760px` を基準にする。

---

## Spacing
基本スケール:
`4 / 8 / 12 / 16 / 24 / 32 / 40 / 52 / 64px`

### Spacing rules
- 同じ階層の要素は同じ余白規則を使う。
- セクション間は、カード内部より明確に広くする。
- 「余白を埋めるための装飾」は追加しない。
- モバイルでは余白を減らしすぎず、タップ領域を優先する。

---

## Layout
- Main container: `--container: 1120px`
- Article width: `--article: 760px`
- Narrow supporting content: 820–960px程度
- 3列カードは広い画面のみ。タブレットで2列、スマホで1列を基本とする。
- 主要ページでは、最初の画面で「ページの目的」と「次の行動」が分かる構成にする。

### Preferred page rhythm
1. Page hero / title
2. Short lead
3. Primary content or tool
4. Supporting sections
5. Official/reference links
6. Related content

---

## Components

### Buttons
- 主要CTA: primary navy background
- 補助CTA: outline または soft accent
- 原則として高さ44px以上
- 1画面に同じ強さの主要CTAを複数置きすぎない

### Cards
カードは「情報のまとまり」に必要な場合だけ使う。

Use cards when:
- 比較可能な項目が並ぶ
- クリック可能な記事・カテゴリ一覧
- 独立したツールや機能

Do not use cards when:
- 単なる本文の段落
- すべてのセクション
- 見出しを囲うだけ
- 見た目を埋める目的

### Labels / badges
- ステータスやカテゴリなど、短い意味を持つ場合のみ使用。
- すべての見出しにピル型ラベルを付けない。

### Callouts
- 情報: soft blue + left border
- 注意: soft accent + accent border
- 重要な結論: primary border など既存パターンを優先

### Tables
- ヘッダーと本文のコントラストを明確にする。
- スマホで横スクロールが必要な場合は、内容が欠けない実装にする。
- 比較表を画像にしない。

---

## Home page
ホームは「情報を探す入口」であり、ランディングページ化しすぎない。

優先順位:
1. 何のサイトか
2. 主要テーマへの導線
3. 検索・ナビゲーション
4. 新着/代表記事
5. YouTube・note等の外部コンテンツ
6. 補足情報

Rules:
- 同じ大きさのカードを延々と並べない。
- 主要カテゴリと新着記事は視覚的に区別する。
- 外部コンテンツは主役にしすぎない。
- セクションごとにレイアウトを少し変えて単調さを避けるが、色や装飾は統一する。

---

## Articles
- 結論または概要を早めに提示する。
- 長文ではH2/H3で明確に分割する。
- 法令・制度・数値は、可能な限り一次情報へのリンクを示す。
- 更新日・確認日・注意書きは、本文より弱い視覚階層にする。
- 関連記事やYouTubeは本文読了を邪魔しない位置に置く。

---

## Tools / calculators
- 入力 → 判定/結果 → 根拠/注意点 の順にする。
- フォームは1画面に詰め込みすぎない。
- ラベルは入力欄の外に明示する。
- エラーは色だけに依存しない。
- 結果は最も目立つが、根拠・条件・免責を隠さない。
- スマホで片手操作しやすい44px以上のタップ領域を維持する。

---

## Accessibility
- `:focus-visible` を維持する。
- キーボード操作を壊さない。
- 文字サイズを固定pxで極端に小さくしない。
- 色だけで状態を伝えない。
- 画像には適切なaltを設定する。
- ボタン・リンクのタップ領域は原則44px以上。
- `prefers-reduced-motion` が必要なほど大きなアニメーションは原則使わない。

---

## Motion
- hover: 1–2px程度の小さな移動、影の変化まで。
- transition: 約150–220ms。
- スクロール連動・常時アニメーションは原則使わない。
- 情報サイトとして、動きが内容より目立たないようにする。

---

## Anti-patterns
以下は明確な理由がない限り避ける。

- すべてをカード化する
- すべてのカードに強い影を付ける
- 角丸サイズを要素ごとにバラバラにする
- 1ページで多数のアクセントカラーを使う
- 同じ意味の色を新しく追加する
- 巨大なアイコンや絵文字で情報量を水増しする
- 複数の強いグラデーション
- glassmorphism
- dashboard風の密集UI
- 文字より装飾を優先するhero
- 意味のない「AIっぽい」イラスト
- PCだけで成立するhover依存操作
- スマホで2列・3列を無理に維持する

---

## Implementation rules
1. 変更前に既存の `assets/css/main.css` と `assets/css/components.css` で近いパターンを探す。
2. 既存CSS変数を優先する。
3. 新しいコンポーネントは、既存コンポーネントの派生で表現できないか確認する。
4. UI変更のためだけにJavaScriptを追加しない。
5. Jekyll/Liquidの既存構造を壊さない。
6. 永続的なデザインルールを変更した場合は、この `DESIGN.md` も更新する。
7. 見た目だけでなく、360px前後のモバイル幅でも確認する。
8. 変更後は可能な範囲で `bundle exec jekyll build` と既存CIを通す。

---

## Design review checklist
UI変更のPRでは次を確認する。

- [ ] 既存の色・余白・角丸・影のルールと整合している
- [ ] 主要情報の視覚的優先順位が明確
- [ ] 不要なカード・ラベル・アイコンを増やしていない
- [ ] 360px前後でも読める・押せる
- [ ] タップ領域が小さすぎない
- [ ] 既存コンポーネントを再利用できる箇所は再利用した
- [ ] 新しいハードコード色を不用意に増やしていない
- [ ] アクセシビリティを悪化させていない
- [ ] UIルールを恒久変更した場合はDESIGN.mdも更新した

---

## Source of truth
実装上の現在値は以下を優先する。
- `assets/css/main.css`
- `assets/css/components.css`
- `_layouts/`
- `_includes/`

`DESIGN.md` は「どう設計するか」の基準、CSSは「現在どう実装されているか」の基準とする。
両者が恒久的に食い違う変更を行う場合は、同じPRで整合させる。
