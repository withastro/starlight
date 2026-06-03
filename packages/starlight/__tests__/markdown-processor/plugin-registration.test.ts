import { unified } from '@astrojs/markdown-remark';
import { satteri } from '@astrojs/markdown-satteri';
import { describe, expect, test, vi } from 'vitest';
import { remarkDirectivesRestoration } from '../../integrations/asides';
import {
	applyStarlightMarkdownPlugins,
	registerDirectivesRestoration,
} from '../../integrations/markdown-plugins';
import * as satteriIntegration from '../../integrations/satteri';
import { createPluginTestOptions } from '../test-utils';

type Processor = Parameters<typeof applyStarlightMarkdownPlugins>[0];

const unsupportedProcessor = { name: 'markdoc', options: {} } as unknown as Processor;

describe('applyStarlightMarkdownPlugins', () => {
	test('enables container directives and pushes mdast/hast plugins for a Sätteri processor', async () => {
		const processor = satteri();
		const logger = { warn: vi.fn() };

		const usesProcessor = applyStarlightMarkdownPlugins(
			processor,
			await createPluginTestOptions(),
			satteriIntegration,
			logger
		);

		expect(usesProcessor).toBe(true);
		expect(processor.options.features.directive).toBe(true);
		expect(processor.options.mdastPlugins.length).toBeGreaterThan(0);
		expect(processor.options.hastPlugins.length).toBeGreaterThan(0);
		expect(logger.warn).not.toHaveBeenCalled();
	});

	test('pushes remark/rehype plugins for a unified processor', async () => {
		const processor = unified();
		const logger = { warn: vi.fn() };

		const usesProcessor = applyStarlightMarkdownPlugins(
			processor,
			await createPluginTestOptions(),
			satteriIntegration,
			logger
		);

		expect(usesProcessor).toBe(true);
		expect(processor.options.remarkPlugins.length).toBeGreaterThan(0);
		expect(processor.options.rehypePlugins.length).toBeGreaterThan(0);
		expect(logger.warn).not.toHaveBeenCalled();
	});

	test('warns for an unsupported processor without touching the legacy keys', async () => {
		const logger = { warn: vi.fn() };

		const usesProcessor = applyStarlightMarkdownPlugins(
			unsupportedProcessor,
			await createPluginTestOptions(),
			satteriIntegration,
			logger
		);

		expect(usesProcessor).toBe(true);
		expect(logger.warn).toHaveBeenCalledOnce();
		expect(logger.warn.mock.calls[0]?.[0]).toContain('is not supported by Starlight');
	});

	test('warns when a Sätteri processor is configured but the integration is unavailable', async () => {
		const logger = { warn: vi.fn() };

		const usesProcessor = applyStarlightMarkdownPlugins(
			satteri(),
			await createPluginTestOptions(),
			null,
			logger
		);

		expect(usesProcessor).toBe(true);
		expect(logger.warn).toHaveBeenCalledOnce();
	});

	test('falls back to the legacy config keys when no processor is configured', async () => {
		const logger = { warn: vi.fn() };

		const usesProcessor = applyStarlightMarkdownPlugins(
			undefined,
			await createPluginTestOptions(),
			satteriIntegration,
			logger
		);

		expect(usesProcessor).toBe(false);
		expect(logger.warn).not.toHaveBeenCalled();
	});
});

describe('registerDirectivesRestoration', () => {
	test('registers the mdast restoration plugin on a Sätteri processor', () => {
		const processor = satteri();
		expect(registerDirectivesRestoration(processor, satteriIntegration)).toBe(true);
		expect(processor.options.mdastPlugins.map((plugin) => plugin.name)).toContain(
			'starlight-directives-restoration'
		);
	});

	test('registers the remark restoration plugin on a unified processor', () => {
		const processor = unified();
		expect(registerDirectivesRestoration(processor, satteriIntegration)).toBe(true);
		expect(processor.options.remarkPlugins).toContain(remarkDirectivesRestoration);
	});

	test('returns false for an unsupported processor', () => {
		expect(registerDirectivesRestoration(unsupportedProcessor, satteriIntegration)).toBe(false);
	});

	test('returns false when no processor is configured', () => {
		expect(registerDirectivesRestoration(undefined, satteriIntegration)).toBe(false);
	});
});
