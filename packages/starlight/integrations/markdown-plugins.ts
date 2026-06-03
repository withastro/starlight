import { isUnifiedProcessor } from '@astrojs/markdown-remark';
import type { AstroConfig, AstroIntegration, AstroIntegrationLogger } from 'astro';
import { remarkDirectivesRestoration } from './asides';
import type { MarkdownProcessorPluginOptions } from './markdown-process';
import { starlightRehypePlugins, starlightRemarkPlugins } from './remark-rehype';

// `@astrojs/markdown-satteri` is an optional peer dependency, so its integration is loaded lazily.
// The import is started here, at module evaluation, while Astro's config module runner is still
// alive — a dynamic `import()` of this relative module from inside `astro:config:setup` fails with
// "Vite module runner has been closed". When the optional dependency is absent, the import rejects
// and Sätteri support is simply unavailable.
export const satteriIntegration = import('./satteri').catch(() => null);

type SatteriIntegration = Awaited<typeof satteriIntegration>;
type MarkdownProcessor = NonNullable<AstroConfig['markdown']['processor']>;

/**
 * Registers Starlight's Markdown transforms on the Astro 6.4+ `markdown.processor`, picking the
 * plugin set for the configured engine. Returns `false` when no processor is configured (Astro
 * 6.0–6.3) so the caller falls back to the legacy `markdown.{remark,rehype}Plugins` keys.
 */
export function applyStarlightMarkdownPlugins(
	processor: MarkdownProcessor | undefined,
	options: MarkdownProcessorPluginOptions,
	satteri: SatteriIntegration,
	logger: Pick<AstroIntegrationLogger, 'warn'>
): boolean {
	if (!processor) return false;
	if (processor.name === 'satteri' && satteri?.isSatteriProcessor(processor)) {
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
	return true;
}

/**
 * Registers the directive-restoration plugin on the Astro 6.4+ `markdown.processor`. Returns `false`
 * when there is no processor to register it on (Astro 6.0–6.3, or an unsupported processor) so the
 * caller can fall back to the legacy `markdown.remarkPlugins` key.
 */
export function registerDirectivesRestoration(
	processor: MarkdownProcessor | undefined,
	satteri: SatteriIntegration
): boolean {
	if (processor?.name === 'satteri' && satteri?.isSatteriProcessor(processor)) {
		processor.options.mdastPlugins.push(satteri.satteriDirectivesRestoration());
		return true;
	}
	if (processor && isUnifiedProcessor(processor)) {
		processor.options.remarkPlugins.push(remarkDirectivesRestoration);
		return true;
	}
	return false;
}

/**
 * Run directive-restoration last so plugins added by Starlight plugins (via their own Astro
 * integrations) get to handle text/leaf directives first.
 */
export function starlightDirectivesRestorationIntegration(): AstroIntegration {
	return {
		name: 'starlight-directives-restoration',
		hooks: {
			'astro:config:setup': async ({ config, updateConfig }) => {
				const satteri = await satteriIntegration;
				if (registerDirectivesRestoration(config.markdown?.processor, satteri)) return;
				// Astro 6.0–6.3: no `processor` field, register through the legacy key.
				updateConfig({
					markdown: {
						remarkPlugins: [remarkDirectivesRestoration],
					},
				});
			},
		},
	};
}
