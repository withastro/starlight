---
'@astrojs/starlight': minor
---

Tweaks vertical spacing in Markdown content styles.

This is a subtle change to Starlight’s default content styling that should improve most sites:
- Default vertical spacing between content items is reduced from `1.5rem` to `1rem`.
- Spacing before headings is now relative to font size, meaning higher-level headings have slightly more spacing and lower-level headings slightly less.

The overall impact is to tighten up content that belongs together and improve the visual hierarchy of headings to break up sections.

Although this is a subtle change, we recommend visually inspecting your site in case this impacts layout of any custom CSS or components.

If you want to preserve the previous spacing, you can add the following custom CSS to your site:

```css
/* Restore vertical spacing to match Starlight v0.15 and below. */
.sl-markdown-content
	:not(a, strong, em, del, span, input, code)
	+ :not(a, strong, em, del, span, input, code, :where(.not-content *)) {
	margin-top: 1.5rem;
}
.sl-markdown-content
	:not(h1, h2, h3, h4, h5, h6)
	+ :is(h1, h2, h3, h4, h5, h6):not(:where(.not-content *)) {
	margin-top: 2.5rem;
}
```
