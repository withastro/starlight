import { fileURLToPath } from 'node:url';
import type { ViteUserConfig } from 'astro';

// https://vite.dev/guide/api-plugin#hook-filters
const componentsBarrelIdFilter = /[\\/]components\.ts(?:\?.*)?$/;

const backSlashRegex = /\\/g;
const queryStringRegex = /\?.*$/;

const starlightComponentsBarrelId = normalizeId(
	fileURLToPath(new URL('../components.ts', import.meta.url))
);

/**
 * Vite plugin that marks the Starlight components barrel file as having no side effects so that
 * lazy barrel optimization can be applied to it.
 *
 * @see https://rolldown.rs/in-depth/lazy-barrel-optimization
 */
export function vitePluginStarlightLazyBarrelOptimization(): VitePlugin {
	return {
		name: 'vite-plugin-starlight-lazy-barrel-optimization',
		enforce: 'pre',
		transform: {
			filter: {
				id: componentsBarrelIdFilter,
			},
			handler(code, id) {
				if (normalizeId(id) !== starlightComponentsBarrelId) return;
				return { code, moduleSideEffects: false };
			},
		},
	};
}

function normalizeId(id: string) {
	return id.replace(backSlashRegex, '/').replace(queryStringRegex, '');
}

type VitePlugin = NonNullable<ViteUserConfig['plugins']>[number];
