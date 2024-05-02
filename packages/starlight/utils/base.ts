import { stripLeadingSlash, stripTrailingSlash } from './path';

const base = stripTrailingSlash(import.meta.env.BASE_URL);

/** Adds the base URL to file and dir paths */
export function addBase(path: string) {
	path = stripLeadingSlash(path);
	if (isFile(path)) {
		return path ? base + '/' + path : base;
	}
	return path ? base + '/' + path : base + '/';
}

function isFile(path: string) {
	const endsWithFileExtension = /\.[a-zA-Z0-9]+$/;
	return endsWithFileExtension.test(path);
}
