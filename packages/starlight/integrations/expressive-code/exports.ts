/**
 * @file This file is exported by Starlight as `@astrojs/starlight/expressive-code`
 * and can be used in your site's configuration to customize Expressive Code.
 *
 * It provides access to all of the Expressive Code classes and functions without having
 * to install `astro-expressive-code` as an additional dependency into your project
 * (and thereby risiking version conflicts).
 *
 * For example, you can use this to load custom themes from a JSONC file (JSON with comments)
 * that would otherwise be difficult to import, and pass them to the `themes` option:
 *
 * @example
 * ```js
 * // astro.config.mjs
 * import fs from 'node:fs';
 * import { defineConfig } from 'astro/config';
 * import starlight from '@astrojs/starlight';
 * import { ExpressiveCodeTheme } from '@astrojs/starlight/expressive-code';
 *
 * const jsoncString = fs.readFileSync(new URL(`./my-theme.jsonc`, import.meta.url), 'utf-8');
 * const myTheme = ExpressiveCodeTheme.fromJSONString(jsoncString);
 *
 * export default defineConfig({
 *   integrations: [
 *     starlight({
 *       title: 'My Starlight site',
 *       expressiveCode: {
 *         themes: [myTheme],
 *       },
 *     }),
 *   ],
 * });
 * ```
 */

export * from 'astro-expressive-code';

import type { StarlightExpressiveCodeOptions } from './index';

export type { StarlightExpressiveCodeOptions };

/**
 * A utility function that helps you define an Expressive Code configuration object. It is meant
 * to be used inside the optional config file `ec.config.mjs` located in the root directory
 * of your Starlight project, and its return value to be exported as the default export.
 *
 * Expressive Code will automatically detect this file and use the exported configuration object
 * to override its own default settings.
 *
 * Using this function is recommended, but not required. It just passes through the given object,
 * but it also provides type information for your editor's auto-completion and type checking.
 *
 * @example
 * ```js
 * // ec.config.mjs
 * import { defineEcConfig } from '@astrojs/starlight/expressive-code'
 *
 * export default defineEcConfig({
 *   themes: ['starlight-dark', 'github-light'],
 *   styleOverrides: {
 *     borderRadius: '0.5rem',
 *   },
 * })
 * ```
 */
export function defineEcConfig(config: StarlightExpressiveCodeOptions) {
	return config;
}

export { getStarlightEcConfigPreprocessor } from './index';
