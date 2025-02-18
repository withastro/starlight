import { pluginFramesTexts } from 'astro-expressive-code';
import { afterEach, expect, test, vi } from 'vitest';
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

afterEach(() => {
	vi.clearAllMocks();
});

test('adds default english translations with no i18n config', async () => {
	const [config, useTranslations] = getStarlightConfigAndUseTranslations(undefined);

	addTranslations(config, useTranslations);

	expect(getExpressiveCodeOverridenLanguages()).toEqual(['en']);
});

test('adds translations in a monolingual site with english as root locale', async () => {
	const [config, useTranslations] = getStarlightConfigAndUseTranslations({
		root: { label: 'English', lang: 'en' },
	});

	addTranslations(config, useTranslations);

	expect(getExpressiveCodeOverridenLanguages()).toEqual(['en']);
});

test('adds translations in a monolingual site with french as root locale', async () => {
	const [config, useTranslations] = getStarlightConfigAndUseTranslations({
		root: { label: 'Français', lang: 'fr' },
	});

	addTranslations(config, useTranslations);

	expect(getExpressiveCodeOverridenLanguages()).toEqual(['fr']);
});

test('add translations in a multilingual site with english as root locale', async () => {
	const [config, useTranslations] = getStarlightConfigAndUseTranslations({
		root: { label: 'English', lang: 'en' },
		fr: { label: 'French' },
	});

	addTranslations(config, useTranslations);

	expect(getExpressiveCodeOverridenLanguages()).toEqual(['en', 'fr']);
});

test('add translations in a multilingual site with french as root locale', async () => {
	const [config, useTranslations] = getStarlightConfigAndUseTranslations({
		root: { label: 'French', lang: 'fr' },
		ru: { label: 'Русский', lang: 'ru' },
	});

	addTranslations(config, useTranslations);

	expect(getExpressiveCodeOverridenLanguages()).toEqual(['fr', 'ru']);
});

test('add translations in a multilingual site with english as default locale', async () => {
	const [config, useTranslations] = getStarlightConfigAndUseTranslations(
		{
			en: { label: 'English', lang: 'en' },
			fr: { label: 'French' },
		},
		'en'
	);

	addTranslations(config, useTranslations);

	expect(getExpressiveCodeOverridenLanguages()).toEqual(['en', 'fr']);
});

test('add translations in a multilingual site with french as default locale', async () => {
	const [config, useTranslations] = getStarlightConfigAndUseTranslations(
		{
			fr: { label: 'French', lang: 'fr' },
			ru: { label: 'Русский', lang: 'ru' },
		},
		'fr'
	);

	addTranslations(config, useTranslations);

	expect(getExpressiveCodeOverridenLanguages()).toEqual(['fr', 'ru']);
});

test('does not add translations if the label does not exist', async () => {
	const [config] = getStarlightConfigAndUseTranslations(undefined);

	addTranslations(config, getUseTranslations(false));

	expect(vi.mocked(pluginFramesTexts.overrideTexts)).not.toHaveBeenCalled();
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

function getExpressiveCodeOverridenLanguages() {
	return [...new Set(vi.mocked(pluginFramesTexts.overrideTexts).mock.calls.map(([lang]) => lang))];
}
