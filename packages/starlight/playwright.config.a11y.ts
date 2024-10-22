import { defineConfig } from '@playwright/test';
import config from './playwright.config';

export default defineConfig({
	...config,
	testMatch: '__a11y__/*.test.ts',
	// The timeout for the accessibility tests only.
	timeout: 180 * 1_000,
	webServer: [
		{
			command: 'pnpm run build && pnpm run preview',
			cwd: '../../docs',
			reuseExistingServer: !process.env['CI'],
			stdout: 'pipe',
			// The timeout of the single build step ran before the accessibility tests.
			timeout: 120 * 1_000,
			url: 'http://localhost:4321',
		},
	],
});
