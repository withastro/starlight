import type { StarlightPlugin } from '@astrojs/starlight/types';
import type docsearch from '@docsearch/js';
import type { AstroUserConfig, ViteUserConfig } from 'astro';
import { z } from 'astro/zod';

type SearchOptions = Parameters<typeof docsearch>[0]['searchParameters'];

/** DocSearch configuration options. */
const DocSearchConfigSchema = z
	.object({
		// Required config without which DocSearch won’t work.
		/** Your Algolia application ID. */
		appId: z.string(),
		/** Your Algolia Search API key. */
		apiKey: z.string(),
		/** Your Algolia index name. */
		indexName: z.string(),
		// Optional DocSearch component config (only the serializable properties can be included here)
		/**
		 * The maximum number of results to display per search group.
		 * @default 5
		 */
		maxResultsPerGroup: z.number().optional(),
		/**
		 * Disable saving recent searches and favorites to the local storage.
		 * @default false
		 */
		disableUserPersonalization: z.boolean().optional(),
		/**
		 * Whether to enable the Algolia Insights plugin and send search events to your DocSearch index.
		 * @default false
		 */
		insights: z.boolean().optional(),
		/**
		 * The Algolia Search Parameters.
		 * @see https://www.algolia.com/doc/api-reference/search-api-parameters/
		 */
		searchParameters: z.custom<SearchOptions>(),
	})
	.strict();

type DocSearchUserConfig = z.input<typeof DocSearchConfigSchema>;
export type DocSearchConfig = z.output<typeof DocSearchConfigSchema>;

/** Starlight DocSearch plugin. */
export default function starlightDocSearch(userConfig: DocSearchUserConfig): StarlightPlugin {
	const opts = DocSearchConfigSchema.parse(userConfig);
	return {
		name: 'starlight-docsearch',
		hooks: {
			setup({ addIntegration, config, logger, updateConfig }) {
				// If the user has already has a custom override for the Search component, don't override it.
				if (config.components?.Search) {
					logger.warn(
						'It looks like you already have a `Search` component override in your Starlight configuration.'
					);
					logger.warn(
						'To render `@astrojs/starlight-docsearch`, remove the override for the `Search` component.\n'
					);
				} else {
					// Otherwise, add the Search component override to the user's configuration.
					updateConfig({
						pagefind: false,
						components: {
							...config.components,
							Search: '@astrojs/starlight-docsearch/DocSearch.astro',
						},
					});
				}

				// Add an Astro integration that injects a Vite plugin to expose
				// the DocSearch config via a virtual module.
				addIntegration({
					name: 'starlight-docsearch',
					hooks: {
						'astro:config:setup': ({ updateConfig }) => {
							updateConfig({
								vite: {
									plugins: [vitePluginDocSearch(opts)],
								},
							} satisfies AstroUserConfig);
						},
					},
				});
			},
		},
	};
}

/** Vite plugin that exposes the DocSearch config via virtual modules. */
function vitePluginDocSearch(config: DocSearchConfig): VitePlugin {
	const moduleId = 'virtual:starlight/docsearch-config';
	const resolvedModuleId = `\0${moduleId}`;
	const moduleContent = `export default ${JSON.stringify(config)}`;

	return {
		name: 'vite-plugin-starlight-docsearch-config',
		load(id) {
			return id === resolvedModuleId ? moduleContent : undefined;
		},
		resolveId(id) {
			return id === moduleId ? resolvedModuleId : undefined;
		},
	};
}

type VitePlugin = NonNullable<ViteUserConfig['plugins']>[number];
