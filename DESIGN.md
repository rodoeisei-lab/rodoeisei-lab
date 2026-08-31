# DESIGN.md

## 目的

このファイルは「労働衛生ラボ」のUI/UXにおける**設計判断の基準**です。
Codexや開発者がページ、ツール、記事UI、ナビゲーション、CSSを変更するときは、実装前に必ず参照してください。

このサイトが目指すのは次の3点です。

- 信頼できる専門サイトに見える
- 初心者でも内容と次の行動が分かる
- スマホでも迷わず読めて操作できる

装飾の多さではなく、**情報の優先順位、可読性、操作性、一貫性**で品質を作ります。

---

## 1. Design character

### Product tone

キーワード:

- precise
- calm
- technical
- practical
- trustworthy
- human-readable
- approachable

「行政資料のように硬すぎず、SaaSのように軽すぎない」が基準です。

### Visual signature

労働衛生ラボらしさは、次の組み合わせで作ります。

1. **ネイビーの精密さ**  
   見出し、主要操作、構造の軸に使う。

2. **白と淡いブルーの余白**  
   専門情報を読みやすく整理する。

3. **黄の小さなアクセント**  
   重要箇所、注意、視線の起点に限定して使う。

4. **過度に飾らない情報設計**  
   カード、影、アイコンを増やすより、見出し・余白・整列で差をつける。

---

## 2. Reference philosophy

実在する優れたプロダクトは**構造と判断基準の参考**にしますが、見た目をそのまま複製しません。

参考にする性質:

- Linear系: 情報階層の明確さ、整列、コンポーネントの一貫性
- Notion系: 長文の読みやすさ、低ノイズ、自然な余白
- ElevenLabs系: 技術サイトの中にある編集的な温かさ、単調にならないレイアウト

コピーしないもの:

- 固有のロゴ
- ブランド固有の書体
- 特徴的すぎるヒーロー構成
- 固有のアニメーション
- そのプロダクトでしか意味を持たない装飾

**Copy the design logic, not the website.**

---

## 3. Decision priority

判断が衝突した場合は、次の順で優先します。

1. 情報の正確さ
2. アクセシビリティ
3. 操作性
4. 情報の優先順位
5. この `DESIGN.md`
6. 既存コンポーネント・既存CSS
7. 個別ページの見た目上の都合

既存CSSがこのファイルと矛盾する場合、既存CSSを無条件に踏襲せず、影響範囲を確認して段階的に整合させます。

---

## 4. Non-negotiable rules

### MUST

- UI変更前に `assets/css/main.css` と `assets/css/components.css` の既存パターンを確認する。
- 既存CSS変数、既存クラス、既存includeを優先する。
- 360px前後のスマホ幅でも、読める・押せる・横にはみ出さない状態を保つ。
- ボタンや主要リンクのタップ領域は原則44px以上にする。
- 入力欄はラベルを外に明示する。
- 色だけで状態、警告、エラーを伝えない。
- hoverが使えなくても成立するUIにする。
- 恒久的なデザインルールを変える場合は、この `DESIGN.md` も同じ変更で更新する。

### SHOULD

- 1画面内で「最も重要なもの」が一目で分かるようにする。
- 同じ役割の要素は同じ形、余白、文字階層を使う。
- 新しいCSSを書く前に、既存クラスの再利用・派生で対応できないか確認する。
- PC版を縮小するのではなく、スマホで自然な1列構成を設計する。
- 法令、制度、数値を扱う画面では装飾より根拠・読みやすさを優先する。
- 1セクション内の強い視覚アクセントは原則1つまでにする。

### AVOID

- すべてをカード化する
- カードの中にさらにカードを重ねる
- 影をUIの階層表現として多用する
- すべての見出しにピル型ラベルを付ける
- 意味のないアイコンを各項目に付ける
- glassmorphism
- ネオン、グロー
- 大面積の派手なグラデーション
- 巨大な装飾文字
- 意味のないAI生成イラスト
- SaaSダッシュボード風の過密UI
- スマホで無理に2列・3列を維持する
- 「とりあえず中央揃え」のレイアウト
- 情報量が少ないのに大きなカードを並べる

