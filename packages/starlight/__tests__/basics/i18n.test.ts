import { assert, describe, expect, test, vi } from 'vitest';
import config from 'virtual:starlight/user-config';
import { processI18nConfig, pickLang } from '../../utils/i18n';
import type { AstroConfig } from 'astro';
import type { AstroUserConfig } from 'astro/config';

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

describe('processI18nConfig', () => {
	test('returns the Astro i18n config for an unconfigured monolingual site using the built-in default locale', () => {
		const { astroI18nConfig, starlightConfig } = processI18nConfig(config, undefined);

		expect(astroI18nConfig.defaultLocale).toBe('en');
		expect(astroI18nConfig.locales).toEqual(['en']);
		assert(typeof astroI18nConfig.routing !== 'string');
		expect(astroI18nConfig.routing?.prefixDefaultLocale).toBe(false);

		// The Starlight configuration should not be modified.
		expect(config).toStrictEqual(starlightConfig);
	});

	describe('with a provided Astro i18n config', () => {
		test('throws an error when an Astro i18n `manual` routing option is used', () => {
			expect(() =>
				processI18nConfig(
					config,
					getAstroI18nTestConfig({
						defaultLocale: 'en',
						locales: ['en', 'fr'],
						routing: 'manual',
					})
				)
			).toThrowErrorMatchingInlineSnapshot(`
				"[AstroUserError]:
					Starlight is not compatible with the \`manual\` routing option in the Astro i18n configuration.
				Hint:
					"
			`);
		});

		test('throws an error when an Astro i18n config contains an invalid locale', () => {
			expect(() =>
				processI18nConfig(
					config,
					getAstroI18nTestConfig({
						defaultLocale: 'en',
						locales: ['en', 'foo'],
					})
				)
			).toThrowErrorMatchingInlineSnapshot(`
				"[AstroUserError]:
					Failed to get locale informations for the 'foo' locale.
				Hint:
					Make sure to provide a valid BCP-47 tags (e.g. en, ar, or zh-CN)."
			`);
		});

		test.each([
			{
				i18nConfig: { defaultLocale: 'en', locales: ['en'] },
				expected: {
					defaultLocale: { label: 'English', lang: 'en', dir: 'ltr', locale: undefined },
				},
			},
			{
				i18nConfig: { defaultLocale: 'fr', locales: [{ codes: ['fr'], path: 'fr' }] },
				expected: {
					defaultLocale: { label: 'Français', lang: 'fr', dir: 'ltr', locale: undefined },
				},
			},
			{
				i18nConfig: {
					defaultLocale: 'fa',
					locales: ['fa'],
					routing: { prefixDefaultLocale: false },
				},
				expected: {
					defaultLocale: { label: 'فارسی', lang: 'fa', dir: 'rtl', locale: undefined },
				},
			},
		])(
			'updates the Starlight i18n config for a monolingual site with a single root locale',
			({ i18nConfig, expected }) => {
				const astroI18nTestConfig = getAstroI18nTestConfig(i18nConfig);

				const { astroI18nConfig, starlightConfig } = processI18nConfig(config, astroI18nTestConfig);

				expect(starlightConfig.isMultilingual).toBe(false);
				expect(starlightConfig.locales).not.toBeDefined();
				expect(starlightConfig.defaultLocale).toStrictEqual(expected.defaultLocale);

				// The Astro i18n configuration should not be modified.
				expect(astroI18nConfig).toStrictEqual(astroI18nConfig);
			}
		);

		test.each([
			{
				i18nConfig: {
					defaultLocale: 'en',
					locales: ['en'],
					routing: { prefixDefaultLocale: true },
				},
				expected: {
					defaultLocale: { label: 'English', lang: 'en', dir: 'ltr', locale: 'en' },
					locales: { en: { label: 'English', lang: 'en', dir: 'ltr' } },
				},
			},
			{
				i18nConfig: {
					defaultLocale: 'french',
					locales: [{ codes: ['fr'], path: 'french' }],
					routing: { prefixDefaultLocale: true },
				},
				expected: {
					defaultLocale: { label: 'Français', lang: 'fr', dir: 'ltr', locale: 'fr' },
					locales: { french: { label: 'Français', lang: 'fr', dir: 'ltr' } },
				},
			},
			{
				i18nConfig: {
					defaultLocale: 'farsi',
					locales: [{ codes: ['fa'], path: 'farsi' }],
					routing: { prefixDefaultLocale: true },
				},
				expected: {
					defaultLocale: { label: 'فارسی', lang: 'fa', dir: 'rtl', locale: 'fa' },
					locales: { farsi: { label: 'فارسی', lang: 'fa', dir: 'rtl' } },
				},
			},
		])(
			'updates the Starlight i18n config for a monolingual site with a single non-root locale',
			({ i18nConfig, expected }) => {
				const astroI18nTestConfig = getAstroI18nTestConfig(i18nConfig);

				const { astroI18nConfig, starlightConfig } = processI18nConfig(config, astroI18nTestConfig);

				expect(starlightConfig.isMultilingual).toBe(false);
				expect(starlightConfig.locales).toStrictEqual(expected.locales);
				expect(starlightConfig.defaultLocale).toStrictEqual(expected.defaultLocale);

				// The Astro i18n configuration should not be modified.
				expect(astroI18nConfig).toStrictEqual(astroI18nConfig);
			}
		);

		test.each([
			{
				i18nConfig: {
					defaultLocale: 'en',
					locales: ['en', { codes: ['fr'], path: 'french' }],
				},
				expected: {
					defaultLocale: { label: 'English', lang: 'en', dir: 'ltr', locale: undefined },
					locales: {
						root: { label: 'English', lang: 'en', dir: 'ltr' },
						french: { label: 'Français', lang: 'fr', dir: 'ltr' },
					},
				},
			},
			{
				i18nConfig: {
					defaultLocale: 'farsi',
					// This configuration is a bit confusing as `prefixDefaultLocale` is `false` but the
					// default locale is defined with a custom path.
					// In this case, the default locale is considered to be a root locale and the custom path
					// is ignored.
					locales: [{ codes: ['fa'], path: 'farsi' }, 'de'],
					routing: { prefixDefaultLocale: false },
				},
				expected: {
					defaultLocale: { label: 'فارسی', lang: 'fa', dir: 'rtl', locale: undefined },
					locales: {
						root: { label: 'فارسی', lang: 'fa', dir: 'rtl' },
						de: { label: 'Deutsch', lang: 'de', dir: 'ltr' },
					},
				},
			},
		])(
			'updates the Starlight i18n config for a multilingual site with a root locale',
			({ i18nConfig, expected }) => {
				const astroI18nTestConfig = getAstroI18nTestConfig(i18nConfig);

				const { astroI18nConfig, starlightConfig } = processI18nConfig(config, astroI18nTestConfig);

				expect(starlightConfig.isMultilingual).toBe(true);
				expect(starlightConfig.locales).toEqual(expected.locales);
				expect(starlightConfig.defaultLocale).toEqual(expected.defaultLocale);

				// The Astro i18n configuration should not be modified.
				expect(astroI18nConfig).toEqual(astroI18nConfig);
			}
		);

		test.each([
			{
				i18nConfig: {
					defaultLocale: 'en',
					locales: ['en', { codes: ['fr'], path: 'french' }],
					routing: { prefixDefaultLocale: true },
				},
				expected: {
					defaultLocale: { label: 'English', lang: 'en', dir: 'ltr', locale: 'en' },
					locales: {
						en: { label: 'English', lang: 'en', dir: 'ltr' },
						french: { label: 'Français', lang: 'fr', dir: 'ltr' },
					},
				},
			},
			{
				i18nConfig: {
					defaultLocale: 'farsi',
					locales: [{ codes: ['fa'], path: 'farsi' }, 'de'],
					routing: { prefixDefaultLocale: true },
				},
				expected: {
					defaultLocale: { label: 'فارسی', lang: 'fa', dir: 'rtl', locale: 'fa' },
					locales: {
						farsi: { label: 'فارسی', lang: 'fa', dir: 'rtl' },
						de: { label: 'Deutsch', lang: 'de', dir: 'ltr' },
					},
				},
			},
		])(
			'updates the Starlight i18n config for a multilingual site with no root locale',
			({ i18nConfig, expected }) => {
				const astroI18nTestConfig = getAstroI18nTestConfig(i18nConfig);

				const { astroI18nConfig, starlightConfig } = processI18nConfig(config, astroI18nTestConfig);

				expect(starlightConfig.isMultilingual).toBe(true);
				expect(starlightConfig.locales).toEqual(expected.locales);
				expect(starlightConfig.defaultLocale).toEqual(expected.defaultLocale);

				// The Astro i18n configuration should not be modified.
				expect(astroI18nConfig).toEqual(astroI18nConfig);
			}
		);
	});
});

