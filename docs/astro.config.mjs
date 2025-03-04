// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import markdocGrammar from './grammars/markdoc.tmLanguage.json';

export const locales = {
	root: { label: 'English', lang: 'en' },
	de: { label: 'Deutsch', lang: 'de' },
	'zh-cn': { label: '简体中文', lang: 'zh-CN' },
};

/* https://docs.netlify.com/configure-builds/environment-variables/#read-only-variables */
const NETLIFY_PREVIEW_SITE = process.env.CONTEXT !== 'production' && process.env.DEPLOY_PRIME_URL;

const site = NETLIFY_PREVIEW_SITE || 'https://starlight.astro.build/';
const ogUrl = new URL('og.jpg?v=1', site).href;
const ogImageAlt = 'Make your docs shine with Starlight';

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
				baseUrl: 'https://github.com/INMOXR/support/tree/main/docs',
			},
			social: {
				website: 'https://www.inmoxr.com',
				x: 'https://x.com/inmoxreality',
				instagram: 'https://www.instagram.com/inmo.xr/',
				facebook: 'https://www.facebook.com/inmocares',
				discord: 'https://astro.build/chat',
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
			locales: locales
			sidebar: {
				// 英文文档结构（默认）
				'/go/': [
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
				  // 中文文档结构
				  '/zh-cn/go/': [
					{
						label: '开始',
						items: [
						  { label: 'Overview', link: '/go/' },
						  { label: 'Quick Start', link: '/go/quick-start/' },
						],
					  },
					  {
						label: '用户手册',
						items: [
						  { label: 'User Manual', link: '/go/manual/' },
						  { label: 'Features', link: '/go/features/' },
						  { label: 'Settings', link: '/go/settings/' },
						],
					  },
					  {
						label: '常见问题',
						items: [
						  { label: 'Troubleshooting', link: '/go/troubleshooting/' },
						  { label: 'FAQ', link: '/go/faq/' },
						],
					  },
				  ],
			},
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
