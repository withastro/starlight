---
'@astrojs/starlight': minor
---

For improved compatibility with Tailwind, some Starlight built-in class names are now prefixed with `"sl-"`.

While not likely, if you were relying on one of these internal class names in your own components or custom CSS, you will need to update to use the prefixed version.

- **Before:** `flex`, `md:flex`, `lg:flex`, `block`, `md:block`, `lg:block`, `hidden`, `md:hidden`, `lg:hidden`.
- **After:** `sl-flex`, `md:sl-flex`, `lg:sl-flex`, `sl-block`, `md:sl-block`, `lg:sl-block`, `sl-hidden`, `md:sl-hidden`, `lg:sl-hidden`.
