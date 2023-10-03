import { z } from 'astro/zod';

export function ComponentConfigSchema() {
	return z
		.object({
			/*
			HEAD ----------------------------------------------------------------------------------------
			*/

			/**
			 * Component rendered inside each page’s `<head>`.
			 * Includes important tags including `<title>`, and `<meta charset="utf-8">`.
			 *
			 * Override this component as a last resort. Prefer the `head` option Starlight config if possible.
			 */
			Head: z.string().default('@astrojs/starlight/components/Head.astro'),

			/**
			 * Component rendered inside `<head>` that sets up dark/light theme support.
			 * The default implementation includes an inline script and a `<template>` used by the
			 * script in `ThemeSelect.astro`.
			 */
			ThemeProvider: z.string().default('@astrojs/starlight/components/ThemeProvider.astro'),

			/*
			BODY ----------------------------------------------------------------------------------------
			*/

			/**
			 * Component rendered as the first element inside `<body>` which links to the main page
			 * content for accessibility. The default implementation is hidden until a user focuses it
			 * by tabbing with their keyboard.
			 */
			SkipLink: z.string().default('@astrojs/starlight/components/SkipLink.astro'),

			/*
			LAYOUT --------------------------------------------------------------------------------------
			*/

			/**
			 * Layout component wrapped around most of the page content.
			 * The default implementation sets up the header–sidebar–main layout and includes
			 * `header` and `sidebar` named slots along with a default slot for the main content.
			 * It also renders `<MobileMenuToggle />` to support toggling the sidebar navigation
			 * on small (mobile) viewports.
			 */
			PageFrame: z.string().default('@astrojs/starlight/components/PageFrame.astro'),
			/**
			 * Component rendered inside `<PageFrame>` that is responsible for toggling the
			 * sidebar navigation on small (mobile) viewports.
			 */
			MobileMenuToggle: z.string().default('@astrojs/starlight/components/MobileMenuToggle.astro'),

			/**
			 * Layout component wrapped around the main content column and right sidebar (table of contents).
			 * The default implementation handles the switch between a single-column, small-viewport layout
			 * and a two-column, larger-viewport layout.
			 */
			TwoColumnContent: z.string().default('@astrojs/starlight/components/TwoColumnContent.astro'),

			/*
			HEADER --------------------------------------------------------------------------------------
			*/

			/**
			 * Header component displayed at the top of every page.
			 * The default implementation displays `<SiteTitle />`, `<Search />`, `<SocialIcons />`,
			 * `<ThemeSelect />`, and `<LanguageSelect />`.
			 */
			Header: z.string().default('@astrojs/starlight/components/Header.astro'),
			/**
			 * Component rendered at the start of the site header to render the site title.
			 * The default implementation includes logic for rendering logos defined in Starlight config.
			 */
			SiteTitle: z.string().default('@astrojs/starlight/components/SiteTitle.astro'),
			/**
			 * Component used to render Starlight’s search UI. The default implementation includes the
			 * button in the header and the code for displaying a search modal when it is clicked.
			 */
			Search: z.string().default('@astrojs/starlight/components/Search.astro'),
			/**
			 * Component rendered in the site header including social icon links. The default
			 * implementation uses the `social` option in Starlight config to render icons and links.
			 */
			SocialIcons: z.string().default('@astrojs/starlight/components/SocialIcons.astro'),
			/**
			 * Component rendered in the site header that allows users to select their preferred color scheme.
			 */
			ThemeSelect: z.string().default('@astrojs/starlight/components/ThemeSelect.astro'),
			/**
			 * Component rendered in the site header that allows users to switch to a different language.
			 */
			LanguageSelect: z.string().default('@astrojs/starlight/components/LanguageSelect.astro'),

			/*
			SIDEBAR -------------------------------------------------------------------------------------
			*/

			/**
			 * Component rendered before page content that contains global navigation.
			 * The default implementation displays as a sidebar on wide enough viewports and inside a
			 * drop-down menu on small (mobile) viewports. It also renders `<MobileMenuFooter />` to
			 * show additional items inside the mobile menu.
			 */
			Sidebar: z.string().default('@astrojs/starlight/components/Sidebar.astro'),
			/**
			 * Component rendered at the bottom of the mobile drop-down menu.
			 * The default implementation renders `<ThemeSelect />` and `<LanguageSelect />`.
			 */
			MobileMenuFooter: z.string().default('@astrojs/starlight/components/MobileMenuFooter.astro'),

			/*
			TOC -----------------------------------------------------------------------------------------
			*/

			/**
			 * Component rendered before the main page’s content to display a table of contents.
			 * The default implementation renders `<TableOfContents />` and `<MobileTableOfContents />`.
			 */
			RightSidebar: z.string().default('@astrojs/starlight/components/RightSidebar.astro'),
			/**
			 * Component that renders the current page’s table of contents on wider viewports.
			 */
			TableOfContents: z.string().default('@astrojs/starlight/components/TableOfContents.astro'),
			/**
			 * Component that renders the current page’s table of contents on small (mobile) viewports.
			 */
			MobileTableOfContents: z
				.string()
				.default('@astrojs/starlight/components/MobileTableOfContents.astro'),

			/*
			CONTENT HEADER ------------------------------------------------------------------------------
			*/

			/**
			 * Banner component rendered at the top of each page. The default implementation uses the
			 * page’s `banner` frontmatter value to decide whether or not to render.
			 */
			Banner: z.string().default('@astrojs/starlight/components/Banner.astro'),

			/** Layout component used to wrap sections of the main content column. */
			ContentPanel: z.string().default('@astrojs/starlight/components/ContentPanel.astro'),

			/**
			 * Component containing the `<h1>` element for the current page.
			 *
			 * Implementations should ensure they set `id="_top"` on the `<h1>` element as in the default
			 * implementation.
			 */
			PageTitle: z.string().default('@astrojs/starlight/components/PageTitle.astro'),

			/**
			 * Notice displayed to users on pages where a translation for the current language is not
			 * available. Only used on multilingual sites.
			 */
			FallbackContentNotice: z
				.string()
				.default('@astrojs/starlight/components/FallbackContentNotice.astro'),

			/**
			 * Component rendered at the top of the page when `hero` is set in frontmatter. The default
			 * implementation shows a large title, tagline, and call-to-action links alongside an optional image.
			 */
			Hero: z.string().default('@astrojs/starlight/components/Hero.astro'),

			/*
			CONTENT -------------------------------------------------------------------------------------
			*/

			/**
			 * Component rendered around each page’s main content.
			 * The default implementation sets up basic styles to apply to Markdown content.
			 */
			MarkdownContent: z.string().default('@astrojs/starlight/components/MarkdownContent.astro'),

			/*
			CONTENT FOOTER ------------------------------------------------------------------------------
			*/

			/**
			 * Footer component displayed at the bottom of each documentation page.
			 * The default implementation displays `<LastUpdated />`, `<Pagination />`, and `<EditLink />`.
			 */
			Footer: z.string().default('@astrojs/starlight/components/Footer.astro'),
			/**
			 * Component rendered in the page footer to display the last-updated date.
			 */
			LastUpdated: z.string().default('@astrojs/starlight/components/LastUpdated.astro'),
			/**
			 * Component rendered in the page footer to display navigation arrows between previous/next pages.
			 */
			Pagination: z.string().default('@astrojs/starlight/components/Pagination.astro'),
			/**
			 * Component rendered in the page footer to display a link to where the page can be edited.
			 */
			EditLink: z.string().default('@astrojs/starlight/components/EditLink.astro'),
		})
		.default({});
}
