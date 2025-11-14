import fs from 'node:fs/promises';
import { defineConfig } from 'tsdown';

// https://github.com/colinhacks/zod/issues/4227#issuecomment-2816999823

// TODO(HiDeoo) assets, e.g. json and all
// TODO(HiDeoo) look for `tsc` comments
// TODO(HiDeoo) check directives from `index.ts` are present in the .d.ts files
// TODO(HiDeoo) all existing .d.ts files

export default defineConfig({
	copy: ['components', 'routes', 'style'],
	dts: true,
	// entry: [
	// 	'./index.ts',
	// 	'./locals.ts',
	// 	'./internal.ts',
	// 	'./props.ts',
	// 	'./schema.ts',
	// 	'./loaders.ts',
	// 	'./route-data.ts',
	// 	'./types.ts',
	// 	'./expressive-code.ts',
	// 	'./integrations/expressive-code/hast.ts',
	// ],
	entry: ['**/*.ts'],
	external: [/^astro:/, /^virtual:starlight\//],
	plugins: [rawImportPlugin()],
	unbundle: true,
});

// TODO(HiDeoo) comment
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
