import { describe, expect, test } from 'vitest';
import config from 'virtual:starlight/user-config';
import { getAstroI18nConfig } from '../../utils/i18n';

describe('getAstroI18nConfig', () => {
	test('returns Astro i18n config for a multilingual site with a root locale', () => {
		const i18nConfig = getAstroI18nConfig(config);

		expect(i18nConfig.defaultLocale).toBe('fr');
		expect(i18nConfig.locales).toMatchInlineSnapshot(`
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
		expect(i18nConfig.routing?.prefixDefaultLocale).toBe(false);
	});
});
