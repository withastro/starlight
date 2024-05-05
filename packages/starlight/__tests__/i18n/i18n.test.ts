import { describe, expect, test } from 'vitest';
import config from 'virtual:starlight/user-config';
import { getAstroI18nConfig } from '../../utils/i18n';

describe('getAstroI18nConfig', () => {
	test('returns Astro i18n config for a multilingual site with no root locale', () => {
		const i18nConfig = getAstroI18nConfig(config);

		expect(i18nConfig.defaultLocale).toBe('en-US');
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
			  {
			    "codes": [
			      "pt-BR",
			    ],
			    "path": "pt-br",
			  },
			]
		`);
		expect(i18nConfig.routing?.prefixDefaultLocale).toBe(true);
	});
});
