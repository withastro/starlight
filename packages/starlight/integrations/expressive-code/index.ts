import {
	astroExpressiveCode,
	type AstroExpressiveCodeOptions,
	addClassName,
} from 'astro-expressive-code';
import type { AstroConfig, AstroIntegration } from 'astro';
import type { StarlightConfig } from '../../types';
import type { createTranslationSystemFromFs } from '../../utils/translations-fs';
import { pathToLocale } from '../shared/pathToLocale';
import {
	applyStarlightUiThemeColors,
	preprocessThemes,
	type ThemeObjectOrBundledThemeName,
} from './theming';
import { addTranslations } from './translations';

export type StarlightExpressiveCodeOptions = Omit<AstroExpressiveCodeOptions, 'themes'> & {
	/**
	 * Set the themes used to style code blocks.
	 *
	 * See the [Expressive Code `themes` documentation](https://github.com/expressive-code/expressive-code/blob/main/packages/astro-expressive-code/README.md#themes)
	 * for details of the supported theme formats.
	 *
	 * Starlight uses the dark and light variants of Sarah Drasner’s
	 * [Night Owl theme](https://github.com/sdras/night-owl-vscode-theme) by default.
	 *
	 * If you provide at least one dark and one light theme, Starlight will automatically keep
	 * the active code block theme in sync with the current site theme. Configure this behavior
	 * with the [`useStarlightDarkModeSwitch`](#usestarlightdarkmodeswitch) option.
	 *
	 * Defaults to `['starlight-dark', 'starlight-light']`.
	 */
	themes?: ThemeObjectOrBundledThemeName[] | undefined;
	/**
	 * When `true`, code blocks automatically switch between light and dark themes when the
	 * site theme changes.
	 *
	 * When `false`, you must manually add CSS to handle switching between multiple themes.
	 *
	 * **Note**: When setting `themes`, you must provide at least one dark and one light theme
	 * for the Starlight dark mode switch to work.
	 *
	 * Defaults to `true`.
	 */
	useStarlightDarkModeSwitch?: boolean | undefined;
	/**
	 * When `true`, Starlight's CSS variables are used for the colors of code block UI elements
	 * (backgrounds, buttons, shadows etc.), matching the
	 * [site color theme](/guides/css-and-tailwind/#theming).
	 *
	 * When `false`, the colors provided by the active syntax highlighting theme are used for
	 * these elements.
	 *
	 * Defaults to `true` if the `themes` option is not set (= you are using Starlight's
	 * default themes), and `false` otherwise.
	 *
	 * **Note**: When manually setting this to `true` with your custom set of `themes`, you must
	 * provide at least one dark and one light theme to ensure proper color contrast.
	 */
	useStarlightUiThemeColors?: boolean | undefined;
};

export const starlightExpressiveCode = ({
	astroConfig,
	starlightConfig,
	useTranslations,
}: {
	astroConfig: Pick<AstroConfig, 'root' | 'srcDir'>;
	starlightConfig: StarlightConfig;
	useTranslations: ReturnType<typeof createTranslationSystemFromFs>;
}): AstroIntegration[] => {
	const { locales, expressiveCode } = starlightConfig;
	if (expressiveCode === false) return [];
	const config: StarlightExpressiveCodeOptions =
		typeof expressiveCode === 'object' ? expressiveCode : {};

	const {
		themes: themesInput,
		customizeTheme,
		styleOverrides: { textMarkers: textMarkersStyleOverrides, ...otherStyleOverrides } = {},
		useStarlightDarkModeSwitch,
		useStarlightUiThemeColors = config.themes === undefined,
		plugins = [],
		...rest
	} = config;

	// Handle the `themes` option
	const themes = preprocessThemes(themesInput);
	if (useStarlightUiThemeColors === true && themes.length < 2) {
		console.warn(
			`*** Warning: Using the config option "useStarlightUiThemeColors: true" ` +
				`with a single theme is not recommended. For better color contrast, ` +
				`please provide at least one dark and one light theme.\n`
		);
	}

	// Add the `not-content` class to all rendered blocks to prevent them from being affected
	// by Starlight's default content styles
	plugins.push({
		name: 'Starlight Plugin',
		hooks: {
			postprocessRenderedBlock: ({ renderData }) => {
				addClassName(renderData.blockAst, 'not-content');
			},
		},
	});

	// Add Expressive Code UI translations (if any) for all defined locales
	addTranslations(locales, useTranslations);

	return [
		astroExpressiveCode({
			themes,
			customizeTheme: (theme) => {
				if (useStarlightUiThemeColors) {
					applyStarlightUiThemeColors(theme);
				}
				if (customizeTheme) {
					theme = customizeTheme(theme) ?? theme;
				}
				return theme;
			},
			themeCssSelector: (theme, { styleVariants }) => {
				// If one dark and one light theme are available, and the user has not disabled it,
				// generate theme CSS selectors compatible with Starlight's dark mode switch
				if (useStarlightDarkModeSwitch !== false && styleVariants.length >= 2) {
					const baseTheme = styleVariants[0]?.theme;
					const altTheme = styleVariants.find((v) => v.theme.type !== baseTheme?.type)?.theme;
					if (theme === baseTheme || theme === altTheme) return `[data-theme='${theme.type}']`;
				}
				// Return the default selector
				return `[data-theme='${theme.name}']`;
			},
			styleOverrides: {
				borderRadius: '0px',
				borderWidth: '1px',
				codePaddingBlock: '0.75rem',
				codePaddingInline: '1rem',
				codeFontFamily: 'var(--__sl-font-mono)',
				codeFontSize: 'var(--sl-text-code)',
				codeLineHeight: 'var(--sl-line-height)',
				uiFontFamily: 'var(--__sl-font)',
				textMarkers: {
					lineDiffIndicatorMarginLeft: '0.25rem',
					defaultChroma: '45',
					backgroundOpacity: '60%',
					...textMarkersStyleOverrides,
				},
				...otherStyleOverrides,
			},
			getBlockLocale: ({ file }) => pathToLocale(file.path, { starlightConfig, astroConfig }),
			plugins,
			...rest,
		}),
	];
};
