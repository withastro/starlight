---
'@astrojs/starlight': minor
---

Adds support for generating clickable anchor links for headings.

By default, Starlight now renders an anchor link beside headings in Markdown and MDX content. A new `<AnchorHeading>` component is available to achieve the same thing in custom pages built using `<StarlightPage>`.

If you want to disable this new Markdown processing set the `markdown.headingLinks` option in your Starlight config to `false`:

```js
starlight({
  title: 'My docs',
  markdown: {
    headingLinks: false,
  },
}),
```

⚠️ **BREAKING CHANGE:** The minimum supported version of Astro is now v5.5.0.

Please update Starlight and Astro together:

```sh
npx @astrojs/upgrade
```
