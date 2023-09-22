import mdx from '@astrojs/mdx';
import type { AstroIntegration, AstroUserConfig } from 'astro';
import { spawn } from 'node:child_process';
import { dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { starlightAsides } from './integrations/asides';
import { starlightSitemap } from './integrations/sitemap';
import { vitePluginStarlightUserConfig } from './integrations/virtual-user-config';
import { errorMap } from './utils/error-map';
import { StarlightConfigSchema, type StarlightUserConfig } from './utils/user-config';
import { rehypeRtlCodeSupport } from './integrations/code-rtl-support';

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
						rehypePlugins: [rehypeRtlCodeSupport()],
						shikiConfig:
							// Configure Shiki theme if the user is using the default github-dark theme.
							config.markdown.shikiConfig.theme !== 'github-dark' ? {} : { theme: 'css-variables' },
					},
					scopedStyleStrategy: 'where',
				};
				updateConfig(newConfig);
			},

			'astro:config:done': ({ config }) => {
				const integrations = config.integrations.map(({ name }) => name);
				for (const builtin of ['@astrojs/mdx', '@astrojs/sitemap']) {
					if (integrations.filter((name) => name === builtin).length > 1) {
						throw new Error(
							`Found more than one instance of ${builtin}.\n` +
								`Starlight includes ${builtin} by default.\n` +
								'Please remove it from your integrations array in astro.config.mjs'
						);
					}
				}
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

	return [starlightSitemap(userConfig), Starlight, mdx()];
}
