---
'@astrojs/starlight': patch
---

Safely handle Zod errors 

Prevents bugs where errors without the `.received` props would through and cause builds to fail unnecessarily.
