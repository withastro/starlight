declare module 'virtual:starlight/user-config' {
	const Config: import('./src/types').StarlightConfig;
	export default Config;
}

declare module 'virtual:starlight/plugin-translations' {
	const PluginTranslations: import('./src/utils/plugins').PluginTranslations;
	export default PluginTranslations;
}

declare module 'virtual:starlight/project-context' {
	const ProjectContext: {
		root: string;
		srcDir: string;
		trailingSlash: import('astro').AstroConfig['trailingSlash'];
		build: {
			format: import('astro').AstroConfig['build']['format'];
		};
		legacyCollections: boolean;
	};
	export default ProjectContext;
}

declare module 'virtual:starlight/git-info' {
	export function getNewestCommitDate(file: string): Date;
}

declare module 'virtual:starlight/user-css' {}

declare module 'virtual:starlight/optional-css' {}

declare module 'virtual:starlight/user-images' {
	type ImageMetadata = import('astro').ImageMetadata;
	export const logos: {
		dark?: ImageMetadata;
		light?: ImageMetadata;
	};
}

declare module 'virtual:starlight/collection-config' {
	export const collections: import('astro:content').ContentConfig['collections'] | undefined;
}

declare module 'virtual:starlight/route-middleware' {
	export const routeMiddleware: Array<import('./src/route-data').RouteMiddlewareHandler>;
}

declare module 'virtual:starlight/pagefind-config' {
	export const pagefindUserConfig: Partial<
		Extract<import('./src/types').StarlightConfig['pagefind'], object>
	>;
}

declare module 'virtual:starlight/components/Banner' {
	const Banner: typeof import('./src/components/Banner.astro').default;
	export default Banner;
}
declare module 'virtual:starlight/components/ContentPanel' {
	const ContentPanel: typeof import('./src/components/ContentPanel.astro').default;
	export default ContentPanel;
}
declare module 'virtual:starlight/components/PageTitle' {
	const PageTitle: typeof import('./src/components/PageTitle.astro').default;
	export default PageTitle;
}
declare module 'virtual:starlight/components/FallbackContentNotice' {
	const FallbackContentNotice: typeof import('./src/components/FallbackContentNotice.astro').default;
	export default FallbackContentNotice;
}
declare module 'virtual:starlight/components/DraftContentNotice' {
	const DraftContentNotice: typeof import('./src/components/DraftContentNotice.astro').default;
	export default DraftContentNotice;
}

declare module 'virtual:starlight/components/Footer' {
	const Footer: typeof import('./src/components/Footer.astro').default;
	export default Footer;
}
declare module 'virtual:starlight/components/LastUpdated' {
	const LastUpdated: typeof import('./src/components/LastUpdated.astro').default;
	export default LastUpdated;
}
declare module 'virtual:starlight/components/Pagination' {
	const Pagination: typeof import('./src/components/Pagination.astro').default;
	export default Pagination;
}
declare module 'virtual:starlight/components/EditLink' {
	const EditLink: typeof import('./src/components/EditLink.astro').default;
	export default EditLink;
}

declare module 'virtual:starlight/components/Header' {
	const Header: typeof import('./src/components/Header.astro').default;
	export default Header;
}
declare module 'virtual:starlight/components/LanguageSelect' {
	const LanguageSelect: typeof import('./src/components/LanguageSelect.astro').default;
	export default LanguageSelect;
}
declare module 'virtual:starlight/components/Search' {
	const Search: typeof import('./src/components/Search.astro').default;
	export default Search;
}
declare module 'virtual:starlight/components/SiteTitle' {
	const SiteTitle: typeof import('./src/components/SiteTitle.astro').default;
	export default SiteTitle;
}
declare module 'virtual:starlight/components/SocialIcons' {
	const SocialIcons: typeof import('./src/components/SocialIcons.astro').default;
	export default SocialIcons;
}
declare module 'virtual:starlight/components/ThemeSelect' {
	const ThemeSelect: typeof import('./src/components/ThemeSelect.astro').default;
	export default ThemeSelect;
}

declare module 'virtual:starlight/components/Head' {
	const Head: typeof import('./src/components/Head.astro').default;
	export default Head;
}
declare module 'virtual:starlight/components/Hero' {
	const Hero: typeof import('./src/components/Hero.astro').default;
	export default Hero;
}
declare module 'virtual:starlight/components/MarkdownContent' {
	const MarkdownContent: typeof import('./src/components/MarkdownContent.astro').default;
	export default MarkdownContent;
}

declare module 'virtual:starlight/components/PageSidebar' {
	const PageSidebar: typeof import('./src/components/PageSidebar.astro').default;
	export default PageSidebar;
}
declare module 'virtual:starlight/components/TableOfContents' {
	const TableOfContents: typeof import('./src/components/TableOfContents.astro').default;
	export default TableOfContents;
}
declare module 'virtual:starlight/components/MobileTableOfContents' {
	const MobileTableOfContents: typeof import('./src/components/MobileTableOfContents.astro').default;
	export default MobileTableOfContents;
}

declare module 'virtual:starlight/components/Sidebar' {
	const Sidebar: typeof import('./src/components/Sidebar.astro').default;
	export default Sidebar;
}
declare module 'virtual:starlight/components/SkipLink' {
	const SkipLink: typeof import('./src/components/SkipLink.astro').default;
	export default SkipLink;
}
declare module 'virtual:starlight/components/ThemeProvider' {
	const ThemeProvider: typeof import('./src/components/ThemeProvider.astro').default;
	export default ThemeProvider;
}

declare module 'virtual:starlight/components/PageFrame' {
	const PageFrame: typeof import('./src/components/PageFrame.astro').default;
	export default PageFrame;
}
declare module 'virtual:starlight/components/MobileMenuToggle' {
	const MobileMenuToggle: typeof import('./src/components/MobileMenuToggle.astro').default;
	export default MobileMenuToggle;
}
declare module 'virtual:starlight/components/MobileMenuFooter' {
	const MobileMenuFooter: typeof import('./src/components/MobileMenuFooter.astro').default;
	export default MobileMenuFooter;
}

declare module 'virtual:starlight/components/TwoColumnContent' {
	const TwoColumnContent: typeof import('./src/components/TwoColumnContent.astro').default;
	export default TwoColumnContent;
}
