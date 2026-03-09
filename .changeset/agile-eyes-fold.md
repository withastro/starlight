---
'@astrojs/starlight': minor
---

Adds support for Astro v6, drops support for Astro v5.

#### Upgrade Astro and dependencies

⚠️ **BREAKING CHANGE:** Astro v5 is no longer supported. Make sure you [update Astro](https://v6.docs.astro.build/en/guides/upgrade-to/v6/) and any other official integrations at the same time as updating Starlight:

```sh
npx @astrojs/upgrade
```

_Community Starlight plugins and Astro integrations may also need to be manually updated to work with Astro v6. If you encounter any issues, please reach out to the plugin or integration author to see if it is a known issue or if an updated version is being worked on._

#### Update your collections

⚠️ **BREAKING CHANGE:** Drops support for content collections backwards compatibility.

In Astro 5.x, projects could delay upgrading to the new Content Layer API introduced for content collections because of some existing automatic backwards compatibility that was not previously behind a flag. This meant that it was possible to upgrade from Astro 4 to Astro 5 without updating your content collections, even if you had not enabled the `legacy.collections` flag. Projects would continue to build, and no errors or warnings would be displayed.

Astro v6.0 now removes this automatic legacy content collections support, along with the `legacy.collections` flag.

If you experience content collections errors after updating to v6, [check your project for any removed legacy features](https://v6.docs.astro.build/en/guides/upgrade-to/v6/#if-you-have) that may need updating to the Content Layer API. See [the Astro v5 upgrade guide](https://github.com/withastro/starlight/blob/main/packages/starlight/CHANGELOG.md#0300) for detailed instructions on upgrading legacy collections to the new Content Layer API.

If you are unable to make any changes to your collections at this time, including Starlight's default `docs` and `i18n` collections, you can enable the [`legacy.collectionsBackwardsCompat` flag](https://v6.docs.astro.build/en/reference/legacy-flags/#collectionsbackwardscompat) to upgrade to v6 without updating your collections. This temporary flag preserves some legacy v4 content collections features, and will allow you to keep your collections in their current state until the legacy flag is no longer supported.
