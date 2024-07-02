---
'@astrojs/starlight': minor
---

Makes sidebar entry parsing stricter in Starlight config

**⚠️ Potentially breaking change:** Previously Starlight would accept a sidebar entry that matched one of its expected shapes, even if it included additional properties. For example, including both `link` and `items` was considered valid, with `items` being ignored. Now, it is an error to include more than one of `link`, `items`, or `autogenerate` in a sidebar entry.

If you see errors after updating, look for sidebar entries in the Starlight configuration in `astro.config.mjs` that include too many keys and remove the one that was previously ignored.
