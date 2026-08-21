import { pluginFramesTexts } from 'astro-expressive-code';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { getBlockLocale } from '../../integrations/expressive-code/preprocessor';
import { addTranslations } from '../../integrations/expressive-code/translations';
import { StarlightConfigSchema, type StarlightUserConfig } from '../../utils/user-config';

vi.mock('astro-expressive-code', async () => {
	const mod =
		await vi.importActual<typeof import('astro-expressive-code')>('astro-expressive-code');
	return {
		...mod,
		pluginFramesTexts: {
			...mod.pluginFramesTexts,
			overrideTexts: vi.fn(),
		},
	};
});

describe('addTranslations', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	test('adds default english translations with no i18n config', () => {
		const [config, useTranslations] = getStarlightConfigAndUseTranslations(undefined);

		addTranslations(config, useTranslations);

		expect(getExpressiveCodeOverriddenLanguages()).toEqual(['en']);
	});

	test('adds translations in a monolingual site with english as root locale', () => {
		const [config, useTranslations] = getStarlightConfigAndUseTranslations({
			root: { label: 'English', lang: 'en' },
		});

		addTranslations(config, useTranslations);

		expect(getExpressiveCodeOverriddenLanguages()).toEqual(['en']);
	});

	test('adds translations in a monolingual site with french as root locale', () => {
		const [config, useTranslations] = getStarlightConfigAndUseTranslations({
			root: { label: 'Français', lang: 'fr' },
		});

		addTranslations(config, useTranslations);

		expect(getExpressiveCodeOverriddenLanguages()).toEqual(['fr']);
	});

	test('add translations in a multilingual site with english as root locale', () => {
		const [config, useTranslations] = getStarlightConfigAndUseTranslations({
			root: { label: 'English', lang: 'en' },
			fr: { label: 'French' },
		});

		addTranslations(config, useTranslations);

		expect(getExpressiveCodeOverriddenLanguages()).toEqual(['en', 'fr']);
	});

	test('add translations in a multilingual site with french as root locale', () => {
		const [config, useTranslations] = getStarlightConfigAndUseTranslations({
			root: { label: 'French', lang: 'fr' },
			ru: { label: 'Русский', lang: 'ru' },
		});

		addTranslations(config, useTranslations);

		expect(getExpressiveCodeOverriddenLanguages()).toEqual(['fr', 'ru']);
	});

	test('add translations in a multilingual site with english as default locale', () => {
		const [config, useTranslations] = getStarlightConfigAndUseTranslations(
			{
				en: { label: 'English', lang: 'en' },
				fr: { label: 'French' },
			},
			'en'
		);

		addTranslations(config, useTranslations);

		expect(getExpressiveCodeOverriddenLanguages()).toEqual(['en', 'fr']);
	});

	test('add translations in a multilingual site with french as default locale', () => {
		const [config, useTranslations] = getStarlightConfigAndUseTranslations(
			{
				fr: { label: 'French', lang: 'fr' },
				ru: { label: 'Русский', lang: 'ru' },
			},
			'fr'
		);

		addTranslations(config, useTranslations);

		expect(getExpressiveCodeOverriddenLanguages()).toEqual(['fr', 'ru']);
	});

	test('does not add translations if the label does not exist', () => {
		const [config] = getStarlightConfigAndUseTranslations(undefined);

		addTranslations(config, getUseTranslations(false));

		expect(vi.mocked(pluginFramesTexts.overrideTexts)).not.toHaveBeenCalled();
	});
});

describe('getBlockLocale', () => {
	const [starlightConfig] = getStarlightConfigAndUseTranslations({
		root: { label: 'English', lang: 'en' },
		fr: { label: 'French', lang: 'fr' },
	});

	test('gets the root locale when an absolute file URL is passed', () => {
		const locale = getBlockLocale({
			starlightConfig,
			docsPath: '/path/to/docs/',
			file: {
				path: '/path/to/docs/doc.md',
				url: new URL('file:///path/to/docs/doc.md'),
			},
		});
		expect(locale).toBe('en');
	});

	test('gets a non-root locale when an absolute file URL is passed', () => {
		const locale = getBlockLocale({
			starlightConfig,
			docsPath: '/path/to/docs/',
			file: {
				path: '/path/to/docs/fr/doc.md',
				url: new URL('file:///path/to/docs/fr/doc.md'),
			},
		});
		expect(locale).toBe('fr');
	});

	test('gets the root locale when no file URL is passed', () => {
		const locale = getBlockLocale({
			starlightConfig,
			docsPath: '/path/to/docs/',
			file: { path: '/path/to/docs/doc.md' },
		});
		expect(locale).toBe('en');
	});

	test('gets a non-root locale when no file URL is passed', () => {
		const locale = getBlockLocale({
			starlightConfig,
			docsPath: '/path/to/docs/',
			file: { path: '/path/to/docs/fr/doc.md' },
		});
		expect(locale).toBe('fr');
	});

	test('gets the root locale for a file in the docs when Astro.url is passed', () => {
		const locale = getBlockLocale({
			starlightConfig,
			docsPath: '/path/to/docs/',
			file: {
				path: 'doc.md',
				url: new URL('https://example.com/doc.md'),
			},
		});
		expect(locale).toBe('en');
	});

	test('gets a non-root locale for a file in the docs when Astro.url is passed', () => {
		const locale = getBlockLocale({
			starlightConfig,
			docsPath: '/path/to/docs/',
			file: {
				path: 'fr/doc.md',
				url: new URL('https://example.com/fr/doc.md'),
			},
		});
		expect(locale).toBe('fr');
	});
});

function getUseTranslations(exists: boolean = true) {
	const t = () => 'test UI string';
	t.exists = vi.fn().mockReturnValue(exists);
	return vi.fn().mockReturnValue(t);
}

function getStarlightConfigAndUseTranslations(
	locales: StarlightUserConfig['locales'],
	defaultLocale?: StarlightUserConfig['defaultLocale']
) {
	return [
		StarlightConfigSchema.parse({
			title: 'Expressive Code Translations Test',
			locales,
			defaultLocale,
		}),
		getUseTranslations(),
	] as const;
}

function getExpressiveCodeOverriddenLanguages() {
	return [...new Set(vi.mocked(pluginFramesTexts.overrideTexts).mock.calls.map(([lang]) => lang))];
}
