---
title: Configuration Reference
---

## Configure the `starbook` integration

You can pass the following options to the `starbook` integration.

### `title` (required)

**type:** `string`

Set the title for your website. Will be used in metadata and in the browser tab title.

### `description`

**type:** `string`

Set the description for your website. Used in metadata shared with search engines in the `<meta name="description">` tag if `description` is not set in a page’s frontmatter.

### `tableOfContents`

**type:** `{ minHeadingLevel?: number; maxHeadingLevel?: number; }`  
**default:** `{ minHeadingLevel: 2; maxHeadingLevel: 3; }`

Configure the table of contents shown on the right of each page. By default, `<h2>` and `<h3>` headings will be included in this table of contents.

### `editLink`

**type:** `{ baseUrl: string }`

Enable “Edit this page” links by setting the base URL these should use. The final link will be `editLink.baseUrl` + the current page path. For example, to enable editing pages in the `withastro/starbook` repo on GitHub:

```js
starbook({
  editLink: {
    baseUrl: 'https://github.com/withastro/starbook/edit/main/',
  },
});
```

With this config, a `/introduction` page would have an edit link pointing to `https://github.com/withastro/starbook/edit/main/src/docs/introduction.md`.

### `sidebar`

**type:** [`SidebarGroup[]`](#sidebargroup)

Configure your site’s sidebar navigation items.

A sidebar is an array of groups, each with a `label` for the group and either an `items` array or an `autogenerate` configuration object.

You can manually set the contents of a group using `items`, which is an array that can include links and subgroups. You can also automatically generate the contents of a group from a specific directory of your docs, using `autogenerate`.

```js
starbook({
  sidebar: [
    // A group labelled “Start Here” containing two links.
    {
      label: 'Start Here',
      items: [
        { label: 'Introduction', link: '/intro' },
        { label: 'Next Steps', link: '/next-steps' },
      ],
    },
    // A group linking to all pages in the reference directory.
    {
      label: 'Reference',
      autogenerate: {
        directory: 'reference',
      },
    },
  ],
});
```

#### `SidebarGroup`

```ts
type SidebarGroup =
  | {
      label: string;
      items: Array<LinkItem | SidebarGroup>;
    }
  | {
      label: string;
      autogenerate: {
        directory: string;
      };
    };
```

#### `LinkItem`

```ts
interface LinkItem {
  label: string;
  link: string;
}
```

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

### `social`

Optional details about the social media accounts for this site.

```js
starbook({
  social: {
    // Main Twitter handle for this site
    twitter: 'astrodotbuild',
  },
});
```

### `customCss`

Provide CSS files to customize the look and feel of StarBook.

Supports local CSS files relative to the root of your project, e.g. `'/src/custom.css'`, and CSS you installed as an npm module, e.g. `'@fontsource/roboto'`.

```js
starbook({
  customCss: ['/src/custom-styles.css', '@fontsource/roboto'],
});
```
