import type { StarlightConfig } from '../../types';

/**
 * Get the “locale” of a slug. This is the base path at which a language is served.
 * For example, if French docs are in `src/content/docs/french/`, the locale is `french`.
 * Root locale slugs will return `undefined`.
 * @param slug A collection entry slug
 */
export function slugToLocale(
	slug: string | undefined,
	config: Pick<StarlightConfig, 'defaultLocale' | 'locales'>
): string | undefined {
	const localesConfig = config.locales ?? {};
	const baseSegment = slug?.split('/')[0];
	if (baseSegment && localesConfig[baseSegment]) return baseSegment;
	if (!localesConfig.root) return config.defaultLocale.locale;
	return undefined;
}
