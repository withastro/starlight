---
'@astrojs/starlight': minor
---

Adds Expressive Code as Starlight’s default code block renderer

⚠️ **Potentially breaking change:**
This addition changes how Markdown code blocks are rendered to use [Expressive Code](https://github.com/expressive-code/expressive-code/tree/main/packages/astro-expressive-code).
If you were already customizing how code blocks are rendered, you may wish to disable Expressive Code to preserve previous behavior:

```js
starlight({
  expressiveCode: false,
})
```

If you had previously added Expressive Code manually to your Starlight project, you can now remove the manual set-up in `astro.config.mjs`:

- Move your configuration to Starlight’s new `expressiveCode` option.
- Remove the `astro-expressive-code` integration.

For example:

```diff
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
- import expressiveCode from 'astro-expressive-code';

export default defineConfig({
  integrations: [
-   expressiveCode({
-     themes: ['rose-pine'],
-   }),
    starlight({
      title: 'My docs',
+     expressiveCode: {
+       themes: ['rose-pine'],
+     },
    }),
  ],
});
```

Note that the built-in Starlight version of Expressive Code sets some opinionated defaults that are different from the `astro-expressive-code` defaults. You may need to set some `styleOverrides` if you wish to keep styles exactly the same.
