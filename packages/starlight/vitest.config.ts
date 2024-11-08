import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		coverage: {
			all: true,
			reportsDirectory: './__coverage__',
			exclude: [
				...coverageConfigDefaults.exclude,
				'**/__e2e__/**',
				'playwright.config.*',
				'**/vitest.*',
				'components.ts',
				'types.ts',
				// We use this to set up test environments so it isn‘t picked up, but we are testing it downstream.
				'integrations/virtual-user-config.ts',
				// Types-only export.
				'props.ts',
				// Main integration entrypoint — don’t think we’re able to test this directly currently.
				'index.ts',
			],
			thresholds: {
				lines: 88,
				functions: 90,
				branches: 90,
				statements: 88,
			},
		},
	},
});
