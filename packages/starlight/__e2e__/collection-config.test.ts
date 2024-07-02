import { expect, testFactory } from './test-utils';

const test = await testFactory('./fixtures/custom-src-dir/');

test('builds a custom page using the `<StarlightPage>` component and a custom `srcDir`', async ({
	page,
	starlight,
}) => {
	await starlight.goto('/custom');

	await expect(page.getByText('Hello')).toBeVisible();
});
