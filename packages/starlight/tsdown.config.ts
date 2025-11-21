import fs from 'node:fs/promises';
import path from 'node:path';
import { glob } from 'tinyglobby';
import { defineConfig } from 'tsdown';

const outDir = 'dist';

// TODO(HiDeoo) tsdown/publint
// TODO(HiDeoo) look for `tsc` comments
// TODO(HiDeoo) remove tsc step in docs/
// TODO(HiDeoo) gitignore/prettierignore/*ignore dist

export default defineConfig({
	copy: ['src/components.ts', 'src/style'],
	dts: true,
	entry: [
		'src/**/*.ts',
		// The user components barrel file should not be transpiled as it's consumed as-is by Astro.
		// https://github.com/withastro/astro/blob/c4c99aa7a5e8e45ada0efa4fda6e6fb96f334663/packages/astro/package.json#L55
		'!src/components.ts',
	],
	external: [/^astro:/, /^virtual:starlight\//],
	outDir,
	plugins: [rawImportPlugin(), globCopyPlugin(['**/*.astro'], 'src')],
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

/**
 * Plugin copying files matching given glob patterns to the output directory.
 *
 * The tsdown `copy` option does not support glob patterns, which can be useful in the case of
 * Astro files that we all want to copy over as-is. Specifying each directory containing Astro
 * files to the `copy` option would be tedious and would also end up copying non-Astro files, e.g.
 * TypeScript files in the `src/components/` directory that we do not want to copy as-is.
 */
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
