---
"@astrojs/starlight": minor
---

Use path instead of slugified path for auto-generated sidebar item configuration

⚠️ Potentially breaking change. If your docs directory names don’t match their URLs, for example they contain whitespace like `docs/my docs/`, and you were referencing these in an `autogenerate` sidebar group as `my-docs`, update your config to reference these with the directory name instead of the slugified version:

```diff
autogenerate: {
- directory: 'my-docs',
+ directory: 'my docs',
}
```
