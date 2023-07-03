import astroConfig from 'virtual:starlight/project-context';

/**
 * Ensure the passed path starts and ends with trailing slashes unless
 * configured otherwise in the Astro config.
 */
export function ensureLeadingAndTrailingSlashes(href: string): string {
  if (href[0] !== '/') href = '/' + href;

  if (href === '/') return href

  if (astroConfig.build.format === 'file') {
    if (href[href.length - 1] === '/') href = href.slice(0, -1);
    return href
  }

  if (href[href.length - 1] !== '/') href += '/';
  return href;
}
