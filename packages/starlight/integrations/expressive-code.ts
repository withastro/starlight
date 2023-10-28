import path from 'node:path';
import {
	astroExpressiveCode,
	ExpressiveCodeTheme,
	type AstroExpressiveCodeOptions,
	ensureColorContrastOnBackground,
	pluginFramesTexts,
	type ThemeObjectOrShikiThemeName,
} from 'astro-expressive-code';
import type { AstroIntegration } from 'astro';
import type { StarlightConfig } from '../types';
import type { createTranslationSystemFromFs } from '../utils/translations-fs';

export * from 'astro-expressive-code';

export type StarlightExpressiveCodeOptions = Omit<AstroExpressiveCodeOptions, 'theme' | 'useThemedSelectionColors'> & {
	/**
	 * The color theme(s) that Starlight should use to render code blocks. Supported value types:
	 * - any theme name bundled with Shiki (e.g. `dracula`)
	 * - any theme object compatible with VS Code or Shiki (e.g. imported from an NPM theme package)
	 * - any ExpressiveCodeTheme instance (e.g. using `ExpressiveCodeTheme.fromJSONString(...)`
	 *   to load a custom JSON/JSONC theme file yourself)
	 * - any combination of the above in an array
	 *
	 * Defaults to the `['github-dark', 'github-light']` themes bundled with Shiki.
	 *
	 * **Note**: If you pass an array of themes to this option, each code block in your
	 * markdown/MDX documents will be rendered using all themes. If you pass one dark and one light
	 * theme, Starlight will by default automatically add CSS to show only the theme that matches
	 * the current dark mode switch state. See the `useStarlightDarkModeSwitch` option to configure
	 * this behavior. If you turn it off, you will need to add your own CSS code to the site
	 * to ensure that only one theme is visible at any time.
	 *
	 * To allow targeting all code blocks of a given theme through CSS, the theme property `name`
	 * is used to generate kebap-cased class names in the format `ec-theme-${name}`.
	 * For example, `theme: ['monokai', 'slack-ochin']` will render every code block twice,
	 * once with the class `ec-theme-monokai`, and once with `ec-theme-slack-ochin`.
	 */
	theme?: ThemeObjectOrShikiThemeName | ThemeObjectOrShikiThemeName[] | undefined;
    /**
     * By default, Starlight renders selected text in code blocks using the browser's
	 * default style to maximize accessibility. If you want your selections to be more colorful,
	 * you can set this option to `true` to allow using theme selection colors instead.
     *
     * Note that you can override the individual selection colors defined by the theme
     * using the `styleOverrides` option.
     */
    useThemedSelectionColors?: boolean | undefined;
	/**
	 * Determines if CSS code should be added to the site that automatically displays
	 * dark or light code blocks depending on Starlight's dark mode switch state.
	 *
	 * Defaults to `true` if the `theme` option is not set or contains one dark and one light theme,
	 * and `false` otherwise.
	 */
	useStarlightDarkModeSwitch?: boolean | undefined;
	/**
	 * Determines if Starlight's CSS variables should be used for the colors of UI elements
	 * (backgrounds, buttons, shadows etc.) instead of the colors provided by themes.
	 *
	 * Defaults to `true` if the `theme` option is not set (= you are using the default themes),
	 * and `false` otherwise.
	 */
	useStarlightUiThemeColors?: boolean | undefined;
	/**
	 * Determines if Starlight should process the syntax highlighting colors of all themes
	 * to ensure an accessible minimum contrast ratio between foreground and background colors.
	 *
	 * Defaults to `5.5`, which ensures a contrast ratio of at least 5.5:1.
	 * You can change the desired contrast ratio by providing another value,
	 * or turn the feature off by setting this option to `0`.
	 */
	minSyntaxHighlightingColorContrast?: number | undefined;
};

export const starlightExpressiveCode = (
	opts: StarlightConfig,
	useTranslations: ReturnType<typeof createTranslationSystemFromFs>
): AstroIntegration[] => {
	const { locales, defaultLocale, expressiveCode } = opts;
	if (expressiveCode === false) return [];
	const config = typeof expressiveCode === 'object' ? expressiveCode : {};

	const {
		theme = ['github-dark', 'github-light'],
		customizeTheme,
		useThemedSelectionColors = false,
		styleOverrides: {
			textMarkers: textMarkersStyleOverrides,
			...otherStyleOverrides
		} = {},
		useStarlightDarkModeSwitch,
		useStarlightUiThemeColors = config.theme === undefined,
		minSyntaxHighlightingColorContrast = 5.5,
		plugins = [],
		...rest
	} = config;

	const configuredThemesCount = (Array.isArray(theme) && theme.length) || 1;
	if (useStarlightDarkModeSwitch !== false) {
		const loadedThemes: ExpressiveCodeTheme[] = [];
		const darkModeSwitchCss: string[] = [];
		plugins.push({
			name: 'Starlight Dark Mode Switch',
			baseStyles: ({ theme, themeClassName }) => {
				loadedThemes.push(theme);
				darkModeSwitchCss.push(`
					:root:not([data-theme='${theme.type}']) .${themeClassName} {
						display: none;
					}
				`);
				if (loadedThemes.length !== configuredThemesCount) return '';
				const foundDarkThemes = loadedThemes.filter((t) => t.type === 'dark').length;
				const foundLightThemes = loadedThemes.filter((t) => t.type === 'light').length;
				const configuredThemesSupportDarkModeSwitch =
					foundDarkThemes === 1 && foundLightThemes === 1;
				if (!configuredThemesSupportDarkModeSwitch) {
					if (useStarlightDarkModeSwitch === true)
						console.warn(
							`*** Warning: To support the config option "useStarlightDarkModeSwitch: true", please provide 1 dark and 1 light theme (found ${foundDarkThemes} and ${foundLightThemes}).\n`
						);
					return '';
				}
				return darkModeSwitchCss.join('\n');
			},
		});
	}

	if (useStarlightUiThemeColors === true && configuredThemesCount < 2)
		console.warn(`*** Warning: Using the config option "useStarlightUiThemeColors: true" with only one theme is not recommended. For better color contrast, please provide 1 dark and 1 light theme.\n`);

	// Add Expressive Code UI translations (if any) for all defined locales
	addTranslations(locales, useTranslations);

	return [
		astroExpressiveCode({
			theme,
			customizeTheme: (theme) => {
				if (useStarlightUiThemeColors) {
					applyStarlightUiThemeColors(theme);
				}
				if (customizeTheme) {
					theme = customizeTheme(theme) ?? theme;
				}
				if (minSyntaxHighlightingColorContrast > 0) {
					ensureMinTokenColorContrast(theme, minSyntaxHighlightingColorContrast);
				}
				return theme;
			},
			useThemedSelectionColors,
			styleOverrides: {
				codeFontFamily: 'var(--__sl-font-mono)',
				codeFontSize: 'var(--sl-text-code)',
				codeLineHeight: 'var(--sl-line-height)',
				uiFontFamily: 'var(--__sl-font)',
				textMarkers: {
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
	theme.bg = theme.type === 'dark' ? '#23262f' : '#f6f7f9'
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
		frameBoxShadowCssValue: 'var(--sl-shadow-sm)',
	};

	return theme;
}

export function ensureMinTokenColorContrast(theme: ExpressiveCodeTheme, minContrast: number) {
	theme.settings.forEach((s) => {
		if (!s.settings.foreground) return
		const newColor = ensureColorContrastOnBackground(s.settings.foreground, theme.bg, minContrast);
		if (newColor === s.settings.foreground) return
		s.settings.foreground = newColor
	})

	return theme;
}
