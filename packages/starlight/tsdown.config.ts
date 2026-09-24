import fs from 'node:fs/promises';
import { defineConfig } from 'tsdown';

export default defineConfig({
	checks: { pluginTimings: false },
	copy: ['src/components.ts', 'src/style', { from: 'src/**/*.astro', flatten: false }],
	deps: {
		neverBundle: [/^astro:/, /^virtual:starlight\//],
	},
	dts: true,
	entry: [
		'src/**/*.ts',
		// The user components barrel file should not be transpiled as it's consumed as-is by Astro.
		// https://github.com/withastro/astro/blob/c4c99aa7a5e8e45ada0efa4fda6e6fb96f334663/packages/astro/package.json#L55
		'!src/components.ts',
	],
	fixedExtension: false,
	plugins: [rawImportPlugin()],
	publint: { strict: true },
	unbundle: true,
});

/**
 * Plugin supporting importing raw file contents using the `?raw` suffix.
 *
 * This is a basic implementation suitable for Starlight’s needs as the existing `unplugin-raw`
 * plugin did not end up working correctly.
 * Note that this implementation does not support multiple query parameters.
 */
function rawImportPlugin() {
	const rawImportSuffix = '?raw';

	return {
		name: 'raw-import-plugin',
		async load(id: string) {
			const isRawImport = id.endsWith(rawImportSuffix);
			if (!isRawImport) return;

			const path = id.replace(rawImportSuffix, '');
			const content = await fs.readFile(path, 'utf8');

			return `export default ${JSON.stringify(content)}`;
		},
	};
}
