---
title: Overriding Components
description: Learn how to override Starlight’s built-in components to add custom elements to your documentation site’s UI.
---

Starlight’s default UI and configuration options are designed to be flexible and work for a range of content.
When you need to customize what’s possible out of the box, Starlight supports overriding its default components.

## When to override

Overriding Starlight’s default components can be useful when:

- You want to change how a part of Starlight’s UI looks in a way not possible with [custom CSS](/css-and-tailwind/).
- You want to change how a part of Starlight’s UI behaves.
- You want to add some additional UI alongside Starlight’s existing UI.

## How to override

1. Choose the Starlight component you want to override.
   You can find a full list of components in the [Overrides Reference](/reference/overrides/)

   This example will override Starlight’s [`SocialIcons`](/reference/overrides/#socialicons) component in the page nav bar.

2. Create an Astro component that will replace the Starlight component.
   This example renders a contact link.

   ```astro
   ---
   // src/components/EmailLink.astro
   import type { Props } from '@astrojs/starlight/props';
   ---

   <a href="mailto:houston@example.com">E-mail Me</a>
   ```

3. Tell Starlight to use your custom implementation in the [`components`](/reference/configuration/#components) configuration option in `astro.config.mjs`:

   ```js {9-12}
   // astro.config.mjs
   import { defineConfig } from 'astro/config';
   import starlight from '@astrojs/starlight';

   export default defineConfig({
     integrations: [
       starlight({
         title: 'My Docs with Overrides',
         components: {
           // Override the default `SocialLinks` component.
           SocialIcons: './src/components/EmailLink.astro',
         },
       }),
     ],
   });
   ```

## Extending a built-in component

You can add some UI to your site without completely replacing Starlight’s default UI by extending a built-in component.

To extend a built-in component, import and render it in your custom component. In this example, we render a custom e-mail link and then also render the default `SocialLinks` component:

```astro {4,8}
---
// src/components/EmailLink.astro
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/SocialIcons.astro';
---

<a href="mailto:houston@example.com">E-mail Me</a>
<Default {...Astro.props}><slot /></Default>
```

When rendering a built-in component:

- Spread `Astro.props` into it. This makes sure that it receives all the data it needs to render.
- Add a `<slot />` inside the component. This makes sure that if the component is passed any child elements, Astro knows where to render them.
