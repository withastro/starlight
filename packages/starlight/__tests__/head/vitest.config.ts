import { defineVitestConfig } from '../test-config';

export default defineVitestConfig({
	title: 'Docs With Custom Head',
	description: 'Docs with a custom head',
	head: [
		{ tag: 'link', attrs: { rel: 'canonical', href: 'https://example.com/test' } },
		{ tag: 'link', attrs: { rel: 'stylesheet', href: 'primary.css' } },
		{ tag: 'meta', attrs: { name: 'x', content: 'Default' } },
		{ tag: 'meta', attrs: { property: 'x', content: 'Default' } },
		{ tag: 'meta', attrs: { 'http-equiv': 'x', content: 'Default' } },
		{
			tag: 'script',
			attrs: {
				src: 'https://example.com/analytics',
				'data-site': 'TEST-ANALYTICS-ID',
				defer: true,
			},
		},
	],
	social: [{ icon: 'twitter', label: 'Twitter', href: 'https://twitter.com/astrodotbuild' }],
});
