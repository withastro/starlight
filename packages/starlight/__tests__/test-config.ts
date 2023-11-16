/// <reference types="vitest" />

import { getViteConfig } from 'astro/config';
import type { z } from 'astro/zod';
import { vitePluginStarlightUserConfig } from '../integrations/virtual-user-config';
import { StarlightConfigSchema } from '../utils/user-config';
import type { AstroConfig } from 'astro';

export function defineVitestConfig(
	config: z.input<typeof StarlightConfigSchema>,
	opts?: {
		build?: Pick<AstroConfig['build'], 'format'>;
		trailingSlash?: AstroConfig['trailingSlash'];
	}
) {
	const root = new URL('./', import.meta.url);
	const srcDir = new URL('./src/', root);
	const build = opts?.build ?? { format: 'directory' };
	const trailingSlash = opts?.trailingSlash ?? 'ignore';

	return getViteConfig({
		plugins: [
			vitePluginStarlightUserConfig(StarlightConfigSchema.parse(config), {
				root,
				srcDir,
				build,
				trailingSlash,
			}),
		],
	});
}
