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
