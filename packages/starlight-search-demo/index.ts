import type { StarlightPlugin } from '@astrojs/starlight/types';
import type { AstroUserConfig, ViteUserConfig } from 'astro';

/** The Starlight Search Demo plugin. */
export default function starlightSearchDemo(opts: StarlightSearchDemoConfig): StarlightPlugin {
	return {
		name: 'starlight-search-demo',
		plugin({ addIntegration, config, logger, updateConfig }) {
			// If the user has already has a custom override for the Search component, don't override it.
			if (config.components?.Search) {
				if (!opts.ignoreComponentOverridesWarning) {
					logger.warn(
						`It looks like you already have a \`Search\` component override. To render \`@astrojs/starlight-search-demo\`, you can either:
		- Remove the existing override for the \`Search\` component from your configuration
		- Import and render \`@astrojs/starlight-search-demo/overrides/Search.astro\` in your custom override\n`
					);
				}
			} else {
				// Otherwise, add the Search component override to the user's configuration.
				updateConfig({
					components: {
						...config.components,
						Search: '@astrojs/starlight-search-demo/overrides/Search.astro',
					},
				});
			}

			// Add a custom Astro integration that will inject a Vite plugin to expose the Starlight
			// Search Demo config via virtual modules.
			addIntegration({
				name: 'starlight-search-demo-integration',
				hooks: {
					'astro:config:setup': ({ updateConfig }) => {
						updateConfig({
							vite: {
								plugins: [vitePluginStarlightSearchDemo(opts)],
							},
						} satisfies AstroUserConfig);
					},
				},
			});
		},
	};
}

/** Vite plugin that exposes the Starlight Search Demo config via virtual modules. */
function vitePluginStarlightSearchDemo(config: StarlightSearchDemoConfig): VitePlugin {
	const moduleId = 'virtual:starlight-search-demo-config';
	const resolvedModuleId = `\0${moduleId}`;
	const moduleContent = `export default ${JSON.stringify(config)}`;

	return {
		name: 'vite-plugin-starlight-search-demo-config',
		load(id) {
			return id === resolvedModuleId ? moduleContent : undefined;
		},
		resolveId(id) {
			return id === moduleId ? resolvedModuleId : undefined;
		},
	};
}

export interface StarlightSearchDemoConfig {
	apiKey: string;
	ignoreComponentOverridesWarning?: boolean;
}

type VitePlugin = NonNullable<ViteUserConfig['plugins']>[number];
