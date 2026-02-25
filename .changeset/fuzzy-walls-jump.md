---
'@astrojs/starlight': minor
---

Improves Starlight’s default body font stack to better support languages such as Chinese, Japanese, and Korean on Windows.
For most users there should be no visible change.

If you would prefer to keep the previous font stack, you can add the following custom CSS to your site:

```css
:root {
	--sl-font-system:
		ui-sans-serif, system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
		'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
}
```
