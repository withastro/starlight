import { describe, expect, test } from 'vitest';
import { createTranslationSystemFromFs } from '../../utils/translations-fs';

describe('createTranslationSystemFromFs', () => {
	test('creates a translation system that returns default strings', () => {
		const useTranslations = createTranslationSystemFromFs(
			{
				locales: { en: { label: 'English', dir: 'ltr' } },
				defaultLocale: { label: 'English', locale: 'en', dir: 'ltr' },
			},
			// Using non-existent `_src/` to ignore custom files in this test fixture.
			{ srcDir: new URL('./_src/', import.meta.url) }
		);
		const t = useTranslations('en');
		expect(t('page.editLink')).toMatchInlineSnapshot('"Edit page"');
	});

	test('creates a translation system that uses custom strings', () => {
		const useTranslations = createTranslationSystemFromFs(
			{
				locales: { en: { label: 'English', dir: 'ltr' } },
				defaultLocale: { label: 'English', locale: 'en', dir: 'ltr' },
			},
			// Using `src/` to load custom files in this test fixture.
			{ srcDir: new URL('./src/', import.meta.url) }
		);
		const t = useTranslations('en');
		expect(t('page.editLink')).toMatchInlineSnapshot('"Make this page different"');
	});
});
