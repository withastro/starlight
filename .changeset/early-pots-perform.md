---
"@astrojs/starlight": minor
---

Adds support for `Astro.currentLocale` and Astro’s i18n routing.

⚠️ **Potentially breaking change:** Starlight now configures Astro’s `i18n` option for you based on its `locales` config.

If you are currently using Astro’s `i18n` option as well as Starlight’s `locales` option, you will need to remove one of these.
In general we recommend using Starlight’s `locales`, but if you have a more advanced configuration you may choose to keep Astro’s `i18n` config instead.
