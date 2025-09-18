import { assert, describe, expect, test } from 'vitest';
import config from 'virtual:starlight/user-config';
import { processI18nConfig } from '../../utils/i18n';

describe('processI18nConfig', () => {
	test('returns Astro i18n config for a multilingual site with a root default locale', () => {
		const { astroI18nConfig, starlightConfig } = processI18nConfig(config, undefined);

		// The default locale matches the root locale's `lang` property.
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
		assert(typeof astroI18nConfig.routing !== 'string');
		expect(astroI18nConfig.routing?.prefixDefaultLocale).toBe(false);

		// The Starlight configuration should not be modified.
		expect(config).toStrictEqual(starlightConfig);
	});
});