---

## 5. Color system

現在の実装値は `assets/css/main.css` のCSS変数をsource of truthとします。

| Semantic role | Token | Value | Primary use |
| --- | --- | --- | --- |
| Page background | `--color-bg` | `#f4f7fa` | ページ全体 |
| Surface | `--color-surface` | `#ffffff` | 本文・カード・入力 |
| Muted surface | `--color-surface-muted` | `#edf3f7` | 補助領域 |
| Text | `--color-text` | `#152238` | 本文・主要文字 |
| Secondary text | `--color-text-secondary` | `#48586c` | 補足 |
| Muted text | `--color-text-muted` | `#6b7a8d` | メタ情報 |
| Primary | `--color-primary` | `#103b5c` | 見出し・主要操作 |
| Primary hover | `--color-primary-hover` | `#092c47` | hover |
| Link | `--color-link` | `#0b6093` | テキストリンク |
| Blue soft | `--color-blue-soft` | `#eaf3f8` | 情報補助 |
| Accent | `--color-accent` | `#e0a12d` | 視線の起点 |
| Accent strong | `--color-accent-strong` | `#8b5700` | 黄系背景上の文字 |
| Accent soft | `--color-accent-soft` | `#fff4da` | 注意・アクセント背景 |
| Border | `--color-border` | `#d3e0e9` | 境界線 |
| Focus | `--color-focus` | `#b66f00` | focus-visible |

### Usage rules

- 基本構成は **white + navy/blue + small yellow accent**。
- 黄は主役ではなく、視線誘導のためのアクセントとして使う。
- 同一セクション内でネイビー、黄、別色をすべて主役にしない。
- 広い背景は白、`--color-bg`、`--color-blue-soft`を優先する。
- リンク色と主要CTA色を役割で使い分ける。
- 新しい色を直接追加する前に既存トークンで表現できないか確認する。
- 同じ状態色を複数ページで繰り返し使う場合は、raw hexを増やさずsemantic token化を検討する。

---

## 6. Typography

Font stack:

`-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic", Meiryo, system-ui, sans-serif`

### Scale

- 本文: 16px / line-height 1.7–1.8
- 記事本文: 17px / line-height 約1.82
- 補足・メタ情報: 13–14px
- カード見出し: 18–20px
- H3: 20–23px
- H2: 23–30px
- ページタイトル: 30–46px、レスポンシブ

### Rules

- 本文を不必要に太字にしない。
- 太字は「読ませたい語句」ではなく「構造上重要な語句」に使う。
- H2 → H3 の階層を崩さない。
- 本文で中央揃えを多用しない。
- 英字大文字、letter-spacingを装飾目的で多用しない。
- 長文の1行を伸ばしすぎない。
- 記事本文幅は原則 `--article: 760px` を基準にする。
- 文字サイズを小さくして情報を詰め込む設計はしない。

### Hierarchy recipe

原則として、ページ上部は次の順序で階層を作ります。

1. eyebrow / category（必要な場合のみ）
2. H1
3. lead
4. 補足・更新情報
5. 本文または主要操作

eyebrowを付けるだけで階層を作ろうとせず、H1のサイズ、余白、本文幅を優先します。

---

## 7. Spacing and layout

Spacing scale:

`4 / 8 / 12 / 16 / 24 / 32 / 40 / 52 / 64px`

### Width

- Main container: `--container: 1120px`
- Article: `--article: 760px`
- Narrow content: 820–960px程度
- Form / tool input block: 必要以上に横へ伸ばさない
- PC: 内容に応じて2〜3列
- Mobile: 原則1列

### Vertical rhythm

- 同一コンポーネント内: 8–16px
- カード内: 16–24px
- 関連要素間: 24–32px
- セクション間: 40–64px

セクション間隔はカード内部より明確に広くします。

### Alignment

