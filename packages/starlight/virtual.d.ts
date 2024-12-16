declare module 'virtual:starlight/user-config' {
	const Config: import('./types').StarlightConfig;
	export default Config;
}

declare module 'virtual:starlight/plugin-translations' {
	const PluginTranslations: import('./utils/plugins').PluginTranslations;
	export default PluginTranslations;
}
