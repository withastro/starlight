import mdx from '@astrojs/mdx';
import type { AstroIntegration, AstroUserConfig } from 'astro';
import { spawn } from 'node:child_process';
import { dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { starlightAsides } from './integrations/asides';
import { starlightSitemap } from './integrations/sitemap';
import { vitePluginStarlightUserConfig } from './integrations/virtual-user-config';
import { errorMap } from './utils/error-map';
import { StarlightConfigSchema, StarlightUserConfig } from './utils/user-config';

export default function StarlightIntegration(opts: StarlightUserConfig): AstroIntegration[] {
	const parsedConfig = StarlightConfigSchema.safeParse(opts, { errorMap });

	if (!parsedConfig.success) {
		throw new Error(
			'Invalid config passed to starlight integration\n' +
				parsedConfig.error.issues.map((i) => i.message).join('\n')
		);
	}

	const userConfig = parsedConfig.data;

	const Starlight: AstroIntegration = {
		name: '@astrojs/starlight',
		hooks: {
			'astro:config:setup': ({ config, injectRoute, updateConfig }) => {
				injectRoute({
					pattern: '404',
					entryPoint: '@astrojs/starlight/404.astro',
				});
				injectRoute({
					pattern: '[...slug]',
					entryPoint: '@astrojs/starlight/index.astro',
				});
				const newConfig: AstroUserConfig = {
					vite: {
						plugins: [vitePluginStarlightUserConfig(userConfig, config)],
					},
					markdown: {
						remarkPlugins: [...starlightAsides()],
						shikiConfig:
							// Configure Shiki theme if the user is using the default github-dark theme.
							config.markdown.shikiConfig.theme !== 'github-dark' ? {} : { theme: 'css-variables' },
					},
					build: { inlineStylesheets: 'auto' },
					experimental: {
						assets: true,
						// @ts-ignore - Needed for older versions of Astro, but an error since astro@2.6.0
						inlineStylesheets: 'auto',
					},
				};
				updateConfig(newConfig);
			},

			'astro:build:done': ({ dir }) => {
				const targetDir = fileURLToPath(dir);
				const cwd = dirname(fileURLToPath(import.meta.url));
				const relativeDir = relative(cwd, targetDir);
				return new Promise<void>((resolve) => {
					spawn('npx', ['-y', 'pagefind', '--source', relativeDir], {
						stdio: 'inherit',
						shell: true,
						cwd,
					}).on('close', () => resolve());
				});
			},
		},
	};

	return [starlightSitemap(userConfig), Starlight, mdx()];
}
