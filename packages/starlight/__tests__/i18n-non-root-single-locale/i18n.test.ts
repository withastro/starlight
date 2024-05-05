import { describe, expect, test } from 'vitest';
import config from 'virtual:starlight/user-config';
import { getAstroI18nConfig } from '../../utils/i18n';

describe('getAstroI18nConfig', () => {
	test('returns Astro i18n config for a monolingual site with a non-root single locale', () => {
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
			]
		`);
		expect(i18nConfig.routing?.prefixDefaultLocale).toBe(true);
	});
});
