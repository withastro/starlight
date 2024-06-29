import { expect, testFactory } from './test-utils';
import assert from 'node:assert';
import * as cheerio from 'cheerio';

const test = await testFactory('./fixtures/ssr/');

test('SSR mode renders the same content page as prerendering', async ({
	starlight,
	makeServer,
}) => {
	const prerenderedContent = await starlight.goto('/tabs').then((res) => res?.text());
	assert(prerenderedContent);

	process.env.STARLIGHT_SSR = 'yes';
	const ssrStarlight = await makeServer({
		config: {
			server: { port: 4322 },
		},
	});
	const ssrContent = await ssrStarlight.goto('/tabs').then((res) => res?.text());
	assert(ssrContent);

	expectEquivalentHTML(prerenderedContent, ssrContent);
});

test('SSR mode renders the same splash page as prerendering', async ({ starlight, makeServer }) => {
	const prerenderedContent = await starlight.goto('/').then((res) => res?.text());
	assert(prerenderedContent);

	process.env.STARLIGHT_SSR = 'yes';
	const ssrStarlight = await makeServer({
		config: {
			server: { port: 4322 },
		},
	});
	const ssrContent = await ssrStarlight.goto('/').then((res) => res?.text());
	assert(ssrContent);

	expectEquivalentHTML(prerenderedContent, ssrContent);
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
