---
title: Plugins Reference
description: An overview of the Starlight plugin API.
---

Starlight Plugins provide an API to customize Starlight configuration, UI and behavior while also being easy to share and reuse.
This page is for anyone interested in creating their own Starlight plugins.

Lean more about using a Starlight plugin in the [Configuration Reference](/reference/configuration/#plugins) or visit the [Starlight Plugins Showcase](/showcase/#community-plugins) to see a list of community plugins.

## Quick API Reference

```ts
interface StarlightPlugin {
  name: string;
  hooks: {
    setup: (options: {
      config: StarlightUserConfig;
      updateConfig: (newConfig: StarlightUserConfig) => void;
      addIntegration: (integration: AstroIntegration) => void;
      logger: AstroIntegrationLogger;
    }) => void | Promise<void>;
  };
}
```

## `setup`

Plugin setup function called when the Starlight integration is initialized (during the [`astro:config:setup`](https://docs.astro.build/en/reference/integrations-reference/#astroconfigsetup) integration hook).
The `setup` hook can be used to update the Starlight configuration or add Astro integrations.

This hook provides the following options:

### `config`

**type:** `StarlightUserConfig`

A read-only copy of the user-supplied [Starlight configuration](/reference/configuration).
This configuration may have been updated by other plugins configured before the current one.

### `updateConfig`

**type:** `(newConfig: StarlightUserConfig) => void`

A callback function to update the user-supplied [Starlight configuration](/reference/configuration).
You only need to provide the configuration values that you want to update but no deep merge is performed.

For example, to add a new [`social`](/reference/configuration/#social) media account to the configuration without overriding the existing ones:

```ts {5-10}
// plugin.ts
export default {
  name: 'add-twitter-plugin',
  plugin({ config, updateConfig }) {
    updateConfig({
      social: {
        ...config.social,
        twitter: 'astrodotbuild',
      },
    });
  },
};
```

### `addIntegration`

**type:** `(integration: AstroIntegration) => void`

A callback function to add an [Astro integration](https://docs.astro.build/en/reference/integrations-reference/) required by the plugin.
For example, to add the [React Astro integration](https://docs.astro.build/en/guides/integrations-guide/react/):

```ts {7}
// plugin.ts
import react from '@astrojs/react';

export default {
  name: 'plugin-using-react',
  plugin({ addIntegration }) {
    addIntegration(react());
  },
};
```

### `logger`

**type:** `AstroIntegrationLogger`

An instance of the [Astro integration logger](https://docs.astro.build/en/reference/integrations-reference/#astrointegrationlogger) that you can use to write logs.
Note that all logged messages will be prefixed with the plugin name.

```ts {5}
// plugin.ts
export default {
  name: 'long-process-plugin',
  plugin({ logger }) {
    logger.info('Starting long process…');
    // Some long process…
  },
};
```

The example above will log a message that includes the provided info message:

```shell
[long-process-plugin] Starting long process…
```
