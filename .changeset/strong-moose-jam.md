---
'@astrojs/starlight': minor
---

<!-- Thank you for opening a PR! We really appreciate you taking the time to help out 🙌 -->

#### Description

Updates `astro-expressive-code` dependency to the latest minor release (0.34) and `hastscript` to `^9.0`.

`astro-expressive-code` updates dependencies `hast`, `hastscript` and `hast-util-*` to the latest versions.

Potentially breaking change: Unfortunately, some of the new hast types are incompatible with their old versions. If you created custom plugins to manipulate HAST nodes, you may need to update your dependencies as well and probably change some types. For example, if you were using the Parent type before, you will probably need to replace it with Parents or Element in the new version.

Adds a new /hast entrypoint to @expressive-code/core, expressive-code, remark-expressive-code and astro-expressive-code to simplify plugin development.

This new entrypoint provides direct access to the correct versions of HAST types and commonly used tree traversal, querying and manipulation functions. Instead of having to add your own dependencies on libraries like hastscript, hast-util-select or unist-util-visit to your project and manually keeping them in sync with the versions used by Expressive Code, you can now import the internally used functions and types directly from this new entrypoint.

Ensures that static assets (styles and JS modules) are prerendered when using SSR adapters. Makes astro-expressive-code compatible with SSR adapters.Makes Expressive Code compatible with Bun.

See the [Expressive Code release notes](https://expressive-code.com/releases/) for more information including details of potentially breaking changes.
