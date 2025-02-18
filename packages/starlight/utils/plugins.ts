import type { AstroIntegration, HookParameters as AstroHookParameters } from 'astro';
import { AstroError } from 'astro/errors';
import { z } from 'astro/zod';
import { parseWithFriendlyErrors } from '../utils/error-map';
import {
	StarlightConfigSchema,
	type StarlightConfig,
	type StarlightUserConfig,
} from '../utils/user-config';
import type { UserI18nSchema } from './translations';
import { createTranslationSystemFromFs } from './translations-fs';
import { absolutePathToLang as getAbsolutePathFromLang } from '../integrations/shared/absolutePathToLang';

/**
 * Runs Starlight plugins in the order that they are configured after validating the user-provided
 * configuration and returns the final validated user config that may have been updated by the
 * plugins and a list of any integrations added by the plugins.
 */
export async function runPlugins(
	starlightUserConfig: StarlightUserConfig,
	pluginsUserConfig: StarlightPluginsUserConfig,
	context: StarlightPluginContext
) {
	// Validate the user-provided configuration.
	let userConfig = starlightUserConfig;

	let starlightConfig = parseWithFriendlyErrors(
		StarlightConfigSchema,
		userConfig,
		'Invalid config passed to starlight integration'
	);

	// Validate the user-provided plugins configuration.
	const pluginsConfig = parseWithFriendlyErrors(
		starlightPluginsConfigSchema,
		pluginsUserConfig,
		'Invalid plugins config passed to starlight integration'
	);

	// A list of translations injected by the various plugins keyed by locale.
	const pluginTranslations: PluginTranslations = {};
	// A list of route middleware added by the various plugins.
	const routeMiddlewareConfigs: Array<z.output<typeof routeMiddlewareConfigSchema>> = [];

	for (const {
		hooks: { 'i18n:setup': i18nSetup },
	} of pluginsConfig) {
		if (i18nSetup) {
			await i18nSetup({
				injectTranslations(translations) {
					// Merge the translations injected by the plugin.
					for (const [locale, localeTranslations] of Object.entries(translations)) {
						pluginTranslations[locale] ??= {};
						Object.assign(pluginTranslations[locale]!, localeTranslations);
					}
				},
			});
		}
	}

	const useTranslations = createTranslationSystemFromFs(
		starlightConfig,
		context.config,
		pluginTranslations
	);

	function absolutePathToLang(path: string) {
		return getAbsolutePathFromLang(path, { astroConfig: context.config, starlightConfig });
	}

	// A list of Astro integrations added by the various plugins.
	const integrations: AstroIntegration[] = [];

	for (const {
		name,
		hooks: { 'config:setup': configSetup, setup: deprecatedSetup },
	} of pluginsConfig) {
		// A refinement in the schema ensures that at least one of the two hooks is defined.
		const setup = (configSetup ?? deprecatedSetup)!;

		await setup({
			config: pluginsUserConfig ? { ...userConfig, plugins: pluginsUserConfig } : userConfig,
			updateConfig(newConfig) {
				// Ensure that plugins do not update the `plugins` config key.
				if ('plugins' in newConfig) {
					throw new AstroError(
						`The \`${name}\` plugin tried to update the \`plugins\` config key which is not supported.`
					);
				}
				if ('routeMiddleware' in newConfig) {
					throw new AstroError(
						`The \`${name}\` plugin tried to update the \`routeMiddleware\` config key which is not supported.`,
						'Use the `addRouteMiddleware()` utility instead.\n' +
							'See https://starlight.astro.build/reference/plugins/#addroutemiddleware for more details.'
					);
				}

				// If the plugin is updating the user config, re-validate it.
				const mergedUserConfig = { ...userConfig, ...newConfig };
				const mergedConfig = parseWithFriendlyErrors(
					StarlightConfigSchema,
					mergedUserConfig,
					`Invalid config update provided by the '${name}' plugin`
				);

				// If the updated config is valid, keep track of both the user config and parsed config.
				userConfig = mergedUserConfig;
				starlightConfig = mergedConfig;
			},
			addIntegration(integration) {
				// Collect any Astro integrations added by the plugin.
				integrations.push(integration);
			},
			addRouteMiddleware(middlewareConfig) {
				routeMiddlewareConfigs.push(middlewareConfig);
			},
			astroConfig: {
				...context.config,
				integrations: [...context.config.integrations, ...integrations],
			},
			command: context.command,
			isRestart: context.isRestart,
			logger: context.logger.fork(name),
			useTranslations,
			absolutePathToLang,
		});
	}

	applyPluginMiddleware(routeMiddlewareConfigs, starlightConfig);

	return { integrations, starlightConfig, pluginTranslations, useTranslations, absolutePathToLang };
}

