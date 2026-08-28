import { fileURLToPath } from 'node:url';
import type { AstroConfig } from 'astro';
import { expect, test } from 'vitest';
import { runPlugins } from '../../utils/plugins';
import { createTestPluginContext } from '../test-plugin-utils';

const docsUrl = new URL('../src/content/docs/', import.meta.url);

function astroI18nConfig(
	config: Pick<NonNullable<AstroConfig['i18n']>, 'defaultLocale' | 'locales'> &
		Partial<Pick<NonNullable<AstroConfig['i18n']>, 'routing'>>
): AstroConfig['i18n'] {
	return {
		routing: {
			prefixDefaultLocale: false,
			redirectToDefaultLocale: false,
			fallbackType: 'redirect',
		},
		...config,
	};
}

test('infers the lang of a page from a single-locale Astro i18n configuration', async () => {
	const { useTranslations, absolutePathToLang } = await runPlugins(
		{ title: 'Test Docs' },
		[],
		createTestPluginContext({ i18n: astroI18nConfig({ defaultLocale: 'id', locales: ['id'] }) })
	);

	const lang = absolutePathToLang(fileURLToPath(new URL('./index.md', docsUrl)));

	expect(lang).toBe('id');
	expect(useTranslations(lang)('aside.note')).toBe('Catatan');
});

test('infers the lang of a page from a multilingual Astro i18n configuration', async () => {
	const { useTranslations, absolutePathToLang } = await runPlugins(
		{ title: 'Test Docs' },
		[],
		createTestPluginContext({
			i18n: astroI18nConfig({ defaultLocale: 'id', locales: ['id', 'fr'] }),
		})
	);

	const rootLang = absolutePathToLang(fileURLToPath(new URL('./index.md', docsUrl)));
	expect(rootLang).toBe('id');
	expect(useTranslations(rootLang)('aside.note')).toBe('Catatan');

	const frLang = absolutePathToLang(fileURLToPath(new URL('./fr/index.md', docsUrl)));
	expect(frLang).toBe('fr');
	expect(useTranslations(frLang)('aside.tip')).toBe('Astuce');
});

test('exposes the locales inferred from the Astro i18n configuration to plugins', async () => {
	expect.assertions(2);

	await runPlugins(
		{ title: 'Test Docs' },
		[
			{
				name: 'test-plugin',
				hooks: {
					'config:setup'({ useTranslations, absolutePathToLang }) {
						const lang = absolutePathToLang(fileURLToPath(new URL('./index.md', docsUrl)));
						expect(lang).toBe('id');
						expect(useTranslations(lang)('aside.note')).toBe('Catatan');
					},
				},
			},
		],
		createTestPluginContext({ i18n: astroI18nConfig({ defaultLocale: 'id', locales: ['id'] }) })
	);
});
