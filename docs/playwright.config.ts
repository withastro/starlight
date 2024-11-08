import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	forbidOnly: !!process.env['CI'],
	projects: [
		{
			name: 'Chrome Stable',
			use: {
				...devices['Desktop Chrome'],
				headless: true,
			},
		},
	],
	testMatch: '__a11y__/*.test.ts',
	// The timeout for the accessibility tests only.
	timeout: 180 * 1_000,
	webServer: [
		{
			command: 'pnpm run build && pnpm run preview',
			reuseExistingServer: !process.env['CI'],
			stdout: 'pipe',
			// The timeout of the single build step ran before the accessibility tests.
			timeout: 120 * 1_000,
			url: 'http://localhost:4321',
		},
	],
	workers: 1,
});
