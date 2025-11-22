---
"@astrojs/starlight": minor
---

Changes text overflow styling in Markdown content

⚠️ **Potentially breaking change:** This release switches the [`overflow-wrap`](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-wrap) CSS style for common elements to `break-word`. In most cases, there should be little visual impact, but this change can impact how layouts with implicit sizing (such as tables) look, improving legibility in how words wrap.

If you want to preserve the previous styling, you can add the following [custom CSS](https://starlight.astro.build/guides/css-and-tailwind/#custom-css-styles) to your site:

```css
p, h1, h2, h3, h4, h5, h6, code {
  overflow-wrap: anywhere;
}
```
