/// <reference types="vitest" />

import type { AstroConfig, AstroIntegrationLogger } from 'astro';
import { getViteConfig } from 'astro/config';
import { vitePluginStarlightUserConfig } from '../integrations/virtual-user-config';
import {
	runPlugins,
	type StarlightPluginContext,
	type StarlightUserConfigWithPlugins,
} from '../utils/plugins';

export async function defineVitestConfig(
	{ plugins, ...config }: StarlightUserConfigWithPlugins,
	opts?: {
		build?: Pick<AstroConfig['build'], 'format'>;
		trailingSlash?: AstroConfig['trailingSlash'];
	}
) {
	const root = new URL('./', import.meta.url);
	const srcDir = new URL('./src/', root);
	const build = opts?.build ?? { format: 'directory' };
	const trailingSlash = opts?.trailingSlash ?? 'ignore';

	const { starlightConfig } = await runPlugins(config, plugins, createTestPluginContext());
	return getViteConfig({
		plugins: [
			vitePluginStarlightUserConfig(starlightConfig, { root, srcDir, build, trailingSlash }),
		],
	});
}

export function createTestPluginContext(): StarlightPluginContext {
	return {
		command: 'dev',
		config: {} as StarlightPluginContext['config'],
		isRestart: false,
		logger: new TestAstroIntegrationLogger(),
	};
}

class TestAstroIntegrationLogger {
	options = {} as AstroIntegrationLogger['options'];
	constructor(public label = 'test-integration-logger') {}
	fork = (label: string) => new TestAstroIntegrationLogger(label);
	info = () => undefined;
	warn = () => undefined;
	error = () => undefined;
	debug = () => undefined;
}