/** Updates `routeMiddleware` in the Starlight config to add plugin middlewares in the correct order. */
function applyPluginMiddleware(
	routeMiddlewareConfigs: { entrypoint: string; order: 'default' | 'pre' | 'post' }[],
	starlightConfig: StarlightConfig
) {
	const middlewareBuckets = routeMiddlewareConfigs.reduce<
		Record<'pre' | 'default' | 'post', string[]>
	>(
		(buckets, { entrypoint, order = 'default' }) => {
			buckets[order].push(entrypoint);
			return buckets;
		},
		{ pre: [], default: [], post: [] }
	);
	starlightConfig.routeMiddleware.unshift(...middlewareBuckets.pre);
	starlightConfig.routeMiddleware.push(...middlewareBuckets.default, ...middlewareBuckets.post);
}

export function injectPluginTranslationsTypes(
	translations: PluginTranslations,
	injectTypes: AstroHookParameters<'astro:config:done'>['injectTypes']
) {
	const allKeys = new Set<string>();

	for (const localeTranslations of Object.values(translations)) {
		for (const key of Object.keys(localeTranslations)) {
			allKeys.add(key);
		}
	}

	// If there are no translations to inject, we don't need to generate any types or cleanup
	// previous ones as they will not be referenced anymore.
	if (allKeys.size === 0) return;

	injectTypes({
		filename: 'i18n-plugins.d.ts',
		content: `declare namespace StarlightApp {
	type PluginUIStringKeys = {
		${[...allKeys].map((key) => `'${key}': string;`).join('\n\t\t')}
	};
	interface I18n extends PluginUIStringKeys {}
}`,
	});
}

// https://github.com/withastro/astro/blob/910eb00fe0b70ca80bd09520ae100e8c78b675b5/packages/astro/src/core/config/schema.ts#L113
const astroIntegrationSchema = z.object({
	name: z.string(),
	hooks: z.object({}).passthrough().default({}),
}) as z.Schema<AstroIntegration>;

const routeMiddlewareConfigSchema = z.object({
	entrypoint: z.string(),
	order: z.enum(['pre', 'post', 'default']).default('default'),
});

const baseStarlightPluginSchema = z.object({
	/** Name of the Starlight plugin. */
	name: z.string(),
});

