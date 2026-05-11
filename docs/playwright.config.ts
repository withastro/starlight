import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env['CI'];

export default defineConfig({
	forbidOnly: isCI,
	fullyParallel: true,
	projects: [
		{
			name: 'Chrome Stable',
			use: {
				...devices['Desktop Chrome'],
				// Re-use system Chrome on CI to avoid re-installing it on every run.
				channel: isCI ? 'chrome' : undefined,
				headless: true,
			},
		},
	],
	reporter: [['./__a11y__/reporter.ts']],
	testMatch: '__a11y__/*.test.ts',
	// The timeout for the accessibility tests only.
	timeout: 180 * 1_000,
	webServer: [
		{
			command: 'pnpm run build && pnpm run preview',
			reuseExistingServer: !isCI,
			stdout: 'pipe',
			// The timeout of the single build step ran before the accessibility tests.
			timeout: 120 * 1_000,
			url: 'http://localhost:4321',
		},
	],
});
