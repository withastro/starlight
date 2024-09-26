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

```ts
interface StarlightPlugin {
  name: string;
  hooks: {
    setup: (options: {
      config: StarlightUserConfig;
      updateConfig: (newConfig: StarlightUserConfig) => void;
      addIntegration: (integration: AstroIntegration) => void;
      astroConfig: AstroConfig;
      command: 'dev' | 'build' | 'preview';
      isRestart: boolean;
      logger: AstroIntegrationLogger;
      injectTranslations: (Record<string, Record<string, string>>) => void;
    }) => void | Promise<void>;
  };
}
```

## `name`

**类型：** `string`

一个插件必须提供一个描述它的唯一名字。该名字会在[输出与本插件有关的日志消息](#logger)时使用，并且可能被其他插件用于检测此插件是否存在。

## `hooks`

钩子是 Starlight 在特定时机调用的插件函数。目前，Starlight 只支持一个 `setup` 钩子。

### `hooks.setup`

插件配置函数会在 Starlight 初始化时调用（在 [`astro:config:setup`](https://docs.astro.build/zh-cn/reference/integrations-reference/#astroconfigsetup) 集成钩子期间）。
`setup` 钩子可以用于更新 Starlight 配置或添加 Astro 集成。

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
在下面的例子中，通过将 `config.social` 展开到新的 `social` 对象中，向现有配置添加了一个新的 [`social`](/zh-cn/reference/configuration/#social) 媒体账号：

```ts {6-11}
// plugin.ts
export default {
  name: 'add-twitter-plugin',
  hooks: {
    setup({ config, updateConfig }) {
      updateConfig({
        social: {
          ...config.social,
          twitter: 'https://twitter.com/astrodotbuild',
        },
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
    setup({ addIntegration, astroConfig }) {
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
    setup({ logger }) {
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

#### `injectTranslations`

**类型：** `(translations: Record<string, Record<string, string>>) => void`

一个回调函数，用于添加或更新 Starlight [本地化 API](/zh-cn/guides/i18n/#使用-ui-翻译) 中使用的翻译字符串。

在以下示例中，插件向 `en` 和 `fr` 语言环境注入了名为 `myPlugin.doThing` 的自定义 UI 字符串的翻译：

```ts {6-13} /(injectTranslations)[^(]/
// plugin.ts
export default {
  name: 'plugin-with-translations',
  hooks: {
    setup({ injectTranslations }) {
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

要在你的插件 UI 中使用注入的翻译，可以依照 [“使用 UI 翻译”指南](/zh-cn/guides/i18n/#使用-ui-翻译)。

插件注入的翻译字符串的类型，是在用户的项目中自动生成的，但在插件的代码库中工作时还不可用。
要在插件上下文中对 `locals.t` 对象进行类型定义，可以在 TypeScript 声明文件中声明以下全局命名空间：

```ts
// env.d.ts
declare namespace App {
  type StarlightLocals = import('@astrojs/starlight').StarlightLocals;
  // 在插件上下文中定义 `locals.t` 对象。
  interface Locals extends StarlightLocals {}
}

declare namespace StarlightApp {
  // 在 `I18n` 接口中定义附加的插件翻译。
  interface I18n {
    'myPlugin.doThing': string;
  }
}
```

如果你有一个包含了翻译内容的对象，你还可以从源文件推断 `StarlightApp.I18n` 接口的类型。

举个例子，给定以下源文件：

```ts title="ui-strings.ts"
export const UIStrings = {
  en: { 'myPlugin.doThing': 'Do the thing' },
  fr: { 'myPlugin.doThing': 'Faire le truc' },
};
```

以下声明将从源文件中的英文键来推断出类型：

```ts title="env.d.ts"
declare namespace StarlightApp {
  type UIStrings = typeof import('./ui-strings').UIStrings.en;
  interface I18n extends UIStrings {}
}
```
