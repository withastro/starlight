---
"@astrojs/starlight": minor
---

Add new global `showUpdateDate` option defaulting to `false` to define whether or not the last updated date is shown in the footer. A page can override the generated date using the new `lastUpdated` frontmatter field.

⚠️ Potentially breaking change. This new option is `false` by default which is a change from the previous behavior. To keep the previous behavior, you must explicitly set `showUpdateDate` to `true` in your configuration.

```diff
starlight({
+ showUpdateDate: true,
}),
```