const configSetupHookSchema = z
	.function(
		z.tuple([
			z.object({
				/**
				 * A read-only copy of the user-supplied Starlight configuration.
				 *
				 * Note that this configuration may have been updated by other plugins configured
				 * before this one.
				 */
				config: z.any() as z.Schema<
					// The configuration passed to plugins should contains the list of plugins.
					StarlightUserConfig & { plugins?: z.input<typeof baseStarlightPluginSchema>[] }
				>,
				/**
				 * A callback function to update the user-supplied Starlight configuration.
				 *
				 * You only need to provide the configuration values that you want to update but no deep
				 * merge is performed.
				 *
				 * @example
				 * {
				 * 	name: 'My Starlight Plugin',
				 *	hooks: {
				 * 		'config:setup'({ updateConfig }) {
				 * 			updateConfig({
				 * 				description: 'Custom description',
				 * 			});
				 * 		}
				 *	}
				 * }
				 */
				updateConfig: z.function(
					z.tuple([
						z.record(z.any()) as z.Schema<Partial<Omit<StarlightUserConfig, 'routeMiddleware'>>>,
					]),
					z.void()
				),
				/**
				 * A callback function to add an Astro integration required by this plugin.
				 *
				 * @see https://docs.astro.build/en/reference/integrations-reference/
				 *
				 * @example
				 * {
				 * 	name: 'My Starlight Plugin',
				 * 	hooks: {
				 * 		'config:setup'({ addIntegration }) {
				 * 			addIntegration({
				 * 				name: 'My Plugin Astro Integration',
				 * 				hooks: {
				 * 					'astro:config:setup': () => {
				 * 						// …
				 * 					},
				 * 				},
				 * 			});
				 * 		}
				 * 	}
				 * }
				 */
				addIntegration: z.function(z.tuple([astroIntegrationSchema]), z.void()),
				/**
				 * A callback function to register additional route middleware handlers.
				 *
				 * If the order of execution is important, a plugin can use the `order` option to enforce
				 * running first or last.
				 *
				 * @example
				 * {
				 * 	name: 'My Starlight Plugin',
				 * 	hooks: {
				 * 		setup({ addRouteMiddleware }) {
				 * 			addRouteMiddleware({ entrypoint: '@me/my-plugin/route-middleware' });
				 * 		},
				 * 	},
				 * }
				 */
				addRouteMiddleware: z.function(z.tuple([routeMiddlewareConfigSchema]), z.void()),
				/**
				 * A read-only copy of the user-supplied Astro configuration.
				 *
				 * Note that this configuration is resolved before any other integrations have run.
				 *
				 * @see https://docs.astro.build/en/reference/integrations-reference/#config-option
				 */
				astroConfig: z.any() as z.Schema<StarlightPluginContext['config']>,
				/**
				 * The command used to run Starlight.
				 *
				 * @see https://docs.astro.build/en/reference/integrations-reference/#command-option
				 */
				command: z.any() as z.Schema<StarlightPluginContext['command']>,
				/**
				 * `false` when the dev server starts, `true` when a reload is triggered.
				 *
				 * @see https://docs.astro.build/en/reference/integrations-reference/#isrestart-option
				 */
				isRestart: z.any() as z.Schema<StarlightPluginContext['isRestart']>,
				/**
				 * An instance of the Astro integration logger with all logged messages prefixed with the
				 * plugin name.
				 *
				 * @see https://docs.astro.build/en/reference/integrations-reference/#astrointegrationlogger
				 */
				logger: z.any() as z.Schema<StarlightPluginContext['logger']>,
				/**
				 * A callback function to generate a utility function to access UI strings for a given
				 * language.
				 *
				 * @see https://starlight.astro.build/guides/i18n/#using-ui-translations
				 *
				 * @example
				 * {
				 * 	name: 'My Starlight Plugin',
				 *	hooks: {
				 * 		'config:setup'({ useTranslations, logger }) {
				 * 			const t = useTranslations('en');
				 * 			logger.info(t('builtWithStarlight.label'));
				 * 		  // ^ Logs 'Built with Starlight' to the console.
				 * 		}
				 *	}
				 * }
				 */
				useTranslations: z.any() as z.Schema<ReturnType<typeof createTranslationSystemFromFs>>,
				/**
				 * A callback function to get the language for a given absolute file path. The returned
				 * language can be used with the `useTranslations` helper to get UI strings for that
				 * language.
				 *
				 * This can be particularly useful in remark or rehype plugins to get the language for
				 * the current file being processed and use it to get the appropriate UI strings for that
				 * language.
				 *
				 * @example
				 * {
				 * 	name: 'My Starlight Plugin',
				 *	hooks: {
				 * 		'config:setup'({ absolutePathToLang, useTranslations, logger }) {
				 * 			const lang = absolutePathToLang('/absolute/path/to/project/src/content/docs/fr/index.mdx');
				 * 			const t = useTranslations(lang);
				 * 			logger.info(t('aside.tip'));
				 * 		  // ^ Logs 'Astuce' to the console.
				 * 		}
				 *	}
				 * }
				 */
				absolutePathToLang: z.function(z.tuple([z.string()]), z.string()),
			}),
		]),
		z.union([z.void(), z.promise(z.void())])
	)
	.optional();

