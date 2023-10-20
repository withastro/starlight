import mdx from '@astrojs/mdx';
import type { AstroIntegration, AstroUserConfig } from 'astro';
import { spawn } from 'node:child_process';
import { dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { starlightAsides } from './integrations/asides';
import { starlightSitemap } from './integrations/sitemap';
import { vitePluginStarlightUserConfig } from './integrations/virtual-user-config';
import { errorMap } from './utils/error-map';
import { StarlightConfigSchema } from './utils/user-config';
import { rehypeRtlCodeSupport } from './integrations/code-rtl-support';
import { runPlugins, type StarlightUserConfigWithPlugins } from './utils/plugins';

export default function StarlightIntegration(
	opts: StarlightUserConfigWithPlugins
): AstroIntegration {
	return {
		name: '@astrojs/starlight',
		hooks: {
			'astro:config:setup': async ({ config, injectRoute, updateConfig }) => {
				const { userConfig } = await runPlugins(opts);
				const parsedConfig = StarlightConfigSchema.safeParse(userConfig, { errorMap });

				if (!parsedConfig.success) {
					throw new Error(
						'Invalid config passed to starlight integration\n' +
							parsedConfig.error.issues.map((i) => i.message).join('\n')
					);
				}

				const starlightConfig = parsedConfig.data;

				injectRoute({
					pattern: '404',
					entryPoint: '@astrojs/starlight/404.astro',
				});
				injectRoute({
					pattern: '[...slug]',
					entryPoint: '@astrojs/starlight/index.astro',
				});
				const integrations: AstroIntegration[] = [];
				if (!config.integrations.find(({ name }) => name === '@astrojs/sitemap')) {
					integrations.push(starlightSitemap(starlightConfig));
				}
				if (!config.integrations.find(({ name }) => name === '@astrojs/mdx')) {
					integrations.push(mdx());
				}
				const newConfig: AstroUserConfig = {
					integrations,
					vite: {
						plugins: [vitePluginStarlightUserConfig(starlightConfig, config)],
					},
					markdown: {
						remarkPlugins: [...starlightAsides()],
						rehypePlugins: [rehypeRtlCodeSupport()],
						shikiConfig:
							// Configure Shiki theme if the user is using the default github-dark theme.
							config.markdown.shikiConfig.theme !== 'github-dark' ? {} : { theme: 'css-variables' },
					},
					scopedStyleStrategy: 'where',
				};
				updateConfig(newConfig);
			},

			'astro:build:done': ({ dir }) => {
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
