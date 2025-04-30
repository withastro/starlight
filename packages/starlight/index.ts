/**
 * These triple-slash directives defines dependencies to various declaration files that will be
 * loaded when a user imports the Starlight integration in their Astro configuration file. These
 * directives must be first at the top of the file and can only be preceded by this comment.
 */
/// <reference path="./locals.d.ts" />
/// <reference path="./i18n.d.ts" />
/// <reference path="./virtual.d.ts" />

import mdx from '@astrojs/mdx';
import type { AstroIntegration, AstroIntegrationLogger } from 'astro';
import { AstroError } from 'astro/errors';
import { spawn } from 'node:child_process';
import { dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { starlightAsides, starlightDirectivesRestorationIntegration } from './integrations/asides';
import { starlightExpressiveCode } from './integrations/expressive-code/index';
import { starlightSitemap } from './integrations/sitemap';
import { vitePluginStarlightUserConfig } from './integrations/virtual-user-config';
import { rehypeRtlCodeSupport } from './integrations/code-rtl-support';
import {
	injectPluginTranslationsTypes,
	runPlugins,
	type PluginTranslations,
	type StarlightUserConfigWithPlugins,
} from './utils/plugins';
import { processI18nConfig } from './utils/i18n';
import type { StarlightConfig } from './types';
import { starlightAutolinkHeadings } from './integrations/heading-links';

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
					integrations.push(...starlightExpressiveCode({ starlightConfig, useTranslations }));
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

				updateConfig({
					vite: {
						plugins: [
							vitePluginStarlightUserConfig(command, starlightConfig, config, pluginTranslations),
						],
					},
					markdown: {
						remarkPlugins: [
							...starlightAsides({
								starlightConfig,
								astroConfig: config,
								useTranslations,
								absolutePathToLang,
							}),
						],
						rehypePlugins: [
							rehypeRtlCodeSupport(),
							// Process headings and add anchor links.
							...starlightAutolinkHeadings({
								starlightConfig,
								astroConfig: config,
								useTranslations,
								absolutePathToLang,
							}),
						],
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

			'astro:build:done': ({ dir, logger }) => {
				if (!userConfig.pagefind) return;
				const loglevelFlag = getPagefindLoggingFlags(logger.options.level);
				const targetDir = fileURLToPath(dir);
				const cwd = dirname(fileURLToPath(import.meta.url));
				const relativeDir = relative(cwd, targetDir);
				return new Promise<void>((resolve) => {
					spawn('npx', ['-y', 'pagefind', ...loglevelFlag, '--site', relativeDir], {
						stdio: 'inherit',
						shell: true,
						cwd,
					}).on('close', () => resolve());
				});
			},
		},
	};
}

/** Map the logging level of Astro’s logger to one of Pagefind’s logging level flags. */
function getPagefindLoggingFlags(level: AstroIntegrationLogger['options']['level']) {
	switch (level) {
		case 'silent':
		case 'error':
			return ['--silent'];
		case 'warn':
			return ['--quiet'];
		case 'debug':
			return ['--verbose'];
		case 'info':
		default:
			return [];
	}
}
