---
'@astrojs/starlight': minor
---

Fixes the outline style of sidebar badges when using Tailwind CSS.

This involves changing the name of an internal CSS class name to avoid a collision with Tailwind CSS utility classes.
If you were relying on the previous (`.outline`) class name for custom styling, you will need to update your custom CSS to use the new class name (`.sl-outline`).
