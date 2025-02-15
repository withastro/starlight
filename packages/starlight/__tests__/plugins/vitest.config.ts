import { defineVitestConfig } from '../test-config';

export default defineVitestConfig({
	title: 'Plugins',
	sidebar: [{ label: 'Getting Started', link: 'getting-started' }],
	defaultLocale: 'en',
	locales: {
		en: { label: 'English', lang: 'en' },
		fr: { label: 'French' },
		ar: { label: 'Arabic', dir: 'rtl' },
		'pt-br': { label: 'Brazilian Portuguese', lang: 'pt-BR' },
	},
	plugins: [
		{
			name: 'test-plugin-1',
			hooks: {
				'config:setup'({ config, updateConfig }) {
					updateConfig({
						title: `${config.title} - Custom`,
						description: 'plugin 1',
						/**
						 * The configuration received by a plugin should be the user provided configuration as-is
						 * befor any Zod `transform`s are applied.
						 * To test this, we use this plugin to update the `favicon` value to a specific value if
						 * the `favicon` config value is an object, which would mean that the associated Zod
						 * `transform` was applied.
						 */
						favicon: typeof config.favicon === 'object' ? 'invalid.svg' : 'valid.svg',
					});
				},
			},
		},
		{
			name: 'test-plugin-2',
			hooks: {
				'config:setup'({ config, updateConfig }) {
					updateConfig({
						description: `${config.description} - plugin 2`,
						sidebar: [{ label: 'Showcase', link: 'showcase' }],
					});
				},
			},
		},
		{
			name: 'test-plugin-3',
			hooks: {
				'i18n:setup'({ injectTranslations }) {
					injectTranslations({
						en: {
							'search.label': 'Search the thing',
							'testPlugin3.doThing': 'Do the Plugin 3 thing',
						},
						fr: {
							'search.label': 'Rechercher le truc',
							'testPlugin3.doThing': 'Faire la chose du plugin 3',
						},
						ar: {
							'testPlugin3.doThing': 'قم بعمل المكون الإضافي 3',
						},
					});
				},
				async 'config:setup'({ config, updateConfig, useTranslations, absolutePathToLang }) {
					// Fake an async operation to ensure that the plugin system can handle async hooks.
					await Promise.resolve();

					const docsUrl = new URL('../src/content/docs/', import.meta.url);

					// To test that a plugin can access UI strings in the plugin context using the
					// `useTranslations()` helper and also use the `absolutePathToLang()` helper, we generate
					// a bunch of expected values that are JSON stringified, passed to the config through the
					// `titleDelimiter` option, and later parsed and verified in a test.
					const result = {
						uiStrings: [
							useTranslations('en')('skipLink.label'),
							useTranslations('fr')('search.label'),
							// @ts-expect-error - `testPlugin3.doThing` is a translation key injected by a test plugin
							useTranslations('en')('testPlugin3.doThing'),
						],
						langs: [
							absolutePathToLang(new URL('./en/index.md', docsUrl).pathname),
							absolutePathToLang(new URL('./pt-br/index.md', docsUrl).pathname),
							absolutePathToLang(new URL('./index.md', docsUrl).pathname),
						],
					};

					updateConfig({
						description: `${config.description} - plugin 3`,
						titleDelimiter: JSON.stringify(result),
					});
				},
			},
		},
	],
});
