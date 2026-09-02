import { unified } from '@astrojs/markdown-remark';
import { satteri } from '@astrojs/markdown-satteri';
import type { ExpressiveCodeTheme, StyleVariant } from 'astro-expressive-code';
import { astroExpressiveCode } from 'astro-expressive-code';
import { describe, expect, test, vi } from 'vitest';
import type { StarlightExpressiveCodeOptions } from '../../src/integrations/expressive-code';
import { getStarlightEcConfigPreprocessor } from '../../src/integrations/expressive-code/preprocessor';
import { getCollectionPosixPath } from '../../src/utils/collection-fs';
import { StarlightConfigSchema, type StarlightUserConfig } from '../../src/utils/user-config';
import { createPluginTestOptions, docFileURL } from '../test-utils';

describe('getStarlightEcConfigPreprocessor()', () => {
	test('warns when using `useStarlightUiThemeColors` with a single theme', async () => {
		const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		await preprocessEcConfig({ themes: ['starlight-light'], useStarlightUiThemeColors: true });

		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining(
				'Using the config option "useStarlightUiThemeColors: true" with a single theme is not recommended.'
			)
		);

		consoleWarnSpy.mockRestore();
	});
});

describe('Expressive Code config', () => {
	describe('themeCssSelector()', () => {
		test('returns a custom theme selector for a single custom theme', async () => {
			const config = await preprocessEcConfig();
			if (typeof config.themeCssSelector !== 'function') {
				throw new Error('Expected `themeCssSelector` to be a function');
			}

			const selector = config.themeCssSelector({ name: 'test-theme' } as ExpressiveCodeTheme, {
				styleVariants: [],
			});

			expect(selector).toBe("[data-theme='test-theme']");
		});

		test('returns Starlight theme switcher-compatible selectors for a dark/light theme pair', async () => {
			const config = await preprocessEcConfig();
			if (typeof config.themeCssSelector !== 'function') {
				throw new Error('Expected `themeCssSelector` to be a function');
			}

			const darkStyle = { theme: { name: 'test-theme', type: 'dark' } } as StyleVariant;
			const lightStyle = { theme: { name: 'test-theme-light', type: 'light' } } as StyleVariant;
			const context = { styleVariants: [darkStyle, lightStyle] };

			const darkSelector = config.themeCssSelector(darkStyle.theme, context);
			expect(darkSelector).toBe("[data-theme='dark']");
			const lightSelector = config.themeCssSelector(lightStyle.theme, context);
			expect(lightSelector).toBe("[data-theme='light']");
		});

		test('returns theme name selector if dark/light toggle is disabled', async () => {
			const config = await preprocessEcConfig({ useStarlightDarkModeSwitch: false });
			if (typeof config.themeCssSelector !== 'function') {
				throw new Error('Expected `themeCssSelector` to be a function');
			}

			const darkStyle = { theme: { name: 'test-theme', type: 'dark' } } as StyleVariant;
			const lightStyle = { theme: { name: 'test-theme-light', type: 'light' } } as StyleVariant;

			const selector = config.themeCssSelector(darkStyle.theme, {
				styleVariants: [darkStyle, lightStyle],
			});

			expect(selector).toBe("[data-theme='test-theme']");
		});

		test('returns theme name selector for additional themes', async () => {
			const config = await preprocessEcConfig();
			if (typeof config.themeCssSelector !== 'function') {
				throw new Error('Expected `themeCssSelector` to be a function');
			}

			const darkStyle = { theme: { name: 'test-theme-dark', type: 'dark' } } as StyleVariant;
			const lightStyle = { theme: { name: 'test-theme-light', type: 'light' } } as StyleVariant;
			const thirdStyle = { theme: { name: 'test-theme-third', type: 'dark' } } as StyleVariant;
			const fourthStyle = { theme: { name: 'test-theme-fourth', type: 'light' } } as StyleVariant;
			const context = { styleVariants: [darkStyle, lightStyle, thirdStyle, fourthStyle] };

			expect(config.themeCssSelector(darkStyle.theme, context)).toBe("[data-theme='dark']");
			expect(config.themeCssSelector(lightStyle.theme, context)).toBe("[data-theme='light']");
			expect(config.themeCssSelector(thirdStyle.theme, context)).toBe(
				"[data-theme='test-theme-third']"
			);
			expect(config.themeCssSelector(fourthStyle.theme, context)).toBe(
				"[data-theme='test-theme-fourth']"
			);
		});
	});

	describe('getBlockLocale()', () => {
		/** Utility to create a stub of the object shape expected by `getBlockLocale()`. */
		const CodeInput = ({ path, url }: { path: string; url?: URL }) => ({
			input: { code: '', language: 'ts' },
			file: { cwd: '', data: {}, path, url },
		});

		test('gets the root locale when an absolute file URL is passed', async () => {
			const config = await preprocessEcConfig();
			const locale = config.getBlockLocale?.(
				CodeInput({ path: '/path/to/docs/doc.md', url: new URL('file:///path/to/docs/doc.md') })
			);
			expect(locale).toBe('en');
		});

		test('gets a non-root locale when an absolute file URL is passed', async () => {
			const config = await preprocessEcConfig();
			const locale = config.getBlockLocale?.(
				CodeInput({
					path: '/path/to/docs/fr/doc.md',
					url: new URL('file:///path/to/docs/fr/doc.md'),
				})
			);
			expect(locale).toBe('fr');
		});

		test('gets the root locale when no file URL is passed', async () => {
			const config = await preprocessEcConfig();
			const locale = await config.getBlockLocale?.(CodeInput({ path: '/path/to/docs/doc.md' }));
			expect(locale).toBe('en');
		});

		test('gets a non-root locale when no file URL is passed', async () => {
			const config = await preprocessEcConfig();
			const locale = await config.getBlockLocale?.(CodeInput({ path: '/path/to/docs/fr/doc.md' }));
			expect(locale).toBe('fr');
		});

		test('gets the root locale for a file in the docs when Astro.url is passed', async () => {
			const config = await preprocessEcConfig();
			const locale = await config.getBlockLocale?.(
				CodeInput({ path: 'doc.md', url: new URL('https://example.com/doc.md') })
			);
			expect(locale).toBe('en');
		});

		test('gets a non-root locale for a file in the docs when Astro.url is passed', async () => {
			const config = await preprocessEcConfig();
			const locale = await config.getBlockLocale?.(
				CodeInput({ path: 'fr/doc.md', url: new URL('https://example.com/fr/doc.md') })
			);
			expect(locale).toBe('fr');
		});
	});

	describe('customizeTheme()', () => {
		test('uses custom theme returned from `customizeTheme()`', async () => {
			const config = await preprocessEcConfig({
				customizeTheme: () => {
					return { name: 'custom-theme' } as ExpressiveCodeTheme;
				},
			});
			const customizedTheme = config.customizeTheme?.({
				name: 'original-theme',
				colors: {},
				styleOverrides: {},
			} as ExpressiveCodeTheme);
			expect(customizedTheme?.name).toBe('custom-theme');
		});

		test('uses mutated theme from `customizeTheme()`', async () => {
			const config = await preprocessEcConfig({
				customizeTheme: (theme: ExpressiveCodeTheme) => {
					theme.name = 'custom-theme';
				},
			});
			const customizedTheme = config.customizeTheme?.({
				name: 'original-theme',
				colors: {},
				styleOverrides: {},
			} as ExpressiveCodeTheme);
			expect(customizedTheme?.name).toBe('custom-theme');
		});

		test('is a no-op if `customizeTheme()` function is not set and `useStarlightUiThemeColors` is false', async () => {
			const config = await preprocessEcConfig({ useStarlightUiThemeColors: false });
			const theme = { name: 'my-theme', colors: {}, styleOverrides: {} } as ExpressiveCodeTheme;
			const customizedTheme = config.customizeTheme?.(theme);
			expect(customizedTheme).toStrictEqual({ name: 'my-theme', colors: {}, styleOverrides: {} });
		});
	});
});

