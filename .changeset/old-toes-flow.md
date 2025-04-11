---
'@astrojs/starlight-tailwind': major
---

Adds support for Tailwind v4, drops support for Tailwind v3.

⚠️ **BREAKING CHANGE:** Tailwind v3 is no longer supported. Tailwind v4 support in Astro is now provided using a Vite plugin and the Astro Tailwind integration is no longer required.

1. **Remove the Astro Tailwind integration.** The Astro Tailwind integration is no longer required with Tailwind v4.

   ```diff
    // astro.config.mjs
    import { defineConfig } from "astro/config";
    import starlight from "@astrojs/starlight";
   -import tailwind from "@astrojs/tailwind";

    export default defineConfig({
      integrations: [
        starlight({
          title: "Docs with Tailwind",
          customCss: ["./src/tailwind.css"],
        }),
   -    tailwind({ applyBaseStyles: false }),
      ],
    });
   ```

1. **Install Tailwind v4.** Install the latest version of the `tailwindcss` and `@tailwindcss/vite` packages.

   In Astro `>=5.2.0`, use the `astro add tailwind` command to install and configure both packages:

   ```sh
   npx astro add tailwind
   ```

   For earlier versions of Astro, follow the steps below to install and configure Tailwind v4:

   1. Install the packages manually using your package manager, for example using npm:

      ```sh
      npm install tailwindcss @tailwindcss/vite
      ```

   1. Add the `@tailwindcss/vite` plugin to your Vite plugins configuration in your Astro config file.

      ```diff
       // astro.config.mjs
       import { defineConfig } from "astro/config";
       import starlight from "@astrojs/starlight";
      +import tailwindcss from "@tailwindcss/vite";
   
       export default defineConfig({
         integrations: [
           starlight({
             title: "Docs with Tailwind",
             customCss: ["./src/tailwind.css"],
           }),
         ],
      +  vite: {
      +    plugins: [tailwindcss()],
      +  },
       });
      ```
  
1. **Update Tailwind base styles.** Tailwind CSS base styles needs to be updated for Tailwind v4 and also to use Starlight Tailwind CSS.

   ```diff
   /* src/tailwind.css */
   -@tailwind base;
   -@tailwind components;
   -@tailwind utilities;
   +@layer base, starlight.base, starlight.reset, starlight.core, starlight.content, starlight.components, starlight.utils, theme, components, utilities;
   +
   +@import '@astrojs/starlight-tailwind';
   +@import 'tailwindcss/theme.css' layer(theme);
   +@import 'tailwindcss/utilities.css' layer(utilities);
   +
   +@theme {
   +	/* Your preferred accent color. Indigo is closest to Starlight’s defaults. */
   +	--color-accent-50: var(--color-indigo-50);
   +	--color-accent-100: var(--color-indigo-100);
   +	--color-accent-200: var(--color-indigo-200);
   +	--color-accent-300: var(--color-indigo-300);
   +	--color-accent-400: var(--color-indigo-400);
   +	--color-accent-500: var(--color-indigo-500);
   +	--color-accent-600: var(--color-indigo-600);
   +	--color-accent-700: var(--color-indigo-700);
   +	--color-accent-800: var(--color-indigo-800);
   +	--color-accent-900: var(--color-indigo-900);
   +	--color-accent-950: var(--color-indigo-950);
   +	/* Your preferred gray scale. Zinc is closest to Starlight’s defaults. */
   +	--color-gray-50: var(--color-zinc-50);
   +	--color-gray-100: var(--color-zinc-100);
   +	--color-gray-200: var(--color-zinc-200);
   +	--color-gray-300: var(--color-zinc-300);
   +	--color-gray-400: var(--color-zinc-400);
   +	--color-gray-500: var(--color-zinc-500);
   +	--color-gray-600: var(--color-zinc-600);
   +	--color-gray-700: var(--color-zinc-700);
   +	--color-gray-800: var(--color-zinc-800);
   +	--color-gray-900: var(--color-zinc-900);
   +	--color-gray-950: var(--color-zinc-950);
   +}
   +
   +/*
   +Add additional Tailwind styles to this file:
   +https://tailwindcss.com/docs/adding-custom-styles#using-custom-css
   +*/
   ```

If you previously [customized your Tailwind theme configuration](https://starlight.astro.build/guides/css-and-tailwind/#styling-starlight-with-tailwind) in the `tailwind.config.mjs` file, such customizations are now defined through CSS using the `@theme` block in your Tailwind base styles.

1. Locate existing customizations in your `tailwind.config.mjs` file. The following example defines customizations for the accent colors, gray scale, and font families used by Starlight:

   ```js
   // tailwind.config.mjs
   import starlightPlugin from '@astrojs/starlight-tailwind';
   import colors from 'tailwindcss/colors';
   
   /** @type {import('tailwindcss').Config} */
   export default {
     content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
     theme: {
       extend: {
         colors: {
           // Custom accent colors.
           accent: colors.fuchsia,
           // Custom gray scale.
           gray: colors.slate,
         },
         fontFamily: {
           // Custom text font.
           sans: ['"Atkinson Hyperlegible"'],
           // Custom code font.
           mono: ['"IBM Plex Mono"'],
         },
       },
     },
     plugins: [starlightPlugin()],
   };
   ```

1. The above customizations can be migrated to the new `@theme` block in the file containing your Tailwind base styles as follows:

   ```css
   /* src/tailwind.css */
   @layer base, starlight.base, starlight.reset, starlight.core, starlight.content, starlight.components, starlight.utils, theme, components, utilities;
   
   @import '@astrojs/starlight-tailwind';
   @import 'tailwindcss/theme.css' layer(theme);
   @import 'tailwindcss/utilities.css' layer(utilities);
   
   @theme {
   	/* Custom accent colors. */
   	--color-accent-50: var(--color-fuchsia-50);
   	--color-accent-100: var(--color-fuchsia-100);
   	--color-accent-200: var(--color-fuchsia-200);
   	--color-accent-300: var(--color-fuchsia-300);
   	--color-accent-400: var(--color-fuchsia-400);
   	--color-accent-500: var(--color-fuchsia-500);
   	--color-accent-600: var(--color-fuchsia-600);
   	--color-accent-700: var(--color-fuchsia-700);
   	--color-accent-800: var(--color-fuchsia-800);
   	--color-accent-900: var(--color-fuchsia-900);
   	--color-accent-950: var(--color-fuchsia-950);
   	/* Custom gray scale. */
   	--color-gray-50: var(--color-slate-50);
   	--color-gray-100: var(--color-slate-100);
   	--color-gray-200: var(--color-slate-200);
   	--color-gray-300: var(--color-slate-300);
   	--color-gray-400: var(--color-slate-400);
   	--color-gray-500: var(--color-slate-500);
   	--color-gray-600: var(--color-slate-600);
   	--color-gray-700: var(--color-slate-700);
   	--color-gray-800: var(--color-slate-800);
   	--color-gray-900: var(--color-slate-900);
   	--color-gray-950: var(--color-slate-950);
    /* Custom text font. */
    --sl-font: 'Atkinson Hyperlegible';
    /* Custom code font. */
    --sl-font-mono: 'IBM Plex Mono';
   }
   ```

We recommend checking your site’s appearance when upgrading to make sure there are no style regressions caused by this change.
