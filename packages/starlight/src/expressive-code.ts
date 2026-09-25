/**
 * @file This file is exported by Starlight as `@astrojs/starlight/expressive-code`.
 *
 * It is required by the `<Code>` component to access the same configuration preprocessor
 * function as the one used by the integration.
 *
 * It also provides access to all of the Expressive Code classes and functions without having
 * to install `astro-expressive-code` as an additional dependency into a user's project
 * (and thereby risiking version conflicts).
 */

import type { StarlightExpressiveCodeOptions } from './integrations/expressive-code';

export * from 'astro-expressive-code';

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
export function defineEcConfig(
	config: StarlightExpressiveCodeOptions
): StarlightExpressiveCodeOptions {
	return config;
}
