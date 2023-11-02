---
title: Overriding Components
description: Learn how to override Starlight’s built-in components to add custom elements to your documentation site’s UI.
sidebar:
  badge: New
---

Starlight’s default UI and configuration options are designed to be flexible and work for a range of content. Much of Starlight's default appearance can be customized with [CSS](/guides/css-and-tailwind/) and [configuration options](/guides/customization/).

When you need more than what’s possible out of the box, Starlight supports building your own custom components to extend or override (completely replace) its default components.

## When to override

Overriding Starlight’s default components can be useful when:

- You want to change how a part of Starlight’s UI looks in a way not possible with [custom CSS](/guides/css-and-tailwind/).
- You want to change how a part of Starlight’s UI behaves.
- You want to add some additional UI alongside Starlight’s existing UI.

## How to override

1. Choose the Starlight component you want to override.
   You can find a full list of components in the [Overrides Reference](/reference/overrides/).

   This example will override Starlight’s [`SocialIcons`](/reference/overrides/#socialicons) component in the page nav bar.

2. Create an Astro component to replace the Starlight component with.
   This example renders a contact link.

   ```astro
   ---
   // src/components/EmailLink.astro
   import type { Props } from '@astrojs/starlight/props';
   ---

   <a href="mailto:houston@example.com">E-mail Me</a>
   ```

3. Tell Starlight to use your custom component in the [`components`](/reference/configuration/#components) configuration option in `astro.config.mjs`:

   ```js {9-12}
   // astro.config.mjs
   import { defineConfig } from 'astro/config';
   import starlight from '@astrojs/starlight';

   export default defineConfig({
     integrations: [
       starlight({
         title: 'My Docs with Overrides',
         components: {
           // Override the default `SocialIcons` component.
           SocialIcons: './src/components/EmailLink.astro',
         },
       }),
     ],
   });
   ```

## Reuse a built-in component

You can build with Starlight’s default UI components just as you would with your own: importing and rendering them in your own custom components. This allows you to keep all of Starlight's basic UI within your design, while adding extra UI alongside them.

The example below shows a custom component that renders an e-mail link along with the default `SocialIcons` component:

```astro {4,8}
---
// src/components/EmailLink.astro
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/SocialIcons.astro';
---

<a href="mailto:houston@example.com">E-mail Me</a>
<Default {...Astro.props}><slot /></Default>
```

When rendering a built-in component inside a custom component:

- Spread `Astro.props` into it. This makes sure that it receives all the data it needs to render.
- Add a [`<slot />`](https://docs.astro.build/en/core-concepts/astro-components/#slots) inside the default component. This makes sure that if the component is passed any child elements, Astro knows where to render them.

## Use page data

When overriding a Starlight component, your custom implementation receives a standard `Astro.props` object containing all the data for the current page.
This allows you to use these values to control how your component template renders.

For example, you can read the page’s frontmatter values as `Astro.props.entry.data`. In the following example, a replacement [`PageTitle`](/reference/overrides/#pagetitle) component uses this to display the current page’s title:

```astro {5} "{title}"
---
// src/components/Title.astro
import type { Props } from '@astrojs/starlight/props';

const { title } = Astro.props.entry.data;
---

<h1 id="_top">{title}</h1>

<style>
  h1 {
    font-family: 'Comic Sans';
  }
</style>
```

Learn more about all the available props in the [Overrides Reference](/reference/overrides/#component-props).

### Only override on specific pages

Component overrides apply to all pages. However, you can conditionally render using values from `Astro.props` to determine when to show your custom UI, when to show Starlight’s default UI, or even when to show something entirely different.

In the following example, a component overriding Starlight's [`Footer`](/reference/overrides/#footer-1) displays "Built with Starlight 🌟" on the homepage only, and otherwise shows the default footer on all other pages:

```astro
---
// src/components/ConditionalFooter.astro
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/Footer.astro';

const isHomepage = Astro.props.slug === '';
---

{
  isHomepage ? (
    <footer>Built with Starlight 🌟</footer>
  ) : (
    <Default {...Astro.props}>
      <slot />
    </Default>
  )
}
```

Learn more about conditional rendering in [Astro’s Template Syntax guide](https://docs.astro.build/en/core-concepts/astro-syntax/#dynamic-html).
