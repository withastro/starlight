import { makeTestRepo } from '../__tests__/git-utils';
import { expect, testFactory } from './test-utils';
import { cp, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const astroPkg = JSON.parse(await readFile(require.resolve('astro/package.json'), 'utf8'));

// Setup separate
const testRepo = makeTestRepo();

const repoPath = testRepo.getFilePath('/');

const sourcePath = new URL('./fixtures/basics/', import.meta.url);
await cp(sourcePath, repoPath, { recursive: true });

testRepo.writeFileTree({
	'package.json': JSON.stringify({
		name: 'test-docs',
		private: true,
		type: 'module',
		version: '0.0.1',
		dependencies: {
			astro: astroPkg.version,
			'@astrojs/starlight': new URL('../', import.meta.url).toString(),
		},
	}),
	'.gitignore': 'node_modules\n.astro',
	src: {
		content: {
			docs: {
				'index.md': `---
title: Home Page
lastUpdated: true
---

Home page content
`,
			},
		},
	},
});

testRepo.runInRepo('pnpm', ['install']);
testRepo.commitAllChanges('Add home page', '2024-02-03');

const buildTest = await testFactory(repoPath, { mode: 'build' });
const devTest = await testFactory(repoPath, { mode: 'dev' });

buildTest('include last updated date from git in the footer', async ({ page, starlight }) => {
	await starlight.goto('/');

	await expect(page.locator('footer')).toContainText('Last updated: Feb 3, 2024');
});

devTest('include git information while developing', async ({ page, starlight }) => {
	await starlight.goto('/');

	await expect(page.locator('footer')).toContainText('Last updated: Feb 3, 2024');
});
