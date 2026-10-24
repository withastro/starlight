---
'@astrojs/starlight': patch
---

Fixes missing last updated dates in production builds for pages whose file path contains non-ASCII characters, double quotes, characters in a different Unicode normalization form than the one committed to git, or backslashes on non-Windows systems when the `lastUpdated` option is enabled.
