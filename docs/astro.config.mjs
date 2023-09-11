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

const site = 'https://starlight.astro.build/';

export default defineConfig({
	site,
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
						ja: 'ここからはじめる',
						fr: 'Commencez ici',
						it: 'Inizia qui',
						zh: '从这里开始',
						'pt-BR': 'Comece Aqui',
						ko: '여기서부터',
					},
					items: [
						{
							label: 'Getting Started',
							link: 'getting-started',
							translations: {
								de: 'Erste Schritte',
								es: 'Empezando',
								ja: '入門',
								fr: 'Mise en route',
								it: 'Iniziamo',
								zh: '开始使用',
								'pt-BR': 'Introdução',
								ko: '시작하기',
							},
						},
						{
							label: 'Manual Setup',
							link: 'manual-setup',
							translations: {
								de: 'Manuelle Einrichtung',
								es: 'Configuración Manual',
								ja: '手動セットアップ',
								fr: 'Installation manuelle',
								// it: 'Manual Setup',
								zh: '手动配置',
								'pt-BR': 'Instalação Manual',
								ko: '수동으로 설정하기',
							},
						},
						{
							label: 'Environmental Impact',
							link: 'environmental-impact',
							translations: {
								// de: '',
								es: 'Documentación ecológica',
								ja: '環境への負荷',
								fr: 'Impact environnemental',
								it: 'Impatto ambientale',
								zh: '环境影响',
								'pt-BR': 'Impacto Ambiental',
								ko: '환경적 영향',
							},
						},
						{
							label: 'Showcase',
							link: 'showcase',
							translations: {
								// de: '',
								// es: '',
								ja: 'ショーケース',
								fr: 'Vitrine',
								// it: '',
								ko: '쇼케이스',
							},
						},
					],
				},
				{
					label: 'Guides',
					translations: {
						de: 'Anleitungen',
						es: 'Guías',
						ja: 'ガイド',
						fr: 'Guides',
						it: 'Guide',
						zh: '指南',
						'pt-BR': 'Guias',
						ko: '가이드',
					},
					autogenerate: { directory: 'guides' },
				},
				{
					label: 'Reference',
					translations: {
						de: 'Referenz',
						es: 'Referencias',
						ja: 'リファレンス',
						fr: 'Référence',
						it: 'Riferimenti',
						zh: '参考',
						'pt-BR': 'Referência',
						ko: '참조',
					},
					autogenerate: { directory: 'reference' },
				},
			],
			lastUpdated: true,
		}),
	],
});
