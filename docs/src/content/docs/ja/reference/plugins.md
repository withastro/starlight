---
title: プラグイン
description: StarlightのプラグインAPIの概要。
tableOfContents:
  maxHeadingLevel: 4
---

Starlightのプラグインにより、Starlightの設定、UI、および動作をカスタマイズできます。このリファレンスページでは、プラグインがアクセス可能なAPIについて説明します。

Starlightのプラグインを使用する方法について、詳しくは[設定方法のリファレンス](/ja/reference/configuration/#plugins)を参照してください。また、利用可能なプラグインの一覧については、[プラグインショーケース](/ja/resources/plugins/#プラグイン)を確認してください。

## API早見表

Starlightのプラグインは次の構造をもちます。各プロパティとフックパラメータの詳細については、以下を参照してください。

<!-- prettier-ignore-start -->
```ts
interface StarlightPlugin {
  name: string;
  hooks: {
    'i18n:setup'?: (options: {
      injectTranslations: (
        translations: Record<string, Record<string, string>>
      ) => void;
    }) => void | Promise<void>;
    'config:setup': (options: {
      config: StarlightUserConfig;
      updateConfig: (newConfig: StarlightUserConfig) => void;
      addIntegration: (integration: AstroIntegration) => void;
      addRouteMiddleware: (config: { entrypoint: string; order?: 'pre' | 'post' | 'default' }) => void;
      astroConfig: AstroConfig;
      command: 'dev' | 'build' | 'preview';
      isRestart: boolean;
      logger: AstroIntegrationLogger;
      useTranslations: (lang: string) => I18nT;
      absolutePathToLang: (path: string) => string;
    }) => void | Promise<void>;
  };
}
```
<!-- prettier-ignore-end -->

## `name`

**type:** `string`

プラグインには、自身を説明する一意の名前を指定する必要があります。名前は、このプラグインに関連する[ログメッセージ](#logger)を出力するときに使用されます。また、あるプラグインの存在を検出するために使用される場合もあります。

## `hooks`

フックは、Starlightが特定のタイミングでプラグインコードを実行するために呼び出す関数です。

フックの引数の型を取得するには、`HookParameters`ユーティリティ型を使用し、フック名を渡します。以下の例では、`options`パラメータは`config:setup`フックに渡される引数に一致するように型付けされています。

```ts
import type { HookParameters } from '@astrojs/starlight/types';

function configSetup(options: HookParameters['config:setup']) {
  options.useTranslations('en');
}
```

### `i18n:setup`

Starlightが初期化されるときに呼び出される、プラグインの国際化向けのセットアップ関数です。`i18n:setup`フックは、プラグインがさまざまなロケールをサポートできるように翻訳文字列を登録するために使用できます。これらの翻訳は、`config:setup`フックの[`useTranslations()`](#usetranslations)や、UIコンポーネントの[`Astro.locals.t()`](/ja/guides/i18n/#ui翻訳を使用する)を通じて利用できます。

`i18n:setup`フックは、以下のオプションとともに呼び出されます。

#### `injectTranslations`

**type:** `(translations: Record<string, Record<string, string>>) => void`

Starlightの[ローカライズAPI](/ja/guides/i18n/#ui翻訳を使用する)で使用される翻訳文字列を追加または更新するためのコールバック関数です。

以下の例では、プラグインが`en`と`fr`ロケールの`myPlugin.doThing`というカスタムUI文字列の翻訳を登録しています。

```ts {6-13} /(injectTranslations)[^(]/
// plugin.ts
export default {
  name: 'plugin-with-translations',
  hooks: {
    'i18n:setup'({ injectTranslations }) {
      injectTranslations({
        en: {
          'myPlugin.doThing': 'Do the thing',
        },
        fr: {
          'myPlugin.doThing': 'Faire le truc',
        },
      });
    },
  },
};
```

登録した翻訳をプラグインUIで使用するには、[“UI翻訳の使用“ガイド](/ja/guides/i18n/#ui翻訳を使用する)に従ってください。プラグインの[`config:setup`](#configsetup)フックのコンテキストでUI文字列を使用する必要がある場合は、[`useTranslations()`](#usetranslations)コールバックを使用できます。

プラグインが登録する翻訳文字列の型は、ユーザーのプロジェクトで自動的に生成されますが、プラグインのコードベースで作業中はまだ利用できません。プラグインのコンテキストで`locals.t`オブジェクトを型付けするには、TypeScript宣言ファイルで以下のグローバル名前空間を宣言します。

```ts
// env.d.ts
declare namespace App {
  type StarlightLocals = import('@astrojs/starlight').StarlightLocals;
  // プラグインのコンテキストで`locals.t`オブジェクトを定義します。
  interface Locals extends StarlightLocals {}
}

declare namespace StarlightApp {
  // `I18n`インターフェースにプラグインの追加の翻訳を定義します。
  interface I18n {
    'myPlugin.doThing': string;
  }
}
```

翻訳を含むオブジェクトがあるソースファイルから、`StarlightApp.I18n`インターフェースの型を推論することもできます。

たとえば、以下のソースファイルがあるとします。

```ts title="ui-strings.ts"
export const UIStrings = {
  en: { 'myPlugin.doThing': 'Do the thing' },
  fr: { 'myPlugin.doThing': 'Faire le truc' },
};
```

以下の宣言は、ソースファイルの英語キーから型を推論します。

```ts title="env.d.ts"
declare namespace StarlightApp {
  type UIStrings = typeof import('./ui-strings').UIStrings.en;
  interface I18n extends UIStrings {}
}
```

### `config:setup`

プラグインの設定セットアップ関数は、Starlightが初期化される際に呼び出されます（[`astro:config:setup`](https://docs.astro.build/ja/reference/integrations-reference/#astroconfigsetup)インテグレーションフック内）。`config:setup`フックは、Starlightの設定を更新したり、Astroのインテグレーションを追加したりするために使用できます。

このフックは、以下のオプションとともに呼び出されます。

#### `config`

**type:** `StarlightUserConfig`

ユーザーが提供した[Starlightの設定](/ja/reference/configuration/)の、読み取り専用の複製です。この設定は、現在のプラグインより前に置かれた他のプラグインによって更新されている可能性があります。

#### `updateConfig`

**type:** `(newConfig: StarlightUserConfig) => void`

ユーザーが提供した[Starlightの設定](/ja/reference/configuration/)を更新するためのコールバック関数です。上書きしたいルートレベルの設定キーを指定します。ネストされた設定値を更新するには、ネストされたオブジェクトの全体を指定する必要があります。

既存の設定オプションをオーバーライドせず拡張するには、既存の値を新しい値へと展開します。以下の例では、`config.social`を新しい`social`配列に展開し、既存の設定に新しい[`social`](/ja/reference/configuration/#social)メディアアカウントを追加しています。

```ts {6-15}
// plugin.ts
export default {
  name: 'add-twitter-plugin',
  hooks: {
    'config:setup'({ config, updateConfig }) {
      updateConfig({
        social: [
          ...config.social,
          {
            icon: 'twitter',
            label: 'Twitter',
            href: 'https://twitter.com/astrodotbuild',
          },
        ],
      });
    },
  },
};
```

#### `addIntegration`

**type:** `(integration: AstroIntegration) => void`

プラグインが必要とする[Astroのインテグレーション](https://docs.astro.build/ja/reference/integrations-reference/)を追加するためのコールバック関数です。

以下の例では、プラグインはまず[AstroのReactインテグレーション](https://docs.astro.build/ja/guides/integrations-guide/react/)が設定されているかどうかを確認し、設定されていない場合は`addIntegration()`を使用して追加します。

```ts {14} "addIntegration,"
// plugin.ts
import react from '@astrojs/react';

export default {
  name: 'plugin-using-react',
  hooks: {
    'config:setup'({ addIntegration, astroConfig }) {
      const isReactLoaded = astroConfig.integrations.find(
        ({ name }) => name === '@astrojs/react'
      );

      // Reactインテグレーションがまだ読み込まれていない場合のみ追加します。
      if (!isReactLoaded) {
        addIntegration(react());
      }
    },
  },
};
```

#### `addRouteMiddleware`

**type:** `(config: { entrypoint: string; order?: 'pre' | 'post' | 'default' }) => void`

サイトに[ルートミドルウェアハンドラー](/ja/guides/route-data/)を追加するためのコールバック関数です。

`entrypoint`プロパティは、`onRequest`ハンドラーをエクスポートするプラグインのミドルウェアファイルのモジュール指定子である必要があります。

以下の例では、`@example/starlight-plugin`として公開されたプラグインが、npmモジュール指定子を使用してルートミドルウェアを追加しています。

```js {6-9}
// plugin.ts
export default {
  name: '@example/starlight-plugin',
  hooks: {
    'config:setup'({ addRouteMiddleware }) {
      addRouteMiddleware({
        entrypoint: '@example/starlight-plugin/route-middleware',
      });
    },
  },
};
```

##### 実行順序の制御

デフォルトでは、プラグインミドルウェアはプラグインが追加された順序で実行されます。

ミドルウェアの実行タイミングをより細かく制御する必要がある場合は、オプションの`order`プロパティを使用します。
ユーザーのミドルウェアより前に実行するには`order: "pre"`を設定します。他のすべてのミドルウェアの後に実行するには`order: "post"`を設定します。

同じ`order`値を持つミドルウェアを2つのプラグインが追加した場合、最初に追加されたプラグインが先に実行されます。

#### `astroConfig`

**type:** `AstroConfig`

ユーザーが提供した[Astroの設定](https://docs.astro.build/ja/reference/configuration-reference/)の、読み取り専用の複製です。

#### `command`

**type:** `'dev' | 'build' | 'preview'`

Starlightを実行するために使用されたコマンドです。

- `dev` - プロジェクトは`astro dev`により実行されています
- `build` - プロジェクトは`astro build`により実行されています
- `preview` - プロジェクトは`astro preview`により実行されています

#### `isRestart`

**type:** `boolean`

開発サーバーが起動したときは`false`、リロードがトリガーされたときは`true`となります。再起動が発生するよくある理由としては、開発サーバーが実行されている間にユーザーが`astro.config.mjs`を編集した場合などがあります。

#### `logger`

**type:** `AstroIntegrationLogger`

ログを書き込むために使用する[Astroインテグレーションロガー](https://docs.astro.build/ja/reference/integrations-reference/#astrointegrationlogger)のインスタンスです。すべてのログメッセージは、プラグイン名が接頭辞として付加されます。

```ts {6}
// plugin.ts
export default {
  name: 'long-process-plugin',
  hooks: {
    'config:setup'({ logger }) {
      logger.info('時間が掛かる処理を開始します…');
      // 何らかの時間が掛かる処理…
    },
  },
};
```

上記の例では、指定した`info`レベルのメッセージを含むログが出力されます。

```shell
[long-process-plugin] 時間が掛かる処理を開始します…
```

#### `useTranslations`

**type:** `(lang: string) => I18nT`

BCP-47言語タグを指定して`useTranslations()`を呼び出すと、その言語のUI文字列にアクセスするためのユーティリティ関数が生成されます。`useTranslations()`は、Astroコンポーネントで利用可能な`Astro.locals.t()`APIと同等のものを返します。利用可能なAPIの詳細については、[“UI翻訳の使用“](/ja/guides/i18n/#ui翻訳を使用する)ガイドを参照してください。

```ts {6}
// plugin.ts
export default {
  name: 'plugin-use-translations',
  hooks: {
    'config:setup'({ useTranslations, logger }) {
      const t = useTranslations('zh-CN');
      logger.info(t('builtWithStarlight.label'));
    },
  },
};
```

上記の例では、中国語簡体字の組み込みUI文字列を含むメッセージがログに出力されます。

```shell
[plugin-use-translations] 基于 Starlight 构建
```

#### `absolutePathToLang`

**type:** `(path: string) => string`

絶対ファイルパスを指定して`absolutePathToLang()`を呼び出すと、そのファイルの言語を取得できます。

これは、MarkdownやMDXファイルを処理する[remarkやrehypeプラグイン](https://docs.astro.build/ja/guides/markdown-content/#markdown-plugins)を追加する際に特に便利です。これらのプラグインが使用する[仮想ファイル形式](https://github.com/vfile/vfile)には、処理中のファイルの[絶対パス](https://github.com/vfile/vfile#filepath)が含まれており、`absolutePathToLang()`と組み合わせてファイルの言語を判定できます。返された言語は、[`useTranslations()`](#usetranslations)ヘルパーと組み合わせて、その言語のUI文字列を取得するために使用できます。

たとえば、以下のStarlight設定があるとします。

```js
starlight({
  title: 'My Docs',
  defaultLocale: 'en',
  locales: {
    // 英語ドキュメント: `src/content/docs/en/`
    en: { label: 'English' },
    // フランス語ドキュメント: `src/content/docs/fr/`
    fr: { label: 'Français', lang: 'fr' },
  },
});
```

プラグインは絶対パスを使用してファイルの言語を判定できます。

```ts {6-8} /fr/
// plugin.ts
export default {
  name: 'plugin-use-translations',
  hooks: {
    'config:setup'({ absolutePathToLang, useTranslations, logger }) {
      const lang = absolutePathToLang(
        '/absolute/path/to/project/src/content/docs/fr/index.mdx'
      );
      const t = useTranslations(lang);
      logger.info(t('aside.tip'));
    },
  },
};
```

上記の例では、フランス語の組み込みUI文字列を含むメッセージがログに出力されます。

```shell
[plugin-use-translations] Astuce
```
