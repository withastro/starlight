import { describe, expect, test } from 'vitest';
import translations from '../../src/translations';
import { useTranslations } from '../../src/utils/translations';

describe('built-in translations', () => {
	test('includes French', () => {
		expect(translations).toHaveProperty('fr');
	});
});

describe('useTranslations()', () => {
	test('works when no i18n collection is available', () => {
		const t = useTranslations('fr');
		expect(t).toBeTypeOf('function');
		expect(t('page.editLink')).toBe(translations.fr?.['page.editLink']);
	});

	test('returns default locale for unknown language', () => {
		const locale = 'xx';
		expect(translations).not.toHaveProperty(locale);
		const t = useTranslations(locale);
		expect(t('page.editLink')).toBe(translations.fr?.['page.editLink']);
	});
});
