---
'@astrojs/starlight': minor
---

Adds support for Astro 6.4 and the new Sätteri Markdown processor.

It is now possible to opt-into using [Astro's 6.4 Sätteri Markdown processor](https://astro.build/blog/astro-640/#faster-markdown-builds-with-s%C3%A4tteri) by installing the `@astrojs/markdown-satteri` package and configuring it in your `astro.config.mjs` file:

```js
// astro.config.mjs

import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';

export default defineConfig({
  markdown: {
    processor: satteri(),
  },
});
