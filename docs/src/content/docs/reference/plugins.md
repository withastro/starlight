---
title: Plugins Reference
description: An overview of the Starlight plugin API.
tableOfContents:
  maxHeadingLevel: 4
---

Starlight plugins can customize Starlight configuration, UI, and behavior, while also being easy to share and reuse.
This reference page documents the API that plugins have access to.

Learn more about using a Starlight plugin in the [Configuration Reference](/reference/configuration/#plugins) or visit the [plugins showcase](/resources/plugins/#plugins) to see a list of available plugins.

## Quick API Reference

A Starlight plugin has the following shape.
See below for details of the different properties and hook parameters.

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

A plugin must provide a unique name that describes it. The name is used when [logging messages](#logger) related to this plugin and may be used by other plugins to detect the presence of this plugin.

## `hooks`

Hooks are functions which Starlight calls to run plugin code at specific times.

To get the type of a hook's arguments, use the `HookParameters` utility type and pass in the hook name.
In the following example, the `options` parameter is typed to match the arguments passed to the `config:setup` hook:

```ts
import type { HookParameters } from '@astrojs/starlight/types';

function configSetup(options: HookParameters['config:setup']) {
  options.useTranslations('en');
}
```

### `i18n:setup`

Plugin internationalization setup function called when Starlight is initialized.
The `i18n:setup` hook can be used to inject translation strings so a plugin can support different locales.
These translations will be available via [`useTranslations()`](#usetranslations) in the `config:setup` hook and in UI components via [`Astro.locals.t()`](/guides/i18n/#using-ui-translations).

The `i18n:setup` hook is called with the following options:

#### `injectTranslations`

**type:** `(translations: Record<string, Record<string, string>>) => void`

A callback function to add or update translation strings used in Starlight’s [localization APIs](/guides/i18n/#using-ui-translations).

In the following example, a plugin injects translations for a custom UI string named `myPlugin.doThing` for the `en` and `fr` locales:

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

To use the injected translations in your plugin UI, follow the [“Using UI translations” guide](/guides/i18n/#using-ui-translations).
If you need to use UI strings in the context of the [`config:setup`](#configsetup) hook of your plugin, you can use the [`useTranslations()`](#usetranslations) callback.

Types for a plugin’s injected translation strings are generated automatically in a user’s project, but are not yet available when working in your plugin’s codebase.
To type the `locals.t` object in the context of your plugin, declare the following global namespaces in a TypeScript declaration file:

```ts
// env.d.ts
declare namespace App {
  type StarlightLocals = import('@astrojs/starlight').StarlightLocals;
  // Define the `locals.t` object in the context of a plugin.
  interface Locals extends StarlightLocals {}
}

declare namespace StarlightApp {
  // Define the additional plugin translations in the `I18n` interface.
  interface I18n {
    'myPlugin.doThing': string;
  }
}
```

You can also infer the types for the `StarlightApp.I18n` interface from a source file if you have an object containing your translations.

For example, given the following source file:

```ts title="ui-strings.ts"
export const UIStrings = {
  en: { 'myPlugin.doThing': 'Do the thing' },
  fr: { 'myPlugin.doThing': 'Faire le truc' },
};
```

The following declaration would infer types from the English keys in the source file:

```ts title="env.d.ts"
declare namespace StarlightApp {
  type UIStrings = typeof import('./ui-strings').UIStrings.en;
  interface I18n extends UIStrings {}
}
```

### `config:setup`

Plugin configuration setup function called when Starlight is initialized (during the [`astro:config:setup`](https://docs.astro.build/en/reference/integrations-reference/#astroconfigsetup) integration hook).
The `config:setup` hook can be used to update the Starlight configuration or add Astro integrations.

This hook is called with the following options:

#### `config`

**type:** `StarlightUserConfig`

A read-only copy of the user-supplied [Starlight configuration](/reference/configuration/).
This configuration may have been updated by other plugins configured before the current one.

#### `updateConfig`

**type:** `(newConfig: StarlightUserConfig) => void`

A callback function to update the user-supplied [Starlight configuration](/reference/configuration/).
Provide the root-level configuration keys you want to override.
To update nested configuration values, you must provide the entire nested object.

To extend an existing config option without overriding it, spread the existing value into your new value.
In the following example, a new [`social`](/reference/configuration/#social) media account is added to the existing configuration by spreading `config.social` into the new `social` array:

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

A callback function to add an [Astro integration](https://docs.astro.build/en/reference/integrations-reference/) required by the plugin.

In the following example, the plugin first checks if [Astro’s React integration](https://docs.astro.build/en/guides/integrations-guide/react/) is configured and, if it isn’t, uses `addIntegration()` to add it:

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

      // Only add the React integration if it's not already loaded.
      if (!isReactLoaded) {
        addIntegration(react());
      }
    },
  },
};
```

#### `addRouteMiddleware`

**type:** `(config: { entrypoint: string; order?: 'pre' | 'post' | 'default' }) => void`

A callback function to add a [route middleware handler](/guides/route-data/) to the site.

The `entrypoint` property must be a module specifier for your plugin’s middleware file that exports an `onRequest` handler.

In the following example, a plugin published as `@example/starlight-plugin` adds a route middleware using an npm module specifier:

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

##### Controlling execution order

By default, plugin middleware runs in the order the plugins are added.

Use the optional `order` property if you need more control over when your middleware runs.
Set `order: "pre"` to run before a user’s middleware.
Set `order: "post"` to run after all other middleware.

If two plugins add middleware with the same `order` value, the plugin added first will run first.

#### `astroConfig`

**type:** `AstroConfig`

A read-only copy of the user-supplied [Astro configuration](https://docs.astro.build/en/reference/configuration-reference/).

#### `command`

**type:** `'dev' | 'build' | 'preview'`

The command used to run Starlight:

- `dev` - Project is executed with `astro dev`
- `build` - Project is executed with `astro build`
- `preview` - Project is executed with `astro preview`

#### `isRestart`

**type:** `boolean`

`false` when the dev server starts, `true` when a reload is triggered.
Common reasons for a restart include a user editing their `astro.config.mjs` while the dev server is running.

#### `logger`

**type:** `AstroIntegrationLogger`

An instance of the [Astro integration logger](https://docs.astro.build/en/reference/integrations-reference/#astrointegrationlogger) that you can use to write logs.
All logged messages will be prefixed with the plugin name.

```ts {6}
// plugin.ts
export default {
  name: 'long-process-plugin',
  hooks: {
    'config:setup'({ logger }) {
      logger.info('Starting long process…');
      // Some long process…
    },
  },
};
```

The example above will log a message that includes the provided info message:

```shell
[long-process-plugin] Starting long process…
```

#### `useTranslations`

**type:** `(lang: string) => I18nT`

Call `useTranslations()` with a BCP-47 language tag to generate a utility function that provides access to UI strings for that language.
`useTranslations()` returns an equivalent of the `Astro.locals.t()` API that is available in Astro components.
To learn more about the available APIs, see the [“Using UI translations”](/guides/i18n/#using-ui-translations) guide.

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

The example above will log a message that includes a built-in UI string for the Simplified Chinese language:

```shell
[plugin-use-translations] 基于 Starlight 构建
```

#### `absolutePathToLang`

**type:** `(path: string) => string`

Call `absolutePathToLang()` with an absolute file path to get the language for that file.

This can be particularly useful when adding [remark or rehype plugins](https://docs.astro.build/en/guides/markdown-content/#markdown-plugins) to process Markdown or MDX files.
The [virtual file format](https://github.com/vfile/vfile) used by these plugins includes the [absolute path](https://github.com/vfile/vfile#filepath) of the file being processed, which can be used with `absolutePathToLang()` to determine the language of the file.
The returned language can be used with the [`useTranslations()`](#usetranslations) helper to get UI strings for that language.

For example, given the following Starlight configuration:

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

A plugin can determine the language of a file using its absolute path:

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

The example above will log a message that includes a built-in UI string for the French language:

```shell
[plugin-use-translations] Astuce
```
