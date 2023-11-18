import fs from 'node:fs';
import {
	astroExpressiveCode,
	ExpressiveCodeTheme,
	type AstroExpressiveCodeOptions,
	pluginFramesTexts,
	addClassName,
} from 'astro-expressive-code';
import type { AstroConfig, AstroIntegration } from 'astro';
import type { StarlightConfig } from '../../types';
import type { createTranslationSystemFromFs } from '../../utils/translations-fs';
import { pathToLocale } from '../shared/pathToLocale';

export * from 'astro-expressive-code';

export type StarlightExpressiveCodeOptions = Omit<AstroExpressiveCodeOptions, 'themes'> & {
	/**
	 * The color themes that should be available for your code blocks.
	 *
	 * CSS variables will be generated for all themes, allowing to select the theme to display
	 * using CSS. If you specify one dark and one light theme, the appropriate theme matching
	 * Starlight's dark mode switch state will be displayed automatically. Have a look at the
	 * `useStarlightDarkModeSwitch` option for more details.
	 *
	 * The following item types are supported in this array:
	 * - any theme name bundled with Shiki (e.g. `dracula`)
	 * - any theme object compatible with VS Code or Shiki (e.g. imported from an NPM theme package)
	 * - any ExpressiveCodeTheme instance (e.g. using `ExpressiveCodeTheme.fromJSONString(...)`
	 *   to load a custom JSON/JSONC theme file yourself)
	 *
	 * Defaults to the dark and light variants of the "Night Owl" theme by Sarah Drasner,
	 * which are also exported from `@astrojs/starlight/expressive-code` as
	 * `getStarlightDefaultThemes`.
	 */
	themes?: AstroExpressiveCodeOptions['themes'];
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
		themes = [],
		customizeTheme,
		styleOverrides: { textMarkers: textMarkersStyleOverrides, ...otherStyleOverrides } = {},
		useStarlightDarkModeSwitch,
		useStarlightUiThemeColors = config.themes === undefined,
		plugins = [],
		...rest
	} = config;

	// Load our default themes if none were provided
	if (!themes.length) {
		themes.push(...getStarlightDefaultThemes());
	}

	const configuredThemesCount = (Array.isArray(themes) && themes.length) || 1;
	if (useStarlightUiThemeColors === true && configuredThemesCount < 2) {
		console.warn(
			[
				`*** Warning: Using the config option "useStarlightUiThemeColors: true" `,
				`with a single theme is not recommended. For better color contrast, `,
				`please provide at least one dark and one light theme.\n`,
			].join('')
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

export function getStarlightDefaultThemes() {
	return ['night-owl-dark.jsonc', 'night-owl-light.jsonc'].map((fileName: string) =>
		ExpressiveCodeTheme.fromJSONString(
			fs.readFileSync(new URL(`./themes/${fileName}`, import.meta.url), 'utf-8')
		)
	);
}

export function applyStarlightUiThemeColors(theme: ExpressiveCodeTheme) {
	const isDark = theme.type === 'dark';
	const neutralMinimal = isDark ? '#ffffff17' : '#0000001a';
	const neutralDimmed = isDark ? '#ffffff40' : '#00000055';

	// Make borders slightly transparent
	const borderColor = 'color-mix(in srgb, var(--sl-color-gray-5), transparent 25%)';
	theme.colors['titleBar.border'] = borderColor;
	theme.colors['editorGroupHeader.tabsBorder'] = borderColor;

	// Use the same color for terminal title bar background and editor tab bar background
	const backgroundColor = isDark ? 'var(--sl-color-black)' : 'var(--sl-color-gray-6)';
	theme.colors['titleBar.activeBackground'] = backgroundColor;
	theme.colors['editorGroupHeader.tabsBackground'] = backgroundColor;

	// Use the same color for terminal titles and tab titles
	theme.colors['titleBar.activeForeground'] = 'var(--sl-color-text)';
	theme.colors['tab.activeForeground'] = 'var(--sl-color-text)';

	// Set tab border colors
	const activeBorderColor = isDark ? 'var(--sl-color-accent-high)' : 'var(--sl-color-accent)';
	theme.colors['tab.activeBorder'] = 'transparent';
	theme.colors['tab.activeBorderTop'] = activeBorderColor;

	// Use neutral colors for scrollbars
	theme.colors['scrollbarSlider.background'] = neutralMinimal;
	theme.colors['scrollbarSlider.hoverBackground'] = neutralDimmed;

	// Set theme `bg` color property for contrast calculations
	theme.bg = isDark ? '#23262f' : '#f6f7f9';
	// Set actual background color to the appropriate Starlight CSS variable
	const editorBackgroundColor = isDark ? 'var(--sl-color-gray-6)' : 'var(--sl-color-gray-7)';

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

	// Use neutral, semi-transparent colors for default text markers
	// to avoid conflicts with the user's chosen background color
	theme.styleOverrides.textMarkers = {
		markBackground: neutralMinimal,
		markBorderColor: neutralDimmed,
	};

	// Add underline font style to link syntax highlighting tokens
	// to match the new GitHub theme link style
	theme.settings.forEach((s) => {
		if (s.name?.includes('Link')) s.settings.fontStyle = 'underline';
	});

	return theme;
}
