import type { AstroConfig, AstroIntegrationLogger } from 'astro';
import { type StarlightPluginContext } from '../utils/plugins';

export function createTestPluginContext(
	config?: Partial<Pick<AstroConfig, 'i18n' | 'srcDir'>>
): StarlightPluginContext {
	return {
		command: 'dev',
		// @ts-expect-error - we don't provide a full Astro config but only what is needed for the
		// plugins to run.
		config: { srcDir: new URL('./src/', import.meta.url), integrations: [], ...config },
		isRestart: false,
		logger: new TestAstroIntegrationLogger(),
	};
}

export class TestAstroIntegrationLogger {
	options = {} as AstroIntegrationLogger['options'];
	constructor(public label = 'test-integration-logger') {}
	fork = (label: string) => new TestAstroIntegrationLogger(label);
	info = () => undefined;
	warn = () => undefined;
	error = () => undefined;
	debug = () => undefined;
	flush = () => undefined;
	close = () => undefined;
}
