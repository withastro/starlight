import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		coverage: {
			all: true,
			reportsDirectory: './__coverage__',
			include: ['src/**/*.ts'],
			exclude: [
				...coverageConfigDefaults.exclude,
				'src/components.ts',
				'src/types.ts',
				// We use this to set up test environments so it isn‘t picked up, but we are testing it downstream.
				'src/integrations/virtual-user-config.ts',
				// Types-only export.
				'src/props.ts',
				// Main integration entrypoint — don’t think we’re able to test this directly currently.
				'src/index.ts',
				// Since Vitest 2.1.2, coverage is collected for `*.astro` files.
				'**/*.astro',
			],
			thresholds: {
				lines: 87,
				functions: 90,
				branches: 90,
				statements: 87,
			},
		},
	},
});
