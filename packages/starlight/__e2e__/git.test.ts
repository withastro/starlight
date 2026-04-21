import { makeTestRepo } from '../__tests__/git-utils';
import { expect, testFactory } from './test-utils';
import { rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const repoPath = fileURLToPath(new URL('./fixtures/git/', import.meta.url));

const test = testFactory(repoPath);

test.beforeAll(async () => {
	// Clears existing nested repo to account for previously interrupted tests.
	await rm(join(repoPath, '.git'), { recursive: true, force: true });
	const testRepo = makeTestRepo(repoPath);

	testRepo.commitAllChanges('Add home page', '2024-02-03');
});

test.afterAll(async () => {
	// Remove nested repo after test runs
	await rm(join(repoPath, '.git'), { recursive: true, force: true });
});

test('include last updated date from git in the footer', async ({ page, getProdServer }) => {
	const starlight = await getProdServer();
	await starlight.goto('/');

	await expect(page.locator('footer')).toContainText('Last updated: Feb 3, 2024');
});

test('include git information while developing', async ({ page, makeServer }) => {
	const starlight = await makeServer('dev', { mode: 'dev' });
	await starlight.goto('/');

	await expect(page.locator('footer')).toContainText('Last updated: Feb 3, 2024');
});
