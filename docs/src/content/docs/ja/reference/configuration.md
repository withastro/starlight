---
title: 設定方法
description: Starlightがサポートするすべての設定オプションの概要。
---

## `starlight`インテグレーションの設定

Starlightは[Astro](https://astro.build)ウェブフレームワークの上に構築されたインテグレーションです。`astro.config.mjs`設定ファイル内でプロジェクトの設定をおこないます。

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
export default defineConfig({
  integrations: [
    starlight({
      title: '私の楽しいドキュメントサイト',
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
    src: './src/assets/my-logo.svg',
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

**type:** [`SidebarItem[]`](#sidebaritem)

サイトのサイドバーのナビゲーション項目を設定します。

サイドバーはリンクとリンクのグループの配列です。各項目は、`label`と以下のプロパティのいずれかが必要です。

- `link` — 特定のURL、たとえば`'/home'`や`'https://example.com'`などへの単一のリンク。

- `items` — サイドバーの複数のリンクとサブグループを含む配列。

- `autogenerate` — リンクのグループを自動的に生成するために、ドキュメントのディレクトリを指定するオブジェクト。

```js
starlight({
  sidebar: [
    // 「ホーム」というラベルのついた単一のリンク。
    { label: 'ホーム', link: '/' },
    // 2つのリンクを含む、「ここから始める」というラベルのついたグループ。
    {
      label: 'ここから始める',
      items: [
        { label: 'はじめに', link: '/intro' },
        { label: '次のステップ', link: '/next-steps' },
      ],
    },
    // referenceディレクトリのすべてのページにリンクするグループ。
    {
      label: 'リファレンス',
      autogenerate: { directory: 'reference' },
    },
  ],
});
```

#### 並び順

自動生成されたサイドバーグループは、ファイル名のアルファベット順に並べ替えられます。たとえば、`astro.md`から生成されたページは、`starlight.md`というページの上に表示されます。

#### グループの折りたたみ

リンクのグループはデフォルトで展開されます。`collapsed`プロパティを`true`に設定して、この動作を変更できます。

自動生成されたサブグループは、デフォルトでは親グループの`collapsed`プロパティに従います。`autogenerate.collapsed`プロパティを設定して、これを上書きできます。

```js
sidebar: [
  // 折りたたまれたリンクのグループ。
  {
    label: '折りたたまれたリンク',
    collapsed: true,
    items: [
      { label: 'はじめに', link: '/intro' },
      { label: '次のステップ', link: '/next-steps' },
    ],
  },
  // 自動生成される折りたたまれたサブグループを含む展開されたグループ。
  {
    label: '参照',
    autogenerate: {
      directory: 'reference',
      collapsed: true,
    },
  },
],
```

#### ラベルの翻訳

多言語対応が必要なサイトの場合、各項目の`label`はデフォルトのロケールのものとみなされます。サポート対象の言語のラベルを提供するには、`translations`プロパティを設定します。

```js
sidebar: [
  // フランス語に翻訳されたラベルをもつサイドバーの例。
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
],
```

#### `SidebarItem`

```ts
type SidebarItem = {
  label: string;
  translations?: Record<string, string>;
} & (
  | {
      link: string;
      badge?: string | BadgeConfig;
    }
  | { items: SidebarItem[]; collapsed?: boolean }
  | {
      autogenerate: { directory: string; collapsed?: boolean };
      collapsed?: boolean;
    }
);
```

#### `BadgeConfig`

```ts
interface BadgeConfig {
  text: string;
  variant: 'note' | 'tip' | 'caution' | 'danger' | 'success' | 'default';
}
```

### `locales`

**type:** <code>{ \[dir: string\]: [LocaleConfig](#localeconfig) }</code>

[サイトの国際化（i18n）をおこなうには](/ja/guides/i18n/)、サポート対象の`locales`を設定します。

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

#### `LocaleConfig`

```ts
interface LocaleConfig {
  label: string;
  lang?: string;
  dir?: 'ltr' | 'rtl';
}
```

各ロケールに対し以下のオプションを設定できます。

##### `label`（必須）

**type:** `string`

たとえば言語の切替機能などでユーザーに表示する、この言語を表わすラベルです。ほとんどの場合、このラベルは、その言語を使用するユーザーが読みたいと思う言語の名前にすることが望ましいでしょう。たとえば、`"English"`、`"العربية"`、`"简体中文"`などです。

##### `lang`

**type:** `string`

この言語のBCP-47タグです。たとえば`"en"`、`"ar"`、`"zh-CN"`などです。設定されていない場合、デフォルトでは言語のディレクトリ名が使用されます。`"pt-BR"`や`"en-US"`のように地域タグが含まれる言語タグは、その地域専用の翻訳が見つからない場合、ベース言語の組み込みUI翻訳が使用されます。

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

このサイトのデフォルト言語を設定します。この値は、[`locales`](#locales)オブジェクトのキーのいずれかと一致する必要があります。（デフォルト言語が[ルートロケール](#ルートロケール)の場合は、この設定をスキップできます。）

翻訳がない場合には、デフォルトロケールがフォールバックコンテンツとして使用されます。

### `social`

**type:** `Partial<Record<'bitbucket' | 'codeberg' | 'codePen' | 'discord' | 'github' | 'gitlab' | 'gitter' | 'instagram' | 'linkedin' | 'mastodon' | 'microsoftTeams' | 'stackOverflow' | 'threads' | 'twitch' | 'twitter' | 'youtube', string>>`

このサイトのソーシャルメディアアカウントに関する任意の項目です。これらのいずれかを追加すると、サイトヘッダーにアイコンリンクとして表示されます。

```js
starlight({
  social: {
    codeberg: 'https://codeberg.org/knut/examples',
    discord: 'https://astro.build/chat',
    github: 'https://github.com/withastro/starlight',
    gitlab: 'https://gitlab.com/delucis',
    linkedin: 'https://www.linkedin.com/company/astroinc',
    mastodon: 'https://m.webtoo.ls/@astro',
    threads: 'https://www.threads.net/@nmoodev',
    twitch: 'https://www.twitch.tv/bholmesdev',
    twitter: 'https://twitter.com/astrodotbuild',
    youtube: 'https://youtube.com/@astrodotbuild',
  },
});
```

### `customCss`

**type:** `string[]`

Starlightサイトの見た目をカスタマイズするためのCSSファイルを設定します。

プロジェクトのルートからの相対パスで指定したローカルのCSSファイル（`'./src/custom.css'`など）と、npmモジュールとしてインストールしたCSS（`'@fontsource/roboto'`など）に対応しています。

```js
starlight({
  customCss: ['./src/custom-styles.css', '@fontsource/roboto'],
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

### `lastUpdated`

**type:** `boolean`  
**default:** `false`

フッターにページの最終更新日を表示するかどうかを制御します。

デフォルトでは、この機能はリポジトリのGit履歴に依存しており、[浅いクローン](https://git-scm.com/docs/git-clone/ja#git-clone---depthltdepthgt)を実行する一部のデプロイプラットフォームでは正確にならない場合があります。[フロントマターの`lastUpdated`フィールド](/ja/reference/frontmatter/#lastupdated)を使用して、各ページでこの設定またはGitを基準とした日付を上書きできます。

### `pagination`

**type:** `boolean`  
**default:** `true`

フッターに前のページと次のページへのリンクを含めるかどうかを定義します。

[`prev`](/ja/reference/frontmatter/#prev)と[`next`](/ja/reference/frontmatter/#next)フロントマターフィールドを使用して、この設定、またはリンクテキストとURLをページごとに上書きできます。

### `favicon`

**type:** `string`  
**default:** `'/favicon.svg'`

サイトのデフォルトファビコンのパスを設定します。ファビコンは`public/`ディレクトリに配置され、また有効なアイコンファイル（`.ico`、`.gif`、`.jpg`、`.png`、または`.svg`）である必要があります。

```js
starlight({
  favicon: '/images/favicon.svg',
}),
```

追加のバリアントやフォールバック用のファビコンを設定する必要がある場合は、[`head`オプション](#head)を使用してタグを追加できます。

```js
starlight({
  favicon: '/images/favicon.svg'.
  head: [
    // Safari用にICOファビコンのフォールバックを追加します。
    {
      tag: 'link',
      attrs: {
        rel: 'icon',
        href:'/images/favicon.ico',
        sizes: '32x32',
      },
    },
  ],
});
```
