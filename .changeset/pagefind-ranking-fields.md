---
'@astrojs/starlight': patch
---

Adds support for the `diacriticSimilarity` and `metaWeights` Pagefind ranking options in the Starlight `pagefind.ranking` config. Previously, both fields were silently dropped during validation because they were not declared in the schema.
