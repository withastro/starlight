import { describe, expect, test, vi } from 'vitest';
import translations from '../../src/translations';
import { useTranslations } from '../../src/utils/translations';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		i18n: [
			['en-US', { 'page.editLink': 'Modify this doc!', 'test.empty': 'Fallback string' }],
			['pt-BR', { 'page.editLink': 'Modifique esse doc!', 'test.empty': '' }],
		],
	})
);

describe('useTranslations()', () => {
	test('uses user-defined translations', () => {
		const t = useTranslations(undefined);
		expect(t('page.editLink')).toBe('Modify this doc!');
		expect(t('page.editLink')).not.toBe(translations.en?.['page.editLink']);
	});

	test('uses user-defined regional translations when available', () => {
		const t = useTranslations('pt-BR');
		expect(t('page.editLink')).toBe('Modifique esse doc!');
		expect(t('page.editLink')).not.toBe(translations.pt?.['page.editLink']);
	});

	test('falls back to default language if the translation is an empty string', () => {
		const t = useTranslations('pt-BR');
		// @ts-expect-error — Using a custom key from the mocked content which isn’t reflected in types.
		expect(t('test.empty')).toBe('Fallback string');
	});
});
