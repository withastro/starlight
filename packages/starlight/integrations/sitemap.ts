import sitemap, { type SitemapOptions } from '@astrojs/sitemap';
import type { StarlightConfig } from '../types';

/**
 * A wrapped version of the `@astrojs/sitemap` integration configured based
 * on Starlight i18n config.
 */
export function starlightSitemap(opts: StarlightConfig) {
	const sitemapConfig: SitemapOptions = {};
	if (opts.isMultilingual) {
		sitemapConfig.i18n = {
			defaultLocale: opts.defaultLocale.locale! || 'root',
			locales: Object.fromEntries(
				Object.entries(opts.locales).map(([locale, config]) => [locale, config?.lang!])
			),
		};
	}
	return sitemap(sitemapConfig);
}
