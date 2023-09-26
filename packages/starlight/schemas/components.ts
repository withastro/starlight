import { z } from 'astro/zod';

export function ComponentConfigSchema() {
	return z
		.object({
			Banner: z.string().default('@astrojs/starlight/components/Banner.astro'),
			ContentPanel: z.string().default('@astrojs/starlight/components/ContentPanel.astro'),
			PageTitle: z.string().default('@astrojs/starlight/components/PageTitle.astro'),
			FallbackContentNotice: z
				.string()
				.default('@astrojs/starlight/components/FallbackContentNotice.astro'),

			/**
			 * Footer component displayed at the bottom of each documentation page.
			 * The default implementation displays `<LastUpdated />`, `<Pagination />`, and `<EditLink />`.
			 */
			Footer: z.string().default('@astrojs/starlight/components/Footer.astro'),
			LastUpdated: z.string().default('@astrojs/starlight/components/LastUpdated.astro'),
			Pagination: z.string().default('@astrojs/starlight/components/Pagination.astro'),
			EditLink: z.string().default('@astrojs/starlight/components/EditLink.astro'),

			/**
			 * Header component displayed at the top of every page.
			 * The default implementation displays `<SiteTitle />`, `<Search />`, `<SocialIcons />`,
			 * `<ThemeSelect />`, and `<LanguageSelect />`.
			 */
			Header: z.string().default('@astrojs/starlight/components/Header.astro'),
			SiteTitle: z.string().default('@astrojs/starlight/components/SiteTitle.astro'),
			Search: z.string().default('@astrojs/starlight/components/Search.astro'),
			SocialIcons: z.string().default('@astrojs/starlight/components/SocialIcons.astro'),
			ThemeSelect: z.string().default('@astrojs/starlight/components/ThemeSelect.astro'),
			LanguageSelect: z.string().default('@astrojs/starlight/components/LanguageSelect.astro'),

			HeadSEO: z.string().default('@astrojs/starlight/components/HeadSEO.astro'),
			Hero: z.string().default('@astrojs/starlight/components/Hero.astro'),
			MarkdownContent: z.string().default('@astrojs/starlight/components/MarkdownContent.astro'),

			RightSidebar: z.string().default('@astrojs/starlight/components/RightSidebar.astro'),
			RightSidebarPanel: z
				.string()
				.default('@astrojs/starlight/components/RightSidebarPanel.astro'),
			TableOfContents: z.string().default('@astrojs/starlight/components/TableOfContents.astro'),
			MobileTableOfContents: z
				.string()
				.default('@astrojs/starlight/components/TableOfContents/MobileTableOfContents.astro'),

			Sidebar: z.string().default('@astrojs/starlight/components/Sidebar.astro'),
			SkipLink: z.string().default('@astrojs/starlight/components/SkipLink.astro'),
			ThemeProvider: z.string().default('@astrojs/starlight/components/ThemeProvider.astro'),

			PageFrame: z.string().default('@astrojs/starlight/components/PageFrame.astro'),
			MobileMenuToggle: z.string().default('@astrojs/starlight/components/MobileMenuToggle.astro'),

			TwoColumnContent: z.string().default('@astrojs/starlight/components/TwoColumnContent.astro'),
		})
		.default({});
}
