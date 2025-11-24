---
'@astrojs/starlight': minor
---

Updates the default sans-serif system font stack, dropping support for the `-apple-system` and `BlinkMacSystemFont` font names used in older browsers. These are no longer needed in [browsers officially supported by Starlight](https://browsersl.ist/#q=%3E+0.5%25%2C+not+dead%2C+Chrome+%3E%3D+105%2C+Edge+%3E%3D+105%2C+Firefox+%3E%3D+121%2C+Safari+%3E%3D+15.4%2C+iOS+%3E%3D+15.4%2C+not+op_mini+all).

If you still need to support older browsers, you can add the following custom CSS to your site:

```css
:root {
	--sl-font-system: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
}
```