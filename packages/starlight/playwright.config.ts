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
	testMatch: '__e2e__/*.test.ts',
	timeout: 40 * 1_000,
	workers: 1,
});
