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
					label: 'Start Here',
					translations: {
						de: 'Beginne hier',
						es: 'Comienza aqui',
						ja: 'ここからはじめる',
						fr: 'Commencez ici',
						it: 'Inizia qui',
						id: 'Mulai dari sini',
						'zh-CN': '从这里开始',
						'pt-BR': 'Comece Aqui',
						'pt-PT': 'Comece Aqui',
						ko: '시작 안내',
						tr: 'Buradan Başlayın',
						ru: 'Первые шаги',
						hi: 'यहाँ से शुरू करे',
						uk: 'Почніть звідси',
					},
					items: [
						'getting-started',
						'autopilot-yield',
						'autopilot-portfolio',
					],
				},
				{
					label: 'Yield',
					autogenerate: { directory: 'yield' },
				},
				{
					label: 'Points',
					autogenerate: { directory: 'axal-points' },
				},
				{
					label: 'Referrals',
					autogenerate: { directory: 'referrals' },
				},
				{
					label: 'Autopilot',
					autogenerate: { directory: 'autopilot' },
				},
				{
					label: 'Security and Account Abstraction',
					autogenerate: { directory: 'security' },
				},
				{
					label: 'Terms of Service',
					autogenerate: { directory: 'terms' },
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
