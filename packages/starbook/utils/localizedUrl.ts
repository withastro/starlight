import config from 'virtual:starbook/user-config';

/**
 * Get the equivalent of the passed URL for the passed locale.
 */
export function localizedUrl(url: URL, locale: string | undefined): URL {
  if (!config.locales) {
    // i18n is not configured on this site, no localization required.
    return url;
  }
  if (locale === 'root') locale = '';
  const [_leadingSlash, baseSegment] = url.pathname.split('/');
  if (baseSegment && baseSegment in config.locales) {
    // We’re in a localized route, substitute the new locale (or strip for root lang).
    url.pathname = locale
      ? url.pathname.replace(baseSegment, locale)
      : url.pathname.replace('/' + baseSegment, '');
  } else if (locale) {
    // We’re in the root language. Inject the new locale if we have one.
    url.pathname = '/' + locale + url.pathname;
  }
  return url;
}
