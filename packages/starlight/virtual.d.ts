declare module 'virtual:starlight/user-config' {
	const Config: import('./types').StarlightConfig;
	export default Config;
}

declare module 'virtual:starlight/plugin-translations' {
	const PluginTranslations: import('./utils/plugins').PluginTranslations;
	export default PluginTranslations;
}

// TODO: Technically, we could move back this module declaration to `virtual-internal.d.ts` when
// `utils/translations.ts` no longer need to import project context. Altho, we should not aim for
// such refactor right now as shipping Starlight in JavaScript rather than TypeScript will
// entirely eliminate such issue and the need for private and public declaration files for virtual
// modules.
// @see https://github.com/withastro/starlight/pull/3572
declare module 'virtual:starlight/project-context' {
	const ProjectContext: {
		root: string;
		srcDir: string;
		trailingSlash: import('astro').AstroConfig['trailingSlash'];
		build: {
			format: import('astro').AstroConfig['build']['format'];
		};
	};
	export default ProjectContext;
}
