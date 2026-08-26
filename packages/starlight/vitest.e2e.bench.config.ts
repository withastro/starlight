import codspeedPlugin from '@codspeed/vitest-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [codspeedPlugin()],
	benchmark: {
		include: ['__bench_e2e__/*.bench.ts'],
	},
	test: {
		fileParallelism: false,
		hookTimeout: 600_000,
	},
});
