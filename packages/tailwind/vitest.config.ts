import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		coverage: {
			reportsDirectory: './__coverage__',
			thresholdAutoUpdate: true,
			lines: 100,
			functions: 100,
			branches: 100,
			statements: 100,
		},
	},
});
