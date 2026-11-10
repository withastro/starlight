---
"@astrojs/starlight": minor
---

⚠️ **BREAKING CHANGE:** Adds support for any Astro [`scopedStyleStrategy`](https://docs.astro.build/en/reference/configuration-reference/#scopedstylestrategy) configuration.

Previously, Starlight forced the `"where"` strategy, resulting in CSS selectors like `:where(.astro-HASH)`. Starlight now respects the strategy set in `astro.config.mjs` and will default to Astro’s default `"attribute"` strategy, resulting in attribute selectors like `[data-astro-cid-HASH]`.

The new default can change some styling behaviour, so we recommend checking for visual changes in your site when updating. In particular, note the following:

- Attribute selectors have a higher specificity than `:where()` selectors. Check to ensure styles still apply and no CSS changes are needed to ensure the relative specificity of declarations remains the same.

- Astro’s `"attribute"` strategy does not automatically pass along a parent component’s scope when passing a `class` down to a child component. If you have components that depended on this, you will need to update the child component to spread the parent’s data attribute where you are reusing the class name, for example:

  ```astro
  ---
  // Parent.astro
  ---

  <Child class="special-case" />

  <style>
  .special-case {
    --accent-color: red;
  }
  </style>
  ```

  ```diff
  ---
  // Child.astro
  -const { class: className } = Astro.props;
  +const { class: className, ...attributes } = Astro.props;
  ---

  -<div class={className}>
  +<div class={className} {...attributes}>
    <!-- ... -->
  </div>
  ```

  See [“Passing a `class` to a child component”](https://docs.astro.build/en/guides/styling/#passing-a-class-to-a-child-component) in the Astro docs for more details.

Alternatively, if you wish to continue using the previous scoping strategy in your site, set it explicitly in your Astro configuration file:

```diff
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
+ scopedStyleStrategy: "where",
  // ...
});
```
