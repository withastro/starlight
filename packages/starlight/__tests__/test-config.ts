/// <reference types="vitest" />

import { fileURLToPath } from 'node:url';
import type { AstroConfig } from 'astro';
import { getViteConfig } from 'astro/config';
import { vitePluginStarlightVirtualModules } from '../src/integrations/vite-virtual-modules';
import { runPlugins, type StarlightUserConfigWithPlugins } from '../src/utils/plugins';
import { createTestPluginContext } from './test-plugin-utils';
import { vitePluginStarlightCssLayerOrder } from '../src/integrations/vite-layer-order';

const isTestingDist = process.env.STARLIGHT_TEST_DIST === 'true';

const distUrl = new URL('../dist/', import.meta.url);
const distPath = fileURLToPath(distUrl);

export async function defineVitestConfig(
	{ plugins, ...config }: StarlightUserConfigWithPlugins,
	opts?: {
		build?: Pick<AstroConfig['build'], 'format'>;
		trailingSlash?: AstroConfig['trailingSlash'];
		command?: 'dev' | 'build' | 'preview';
		snapshotSerializers?: boolean;
	}
) {
	const root = new URL('./', import.meta.url);
	const srcDir = new URL('./src/', root);
	const build = opts?.build ?? { format: 'directory' };
	const trailingSlash = opts?.trailingSlash ?? 'ignore';
	const command = opts?.command ?? 'dev';

	const { runPlugins: testRunPlugins } = await loadTestModule('utils/plugins.js', { runPlugins });
	const { vitePluginStarlightCssLayerOrder: testVitePluginStarlightCssLayerOrder } =
		await loadTestModule('integrations/vite-layer-order.js', {
			vitePluginStarlightCssLayerOrder,
		});
	const { vitePluginStarlightVirtualModules: testVitePluginStarlightVirtualModules } =
		await loadTestModule('integrations/vite-virtual-modules.js', {
			vitePluginStarlightVirtualModules,
		});

	const { starlightConfig, pluginTranslations } = await testRunPlugins(
		config,
		plugins,
		createTestPluginContext()
	);
	return getViteConfig({
		resolve: {
			alias: isTestingDist
				? [{ find: /^(?:\.\.\/)+src\/(.*)$/, replacement: `${distPath}$1` }]
				: [],
		},
		plugins: [
			testVitePluginStarlightCssLayerOrder(),
			testVitePluginStarlightVirtualModules(
				{ command, isNodeCompatibleEnv: true },
				starlightConfig,
				{
					root,
					srcDir,
					build,
					trailingSlash,
					legacy: { collectionsBackwardsCompat: false },
				},
				pluginTranslations
			),
		],
		test: {
			...(opts?.snapshotSerializers === false
				? {}
				: { snapshotSerializers: ['../snapshot-serializer-astro-error.ts'] }),
		},
	});
}

async function loadTestModule<T>(path: string, sourceModule: T): Promise<T> {
	if (!isTestingDist) return sourceModule;

	const distModule: unknown = await import(new URL(path, distUrl).href);
	return distModule as T;
}
