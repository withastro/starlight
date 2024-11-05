---
'@astrojs/starlight': minor
---

Exposes the built-in localization system in the Starlight plugin `setup` hook.

⚠️ **BREAKING CHANGE:**

This addition changes how Starlight plugins add or update translation strings used in Starlight’s localization APIs.
Plugins previously using the [`injectTranslations()`](https://starlight.astro.build/reference/plugins/#injecttranslations) callback function from the plugin [`setup`](https://starlight.astro.build/reference/plugins/#hookssetup) hook should now use the same function available in the [`init`](https://starlight.astro.build/reference/plugins/#hooksinit) hook.

```diff
export default {
  name: 'plugin-with-translations',
  hooks: {
-   setup({ injectTranslations }) {
+   init({ injectTranslations }) {
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
