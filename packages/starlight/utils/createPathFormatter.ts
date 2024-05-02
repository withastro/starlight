import type { AstroConfig } from 'astro';
import { addBase } from './base';
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

const formatStrategies = {
	file: ensureHtmlExtension,
	directory: stripHtmlExtension,
	preserve: (href: string) => href,
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

	// Add base
	href = addBase(href);

	// Handle format strategy
	href = formatStrategy(href);

	// Skip trailing slash handling for `build.format: 'file'`
	if (format === 'file') return href;

	// Handle trailing slash
	href = href === '/' ? href : trailingSlashStrategy(href);

	return href;
}

export function createPathFormatter(opts: FormatPathOptions) {
	return (href: string) => formatPath(href, opts);
}
