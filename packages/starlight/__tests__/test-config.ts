/// <reference types="vitest" />

import type { AstroIntegrationLogger } from 'astro';
import { getViteConfig } from 'astro/config';
import { vitePluginStarlightUserConfig } from '../integrations/virtual-user-config';
import { runPlugins, type StarlightUserConfigWithPlugins } from '../utils/plugins';

export async function defineVitestConfig({ plugins, ...opts }: StarlightUserConfigWithPlugins) {
	const root = new URL('./', import.meta.url);
	const srcDir = new URL('./src/', root);
	const { starlightConfig } = await runPlugins(opts, plugins, new TestAstroIntegrationLogger());
	return getViteConfig({
		plugins: [vitePluginStarlightUserConfig(starlightConfig, { root, srcDir })],
	});
}

export class TestAstroIntegrationLogger {
	options = {} as AstroIntegrationLogger['options'];
	constructor(public label = 'test-integration-logger') {}
	fork = (label: string) => new TestAstroIntegrationLogger(label);
	info = () => undefined;
	warn = () => undefined;
	error = () => undefined;
	debug = () => undefined;
}
