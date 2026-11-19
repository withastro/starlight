---
'@astrojs/starlight-docsearch': minor
---

Adds support for DocSearch v5, drops support for DocSearch v3.

#### Update your DocSearch configuration

⚠️ **BREAKING CHANGE:** Removes the `indexName` and `searchParameters` options. Use the new `indices` option to set the Algolia indices to search. Each entry can be either an index name or an object with a `name` and optional `searchParameters` for that index:

```diff
starlightDocSearch({
  appId: 'YOUR_APP_ID',
  apiKey: 'YOUR_SEARCH_API_KEY',
- indexName: 'YOUR_INDEX_NAME',
- searchParameters: { facetFilters: ['version:v5'] },
+ indices: [{ name: 'YOUR_INDEX_NAME', searchParameters: { facetFilters: ['version:v5'] } }],
})
```

If you use the [`clientOptionsModule` option](https://starlight.astro.build/guides/site-search/#additional-docsearch-options), update your configuration file by following the [DocSearch v4](https://docsearch.algolia.com/docs/v4/migrating-from-v3/) and [DocSearch v5](https://docsearch.algolia.com/docs/migrating-from-v4/) migration guides.

#### Update your translations

⚠️ **BREAKING CHANGE:** If you translate the DocSearch UI, rename the following keys in your translation files:

- `docsearch.searchBox.resetButtonTitle` → `docsearch.searchBox.clearButtonTitle`
- `docsearch.searchBox.resetButtonAriaLabel` → `docsearch.searchBox.clearButtonAriaLabel`
- `docsearch.searchBox.cancelButtonText` → `docsearch.searchBox.closeButtonText`
- `docsearch.searchBox.cancelButtonAriaLabel` → `docsearch.searchBox.closeButtonAriaLabel`
- `docsearch.footer.searchByText` → `docsearch.footer.poweredByText`

DocSearch v5 also updates the wording of some default UI strings so you may want to review your existing translations.

See ["Translating the DocSearch UI"](https://starlight.astro.build/guides/site-search/#translating-the-docsearch-ui) in the Starlight documentation for all available keys and their default values.

#### Review your custom DocSearch styles

⚠️ **BREAKING CHANGE:** The DocSearch v5 search modal uses updated markup and [CSS custom properties](https://docsearch.algolia.com/docs/packages/css/styling/#override-variables). If you customize the appearance of DocSearch with your own CSS, check that your styles still apply as expected.
