---
'@astrojs/starlight': minor
---

Overhauls the built-in localization system which is now powered by the [`i18next`](https://www.i18next.com/) library and available to use anywhere in your documentation website.

See the [“Accessing UI strings”](https://starlight.astro.build/guides/i18n/#accessing-ui-strings) guide to learn more about how to access built-in UI labels or your own custom strings in your project. Plugin authors can also use the new [`injectTranslations()`](https://starlight.astro.build/reference/plugins/#injecttranslations) helper to add or update translation strings.

⚠️ **BREAKING CHANGE:** The `Astro.props.labels` props has been removed from the props passed down to custom component overrides.

If you are relying on `Astro.props.labels` (for example to read a built-in UI label), you will need to update your code to use the new [`Astro.locals.t()`](https://starlight.astro.build/guides/i18n/#accessing-ui-strings) helper instead.

```astro
---
import type { Props } from '@astrojs/starlight/props';
// The `search.label` UI label for this page’s language:
const searchLabel = Astro.locals.t('search.label');
---
```
