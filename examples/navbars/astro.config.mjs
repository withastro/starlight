import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export const locales = {
	root: { label: 'English', lang: 'en' },
	de: { label: 'Deutsch', lang: 'de' },
	es: { label: 'Español', lang: 'es' },
	ja: { label: '日本語', lang: 'ja' },
	fr: { label: 'Français', lang: 'fr' },
	it: { label: 'Italiano', lang: 'it' },
	zh: { label: '简体中文', lang: 'zh' },
	'pt-br': { label: 'Português do Brasil', lang: 'pt-BR' },
	ko: { label: '한국어', lang: 'ko' },
};

const guides = {
	de: 'Anleitungen',
	es: 'Guías',
	ja: 'ガイド',
	fr: 'Guides',
	it: 'Guide',
	zh: '指南',
	'pt-BR': 'Guias',
	ko: '가이드',
};

const reference = {
	de: 'Referenz',
	es: 'Referencias',
	ja: 'リファレンス',
	fr: 'Référence',
	it: 'Riferimenti',
	zh: '参考',
	'pt-BR': 'Referência',
	ko: '참조',
};

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'My Docs (with navbar)',
			social: {
				github: 'https://github.com/withastro/starlight',
			},
			locales,
			sidebar: [
				{
					label: 'Shared sidebar',
					items: [{ link: '/', label: 'Back to home' }],
				},
			],
			navbar: {
				'/': { link: '/', label: 'Home' },
				guides: {
					link: '/guides/example/',
					label: 'Guides',
					translations: guides,
					items: [
						{
							label: 'Guides',
							translations: guides,
							items: [
								// Each item here is one entry in the navigation menu.
								{ label: 'Example Guide', link: '/guides/example/' },
							],
						},
					],
				},
				reference: {
					link: '/reference/example/',
					label: 'Reference',
					translations: reference,
					items: [
						{
							label: 'Reference',
							translations: reference,
							autogenerate: { directory: 'reference' },
						},
					],
				},
			},
		}),
	],
});
