import { expect, testFactory } from './test-utils';
import assert from 'node:assert';
import * as cheerio from 'cheerio';

const test = testFactory('./fixtures/ssr/');

test.beforeEach(() => {
	delete process.env.STARLIGHT_PRERENDER;
});

test('Render page on the server', async ({ page, getProdServer }) => {
	const starlight = await getProdServer();
	await starlight.goto('/demo');

	await expect(page.locator('#server-check')).toHaveText('On server');
});

test('Render 404 page on the server', async ({ page, getProdServer }) => {
	const starlight = await getProdServer();
	await starlight.goto('/not-found');

	await expect(page.locator('#server-check')).toHaveText('On server');
});

test('SSR mode renders the same content page as prerendering', async ({
	getProdServer,
	makeServer,
}) => {
	const starlight = await getProdServer();
	const ssrContent = await starlight.goto('/content').then((res) => res?.text());
	assert(ssrContent);

	process.env.STARLIGHT_PRERENDER = 'yes';
	const prerenderStarlight = await makeServer('prerender');
	const prerenderContent = await prerenderStarlight.goto('/content').then((res) => res?.text());
	assert(prerenderContent);

	expectEquivalentHTML(prerenderContent, ssrContent);
});

test('SSR mode renders the same splash page as prerendering', async ({
	getProdServer,
	makeServer,
}) => {
	const starlight = await getProdServer();
	const ssrContent = await starlight.goto('/').then((res) => res?.text());
	assert(ssrContent);

	process.env.STARLIGHT_PRERENDER = 'yes';
	const prerenderStarlight = await makeServer('prerender');
	const prerenderContent = await prerenderStarlight.goto('/').then((res) => res?.text());
	assert(prerenderContent);

	expectEquivalentHTML(prerenderContent, ssrContent);
});

function expectEquivalentHTML(a: string, b: string) {
	const a$ = cheerio.load(a);
	const b$ = cheerio.load(b);

	a$('script[src]').attr('src', '');
	a$('link[href]').attr('href', '');

	b$('script[src]').attr('src', '');
	b$('link[href]').attr('href', '');

	expect(a$.html()).toEqual(b$.html());
}
