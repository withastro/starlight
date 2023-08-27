import { defineConfig } from 'vitest/config';

// Copy of https://github.com/vitest-dev/vitest/blob/8693449b412743f20a63fd9bfa1a9054aa74613f/packages/vitest/src/defaults.ts#L13C1-L26C1
const defaultCoverageExcludes = [
	'coverage/**',
	'dist/**',
	'packages/*/test?(s)/**',
	'**/*.d.ts',
	'cypress/**',
	'test?(s)/**',
	'test?(-*).?(c|m)[jt]s?(x)',
	'**/*{.,-}{test,spec}.?(c|m)[jt]s?(x)',
	'**/__tests__/**',
	'**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
	'**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}',
];

export default defineConfig({
	test: {
		coverage: {
			all: true,
			reportsDirectory: './__coverage__',
			exclude: [...defaultCoverageExcludes, '**/vitest.*', 'components.ts', 'types.ts'],
			thresholdAutoUpdate: true,
			lines: 66.57,
			functions: 88.46,
			branches: 90.14,
			statements: 66.57,
		},
	},
});
