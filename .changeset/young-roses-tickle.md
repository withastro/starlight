---
'@astrojs/starlight': minor
---

Updates the table of contents highlighting styles to prevent UI shifts when scrolling through a page.

If you want to preserve the previous, buggy styling, you can add the following custom CSS to your site:

```css
starlight-toc a[aria-current='true'],
starlight-toc a[aria-current='true']:hover,
starlight-toc a[aria-current='true']:focus {
	font-weight: 600;
	color: var(--sl-color-text-invert);
	background-color: var(--sl-color-text-accent);
}
```
