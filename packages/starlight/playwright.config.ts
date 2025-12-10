import { defineConfig, devices } from '@playwright/test';

// Toggle headless mode on/off.
const headless = true;

export default defineConfig({
	forbidOnly: !!process.env['CI'],
	projects: [
		{
			name: 'chrome',
			use: {
				...devices['Desktop Chrome'],
				headless,
			},
		},
		{
			name: 'firefox',
			use: {
				...devices['Desktop Firefox'],
				headless,
			},
		},
	],
	testMatch: '__e2e__/*.test.ts',
	timeout: 40 * 1_000,
	workers: 1,
});
