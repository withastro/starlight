# @astrojs/starlight

## 0.5.1

### Patch Changes

- [#336](https://github.com/withastro/starlight/pull/336) [`2b3302b`](https://github.com/withastro/starlight/commit/2b3302b80451f318fb05a5e8a7284feb28999e66) Thanks [@delucis](https://github.com/delucis)! - Add support for LinkedIn, Threads, and Twitch social icon links

- [#335](https://github.com/withastro/starlight/pull/335) [`757c65f`](https://github.com/withastro/starlight/commit/757c65ffc468fd2c782312b476fa7659d0cfd198) Thanks [@delucis](https://github.com/delucis)! - Fix relative path resolution on Windows

- [#332](https://github.com/withastro/starlight/pull/332) [`0600c1a`](https://github.com/withastro/starlight/commit/0600c1a917bf86efa6b2d053aa47e3a4b17e8049) Thanks [@sasoria](https://github.com/sasoria)! - Add Norwegian UI translations

- [#328](https://github.com/withastro/starlight/pull/328) [`e478848`](https://github.com/withastro/starlight/commit/e478848de1c41a46f58d0ac0d62d7b7272cf1241) Thanks [@astridx](https://github.com/astridx)! - Add missing accessible labels for Codeberg and YouTube social links

## 0.5.0

### Minor Changes

- [#313](https://github.com/withastro/starlight/pull/313) [`dc42569`](https://github.com/withastro/starlight/commit/dc42569bddfae2c48ea60c0dd5cc70643a129a68) Thanks [@delucis](https://github.com/delucis)! - Add a `not-content` CSS class that allows users to opt out of Starlight’s default content styling

- [#297](https://github.com/withastro/starlight/pull/297) [`fb15a9b`](https://github.com/withastro/starlight/commit/fb15a9b65252ac5fa32304096fbdb49ecdd6009b) Thanks [@HiDeoo](https://github.com/HiDeoo)! - Improve `<Tabs>` component keyboard interactions

- [#303](https://github.com/withastro/starlight/pull/303) [`69b7d4c`](https://github.com/withastro/starlight/commit/69b7d4c23761a45dc2b9ea75c6c9c904a885ba5d) Thanks [@HiDeoo](https://github.com/HiDeoo)! - Add new global `pagination` option defaulting to `true` to define whether or not the previous and next page links are shown in the footer. A page can override this setting or the link text and/or URL using the new `prev` and `next` frontmatter fields.

### Patch Changes

- [#318](https://github.com/withastro/starlight/pull/318) [`5db3e6e`](https://github.com/withastro/starlight/commit/5db3e6ea2e5cb7d9552fc54567811358851fb533) Thanks [@delucis](https://github.com/delucis)! - Support relative paths in Starlight config for `customCSS` and `logo` paths

## 0.4.2

### Patch Changes

- [#308](https://github.com/withastro/starlight/pull/308) [`c3aa4c6`](https://github.com/withastro/starlight/commit/c3aa4c6aa18f7f6859ad1c0acc28f0da59a84760) Thanks [@delucis](https://github.com/delucis)! - Fix use of default monospace font stack

- [#286](https://github.com/withastro/starlight/pull/286) [`a2aedfc`](https://github.com/withastro/starlight/commit/a2aedfc7f9555b44f5f33aad7f4a98b207a11b47) Thanks [@mzaien](https://github.com/mzaien)! - Add Arabic UI translations

## 0.4.1

### Patch Changes

- [#300](https://github.com/withastro/starlight/pull/300) [`377a25d`](https://github.com/withastro/starlight/commit/377a25dc4c51c060e751aeba4d3f946a41de907a) Thanks [@cbontems](https://github.com/cbontems)! - Fix broken link on 404 page when `defaultLocale: 'root'` is set in `astro.config.mjs`

- [#289](https://github.com/withastro/starlight/pull/289) [`dffca46`](https://github.com/withastro/starlight/commit/dffca461633940847e9177913053885c5e8b5f29) Thanks [@RyanRBrown](https://github.com/RyanRBrown)! - Fix saturation of purple text in light theme

- [#301](https://github.com/withastro/starlight/pull/301) [`d47639d`](https://github.com/withastro/starlight/commit/d47639d50b53fa691c1d9b0f30f82ebf7f6ddf7e) Thanks [@delucis](https://github.com/delucis)! - Enable inline stylesheets for Astro versions ≥2.6.0

## 0.4.0

### Minor Changes

- [#259](https://github.com/withastro/starlight/pull/259) [`8102389`](https://github.com/withastro/starlight/commit/810238934ae1a95c53042ca2875bb4033aad0114) Thanks [@HiDeoo](https://github.com/HiDeoo)! - Add support for collapsed sidebar groups

- [#254](https://github.com/withastro/starlight/pull/254) [`faa70de`](https://github.com/withastro/starlight/commit/faa70de584bf596fdd7184c4a8622d67d1410ecf) Thanks [@HiDeoo](https://github.com/HiDeoo)! - Expose `<Icon>` component

- [#256](https://github.com/withastro/starlight/pull/256) [`048e948`](https://github.com/withastro/starlight/commit/048e948bce650d559517850c73d827733b8164c4) Thanks [@HiDeoo](https://github.com/HiDeoo)! - Add new global `lastUpdated` option defaulting to `false` to define whether or not the last updated date is shown in the footer. A page can override this setting or the generated date using the new `lastUpdated` frontmatter field.

  ⚠️ Breaking change. Starlight will no longer show this date by default. To keep the previous behavior, you must explicitly set `lastUpdated` to `true` in your configuration.

  ```diff
  starlight({
  + lastUpdated: true,
  }),
  ```

### Patch Changes

- [#264](https://github.com/withastro/starlight/pull/264) [`ed1e46b`](https://github.com/withastro/starlight/commit/ed1e46beb1bc054ecdba36ecfe566ecaeaf8799b) Thanks [@astridx](https://github.com/astridx)! - Add new icon for displaying codeberg.org in social links.

- [#260](https://github.com/withastro/starlight/pull/260) [`01b65b1`](https://github.com/withastro/starlight/commit/01b65b1adf012474daf5678b4a709e3a7a484814) Thanks [@ElianCodes](https://github.com/ElianCodes)! - Add Dutch UI translations

- [#269](https://github.com/withastro/starlight/pull/269) [`fdc18b5`](https://github.com/withastro/starlight/commit/fdc18b5476957f8017a0fa1489c6fed89d5a9480) Thanks [@baspinarenes](https://github.com/baspinarenes)! - Add Turkish UI translations

- [#270](https://github.com/withastro/starlight/pull/270) [`1d3e705`](https://github.com/withastro/starlight/commit/1d3e705256fa0668db73b01c898e7e3b3b505c49) Thanks [@cbontems](https://github.com/cbontems)! - Improve French UI translations

- [#272](https://github.com/withastro/starlight/pull/272) [`6b23ebc`](https://github.com/withastro/starlight/commit/6b23ebc9974828837a2de9175297664e5d28a999) Thanks [@cbontems](https://github.com/cbontems)! - Add YouTube social link support

- [#267](https://github.com/withastro/starlight/pull/267) [`af2e43c`](https://github.com/withastro/starlight/commit/af2e43c7325a8f7fa6c9f867a3ec864daae39e96) Thanks [@nikcio](https://github.com/nikcio)! - Add Danish UI translations

- [#273](https://github.com/withastro/starlight/pull/273) [`d4f5134`](https://github.com/withastro/starlight/commit/d4f5134c91b393ac448efc3f44849fc886a05551) Thanks [@Waxer59](https://github.com/Waxer59)! - Fix typo in Spanish UI translations

## 0.3.1

### Patch Changes

- [#257](https://github.com/withastro/starlight/pull/257) [`0502327`](https://github.com/withastro/starlight/commit/050232770c8a2d22f317def8e734e4abb36387c6) Thanks [@JosefJezek](https://github.com/JosefJezek)! - Add Czech language support

- [#261](https://github.com/withastro/starlight/pull/261) [`2062b9e`](https://github.com/withastro/starlight/commit/2062b9e21695b5dc3f116731dbfdf609e495018c) Thanks [@delucis](https://github.com/delucis)! - Fix autogenerated navigation for pages using fallback content

## 0.3.0

### Minor Changes

- [#237](https://github.com/withastro/starlight/pull/237) [`4279d75`](https://github.com/withastro/starlight/commit/4279d7512a8261b576056471f5aa1ede1e6aae4a) Thanks [@HiDeoo](https://github.com/HiDeoo)! - Use path instead of slugified path for auto-generated sidebar item configuration

  ⚠️ Potentially breaking change. If your docs directory names don’t match their URLs, for example they contain whitespace like `docs/my docs/`, and you were referencing these in an `autogenerate` sidebar group as `my-docs`, update your config to reference these with the directory name instead of the slugified version:

  ```diff
  autogenerate: {
  - directory: 'my-docs',
  + directory: 'my docs',
  }
  ```

- [#226](https://github.com/withastro/starlight/pull/226) [`1aa2187`](https://github.com/withastro/starlight/commit/1aa2187944dde4419e523f0087139f5a21efd826) Thanks [@delucis](https://github.com/delucis)! - Add support for custom 404 pages.

### Patch Changes

- [#234](https://github.com/withastro/starlight/pull/234) [`91309ae`](https://github.com/withastro/starlight/commit/91309ae13250c5fd9f91a8e1843f16430773ff15) Thanks [@morinokami](https://github.com/morinokami)! - Add Japanese translation for `search.devWarning`

- [#227](https://github.com/withastro/starlight/pull/227) [`fbdecfa`](https://github.com/withastro/starlight/commit/fbdecfab47effb0cba7cbc9233a7b6bffdded320) Thanks [@Yan-Thomas](https://github.com/Yan-Thomas)! - Add missing i18n support to the Search component's dev warning.

- [#244](https://github.com/withastro/starlight/pull/244) [`f1bcbeb`](https://github.com/withastro/starlight/commit/f1bcbebeb441b6bb9ed6a1ab2414791e9d5de6ef) Thanks [@Waxer59](https://github.com/Waxer59)! - Add Spanish translation for `search.devWarning`

## 0.2.0

### Minor Changes

- [#171](https://github.com/withastro/starlight/pull/171) [`198c3f0`](https://github.com/withastro/starlight/commit/198c3f001410f259dab7d085136a37afe863cfa4) Thanks [@delucis](https://github.com/delucis)! - Add Starlight generator tag to HTML output

- [#217](https://github.com/withastro/starlight/pull/217) [`490fd98`](https://github.com/withastro/starlight/commit/490fd98d4e7b38ec01c568eee0ab00844e59c53d) Thanks [@delucis](https://github.com/delucis)! - Updated sidebar styles. Sidebars now support top-level links and groups are styled with a subtle border and indentation to improve comprehension of nesting.

- [#178](https://github.com/withastro/starlight/pull/178) [`d046c55`](https://github.com/withastro/starlight/commit/d046c55a62290c15f2e09faf4359f02df9492f6d) Thanks [@delucis](https://github.com/delucis)! - Add support for translating the Pagefind search modal

- [#210](https://github.com/withastro/starlight/pull/210) [`cb5b121`](https://github.com/withastro/starlight/commit/cb5b1210e23548e2983865a4b38308b0f54dc7ce) Thanks [@delucis](https://github.com/delucis)! - Change page title ID to `_top` for cleaner hash URLs

  ⚠️ Potentially breaking change if you were linking manually to `#starlight__overview` anywhere. If you were, update these links to use `#_top` instead.

### Patch Changes

- [#208](https://github.com/withastro/starlight/pull/208) [`09fc565`](https://github.com/withastro/starlight/commit/09fc565d44bd3abb4508541b458531de8624036f) Thanks [@delucis](https://github.com/delucis)! - Update `@astrojs/mdx` and `@astrojs/sitemap` to latest

- [#216](https://github.com/withastro/starlight/pull/216) [`54905c5`](https://github.com/withastro/starlight/commit/54905c502c5e6de5516e36ddcd4969893572baa5) Thanks [@morinokami](https://github.com/morinokami)! - Encode heading id when finding current link

## 0.1.4

### Patch Changes

- [#190](https://github.com/withastro/starlight/pull/190) [`a3809e4`](https://github.com/withastro/starlight/commit/a3809e4f1e14f3949e9e25f7ffbdea2920408edb) Thanks [@gabrielemercolino](https://github.com/gabrielemercolino)! - Added Italian language support

- [#193](https://github.com/withastro/starlight/pull/193) [`c9ca4eb`](https://github.com/withastro/starlight/commit/c9ca4ebe10f4776999e3fff4ac4c19ac0a714bac) Thanks [@BryceRussell](https://github.com/BryceRussell)! - Fix bottom padding for sidebar on larger screen sizes

## 0.1.3

### Patch Changes

- [#183](https://github.com/withastro/starlight/pull/183) [`89e0a04`](https://github.com/withastro/starlight/commit/89e0a04c26639246f550957acda2285e50417729) Thanks [@delucis](https://github.com/delucis)! - Fix disclosure caret rotation in sidebar sub-groups

- [#177](https://github.com/withastro/starlight/pull/177) [`bdafdb0`](https://github.com/withastro/starlight/commit/bdafdb050d9d4e2501485dff37b71a3175a3b0c8) Thanks [@rviscomi](https://github.com/rviscomi)! - Fix Markdown table overflow

- [#185](https://github.com/withastro/starlight/pull/185) [`4844915`](https://github.com/withastro/starlight/commit/4844915c25c9cdfb852e41584d93abfd85b82d08) Thanks [@delucis](https://github.com/delucis)! - Support setting an SVG as the hero image file

## 0.1.2

### Patch Changes

- [#174](https://github.com/withastro/starlight/pull/174) [`6ab31b4`](https://github.com/withastro/starlight/commit/6ab31b4900166f952c1ca5ec4e4a1ef66f31be97) Thanks [@rviscomi](https://github.com/rviscomi)! - Split `withBase` URL helper to fix use with files.

- [#168](https://github.com/withastro/starlight/pull/168) [`cb18eef`](https://github.com/withastro/starlight/commit/cb18eef4fda8227a6c5ec73589526dd7fbb8f4a6) Thanks [@BryceRussell](https://github.com/BryceRussell)! - Fix bottom padding on left sidebar

- [#167](https://github.com/withastro/starlight/pull/167) [`990ec53`](https://github.com/withastro/starlight/commit/990ec53dee099fdb6d113a3be5ef375c73e6945a) Thanks [@BryceRussell](https://github.com/BryceRussell)! - Add `bundlePath` option to Pagefind configuration

- [`4f666ba`](https://github.com/withastro/starlight/commit/4f666ba4fad7118a31bae819eb6be068da9e4d94) Thanks [@delucis](https://github.com/delucis)! - Fix focus outline positioning in tabs

## 0.1.1

### Patch Changes

- [#155](https://github.com/withastro/starlight/pull/155) Thanks [@thomasbnt](https://github.com/thomasbnt)! - Add French language support

- [#158](https://github.com/withastro/starlight/pull/158) [`92d82f5`](https://github.com/withastro/starlight/commit/92d82f534c6ff8513b01f9f26748d9980a6d4c79) Thanks [@kevinzunigacuellar](https://github.com/kevinzunigacuellar)! - Fix word wrapping in search modal on narrow screens

## 0.1.0

### Minor Changes

- [`43f3a02`](https://github.com/withastro/starlight/commit/43f3a024d6903072780f158dd95fb04b9f678535) Thanks [@delucis](https://github.com/delucis)! - Release v0.1.0

## 0.0.19

### Patch Changes

- [`fab453c`](https://github.com/withastro/starlight/commit/fab453c27a26a3928c0b355306d45b313a5fc531) Thanks [@delucis](https://github.com/delucis)! - Design tweak: larger sidebar text with more spacing

- [#134](https://github.com/withastro/starlight/pull/134) [`5f4acdf`](https://github.com/withastro/starlight/commit/5f4acdf75102f4431f5c60f65912db8d690b098c) Thanks [@Yan-Thomas](https://github.com/Yan-Thomas)! - Add Portuguese language support

- [`8805fbf`](https://github.com/withastro/starlight/commit/8805fbf30a2c26208aaf6d29ee53586f2dbf6cce) Thanks [@delucis](https://github.com/delucis)! - Add box-shadow to prev/next page links as per designs

- [`81ef58e`](https://github.com/withastro/starlight/commit/81ef58eac2a53672773d7d564068539190960127) Thanks [@delucis](https://github.com/delucis)! - Design tweak: slightly less horizontal padding in header component on narrower viewports

- [`8c103b3`](https://github.com/withastro/starlight/commit/8c103b3b44e4b91159f8225fffdf9ba843f9c395) Thanks [@delucis](https://github.com/delucis)! - Design tweak: pad bottom of page content slightly

- [#129](https://github.com/withastro/starlight/pull/129) [`bbcb277`](https://github.com/withastro/starlight/commit/bbcb277591514705fcc39665068aa331cfa2a653) Thanks [@delucis](https://github.com/delucis)! - Fix bug setting writing direction from a single root locale

## 0.0.18

### Patch Changes

- [`a76ae4d`](https://github.com/withastro/starlight/commit/a76ae4d4c459eae1690ed7fe6d4f4debb0137975) Thanks [@delucis](https://github.com/delucis)! - Add new icons for use in starter project

## 0.0.17

### Patch Changes

- [#107](https://github.com/withastro/starlight/pull/107) [`2f2d3ee`](https://github.com/withastro/starlight/commit/2f2d3eed1e7ed48d75205cfc3169719da7fdae1a) Thanks [@delucis](https://github.com/delucis)! - Small CSS size optimisation

- [#105](https://github.com/withastro/starlight/pull/105) [`55fec5d`](https://github.com/withastro/starlight/commit/55fec5d7e15da0e7365cee196d091bf5d15129c9) Thanks [@delucis](https://github.com/delucis)! - Add `<Card>` and `<CardGrid>` components for landing pages and other uses

## 0.0.16

### Patch Changes

- [#103](https://github.com/withastro/starlight/pull/103) [`ccb919d`](https://github.com/withastro/starlight/commit/ccb919d6580955e3428430a704f4a33fbc55a78d) Thanks [@delucis](https://github.com/delucis)! - Support adding a hero section to pages

- [#101](https://github.com/withastro/starlight/pull/101) [`6a2c0df`](https://github.com/withastro/starlight/commit/6a2c0df4d5586b70b46c854061df67b028e73630) Thanks [@TheOtterlord](https://github.com/TheOtterlord)! - Add better error messages for starlight config

## 0.0.15

### Patch Changes

- [`ded79af`](https://github.com/withastro/starlight/commit/ded79af43fad5ae0ec35739f655bf9e0c141a559) Thanks [@delucis](https://github.com/delucis)! - Add missing skip link to 404 page

- [#99](https://github.com/withastro/starlight/pull/99) [`d162b2f`](https://github.com/withastro/starlight/commit/d162b2fc0795248fa89d45f2e5d4207126a59256) Thanks [@delucis](https://github.com/delucis)! - Fix “next page” arrow showing on pages not in sidebar

- [#99](https://github.com/withastro/starlight/pull/99) [`d162b2f`](https://github.com/withastro/starlight/commit/d162b2fc0795248fa89d45f2e5d4207126a59256) Thanks [@delucis](https://github.com/delucis)! - Add support for a “splash” layout

- [#99](https://github.com/withastro/starlight/pull/99) [`d162b2f`](https://github.com/withastro/starlight/commit/d162b2fc0795248fa89d45f2e5d4207126a59256) Thanks [@delucis](https://github.com/delucis)! - Support hiding right sidebar table of contents

- [#99](https://github.com/withastro/starlight/pull/99) [`d162b2f`](https://github.com/withastro/starlight/commit/d162b2fc0795248fa89d45f2e5d4207126a59256) Thanks [@delucis](https://github.com/delucis)! - Move edit page link to page footer so it is accessible on mobile

## 0.0.14

### Patch Changes

- [#95](https://github.com/withastro/starlight/pull/95) [`de24b54`](https://github.com/withastro/starlight/commit/de24b54971577912979a3fb67570f4c95efe27a6) Thanks [@delucis](https://github.com/delucis)! - Support translations in sidebar config

- [#97](https://github.com/withastro/starlight/pull/97) [`2d51762`](https://github.com/withastro/starlight/commit/2d517623fb8670d4e7f2656eacff0d5beb27d95a) Thanks [@morinokami](https://github.com/morinokami)! - Add Japanese language support

## 0.0.13

### Patch Changes

- [`8688778`](https://github.com/withastro/starlight/commit/86887786d158e4cdb9e4bd021b2232eb6dba284c) Thanks [@delucis](https://github.com/delucis)! - Fix small CSS compatibility issue

- [#93](https://github.com/withastro/starlight/pull/93) [`c6d7960`](https://github.com/withastro/starlight/commit/c6d7960c8673886eb2b17843e78a897133c05fe2) Thanks [@delucis](https://github.com/delucis)! - Fix default locale routing bug when not using root locale

- [`d8a171b`](https://github.com/withastro/starlight/commit/d8a171b6b45c73151485fe8f08630fb6a1cc12a6) Thanks [@delucis](https://github.com/delucis)! - Fix autogenerated sidebar bug with index routes in subdirectories

- [`d8b9f32`](https://github.com/withastro/starlight/commit/d8b9f3260daaceed8a31eedcc44bd00733f96254) Thanks [@delucis](https://github.com/delucis)! - Fix false positive in sidebar autogeneration logic

- [#92](https://github.com/withastro/starlight/pull/92) [`02821d2`](https://github.com/withastro/starlight/commit/02821d2c8a58c485697cb8f0770c6ba63e709b2a) Thanks [@delucis](https://github.com/delucis)! - Update Pagefind to latest v1 alpha

- [`51fe914`](https://github.com/withastro/starlight/commit/51fe91468fea125ec33cb6d6b1b66f147302fdc0) Thanks [@delucis](https://github.com/delucis)! - Guarantee route and autogenerated sidebar sort order

- [`116c4f5`](https://github.com/withastro/starlight/commit/116c4f5eb0ddf4dddbd10005bc72a7e6cb880a67) Thanks [@delucis](https://github.com/delucis)! - Fix minor dev layout bug in Search modal for RTL languages

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
