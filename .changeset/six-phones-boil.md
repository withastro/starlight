---
'@astrojs/starlight': minor
---

Adds support for server-rendered Starlight pages.

When building a project with `hybrid` or `server` output mode, a new `prerender` option on Starlight config can be set to `false` to make all Starlight pages be rendered on-demand:

```ts
export default defineConfig({
  output: 'server',
  integrations: [starlight({
    prerender: false
  })],
})
```
