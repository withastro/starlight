---
'@astrojs/starlight': minor
---

Refactor internal virtual module system for components to avoid circular references

This is a change to an internal API.
If you were importing the internal `virtual:starlight/components` module, this no longer exists.
Update your imports to use the individual virtual modules now available for each component, for example `virtual:starlight/components/EditLink`.
