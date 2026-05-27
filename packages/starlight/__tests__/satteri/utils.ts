import { createSatteriMarkdownProcessor } from '@astrojs/markdown-satteri';
import type { MarkdownRenderer } from '@astrojs/markdown-remark';
import {
	satteriDirectivesRestoration,
	starlightSatteriPlugins,
} from '../../integrations/satteri';
import type { StarlightUserConfig } from '../../utils/user-config';
import { createPluginTestOptions } from '../test-utils';

/**
 * Build a Sätteri Markdown processor wired up with Starlight's plugin set,
 * mirroring what the integration does in `astro:config:setup` for the
 * `satteri()` processor branch.
 */
export async function createStarlightSatteriProcessor(
	starlightUserConfig?: StarlightUserConfig
): Promise<MarkdownRenderer> {
	const options = await createPluginTestOptions(starlightUserConfig);
	const { mdastPlugins, hastPlugins } = starlightSatteriPlugins(options);
	return createSatteriMarkdownProcessor({
		mdastPlugins: [...mdastPlugins, satteriDirectivesRestoration()],
		hastPlugins,
		features: { directive: true },
	});
}
