// import { expect, testFactory } from './test-utils';

// TODO(HiDeoo) This test and fixture should be updated to use the `legacy.collectionsBackwardsCompat` flag when available.
// TODO(HiDeoo) @see https://github.com/withastro/astro/pull/14927
// TODO(HiDeoo) When that is the case:
// TODO(HiDeoo) 	- Rename the fixture
// TODO(HiDeoo) 	- Update the comment below to reflect that the flag is being used.
// TODO(HiDeoo) 	- Uncomment the test code below.

// This fixture uses a legacy collection config file (`src/content/config.ts`) instead of the new
// one (`src/content.config.ts`).
// const test = testFactory('./fixtures/legacy-collection-config-file/');

// test('builds a custom page using the `<StarlightPage>` component and a legacy collection config file', async ({
// 	page,
// 	getProdServer,
// }) => {
// 	const starlight = await getProdServer();
// 	await starlight.goto('/custom');

// 	await expect(page.getByText('Hello')).toBeVisible();
// });
