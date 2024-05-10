import { makeTestProject, type FileTree, longTest } from '../test-e2e-utils';
import node from '@astrojs/node';
import starlight from '../../index';
import * as cheerio from 'cheerio';
import { expect } from 'vitest';

longTest('SSR mode renders the same content page', async () => {
	const fileTree: FileTree = {
		src: {
			content: {
				docs: {
					'index.md': `---
title: Home Page
---

Home page content
`,
				},
			},
		},
	};

	const staticProject = makeTestProject({
		fileTree,
		config: {
			output: 'static',
			integrations: [
				starlight({
					title: 'Test Docs',
					lastUpdated: true,
					pagefind: false,
				}),
			],
			server: { port: 9999 },
		},
	});

	const ssrProject = makeTestProject({
		fileTree,
		config: {
			output: 'server',
			adapter: node({ mode: 'standalone' }),
			integrations: [
				starlight({
					title: 'Test Docs',
					lastUpdated: true,
					prerender: false,
				}),
			],
			server: { port: 10000 },
		},
	});

	await Promise.all([staticProject.build(), ssrProject.build()]);
	await Promise.all([staticProject.preview(), ssrProject.preview()]);

	const staticResponse = await staticProject.fetch('/');
	const ssrResponse = await ssrProject.fetch('/');

	expectEquivalentHTML(await staticResponse.text(), await ssrResponse.text());
});

longTest('SSR mode renders the same splash page', async () => {
	const fileTree: FileTree = {
		src: {
			content: {
				docs: {
					'index.md': `---
title: Home Page
template: splash
hero:
  title: Make your docs shine with Starlight
  tagline: Everything you need to build a stellar documentation website. Fast, accessible, and easy-to-use.
  actions:
    - text: Get started
      icon: right-arrow
      variant: primary
      link: /getting-started/
    - text: View on GitHub
      icon: external
      link: https://github.com/withastro/starlight
---

Home page content
`,
				},
			},
		},
	};

	const staticProject = makeTestProject({
		fileTree,
		config: {
			output: 'static',
			integrations: [
				starlight({
					title: 'Test Docs',
					lastUpdated: true,
					pagefind: false,
				}),
			],
			server: { port: 9999 },
		},
	});

	const ssrProject = makeTestProject({
		fileTree,
		config: {
			output: 'server',
			adapter: node({ mode: 'standalone' }),
			integrations: [
				starlight({
					title: 'Test Docs',
					lastUpdated: true,
					prerender: false,
				}),
			],
			server: { port: 10000 },
		},
	});

	await Promise.all([staticProject.build(), ssrProject.build()]);
	await Promise.all([staticProject.preview(), ssrProject.preview()]);

	const staticResponse = await staticProject.fetch('/');
	const ssrResponse = await ssrProject.fetch('/');

	expectEquivalentHTML(await staticResponse.text(), await ssrResponse.text());
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
