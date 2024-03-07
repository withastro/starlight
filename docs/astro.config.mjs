import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

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
	hi: { label: 'हिंदी', lang: 'hi' },
	da: { label: 'Dansk', lang: 'da' },
	nb: { label: 'Norsk (bokmål)', lang: 'nb' },
	uk: { label: 'Українська', lang: 'uk' },
};

/* https://vercel.com/docs/projects/environment-variables/system-environment-variables#system-environment-variables */
const VERCEL_PREVIEW_SITE =
	process.env.VERCEL_ENV !== 'production' &&
	process.env.VERCEL_URL &&
	`https://${process.env.VERCEL_URL}`;

const site = VERCEL_PREVIEW_SITE || 'https://starlight.astro.build/';

export default defineConfig({
	site,
	trailingSlash: 'always',
	integrations: [
		starlight({
			title: 'Starlight',
			logo: {
				light: '/src/assets/logo-light.svg',
				dark: '/src/assets/logo-dark.svg',
				replacesTitle: true,
			},
			editLink: {
				baseUrl: 'https://github.com/withastro/starlight/edit/main/docs/',
			},
			social: {
				github: 'https://github.com/withastro/starlight',
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
					attrs: { property: 'og:image', content: site + 'og.jpg?v=1' },
				},
				{
					tag: 'meta',
					attrs: { property: 'twitter:image', content: site + 'og.jpg?v=1' },
				},
			],
			customCss: process.env.NO_GRADIENTS ? [] : ['./src/assets/landing.css'],
			locales,
			sidebar: [
				{
					label: 'Start Here',
					translations: {
						de: 'Beginne hier',
						es: 'Comienza aqui',
						fr: 'Commencez ici',
						hi: 'यहाँ से शुरू करे',
						id: 'Mulai dari sini',
						it: 'Inizia qui',
						ja: 'ここからはじめる',
						ko: '여기서부터',
						nb: 'Start her',
						'pt-BR': 'Comece Aqui',
						'pt-PT': 'Comece Aqui',
						ru: 'Начать отсюда',
						tr: 'Buradan Başlayın',
						uk: 'Почніть звідси',
						'zh-CN': '从这里开始',
					},
					items: [
						{
							label: 'Getting Started',
							link: 'getting-started',
							translations: {
								de: 'Erste Schritte',
								es: 'Empezando',
								fr: 'Mise en route',
								hi: 'पहले कदम',
								id: 'Memulai',
								it: 'Iniziamo',
								ja: '入門',
								ko: '시작하기',
								nb: 'Kom i gang',
								'pt-BR': 'Introdução',
								'pt-PT': 'Introdução',
								ru: 'Введение',
								tr: 'Başlarken',
								uk: 'Вступ',
								'zh-CN': '开始使用',
							},
						},
						{
							label: 'Manual Setup',
							link: 'manual-setup',
							translations: {
								de: 'Manuelle Einrichtung',
								es: 'Configuración Manual',
								fr: 'Installation manuelle',
								hi: 'मैनुअल सेटअप',
								id: 'Instalasi Manual',
								ja: '手動セットアップ',
								ko: '수동으로 설정하기',
								nb: 'Manuelt oppsett',
								'pt-BR': 'Instalação Manual',
								'pt-PT': 'Instalação Manual',
								ru: 'Установка вручную',
								tr: 'Elle Kurulum',
								uk: 'Ручне встановлення',
								'zh-CN': '手动配置',
							},
						},
						{
							label: 'Environmental Impact',
							link: 'environmental-impact',
							translations: {
								de: 'Umweltbelastung',
								es: 'Documentación ecológica',
								fr: 'Impact environnemental',
								hi: 'पर्यावरणीय प्रभाव',
								id: 'Dampak terhadap lingkungan',
								it: 'Impatto ambientale',
								ja: '環境への負荷',
								ko: '환경적 영향',
								nb: 'Miljøpåvirkning',
								'pt-BR': 'Impacto Ambiental',
								'pt-PT': 'Impacto Ambiental',
								ru: 'Влияние на окружающую среду',
								tr: 'Çevre Etkisi',
								uk: 'Вплив на довкілля',
								'zh-CN': '环境影响',
							},
						},
					],
				},
				{
					label: 'Guides',
					translations: {
						de: 'Anleitungen',
						es: 'Guías',
						fr: 'Guides',
						hi: 'गाइड',
						id: 'Panduan',
						it: 'Guide',
						ja: 'ガイド',
						ko: '가이드',
						nb: 'Guider',
						'pt-BR': 'Guias',
						ru: 'Руководства',
						tr: 'Rehber',
						uk: 'Ґайди',
						'zh-CN': '指南',
					},
					autogenerate: { directory: 'guides' },
				},
				{
					label: 'Reference',
					translations: {
						de: 'Referenz',
						es: 'Referencias',
						fr: 'Référence',
						hi: 'संदर्भ',
						id: 'Referensi',
						it: 'Riferimenti',
						ja: 'リファレンス',
						ko: '참조',
						nb: 'Referanser',
						'pt-BR': 'Referência',
						ru: 'Справочник',
						tr: 'Referanslar',
						uk: 'Довідник',
						'zh-CN': '参考',
					},
					autogenerate: { directory: 'reference' },
				},
				{
					label: 'Resources',
					badge: 'New',
					translations: {
						fr: 'Ressources',
						ja: 'リソース',
						nb: 'Ressurser',
						'pt-BR': 'Recursos',
						'zh-CN': '资源',
					},
					autogenerate: { directory: 'resources' },
				},
			],
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
