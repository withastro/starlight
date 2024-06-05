import { assert, describe, expect, test } from 'vitest';
import type { AstroConfig } from 'astro';
import config from 'virtual:starlight/user-config';
import { processI18nConfig } from '../../utils/i18n';

describe('processI18nConfig', () => {
	test('returns the Astro i18n config for a monolingual site with a non-root single locale', () => {
		const { astroI18nConfig, starlightConfig } = processI18nConfig(config, undefined);

		expect(astroI18nConfig.defaultLocale).toBe('fr-CA');
		expect(astroI18nConfig.locales).toMatchInlineSnapshot(`
			[
			  {
			    "codes": [
			      "fr-CA",
			    ],
			    "path": "fr",
			  },
			]
		`);
		assert(typeof astroI18nConfig.routing !== 'string');
		expect(astroI18nConfig.routing?.prefixDefaultLocale).toBe(true);

		// The Starlight configuration should not be modified.
		expect(config).toStrictEqual(starlightConfig);
	});

	test('throws an error when an Astro i18n config is also provided', () => {
		expect(() =>
			processI18nConfig(config, { defaultLocale: 'en', locales: ['en'] } as AstroConfig['i18n'])
		).toThrowErrorMatchingInlineSnapshot(`
			"[AstroUserError]:
				Cannot provide both an Astro \`i18n\` configuration and a Starlight \`locales\` configuration.
			Hint:
				Remove one of the two configurations.
				See more at https://starlight.astro.build/guides/i18n/"
		`);
	});
});
