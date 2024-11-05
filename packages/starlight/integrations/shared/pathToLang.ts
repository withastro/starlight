import type { AstroConfig } from 'astro';
import type { StarlightConfig } from '../../types';
import { pathToLocale } from './pathToLocale';
import { localeToLang } from './localeToLang';

/** Get current language from the full file path. */
export function pathToLang(
	path: string,
	{
		starlightConfig,
		astroConfig,
	}: {
		starlightConfig: Pick<StarlightConfig, 'defaultLocale' | 'locales'>;
		astroConfig: { root: AstroConfig['root']; srcDir: AstroConfig['srcDir'] };
	}
) {
	const locale = pathToLocale(path, { astroConfig, starlightConfig });
	return localeToLang(starlightConfig, locale);
}
