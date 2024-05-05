import { describe, expect, test } from 'vitest';
import config from 'virtual:starlight/user-config';
import { getAstroI18nConfig, pickLang } from '../../utils/i18n';

describe('pickLang', () => {
	const dictionary = { en: 'Hello', fr: 'Bonjour' };

	test('returns the requested language string', () => {
		expect(pickLang(dictionary, 'en')).toBe('Hello');
		expect(pickLang(dictionary, 'fr')).toBe('Bonjour');
	});

	test('returns undefined for unknown languages', () => {
		expect(pickLang(dictionary, 'ar' as any)).toBeUndefined();
	});
});

describe('getAstroI18nConfig', () => {
	test('returns Astro i18n config for a monolingual site using the built-in default locale', () => {
		const i18nConfig = getAstroI18nConfig(config);

		expect(i18nConfig.defaultLocale).toBe('en');
		expect(i18nConfig.locales).toEqual(['en']);
		expect(i18nConfig.routing?.prefixDefaultLocale).toBe(false);
	});
});
