// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import markdocGrammar from './grammars/markdoc.tmLanguage.json';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

export const locales = {
	root: { label: 'English', lang: 'en' },
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
					Sidebar: './src/components/CustomSidebar.astro',
				},
			lastUpdated: true,
			editLink: {
				baseUrl: 'https://github.com/getaxal/',
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/getaxal/' },
				{ icon: 'x.com', label: 'X', href: 'https://x.com/getaxal' },
				{ icon: 'substack', label: 'Substack', href: 'https://axal.substack.com/' },
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
						'getting-started/quick-start',
						'getting-started/depositing-crypto',
						'getting-started/depositing-with-card-bank',
					],
				},
				{
					label: 'Start Earning',
					items: [
						'how-it-works/tracking-your-portfolio',
						'how-it-works/optimizing-portfolio',
						'how-it-works/strategies',
					],
				},
				{
					label: 'How it works',
					items: [
						'how-it-works/7702-transactions',
						'how-it-works/verified-signing',
						'how-it-works/contracts',
						'how-it-works/export-your-wallet',
						'referrals/overview',
					],
				},
				{
					label: 'Security',
					items: [
						'security/audits',
						'security/partners',
					],
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
		plugins: [/** @type {any} */ (tailwindcss())],
	},
});
