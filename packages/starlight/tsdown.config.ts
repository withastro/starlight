import fs from 'node:fs/promises';
import path from 'node:path';
import { glob } from 'tinyglobby';
import { defineConfig } from 'tsdown';

const outDir = 'dist';

// https://github.com/colinhacks/zod/issues/4227#issuecomment-2816999823

// TODO(HiDeoo) tsdown/publint
// TODO(HiDeoo) assets, e.g. json and all
// TODO(HiDeoo) look for `tsc` comments
// TODO(HiDeoo) check directives from `index.ts` are present in the .d.ts files
// TODO(HiDeoo) all existing .d.ts files
// TODO(HiDeoo) user components
// TODO(HiDeoo) ensure we don't have js/mjs/cjs files in src
// TODO(HiDeoo) virtual / triple-slash directives
// TODO(HiDeoo) virtual-internal.d.ts
// TODO(HiDeoo) global.d.ts

export default defineConfig({
	copy: ['src/components.ts', 'src/style'],
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
	entry: [
		'src/**/*.ts',
		// TODO(HiDeoo) comment
		'!src/components.ts',
	],
	external: [/^astro:/, /^virtual:starlight\//],
	outDir,
	plugins: [rawImportPlugin(), globCopyPlugin(['**/*.astro'], 'src')],
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

// TODO(HiDeoo) comment
// TODO(HiDeoo) avoid ts files e.g in `components/`
function globCopyPlugin(globs: string[], cwd: string) {
	return {
		name: 'glob-copy-plugin',
		async writeBundle() {
			let total = 0;

			info('Copying files matching globs');

			for (const pattern of globs) {
				const files = await glob(pattern, { cwd });

				await Promise.all(
					files.map((file) => {
						const from = path.resolve(cwd, file);
						const to = path.resolve(outDir, file);
						return fs.cp(from, to, { force: true });
					})
				);

				total += files.length;

				info(`${dim(`${cwd}/`)}${pattern} ${dim(`- ${files.length} files`)}`);
			}

			info(`${total} files`);
		},
	};
}

function info(message: string) {
	console.info(`${blue('ℹ')} ${message}`);
}

// TODO: refactor logging to use `util.styleText()` when possible (22.13.0).
function blue(message: string) {
	return `\x1b[34m${message}\x1b[0m`;
}

// TODO: refactor logging to use `util.styleText()` when possible (22.13.0).
function dim(message: string) {
	return `\x1b[2m${message}\x1b[0m`;
}
