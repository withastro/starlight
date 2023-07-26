/// <reference types="vitest" />

import { getViteConfig } from 'astro/config';
import type { z } from 'astro/zod';
import { vitePluginStarlightUserConfig } from '../integrations/virtual-user-config';
import { StarlightConfigSchema } from '../utils/user-config';

export function defineVitestConfig(config: z.input<typeof StarlightConfigSchema>) {
	return getViteConfig({
		plugins: [
			vitePluginStarlightUserConfig(StarlightConfigSchema.parse(config), {
				root: new URL(import.meta.url),
			}),
		],
	});
}
