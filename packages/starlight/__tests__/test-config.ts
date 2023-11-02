/// <reference types="vitest" />

import { getViteConfig } from 'astro/config';
import type { z } from 'astro/zod';
import { vitePluginStarlightUserConfig } from '../integrations/virtual-user-config';
import { StarlightConfigSchema } from '../utils/user-config';
import type { AstroConfig } from 'astro';

export function defineVitestConfig(
	config: z.input<typeof StarlightConfigSchema>,
	opts?: Partial<AstroConfig>
) {
	const root = opts?.root ?? new URL('./', import.meta.url);
	const srcDir = opts?.srcDir ?? new URL('./src/', root);
	const build = opts?.build ?? ({ format: 'directory' } as AstroConfig['build']);

	return getViteConfig({
		plugins: [
			vitePluginStarlightUserConfig(StarlightConfigSchema.parse(config), { root, srcDir, build }),
		],
	});
}
