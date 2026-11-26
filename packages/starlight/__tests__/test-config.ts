/// <reference types="vitest" />

import { fileURLToPath } from 'node:url';
import type { AstroConfig } from 'astro';
import { getViteConfig } from 'astro/config';
import { vitePluginStarlightVirtualModules } from '../src/integrations/vite-virtual-modules';
import { builtinPlugins } from '../src/plugins';
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
	}
) {
	const root = new URL('./', import.meta.url);
	const srcDir = new URL('./src/', root);
	const build = opts?.build ?? { format: 'directory' };
	const trailingSlash = opts?.trailingSlash ?? 'ignore';
	const command = opts?.command ?? 'dev';

	const { runPlugins: testRunPlugins } = await loadTestModule('utils/plugins.js', { runPlugins });
	const { builtinPlugins: testBuiltinPlugins } = await loadTestModule('plugins/index.js', {
		builtinPlugins,
	});
	const { vitePluginStarlightCssLayerOrder: testVitePluginStarlightCssLayerOrder } =
		await loadTestModule('integrations/vite-layer-order.js', {
			vitePluginStarlightCssLayerOrder,
		});
	const { vitePluginStarlightVirtualModules: testVitePluginStarlightVirtualModules } =
		await loadTestModule('integrations/vite-virtual-modules.js', {
			vitePluginStarlightVirtualModules,
		});

	const { starlightConfig, pluginTranslations, integrations } = await testRunPlugins(
		config,
		(plugins || []).concat(...testBuiltinPlugins),
		createTestPluginContext()
	);

	// If any built-in Starlight plugin returned an Astro integration, collect any Vite plugins it would add.
	const vitePluginsFromStarlightPlugins: AstroConfig['vite']['plugins'] = [];
	for (const integration of integrations) {
		await integration.hooks['astro:config:setup']?.({
			// @ts-expect-error - updateConfig is supposed to return the updated config, which we don’t
			// bother with for testing because we’re not using it in our plugins.
			updateConfig: (newConfig) => {
				if (newConfig?.vite?.plugins) {
					vitePluginsFromStarlightPlugins.push(...newConfig.vite.plugins);
				}
			},
			injectRoute: () => undefined,
		});
	}

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
			...vitePluginsFromStarlightPlugins,
		],
		test: {
			fsModuleCache: true,
			snapshotSerializers: ['../snapshot-serializer-astro-error.ts'],
		},
	});
}

async function loadTestModule<T>(path: string, sourceModule: T): Promise<T> {
	if (!isTestingDist) return sourceModule;

	const distModule: unknown = await import(new URL(path, distUrl).href);
	return distModule as T;
}
