import { defineConfig } from '@playwright/test';
import config from './playwright.config';

export default defineConfig({
	...config,
	testMatch: '__a11y__/*.test.ts',
	timeout: 180 * 1_000,
	webServer: [
		{
			command: 'pnpm run build && pnpm run preview',
			cwd: '../../docs',
			reuseExistingServer: !process.env['CI'],
			stdout: 'pipe',
			url: 'http://localhost:4321',
		},
	],
});
