import { assert, describe, expect, test } from 'vitest';
import config from 'virtual:starlight/user-config';
import { processI18nConfig } from '../../utils/i18n';

describe('processI18nConfig', () => {
	test('returns the Astro i18n config for a monolingual site with a single root locale', () => {
		const { astroI18nConfig, starlightConfig } = processI18nConfig(config, undefined);

		expect(astroI18nConfig.defaultLocale).toBe('fr-CA');
		expect(astroI18nConfig.locales).toEqual(['fr-CA']);
		assert(typeof astroI18nConfig.routing !== 'string');
		expect(astroI18nConfig.routing?.prefixDefaultLocale).toBe(false);

		// The Starlight configuration should not be modified.
		expect(config).toStrictEqual(starlightConfig);
	});
});
