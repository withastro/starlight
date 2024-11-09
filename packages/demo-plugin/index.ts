import type { StarlightPlugin } from '@astrojs/starlight/types';
import { Translations } from './translations';

export default function starlightDemoPlugin(): StarlightPlugin {
	return {
		name: 'starlight-demo-plugin',
		hooks: {
			'i18n:setup'({ injectTranslations }) {
				injectTranslations(Translations);
			},
			'config:setup'({ logger, useTranslations }) {
				logger.info('Built-in translations:');
				console.table([
					{ key: 'skipLink.label', lang: 'en', value: useTranslations('en')('skipLink.label') },
					{ key: 'skipLink.label', lang: 'fr', value: useTranslations('fr')('skipLink.label') },
					{
						key: 'skipLink.label',
						lang: 'zh-CN',
						value: useTranslations('zh-CN')('skipLink.label'),
					},
					{
						key: 'skipLink.label',
						lang: 'unknown',
						value: useTranslations('unknown')('skipLink.label'),
					},
				]);
				console.log();

				logger.info('User defined translations:');
				console.table([
					{
						key: 'component.preview',
						lang: 'en',
						// User defined translation unknown to the type system.
						value: useTranslations('en')('component.preview'),
					},
					{
						key: 'component.preview',
						lang: 'fr',
						// User defined translation unknown to the type system.
						value: useTranslations('fr')('component.preview'),
					},
					{
						key: 'component.preview',
						lang: 'zh-CN',
						// User defined translation unknown to the type system.
						value: useTranslations('zh-CN')('component.preview'),
					},
					{
						key: 'component.preview',
						lang: 'unknown',
						// User defined translation unknown to the type system.
						value: useTranslations('unknown')('component.preview'),
					},
				]);
				console.log();

				logger.info('Plugin injected translations:');
				console.table([
					{ key: 'demo.test', lang: 'en', value: useTranslations('en')('demo.test') },
					{ key: 'demo.test', lang: 'fr', value: useTranslations('fr')('demo.test') },
					{ key: 'demo.test', lang: 'zh-CN', value: useTranslations('zh-CN')('demo.test') },
					{ key: 'demo.test', lang: 'unknown', value: useTranslations('unknown')('demo.test') },
				]);
				console.log();

				logger.info(
					`t.exists('skipLink.label'): ${useTranslations('en').exists('skipLink.label')}`
				);
				logger.info(`t.exists('unknown'): ${useTranslations('en').exists('unknown')}`);
				console.log();
			},
		},
	};
}
