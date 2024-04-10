import mdx from '@astrojs/mdx';
import type { AstroIntegration } from 'astro';
import { spawn } from 'node:child_process';
import { dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { starlightAsides } from './integrations/asides';
import { starlightExpressiveCode } from './integrations/expressive-code/index';
import { starlightSitemap } from './integrations/sitemap';
import { vitePluginStarlightUserConfig } from './integrations/virtual-user-config';
import { rehypeRtlCodeSupport } from './integrations/code-rtl-support';
import { createTranslationSystemFromFs } from './utils/translations-fs';
import { runPlugins, type StarlightUserConfigWithPlugins } from './utils/plugins';
import type { StarlightConfig } from './types';
import { getErrorLangKey } from './utils/i18n'
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
				userConfig = starlightConfig;
				const checkTitleLangResult = getErrorLangKey(userConfig);
				if(checkTitleLangResult[0]){
					throw new Error(`Lang ${checkTitleLangResult[1]} need to be defined first`);
				}
				const useTranslations = createTranslationSystemFromFs(starlightConfig, config);

				if (!userConfig.disable404Route) {
					injectRoute({
						pattern: '404',
						entrypoint: '@astrojs/starlight/404.astro',
						// Ensure page is pre-rendered even when project is on server output mode
						prerender: true,
					});
				}
				injectRoute({
					pattern: '[...slug]',
					entrypoint: '@astrojs/starlight/index.astro',
					// Ensure page is pre-rendered even when project is on server output mode
					prerender: true,
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
					integrations.push(mdx());
				}
				updateConfig({
					integrations,
					vite: {
					scopedStyleStrategy: 'where',
					// If not already configured, default to prefetching all links on hover.
					prefetch: config.prefetch ?? { prefetchAll: true },
					experimental: {
						globalRoutePriority: true,
					},
				});
			},

			'astro:build:done': ({ dir }) => {
				if (!userConfig.pagefind) return;
				const targetDir = fileURLToPath(dir);
				const cwd = dirname(fileURLToPath(import.meta.url));
				const relativeDir = relative(cwd, targetDir);
				return new Promise<void>((resolve) => {
					spawn('npx', ['-y', 'pagefind', '--site', relativeDir], {
						stdio: 'inherit',
						shell: true,
						cwd,
					}).on('close', () => resolve());
				});
			},
		},
	};
}
