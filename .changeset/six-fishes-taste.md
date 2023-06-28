---
"@astrojs/starlight": minor
---

Add new global `lastUpdated` option defaulting to `false` to define whether or not the last updated date is shown in the footer. A page can override this setting or the generated date using the new `lastUpdated` frontmatter field.

⚠️ Breaking change. Starlight will no longer show this date by default. To keep the previous behavior, you must explicitly set `lastUpdated` to `true` in your configuration.

```diff
starlight({
+ lastUpdated: true,
}),
```
