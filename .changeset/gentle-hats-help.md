---
'@astrojs/starlight': minor
---

Enables [the CSS property `text-autospace`](https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-autospace) in Chinese and Japanese documents.

If you would prefer to disable autospacing in Chinese and Japanese pages, you can add the following custom CSS to your site:

```css
[lang]:where(:lang(zh, ja)) {
	text-autospace: initial;
}
```
