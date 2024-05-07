/// <reference types="vitest" />

import type { AstroConfig, AstroInlineConfig } from 'astro';
import { getViteConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import { vitePluginStarlightUserConfig } from '../integrations/virtual-user-config';
import { runPlugins, type StarlightUserConfigWithPlugins } from '../utils/plugins';
import { createTestPluginContext } from './test-plugin-utils';

export async function defineVitestConfig(
	{ plugins, ...config }: StarlightUserConfigWithPlugins,
	opts: AstroInlineConfig & {
		build?: Pick<AstroConfig['build'], 'format'>;
		trailingSlash?: AstroConfig['trailingSlash'];
	} = {}
) {
	const root = new URL('./', import.meta.url);
	opts.root ??= fileURLToPath(root);
	const srcDir = new URL('./src/', root);
	opts.srcDir ??= fileURLToPath(srcDir);
	const build = (opts.build ??= { format: 'directory' });
	const trailingSlash = (opts.trailingSlash ??= 'ignore');

	const { starlightConfig } = await runPlugins(config, plugins, createTestPluginContext());
	return getViteConfig(
		{
			plugins: [
				vitePluginStarlightUserConfig(starlightConfig, { root, srcDir, build, trailingSlash }),
			],
			test: {
				snapshotSerializers: ['./snapshot-serializer-astro-error.ts'],
			},
			
		},
		opts
	);
}
