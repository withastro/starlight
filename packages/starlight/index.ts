import mdx from '@astrojs/mdx';
import type { AstroIntegration } from 'astro';
import { rm } from 'node:fs/promises';
import { join as pathJoin } from 'node:path';
import { fileURLToPath } from 'node:url';
import { starlightAsides } from './integrations/asides';
import { rehypeRtlCodeSupport } from './integrations/code-rtl-support';
import { starlightExpressiveCode } from './integrations/expressive-code/index';
import { starlightSitemap } from './integrations/sitemap';
import { vitePluginStarlightUserConfig } from './integrations/virtual-user-config';
import type { StarlightConfig } from './types';
import { generatePagefindIndex } from './utils/pagefind.ts';
import { runPlugins, type StarlightUserConfigWithPlugins } from './utils/plugins';
import { createTranslationSystemFromFs } from './utils/translations-fs';

export default function StarlightIntegration({
	plugins,
	...opts
}: StarlightUserConfigWithPlugins): AstroIntegration {
	let userConfig: StarlightConfig;
	return {
		name: '@astrojs/starlight',
		hooks: {
			'astro:config:setup': async ({
				command,
				config,
				injectRoute,
				isRestart,
				logger,
				updateConfig,
			}) => {
				// Run plugins to get the final configuration and any extra Astro integrations to load.
				const { integrations, starlightConfig } = await runPlugins(opts, plugins, {
					command,
					config,
					isRestart,
					logger,
				});

				const useTranslations = createTranslationSystemFromFs(starlightConfig, config);

				const astroOutput = config.output ?? 'static';
				// Always prerender on static mode
				// Defaults to prerender on hybrid mode
				// Defaults to not prerender on server mode
				const prerender =
					astroOutput === 'static' || (starlightConfig.prerender ?? astroOutput === 'hybrid');

				userConfig = {
					...starlightConfig,
					prerender: prerender,
				};

				injectRoute({
					pattern: '[...slug]',
					entrypoint: prerender
						? '@astrojs/starlight/index.astro'
						: '@astrojs/starlight/indexSSR.astro',
					prerender: prerender,
				});

				// Always pre-render for pagefind
				if (!prerender && starlightConfig.pagefind) {
					logger.warn(
						'Pagefind cannot index SSR generated pages, the content will be pre-rendered for indexing but not included the final build.\n' +
							'Build time may increase due to this extra work.'
					);

					injectRoute({
						pattern: '/pagefind/source/[...slug]',
						entrypoint: '@astrojs/starlight/index.astro',
						prerender: true,
					});
				}

				if (!userConfig.disable404Route) {
					injectRoute({
						pattern: '404',
						entrypoint: '@astrojs/starlight/404.astro',
						prerender: prerender,
					});
				}
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
					integrations.push(mdx());
				}
				updateConfig({
					integrations,
					vite: {
						plugins: [vitePluginStarlightUserConfig(starlightConfig, config)],
					},
					markdown: {
						remarkPlugins: [
							...starlightAsides({ starlightConfig, astroConfig: config, useTranslations }),
						],
						rehypePlugins: [rehypeRtlCodeSupport()],
						shikiConfig:
							// Configure Shiki theme if the user is using the default github-dark theme.
							config.markdown.shikiConfig.theme !== 'github-dark' ? {} : { theme: 'css-variables' },
					},
					scopedStyleStrategy: 'where',
					// If not already configured, default to prefetching all links on hover.
					prefetch: config.prefetch ?? { prefetchAll: true },
				});
			},

			'astro:build:done': async ({ dir, logger }) => {
				if (!userConfig.pagefind) return;

				const buildFilesDir = fileURLToPath(dir);
				const pagefindLogger = logger.fork('pagefind');

				if (userConfig.prerender) {
					await generatePagefindIndex({
						inputDir: buildFilesDir,
						outputDir: pathJoin(buildFilesDir, 'pagefind'),
						logger: pagefindLogger,
					});
				} else {
					await generatePagefindIndex({
						inputDir: pathJoin(buildFilesDir, 'pagefind', 'source'),
						outputDir: pathJoin(buildFilesDir, 'pagefind'),
						logger: pagefindLogger,
					});

					// Remove the pre-rendered files
					await rm(pathJoin(buildFilesDir, 'pagefind', 'source'), { recursive: true });
				}
			},
		},
	};
}
