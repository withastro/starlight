import { describe, expect, test } from 'vitest';
import type { AstroConfig } from 'astro';
import config from 'virtual:starlight/user-config';
import { processI18nConfig } from '../../utils/i18n';

describe('processI18nConfig', () => {
	test('returns Astro i18n config for a multilingual site with a root locale', () => {
		const { astroI18nConfig, starlightConfig } = processI18nConfig(config, undefined);

		expect(astroI18nConfig.defaultLocale).toBe('fr');
		expect(astroI18nConfig.locales).toMatchInlineSnapshot(`
			[
			  {
			    "codes": [
			      "fr",
			    ],
			    "path": "fr",
			  },
			  {
			    "codes": [
			      "en-US",
			    ],
			    "path": "en",
			  },
			  {
			    "codes": [
			      "ar",
			    ],
			    "path": "ar",
			  },
			]
		`);
		expect(astroI18nConfig.routing?.prefixDefaultLocale).toBe(false);

		// The Starlight configuration should not be modified.
		expect(config).toStrictEqual(starlightConfig);
	});

	test('throws an error when an Astro i18n config is also provided', () => {
		expect(() =>
			processI18nConfig(config, { defaultLocale: 'en', locales: ['en'] } as AstroConfig['i18n'])
		).toThrowErrorMatchingInlineSnapshot(`
			"[AstroUserError]:
				Cannot provide both an Astro i18n configuration and a Starlight i18n configuration.
			Hint:
				Remove one of the i18n configurations.
				See more at https://starlight.astro.build/guides/i18n/"
		`);
	});
});
