import { describe, expect, test } from 'vitest';
import translations from '../../translations';
import { useTranslations } from '../../utils/translations';

describe('built-in translations', () => {
	test('includes English', () => {
		expect(translations).toHaveProperty('en');
	});
});

describe('useTranslations()', () => {
	test('works when no i18n collection is available', async () => {
		const t = useTranslations(undefined);
		expect(t).toBeTypeOf('function');
		expect(t('page.editLink')).toBe((await translations.en?.())?.['page.editLink']);
	});

	test('returns default locale for unknown language', async () => {
		const locale = 'xx';
		expect(translations).not.toHaveProperty(locale);
		const t = useTranslations(locale);
		expect(t('page.editLink')).toBe((await translations.en?.())?.['page.editLink']);
	});

	test('uses built-in translations for regional variants', async () => {
		const t = useTranslations('pt-BR');
		expect(t('page.nextLink')).toBe((await translations.pt?.())?.['page.nextLink']);
		expect(t('page.nextLink')).not.toBe((await translations.en?.())?.['page.nextLink']);
	});
});

describe('t.dir()', () => {
	test('returns text directions', () => {
		expect(useTranslations(undefined).dir()).toBe('ltr');
		expect(useTranslations('fr').dir()).toBe('ltr');
		expect(useTranslations('ar').dir()).toBe('rtl');
	});
});
