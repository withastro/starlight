import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assert, test } from 'vitest';

const srcDir = fileURLToPath(new URL('../../src/', import.meta.url));

const barrelImportRegex = /from\s+['"](\.{1,2}\/)+components(\.ts)?['"]/;

test('internal files do not import the user components barrel file', async () => {
	const filesImportingBarrel: string[] = [];

	for await (const file of fs.glob('**/*.{astro,ts}', { cwd: srcDir })) {
		const content = await fs.readFile(path.join(srcDir, file), 'utf8');

		if (barrelImportRegex.test(content)) {
			filesImportingBarrel.push(file);
		}
	}

	if (filesImportingBarrel.length > 0) {
		assert.fail(
			'Import user components directly (e.g. `../user-components/Icon.astro`) instead of using ' +
				'the user components barrel file in the following file(s):\n\n' +
				`- ${filesImportingBarrel.join('\n- ')}` +
				'\n'
		);
	}
});
