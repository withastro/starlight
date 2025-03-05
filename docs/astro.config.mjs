// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import markdocGrammar from './grammars/markdoc.tmLanguage.json';

export const locales = {
	root: { label: 'English', lang: 'en' },
	de: { label: 'Deutsch', lang: 'de' },
	es: { label: 'Español', lang: 'es' },
	ja: { label: '日本語', lang: 'ja' },
	fr: { label: 'Français', lang: 'fr' },
	it: { label: 'Italiano', lang: 'it' },
	id: { label: 'Bahasa Indonesia', lang: 'id' },
	'zh-cn': { label: '简体中文', lang: 'zh-CN' },
	'pt-br': { label: 'Português do Brasil', lang: 'pt-BR' },
	'pt-pt': { label: 'Português', lang: 'pt-PT' },
	ko: { label: '한국어', lang: 'ko' },
	tr: { label: 'Türkçe', lang: 'tr' },
	ru: { label: 'Русский', lang: 'ru' },
	da: { label: 'Dansk', lang: 'da' },
	uk: { label: 'Українська', lang: 'uk' },
};

/* https://docs.netlify.com/configure-builds/environment-variables/#read-only-variables */
const NETLIFY_PREVIEW_SITE = process.env.CONTEXT !== 'production' && process.env.DEPLOY_PRIME_URL;

const site = NETLIFY_PREVIEW_SITE || 'https://support.inmoxr.com';
const ogUrl = new URL('og.jpg?v=1', site).href;
const ogImageAlt = 'INMO AR Glasses Support';

export default defineConfig({
	site,
	trailingSlash: 'always',
	integrations: [
		starlight({
			title: 'INMO Support',
			defaultLocale: 'root',
			logo: {
				light: '/src/assets/inmo-logo-black.svg',
				dark: '/src/assets/inmo-logo-white.svg',
				replacesTitle: true,
			},
			lastUpdated: true,
			editLink: {
				baseUrl: 'https://github.com/INMOXR/support/tree/main/docs/src/content/docs',
			},
			social: {
				twitter: 'https://x.com/inmoxreality',
				facebook: 'https://www.facebook.com/inmocares',
				instagram: 'https://www.instagram.com/inmo.xr/',
				youtube: 'https://www.youtube.com/@inmo-xr',
				discord: 'https://discord.gg/daQShJJH',
			},
			head: [
				{
					tag: 'script',
					attrs: {
						src: 'https://cdn.usefathom.com/script.js',
						'data-site': 'EZBHTSIG',
						defer: true,
					},
				},
				{
					tag: 'meta',
					attrs: { property: 'og:image', content: ogUrl },
				},
				{
					tag: 'meta',
					attrs: { property: 'og:image:alt', content: ogImageAlt },
				},
			],
			customCss: ['./src/assets/landing.css'],
			locales,
			sidebar: [
				{
				  label: 'INMO GO',
				  items: [
					{
					  label: 'Getting Started',
					  items: [
						{ label: 'Overview', link: '/go/' },
						{ label: 'Quick Start', link: '/go/quick-start/' },
					  ],
					},
					{
					  label: 'User Guide',
					  items: [
						{ label: 'User Manual', link: '/go/manual/' },
						{ label: 'Features', link: '/go/features/' },
						{ label: 'Settings', link: '/go/settings/' },
					  ],
					},
					{
					  label: 'Support',
					  items: [
						{ label: 'Troubleshooting', link: '/go/troubleshooting/' },
						{ label: 'FAQ', link: '/go/faq/' },
					  ],
					},
				  ],
				},
				// 可以继续添加其他产品的文档结构
			  ],
			expressiveCode: { shiki: { langs: [markdocGrammar] } },
			plugins: process.env.CHECK_LINKS
				? [
						starlightLinksValidator({
							errorOnFallbackPages: false,
							errorOnInconsistentLocale: true,
						}),
					]
				: [],
		}),
	],
});
