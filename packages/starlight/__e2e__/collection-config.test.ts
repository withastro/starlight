import { expect, testFactory } from './test-utils';

const test = testFactory('./fixtures/custom-src-dir/');

test('builds a custom page using the `<StarlightPage>` component and a custom `srcDir`', async ({
	page,
	makeServer,
}) => {
	const starlight = await makeServer();
	await starlight.goto('/custom');

	await expect(page.getByText('Hello')).toBeVisible();
});
