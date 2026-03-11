import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		projects: ['__tests__/*/vitest.config.ts'],
		coverage: {
			reportsDirectory: './__coverage__',
			include: ['**.ts'],
			exclude: [
				'**/__tests__/**',
				'**/__e2e__/**',
				'playwright.config.*',
				'**/vitest.*',
				/**
				 * TODO: re-exclude these 2 files once the issue preventing us from excluding only these
				 * files at the project root in Vitest 4 is fixed and update thresholds accordingly.
				 *
				 * @see https://github.com/vitest-dev/vitest/issues/9395
				 */
				// 'components.ts',
				// 'types.ts',
				// Types-only export.
				'props.ts',
				// Types declaration files.
				'*.d.ts',
				/**
				 * TODO: re-exclude this file once the issue preventing us from excluding only this file at
				 * the project root in Vitest 4 is fixed and update thresholds accordingly.
				 *
				 * @see https://github.com/vitest-dev/vitest/issues/9395
				 */
				// Main integration entrypoint — don’t think we’re able to test this directly currently.
				// 'index.ts',
			],
			thresholds: {
				lines: 87,
				functions: 90,
				branches: 85,
				statements: 87,
			},
		},
	},
});
