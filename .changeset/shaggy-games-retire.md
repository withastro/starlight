---
'@astrojs/starlight': minor
---

Removes Shiki `css-variables` theme fallback.

⚠️ **Breaking change:**

Previously, Starlight used to automatically provide a fallback theme for Shiki, the default syntax highlighter built into Astro if the configured Shiki theme was not `github-dark`.

This fallback was only relevant when the default Starlight code block renderer, Expressive Code, was disabled and Shiki was used. Starlight no longer provides this fallback.

If you were relying on this behavior, you now manually need to update your Astro configuration to use the Shiki `css-variables` theme to match the previous behavior.

```diff
import { defineConfig } from 'astro/config';

export default defineConfig({
+ markdown: {
+   shikiConfig: {
+     theme: 'css-variables',
+   },
+ },
});
```

Additionally, you can use [custom CSS](https://starlight.astro.build/guides/css-and-tailwind/#custom-css-styles) to control the appearance of the code blocks. Here is the previously used CSS variables for the fallback theme:

```css
:root {
  --astro-code-foreground: var(--sl-color-white);
  --astro-code-background: var(--sl-color-gray-6);
  --astro-code-token-constant: var(--sl-color-blue-high);
  --astro-code-token-string: var(--sl-color-green-high);
  --astro-code-token-comment: var(--sl-color-gray-2);
  --astro-code-token-keyword: var(--sl-color-purple-high);
  --astro-code-token-parameter: var(--sl-color-red-high);
  --astro-code-token-function: var(--sl-color-red-high);
  --astro-code-token-string-expression: var(--sl-color-green-high);
  --astro-code-token-punctuation: var(--sl-color-gray-2);
  --astro-code-token-link: var(--sl-color-blue-high);
}
```
