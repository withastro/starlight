import { expect, testFactory } from './test-utils';

const test = testFactory('./fixtures/no-node-builtins/');

test('builds without any dependencies on Node.js builtins', async ({ page, getProdServer }) => {
	const starlight = await getProdServer();
	await starlight.goto('/');

	await expect(page.getByText('Home page content')).toBeVisible();
});
