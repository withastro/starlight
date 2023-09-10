---
title: Frontmatter Reference
description: An overview of the default frontmatter fields Starlight supports.
---

You can customize individual Markdown and MDX pages in Starlight by setting values in their frontmatter. For example, a regular page might set `title` and `description` fields:

```md
---
title: About this project
description: Learn more about the project I’m working on.
---

Welcome to the about page!
```

## Frontmatter fields

### `title` (required)

**type:** `string`

You must provide a title for every page. This will be displayed at the top of the page, in browser tabs, and in page metadata.

### `description`

**type:** `string`

The page description is used for page metadata and will be picked up by search engines and in social media previews.

### `editUrl`

**type:** `string | boolean`

Overrides the [global `editLink` config](/reference/configuration/#editlink). Set to `false` to disable the “Edit page” link for a specific page or provide an alternative URL where the content of this page is editable.

### `head`

**type:** [`HeadConfig[]`](/reference/configuration/#headconfig)

You can add additional tags to your page’s `<head>` using the `head` frontmatter field. This means you can add custom styles, metadata or other tags to a single page. Similar to the [global `head` option](/reference/configuration/#head).

```md
---
title: About us
head:
  # Use a custom <title> tag
  - tag: title
    content: Custom about title
---
```

### `tableOfContents`

**type:** `false | { minHeadingLevel?: number; maxHeadingLevel?: number; }`

Overrides the [global `tableOfContents` config](/reference/configuration/#tableofcontents).
Customize the heading levels to be included or set to `false` to hide the table of contents on this page.

```md
---
title: Page with only H2s in the table of contents
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 2
---
```

```md
---
title: Page with no table of contents
tableOfContents: false
---
```

### `template`

**type:** `'doc' | 'splash'`  
**default:** `'doc'`

Set the layout template for this page.
Pages use the `'doc'` layout by default.
Set to `'splash'` to use a wider layout without any sidebars designed for landing pages.

### `hero`

**type:** [`HeroConfig`](#heroconfig)

Add a hero component to the top of this page. Works well with `template: splash`.

For example, this config shows some common options, including loading an image from your repository.

```md
---
title: My Home Page
template: splash
hero:
  title: 'My Project: Stellar Stuff Sooner'
  tagline: Take your stuff to the moon and back in the blink of an eye.
  image:
    alt: A glittering, brightly colored logo
    file: ../../assets/logo.png
  actions:
    - text: Tell me more
      link: /getting-started/
      icon: right-arrow
      variant: primary
    - text: View on GitHub
      link: https://github.com/astronaut/my-project
      icon: external
---
```

#### `HeroConfig`

```ts
interface HeroConfig {
  title?: string;
  tagline?: string;
  image?: {
    alt?: string;
    // Relative path to an image in your repository.
    file?: string;
    // Raw HTML to use in the image slot.
    // Could be a custom `<img>` tag or inline `<svg>`.
    html?: string;
  };
  actions?: Array<{
    text: string;
    link: string;
    variant: 'primary' | 'secondary' | 'minimal';
    icon: string;
  }>;
}
```

### `banner`

**type:** `{ content: string }`

Displays an announcement banner at the top of this page.

The `content` value can include HTML for links or other content.
For example, this page displays a banner including a link to `example.com`.

```md
---
title: Page with a banner
banner:
  content: |
    We just launched something cool!
    <a href="https://example.com">Check it out</a>
---
```

### `lastUpdated`

**type:** `Date | boolean`

Overrides the [global `lastUpdated` option](/reference/configuration/#lastupdated). If a date is specified, it must be a valid [YAML timestamp](https://yaml.org/type/timestamp.html) and will override the date stored in Git history for this page.

```md
---
title: Page with a custom last update date
lastUpdated: 2022-08-09
---
```

### `prev`

**type:** `boolean | string | { link?: string; label?: string }`

Overrides the [global `pagination` option](/reference/configuration/#pagination). If a string is specified, the generated link text will be replaced and if an object is specified, both the link and the text will be overridden.

```md
---
# Hide the previous page link
prev: false
---
```

```md
---
# Override the previous page link text
prev: Continue the tutorial
---
```

```md
---
# Override both the previous page link and text
prev:
  link: /unrelated-page/
  label: Check out this other page
---
```

### `next`

**type:** `boolean | string | { link?: string; label?: string }`

Same as [`prev`](#prev) but for the next page link.

```md
---
# Hide the next page link
next: false
---
```

### `pagefind`

**type:** `boolean`  
**default:** `true`

Set whether this page should be included in the [Pagefind](https://pagefind.app/) search index. Set to `false` to exclude a page from search results:

```md
---
# Hide this page from the search index
pagefind: false
---
```

### `sidebar`

**type:** `{ label?: string; order?: number; hidden?: boolean; badge?: string | BadgeConfig }`

Control how this page is displayed in the [sidebar](/reference/configuration/#sidebar), when using an autogenerated link group.

#### `label`

**type:** `string`  
**default:** the page [`title`](#title-required)

Set the label for this page in the sidebar when displayed in an autogenerated group of links.

```md
---
title: About this project
sidebar:
  label: About
---
```

#### `order`

**type:** `number`

Control the order of this page when sorting an autogenerated group of links.
Lower numbers are displayed higher up in the link group.

```md
---
title: Page to display first
sidebar:
  order: 1
---
```

#### `hidden`

**type:** `boolean`  
**default:** `false`

Prevents this page from being included in an autogenerated sidebar group.

```md
---
title: Page to hide from autogenerated sidebar
sidebar:
  hidden: true
---
```

#### `badge`

**type:** <code>string | <a href="/reference/configuration/#badgeconfig">BadgeConfig</a></code>

Add a badge to the page in the sidebar when displayed in an autogenerated group of links.
When using a string, the badge will be displayed with a default accent color.
Optionally, pass a [`BadgeConfig` object](/reference/configuration/#badgeconfig) with `text` and `variant` fields to customize the badge.

```md
---
title: Page with a badge
sidebar:
  # Uses the default variant matching your site’s accent color
  badge: New
---
```

```md
---
title: Page with a badge
sidebar:
  badge:
    text: Experimental
    variant: caution
---
```
