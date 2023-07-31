---
title: Markdownでのコンテンツ作成
description: StarlightがサポートするMarkdown構文の概要。
---

Starlightでは、`.md`ファイルにおいて[Markdown](https://daringfireball.net/projects/markdown/)構文のすべての機能を利用できます。また、タイトルや説明文（description）などのメタデータを定義するためのフロントマター[YAML](https://dev.to/paulasantamaria/introduction-to-yaml-125f)もサポートしています。

MDXやMarkdocを使用する場合、サポートされるMarkdownの機能や使用方法が異なることがあるため、[MDXドキュメント](https://mdxjs.com/docs/what-is-mdx/#markdown)や[Markdocドキュメント](https://markdoc.dev/docs/syntax)を必ず確認してください。

## インラインスタイル

テキストは**太字**、_斜体_、または~~取り消し線~~にできます。

```md
テキストは**太字**、_斜体_、または~~取り消し線~~にできます。
```

[別のページにリンク](/ja/getting-started/)できます。

```md
[別のページにリンク](/ja/getting-started/)できます。
```

バックティックで`インラインコード`を強調できます。

```md
バックティックで`インラインコード`を強調できます。
```

## 画像

Starlightは、[Astro組み込みのアセット最適化機能](https://docs.astro.build/ja/guides/assets/)を使用して画像を表示します。

MarkdownとMDXは、スクリーンリーダーや支援技術のための代替テキストを含む画像を表示するためのMarkdown構文をサポートしています。

![「astro」という単語を中心に据えた惑星と恒星のイラスト](https://raw.githubusercontent.com/withastro/docs/main/public/default-og-image.png)

```md
![「astro」という単語を中心に据えた惑星と恒星のイラスト](https://raw.githubusercontent.com/withastro/docs/main/public/default-og-image.png)
```

プロジェクトにローカルに保存されている画像についても、相対パスを使用して表示できます。

```md
// src/content/docs/page-1.md

![宇宙空間に浮かぶロケット](../../assets/images/rocket.svg)
```

## 見出し

見出しによりコンテンツを構造化できます。Markdownの見出しは、行の先頭にある`#`の数で示されます。

### ページコンテンツを構造化する方法

Starlightは、ページタイトルをトップレベルの見出しとして自動的に使用し、また各ページの目次の先頭に「概要」という見出しを含めます。各ページを通常のテキストコンテンツで開始し、ページ上の見出しは`<h2>`以下を使用することをおすすめします。

```md
---
title: Markdownガイド
description: StarlightでのMarkdownの使い方
---

このページでは、StarlightでMarkdownを使用する方法について説明します。

## インラインスタイル

## 見出し
```

### 見出しの自動アンカーリンク

Markdownで見出しを使用するとアンカーリンクが自動的に付与されるため、ページの特定のセクションに直接リンクできます。

```md
---
title: 私のページコンテンツ
description: Starlightの組み込みアンカーリンクの使い方
---

## はじめに

同じページの下部にある[結論](#結論)にリンクできます。

## 結論

`https://my-site.com/page1/#はじめに`は、「はじめに」に直接移動します。
```

レベル2（`<h2>`）とレベル3（`<h3>`）の見出しは、ページの目次に自動的に表示されます。

## 補足情報

補足情報（「警告」や「吹き出し」とも呼ばれます）は、ページのメインコンテンツと並べて補助的な情報を表示するのに便利です。

Starlightは、補足情報をレンダリングするためのカスタムMarkdown構文を提供しています。補足情報のブロックは、コンテンツを囲む3つのコロン`:::`によって示し、`note`（注釈）、`tip`（ヒント）、`caution`（注意）、`danger`（危険）というタイプに設定できます。

他のMarkdownコンテンツを補足情報の中にネストできますが、補足情報は短く簡潔なコンテンツに最も適しています。

### 注釈

:::note
Starlightは、[Astro](https://astro.build/)製のドキュメントサイト用ツールキットです。次のコマンドではじめられます。

```sh
npm create astro@latest -- --template starlight
```

:::

````md
:::note
Starlightは、[Astro](https://astro.build/)製のドキュメントサイト用ツールキットです。次のコマンドではじめられます。

```sh
npm create astro@latest -- --template starlight
```

:::
````

### カスタムのタイトル

補足情報のカスタムタイトルを、補足情報のタイプの後ろに角括弧で囲んで指定できます。たとえば`:::tip[ご存知でしたか？]`のようにできます。

:::tip[ご存知でしたか？]
Astroでは[「アイランドアーキテクチャ」](https://docs.astro.build/ja/concepts/islands/)を使用して、より高速なWebサイトを構築できます。
:::

```md
:::tip[ご存知でしたか？]
Astroでは[「アイランドアーキテクチャ」](https://docs.astro.build/ja/concepts/islands/)を使用して、より高速なWebサイトを構築できます。
:::
```

### その他のタイプ

注意（Caution）と危険（Danger）の補足は、ユーザーがつまずく可能性のある細かい点に注意を向けさせるのに役立ちます。もしこれらを多用しているとすれば、それはあなたがドキュメントを書いている対象の設計を見直す余地があることのサインかもしれません。

:::caution
もしあなたが素晴らしいドキュメントサイトを望んでいないのであれば、[Starlight](../../)は不要かもしれません。
:::

:::danger
Starlightの便利な機能のおかげで、ユーザーはより生産的になり、プロダクトはより使いやすくなるかもしれません。

- わかりやすいナビゲーション
- ユーザーが設定可能なカラーテーマ
- [国際化機能](/ja/guides/i18n)

:::

```md
:::caution
もしあなたが素晴らしいドキュメントサイトを望んでいないのであれば、[Starlight](../../)は不要かもしれません。
:::

:::danger
Starlightの便利な機能のおかげで、ユーザーはより生産的になり、プロダクトはより使いやすくなるかもしれません。

- わかりやすいナビゲーション
- ユーザーが設定可能なカラーテーマ
- [国際化機能](/ja/guides/i18n)

:::
```

## 引用

> これは引用です。他の人の言葉やドキュメントを引用するときによく使われます。
>
> 引用は、各行の先頭に`>`を付けることで示されます。

```md
> これは引用です。他の人の言葉やドキュメントを引用するときによく使われます。
>
> 引用は、各行の先頭に`>`を付けることで示されます。
```

## コード

コードのブロックは、先頭と末尾に3つのバックティック<code>```</code>を持つブロックで示されます。コードブロックを開始するバックティックの後ろに、使用されているプログラミング言語を指定できます。

```js
// シンタックスハイライトされたJavascriptコード。
var fun = function lang(l) {
  dateformat.i18n = require('./lang/' + l);
  return true;
};
```

````md
```js
// シンタックスハイライトされたJavascriptコード。
var fun = function lang(l) {
  dateformat.i18n = require('./lang/' + l);
  return true;
};
```
````

```md
長い1行のコードブロックは折り返されません。長すぎる場合は、水平方向にスクロールする必要があります。この行は、このことを示すのに十分な長さであるはずです。
```

## その他のMarkdown機能

Starlightは、リストやテーブルなど、その他のMarkdown記法をすべてサポートしています。Markdownのすべての構文要素の概要については、[The Markdown GuideのMarkdownチートシート](https://www.markdownguide.org/cheat-sheet/)を参照してください。
