---
'@astrojs/starlight': patch
---

Add support for customising and translating Starlight’s UI.

Users can provide translations in JSON files in `src/content/i18n/` which is a data collection. For example, a `src/content/i18n/de.json` might translate the search UI:

```json
{
  "search.label": "Suchen",
  "search.shortcutLabel": "(Drücke / zum Suchen)"
}
```

This change also allows Starlight to provide built-in support for more languages than just English and adds German & Spanish support.
