import { expect, testFactory } from './test-utils';

// This fixture uses the `legacy.collectionsBackwardsCompat` flag.
const test = testFactory('./fixtures/legacy-collections-backwards-compat/');

test('builds a custom page using the `<StarlightPage>` component with the `legacy.collectionsBackwardsCompat` flag', async ({
	page,
	getProdServer,
}) => {
	const starlight = await getProdServer();
	await starlight.goto('/custom');

	await expect(page.getByText('Hello')).toBeVisible();
});
