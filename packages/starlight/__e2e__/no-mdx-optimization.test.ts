import { expect, testFactory } from './test-utils';

const test = testFactory('./fixtures/no-mdx-optimization/');

test.describe('no MDX optimization', () => {
	test.describe('asides', () => {
		test('asides render an SVG icon', async ({ page, getProdServer }) => {
			const starlight = await getProdServer();
			await starlight.goto('/asides/');

			const asideIconsLocator = page.locator('.starlight-aside__title svg');
			await expect(asideIconsLocator).toHaveCount(4);
		});
	});
});
