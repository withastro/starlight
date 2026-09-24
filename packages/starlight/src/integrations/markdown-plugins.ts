import { isSatteriProcessor } from '@astrojs/markdown-satteri';
import type { AstroConfig, AstroIntegration, AstroIntegrationLogger } from 'astro';
import type { MarkdownProcessorPluginOptions } from './markdown-processor';
import { satteriDirectivesRestoration, starlightSatteriPlugins } from './satteri';

// This file is imported by the Starlight integration that is used in Astro configuration files.
// When using Starlight, Astro loads its configuration using a temporary Vite module runner and
// closes it before running integration hooks. If this dynamic import is started later from an
// integration hook, Vite tries to resolve it through that closed runner and throw "Vite module
// runner has been closed".
// We start loading `./remark-rehype` at the top level so Vite waits for it to resolve or fail
// while the config runner is still running. This keeps the Unified integration optional as when
// `@astrojs/markdown-remark` is not installed, importing `./remark-rehype` rejects and we resolve
// it to `null`, which is later used to detect if Unified support is available or not.
export const unifiedIntegration = import('./remark-rehype').catch(() => null);

type UnifiedIntegration = Awaited<typeof unifiedIntegration>;
type MarkdownProcessor = NonNullable<AstroConfig['markdown']['processor']>;

/** Registers Starlight's Markdown transforms, picking the plugin set for the configured engine. */
export function applyStarlightMarkdownPlugins(
	processor: MarkdownProcessor,
	options: MarkdownProcessorPluginOptions,
	unified: UnifiedIntegration,
	logger: Pick<AstroIntegrationLogger, 'warn'>
) {
	if (isSatteriProcessor(processor)) {
		// Starlight's asides are built on container directives, which Sätteri disables by default.
		processor.options.features.directive = true;
		const { mdastPlugins, hastPlugins } = starlightSatteriPlugins(options);
		processor.options.mdastPlugins.push(...mdastPlugins);
		processor.options.hastPlugins.push(...hastPlugins);
	} else if (unified?.isUnifiedProcessor(processor)) {
		processor.options.remarkPlugins.push(...unified.starlightRemarkPlugins(options));
		processor.options.rehypePlugins.push(...unified.starlightRehypePlugins(options));
	} else {
		logger.warn(
			`The configured \`markdown.processor\` ("${processor.name}") is not supported by Starlight. ` +
				"Starlight's Markdown transforms (asides, heading anchor links, RTL code support) won't run on your content. " +
				'Switch to `satteri()` from `@astrojs/markdown-satteri` or `unified()` from `@astrojs/markdown-remark`.'
		);
	}
}

/** Registers the directive-restoration plugin. */
export function registerDirectivesRestoration(
	processor: MarkdownProcessor,
	unified: UnifiedIntegration
) {
	if (isSatteriProcessor(processor)) {
		processor.options.mdastPlugins.push(satteriDirectivesRestoration());
	} else if (unified?.isUnifiedProcessor(processor)) {
		processor.options.remarkPlugins.push(unified.remarkDirectivesRestoration);
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
				const unified = await unifiedIntegration;
				registerDirectivesRestoration(config.markdown?.processor, unified);
			},
		},
	};
}
