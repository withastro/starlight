import { createMarkdownProcessor, type MarkdownRenderer } from '@astrojs/markdown-remark';
import { createSatteriMarkdownProcessor } from '@astrojs/markdown-satteri';
import { beforeAll, describe } from 'vitest';
import { remarkDirectivesRestoration } from '../../integrations/remark-asides';
import { starlightRehypePlugins, starlightRemarkPlugins } from '../../integrations/remark-rehype';
import { satteriDirectivesRestoration, starlightSatteriPlugins } from '../../integrations/satteri';
import type { StarlightUserConfig } from '../../utils/user-config';
import { createPluginTestOptions, docFileURL } from '../test-utils';

/**
 * The Markdown processors Starlight supports. The same Starlight transforms (asides, heading anchor
 * links, RTL code support, directive restoration) run on both, so the shared test suites below run
 * against each of them via {@link describeEachProcessor}.
 */
export const processorNames = ['unified', 'satteri'] as const;
export type ProcessorName = (typeof processorNames)[number];

export async function createStarlightMarkdownProcessor(
	name: ProcessorName,
	config?: StarlightUserConfig,
	{ syntaxHighlight }: { syntaxHighlight?: false } = {}
): Promise<MarkdownRenderer> {
	const options = await createPluginTestOptions(config);
	if (name === 'satteri') {
		const { mdastPlugins, hastPlugins } = starlightSatteriPlugins(options);
		return createSatteriMarkdownProcessor({
			mdastPlugins: [...mdastPlugins, satteriDirectivesRestoration()],
			hastPlugins,
			// Starlight's asides rely on container directives, which Sätteri disables by default.
			features: { directive: true },
			...(syntaxHighlight === false ? { syntaxHighlight: false } : {}),
		});
	}
	return createMarkdownProcessor({
		...(syntaxHighlight === false ? { syntaxHighlight: false } : {}),
		remarkPlugins: [
			...starlightRemarkPlugins(options),
			// The restoration plugin runs after the asides and any other plugin a Starlight plugin
			// may have injected.
			remarkDirectivesRestoration,
		],
		rehypePlugins: [...starlightRehypePlugins(options)],
	});
}

/** A processor bound with a convenient `render()` for a single test suite. */
export interface ProcessorContext {
	name: ProcessorName;
	processor: MarkdownRenderer;
	render(
		content: string,
		options?: { fileURL?: URL; processor?: MarkdownRenderer }
	): ReturnType<MarkdownRenderer['render']>;
	/** Path to a per-processor snapshot file, e.g. `./snapshots/unified/generates-aside.html`. */
	snapshot(name: string): string;
}

async function createProcessorContext(
	name: ProcessorName,
	config?: StarlightUserConfig
): Promise<ProcessorContext> {
	const processor = await createStarlightMarkdownProcessor(name, config);
	return {
		name,
		processor,
		render: (content, options = {}) =>
			(options.processor ?? processor).render(content, {
				fileURL: options.fileURL ?? docFileURL(),
			}),
		snapshot: (snapshotName) => `./snapshots/${name}/${snapshotName}`,
	};
}

/**
 * Run a suite of tests against every supported Markdown processor. The callback receives a getter
 * for the per-processor {@link ProcessorContext} (lazily created once per processor) so each test
 * renders through the matching engine and reads per-processor snapshots.
 */
export function describeEachProcessor(
	suite: string,
	body: (getContext: () => ProcessorContext, name: ProcessorName) => void,
	{ config }: { config?: StarlightUserConfig } = {}
) {
	describe.each(processorNames)(`${suite} (%s)`, (name) => {
		let context: ProcessorContext;
		beforeAll(async () => {
			context = await createProcessorContext(name, config);
		});
		body(() => context, name);
	});
}

// Re-exported so test files only need to import from this module.
export { docFileURL, nonDocFileURL } from '../test-utils';
