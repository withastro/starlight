---
title: フロントマター
description: Starlightがデフォルトでサポートするフロントマターのフィールドについて。
---

Starlightでは、フロントマターに値を設定することで、MarkdownとMDXのページを個別にカスタマイズできます。たとえば通常のページでは、`title`と`description`フィールドを設定します。

```md
---
title: このプロジェクトについて
description: 私が取り組んでいるプロジェクトについてもっと知る。
---

概要ページへようこそ！
```

## フロントマターのフィールド

### `title`（必須）

**type:** `string`

すべてのページにタイトルを指定する必要があります。これは、ページの上部、ブラウザのタブ、およびページのメタデータとして表示されます。

### `description`

**type:** `string`

ページに関する説明文はページのメタデータとして使用され、また検索エンジンやソーシャルメディアのプレビューでも使用されます。

### `editUrl`

**type:** `string | boolean`

[グローバルの `editLink` 設定](/ja/reference/configuration/#editlink)を上書きします。`false`を設定して特定のページの「ページを編集」リンクを無効にするか、あるいはこのページのコンテンツを編集する代替URLを指定します。

### `head`

**type:** [`HeadConfig[]`](/ja/reference/configuration/#headconfig)

フロントマターの`head`フィールドを使用して、ページの`<head>`にタグを追加できます。これにより、カスタムスタイル、メタデータ、またはその他のタグを単一のページに追加できます。[グローバルの`head`オプション](/ja/reference/configuration/#head)と同様です。

```md
---
title: 私たちについて
head:
  # カスタム<title>タグを使う
  - tag: title
    content: カスタムのタイトル
---
```

### `tableOfContents`

**type:** `false | { minHeadingLevel?: number; maxHeadingLevel?: number; }`

[グローバルの`tableOfContents`設定](/ja/reference/configuration/#tableofcontents)を上書きします。表示したい見出しのレベルをカスタマイズするか、あるいは`false`に設定して目次を非表示とします。

```md
---
title: 目次にH2のみを表示するページ
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 2
---
```

```md
---
title: 目次のないページ
tableOfContents: false
---
```

### `template`

**type:** `'doc' | 'splash'`  
**default:** `'doc'`

ページのレイアウトテンプレートを設定します。ページはデフォルトで`'doc'`レイアウトを使用します。ランディングページ向けにサイドバーのない幅広のレイアウトを使用するには、`'splash'`を設定します。

### `hero`

**type:** [`HeroConfig`](#heroconfig)

ヒーローコンポーネントをページの上部に追加します。`template: splash`との相性が良いでしょう。

リポジトリからの画像の読み込みなど、よく使われるオプションの設定例は以下となります。

```md
---
title: 私のホームページ
template: splash
hero:
  title: '私のプロジェクト: 最高品質を、最速で'
  tagline: 瞬く間に月まで一往復。
  image:
    alt: キラリと光る、鮮やかなロゴ
    file: ../../assets/logo.png
  actions:
    - text: もっと知りたい
      link: /getting-started/
      icon: right-arrow
      variant: primary
    - text: GitHubで見る
      link: https://github.com/astronaut/my-project
      icon: external
---
```

#### `HeroConfig`

```ts
interface HeroConfig {
  title?: string;
  tagline?: string;
  image?: {
    alt?: string;
    // リポジトリ内の画像への相対パス。
    file?: string;
    // 画像のスロットに使用する生のHTML。
    // カスタムの`<img>`タグやインラインの`<svg>`などが使えます。
    html?: string;
  };
  actions?: Array<{
    text: string;
    link: string;
    variant: 'primary' | 'secondary' | 'minimal';
    icon: string;
  }>;
}
```

### `banner`

**type:** `{ content: string }`

ページの上部にお知らせ用のバナーを表示します。

`content`の値には、リンクやその他のコンテンツ用のHTMLを含められます。たとえば以下のページでは、`example.com`へのリンクを含むバナーを表示しています。

```md
---
title: バナーを含むページ
banner:
  content: |
    素晴らしいサイトをリリースしました！
    <a href="https://example.com">確認してみてください</a>
---
```

### `lastUpdated`

**type:** `Date | boolean`

[グローバルの`lastUpdated`オプション](/ja/reference/configuration/#lastupdated)を上書きします。日付を指定する場合は有効な[YAMLタイムスタンプ](https://yaml.org/type/timestamp.html)である必要があり、ページのGit履歴に保存されている日付を上書きします。

```md
---
title: 最終更新日をカスタマイズしたページ
lastUpdated: 2022-08-09
---
```

### `prev`

**type:** `boolean | string | { link?: string; label?: string }`

[グローバルの`pagination`オプション](/ja/reference/configuration/#pagination)を上書きします。文字列を指定すると生成されるリンクテキストが置き換えられ、オブジェクトを指定するとリンクとテキストの両方を上書きできます。

```md
---
# 前のページへのリンクを非表示にする
prev: false
---
```

```md
---
# 前のページへのリンクテキストを上書きする
prev: チュートリアルを続ける
---
```

```md
---
# 前のページへのリンクとテキストを上書きする
prev:
  link: /unrelated-page/
  label: その他のページをチェックする
---
```

### `next`

**type:** `boolean | string | { link?: string; label?: string }`

次のページへのリンクに対して、[`prev`](#prev)と同様の設定ができます。

```md
---
# 次のページへのリンクを非表示にする
next: false
---
```

### `sidebar`

**type:** `{ label?: string; order?: number; hidden?: boolean; badge?: string | BadgeConfig }`

自動生成されるリンクのグループを使用している際に、[サイドバー](/ja/reference/configuration/#sidebar)にページをどのように表示するかを設定します。

#### `label`

**type:** `string`  
**default:** ページの[`title`](#title必須)

自動生成されるリンクのグループ内に表示される、ページのサイドバー上でのラベルを設定します。

```md
---
title: このプロジェクトについて
sidebar:
  label: 概要
---
```

#### `order`

**type:** `number`

自動生成されるリンクのグループをソートする際の、このページの順番を設定します。小さな数値ほどリンクグループの上部に表示されます。

```md
---
title: 最初に表示するページ
sidebar:
  order: 1
---
```

#### `hidden`

**type:** `boolean`
**default:** `false`

自動生成されるサイドバーのグループにこのページを含めないようにします。

```md
---
title: 自動生成されるサイドバーで非表示にするページ
sidebar:
  hidden: true
---
```

#### `badge`

**type:** <code>string | <a href="/ja/reference/configuration/#badgeconfig">BadgeConfig</a></code>

自動生成されるリンクのグループに表示されたとき、サイドバーのページにバッジを追加します。文字列を使用すると、バッジはデフォルトのアクセントカラーで表示されます。オプションで、`text`と`variant`フィールドをもつ[`BadgeConfig`オブジェクト](/ja/reference/configuration/#badgeconfig)を渡してバッジをカスタマイズできます。

```md
---
title: バッジを含むページ
sidebar:
  # サイトのアクセントカラーに合わせたデフォルトのバリアントを使用します
  badge: New
---
```

```md
---
title: バッジを含むページ
sidebar:
  badge:
    text: 実験的
    variant: caution
---
```
