---
title: Plugins Reference
description: An overview of the Starlight plugin API.
tableOfContents:
  maxHeadingLevel: 4
---

Starlight plugins can customize Starlight configuration, UI, and behavior, while also being easy to share and reuse.
This reference page documents the API that plugins have access to.

Lean more about using a Starlight plugin in the [Configuration Reference](/reference/configuration/#plugins) or visit the [plugins showcase](/showcase/#community-plugins) to see a list of community plugins.

## Quick API Reference

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
You only need to provide the root-level configuration keys that you want to update but no deep merge is performed. In order to update nested configuration values, you must provide the entire nested object.

For example, to add a new [`social`](/reference/configuration/#social) media account to the configuration without overriding the existing ones:

```ts {6-11}
// plugin.ts
export default {
  name: 'add-twitter-plugin',
  hooks: {
    setup({ config, updateConfig }) {
      updateConfig({
        social: {
          ...config.social,
          twitter: 'astrodotbuild',
        },
      });
    },
  },
};
```

#### `addIntegration`

**type:** `(integration: AstroIntegration) => void`

A callback function to add an [Astro integration](https://docs.astro.build/en/reference/integrations-reference/) required by the plugin.
For example, to add the [React Astro integration](https://docs.astro.build/en/guides/integrations-guide/react/):

```ts {14}
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
This configuration is resolved before any other integrations have run.

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