describe('getLocaleDir', () => {
	test('uses the Node.js implementation to figure out the text direction', () => {
		const { starlightConfig } = processI18nConfig(
			config,
			getAstroI18nTestConfig({
				defaultLocale: 'en',
				locales: ['en'],
			})
		);

		expect(starlightConfig.defaultLocale.dir).toBe('ltr');
	});

	test('uses `getTextInfo()` when `textInfo` is not available', async () => {
		// @ts-expect-error - `getTextInfo` is not typed but is available in some non-v8 based environments.
		vi.spyOn(global.Intl, 'Locale').mockImplementation(() => ({
			getTextInfo: () => ({ direction: 'rtl' }),
		}));

		const { starlightConfig } = processI18nConfig(
			config,
			getAstroI18nTestConfig({
				defaultLocale: 'en',
				locales: ['en'],
			})
		);

		expect(starlightConfig.defaultLocale.dir).toBe('rtl');
	});

	test('fallbacks to a list of well-known RTL languages when `textInfo` and `getTextInfo()` are not available', async () => {
		// @ts-expect-error - We are simulating the absence of `textInfo` and `getTextInfo()`.
		vi.spyOn(global.Intl, 'Locale').mockImplementation((tag) => ({ language: tag }));

		const { starlightConfig } = processI18nConfig(
			config,
			getAstroI18nTestConfig({
				defaultLocale: 'en',
				locales: ['en', 'fa'],
			})
		);

		expect(starlightConfig.defaultLocale.dir).toBe('ltr');
		expect(starlightConfig.locales?.root?.dir).toBe('ltr');
		expect(starlightConfig.locales?.fa?.dir).toBe('rtl');
	});
});

function getAstroI18nTestConfig(i18nConfig: AstroUserConfig['i18n']): AstroConfig['i18n'] {
	return {
		...i18nConfig,
		routing:
			typeof i18nConfig?.routing !== 'string'
				? { prefixDefaultLocale: false, fallbackType: 'redirect', ...i18nConfig?.routing }
				: i18nConfig.routing,
	} as AstroConfig['i18n'];
}
