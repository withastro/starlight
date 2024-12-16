import { expect, testFactory } from './test-utils';

// This fixture uses a legacy collection config file (`src/content/config.ts`) instead of the new
// one (`src/content.config.ts`).
const test = testFactory('./fixtures/legacy-collection-config-file/');

test('builds a custom page using the `<StarlightPage>` component and a legacy collection config file', async ({
	page,
	getProdServer,
}) => {
	const starlight = await getProdServer();
	await starlight.goto('/custom');

	await expect(page.getByText('Hello')).toBeVisible();
});