- 本文、フォーム、カードタイトルは基本左揃え。
- 同じグリッド内ではタイトル開始位置を揃える。
- 不要な左右非対称は作らない。
- 「全部中央揃え」はヒーローや短い告知など、明確な理由がある場合だけ使う。

---

## 8. Density

ページ種別に応じて情報密度を変えます。

### Low density

対象:
- 記事
- 解説
- trust / about

特徴:
- 長い行を避ける
- セクション間を広く取る
- カードを減らす
- 文章の流れを優先

### Medium density

対象:
- カテゴリ一覧
- ハブページ
- ツール
- 検索

特徴:
- 16–24px程度のパディング
- 重要情報を近くにまとめる
- 余白を残しつつ、視線移動を短くする

### Compact density

対象:
- 表
- 検索結果のメタ情報
- 比較情報

特徴:
- 行間・paddingをやや詰める
- ただし文字サイズを極端に小さくしない
- タップ可能要素は44px程度を維持

**サイト全体をcompactにしない。**

---

## 9. Radius and elevation

### Radius

- 小要素、focus補助: 8px前後
- ボタン、入力: 9–10px前後
- 小〜中カード: 10–12px
- 標準カード・大きいsurface: `--radius: 16px`
- pill: タグ、カテゴリ、短いstatusだけ

意味なくすべてを16px以上の大きな角丸にしません。

### Shadow

標準:
- `--shadow`
- `--shadow-hover`

使ってよい:
- クリック可能な主要カード
- ヘッダー
- 浮いていることに意味があるUI

避ける:
- 本文ボックス
- 単なるセクション
- 注意書き
- すべてのsurface

静的な情報は、**border + background + spacing**を優先します。

---

## 10. Component language

### Cards

既存候補:

- `.card`
- `.guide-card`
- `.entry-card`
- `.update-card`
- `.product-card`
- `.qa-list-card`

使う:
- クリック可能な独立項目
- 比較可能な複数項目
- 独立したツールや機能

使わない:
- 単なる本文
- 見出しを囲うだけ
- 空間を埋めるだけ
- セクションを分けるだけ

カード内は原則:

**label/status（必要時） → title → description → action/meta**

を基本とします。

### Buttons

Primary:
- `.cta-secondary`
- `.btn-step-primary`
- `.join-cta-primary`

Secondary:
- `.cta-tertiary`
- `.btn-step`
- `.join-cta-secondary`

ルール:
- 1画面に同じ強さのPrimary CTAを大量に置かない。
- ボタン文言は「送信」より「検索する」「判定する」など行動を具体化する。
- テキストリンクで十分な操作をボタン化しない。
- disabled状態を色だけで表現しない。

### Labels / badges

既存候補:

- `.badge`
- `.guide-tag`
- `.tag-chip`
- `.article-category`
- `.status`

使う:
- カテゴリ
- 状態
- 短い属性

使わない:
- 見出しの飾り
- すべてのカード
- 意味の薄い「おすすめ」「便利」などの乱用

### Forms

- ラベルは入力欄の外に表示する。
- placeholderをラベル代わりにしない。
- 入力→補足→エラーの順を自然に読むことができる構造にする。
- mobileでは入力文字を16px未満にしない。
- focus時に画面が横方向へずれたり、不要なzoom・layout shiftが起きないようにする。
- 入力項目が多い場合は意味のあるグループに分ける。

### Tables

- 見出し行を明確にする。
- 数値、単位、項目名を一貫して揃える。
- スマホでは列を減らす、カード化する、優先列を残す方法を先に検討する。
- 横スクロールは最後の手段とする。
- 横スクロールが不可避なら、スクロール可能であることが視覚的に分かるようにする。

### Notices

Information:
- `--color-blue-soft` + primary系border

Caution:
- `--color-accent-soft` + accent系border

既存:
- `.notice-box`
- `.article-summary-box__panel`

似た見た目の新しいnotice componentを増殖させません。

---

## 11. Page archetypes

新しいページを作る前に、まずどのarchetypeか決めます。

### A. Home

目的:
**情報を探す入口**

