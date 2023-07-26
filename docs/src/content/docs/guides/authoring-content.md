---
title: Authoring Content in Markdown
description: An overview of the Markdown syntax Starlight supports.
---

Starlight supports the full range of [Markdown](https://daringfireball.net/projects/markdown/) syntax in `.md` files as well as frontmatter [YAML](https://dev.to/paulasantamaria/introduction-to-yaml-125f) to define metadata such as a title and description.

Please be sure to check the [MDX docs](https://mdxjs.com/docs/what-is-mdx/#markdown) or [Markdoc docs](https://markdoc.dev/docs/syntax) if using those file formats, as Markdown support and usage can differ.

## Inline styles

Text can be **bold**, _italic_, or ~~strikethrough~~.

```md
Text can be **bold**, _italic_, or ~~strikethrough~~.
```

You can [link to another page](/getting-started/).

```md
You can [link to another page](/getting-started/).
```

You can highlight `inline code` with backticks.

```md
You can highlight `inline code` with backticks.
```

## Images

Images in Starlight use [Astro’s built-in optimized asset support](https://docs.astro.build/en/guides/assets/).

Markdown and MDX support the Markdown syntax for displaying images that includes alt-text for screen readers and assistive technology.

![An illustration of planets and stars featuring the word “astro”](https://raw.githubusercontent.com/withastro/docs/main/public/default-og-image.png)

```md
![An illustration of planets and stars featuring the word “astro”](https://raw.githubusercontent.com/withastro/docs/main/public/default-og-image.png)
```

Relative image paths are also supported for images stored locally in your project.

```md
// src/content/docs/page-1.md

![A rocketship in space](../../assets/images/rocket.svg)
```

## Headings

You can structure content using a heading. Headings in Markdown are indicated by a number of `#` at the start of the line.

### How to structure page content in Starlight

Starlight is configured to automatically use your page title as a top-level heading and will include an "Overview" heading at top of each page's table of contents. We recommend starting each page with regular paragraph text content and using on-page headings from `<h2>` and down:

```md
---
title: Markdown Guide
description: How to use Markdown in Starlight
---

This page describes how to use Markdown in Starlight.

## Inline Styles

## Headings
```

### Automatic heading anchor links

Using headings in Markdown will automatically give you anchor links so you can link directly to certain sections of your page:

```md
---
title: My page of content
description: How to use Starlight's built-in anchor links
---

## Introduction

I can link to [my conclusion](#conclusion) lower on the same page.

## Conclusion

`https://my-site.com/page1/#introduction` navigates directly to my Introduction.
```

Level 2 (`<h2>`) and Level 3 (`<h3>`) headings will automatically appear in the page table of contents.

## Asides

Asides (also known as “admonitions” or “callouts”) are useful for displaying secondary information alongside a page’s main content.

Starlight provides a custom Markdown syntax for rendering asides. Aside blocks are indicated using a pair of triple colons `:::` to wrap your content, and can be of type `note`, `tip`, `caution` or `danger`.

You can nest any other Markdown content types inside an aside, but asides are best suited to short and concise chunks of content.

### Note aside

:::note
Starlight is a documentation website toolkit built with [Astro](https://astro.build/). You can get started with this command:

```sh
npm create astro@latest -- --template starlight
```

:::

````md
:::note
Starlight is a documentation website toolkit built with [Astro](https://astro.build/). You can get started with this command:

```sh
npm create astro@latest -- --template starlight
```

:::
````

### Custom aside titles

You can specify a custom title for the aside in square brackets following the aside type, e.g. `:::tip[Did you know?]`.

:::tip[Did you know?]
Astro helps you build faster websites with [“Islands Architecture”](https://docs.astro.build/en/concepts/islands/).
:::

```md
:::tip[Did you know?]
Astro helps you build faster websites with [“Islands Architecture”](https://docs.astro.build/en/concepts/islands/).
:::
```

### More aside types

Caution and danger asides are helpful for drawing a user’s attention to details that may trip them up.
If you find yourself using these a lot, it may also be a sign that the thing you are documenting could benefit from being redesigned.

:::caution
If you are not sure you want an awesome docs site, think twice before using [Starlight](../../).
:::

:::danger
Your users may be more productive and find your product easier to use thanks to helpful Starlight features.

- Clear navigation
- User-configurable colour theme
- [i18n support](/guides/i18n)

:::

```md
:::caution
If you are not sure you want an awesome docs site, think twice before using [Starlight](../../).
:::

:::danger
Your users may be more productive and find your product easier to use thanks to helpful Starlight features.

- Clear navigation
- User-configurable colour theme
- [i18n support](/guides/i18n)

:::
```

## Blockquotes

> This is a blockquote, which is commonly used when quoting another person or document.
>
> Blockquotes are indicated by a `>` at the start of each line.

```md
> This is a blockquote, which is commonly used when quoting another person or document.
>
> Blockquotes are indicated by a `>` at the start of each line.
```

## Code blocks

A code block is indicated by a block with three backticks <code>```</code> at the start and end. You can indicate the programming language being used after the opening backticks.

```js
// Javascript code with syntax highlighting.
var fun = function lang(l) {
  dateformat.i18n = require('./lang/' + l);
  return true;
};
```

````md
```js
// Javascript code with syntax highlighting.
var fun = function lang(l) {
  dateformat.i18n = require('./lang/' + l);
  return true;
};
```
````

```md
Long, single-line code blocks should not wrap. They should horizontally scroll if they are too long. This line should be long enough to demonstrate this.
```

## Other common Markdown features

Starlight supports all other Markdown authoring syntax, such as lists and tables. See the [Markdown Cheat Sheet from The Markdown Guide](https://www.markdownguide.org/cheat-sheet/) for a quick overview of all the Markdown syntax elements.
