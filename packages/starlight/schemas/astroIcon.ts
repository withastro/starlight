import { z } from 'astro/zod';
import astroIcon from 'astro-icon';
import type { runSVGO } from '@iconify/tools/lib/index.js';

/**
 * Default Astro Icon local icon directory.
 * @see https://github.com/natemoo-re/astro-icon/blob/85cfae2426b8a94ca7f25429dba307558f232345/packages/core/src/vite-plugin-astro-icon.ts#L19
 */
const defaultIconDir = 'src/icons';

/**
 * Default Astro Icon SVGO options.
 * @see https://github.com/natemoo-re/astro-icon/blob/85cfae2426b8a94ca7f25429dba307558f232345/packages/core/src/loaders/loadLocalCollection.ts#L13
 */
const defaultSVGOOptions: SVGOOptions = { plugins: ['preset-default'] };

export const AstroIconSchema = () =>
	z
		.custom<AstroIconOptions>((value) => typeof value === 'object' && value)
		.describe(
			'Define Astro Icon options used to load and render local and Iconify icons. See https://www.astroicon.dev/reference/configuration/ for more details.'
		)
		.optional()
		.transform((options) => {
			const astroIconOptions = options ?? {};
			astroIconOptions.iconDir ??= defaultIconDir;
			astroIconOptions.svgoOptions ??= defaultSVGOOptions;
			return astroIconOptions as StarlightAstroIconOptions;
		});

type AstroIconOptions = NonNullable<Parameters<typeof astroIcon>[0]>;
type StarlightAstroIconOptions = AstroIconOptions &
	Required<Pick<AstroIconOptions, 'iconDir' | 'svgoOptions'>>;

type SVGOOptions = Omit<Parameters<typeof runSVGO>[1], 'keepShapes'>;
