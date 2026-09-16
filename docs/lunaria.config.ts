import { html, type Locale } from '@lunariajs/core';
import { defineConfig } from '@lunariajs/core/config';

export const locales = [
	{ label: 'Dansk', lang: 'da' },
	{ label: 'Deutsch', lang: 'de' },
	{ label: 'Español', lang: 'es' },
	{ label: 'فارسی', lang: 'fa' },
	{ label: 'Français', lang: 'fr' },
	{ label: 'हिंदी', lang: 'hi' },
	{ label: 'Bahasa Indonesia', lang: 'id' },
	{ label: 'Italiano', lang: 'it' },
	{ label: '日本語', lang: 'ja' },
	{ label: '한국어', lang: 'ko' },
	{ label: 'Português do Brasil', lang: 'pt-br' },
	{ label: 'Português', lang: 'pt-pt' },
	{ label: 'Русский', lang: 'ru' },
	{ label: 'Türkçe', lang: 'tr' },
	{ label: 'Українська', lang: 'uk' },
	{ label: '简体中文', lang: 'zh-cn' },
] satisfies [Locale, ...Locale[]];

export default defineConfig({
	repository: {
		name: 'withastro/starlight',
		rootDir: 'docs',
	},
	sourceLocale: {
		label: 'English',
		lang: 'en',
	},
	locales,
	files: [
		{
			include: ['src/content/docs/**/*.{md,mdx}'],
			exclude: locales.map((locale) => `src/content/docs/${locale.lang}/**`),
			pattern: {
				source: 'src/content/docs/@path',
				locales: 'src/content/docs/@lang/@path',
			},
			type: 'universal',
		},
	],
	tracking: {
		ignoredKeywords: [
			'lunaria-ignore',
			'typo',
			'en-only',
			'broken link',
			'i18nReady',
			'i18nIgnore',
		],
	},
	dashboard: {
		title: 'Starlight Docs Translation Status',
		description:
			'Translation progress tracker for the Starlight Docs site. See how much has been translated in your language and get involved!',
		site: 'https://i18n.starlight.astro.build/',
		basesToHide: ['src/content/docs/'],
		customCss: ['./lunaria/styles.css'],
		favicon: {
			external: [{ link: 'https://starlight.astro.build/favicon.svg', type: 'image/svg+xml' }],
		},
		ui: {
			'statusByLocale.heading': 'Translation progress by locale',
			'statusByLocale.incompleteLocalizationLink': 'incomplete translation',
			'statusByLocale.outdatedLocalizationLink': 'outdated translation',
			'statusByLocale.completeLocalization': 'This translation is complete, amazing job! 🎉',
			'statusByFile.heading': 'Translation status by file',
		},
	},
	renderer: {
		slots: {
			afterTitle: () => html`
				<p>
					If you're interested in helping us translate
					<a href="https://starlight.astro.build/">starlight.astro.build</a> into one of the
					languages listed below, you've come to the right place! This auto-updating page always
					lists all the content that could use your help right now.
				</p>
				<p>
					Before starting a new translation, please read our
					<a
						href="https://github.com/withastro/starlight/blob/main/CONTRIBUTING.md#translating-starlights-docs"
						>translation guide</a
					>
					to learn about our translation process and how you can get involved.
				</p>
			`,
		},
	},
});