優先順位:

1. 何のサイトか
2. 主要テーマへの導線
3. 検索
4. 新着・代表記事
5. ツール
6. YouTube・note等
7. 補足情報

ルール:
- 広告的なLPにしない。
- 同じ大きさのカードが延々と続く構成を避ける。
- セクションごとに「リスト」「カード」「テキスト＋リンク」など情報密度を変える。
- ただし色、角丸、見出し体系は統一する。

### B. Article

目的:
**理解する**

構成:

1. title
2. lead / conclusion
3. meta
4. main text
5. source
6. related content

ルール:
- 結論または概要を早めに示す。
- 長文はH2/H3で分割する。
- 法令・制度・数値は可能な限り一次情報へリンクする。
- 関連記事やYouTubeを本文の流れに割り込ませすぎない。

### C. Hub / category

目的:
**目的のコンテンツへ移動する**

ルール:
- 冒頭説明は短め。
- 主要カテゴリを最初に見せる。
- 3列カードを機械的に繰り返さない。
- 「おすすめ」「一覧」「学習順」など情報構造を分ける。

### D. Tool / calculator

目的:
**入力して判断する**

基本順序:

**入力 → 結果 → 根拠・注意点**

ルール:
- 初期画面で入力欄を詰め込みすぎない。
- デフォルト値で入力負荷を減らせる場合は活用する。
- 結果を目立たせるが条件・根拠・免責を隠さない。
- エラー時もフォーム位置が大きく跳ねない。
- モバイルで横方向の画面移動を発生させない。

### E. Reference / data

目的:
**正確に探して比較する**

ルール:
- 検索・フィルタを上部に置く。
- 数値と単位を視覚的に混同させない。
- 過度なカード化より表・リストを優先する。
- 情報の出典と更新日を弱い階層で明示する。

---

## 12. Responsive rules

基準は「PCを縮める」ではなく、**360pxで再設計する**ことです。

### Mobile

- 原則1列
- container左右余白を確保
- ボタンは必要に応じて幅100%
- タップ領域44px以上
- 重要情報を先に表示
- 補助情報は下へ送る
- 不要なsticky要素を作らない
- 画面幅を超える固定幅を使わない
- 入力focusで横方向に画面がずれないようにする
- 2列維持より、読みやすい1列を優先する

### Horizontal scrolling

原則避けます。

許容:
- 列数が本質的に多い比較表
- 元データをそのまま確認する必要がある場合

許容しない:
- フォーム
- 通常カード
- ナビゲーション
- 主要操作
- 単純な2〜4項目の情報

---

## 13. Images and illustrations

画像は「雰囲気を出すため」より「理解を助けるため」に使います。

使う:
- 作業工程
- 測定方法
- 機器
- 概念図
- 判断フロー
- 実物を理解する必要がある対象

避ける:
- 意味のない人物イラスト
- AI感の強い汎用オフィス画像
- 全ページ同じ構図の挿絵
- 内容と関係の薄いアイソメトリック図
- 装飾目的だけの巨大画像

図解を使う場合、文章と同じ情報を重複させるだけでなく、**関係・順序・比較**の理解を助けること。

---

## 14. Interaction and motion

- hover移動は1〜2px程度まで。
- transitionは150〜220ms程度。
- hover時にレイアウトサイズを変えない。
- 常時アニメーションは原則使わない。
- スクロール連動演出は原則使わない。
- 内容より動きが目立たないようにする。
- `prefers-reduced-motion`を損なう実装をしない。

---

## 15. Accessibility

- `:focus-visible`を維持する。
- キーボード操作を壊さない。
- 文字サイズを極端に小さくしない。
- 色だけで意味を伝えない。
- 画像には適切なaltを設定する。
- 主要操作対象は原則44px以上にする。
- 見出し階層を見た目だけで偽装しない。
- form controlとlabelを関連付ける。
- aria属性はHTMLの意味構造で解決できない場合に使用する。

---

## 16. Anti-AI UI rules

生成AIが作りがちな次のパターンを意識的に避けます。

