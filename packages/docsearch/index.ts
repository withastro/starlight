import type { StarlightPlugin } from '@astrojs/starlight/types';
import type docsearch from '@docsearch/js';
import type { AstroUserConfig, ViteUserConfig } from 'astro';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
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
		/**
		 * A JavaScript module containing a default export. These options
		 * are merged with other configuration options and provided to
		 * the DocSearch library.
		 *
		 * In the event that a configuration option exists in both,
		 * for example in the plugin options and the module, the
		 * value in the module will be used.
		 *
		 * It can be used to configure options that are not serializable,
		 * such as `transformSearchClient` or `resultsFooterComponent`.
		 *
		 * Supports local JS files relative to the root of your project,
		 * e.g. `'/src/docsearch.js'`, and JS you installed as an npm
		 * module, e.g. `'@company/docsearch-config'`.
		 *
		 * @see https://docsearch.algolia.com/docs/api
		 * @example
		 * // astro.config.mjs
		 * starlightDocSearch({
		 *   // ...
		 *   clientOptionsModule: "./src/config/docsearch.js",
		 * })
		 *
		 * // src/config/docsearch.js
		 * export default {
		 *  getMissingResultsUrl({ query }) {
		 *       return `https://github.com/algolia/docsearch/issues/new?title=${query}`;
		 *   },
		 * }
		 */
		clientOptionsModule: z.string().optional(),
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
						'astro:config:setup': ({ config, updateConfig }) => {
							updateConfig({
								vite: {
									plugins: [vitePluginDocSearch(config.root, opts)],
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
function vitePluginDocSearch(root: URL, config: DocSearchConfig): VitePlugin {
	const moduleId = 'virtual:starlight/docsearch-config';
	const resolvedModuleId = `\0${moduleId}`;

	const resolveId = (id: string, base = root) =>
		JSON.stringify(id.startsWith('.') ? resolve(fileURLToPath(base), id) : id);

	const moduleContent = `
	${
		config.clientOptionsModule
			? `import moduleConfig from ${resolveId(config.clientOptionsModule)};`
			: 'const moduleConfig = {};'
	}
	const userConfig = ${JSON.stringify(config)};

	const config = {
		...userConfig,
		...moduleConfig,
	};
	
	export default config;
	`;

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
