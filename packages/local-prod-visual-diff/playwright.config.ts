import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://localhost:4321';

export default defineConfig({
	forbidOnly: !!process.env['CI'],
	projects: [
		{
			name: 'setup diff',
			testMatch: /diff\.setup\.ts/,
		},
		{
			name: 'Chrome Stable',
			use: {
				...devices['Desktop Chrome'],
				headless: true,
			},
			dependencies: ['setup diff'],
		},
	],
	testMatch: '*.test.ts',
	use: {
		baseURL,
	},
	webServer: [
		{
			command: 'pnpm run dev',
			// command: 'pnpm run build && pnpm run preview',
			cwd: '../../docs',
			reuseExistingServer: !process.env['CI'],
			url: baseURL,
		},
	],
});
