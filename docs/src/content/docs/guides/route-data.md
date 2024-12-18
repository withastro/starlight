---
title: Route Data
description: Learn how Starlight’s page data model is used to render your pages and how you can customize it.
---

When Starlight renders a page in your documentation, it first creates a route data object to represent what is on that page.
This guide explains how route data is generated, how it is used, and how you can customize it to modify Starlight’s default behavior.

## What is route data?

Starlight route data is an object constructed for each page of your site by combining the following parts of your project:

1. The Starlight configuration in `astro.config.mjs`
2. The content and frontmatter of the current page

For example, the route data includes a `siteTitle` property with a value based on the [`title`](/reference/configuration/#title-required) option in your Starlight configuration and a `toc` property generated from headings in the content for the current page.

Some features can be configured both globally in the Starlight configuration and for a specific page in Markdown frontmatter.
In this case, values set for a specific page in frontmatter override the global or default value.
For example, route data includes a `pagination` object with links to the previous and next pages in the sidebar.
If a page disables one of these, for example by setting `prev: false` in frontmatter, this will be reflected in the `pagination` object.

See the [“Route Data Reference”](/reference/route-data/) for a full list of the available properties.

## How is route data used?

All of Starlight’s components have access to route data and use it to decide what to render for each page.
For example, the `siteTitle` string is used to display the site title and the `sidebar` array is used to render the global sidebar navigation.

Route data is available from the `Astro.locals.starlightRoute` global in Astro components:

```astro title="example.astro"
---
const { siteTitle } = Astro.locals.starlightRoute;
---

<p>The title of this site is “{siteTitle}”</p>
```

If you are building [component overrides](/overriding-components/), you can access route data like this to customize what you display.

## Customizing route data

Starlight’s route data works out of the box and does not require any configuration.
However, for advanced use cases, you may want to customize route data for some or all pages to modify how your site displays.

This is a similar concept to [component overrides](/overriding-components/), but instead of modifying how Starlight renders your data, you modify the data Starlight renders.

### When to customize route data

Customizing route data can be useful when you want to modify how Starlight processes your data in a way not possible with existing configuration options.

For example, you may want to filter sidebar items or customize titles for specific pages.
Changes like this do not require modifying Starlight’s default components, only the data passed to those components.

### How to customize route data

You can customize route data using a special form of “middleware”.
This is a function that is called every time Starlight renders a page and can modify values in the route data object.

1. Create a new file exporting an `onRequest` function using Starlight’s `defineRouteMiddleware()` utility:

   ```ts
   // src/routeData.ts
   import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

   export const onRequest = defineRouteMiddleware(() => {});
   ```

2. Tell Starlight where your route data middleware file is located in `astro.config.mjs`:

   ```js ins={9}
   // astro.config.mjs
   import { defineConfig } from 'astro/config';
   import starlight from '@astrojs/starlight';

   export default defineConfig({
     integrations: [
       starlight({
         title: 'My delightful docs site',
         routeMiddleware: './src/routeData.ts',
       }),
     ],
   });
   ```

3. Update your `onRequest` function to modify route data.

   The first argument middleware receive is [Astro’s `context` object](https://docs.astro.build/en/reference/api-reference/).
   This contains full information about the current page render, including the current URL and `locals`.

   In this example, we are going to make our docs more exciting by adding an exclamation mark to the end of every page’s title.

   ```ts
   // src/routeData.ts
   import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

   export const onRequest = defineRouteMiddleware((context) => {
     // Get the content collection entry for this page.
     const { entry } = context.locals.starlightRoute;
     // Update the title to add an exclamation mark.
     entry.data.title = entry.data.title + '!';
   });
   ```
