import type { StarlightConfig } from '../../types';
import { localeToLang } from './localeToLang';
import { slugToLocale } from './slugToLocale';

/** Get current language from an absolute file path. */
export function absolutePathToLang(
	path: string,
	{
		docsPath,
		starlightConfig,
	}: {
		docsPath: string;
		starlightConfig: Pick<StarlightConfig, 'defaultLocale' | 'locales'>;
	}
): string {
	// Format path to unix style path.
	path = path?.replace(/\\/g, '/');
	// Ensure that the page path starts with a slash if the docs directory also does,
	// which makes stripping the docs path in the next step work on Windows, too.
	if (path && !path.startsWith('/') && docsPath.startsWith('/')) path = '/' + path;
	// Strip docs path leaving only content collection file ID.
	// Example: /Users/houston/repo/src/content/docs/en/guide.md => en/guide.md
	const slug = path?.replace(docsPath, '');
	const locale = slugToLocale(slug, starlightConfig);
	return localeToLang(starlightConfig, locale);
}
