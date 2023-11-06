import type { AstroConfig } from 'astro';
import { fileWithBase, pathWithBase } from './base';
import { stripExtension, ensureHtmlExtension } from './navigation';
import { ensureTrailingSlash, stripTrailingSlash } from './path';

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

export function formatPath(href: string, opts?: FormatPathOptions) {
	const options = {
		format: opts?.format ?? 'directory',
		trailingSlash: opts?.trailingSlash ?? 'ignore',
	};

	const formatStrategy = formatStrategies[options.format];
	const trailingSlashStrategy = trailingSlashStrategies[options.trailingSlash];

	// Add base
	href = formatStrategy.addBase(href);

	// Handle extension
	href = formatStrategy.handleExtension(href);

	// Handle trailing slash
	href = href === '/' ? href : trailingSlashStrategy(href);

	return href;
}
