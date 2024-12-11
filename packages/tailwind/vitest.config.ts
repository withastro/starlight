import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		coverage: {
			reportsDirectory: './__coverage__',
			thresholds: {
				lines: 91,
				functions: 100,
				branches: 85,
				statements: 91,
			},
		},
	},
});
