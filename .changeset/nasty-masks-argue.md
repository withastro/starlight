---
'@astrojs/starlight': minor
---

Improves build performance for sites with large sidebars

This release adds a caching layer to Starlight’s sidebar generation logic, reducing the number of times sidebars need to be regenerated while building a site. Some benchmarks for projects with a complex sidebar saw builds complete more than 35% faster with this change.
