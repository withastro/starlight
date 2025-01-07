declare module 'virtual:starlight/user-config' {
	const Config: import('./types').StarlightConfig;
	export default Config;
}

declare module 'virtual:starlight/plugin-translations' {
	const PluginTranslations: import('./utils/plugins').PluginTranslations;
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
