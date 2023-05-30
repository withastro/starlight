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

### `template`

**type:** `'doc' | 'splash'`  
**default:** `'doc'`

Set the layout template for this page.
Pages use the `'doc'` layout by default.
Set to `'splash'` to use a wider layout without any sidebars designed for landing pages.

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
