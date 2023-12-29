---
title: Plugins Reference
description: An overview of the Starlight plugin API.
tableOfContents:
  maxHeadingLevel: 4
---

Starlight plugins can customize Starlight configuration, UI, and behavior, while also being easy to share and reuse.
This reference page documents the API that plugins have access to.

Learn more about using a Starlight plugin in the [Configuration Reference](/reference/configuration/#plugins) or visit the [plugins showcase](/showcase/#plugins) to see a list of available plugins.

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

To do so, pages must wrap their content with the `<VirtualPage />` component and can use the [`makeVirtualStaticPaths()`](#makevirtualstaticpaths) helper function to generate localized routes for multilingual sites.

### VirtualPage

The `<VirtualPage />` component can be used to render a page on a custom route using the Starlight layout.

```astro
---
// plugin/src/Example.astro
import VirtualPage, {
  type VirtualPageProps,
} from '@astrojs/starlight/components/VirtualPage.astro';
import CustomComponent from './CustomComponent.astro';

const props = {
  title: 'My custom page',
  slug: 'custom-page/example',
  template: 'doc',
  hasSidebar: true,
  headings: [{ depth: 2, slug: 'description', text: 'Description' }],
  dir: 'ltr',
  lang: 'en',
  pagefind: true,
  head: [],
} satisfies VirtualPageProps;
---

<VirtualPage {...props}>
  <h2 id="description">Description</h2>
  <CustomComponent />
</VirtualPage>
```

#### Required props

The `<VirtualPage />` component requires the following props:

##### `title`

**type:** `string`

The page title displayed at the top of the page, in browser tabs, and in page metadata.

##### `slug`

**type:** `string`

The slug of the page.

#### Optional props

Additionaly, the following props can be provided to customize the page:

##### `description`

**type:** `string`

The page description is used for page metadata and will be picked up by search engines and in social media previews.

##### `template`

**type:** `'doc' | 'splash'`  
**default:** `'doc'`

Set the layout template for this page.
Use `'splash'` to use a wider layout without any sidebars (if defined, [`hasSidebar`](#hassidebar) takes precedence).

##### `pagefind`

**type:** `boolean`  
**default:** `true`

Set whether this page should be included in the [Pagefind](https://pagefind.app/) search index.

##### `head`

**type:** `{ tag: string; attrs: Record<string, string | boolean | undefined>; content: string }[]`  
**default:** `[]`

Additional tags to your page’s `<head>`. Similar to the [global `head` option](/reference/configuration/#head).

##### `headings`

**type:** `{ depth: number; slug: string; text: string }[]`  
**default:** `[]`

Array of all headings of the page.

##### `sidebar`

**type:** `SidebarEntry[] | undefined`  
**default:** the sidebar generated based on the [global `sidebar` config](/reference/configuration/#sidebar)

Site navigation sidebar entries for this page or fallback to the global `sidebar` option if not provided.

##### `hasSidebar`

**type:** `boolean`  
**default:** `false` if [`template`](#template) is `'splash'`, otherwise `true`

Whether or not the sidebar should be displayed on this page.

##### `tableOfContents`

**type:** `false | { minHeadingLevel: number; maxHeadingLevel: number; }`

Overrides the [global `tableOfContents` config](/reference/configuration/#tableofcontents).
Customize the heading levels to be included or set to `false` to hide the table of contents on this page.

##### `lastUpdated`

**type:** `Date`

A valid [YAML timestamp](https://yaml.org/type/timestamp.html) to display the last updated date of the page.

##### `prev`

**type:** `boolean | string | { link?: string; label?: string }`

Overrides the [global `pagination` option](/reference/configuration/#pagination). If a string is specified, the generated link text will be replaced and if an object is specified, both the link and the text will be overridden.

##### `next`

**type:** `boolean | string | { link?: string; label?: string }`

Same as [`prev`](#prev) but for the next page link.

##### `hero`

**type:** [`HeroConfig`](/reference/frontmatter/#heroconfig)

Add a hero component to the top of this page. Works well with `template: splash`. Similar to the [frontmatter `hero` option](/reference/frontmatter/#hero).

##### `dir`

**type:** `'ltr' | 'rtl'`  
**default:** The page writing direction.

Page content writing direction.

##### `lang`

**type:** `string`  
**default:** The page language tag.

BCP-47 language tag for this page’s content locale, e.g. `en`, `zh-CN`, or `pt-BR`.

##### `banner`

**type:** `{ content: string }`

Displays an announcement banner at the top of this page.

The `content` value can include HTML for links or other content.

##### `isFallback`

**type:** `boolean`

Indicates if this page is untranslated in the current language and using [fallback content](/guides/i18n/#fallback-content).

### `makeVirtualStaticPaths()`

[Dynamic routes](https://docs.astro.build/en/core-concepts/routing/#static-ssg-mode) must exports a `getStaticPaths()` function that returns an array of objects with a `params` property. Each of these objects will generate a corresponding route.

The `makeVirtualStaticPaths()` helper function can be used to generate dynamic localized routes for multilingual sites, supporting multiple languages and marking some routes as [fallback routes](/guides/i18n/#fallback-content).

This helper should be called with another function as its only argument and return an array of objects with a `params` property just like `getStaticPaths()`.
This function will be called with an object containing the `getLocalizedSlugs()` function that takes a `slug` and returns an array of corresponding localized slugs and their associated BCP-47 language tag.

```astro
---
// plugin/src/Example.astro
import type { InferGetStaticPropsType } from 'astro';
import VirtualPage, {
  makeVirtualStaticPaths,
} from '@astrojs/starlight/components/VirtualPage.astro';

export const { getStaticPaths } = makeVirtualStaticPaths(
  ({ getLocalizedSlugs }) => {
    return getLocalizedSlugs('foo/bar').map(({ slug, lang }) => ({
      params: { slug },
      props: { slug, lang },
    }));
  }
);

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

const { slug, lang } = Astro.props;

// This plugin page only exists in English and French.
// All other languages will be marked as fallback pages.
const isFallback = lang !== 'en' && lang !== 'fr';
---

<VirtualPage title="Demo" {slug} {isFallback}>
  {lang === 'fr' ? 'Ceci est un exemple' : 'This is an example'}
</VirtualPage>
```

The above example will generate the following routes:

- For a monolingual site, only the `foo/bar` route would be generated.
- For a multilingual site configured with English, French, and no [root locale](/guides/i18n/#use-a-root-locale), the `en/foo/bar` and `fr/foo/bar` routes would be generated.
- For a multilingual site configured with English as the root locale and French, the `foo/bar` and `fr/foo/bar` routes would be generated.

Learn more about `getStaticPaths()` in the [Astro Documentation](https://docs.astro.build/en/reference/api-reference/#getstaticpaths).
