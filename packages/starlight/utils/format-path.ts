import { fileWithBase, pathWithBase } from './base';
import {
	ensureTrailingSlash,
	stripTrailingSlash,
	ensureLeadingSlash,
	stripLeadingAndTrailingSlashes,
} from './path';
import type { AstroConfig } from 'astro';

interface FormatPathOptions {
	format?: AstroConfig['build']['format'];
	trailingSlash?: AstroConfig['trailingSlash'];
}

const formatStrategies = {
	file: {
		addBase: fileWithBase,
		handleExtension: (href: string) => ensureHtmlExtension(href),
	},
	directory: {
		addBase: pathWithBase,
		handleExtension: (href: string) => stripExtension(href),
	},
};

const trailingSlashStrategies = {
	always: ensureTrailingSlash,
	never: stripTrailingSlash,
	ignore: (href: string) => href,
};

/** Format a path based on the project config. */
export function formatPath(
	href: string,
	{ format = 'directory', trailingSlash = 'ignore' }: FormatPathOptions = {}
) {
	const formatStrategy = formatStrategies[format];
	const trailingSlashStrategy = trailingSlashStrategies[trailingSlash];

	// Add base
	href = formatStrategy.addBase(href);

	// Handle extension
	href = formatStrategy.handleExtension(href);

	// Handle trailing slash
	href = href === '/' ? href : trailingSlashStrategy(href);

	return href;
}

/** Remove the extension from a path. */
export function stripExtension(path: string) {
	path = stripTrailingSlash(path);
	return path ? path.replace(/\.\w+$/, '') + '/' : '/';
}

/** Add '.html' extension to a path. */
export function ensureHtmlExtension(path: string) {
	path = stripTrailingSlash(path);
	if (path.endsWith('.html')) return ensureLeadingSlash(path);

	path = stripLeadingAndTrailingSlashes(path);
	return path ? ensureLeadingSlash(path) + '.html' : '/index.html';
}
