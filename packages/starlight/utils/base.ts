import { stripLeadingAndTrailingSlashes, stripTrailingSlash } from './path';

const base = stripTrailingSlash(import.meta.env.BASE_URL);

/** Get the a root-relative URL path with the site’s `base` prefixed. */
export function pathWithBase(path: string) {
	path = stripLeadingAndTrailingSlashes(path);
	return path ? base + '/' + path + '/' : base + '/';
}

/** Get the a root-relative file URL path with the site’s `base` prefixed. */
export function fileWithBase(path: string) {
	path = stripLeadingAndTrailingSlashes(path);
	return path ? base + '/' + path : base;
}
