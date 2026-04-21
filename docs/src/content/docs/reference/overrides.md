---
title: Overrides Reference
description: An overview of the components and component props supported by Starlight overrides.
tableOfContents:
  maxHeadingLevel: 4
---

You can override Starlight’s built-in components by providing paths to replacement components in Starlight’s [`components`](/reference/configuration/#components) configuration option.
This page lists all components available to override and links to their default implementations on GitHub.

Learn more in the [Guide to Overriding Components](/guides/overriding-components/).

## Components

### Head

These components are rendered inside each page’s `<head>` element.
They should only include [elements permitted inside `<head>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head#see_also).

#### `Head`

**Default component:** [`Head.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Head.astro)

Component rendered inside each page’s `<head>`.

Override this component as a last resort.
Prefer the [`head` config option](/reference/configuration/#head), the [`head` frontmatter field](/reference/frontmatter/#head), or a [route data middleware](/guides/route-data/#customizing-route-data) to customize the route data rendered by the default component if possible.

#### `ThemeProvider`

**Default component:** [`ThemeProvider.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/ThemeProvider.astro)

Component rendered inside `<head>` that sets up dark/light theme support.
The default implementation includes an inline script and a `<template>` used by the script in [`<ThemeSelect />`](#themeselect).

---

### Accessibility

#### `SkipLink`

**Default component:** [`SkipLink.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/SkipLink.astro)

Component rendered as the first element inside `<body>` which links to the main page content for accessibility.
The default implementation is hidden until a user focuses it by tabbing with their keyboard.

---

### Layout

These components are responsible for laying out Starlight’s components and managing views across different breakpoints.
Overriding these comes with significant complexity.
When possible, prefer overriding a lower-level component.

#### `PageFrame`

**Default component:** [`PageFrame.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/PageFrame.astro)  
**Named slots:** `header`, `sidebar`

Layout component wrapped around most of the page content.
The default implementation sets up the header–sidebar–main layout and includes `header` and `sidebar` named slots along with a default slot for the main content.
It also renders [`<MobileMenuToggle />`](#mobilemenutoggle) to support toggling the sidebar navigation on small (mobile) viewports.

#### `MobileMenuToggle`

**Default component:** [`MobileMenuToggle.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/MobileMenuToggle.astro)

Component rendered inside [`<PageFrame>`](#pageframe) that is responsible for toggling the sidebar navigation on small (mobile) viewports.

#### `TwoColumnContent`

**Default component:** [`TwoColumnContent.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/TwoColumnContent.astro)  
**Named slot:** `right-sidebar`

Layout component wrapped around the main content column and right sidebar (table of contents).
The default implementation handles the switch between a single-column, small-viewport layout and a two-column, larger-viewport layout.

---

### Header

These components render Starlight’s top navigation bar.

#### `Header`

**Default component:** [`Header.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Header.astro)

Header component displayed at the top of every page.
The default implementation displays [`<SiteTitle />`](#sitetitle), [`<Search />`](#search), [`<SocialIcons />`](#socialicons), [`<ThemeSelect />`](#themeselect), and [`<LanguageSelect />`](#languageselect).

#### `SiteTitle`

**Default component:** [`SiteTitle.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/SiteTitle.astro)

Component rendered at the start of the site header to render the site title.
The default implementation includes logic for rendering logos defined in Starlight config.

#### `Search`

**Default component:** [`Search.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Search.astro)

Component used to render Starlight’s search UI.
The default implementation includes the button in the header and the code for displaying a search modal when it is clicked and loading [Pagefind’s UI](https://pagefind.app/).

When [`pagefind`](/reference/configuration/#pagefind) is disabled, the default search component will not be rendered.
However, if you override `Search`, your custom component will always be rendered even if the `pagefind` configuration option is `false`.
This allows you to add UI for alternative search providers when disabling Pagefind.

#### `SocialIcons`

**Default component:** [`SocialIcons.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/SocialIcons.astro)

Component rendered in the site header including social icon links.
The default implementation uses the [`social`](/reference/configuration/#social) option in Starlight config to render icons and links.

#### `ThemeSelect`

**Default component:** [`ThemeSelect.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/ThemeSelect.astro)

Component rendered in the site header that allows users to select their preferred color scheme.

#### `LanguageSelect`

**Default component:** [`LanguageSelect.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/LanguageSelect.astro)

Component rendered in the site header that allows users to switch to a different language.

---

### Global Sidebar

Starlight’s global sidebar includes the main site navigation.
On narrow viewports this is hidden behind a drop-down menu.

#### `Sidebar`

**Default component:** [`Sidebar.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Sidebar.astro)

Component rendered before page content that contains global navigation.
The default implementation displays as a sidebar on wide enough viewports and inside a drop-down menu on small (mobile) viewports.
It also renders [`<MobileMenuFooter />`](#mobilemenufooter) to show additional items inside the mobile menu.

#### `MobileMenuFooter`

**Default component:** [`MobileMenuFooter.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/MobileMenuFooter.astro)

Component rendered at the bottom of the mobile drop-down menu.
The default implementation renders [`<ThemeSelect />`](#themeselect) and [`<LanguageSelect />`](#languageselect).

---

### Page Sidebar

Starlight’s page sidebar is responsible for displaying a table of contents outlining the current page’s subheadings.
On narrow viewports this collapse into a sticky, drop-down menu.

#### `PageSidebar`

**Default component:** [`PageSidebar.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/PageSidebar.astro)

Component rendered before the main page’s content to display a table of contents.
The default implementation renders [`<TableOfContents />`](#tableofcontents) and [`<MobileTableOfContents />`](#mobiletableofcontents).

#### `TableOfContents`

**Default component:** [`TableOfContents.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/TableOfContents.astro)

Component that renders the current page’s table of contents on wider viewports.

#### `MobileTableOfContents`

**Default component:** [`MobileTableOfContents.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/MobileTableOfContents.astro)

Component that renders the current page’s table of contents on small (mobile) viewports.

---

### Content

These components are rendered in the main column of page content.

#### `Banner`

**Default component:** [`Banner.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Banner.astro)

Banner component rendered at the top of each page.
The default implementation uses the page’s [`banner`](/reference/frontmatter/#banner) frontmatter value to decide whether or not to render.

#### `ContentPanel`

**Default component:** [`ContentPanel.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/ContentPanel.astro)

Layout component used to wrap sections of the main content column.

#### `PageTitle`

**Default component:** [`PageTitle.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/PageTitle.astro)

Component containing the `<h1>` element for the current page.

Implementations should ensure they set `id="_top"` on the `<h1>` element as in the default implementation.

#### `DraftContentNotice`

**Default component:** [`DraftContentNotice.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/DraftContentNotice.astro)

Notice displayed to users during development when the current page is marked as a draft.

#### `FallbackContentNotice`

**Default component:** [`FallbackContentNotice.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/FallbackContentNotice.astro)

Notice displayed to users on pages where a translation for the current language is not available.
Only used on multilingual sites.

#### `Hero`

**Default component:** [`Hero.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Hero.astro)

Component rendered at the top of the page when [`hero`](/reference/frontmatter/#hero) is set in frontmatter.
The default implementation shows a large title, tagline, and call-to-action links alongside an optional image.

#### `MarkdownContent`

**Default component:** [`MarkdownContent.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/MarkdownContent.astro)

Component rendered around each page’s main content.
The default implementation sets up basic styles to apply to Markdown content.

The Markdown content styles are also exposed in `@astrojs/starlight/style/markdown.css` and scoped to the `.sl-markdown-content` CSS class.

---

### Footer

These components are rendered at the bottom of the main column of page content.

#### `Footer`

**Default component:** [`Footer.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Footer.astro)

Footer component displayed at the bottom of each page.
The default implementation displays [`<LastUpdated />`](#lastupdated), [`<Pagination />`](#pagination), and [`<EditLink />`](#editlink).

#### `LastUpdated`

**Default component:** [`LastUpdated.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/LastUpdated.astro)

Component rendered in the page footer to display the last-updated date.

#### `EditLink`

**Default component:** [`EditLink.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/EditLink.astro)

Component rendered in the page footer to display a link to where the page can be edited.

#### `Pagination`

**Default component:** [`Pagination.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Pagination.astro)

Component rendered in the page footer to display navigation arrows between previous/next pages.
