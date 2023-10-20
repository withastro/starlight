/// <reference types="vitest" />

import { getViteConfig } from 'astro/config';
import { vitePluginStarlightUserConfig } from '../integrations/virtual-user-config';
import { StarlightConfigSchema } from '../utils/user-config';
import { runPlugins, type StarlightUserConfigWithPlugins } from '../utils/plugins';

export async function defineVitestConfig(config: StarlightUserConfigWithPlugins) {
	const root = new URL('./', import.meta.url);
	const srcDir = new URL('./src/', root);
	const { userConfig } = await runPlugins(config);
	return getViteConfig({
		plugins: [
			vitePluginStarlightUserConfig(StarlightConfigSchema.parse(userConfig), { root, srcDir }),
		],
	});
}
