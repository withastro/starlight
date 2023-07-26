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
