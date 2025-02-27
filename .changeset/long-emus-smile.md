---
'@astrojs/starlight': minor
---

Adds the [`head`](https://starlight.astro.build/reference/route-data/#head) route data property which contains an array of all tags to include in the `<head>` of the current page.

Previously, the [`<Head>`](https://starlight.astro.build/reference/overrides/#head-1) component was responsible for generating a list of tags to include in the `<head>` of the current page and rendering them.
This data is now available as `Astro.locals.starlightRoute.head` instead and can be modified using [route data middleware](https://starlight.astro.build/guides/route-data/#customizing-route-data).
The `<Head>` component now only renders the tags provided in `Astro.locals.starlightRoute.head`.
