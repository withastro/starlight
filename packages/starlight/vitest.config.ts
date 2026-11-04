import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		projects: ['__tests__/*/vitest.config.ts'],
		coverage: {
			reportsDirectory: './__coverage__',
			include: ['**.ts', 'src/*.ts'],
			exclude: [
				'**/__tests__/**',
				'**/__e2e__/**',
				'playwright.config.*',
				'tsdown.config.*',
				'**/vitest.*',
				/**
				 * TODO: re-exclude these 2 files once the issue preventing us from excluding only these
				 * files at the project root in Vitest 4 is fixed and update thresholds accordingly.
				 *
				 * @see https://github.com/vitest-dev/vitest/issues/9395
				 */
				// 'src/components.ts',
				// 'src/types.ts',
				// Types-only export.
				'src/props.ts',
				// Types declaration files.
				'*.d.ts',
				/**
				 * TODO: re-exclude this file once the issue preventing us from excluding only this file at
				 * the project root in Vitest 4 is fixed and update thresholds accordingly.
				 *
				 * @see https://github.com/vitest-dev/vitest/issues/9395
				 */
				// Main integration entrypoint — don’t think we’re able to test this directly currently.
				// 'src/index.ts',
			],
			thresholds: {
				lines: 87,
				functions: 90,
				branches: 85,
				statements: 87,
			},
		},
		experimental: {
			diagnostics: {
				// Using `isolate: false` could save about 1-2 seconds, but our heavy use of file-scoped
				// module mocks, especially `astro:content`, would require manually resetting the module
				// cache and unmocking modules between files. That effectively reimplements isolation and
				// the tradeoff is not worth it, so we disable the associated diagnostic.
				isolate: false,
			},
		},
	},
});
