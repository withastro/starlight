---
'@astrojs/starlight-markdoc': minor
---

Adds support for generating clickable anchor links for headings.

By default, The Starlight Markdoc preset now includes a default `heading` node, which renders an anchor link beside headings in your Markdoc content.

If you want to disable this new feature, pass `headingLinks: false` in your Markdoc config:

```js
export default defineMarkdocConfig({
  // Disable the default heading anchor link support
  extends: [starlightMarkdoc({ headingLinks: false })],
});
```

⚠️ **BREAKING CHANGE:** The minimum supported peer version of Starlight is now v0.34.0.

Please update Starlight and the Starlight Markdoc preset together:

```sh
npx @astrojs/upgrade
```
