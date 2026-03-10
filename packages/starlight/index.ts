/**
 * These triple-slash directives defines dependencies to various declaration files that will be
 * loaded when a user imports the Starlight integration in their Astro configuration file. These
 * directives must be first at the top of the file and can only be preceded by this comment.
 */
/// <reference path="./locals.d.ts" />
/// <reference path="./i18n.d.ts" />
/// <reference path="./virtual.d.ts" />

import mdx from '@astrojs/mdx';
import type { AstroIntegration } from 'astro';
import { AstroError } from 'astro/errors';
import {
	starlightRehypePlugins,
	starlightRemarkPlugins,
	type RemarkRehypePluginOptions,
} from './integrations/remark-rehype';
import { starlightDirectivesRestorationIntegration } from './integrations/asides';
import { starlightExpressiveCode } from './integrations/expressive-code/index';
import { starlightPagefind } from './integrations/pagefind';
import { starlightSitemap } from './integrations/sitemap';
import { vitePluginStarlightCssLayerOrder } from './integrations/vite-layer-order';
import { vitePluginStarlightUserConfig } from './integrations/virtual-user-config';
import {
	injectPluginTranslationsTypes,
	runPlugins,
	type PluginTranslations,
	type StarlightUserConfigWithPlugins,
} from './utils/plugins';
import { processI18nConfig } from './utils/i18n';
import type { StarlightConfig } from './types';

export default function StarlightIntegration(
	userOpts: StarlightUserConfigWithPlugins
): AstroIntegration {
	if (typeof userOpts !== 'object' || userOpts === null || Array.isArray(userOpts))
		throw new AstroError(
			'Invalid config passed to starlight integration',
			`The Starlight integration expects a configuration object with at least a \`title\` property.\n\n` +
				`See more details in the [Starlight configuration reference](https://starlight.astro.build/reference/configuration/)\n`
		);
	const { plugins, ...opts } = userOpts;
	let userConfig: StarlightConfig;
	let pluginTranslations: PluginTranslations = {};
	return {
		name: '@astrojs/starlight',
		hooks: {
			'astro:config:setup': async ({
				addMiddleware,
				command,
				config,
				injectRoute,
				isRestart,
				logger,
				updateConfig,
			}) => {
				// Run plugins to get the updated configuration and any extra Astro integrations to load.
				const pluginResult = await runPlugins(opts, plugins, {
					command,
					config,
					isRestart,
					logger,
				});
				// Process the Astro and Starlight configurations for i18n and translations.
				const { astroI18nConfig, starlightConfig } = processI18nConfig(
					pluginResult.starlightConfig,
					config.i18n
				);

				const { integrations, useTranslations, absolutePathToLang } = pluginResult;
				pluginTranslations = pluginResult.pluginTranslations;
				userConfig = starlightConfig;

				addMiddleware({ entrypoint: '@astrojs/starlight/locals', order: 'pre' });

				if (!starlightConfig.disable404Route) {
					injectRoute({
						pattern: '404',
						entrypoint: starlightConfig.prerender
							? '@astrojs/starlight/routes/static/404.astro'
							: '@astrojs/starlight/routes/ssr/404.astro',
						prerender: starlightConfig.prerender,
					});
				}
				injectRoute({
					pattern: '[...slug]',
					entrypoint: starlightConfig.prerender
						? '@astrojs/starlight/routes/static/index.astro'
						: '@astrojs/starlight/routes/ssr/index.astro',
					prerender: starlightConfig.prerender,
				});

				// Add built-in integrations only if they are not already added by the user through the
				// config or by a plugin.
				const allIntegrations = [...config.integrations, ...integrations];
				if (!allIntegrations.find(({ name }) => name === 'astro-expressive-code')) {
					integrations.push(
						...starlightExpressiveCode({ astroConfig: config, starlightConfig, useTranslations })
					);
				}
				if (!allIntegrations.find(({ name }) => name === '@astrojs/sitemap')) {
					integrations.push(starlightSitemap(starlightConfig));
				}
				if (!allIntegrations.find(({ name }) => name === '@astrojs/mdx')) {
					integrations.push(mdx({ optimize: true }));
				}

				// Add Starlight directives restoration integration at the end of the list so that remark
				// plugins injected by Starlight plugins through Astro integrations can handle text and
				// leaf directives before they are transformed back to their original form.
				integrations.push(starlightDirectivesRestorationIntegration());

				// Add integrations immediately after Starlight in the config array.
				// e.g. if a user has `integrations: [starlight(), tailwind()]`, then the order will be
				// `[starlight(), expressiveCode(), sitemap(), mdx(), tailwind()]`.
				// This ensures users can add integrations before/after Starlight and we respect that order.
				const selfIndex = config.integrations.findIndex((i) => i.name === '@astrojs/starlight');
				config.integrations.splice(selfIndex + 1, 0, ...integrations);

				const remarkRehypeOptions: RemarkRehypePluginOptions = {
					starlightConfig,
					astroConfig: config,
					useTranslations,
					absolutePathToLang,
				};

				// TODO: refactor once there is a reliable way to detect non-Node.js compatible
				// environments, rather than relying on the presence of specific adapters/integrations.
				const isCloudflareEnv =
					config.adapter?.name === '@astrojs/cloudflare' ||
					config.integrations.some(({ name }) => name === '@astrojs/cloudflare');
				const isNodeCompatibleEnv = !isCloudflareEnv;

				updateConfig({
					vite: {
						plugins: [
							vitePluginStarlightCssLayerOrder(),
							vitePluginStarlightUserConfig(
								{ command, isNodeCompatibleEnv },
								starlightConfig,
								config,
								pluginTranslations
							),
						],
						ssr: isNodeCompatibleEnv
							? {}
							: {
									optimizeDeps: {
										include: [
											// Prebundle some dependencies for non-Node.js compatible environments to
											// speed up dev server start time and prevent restarts.
											'@astrojs/cloudflare/entrypoints/server',
											'@astrojs/starlight>i18next',
											'@astrojs/starlight>js-yaml',
											'@astrojs/starlight>klona/lite',
											// TODO: once Expressive Code is refactored/fixed, remove this workaround for
											// Expressive Code relying on CJS dependencies like postcss not compatible
											// with non-Node.js compatible environments like Cloudflare.
											'@astrojs/starlight>astro-expressive-code/components',
											'@astrojs/starlight>astro-expressive-code>hast-util-select',
											'@astrojs/starlight>astro-expressive-code>rehype',
											'@astrojs/starlight>astro-expressive-code>unist-util-visit',
											'@astrojs/starlight>astro-expressive-code>rehype-format',
											'@astrojs/starlight>astro-expressive-code>hastscript',
											'@astrojs/starlight>astro-expressive-code>hast-util-from-html',
											'@astrojs/starlight>astro-expressive-code>hast-util-to-string',
											'@astrojs/starlight>astro-expressive-code>@expressive-code/core>postcss',
										],
									},
								},
					},
					markdown: {
						remarkPlugins: [...starlightRemarkPlugins(remarkRehypeOptions)],
						rehypePlugins: [...starlightRehypePlugins(remarkRehypeOptions)],
					},
					scopedStyleStrategy: 'where',
					// If not already configured, default to prefetching all links on hover.
					prefetch: config.prefetch ?? { prefetchAll: true },
					i18n: astroI18nConfig,
				});
			},

			'astro:config:done': ({ injectTypes }) => {
				injectPluginTranslationsTypes(pluginTranslations, injectTypes);
			},

			'astro:build:done': async (options) => {
				if (!userConfig.pagefind) return;
				return starlightPagefind(options);
			},
		},
	};
}
