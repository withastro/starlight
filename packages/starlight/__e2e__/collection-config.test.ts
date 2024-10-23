import { expect, testFactory } from './test-utils';

// This fixture contains a space in the directory so that we have a smoke test for building
// Starlight projects with pathnames like this, which are a common source of bugs.
const test = testFactory('./fixtures/custom src-dir/');

test('builds a custom page using the `<StarlightPage>` component and a custom `srcDir`', async ({
	page,
	getProdServer,
}) => {
	const starlight = await getProdServer();
	await starlight.goto('/custom');

	await expect(page.getByText('Hello')).toBeVisible();
});
