# @astrojs/starlight-tailwind

## 4.0.1

### Patch Changes

- [#3132](https://github.com/withastro/starlight/pull/3132) [`5959919`](https://github.com/withastro/starlight/commit/595991952be1a76cdf54f457c6e4d23b3f2ffec7) Thanks [@HiDeoo](https://github.com/HiDeoo)! - Fixes an issue where all border styles were not reset by the Starlight’s Tailwind compatibility package like in [Tailwind base styles](https://tailwindcss.com/docs/preflight#border-styles-are-reset).

## 4.0.0

### Major Changes

- [#2322](https://github.com/withastro/starlight/pull/2322) [`f14eb0c`](https://github.com/withastro/starlight/commit/f14eb0cd7baa0391d6124379f6c5df4b9ab7cc44) Thanks [@HiDeoo](https://github.com/HiDeoo)! - ⚠️ **BREAKING CHANGE:** The minimum supported version of Starlight is now 0.34.0

  Please use the `@astrojs/upgrade` command to upgrade your project:

  ```sh
  npx @astrojs/upgrade
  ```

- [#2322](https://github.com/withastro/starlight/pull/2322) [`f14eb0c`](https://github.com/withastro/starlight/commit/f14eb0cd7baa0391d6124379f6c5df4b9ab7cc44) Thanks [@HiDeoo](https://github.com/HiDeoo)! - Adds support for Tailwind v4, drops support for Tailwind v3.

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

     Use the `astro add tailwind` command to install and configure both packages:

     ```sh
     npx astro add tailwind
     ```

  1. **Update Tailwind base styles.** Tailwind CSS base styles needs to be updated for Tailwind v4 and also to use Starlight Tailwind CSS.

     ```diff
     /* src/tailwind.css */
     -@tailwind base;
     -@tailwind components;
     -@tailwind utilities;
     +@layer base, starlight, theme, components, utilities;
     +
     +@import '@astrojs/starlight-tailwind';
     +@import 'tailwindcss/theme.css' layer(theme);
     +@import 'tailwindcss/utilities.css' layer(utilities);
     +
     +@theme {
     +	/*
     +	Configure your Tailwind theme that will be used by Starlight.
     +	https://starlight.astro.build/guides/css-and-tailwind/#styling-starlight-with-tailwind
     +	*/
     +}
     +
     +/*
     +Add additional Tailwind styles to this file:
     +https://tailwindcss.com/docs/adding-custom-styles#using-custom-css
     +*/
     ```

  1. **Update Tailwind customizations.** If you previously [customized your Tailwind theme configuration](https://starlight.astro.build/guides/css-and-tailwind/#styling-starlight-with-tailwind) in the `tailwind.config.mjs` file, such customizations are now defined through CSS using the `@theme` block in your Tailwind base styles.

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
        @layer base, starlight, theme, components, utilities;

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
          --font-sans: 'Atkinson Hyperlegible';
          /* Custom code font. */
          --font-mono: 'IBM Plex Mono';
        }
        ```

  We recommend checking your site’s appearance when upgrading to make sure there are no style regressions caused by this change.

  For full details about upgrading from Tailwind v3 to v4, see the [official upgrade guide](https://tailwindcss.com/docs/upgrade-guide).

## 3.0.1

### Patch Changes

- [#2991](https://github.com/withastro/starlight/pull/2991) [`b8a4800`](https://github.com/withastro/starlight/commit/b8a480054aba2b39414ef7942db1a6110b800540) Thanks [@florian-lefebvre](https://github.com/florian-lefebvre)! - Adds support for `@astrojs/tailwind` v6

## 3.0.0

### Major Changes

- [#2612](https://github.com/withastro/starlight/pull/2612) [`8d5a4e8`](https://github.com/withastro/starlight/commit/8d5a4e8000d9e3a4bb9ca8178767cf3d8bc48773) Thanks [@HiDeoo](https://github.com/HiDeoo)! - ⚠️ **BREAKING CHANGE:** The minimum supported version of Starlight is now 0.30.0

  Please use the `@astrojs/upgrade` command to upgrade your project:

  ```sh
  npx @astrojs/upgrade
  ```

### Patch Changes

- [#2664](https://github.com/withastro/starlight/pull/2664) [`62ff007`](https://github.com/withastro/starlight/commit/62ff0074d9a3f82e46f5c62db85c04d87ff5e931) Thanks [@HiDeoo](https://github.com/HiDeoo)! - Publishes provenance containing verifiable data to link a package back to its source repository and the specific build instructions used to publish it.

## 2.0.3

### Patch Changes

- [#1906](https://github.com/withastro/starlight/pull/1906) [`b079ae11`](https://github.com/withastro/starlight/commit/b079ae114c49bf0570a142b94997bcc0828c47e0) Thanks [@delucis](https://github.com/delucis)! - Fixes default `font-family` in non-Starlight pages when using Tailwind plugin

## 2.0.2

### Patch Changes

- [#1726](https://github.com/withastro/starlight/pull/1726) [`1aae51ac`](https://github.com/withastro/starlight/commit/1aae51ac512df8de088c7529236e196be42077e8) Thanks [@delucis](https://github.com/delucis)! - Adds warning log if a user tries to set `colors.white` in their Tailwind theme config with an object instead of a string.

## 2.0.1

### Patch Changes

- [#903](https://github.com/withastro/starlight/pull/903) [`232f512`](https://github.com/withastro/starlight/commit/232f51207fe97880760fba25351cdc65b20f4c67) Thanks [@torn4dom4n](https://github.com/torn4dom4n)! - Show `tailwind.config.mjs` file in docs

## 2.0.0

### Major Changes

- [#615](https://github.com/withastro/starlight/pull/615) [`7b75b3e`](https://github.com/withastro/starlight/commit/7b75b3eb7e6f7870a0adef2d6534ff48309fdb0e) Thanks [@delucis](https://github.com/delucis)! - Bump minimum required Astro version to 3.0

  ⚠️ **BREAKING CHANGE** Astro v2 is no longer supported. Make sure you update [Astro](https://docs.astro.build/en/guides/upgrade-to/v3/), [Starlight](https://starlight.astro.build/getting-started/#updating-starlight), and any other integrations at the same time as updating the Tailwind plugin.

## 1.0.2

### Patch Changes

- [#529](https://github.com/withastro/starlight/pull/529) [`c2d0e7f`](https://github.com/withastro/starlight/commit/c2d0e7f2699e60a48a3a9074eee6439dee8624a1) Thanks [@delucis](https://github.com/delucis)! - Log warning if Tailwind prefix is set to "sl-"

## 1.0.1

### Patch Changes

- [#503](https://github.com/withastro/starlight/pull/503) [`c81b158`](https://github.com/withastro/starlight/commit/c81b158e5f832b88f4bb03586b61f887c1982db1) Thanks [@delucis](https://github.com/delucis)! - Loosen `@astrojs/starlight` peer dependency range to allow higher minor versions.

- Updated dependencies [[`5e3133c`](https://github.com/withastro/starlight/commit/5e3133c42232b201b981cf4b3bc1c3dd56b09fa5), [`fcff49e`](https://github.com/withastro/starlight/commit/fcff49ee4260ad68e80833712e161cbb978a2562), [`3c87a16`](https://github.com/withastro/starlight/commit/3c87a16de3c867ad89294a0ea84d63eca2e74d7a), [`cd28392`](https://github.com/withastro/starlight/commit/cd28392ac73ac0ba1a441328fcd1d65d7d441366), [`d8669b8`](https://github.com/withastro/starlight/commit/d8669b869761ac15d1d611eda7dd94a62ce0fd7a)]:
  - @astrojs/starlight@0.7.2

## 1.0.0

### Minor Changes

- [#337](https://github.com/withastro/starlight/pull/337) [`555826d`](https://github.com/withastro/starlight/commit/555826d39edec9b0535edf734656dd9bf7cc31ea) Thanks [@delucis](https://github.com/delucis)! - Add Tailwind plugin

### Patch Changes

- Updated dependencies [[`2e0fb90`](https://github.com/withastro/starlight/commit/2e0fb9053e96839287071e8a9c523796570cb0f6), [`0119a49`](https://github.com/withastro/starlight/commit/0119a49b9a5f7844e7689df5577e8132bf871535), [`d076aec`](https://github.com/withastro/starlight/commit/d076aec856921c2fe8a5204a0c31580a846af180), [`73eb5e6`](https://github.com/withastro/starlight/commit/73eb5e6ac6511dc4a6f5c4ca6c0c60d521f1db3c), [`461a5d5`](https://github.com/withastro/starlight/commit/461a5d5c0424b03fb95b7ff7b27c944d04430244), [`06a205e`](https://github.com/withastro/starlight/commit/06a205e0e673f505bbb87dfcfcb0f35b051677e9), [`6a7692a`](https://github.com/withastro/starlight/commit/6a7692ae3178f9f9f727cc17b8ae860604afd78f)]:
  - @astrojs/starlight@0.7.0
