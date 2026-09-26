import type { AstroConfig } from 'astro';
import { describe, expect, test } from 'vitest';
import { getSitemapConfig, starlightSitemap } from '../../src/integrations/sitemap';
import type { StarlightConfig } from '../../src/types';
import { StarlightConfigSchema, type StarlightUserConfig } from '../../src/utils/user-config';
import { processI18nConfig } from '../../src/utils/i18n';

describe('starlightSitemap', () => {
	test('returns @astrojs/sitemap integration', () => {
		const integration = starlightSitemap({} as StarlightConfig);
		expect(integration.name).toBe('@astrojs/sitemap');
	});
});

describe('getSitemapConfig', () => {
	test('configures i18n config', () => {
		const config = getSitemapConfig(
			StarlightConfigSchema.parse({
				title: 'i18n test',
				locales: { root: { lang: 'en', label: 'English' }, fr: { label: 'French' } },
			} satisfies StarlightUserConfig)
		);
		expect(config).toMatchInlineSnapshot(`
			{
			  "i18n": {
			    "defaultLocale": "root",
			    "locales": {
			      "fr": "fr",
			      "root": "en",
			    },
			  },
			}
		`);
	});

	test('uses the locale path as the default locale for an Astro i18n config with custom paths', () => {
		const { starlightConfig } = processI18nConfig(
			StarlightConfigSchema.parse({ title: 'i18n test' } satisfies StarlightUserConfig),
			{
				defaultLocale: 'english',
				locales: [{ codes: ['en'], path: 'english' }, 'fr'],
				routing: { prefixDefaultLocale: true, fallbackType: 'redirect' },
			} as AstroConfig['i18n']
		);
		const config = getSitemapConfig(starlightConfig);
		expect(config).toMatchInlineSnapshot(`
			{
			  "i18n": {
			    "defaultLocale": "english",
			    "locales": {
			      "english": "en",
			      "fr": "fr",
			    },
			  },
			}
		`);
	});

	test('no config for monolingual sites', () => {
		const config = getSitemapConfig(
			StarlightConfigSchema.parse({ title: 'i18n test' } satisfies StarlightUserConfig)
		);
		expect(config).toMatchInlineSnapshot('{}');
	});
});
