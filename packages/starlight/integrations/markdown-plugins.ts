import { isUnifiedProcessor } from '@astrojs/markdown-remark';
import type { AstroConfig, AstroIntegration, AstroIntegrationLogger } from 'astro';
import { remarkDirectivesRestoration } from './asides';
import type { MarkdownProcessorPluginOptions } from './markdown-process';
import { starlightRehypePlugins, starlightRemarkPlugins } from './remark-rehype';

// For some reason, trying to `await import("./satteri")` in the integration module causes a Vite
// error about the module runner being closed. This shape works, not sure why!
export const satteriIntegration = import('./satteri').catch(() => null);

type SatteriIntegration = Awaited<typeof satteriIntegration>;
type MarkdownProcessor = NonNullable<AstroConfig['markdown']['processor']>;

/** Registers Starlight's Markdown transforms, picking the plugin set for the configured engine. */
export function applyStarlightMarkdownPlugins(
	processor: MarkdownProcessor,
	options: MarkdownProcessorPluginOptions,
	satteri: SatteriIntegration,
	logger: Pick<AstroIntegrationLogger, 'warn'>
) {
	if (satteri?.isSatteriProcessor(processor)) {
		// Starlight's asides are built on container directives, which Sätteri disables by default.
		processor.options.features.directive = true;
		const { mdastPlugins, hastPlugins } = satteri.starlightSatteriPlugins(options);
		processor.options.mdastPlugins.push(...mdastPlugins);
		processor.options.hastPlugins.push(...hastPlugins);
	} else if (isUnifiedProcessor(processor)) {
		processor.options.remarkPlugins.push(...starlightRemarkPlugins(options));
		processor.options.rehypePlugins.push(...starlightRehypePlugins(options));
	} else {
		logger.warn(
			`The configured \`markdown.processor\` ("${processor.name}") is not supported by Starlight. ` +
				"Starlight's Markdown transforms (asides, heading anchor links, RTL code support) won't run on your content. " +
				'Switch to `unified()` from `@astrojs/markdown-remark` or `satteri()` from `@astrojs/markdown-satteri`.'
		);
	}
}

/** Registers the directive-restoration plugin. */
export function registerDirectivesRestoration(
	processor: MarkdownProcessor,
	satteri: SatteriIntegration
) {
	if (satteri?.isSatteriProcessor(processor)) {
		processor.options.mdastPlugins.push(satteri.satteriDirectivesRestoration());
	} else if (isUnifiedProcessor(processor)) {
		processor.options.remarkPlugins.push(remarkDirectivesRestoration);
	}
}

/**
 * Run directive-restoration last so plugins added by Starlight plugins (via their own Astro
 * integrations) get to handle text/leaf directives first.
 */
export function starlightDirectivesRestorationIntegration(): AstroIntegration {
	return {
		name: 'starlight-directives-restoration',
		hooks: {
			'astro:config:setup': async ({ config }) => {
				const satteri = await satteriIntegration;
				registerDirectivesRestoration(config.markdown?.processor, satteri);
			},
		},
	};
}
