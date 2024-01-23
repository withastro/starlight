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
