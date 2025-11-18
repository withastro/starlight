import type { AstroConfig } from 'astro';
import { ensureTrailingSlash, stripTrailingSlash } from './path';

export interface FormatCanonicalOptions {
	format: AstroConfig['build']['format'];
	trailingSlash: AstroConfig['trailingSlash'];
}

const canonicalTrailingSlashStrategies = {
	always: ensureTrailingSlash,
	never: stripTrailingSlash,
	ignore: ensureTrailingSlash,
};

/** Format a canonical link based on the project config. */
export function formatCanonical(href: string, opts: FormatCanonicalOptions) {
	if (opts.format === 'file') return href;
	return canonicalTrailingSlashStrategies[opts.trailingSlash](href);
}
