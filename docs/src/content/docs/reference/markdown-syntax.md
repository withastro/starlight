---
title: Markdown Syntax
---

StarBook supports the full range of Markdown syntax.

## Inline styles

Text can be **bold**, _italic_, or ~~strikethrough~~.

```md
Text can be **bold**, _italic_, or ~~strikethrough~~.
```

You can [link to another page](/getting-started.md).

```md
You can [link to another page](/getting-started.md).
```

You can highlight `inline code` with backticks.

```md
You can highlight `inline code` with backticks.
```

## Headings

You can structure content using a heading. Headings in Markdown are indicated by a number of `#` at the start of the line. Although it is supported, you should should generally avoid top-level headings and start on-page headings from `<h2>` and down.

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

```md
## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6
```

## Asides

Asides (also known as “admonitions” or “callouts”) are useful for displaying secondary information alongside a page’s main content.

StarBook provides a custom Markdown syntax for rendering asides. Aside blocks are indicated using a triple colon `:::` and can be of type `note`, `tip`, `caution` or `danger`.

You can nest any other Markdown content types inside an aside, but asides are best suited to short and concise chunks of content.

### Note aside

:::note
StarBook is a documentation website toolkit built with [Astro](https://astro.build/). You can get started with this command:

```sh
npm run create astro@latest --template starbook
```

:::

````md
:::note
StarBook is a documentation website toolkit built with [Astro](https://astro.build/). You can get started with this command:

```sh
npm run create astro@latest --template starbook
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
If you are not sure you want an awesome docs site, think twice before using [StarBook](../../).
:::

:::danger
Your users may be more productive and find your product easier to use thanks to helpful StarBook features.

- Clear navigation
- User-configurable colour theme
- [i18n support](./guides/i18n)

:::

```md
:::caution
If you are not sure you want an awesome docs site, think twice before using [StarBook](../../).
:::

:::danger
Your users may be more productive and find your product easier to use thanks to helpful StarBook features.

- Clear navigation
- User-configurable colour theme
- [i18n support](./guides/i18n)

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

## Lists

Markdown supports unordered lists (often call “bullet” lists) and ordered lists, which are numbered sequentially.

### Here is an unordered list:

- Item foo
- Item bar
- Item baz

### And an ordered list:

1.  Item one
1.  Item two
1.  Item three

### And an ordered list, continued:

1.  Item one
1.  Item two

Some text

3.  Item three
1.  Item four

### And an ordered list starting from 42:

42. Item 42
1.  Item 43
1.  Item 44

### And a nested list:

- level 1 item
  - level 2 item
  - level 2 item
    - level 3 item
    - level 3 item
- level 1 item
  - level 2 item
  - level 2 item
  - level 2 item
- level 1 item
  - level 2 item
  - level 2 item
- level 1 item

### Nesting an ol in ul in an ol

- level 1 item (ul)
  1. level 2 item (ol)
  1. level 2 item (ol)
     - level 3 item (ul)
     - level 3 item (ul)
- level 1 item (ul)
  1. level 2 item (ol)
  1. level 2 item (ol)
     - level 3 item (ul)
     - level 3 item (ul)
       1. level 4 item (ol)
       1. level 4 item (ol)
     - level 3 item (ul)
     - level 3 item (ul)
- level 1 item (ul)

### And a task list

- [ ] Hello, this is a TODO item
- [ ] Hello, this is another TODO item
- [x] Goodbye, this item is done

### Nesting task lists

- [ ] level 1 item (task)
  - [ ] level 2 item (task)
  - [ ] level 2 item (task)
- [ ] level 1 item (task)
- [ ] level 1 item (task)

### Nesting a ul in a task list

- [ ] level 1 item (task)
  - level 2 item (ul)
  - level 2 item (ul)
- [ ] level 1 item (task)
- [ ] level 1 item (task)

### Nesting a task list in a ul

- level 1 item (ul)
  - [ ] level 2 item (task)
  - [ ] level 2 item (task)
- level 1 item (ul)
- level 1 item (ul)

### Nesting mixed content in lists

- This list contains code samples

  ```js
  console.log('hi');
  ```

- And **other** content such as images:
  ![VuePress logo](https://raw.githubusercontent.com/withastro/docs/main/public/logos/vuepress.png)

- or blockquotes

  > to dent

- But inline styling like **bold**, _italic_, `code`, or ~~strikethrough~~, do not change vertical spacing.

- Right?

## Tables

Markdown tables support horizontal alignment.

| head1        |     head two      | three |
| :----------- | :---------------: | ----: |
| ok           | good swedish fish |  nice |
| out of stock |  good and plenty  |  nice |
| ok           |   good `oreos`    |   hmm |
| ok           | good `zoute` drop |  yumm |

```md
| head1        |     head two      | three |
| :----------- | :---------------: | ----: |
| ok           | good swedish fish |  nice |
| out of stock |  good and plenty  |  nice |
| ok           |   good `oreos`    |   hmm |
| ok           | good `zoute` drop |  yumm |
```

## Horizontal rules

Markdown supports rendering a horizontal rule (an `<hr>` element) with a triple-dash syntax: `---`.

---

```md
---
```

## Definition lists

While Markdown doesn’t provide a custom syntax for definition lists, you can still write them using the standard HTML `<dl>`, `<dt>`, and `<dd>` elements:

<dl>
  <dt>Name</dt>
  <dd>Godzilla</dd>
  <dt>Born</dt>
  <dd>1952</dd>
  <dt>Term 1</dt>
  <dt>Term 2</dt>
  <dd>First description of Term1 and Term2, possibly more than one line</dd>
  <dd>Second description of Term1 and Term2, possibly more than one line</dd>
</dl>

## Images

### Small image

![VuePress logo](https://raw.githubusercontent.com/withastro/docs/main/public/logos/vuepress.png)

```md
![VuePress logo](https://raw.githubusercontent.com/withastro/docs/main/public/logos/vuepress.png)
```

### Large image

![An illustration of planets and stars featuring the word “astro”](https://raw.githubusercontent.com/withastro/docs/main/public/default-og-image.png)

```md
![An illustration of planets and stars featuring the word “astro”](https://raw.githubusercontent.com/withastro/docs/main/public/default-og-image.png)
```

## Miscellaneous markup tests

### Long links test

[This is a very long link which wraps and therefore doesn't overflow
even when it comes at the beginning](.) of the line.

- [This is a very long link which wraps and therefore doesn't overflow the line
  when used first in an item ](.) in a list.

### Supercalifragilisticexpialidocious!

Making sure that this heading with a very long word in wraps instead of overflowing on small screens.

### YouTube embed

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/6F-lQe_BzeM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