describe('processors', () => {
	const processors = [
		{ name: 'Sätteri', create: () => satteri() },
		{ name: 'Unified', create: () => unified() },
	];

	describe.for(processors)('$name', ({ create }) => {
		test('localizes Expressive Code UI', async () => {
			const userConfig: StarlightUserConfig = {
				title: 'Expressive Code',
				locales: {
					root: { label: 'English', lang: 'en' },
					fr: { label: 'French', lang: 'fr' },
				},
			};

			const { astroConfig, useTranslations } = await createPluginTestOptions(userConfig);
			const starlightConfig = StarlightConfigSchema.parse(userConfig);

			const processor = create();

			const ecIntegration = astroExpressiveCode({
				customConfigPreprocessors: {
					preprocessAstroIntegrationConfig: getStarlightEcConfigPreprocessor({
						docsPath: getCollectionPosixPath('docs', astroConfig.srcDir),
						starlightConfig,
						useTranslations,
					}),
					preprocessComponentConfig: '',
				},
			});

			await ecIntegration.hooks['astro:config:setup']({
				config: {
					root: astroConfig.root,
					integrations: [ecIntegration],
					markdown: { processor },
				},
				addWatchFile: () => {},
				updateConfig: () => {},
			});

			const renderer = await processor.createRenderer({ syntaxHighlight: false });

			const result = await renderer.render('```js\nconsole.log("bonjour")\n```', {
				fileURL: docFileURL('fr/index.md'),
			});

			expect(result.code).toContain('title="Copier dans le presse-papiers"');
		});
	});
});

/** Preprocess an Expressive Code config using the Starlight preprocessor. */
async function preprocessEcConfig(ecConfig: StarlightExpressiveCodeOptions = {}) {
	const [starlightConfig, useTranslations] = getStarlightConfigAndUseTranslations({
		root: { label: 'English', lang: 'en' },
		fr: { label: 'French', lang: 'fr' },
	});
	const configPreprocessor = getStarlightEcConfigPreprocessor({
		docsPath: '/path/to/docs/',
		starlightConfig,
		useTranslations,
	});
	return await configPreprocessor({
		ecConfig,
		// @ts-expect-error — We’re skipping some properties of `astroConfig`.
		astroConfig: {},
	});
}

function getUseTranslations(exists: boolean = true) {
	const t = () => 'test UI string';
	t.exists = vi.fn().mockReturnValue(exists);
	return vi.fn().mockReturnValue(t);
}

function getStarlightConfigAndUseTranslations(
	locales: StarlightUserConfig['locales'],
	defaultLocale?: StarlightUserConfig['defaultLocale']
) {
	return [
		StarlightConfigSchema.parse({
			title: 'Expressive Code Translations Test',
			locales,
			defaultLocale,
		}),
		getUseTranslations(),
	] as const;
}
