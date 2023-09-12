import { z } from 'astro/zod';

export function ComponentConfigSchema() {
	return z
		.object({
			Banner: z.string().default('@astrojs/starlight/components/Banner.astro'),
			ContentPanel: z.string().default('@astrojs/starlight/components/ContentPanel.astro'),
			FallbackContentNotice: z
				.string()
				.default('@astrojs/starlight/components/FallbackContentNotice.astro'),
			Footer: z.string().default('@astrojs/starlight/components/Footer.astro'),
			Header: z.string().default('@astrojs/starlight/components/Header.astro'),
			HeadSEO: z.string().default('@astrojs/starlight/components/HeadSEO.astro'),
			Hero: z.string().default('@astrojs/starlight/components/Hero.astro'),
			MarkdownContent: z.string().default('@astrojs/starlight/components/MarkdownContent.astro'),
			RightSidebar: z.string().default('@astrojs/starlight/components/RightSidebar.astro'),
			Sidebar: z.string().default('@astrojs/starlight/components/Sidebar.astro'),
			SkipLink: z.string().default('@astrojs/starlight/components/SkipLink.astro'),
			ThemeProvider: z.string().default('@astrojs/starlight/components/ThemeProvider.astro'),
			PageFrame: z.string().default('@astrojs/starlight/layout/PageFrame.astro'),
			TwoColumnContent: z.string().default('@astrojs/starlight/layout/TwoColumnContent.astro'),
		})
		.default({});
}
