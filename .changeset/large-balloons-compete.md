---
'@astrojs/starlight': minor
---

Exposes the built-in localization system in the Starlight plugin `config:setup` hook.

⚠️ **BREAKING CHANGE:**

This addition changes how Starlight plugins add or update translation strings used in Starlight’s localization APIs.
Plugins previously using the [`injectTranslations()`](https://starlight.astro.build/reference/plugins/#injecttranslations) callback function from the plugin [`config:setup`](https://starlight.astro.build/reference/plugins/#configsetup) hook should now use the same function available in the [`i18n:setup`](https://starlight.astro.build/reference/plugins/#i18nsetup) hook.

```diff
export default {
  name: 'plugin-with-translations',
  hooks: {
-   'config:setup'({ injectTranslations }) {
+   'i18n:setup'({ injectTranslations }) {
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
