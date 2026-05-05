---
'@astrojs/starlight': minor
---

Enables [the CSS property `text-autospace`](https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-autospace) in Chinese and Japanese documents.

The specification is mature enough to meet most requirements, though there could be edge cases where it causes issues. You can disable this until the specification and browser implementations are more stable.

If you would prefer to revert this change, you can add the following custom CSS to your site:

```css
[lang] {
	text-autospace: initial;
}
```