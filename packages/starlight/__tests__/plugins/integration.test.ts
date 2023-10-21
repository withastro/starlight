import type { AstroIntegration } from 'astro';
import { expect, test } from 'vitest';
import { runPlugins } from '../../utils/plugins';
import { TestAstroIntegrationLogger } from '../test-config';

test('returns all integrations added by plugins without deduping them', async () => {
	const integration1: AstroIntegration = {
		name: 'test-integration-1',
		hooks: {},
	};

	const integration2: AstroIntegration = {
		name: 'test-integration-2',
		hooks: {},
	};

	const { integrations } = await runPlugins(
		{
			title: 'Test Docs',
			plugins: [
				{
					name: 'test-plugin-1',
					plugin({ addIntegration }) {
						addIntegration(integration1);
					},
				},
				{
					name: 'test-plugin-1',
					plugin({ addIntegration }) {
						addIntegration(integration1);
						addIntegration(integration2);
					},
				},
			],
		},
		new TestAstroIntegrationLogger()
	);

	expect(integrations).toMatchObject([
		{ name: 'test-integration-1' },
		{ name: 'test-integration-1' },
		{ name: 'test-integration-2' },
	]);
});
