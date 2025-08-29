// @ts-check
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
	// Ignore hidden files and directories, `*.d.ts` files (as most recommendations are mostly for
	// users rather than libraries), types testing files, example directories, and build directories.
	globalIgnores([
		'**/.*',
		'**/*.d.ts',
		'**/*.test-d.ts',
		'**/examples/',
		'**/dist/',
		'**/build/',
		'**/examples/',
	]),

	// Setup Node.js globals from `globalThis` (does not include CommonJS arguments).
	{
		languageOptions: {
			globals: {
				...globals.nodeBuiltin,
			},
		},
	},

	// Add ESLint recommended rules.
	eslint.configs.recommended,

	// Add TypeScript ESLint recommended rules with type checking.
	tseslint.configs.recommendedTypeChecked,
	// Setup typed linting.
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: dirname(fileURLToPath(import.meta.url)),
			},
		},
	},

	// Disable all formatting rules.
	prettierConfig,

	// Tweak some rules in all files.
	{
		rules: {
			// Allow triple-slash references that we heavily use.
			'@typescript-eslint/triple-slash-reference': 'off',
			// Disable unbound method checks which requires another plugin to properly work with `expect`
			// calls.
			'@typescript-eslint/unbound-method': 'off',
			// Allow empty catch blocks.
			'no-empty': ['error', { allowEmptyCatch: true }],
			// Allow unused variables for sibling properties in destructuring (used to omit properties)
			// or starting with `_`.
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ ignoreRestSiblings: true, destructuredArrayIgnorePattern: '^_', varsIgnorePattern: '^_' },
			],
			// Allow using `any` in rest parameter arrays, e.g. `(...args: any[]) => void`.
			'@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: true }],
			// Allow duplicated types in unions as it's not an error and the extra verbosity can make it
			// easier to understand some unions, e.g. for Zod input and output types.
			'@typescript-eslint/no-duplicate-type-constituents': 'off',
			// Allow redundant types in unions as it's not an error and we use such mechanisms to provide
			// fallbacks for some types that may not be accessible in some user environments, e.g. i18n
			// keys for plugins.
			'@typescript-eslint/no-redundant-type-constituents': 'off',
			// Allow for using async event handlers without needing to use an async IIFE.
			'@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
		},
	},

	// Disabled typed linting in JavaScript files.
	{
		files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
		extends: [tseslint.configs.disableTypeChecked],
	}
);
