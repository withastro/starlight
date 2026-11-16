import codspeedPlugin from '@codspeed/vitest-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [codspeedPlugin()],
	test: {
		benchmark: {
			include: ['__bench_e2e__/*.bench.ts'],
		},
		fileParallelism: false,
	},
});
