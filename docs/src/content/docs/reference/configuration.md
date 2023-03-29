---
title: Configuration Reference
---

## Configure the `starbook` integration

You can pass the following options to the `starbook` integration.

### `title` (required)

**type:** `string`

Set the title for your website. Will be used in metadata and in the browser tab title.

### `locales`

**type:** `{ [dir: string]: LocaleConfig }`

Configure internationalization (i18n) for your site by setting which `locales` are supported.

Each entry should use the directory where that language’s files are saved as the key.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starbook from 'starbook';

export default defineConfig({
  integrations: [
    starbook({
      locales: {
        // English docs in `src/content/docs/en/`
        en: {
          label: 'English',
        },
        // Simplified Chinese docs in `src/content/docs/zh/`
        zh: {
          label: '简体中文',
          lang: 'zh-CN',
        },
        // Arabic docs in `src/content/docs/ar/`
        ar: {
          label: 'العربية',
          dir: 'rtl',
        },
      },
    }),
  ],
});
```

#### Locale options

You can set the following options for each locale:

##### `label` (required)

**type:** `string`

The label for this language to show to users, for example in the language switcher. Most often you will want this to be the language’s name as a user of that language would expect to read it, e.g. `"English"`, `"العربية"`, or `"简体中文"`.

##### `lang`

**type:** `string`

The BCP-47 tag for this language, e.g. `"en"`, `"ar"`, or `"zh-CN"`. If not set, the language’s directory name will be used by default.

##### `dir`

**type:** `'ltr' | 'rtl'`

The writing direction of this language; `"ltr"` for left-to-right (the default) or `"rtl"` for right-to-left.

#### Root locale

You can serve the default language without a `/lang/` directory by setting a `root` locale:

```js
starbook({
  locales: {
    root: {
      label: 'English',
      lang: 'en',
    },
    fr: {
      label: 'Français',
    },
  },
});
```

For example, this allows you to serve `/getting-started/` as an English route and use `/fr/getting-started/` as the equivalent French page.
