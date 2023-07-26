import { describe, expect, test, vi } from 'vitest';
import translations from '../../translations';
import { useTranslations } from '../../utils/translations';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		i18n: [['en', { 'page.editLink': 'Modify this doc!' }]],
	})
);

describe('useTranslations()', () => {
	test('uses user-defined translations', () => {
		const t = useTranslations(undefined);
		expect(t('page.editLink')).toBe('Modify this doc!');
		expect(t('page.editLink')).not.toBe(translations.en?.['page.editLink']);
	});
});