### Generic hero

避ける:
- 左に大見出し、右に意味のない抽象図
- 3つのbadge
- gradient blob
- 「未来を変える」系のマーケティングコピー

代わりに:
- 何が分かるページか
- 誰が使うか
- 最初に何をすればよいか

を明確にする。

### Card explosion

避ける:
- すべての情報を同じカードにする
- 3列カードをページ下まで繰り返す

代わりに:
- リスト
- 定義リスト
- 表
- 左borderの補足
- テキストリンク
- 段階表示

を使い分ける。

### Decorative pills

pillは分類と状態に限定する。
見出し装飾のためだけに使わない。

### Random color

ページごとに独自色を増やさない。
色はsemantic roleから選ぶ。

### Fake premium

大きすぎる余白、巨大文字、強いblur、glass、過度なanimationで「高級感」を作らない。

---

## 17. Agent workflow

Codexなどのcoding agentは、UI実装前に次を行います。

### Before implementation

1. この `DESIGN.md` を読む。
2. ページarchetypeを特定する。
3. `assets/css/main.css` と `assets/css/components.css` で既存パターンを探す。
4. 画面の情報優先順位を文章で整理する。
5. 使用する既存token / componentを決める。
6. 360pxでの構成を先に想定する。
7. その後に実装する。

### During implementation

- 新しい視覚ルールを思いつきで増やさない。
- raw colorよりtokenを使う。
- 既存componentの意味を変えない。
- 新しいcomponentは1つの責務に限定する。
- visual polishより情報構造を先に完成させる。

### Compliance pass

実装後、次を自己確認します。

- 最も重要な情報が最初に見えるか。
- 同じ役割の要素が同じ見た目か。
- 不要なcard / pill / icon / shadowを増やしていないか。
- 新しい色を不用意に増やしていないか。
- 360pxで横にはみ出さないか。
- input focusで不自然に画面がずれないか。
- tap targetは小さすぎないか。
- keyboard focusは見えるか。
- 情報の根拠や注意点を視覚的に弱めすぎていないか。
- このページだけ別プロダクトのような見た目になっていないか。

**3つ以上の新しい視覚ルールを発明した場合は、一度止まり、既存ルールで表現できないか再検討する。**

---

## 18. Implementation rules

1. UI変更前に既存CSS・クラスを確認する。
2. 既存CSS変数を優先する。
3. 新しいコンポーネントは既存パターンの派生で表現できないか確認する。
4. 見た目だけのためにJavaScriptを追加しない。
5. Jekyll/Liquidの既存構造を必要なく壊さない。
6. 360px前後のスマホ幅でも確認する。
7. 永続ルールを変えたら `DESIGN.md` も更新する。
8. site-wide / template / CSS変更では、可能な範囲で `bundle exec jekyll build` と既存CIを通す。

---

## 19. PR checklist

- [ ] ページarchetypeを確認した
- [ ] 主要情報の優先順位が明確
- [ ] 既存コンポーネントを先に検討した
- [ ] 不要なカードを増やしていない
- [ ] 不要な影を増やしていない
- [ ] 不要なpill / badgeを増やしていない
- [ ] 新しい色を不用意に増やしていない
- [ ] 360px前後で読める・押せる・横にはみ出さない
- [ ] input focusで横ずれ・不自然な拡大がない
- [ ] タップ領域が小さすぎない
- [ ] キーボード操作・focus表示を悪化させていない
- [ ] 情報の正確性・出典表示を損なっていない
- [ ] 永続ルールを変更した場合は `DESIGN.md` も更新した

---

## 20. Source of truth

- **DESIGN.md**: どう設計するか、何を選ぶかの恒久的な判断基準
- **assets/css/main.css / components.css**: 現在の実装値
- **_layouts / _includes**: 現在の構造・コンポーネント実装
- **AGENTS.md**: coding agentの作業手順

DESIGN.mdは「雰囲気の説明」ではなく、**AIと人間が同じ基準でUIを判断するためのdesign contract**として扱います。
