module.exports = {
  root: true,
  extends: ['eslint:recommended'],
  plugins: ['no-only-tests'],
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './docs/tsconfig.json'],
  },
  ignorePatterns: ['**/node_modules/*', '**/dist/*'],
  rules: {
    'no-only-tests/no-only-tests': 'warn',
    'no-empty': 'warn',
    'no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^(_.*?|e)$',
      },
    ],
    'no-unused-private-class-members': 'warn',
    'no-invalid-this': 'warn',
    'consistent-this': 'warn',
    'no-mixed-spaces-and-tabs': 'off',
  },
  overrides: [
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            argsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            varsIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/no-empty-function': 'warn',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-redundant-type-constituents': 'off',
      },
    },
    {
      files: ['**/env.d.ts'],
      rules: {
        '@typescript-eslint/triple-slash-reference': 'off',
      },
    },
    {
      files: ['packages/*/__tests__/**/*.ts'],
      rules: {
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-function': 'off',
      },
    },
  ],
};
