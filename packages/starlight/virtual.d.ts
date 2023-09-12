declare module 'virtual:starlight/user-config' {
	const Config: import('./types').StarlightConfig;
	export default Config;
}
declare module 'virtual:starlight/project-context' {
	export default { root: string };
}

declare module 'virtual:starlight/user-css' {}

declare module 'virtual:starlight/user-images' {
	type ImageMetadata = import('astro').ImageMetadata;
	export const logos: {
		dark?: ImageMetadata;
		light?: ImageMetadata;
	};
}

declare module 'virtual:starlight/components' {
	export const Banner: typeof import('./components/Banner.astro').default;
	export const ContentPanel: typeof import('./components/ContentPanel.astro').default;
	export const FallbackContentNotice: typeof import('./components/FallbackContentNotice.astro').default;
	export const Footer: typeof import('./components/Footer.astro').default;
	export const Header: typeof import('./components/Header.astro').default;
	export const HeadSEO: typeof import('./components/HeadSEO.astro').default;
	export const Hero: typeof import('./components/Hero.astro').default;
	export const MarkdownContent: typeof import('./components/MarkdownContent.astro').default;
	export const RightSidebar: typeof import('./components/RightSidebar.astro').default;
	export const Sidebar: typeof import('./components/Sidebar.astro').default;
	export const SkipLink: typeof import('./components/SkipLink.astro').default;
	export const ThemeProvider: typeof import('./components/ThemeProvider.astro').default;
	export const PageFrame: typeof import('./layout/PageFrame.astro').default;
	export const TwoColumnContent: typeof import('./layout/TwoColumnContent.astro').default;
}
