/** Ensure the passed path starts with a leading slash. */
export function ensureLeadingSlash(href: string): string {
	if (href[0] !== '/') href = '/' + href;
	return href;
}

/** Ensure the passed path ends with a trailing slash. */
export function ensureTrailingSlash(href: string): string {
	if (href[href.length - 1] !== '/') href += '/';
	return href;
}

/** Ensure the passed path starts and ends with slashes. */
export function ensureLeadingAndTrailingSlashes(href: string): string {
	href = ensureLeadingSlash(href);
	href = ensureTrailingSlash(href);
	return href;
}

/** Ensure the passed path does not start with a leading slash. */
export function stripLeadingSlash(href: string) {
	if (href[0] === '/') href = href.slice(1);
	return href;
}

/** Ensure the passed path does not end with a trailing slash. */
export function stripTrailingSlash(href: string) {
	if (href[href.length - 1] === '/') href = href.slice(0, -1);
	return href;
}

/** Ensure the passed path does not start and end with slashes. */
export function stripLeadingAndTrailingSlashes(href: string): string {
	href = stripLeadingSlash(href);
	href = stripTrailingSlash(href);
	return href;
}
