import type { AstroIntegrationLogger } from 'astro';
import { z } from 'astro/zod';
import type { StarlightUserConfig } from '../utils/user-config';
import { errorMap } from '../utils/error-map';

/**
 * Runs Starlight plugins in the order that they are configured after validating the plugins config
 * and returns the final user config that may have been updated by the plugins.
 * Note that the returned config is not validated and should still be validated by the caller.
 */
export async function runPlugins(
	{ plugins, ...config }: StarlightUserConfigWithPlugins,
	logger: AstroIntegrationLogger
) {
	const parsedPluginsConfig = starlightPluginsConfigSchema.safeParse({ plugins }, { errorMap });

	if (!parsedPluginsConfig.success) {
		throw new Error(
			'Invalid plugins config passed to starlight integration\n' +
				parsedPluginsConfig.error.issues.map((i) => i.message).join('\n')
		);
	}

	let userConfig = config;

	for (const { name, plugin } of parsedPluginsConfig.data.plugins) {
		await plugin({
			config: userConfig,
			logger: logger.fork(name),
			updateConfig(newConfig) {
				userConfig = { ...userConfig, ...newConfig };
			},
		});
	}

	return { userConfig };
}

/**
 * A schema for validating the Starlight plugins configuration.
 *
 * A plugin `config` and `updateConfig` argument are purposely not validated using the Starlight
 * user config schema but properly typed for user convenience because we do not want to run any of
 * the Zod `transform`s used in the user config schema when running plugins.
 * The final user config should be validated by the caller after running all the plugins.
 */
const starlightPluginsConfigSchema = z.object({
	/**
	 * A list of plugins to extend Starlight with.
	 *
	 * @example
	 * // Add Starlight Algolia plugin.
	 * starlight({
	 * 	plugins: [starlightAlgolia({ … })],
	 * })
	 */
	plugins: z
		.array(
			z.object({
				/** Name of the Starlight plugin. */
				name: z.string(),
				/**
				 * Plugin function called with an object containing various values that can be used by the
				 * plugin to interact with Starlight.
				 */
				plugin: z.function(
					z.tuple([
						z.object({
							/**
							 * A read-only copy of the user-supplied Starlight configuration.
							 *
							 * Note that this configuration may have been updated by other plugins configured
							 * before this one.
							 */
							config: z.any() as z.Schema<StarlightUserConfig>,
							/**
							 * A callback function to update the user-supplied Starlight configuration.
							 *
							 * The provided configuration will be merged with the existing one so you only need
							 * to provide the values you want to update.
							 *
							 * @example
							 * {
							 * 	name: 'My Starlight Plugin',
							 * 	plugin({ updateConfig }) {
							 * 		updateConfig({
							 * 			description: 'Custom description',
							 * 		});
							 * 	}
							 * }
							 */
							updateConfig: z.function(
								z.tuple([z.record(z.any()) as z.Schema<Partial<StarlightUserConfig>>]),
								z.void()
							),
							/**
							 * An instance of the Astro logger with all logged messages prefixed with the plugin name.
							 *
							 * @see https://docs.astro.build/en/reference/integrations-reference/#astrointegrationlogger
							 */
							logger: z.any() as z.Schema<AstroIntegrationLogger>,
						}),
					]),
					z.union([z.void(), z.promise(z.void())])
				),
			})
		)
		.default([]),
});

type StarlightPluginsUserConfig = z.input<typeof starlightPluginsConfigSchema>;

export type StarlightUserConfigWithPlugins = StarlightUserConfig & StarlightPluginsUserConfig;
