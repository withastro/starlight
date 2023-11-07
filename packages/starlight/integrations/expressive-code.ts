import path from 'node:path';
import {
	astroExpressiveCode,
	ExpressiveCodeTheme,
	type AstroExpressiveCodeOptions,
	pluginFramesTexts,
	addClassName,
} from 'astro-expressive-code';
import type { AstroIntegration } from 'astro';
import type { StarlightConfig } from '../types';
import type { createTranslationSystemFromFs } from '../utils/translations-fs';

export * from 'astro-expressive-code';

export type StarlightExpressiveCodeOptions = AstroExpressiveCodeOptions & {
	/**
	 * Determines if CSS code should be added to the site that automatically displays
	 * dark or light code blocks depending on Starlight's dark mode switch state.
	 *
	 * Defaults to `true` if the `themes` option is not set or contains at least
	 * one dark and one light theme, and `false` otherwise.
	 */
	useStarlightDarkModeSwitch?: boolean | undefined;
	/**
	 * Determines if Starlight's CSS variables should be used for the colors of UI elements
	 * (backgrounds, buttons, shadows etc.) instead of the colors provided by themes.
	 *
	 * Defaults to `true` if the `themes` option is not set (= you are using the default themes),
	 * and `false` otherwise.
	 */
	useStarlightUiThemeColors?: boolean | undefined;
};

export const starlightExpressiveCode = (
	opts: StarlightConfig,
	useTranslations: ReturnType<typeof createTranslationSystemFromFs>
): AstroIntegration[] => {
	const { locales, defaultLocale, expressiveCode } = opts;
	if (expressiveCode === false) return [];
	const config: StarlightExpressiveCodeOptions =
		typeof expressiveCode === 'object' ? expressiveCode : {};

	const {
		themes = ['github-dark', 'github-light'],
		customizeTheme,
		styleOverrides: { textMarkers: textMarkersStyleOverrides, ...otherStyleOverrides } = {},
		useStarlightDarkModeSwitch,
		useStarlightUiThemeColors = config.themes === undefined,
		plugins = [],
		...rest
	} = config;

	plugins.push({
		name: 'Starlight Plugin',
		hooks: {
			postprocessRenderedBlock: ({ renderData }) => {
				addClassName(renderData.blockAst, 'not-content');
			},
		},
	});

	const configuredThemesCount = (Array.isArray(themes) && themes.length) || 1;
	if (useStarlightUiThemeColors === true && configuredThemesCount < 2)
		console.warn(
			`*** Warning: Using the config option "useStarlightUiThemeColors: true" with only one theme is not recommended. For better color contrast, please provide 1 dark and 1 light theme.\n`
		);

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
			getBlockLocale: ({ file }) => {
				// Root path:    `src/content/docs/getting-started.mdx`
				// Locale path:  `src/content/docs/fr/getting-started.mdx`
				// Part indices:  0     1      2   3         4
				const pathParts = path.relative(file.cwd, file.path).split(/[\\/]/);
				const localeOrFolder = pathParts[3];
				const lang = localeOrFolder ? locales?.[localeOrFolder]?.lang : locales?.root?.lang;
				const defaultLang = defaultLocale?.lang || defaultLocale?.locale;
				const result = lang || defaultLang || 'en';

				return result;
			},
			plugins,
			...rest,
		}),
	];
};

function addTranslations(
	locales: StarlightConfig['locales'],
	useTranslations: ReturnType<typeof createTranslationSystemFromFs>
) {
	for (const locale in locales) {
		const lang = locales[locale]?.lang;
		if (!lang) continue;

		const t = useTranslations(locale);
		const translationKeys = [
			'expressiveCode.copyButtonCopied',
			'expressiveCode.copyButtonTooltip',
			'expressiveCode.terminalWindowFallbackTitle',
		] as const;
		translationKeys.forEach((key) => {
			const translation = t(key);
			if (!translation) return;
			const ecId = key.replace(/^expressiveCode\./, '');
			pluginFramesTexts.overrideTexts(lang, { [ecId]: translation });
		});
	}
}

export function applyStarlightUiThemeColors(theme: ExpressiveCodeTheme) {
	// Make borders slightly transparent
	const borderColor = 'color-mix(in srgb, var(--sl-color-gray-5), transparent 25%)';
	theme.colors['titleBar.border'] = borderColor;
	theme.colors['editorGroupHeader.tabsBorder'] = borderColor;

	// Use the same color for terminal title bar background and editor tab bar background
	const backgroundColor =
		theme.type === 'dark' ? 'var(--sl-color-black)' : 'var(--sl-color-gray-6)';
	theme.colors['titleBar.activeBackground'] = backgroundColor;
	theme.colors['editorGroupHeader.tabsBackground'] = backgroundColor;

	// Use the same color for terminal titles and tab titles
	theme.colors['titleBar.activeForeground'] = 'var(--sl-color-text)';
	theme.colors['tab.activeForeground'] = 'var(--sl-color-text)';

	// Set tab border colors
	const activeBorderColor =
		theme.type === 'dark' ? 'var(--sl-color-accent-high)' : 'var(--sl-color-accent)';
	theme.colors['tab.activeBorder'] = 'transparent';
	theme.colors['tab.activeBorderTop'] = activeBorderColor;

	// Set theme `bg` color property for contrast calculations
	theme.bg = theme.type === 'dark' ? '#23262f' : '#f6f7f9';
	// Set actual background color to the appropriate Starlight CSS variable
	const editorBackgroundColor =
		theme.type === 'dark' ? 'var(--sl-color-gray-6)' : 'var(--sl-color-gray-7)';

	theme.styleOverrides.frames = {
		// Use the same color for editor background, terminal background and active tab background
		editorBackground: editorBackgroundColor,
		terminalBackground: editorBackgroundColor,
		editorActiveTabBackground: editorBackgroundColor,
		terminalTitlebarDotsForeground: borderColor,
		terminalTitlebarDotsOpacity: '0.75',
		inlineButtonForeground: 'var(--sl-color-text)',
		frameBoxShadowCssValue: 'none',
	};
	theme.styleOverrides.textMarkers = {
		markBackground: theme.type === 'dark' ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.1)',
		markBorderColor: theme.type === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.35)',
	};

	return theme;
}