/**
 * A plugin `config` and `updateConfig` argument are purposely not validated using the Starlight
 * user config schema but properly typed for user convenience because we do not want to run any of
 * the Zod `transform`s used in the user config schema when running plugins.
 */
const starlightPluginSchema = baseStarlightPluginSchema
	.extend({
		/** The different hooks available to the plugin. */
		hooks: z.object({
			/**
			 * Plugin internationalization setup function allowing to inject translations strings for the
			 * plugin in various locales. These translations will be available in the `config:setup` hook
			 * and plugin UI.
			 */
			'i18n:setup': z
				.function(
					z.tuple([
						z.object({
							/**
							 * A callback function to add or update translations strings.
							 *
							 * @see https://starlight.astro.build/guides/i18n/#extend-translation-schema
							 *
							 * @example
							 * {
							 * 	name: 'My Starlight Plugin',
							 * 	hooks: {
							 * 		'i18n:setup'({ injectTranslations }) {
							 * 			injectTranslations({
							 * 				en: {
							 * 					'myPlugin.doThing': 'Do the thing',
							 * 				},
							 * 				fr: {
							 * 					'myPlugin.doThing': 'Faire le truc',
							 * 				},
							 * 			});
							 * 		}
							 * 	}
							 * }
							 */
							injectTranslations: z.function(
								z.tuple([z.record(z.string(), z.record(z.string(), z.string()))]),
								z.void()
							),
						}),
					]),
					z.union([z.void(), z.promise(z.void())])
				)
				.optional(),
			/**
			 * Plugin configuration setup function called with an object containing various values that
			 * can be used by the plugin to interact with Starlight.
			 */
			'config:setup': configSetupHookSchema,
			/**
			 * @deprecated Use the `config:setup` hook instead as `setup` will be removed in a future
			 * version.
			 */
			setup: configSetupHookSchema,
		}),
	})
	.superRefine((plugin, ctx) => {
		if (!plugin.hooks['config:setup'] && !plugin.hooks.setup) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'A plugin must define at least a `config:setup` hook.',
			});
		} else if (plugin.hooks['config:setup'] && plugin.hooks.setup) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					'A plugin cannot define both a `config:setup` and `setup` hook. ' +
					'As `setup` is deprecated and will be removed in a future version, ' +
					'consider using `config:setup` instead.',
			});
		}
	});

const starlightPluginsConfigSchema = z.array(starlightPluginSchema).default([]);

type StarlightPluginsUserConfig = z.input<typeof starlightPluginsConfigSchema>;

export type StarlightPlugin = z.input<typeof starlightPluginSchema>;

export type HookParameters<
	Hook extends keyof StarlightPlugin['hooks'],
	HookFn = StarlightPlugin['hooks'][Hook],
> = HookFn extends (...args: any) => any ? Parameters<HookFn>[0] : never;

export type StarlightUserConfigWithPlugins = StarlightUserConfig & {
	/**
	 * A list of plugins to extend Starlight with.
	 *
	 * @example
	 * // Add Starlight Algolia plugin.
	 * starlight({
	 * 	plugins: [starlightAlgolia({ … })],
	 * })
	 */
	plugins?: StarlightPluginsUserConfig;
};

export type StarlightPluginContext = Pick<
	AstroHookParameters<'astro:config:setup'>,
	'command' | 'config' | 'isRestart' | 'logger'
>;

export type PluginTranslations = Record<string, UserI18nSchema & Record<string, string>>;
