---
title: 插件参考
description: Starlight 的插件 API 的概述
tableOfContents:
  maxHeadingLevel: 4
---

Starlight 插件可以自定义 Starlight 的配置、UI 和行为，同时也易于共享和重用。
本参考页面记录了插件可以使用的 API。

在 [配置参考](/zh-cn/reference/configuration/#plugins) 中了解更多关于使用 Starlight 插件的内容。
或者访问 [插件 showcase](/zh-cn/resources/plugins/#插件) 来查看可用插件的列表。

## 快速 API 参照

一个 Starlight 插件的形状如下。
请参阅下面的不同属性和钩子参数的详细信息。

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

**类型：** `string`

一个插件必须提供一个描述它的唯一名字。该名字会在[输出与本插件有关的日志消息](#logger)时使用，并且可能被其他插件用于检测此插件是否存在。

## `hooks`

钩子是 Starlight 在特定时机调用的插件函数。

要获取钩子的参数类型，请使用 `HookParameters` 工具类型并传入钩子名称。
在下面的例子中，`options` 参数被类型化为与 `config:setup` 钩子传递的参数匹配：

```ts
import type { HookParameters } from '@astrojs/starlight/types';

function configSetup(options: HookParameters['config:setup']) {
  options.useTranslations('en');
}
```

### `i18n:setup`

当 Starlight 初始化时会调用插件国际化设置函数。
`i18n:setup` 钩子可以用于注入翻译字符串，以便插件可以支持不同的语言环境。这些翻译字符串可以通过 [`useTranslations()`](#usetranslations) 在 `config:setup` 钩子中使用，也可以在 UI 组件中通过 [`Astro.locals.t()`](/zh-cn/guides/i18n/#使用-ui-翻译) 使用。

`i18n:setup` 钩子会传入以下选项：

#### `injectTranslations`

**类型：** `(translations: Record<string, Record<string, string>>) => void`

一个回调函数，用于添加或更新 Starlight 的 [本地化 API](/zh-cn/guides/i18n/#使用-ui-翻译) 中使用的翻译字符串。

在下面的例子中，一个插件为名为 `myPlugin.doThing` 的自定义 UI 字符串注入翻译字符串，用于 `en` 和 `fr` 语言环境：

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

要在插件 UI 中使用注入的翻译字符串，请遵循 [“使用 UI 翻译”](/zh-cn/guides/i18n/#使用-ui-翻译) 指南。
如果你需要在插件的 [`config:setup`](#configsetup) 钩子中使用 UI 字符串，可以使用 [`useTranslations()`](#usetranslations) 回调。

插件注入的翻译字符串的类型会自动在用户项目中生成，但当在插件的代码库中工作时还不可用。
要在插件的上下文中类型化 `locals.t` 对象，请在 TypeScript 声明文件中声明以下全局命名空间：

```ts
// env.d.ts
declare namespace App {
  type StarlightLocals = import('@astrojs/starlight').StarlightLocals;
  // 在插件的上下文中定义 `locals.t` 对象。
  interface Locals extends StarlightLocals {}
}

declare namespace StarlightApp {
  // 在 `I18n` 接口中定义额外的插件翻译。
  interface I18n {
    'myPlugin.doThing': string;
  }
}
```

如果你有一个包含你的翻译的对象，你也可以从源文件推断 `StarlightApp.I18n` 接口的类型。

例如，给定以下源文件：

```ts title="ui-strings.ts"
export const UIStrings = {
  en: { 'myPlugin.doThing': 'Do the thing' },
  fr: { 'myPlugin.doThing': 'Faire le truc' },
};
```

以下声明会从源文件中推断类型：

```ts title="env.d.ts"
declare namespace StarlightApp {
  type UIStrings = typeof import('./ui-strings').UIStrings.en;
  interface I18n extends UIStrings {}
}
```

### `config:setup`

插件配置设置函数会在 Starlight 初始化时调用（在 [`astro:config:setup`](https://docs.astro.build/zh-cn/reference/integrations-reference/#astroconfigsetup) 集成钩子期间）。
`config:setup` 钩子可以用于更新 Starlight 配置或添加 Astro 集成。

这个钩子会被传入以下选项：

#### `config`

**类型：** `StarlightUserConfig`

一个用户提供的 [Starlight 配置](/zh-cn/reference/configuration/)的只读副本。
这个配置可能已经被当前插件之前的其他插件更新过了。

#### `updateConfig`

**类型：** `(newConfig: StarlightUserConfig) => void`

一个可以更新用户提供的 [Starlight 配置](/zh-cn/reference/configuration/)的回调函数。
传入你想要覆盖的根级配置键。
要更新嵌套的配置值，你必须提供整个嵌套对象。

要扩展现有的配置选项而不是覆盖它，可以将现有值展开到新值中。
在下面的例子中，通过将 `config.social` 展开到新的 `social` 数组中，向现有配置添加了一个新的 [`social`](/zh-cn/reference/configuration/#social) 媒体账号：

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

**类型：** `(integration: AstroIntegration) => void`

一个添加插件所需的 [Astro 集成](https://docs.astro.build/zh-cn/reference/integrations-reference/)的回调函数。

在下面的例子中，插件首先检查是否已经配置了 [Astro 的 React 集成](https://docs.astro.build/zh-cn/guides/integrations-guide/react/)，如果没有，就使用 `addIntegration()` 来添加它：

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

      // 只在 React 集成没有已经被添加的时候添加它。
      if (!isReactLoaded) {
        addIntegration(react());
      }
    },
  },
};
```

#### `addRouteMiddleware`

**类型：** `(config: { entrypoint: string; order?: 'pre' | 'post' | 'default' }) => void`

一个回调函数，用于向站点添加 [路由中间件处理程序](/zh-cn/guides/route-data/)。

`entrypoint` 属性必须符合插件的中间件文件的模块规范，该文件导出一个 `onRequest` 处理程序。

在下面的例子中，一个名为 `@example/starlight-plugin` 的插件使用 npm 模块规范添加了一个路由中间件：

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

##### 控制执行顺序

默认情况下，插件中间件按插件添加的顺序运行。

如果你需要更精细地控制中间件的执行顺序，可以使用可选的 `order` 属性。
设置 `order: "pre"` 在用户中间件之前运行。
设置 `order: "post"` 在所有其他中间件之后运行。

如果两个插件添加了具有相同 `order` 值的中间件，则先添加的插件将先运行。

#### `astroConfig`

**类型：** `AstroConfig`

一个用户提供的 [Astro 配置](https://docs.astro.build/zh-cn/reference/configuration-reference/)的只读副本。

#### `command`

**类型：** `'dev' | 'build' | 'preview'`

被用于运行 Starlight 的命令：

- `dev` - 项目是用 `astro dev` 运行的
- `build` - 项目是用 `astro build` 运行的
- `preview` - 项目是用 `astro preview` 运行的

#### `isRestart`

**类型：** `boolean`

当开发服务器启动时为 `false`，当触发重新加载时为 `true`。
触发重新加载的常见原因包括用户在开发服务器运行时编辑了他们的 `astro.config.mjs`。

#### `logger`

**类型：** `AstroIntegrationLogger`

一个 [Astro 集成日志记录器](https://docs.astro.build/zh-cn/reference/integrations-reference/#astrointegrationlogger)的实例，你可以用它来写日志。
所有被记录的消息都会带有插件名字的前缀。

```ts {6}
// plugin.ts
export default {
  name: 'long-process-plugin',
  hooks: {
    'config:setup'({ logger }) {
      logger.info('启动一个长流程…');
      // 一些很长的流程…
    },
  },
};
```

上面的例子会记录一条下面这样的消息：

```shell
[long-process-plugin] 启动一个长流程…
```

#### `useTranslations`

**类型：** `(lang: string) => I18nT`

使用 BCP-47 语言标签调用 `useTranslations()` 以生成一个工具函数，该函数提供对特定语言的 UI 字符串的访问。
`useTranslations()` 返回一个等效于 `Astro.locals.t()` API 的工具函数，该 API 在 Astro 组件中可用。
要了解更多可用的 API，请参阅 [“使用 UI 翻译”](/zh-cn/guides/i18n/#使用-ui-翻译) 指南。

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

上面的例子会记录一条包含简体中文语言的默认 UI 字符串的消息：

```shell
[plugin-use-translations] 基于 Starlight 构建
```

#### `absolutePathToLang`

**类型：** `(path: string) => string`

使用绝对文件路径调用 `absolutePathToLang()` 以获取该文件的语言。

这在添加 [remark 或 rehype 插件](https://docs.astro.build/zh-cn/guides/markdown-content/#markdown-plugins) 以处理 Markdown 或 MDX 文件时特别有用。
这些插件使用的 [虚拟文件格式](https://github.com/vfile/vfile) 包括正在处理的文件的 [绝对路径](https://github.com/vfile/vfile#filepath)，可以与 `absolutePathToLang()` 一起使用以确定文件的语言。
返回的语言可以与 [`useTranslations()`](#usetranslations) 工具函数一起使用以获取该语言的 UI 字符串。

例如，给定以下 Starlight 配置：

```js
starlight({
  title: 'My Docs',
  defaultLocale: 'en',
  locales: {
    // English docs in `src/content/docs/en/`
    en: { label: 'English' },
    // French docs in `src/content/docs/fr/`
    fr: { label: 'Français', lang: 'fr' },
  },
});
```

一个插件可以使用它的绝对路径来确定文件的语言：

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

上面的例子会记录一条包含法语语言的默认 UI 字符串的消息：

```shell
[plugin-use-translations] Astuce
```
