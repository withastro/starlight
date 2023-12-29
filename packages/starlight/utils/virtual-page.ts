import type { GetStaticPathsResult } from 'astro';
import config from 'virtual:starlight/user-config';
import { localizedSlug } from './slugs';

export function makeVirtualStaticPaths<TResult extends GetStaticPathsResult>(
	getVirtualStaticPaths: (options: GetVirtualStaticPathsOptions) => TResult | Promise<TResult>
): {
	getStaticPaths: () => TResult | Promise<TResult>;
} {
	return {
		getStaticPaths: () =>
			getVirtualStaticPaths({
				/** Helper function to generate localized slugs for a given slug. */
				getLocalizedSlugs(slug: string) {
					// If the site is not multilingual, we only need to return the same slug with the default language.
					if (!config.isMultilingual) {
						return [{ slug: localizedSlug(slug, undefined), lang: config.defaultLocale.lang }];
					}

					// Otherwise, we need to return the slug for each configured locale.
					return Object.entries(config.locales).map(([locale, localeConfig]) => {
						return {
							slug: localizedSlug(slug, locale === 'root' ? undefined : locale),
							lang: localeConfig?.lang!,
						};
					});
				},
			}),
	};
}

interface GetVirtualStaticPathsOptions {
	getLocalizedSlugs(slug: string): { slug: string; lang: string }[];
}
