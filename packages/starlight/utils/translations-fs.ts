import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import type { i18nSchemaOutput } from '../schemas/i18n';
import { createTranslationSystem } from './createTranslationSystem';
import type { StarlightConfig } from './user-config';
import type { AstroConfig } from 'astro';

const contentCollectionFileExtensions = ['.json', '.yaml', '.yml'];

/**
 * Loads and creates a translation system from the file system.
 * Only for use in integration code.
 * In modules loaded by Vite/Astro, import [`useTranslations`](./translations.ts) instead.
 *
 * @see [`./translations.ts`](./translations.ts)
 */
export function createTranslationSystemFromFs<T extends i18nSchemaOutput>(
	opts: Pick<StarlightConfig, 'defaultLocale' | 'locales'>,
	{ srcDir }: Pick<AstroConfig, 'srcDir'>,
	pluginTranslations: Record<string, T> = {}
) {
	/** All translation data from the i18n collection, keyed by `id`, which matches locale. */
	let userTranslations: Record<string, i18nSchemaOutput> = {};
	try {
		const i18nDir = new URL('content/i18n/', srcDir);
		// Load the user’s i18n directory
		const files = fs.readdirSync(i18nDir, 'utf-8');
		// Load the user’s i18n collection and ignore the error if it doesn’t exist.
		for (const file of files) {
			const filePath = path.parse(file);
			if (!contentCollectionFileExtensions.includes(filePath.ext)) continue;
			const id = filePath.name;
			const url = new URL(filePath.base, i18nDir);
			const content = fs.readFileSync(new URL(file, i18nDir), 'utf-8');
			const data =
				filePath.ext === '.json'
					? JSON.parse(content)
					: yaml.load(content, { filename: fileURLToPath(url) });
			userTranslations[id] = data as i18nSchemaOutput;
		}
	} catch (e: unknown) {
		if (e instanceof Error && 'code' in e && e.code === 'ENOENT') {
			// i18nDir doesn’t exist, so we ignore the error.
		} else {
			// Other errors may be meaningful, e.g. JSON syntax errors, so should be thrown.
			throw e;
		}
	}

	return createTranslationSystem(opts, userTranslations, pluginTranslations);
}
