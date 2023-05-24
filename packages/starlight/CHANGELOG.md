# @astrojs/starlight

## 0.0.12

### Patch Changes

- [#85](https://github.com/withastro/starlight/pull/85) [`c86c1d6`](https://github.com/withastro/starlight/commit/c86c1d6e93d978d13e42bbc449e0225a06793ba3) Thanks [@BryceRussell](https://github.com/BryceRussell)! - Improve outside click detection on the search modal

## 0.0.11

### Patch Changes

- [`4da9cbd`](https://github.com/withastro/starlight/commit/4da9cbd7e643c97acbf4c2016aefb8f712bc9869) Thanks [@delucis](https://github.com/delucis)! - Fix typo in English UI strings

## 0.0.10

### Patch Changes

- [#78](https://github.com/withastro/starlight/pull/78) [`d3ee6fc`](https://github.com/withastro/starlight/commit/d3ee6fc643de7a320a6bb83432cdcfbb0a4e4289) Thanks [@delucis](https://github.com/delucis)! - Add support for customising and translating Starlight’s UI.

  Users can provide translations in JSON files in `src/content/i18n/` which is a data collection. For example, a `src/content/i18n/de.json` might translate the search UI:

  ```json
  {
    "search.label": "Suchen",
    "search.shortcutLabel": "(Drücke / zum Suchen)"
  }
  ```

  This change also allows Starlight to provide built-in support for more languages than just English and adds German & Spanish support.

- [#76](https://github.com/withastro/starlight/pull/76) [`5e82073`](https://github.com/withastro/starlight/commit/5e8207350dba0fce92fa101d311db627e2157654) Thanks [@lloydjatkinson](https://github.com/lloydjatkinson)! - Scale down code block font size to match Figma design

- [#78](https://github.com/withastro/starlight/pull/78) [`d3ee6fc`](https://github.com/withastro/starlight/commit/d3ee6fc643de7a320a6bb83432cdcfbb0a4e4289) Thanks [@delucis](https://github.com/delucis)! - Require a minimum Astro version of 2.5.0

## 0.0.9

### Patch Changes

- [#72](https://github.com/withastro/starlight/pull/72) [`3dc1d0c`](https://github.com/withastro/starlight/commit/3dc1d0c342c6db4e30b016035fa446101b1805a2) Thanks [@delucis](https://github.com/delucis)! - Fix vertical alignment of social icons in site header

- [#63](https://github.com/withastro/starlight/pull/63) [`823e351`](https://github.com/withastro/starlight/commit/823e351e1c1fc68ca3c20ab35c9a7d9b13760a70) Thanks [@liruifengv](https://github.com/liruifengv)! - Make sidebar groups to collapsible

- [#72](https://github.com/withastro/starlight/pull/72) [`3dc1d0c`](https://github.com/withastro/starlight/commit/3dc1d0c342c6db4e30b016035fa446101b1805a2) Thanks [@delucis](https://github.com/delucis)! - Fix image aspect ratio in Markdown content

## 0.0.8

### Patch Changes

- [#62](https://github.com/withastro/starlight/pull/62) [`a91191e`](https://github.com/withastro/starlight/commit/a91191e8308ffa746a3eadeea61e39412f32f926) Thanks [@delucis](https://github.com/delucis)! - Make `base` support consistent, including when `trailingSlash: 'never'` is set.

- [#61](https://github.com/withastro/starlight/pull/61) [`608f34c`](https://github.com/withastro/starlight/commit/608f34cbbe485c39730f33828971397f9c8a3534) Thanks [@liruifengv](https://github.com/liruifengv)! - Fix toc headingsObserver rootMargin

- [#66](https://github.com/withastro/starlight/pull/66) [`9ca67d8`](https://github.com/withastro/starlight/commit/9ca67d8984f76c22e5411d7352aa8e0bd4514f42) Thanks [@Yan-Thomas](https://github.com/Yan-Thomas)! - Make site title width fit the content

- [#64](https://github.com/withastro/starlight/pull/64) [`4460e55`](https://github.com/withastro/starlight/commit/4460e55de210fd9a23a762fe76f5c32297d68d76) Thanks [@delucis](https://github.com/delucis)! - Fix table of contents intersection observer for all possible viewport sizes.

- [#67](https://github.com/withastro/starlight/pull/67) [`38c2c1f`](https://github.com/withastro/starlight/commit/38c2c1f1ed25d6efe6ab2637ca2d9fbcdafcd240) Thanks [@TheOtterlord](https://github.com/TheOtterlord)! - Fix background color on select component

- [#57](https://github.com/withastro/starlight/pull/57) [`5b6cccb`](https://github.com/withastro/starlight/commit/5b6cccb7f9ee5810c75fbbb45496e2a1d022f7dd) Thanks [@BryceRussell](https://github.com/BryceRussell)! - Update site title link to include locale

## 0.0.7

### Patch Changes

- [#55](https://github.com/withastro/starlight/pull/55) [`8597b9c`](https://github.com/withastro/starlight/commit/8597b9c1002f8c5073d25ae5cacd4060ded2f8c8) Thanks [@delucis](https://github.com/delucis)! - Fix routing logic to handle `index.md` slug differences between docs collection root and nested directories.

- [#54](https://github.com/withastro/starlight/pull/54) [`db728d6`](https://github.com/withastro/starlight/commit/db728d61afa5cea060c66f746a4cc4ab3e1c3bcd) Thanks [@TheOtterlord](https://github.com/TheOtterlord)! - Add padding to scroll preventing headings being obscured by nav

- [#51](https://github.com/withastro/starlight/pull/51) [`3adbdbb`](https://github.com/withastro/starlight/commit/3adbdbbb71a4b3648984fa1028fa116d0aff9a7d) Thanks [@delucis](https://github.com/delucis)! - Support displaying a custom logo in the nav bar.

- [#51](https://github.com/withastro/starlight/pull/51) [`3adbdbb`](https://github.com/withastro/starlight/commit/3adbdbbb71a4b3648984fa1028fa116d0aff9a7d) Thanks [@delucis](https://github.com/delucis)! - All Starlight projects now use Astro’s experimental optimized asset support.

## 0.0.6

### Patch Changes

- [#47](https://github.com/withastro/starlight/pull/47) [`e96d9a7`](https://github.com/withastro/starlight/commit/e96d9a7628c5c04fe34dbc65ddd6fabdc0667a6d) Thanks [@delucis](https://github.com/delucis)! - Fix CSS ordering issue caused by imports in 404 route.

- [#47](https://github.com/withastro/starlight/pull/47) [`e96d9a7`](https://github.com/withastro/starlight/commit/e96d9a7628c5c04fe34dbc65ddd6fabdc0667a6d) Thanks [@delucis](https://github.com/delucis)! - Highlight current page section in table of contents.

- [`1028119`](https://github.com/withastro/starlight/commit/10281196aba65075e4ac202dc0f23927c44403ee) Thanks [@delucis](https://github.com/delucis)! - Use default locale in `404.astro`.

- [`05f8fd4`](https://github.com/withastro/starlight/commit/05f8fd4c3114e4c25075b35086c5b3e7d0ff49d7) Thanks [@delucis](https://github.com/delucis)! - Include `initial-scale=1` in viewport meta tag.

- [#47](https://github.com/withastro/starlight/pull/47) [`e96d9a7`](https://github.com/withastro/starlight/commit/e96d9a7628c5c04fe34dbc65ddd6fabdc0667a6d) Thanks [@delucis](https://github.com/delucis)! - Fix usage of `aria-current` in navigation sidebar to use `page` value.

- [#48](https://github.com/withastro/starlight/pull/48) [`a49485d`](https://github.com/withastro/starlight/commit/a49485def3fe4f505e90bf934eedcb135b3d3f51) Thanks [@delucis](https://github.com/delucis)! - Improve right sidebar layout.

## 0.0.5

### Patch Changes

- [#42](https://github.com/withastro/starlight/pull/42) [`c6c1b67`](https://github.com/withastro/starlight/commit/c6c1b6727140a76c42c661f406000cc6e9b175de) Thanks [@delucis](https://github.com/delucis)! - Support setting custom `<head>` tags in config or frontmatter.

## 0.0.4

### Patch Changes

- [#40](https://github.com/withastro/starlight/pull/40) [`e22dd76`](https://github.com/withastro/starlight/commit/e22dd76136f9749bb5d43f96241385faccfc90a1) Thanks [@delucis](https://github.com/delucis)! - Generate sitemaps for Starlight sites

- [#38](https://github.com/withastro/starlight/pull/38) [`623b577`](https://github.com/withastro/starlight/commit/623b577319b1dea2d6c42f1b680139fb858d85d6) Thanks [@delucis](https://github.com/delucis)! - Add tab components for use in MDX.

## 0.0.3

### Patch Changes

- [`1f62c75`](https://github.com/withastro/starlight/commit/1f62c75297ed44da721350840744823876a64bc5) Thanks [@delucis](https://github.com/delucis)! - Add repo, issues & homepage links to package.json

- [#36](https://github.com/withastro/starlight/pull/36) [`62265e4`](https://github.com/withastro/starlight/commit/62265e4a653d161483e3844b568ab150334e9238) Thanks [@delucis](https://github.com/delucis)! - Collapse table of contents in dropdown on narrower viewports

## 0.0.2

### Patch Changes

- [#35](https://github.com/withastro/starlight/pull/35) [`ea999c4`](https://github.com/withastro/starlight/commit/ea999c4afa0e72da5a5510d30a7bc13380e10a4a) Thanks [@delucis](https://github.com/delucis)! - Add support for social media links in the site header.

- [#33](https://github.com/withastro/starlight/pull/33) [`833393a`](https://github.com/withastro/starlight/commit/833393a1cd8fc83a3b9c6055cfb8d160ab40a40c) Thanks [@MoustaphaDev](https://github.com/MoustaphaDev)! - Import zod from `astro/zod` to fix an issue related to importing the `astro:content` virtual module

## 0.0.1

### Patch Changes

- [#30](https://github.com/withastro/starlight/pull/30) [`dc6e04d`](https://github.com/withastro/starlight/commit/dc6e04d2cf09339713743bc113a57d1880fec85d) Thanks [@delucis](https://github.com/delucis)! - Set up npm publishing with changesets
