import {
	type AstroExpressiveCodeOptions,
	type CustomConfigPreprocessors,
} from 'astro-expressive-code';
import { addClassName } from 'astro-expressive-code/hast';
import type { StarlightExpressiveCodeOptions } from './index';
import type { HookParameters, StarlightConfig } from '../../types';
import { applyStarlightUiThemeColors, preprocessThemes } from './theming';
import { addTranslations } from './translations';
import { slugToLocale } from '../shared/slugToLocale';
import { localeToLang } from '../shared/localeToLang';
import { absolutePathToLang } from '../shared/absolutePathToLang';

type StarlightEcConfigPreprocessorOptions = {
	docsPath: string;
	starlightConfig: StarlightConfig;
	useTranslations: HookParameters<'config:setup'>['useTranslations'];
};

/**
 * Create an Expressive Code configuration preprocessor based on Starlight config.
 * Used internally to set up Expressive Code and by the `<Code>` component.
 */
export function getStarlightEcConfigPreprocessor({
	docsPath,
	starlightConfig,
	useTranslations,
}: StarlightEcConfigPreprocessorOptions): CustomConfigPreprocessors['preprocessAstroIntegrationConfig'] {
	return (input): AstroExpressiveCodeOptions => {
		const ecConfig = input.ecConfig as StarlightExpressiveCodeOptions;

		const {
			themes: themesInput,
			cascadeLayer,
			customizeTheme,
			styleOverrides: { textMarkers: textMarkersStyleOverrides, ...otherStyleOverrides } = {},
			useStarlightDarkModeSwitch,
			useStarlightUiThemeColors = ecConfig.themes === undefined,
			plugins = [],
			...rest
		} = ecConfig;

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

		// Add Expressive Code UI translations for all defined locales
		addTranslations(starlightConfig, useTranslations);

		return {
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
			defaultLocale: starlightConfig.defaultLocale?.lang ?? starlightConfig.defaultLocale?.locale,
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
			cascadeLayer: cascadeLayer ?? 'starlight.components',
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
			getBlockLocale: ({ file }) => {
				if (file.url) {
					const locale = slugToLocale(file.url.pathname.slice(1), starlightConfig);
					return localeToLang(starlightConfig, locale);
				}
				// Note that EC cannot use the `absolutePathToLang` helper passed down to plugins as this callback
				// is also called in the context of the `<Code>` component.
				return absolutePathToLang(file.path, { docsPath, starlightConfig });
			},
			plugins,
			...rest,
		};
	};
}
