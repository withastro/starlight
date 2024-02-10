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
    }) => void | Promise<void>;
  };
}
```

## `name`

**type:** `string`

A plugin must provide a unique name that describes it. The name is used when [logging messages](#logger) related to this plugin and may be used by other plugins to detect the presence of this plugin.

## `hooks`

Hooks are functions which Starlight calls to run plugin code at specific times. Currently, Starlight supports a single `setup` hook.

### `hooks.setup`

Plugin setup function called when Starlight is initialized (during the [`astro:config:setup`](https://docs.astro.build/en/reference/integrations-reference/#astroconfigsetup) integration hook).
The `setup` hook can be used to update the Starlight configuration or add Astro integrations.

This hook is called with the following options:

#### `config`

**type:** `StarlightUserConfig`

A read-only copy of the user-supplied [Starlight configuration](/reference/configuration).
This configuration may have been updated by other plugins configured before the current one.

#### `updateConfig`

**type:** `(newConfig: StarlightUserConfig) => void`

A callback function to update the user-supplied [Starlight configuration](/reference/configuration).
Provide the root-level configuration keys you want to override.
To update nested configuration values, you must provide the entire nested object.

To extend an existing config option without overriding it, spread the existing value into your new value.
In the following example, a new [`social`](/reference/configuration/#social) media account is added to the existing configuration by spreading `config.social` into the new `social` object:

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

**type:** `(integration: AstroIntegration) => void`

A callback function to add an [Astro integration](https://docs.astro.build/en/reference/integrations-reference/) required by the plugin.

In the following example, the plugin first checks if [Astro’s React integration](https://docs.astro.build/en/guides/integrations-guide/react/) is configured and, if it isn’t, uses `addIntegration()` to add it:

```ts {14} "addIntegration,"
// plugin.ts
import react from '@astrojs/react';

export default {
  name: 'plugin-using-react',
  hooks: {
    plugin({ addIntegration, astroConfig }) {
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
    plugin({ logger }) {
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

## Route injection

Plugins [adding](#addintegration) an Astro integration can inject routes using the Integrations API [`injectRoute`](https://docs.astro.build/en/reference/integrations-reference/#injectroute-option) function to render dynamically generated content.
By default, pages rendered on custom routes do not use the Starlight layout.
To do so, pages must wrap their content with the `<StarlightPage />` component.

### `StarlightPage`

The `<StarlightPage />` component can be used to render a page on a custom route using the Starlight layout.

```astro
---
// plugin/src/Example.astro
import StarlightPage, {
  type StarlightPageProps,
} from '@astrojs/starlight/components/StarlightPage.astro';
import CustomComponent from './CustomComponent.astro';

const props = {
  slug: 'custom-page/example',
  frontmatter: {
    title: 'My custom page',
  },
} satisfies StarlightPageProps;
---

<StarlightPage {...props}>
  <p>This is a custom page with a custom component:</p>
  <CustomComponent />
</StarlightPage>
```

#### Props

##### `slug` (required)

**type:** `string`

The slug of the page.

##### `frontmatter` (required)

**type:** `StarlightPageFrontmatter`

Similar to the [frontmatter properties](/reference/frontmatter/) with the [`title`](/reference/frontmatter/#title-required) property being required and all other properties being optional and the following differences:

- The [`sidebar`](/reference/frontmatter/#sidebar) property is not supported as this option controls how a page is displayed in the sidebar, when using an [autogenerated link group](/reference/configuration/#sidebar) which is not applicable to pages using the `<StarlightPage />` component.
- The [`editUrl`](/reference/frontmatter/#editurl) option requires an URL to display an edit link.

##### `sidebar`

**type:** `SidebarEntry[] | undefined`  
**default:** the sidebar generated based on the [global `sidebar` config](/reference/configuration/#sidebar)

Site navigation sidebar entries for this page or fallback to the global `sidebar` option if not provided.

##### `hasSidebar`

**type:** `boolean`  
**default:** `false` if [`template`](/reference/frontmatter/#template) is `'splash'`, otherwise `true`

Whether or not the sidebar should be displayed on this page.

##### `headings`

**type:** `{ depth: number; slug: string; text: string }[]`  
**default:** `[]`

Array of all headings of the page.

##### `dir`

**type:** `'ltr' | 'rtl'`  
**default:** The page writing direction.

Page content writing direction.

##### `lang`

**type:** `string`  
**default:** The page language tag.

BCP-47 language tag for this page’s content locale, e.g. `en`, `zh-CN`, or `pt-BR`.

##### `isFallback`

**type:** `boolean`

Indicates if this page is untranslated in the current language and using [fallback content](/guides/i18n/#fallback-content).
