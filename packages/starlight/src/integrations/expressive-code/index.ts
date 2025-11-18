import { astroExpressiveCode, type AstroExpressiveCodeOptions } from 'astro-expressive-code';
import type { AstroConfig, AstroIntegration } from 'astro';
import type { HookParameters, StarlightConfig } from '../../types';
import { getStarlightEcConfigPreprocessor } from './preprocessor';
import { type ThemeObjectOrBundledThemeName } from './theming';
import { getCollectionPosixPath } from '../../utils/collection-fs';

export type StarlightExpressiveCodeOptions = Omit<AstroExpressiveCodeOptions, 'themes'> & {
	/**
	 * Set the themes used to style code blocks.
	 *
	 * See the [Expressive Code `themes` documentation](https://expressive-code.com/guides/themes/)
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

type StarlightEcIntegrationOptions = {
	astroConfig: AstroConfig;
	starlightConfig: StarlightConfig;
	useTranslations: HookParameters<'config:setup'>['useTranslations'];
};

export const starlightExpressiveCode = ({
	astroConfig,
	starlightConfig,
	useTranslations,
}: StarlightEcIntegrationOptions): AstroIntegration[] => {
	// If Expressive Code is disabled, add a shim to prevent build errors and provide
	// a helpful error message in case the user tries to use the `<Code>` component
	if (starlightConfig.expressiveCode === false) {
		const modules: Record<string, string> = {
			'virtual:astro-expressive-code/api': 'export default {}',
			'virtual:astro-expressive-code/config': 'export default {}',
			'virtual:astro-expressive-code/preprocess-config': `throw new Error("Starlight's
				Code component requires Expressive Code, which is disabled in your Starlight config.
				Please remove \`expressiveCode: false\` from your config or import Astro's built-in
				Code component from 'astro:components' instead.")`.replace(/\s+/g, ' '),
		};

		return [
			{
				name: 'astro-expressive-code-shim',
				hooks: {
					'astro:config:setup': ({ updateConfig }) => {
						updateConfig({
							vite: {
								plugins: [
									{
										name: 'vite-plugin-astro-expressive-code-shim',
										enforce: 'post',
										resolveId: (id) => (id in modules ? `\0${id}` : undefined),
										load: (id) => (id?.[0] === '\0' ? modules[id.slice(1)] : undefined),
									},
								],
							},
						});
					},
				},
			},
		];
	}

	const configArgs =
		typeof starlightConfig.expressiveCode === 'object'
			? (starlightConfig.expressiveCode as AstroExpressiveCodeOptions)
			: {};

	const docsPath = getCollectionPosixPath('docs', astroConfig.srcDir);

	return [
		astroExpressiveCode({
			...configArgs,
			customConfigPreprocessors: {
				preprocessAstroIntegrationConfig: getStarlightEcConfigPreprocessor({
					docsPath,
					starlightConfig,
					useTranslations,
				}),
				preprocessComponentConfig: `
					import starlightConfig from 'virtual:starlight/user-config'
					import { useTranslations, getStarlightEcConfigPreprocessor } from '@astrojs/starlight/internal'

					export default getStarlightEcConfigPreprocessor({ docsPath: ${JSON.stringify(docsPath)}, starlightConfig, useTranslations })
				`,
			},
		}),
	];
};
