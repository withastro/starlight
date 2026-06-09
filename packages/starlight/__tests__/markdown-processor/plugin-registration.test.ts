import { unified } from '@astrojs/markdown-remark';
import { satteri } from '@astrojs/markdown-satteri';
import { describe, expect, test, vi } from 'vitest';
import { remarkDirectivesRestoration } from '../../integrations/asides';
import {
	applyStarlightMarkdownPlugins,
	registerDirectivesRestoration,
} from '../../integrations/markdown-plugins';
import { createPluginTestOptions } from '../test-utils';

type Processor = Parameters<typeof applyStarlightMarkdownPlugins>[0];

const unsupportedProcessor = { name: 'markdoc', options: {} } as unknown as Processor;

describe('applyStarlightMarkdownPlugins', () => {
	test('enables container directives and pushes mdast/hast plugins for a Sätteri processor', async () => {
		const processor = satteri();
		const logger = { warn: vi.fn() };

		await applyStarlightMarkdownPlugins(processor, await createPluginTestOptions(), logger);

		expect(processor.options.features.directive).toBe(true);
		expect(processor.options.mdastPlugins.length).toBeGreaterThan(0);
		expect(processor.options.hastPlugins.length).toBeGreaterThan(0);
		expect(logger.warn).not.toHaveBeenCalled();
	});

	test('pushes remark/rehype plugins for a unified processor', async () => {
		const processor = unified();
		const logger = { warn: vi.fn() };

		await applyStarlightMarkdownPlugins(processor, await createPluginTestOptions(), logger);

		expect(processor.options.remarkPlugins.length).toBeGreaterThan(0);
		expect(processor.options.rehypePlugins.length).toBeGreaterThan(0);
		expect(logger.warn).not.toHaveBeenCalled();
	});

	test('warns for an unsupported or unavailable processor', async () => {
		const logger = { warn: vi.fn() };

		await applyStarlightMarkdownPlugins(
			unsupportedProcessor,
			await createPluginTestOptions(),
			logger
		);

		expect(logger.warn).toHaveBeenCalledOnce();
		expect(logger.warn.mock.calls[0]?.[0]).toContain('is not supported by Starlight');
	});
});

describe('registerDirectivesRestoration', () => {
	test('registers the mdast restoration plugin on a Sätteri processor', async () => {
		const processor = satteri();
		await registerDirectivesRestoration(processor);
		expect(processor.options.mdastPlugins.map((plugin) => plugin.name)).toContain(
			'starlight-directives-restoration'
		);
	});

	test('registers the remark restoration plugin on a unified processor', async () => {
		const processor = unified();
		await registerDirectivesRestoration(processor);
		expect(processor.options.remarkPlugins).toContain(remarkDirectivesRestoration);
	});
});
