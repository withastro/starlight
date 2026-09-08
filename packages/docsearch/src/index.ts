import type { StarlightPlugin } from '@astrojs/starlight/types';
import type docsearch from '@docsearch/js';
import type { AstroUserConfig, ViteUserConfig } from 'astro';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DocSearchConfigSchema } from './config';

const moduleId = 'virtual:starlight/docsearch-config';
const resolvedModuleId = `\0${moduleId}`;

// https://vite.dev/guide/api-plugin#hook-filters
const pluginResolveIdIdFilter = new RegExp(`^${moduleId}$`);
const pluginLoadIdFilter = new RegExp(`^${resolvedModuleId}$`);

export type DocSearchClientOptions = Omit<
	Parameters<typeof docsearch>[0],
	'container' | 'translations'
>;

interface DocSearchInlineUserConfig {
	/** Your Algolia application ID. */
	appId: string;
	/** Your Algolia Search API key. */
	apiKey: string;
	/** Your Algolia index name. */
	indexName: string;
	/**
	 * The maximum number of results to display per search group.
	 * @default 5
	 */
	maxResultsPerGroup?: number | undefined;
	/**
	 * Disable saving recent searches and favorites to the local storage.
	 * @default false
	 */
	disableUserPersonalization?: boolean | undefined;
	/**
	 * Whether to enable the Algolia Insights plugin and send search events to your DocSearch index.
	 * @default false
	 */
	insights?: boolean | undefined;
	/**
	 * The Algolia Search Parameters.
	 * @see https://www.algolia.com/doc/api-reference/search-api-parameters/
	 */
	searchParameters?: DocSearchClientOptions['searchParameters'] | undefined;
}

interface DocSearchModuleUserConfig {
	/**
	 * The path to a JavaScript or TypeScript file containing a default export of options to pass to
	 * the DocSearch client.
	 *
	 * The value can be a path to a local JS/TS file relative to the root of your project, e.g.
	 * `'/src/docsearch.js'`, or an npm module specifier for a package you installed, e.g.
	 * `'@company/docsearch-config'`.
	 *
	 * Use `clientOptionsModule` when you need to configure options that are not serializable, such
	 * as `transformSearchClient()` or `resultsFooterComponent()`.
	 *
	 * When `clientOptionsModule` is set, all options must be set via the module file. Other inline
	 * options passed to the plugin in `astro.config.mjs` will be ignored.
	 *
	 * @see https://docsearch.algolia.com/docs/api
	 *
	 * @example
	 * // astro.config.mjs
	 * // ...
	 * starlightDocSearch({ clientOptionsModule: './src/config/docsearch.ts' }),
	 * // ...
	 *
	 * // src/config/docsearch.ts
	 * import type { DocSearchClientOptions } from '@astrojs/starlight-docsearch';
	 *
	 * export default {
	 *   appId: '...',
	 *   apiKey: '...',
	 *   indexName: '...',
	 *   getMissingResultsUrl({ query }) {
	 *     return `https://github.com/algolia/docsearch/issues/new?title=${query}`;
	 *   },
	 * } satisfies DocSearchClientOptions;
	 */
	clientOptionsModule: string;
}

// The `DocSearchUserConfig` inner interfaces are an hand-written types rather than using the
// `z.input<schema>` helper so that any JSDoc comments are properly preserved when emitting
// declaration files.
// Having such comments in the schema only works in pure-TypeScript environments, but due to a TS
// issues, such comments can be either missing or misplaced in the emitted declaration files.
//
// @see https://github.com/microsoft/TypeScript/issues/62309
//
// Additionally, in this specific case, relying on `z.input<schema>` would not work as
// `@docsearch/js` references types from `@algolia/client-search` that TypeScript would try to
// reference using a name when generating definitions but fail to do so because our package does
// not directly depend on `@algolia/client-search`.
//
// As such approach uses 2 sources of truth (a schema and an hand-written type), we use type tests
// to ensure that the hand-written type always matches the inferred input type from the schema.
//
// @see {@link file://./../__tests__/config.test-d.ts}
export type DocSearchUserConfig = DocSearchInlineUserConfig | DocSearchModuleUserConfig;

/** Starlight DocSearch plugin. */
export default function starlightDocSearch(userConfig: DocSearchUserConfig): StarlightPlugin {
	const opts = DocSearchConfigSchema.parse(userConfig);
	return {
		name: 'starlight-docsearch',
		hooks: {
			'config:setup'({ addIntegration, config, logger, updateConfig }) {
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
function vitePluginDocSearch(root: URL, config: DocSearchUserConfig): VitePlugin {
	const resolveId = (id: string, base = root) =>
		JSON.stringify(id.startsWith('.') ? resolve(fileURLToPath(base), id) : id);

	const moduleContent = `
	${
		'clientOptionsModule' in config
			? `export { default } from ${resolveId(config.clientOptionsModule)};`
			: `export default ${JSON.stringify(config)};`
	}
	`;

	return {
		name: 'vite-plugin-starlight-docsearch-config',
		load: {
			filter: { id: pluginLoadIdFilter },
			handler(id) {
				return id === resolvedModuleId ? moduleContent : undefined;
			},
		},
		resolveId: {
			filter: { id: pluginResolveIdIdFilter },
			handler(id) {
				return id === moduleId ? resolvedModuleId : undefined;
			},
		},
	};
}

type VitePlugin = NonNullable<ViteUserConfig['plugins']>[number];
