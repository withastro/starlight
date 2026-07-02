import { expect, testFactory } from './test-utils';

const test = testFactory('./fixtures/no-mdx-optimization/');

test.describe('no MDX optimization', () => {
	test.describe('asides', () => {
		test('asides render an SVG icon', async ({ page, getProdServer }) => {
			const starlight = await getProdServer();
			await starlight.goto('/asides/');

			const asideIconsLocator = page.locator('.starlight-aside__title svg');

			// All four aside instances should have an icon, so we expect four icons to be rendered.
			// This checks an issue where SVGs were escaped and rendered as text with MDX optimization
			// disabled. See https://github.com/withastro/starlight/pull/3967#issuecomment-4833368829
			await expect(asideIconsLocator).toHaveCount(4);
		});
	});
});
