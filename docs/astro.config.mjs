// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import markdocGrammar from './grammars/markdoc.tmLanguage.json';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

export const locales = {
	root: { label: 'English', lang: 'en' },
	// de: { label: 'Deutsch', lang: 'de' },
	// es: { label: 'Español', lang: 'es' },
	// ja: { label: '日本語', lang: 'ja' },
	// fr: { label: 'Français', lang: 'fr' },
	// it: { label: 'Italiano', lang: 'it' },
	// id: { label: 'Bahasa Indonesia', lang: 'id' },
	// 'zh-cn': { label: '简体中文', lang: 'zh-CN' },
	// 'pt-br': { label: 'Português do Brasil', lang: 'pt-BR' },
	// 'pt-pt': { label: 'Português', lang: 'pt-PT' },
	// ko: { label: '한국어', lang: 'ko' },
	// tr: { label: 'Türkçe', lang: 'tr' },
	// ru: { label: 'Русский', lang: 'ru' },
	// hi: { label: 'हिंदी', lang: 'hi' },
	// da: { label: 'Dansk', lang: 'da' },
	// uk: { label: 'Українська', lang: 'uk' },
};

/* https://docs.netlify.com/configure-builds/environment-variables/#read-only-variables */
const NETLIFY_PREVIEW_SITE = process.env.CONTEXT !== 'production' && process.env.DEPLOY_PRIME_URL;

const site = 'https://docs.getaxal.com/';
const ogUrl = new URL('og.jpg?v=1', site).href;
const ogImageAlt = 'Make your docs shine with Starlight';

export default defineConfig({
	site,
	trailingSlash: 'always',
			integrations: [
			starlight({
				title: 'Axal',
				logo: {
					light: '/src/assets/axal-light.svg',
					dark: '/src/assets/axal-dark.svg',
					replacesTitle: true,
				},
				components: {
					Header: './src/components/CustomHeader.astro',
					MobileMenuFooter: './src/components/CustomMobileMenuFooter.astro',
					PageTitle: './src/components/CustomPageTitle.astro',
				},
			lastUpdated: true,
			editLink: {
				baseUrl: 'https://github.com/getaxal/',
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/getaxal/' },
				{ icon: 'discord', label: 'Discord', href: 'https://discord.gg/d7Urwwk3' },
			],
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
					label: 'Getting started',
					items: [
						'getting-started/introduction',
						'getting-started/depositing-crypto',
						'getting-started/depositing-from-bank',
						'getting-started/starting-to-earn',
						'getting-started/withdrawing-funds',
						'getting-started/portfolio-performance',
					],
				},
				{
					label: 'How it works',
					items: [
						'how-it-works/on-ramping',
						'how-it-works/self-custodied-wallets',
						'how-it-works/optimizing-portfolio',
						'how-it-works/7702-transactions',
						'how-it-works/verified-signing',
						'how-it-works/strategies',
						'how-it-works/contracts',
					],
				},
				{
					label: 'Referrals',
					items: [
						'referrals/overview',
					],
				},
				{
					label: 'Security',
					items: [
						'security/audits',
						'security/bug-bounties',
						'security/partners',
					],
				},
				{
					label: 'API [coming soon]',
					link: '/api/coming-soon',
				},
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
		icon(),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
