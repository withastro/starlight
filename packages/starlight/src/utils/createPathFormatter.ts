import type { AstroConfig } from 'astro';
import { fileWithBase, pathWithBase } from './base';
import {
	ensureHtmlExtension,
	ensureTrailingSlash,
	stripHtmlExtension,
	stripTrailingSlash,
} from './path';

interface FormatPathOptions {
	format?: AstroConfig['build']['format'];
	trailingSlash?: AstroConfig['trailingSlash'];
}

const defaultFormatStrategy = {
	addBase: pathWithBase,
	handleExtension: (href: string) => stripHtmlExtension(href),
};

const formatStrategies = {
	file: {
		addBase: fileWithBase,
		handleExtension: (href: string) => ensureHtmlExtension(href),
	},
	directory: defaultFormatStrategy,
	preserve: defaultFormatStrategy,
};

const trailingSlashStrategies = {
	always: ensureTrailingSlash,
	never: stripTrailingSlash,
	ignore: (href: string) => href,
};

/** Format a path based on the project config. */
function formatPath(
	href: string,
	{ format = 'directory', trailingSlash = 'ignore' }: FormatPathOptions
) {
	const formatStrategy = formatStrategies[format];
	const trailingSlashStrategy = trailingSlashStrategies[trailingSlash];

	// Only format the pathname and preserve any query string or hash as-is.
	const suffixIndex = href.search(/[?#]/);
	const suffix = suffixIndex === -1 ? '' : href.slice(suffixIndex);
	if (suffixIndex !== -1) href = href.slice(0, suffixIndex);

	// Handle extension
	href = formatStrategy.handleExtension(href);

	// Add base
	href = formatStrategy.addBase(href);

	// Skip trailing slash handling for `build.format: 'file'`
	if (format === 'file') return href + suffix;

	// Handle trailing slash
	href = href === '/' ? href : trailingSlashStrategy(href);

	return href + suffix;
}

export function createPathFormatter(opts: FormatPathOptions) {
	return (href: string) => formatPath(href, opts);
}
