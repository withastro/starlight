import { expect, testFactory } from './test-utils';

const test = testFactory('./fixtures/pagefind/');

test('page has pagefind data attribute', async ({ page, getProdServer }) => {
	const starlight = await getProdServer();
	await starlight.goto('/pagefind');

	const main = page.locator('main');
	await expect(main).toHaveAttribute('data-pagefind-body');
});

test('page has no pagefind data attribute', async ({ page, getProdServer }) => {
	const starlight = await getProdServer();
	await starlight.goto('/ignored-page');

	const main = page.locator('main');
	await expect(main).not.toHaveAttribute('data-pagefind-body');
});

test('page has custom weighting', async ({ page, getProdServer }) => {
	const starlight = await getProdServer();
	await starlight.goto('/custom-weight');

	const main = page.locator('main');
	await expect(main).toHaveAttribute('data-pagefind-body');
	await expect(main).toHaveAttribute('data-pagefind-weight', '5.5');
});
