---
title: 設定方法
description: Starlightがサポートするすべての設定オプションの概要。
---

## `starlight`インテグレーションの設定

Starlightは[Astro](https://astro.build)ウェブフレームワークの上に構築されたインテグレーションです。Astroの`astro.config.mjs`設定ファイル内でプロジェクトの設定をおこないます。

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
export default defineConfig({
  integrations: [
    starlight({
      title: "私の楽しいドキュメントサイト",
    }),
  ],
});
```

以下のオプションを`starlight`インテグレーションに設定できます。

### `title`（必須）

**type:** `string`

ウェブサイトのタイトルを設定します。メタデータとブラウザのタブのタイトルに使用されます。

### `description`

**type:** `string`

ウェブサイトの説明を設定します。`description`がページのフロントマターに設定されていない場合、`<meta name="description">`タグで検索エンジンに共有するメタデータとして使用されます。

### `logo`

**type:** [`LogoConfig`](#logoconfig)

ナビゲーションバーにサイトタイトルと並べて、またはその代わりとして表示するロゴ画像を設定します。単一の`src`プロパティを設定するか、`light`と`dark`用に別々の画像ソースを設定できます。

```js
starlight({
  logo: {
    src: '/src/assets/my-logo.svg',
  },
});
```

#### `LogoConfig`

```ts
type LogoConfig = { alt?: string; replacesTitle?: boolean } & (
  | { src: string }
  | { light: string; dark: string }
);
```

### `tableOfContents`

**type:** `false | { minHeadingLevel?: number; maxHeadingLevel?: number; }`  
**default:** `{ minHeadingLevel: 2; maxHeadingLevel: 3; }`

各ページの右側に表示される目次を設定します。デフォルトでは、`<h2>`と`<h3>`の見出しがこの目次に含まれます。

### `editLink`

**type:** `{ baseUrl: string }`

`editLink.baseUrl`を設定すると、「ページを編集」リンクが有効になります。最終的なリンクは、`editLink.baseUrl` + 現在のページのパスになります。たとえば、GitHubの`withastro/starlight`リポジトリのページを編集するには以下のようにします。

```js
starlight({
  editLink: {
    baseUrl: 'https://github.com/withastro/starlight/edit/main/',
  },
});
```

この設定により、`/introduction`ページには`https://github.com/withastro/starlight/edit/main/src/docs/introduction.md`を指す編集リンクが表示されます。

### `sidebar`

**type:** [`SidebarGroup[]`](#sidebargroup)

サイトのサイドバーのナビゲーション項目を設定します。

サイドバーはグループごとに`label`をもつ配列で、`items`配列または`autogenerate`設定オブジェクトのいずれかを含みます。

リンクとサブグループを含む配列である`items`により、グループの内容を手動で設定できます。また、`autogenerate`を使用して、ドキュメントの特定のディレクトリからグループの内容を自動的に生成することも可能です。

```js
starlight({
  sidebar: [
    // 2つのリンクを含む、「ここから始める」というラベルのついたグループ。
    {
      label: 'ここから始める',
      items: [
        { label: 'はじめに', link: '/intro' },
        { label: '次のステップ', link: '/next-steps' },
      ],
    },
    // 参照先のディレクトリのすべてのページにリンクするグループ。
    {
      label: 'リファレンス',
      autogenerate: { directory: 'reference' },
    },
  ],
});
```

#### 並び順

自動生成されたサイドバーグループは、ファイル名のアルファベット順に並べ替えられます。たとえば、`astro.md`から生成されたページは、`starlight.md`というページの上に表示されます。

#### ラベルの翻訳

多言語対応が必要なサイトの場合、各項目の`label`はデフォルトのロケールのものとみなされます。サポート対象の言語のラベルを提供するには、`translations`プロパティを設定します。

```js
sidebar: [
  // An example sidebar with labels translated to French. フランス語に翻訳されたラベルをもつサイドバーの例。
  {
    label: 'ここから始める',
    translations: { fr: 'Commencez ici' },
    items: [
      {
        label: '開始する',
        translations: { fr: 'Bien démarrer' },
        link: '/getting-started',
      },
      {
        label: 'プロジェクトの構造',
        translations: { fr: 'Structure du projet' },
        link: '/structure',
      },
    ],
  },
];
```

#### `SidebarGroup`

```ts
type SidebarGroup =
  | {
      label: string;
      translations?: Record<string, string>;
      items: Array<LinkItem | SidebarGroup>;
    }
  | {
      label: string;
      translations?: Record<string, string>;
      autogenerate: {
        directory: string;
      };
    };
```

#### `LinkItem`

```ts
interface LinkItem {
  label: string;
  link: string;
}
```

### `locales`

**type:** `{ [dir: string]: LocaleConfig }`

サイトの国際化（i18n）をおこなうには、サポート対象の`locales`を設定します。

各エントリは、その言語のファイルが保存されているディレクトリ名をキーとして使用する必要があります。

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'My Site',
      // このサイトのデフォルト言語を英語に設定します。
      defaultLocale: 'en',
      locales: {
        // 英語のドキュメントは`src/content/docs/en/`にあります。
        en: {
          label: 'English',
        },
        // 簡体字中国語のドキュメントは`src/content/docs/zh/`にあります。
        zh: {
          label: '简体中文',
          lang: 'zh-CN',
        },
        // アラビア語のドキュメントは`src/content/docs/ar/`にあります。
        ar: {
          label: 'العربية',
          dir: 'rtl',
        },
      },
    }),
  ],
});
```

#### ロケールオプション

各ロケールに対し以下のオプションを設定できます。

##### `label`（必須）

**type:** `string`

たとえば言語の切替機能などでユーザーに表示する、この言語を表わすラベルです。ほとんどの場合、このラベルは、その言語を使用するユーザーが読みたいと思う言語の名前にすることが望ましいでしょう。たとえば、`"English"`、`"العربية"`、`"简体中文"`などです。

##### `lang`

**type:** `string`

この言語のBCP-47タグです。たとえば`"en"`、`"ar"`、`"zh-CN"`などです。設定されていない場合、デフォルトでは言語のディレクトリ名が使用されます。

##### `dir`

**type:** `'ltr' | 'rtl'`

この言語を記述する方向です。左から右へ（デフォルト）は`"ltr"`を、右から左へは`"rtl"`を設定します。

#### ルートロケール

`root`ロケールを設定することで、`/lang/`ディレクトリなしでデフォルト言語を提供できます。

```js
starlight({
  locales: {
    root: {
      label: 'English',
      lang: 'en',
    },
    fr: {
      label: 'Français',
    },
  },
});
```

この設定により、たとえば`/getting-started/`を英語のルートとし、対応するフランス語のページを`/fr/getting-started/`として提供することができます。

### `defaultLocale`

**type:** `string`

このサイトのデフォルト言語を設定します。この値は、[`locales`](#locales)オブジェクトのキーのいずれかと一致する必要があります。（デフォルト言語が[ルートロケール](#root-locale)の場合は、この設定をスキップできます。）

翻訳がない場合には、デフォルトロケールがフォールバックコンテンツとして使用されます。

### `social`

**type:** `{ discord?: string; github?: string; mastodon?: string; twitter?: string }`

このサイトのソーシャルメディアアカウントに関する任意の項目です。これらのいずれかを追加すると、サイトヘッダーにアイコンリンクとして表示されます。

```js
starlight({
  social: {
    discord: 'https://astro.build/chat',
    github: 'https://github.com/withastro/starlight',
    mastodon: 'https://m.webtoo.ls/@astro',
    twitter: 'https://twitter.com/astrodotbuild',
  },
});
```

### `customCss`

**type:** `string[]`

Starlightサイトの見た目をカスタマイズするためのCSSファイルを設定します。

プロジェクトのルートからの相対パスで指定したローカルのCSSファイル（`'/src/custom.css'`など）と、npmモジュールとしてインストールしたCSS（`'@fontsource/roboto'`など）に対応しています。

```js
starlight({
  customCss: ['/src/custom-styles.css', '@fontsource/roboto'],
});
```

### `head`

**type:** [`HeadConfig[]`](#headconfig)

Starlightサイトの`<head>`にカスタムタグを追加します。アナリティクスやその他のサードパーティのスクリプトやリソースを追加するのに便利です。

```js
starlight({
  head: [
    // Fathomのアナリティクススクリプトタグを追加する例。
    {
      tag: 'script',
      attrs: {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'MY-FATHOM-ID',
        defer: true,
      },
    },
  ],
});
```

#### `HeadConfig`

```ts
interface HeadConfig {
  tag: string;
  attrs?: Record<string, string | boolean | undefined>;
  content?: string;
}
```
