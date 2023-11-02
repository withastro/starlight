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
			exclude: [
				...defaultCoverageExcludes,
				'**/vitest.*',
				'components.ts',
				'types.ts',
				// We use this to set up test environments so it isn‘t picked up, but we are testing it downstream.
				'integrations/virtual-user-config.ts',
				// Types-only export.
				'props.ts',
				// Main integration entrypoint — don’t think we’re able to test this directly currently.
				'index.ts',
			],
			thresholdAutoUpdate: true,
			lines: 69.21,
			functions: 90.24,
			branches: 90.62,
			statements: 69.21,
		},
	},
});
