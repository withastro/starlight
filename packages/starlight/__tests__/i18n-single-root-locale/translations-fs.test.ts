import { describe, expect, test } from 'vitest';
import { createTranslationSystemFromFs } from '../../utils/translations-fs';

describe('createTranslationSystemFromFs', () => {
	test('creates a translation system that returns default strings', async () => {
		const useTranslations = await createTranslationSystemFromFs(
			{
				locales: undefined,
				defaultLocale: { label: 'Français', locale: 'fr', dir: 'ltr' },
			},
			// Using non-existent `_src/` to ignore custom files in this test fixture.
			{ srcDir: new URL('./_src/', import.meta.url) }
		);
		const t = useTranslations('fr');
		expect(t('page.editLink')).toMatchInlineSnapshot('"Modifier cette page"');
	});

	test('creates a translation system that uses custom strings', async () => {
		const useTranslations = await createTranslationSystemFromFs(
			{
				locales: undefined,
				defaultLocale: { label: 'Français', locale: 'fr', dir: 'ltr' },
			},
			// Using `src/` to load custom files in this test fixture.
			{ srcDir: new URL('./src/', import.meta.url) }
		);
		const t = useTranslations('fr');
		expect(t('page.editLink')).toMatchInlineSnapshot('"Changer cette page"');
	});

	test('returns translation for unknown language', async () => {
		const useTranslations = await createTranslationSystemFromFs(
			{
				locales: undefined,
				defaultLocale: { label: 'Français', locale: 'fr', dir: 'ltr' },
			},
			// Using `src/` to load custom files in this test fixture.
			{ srcDir: new URL('./src/', import.meta.url) }
		);
		const t = useTranslations('ar');
		expect(t('page.editLink')).toMatchInlineSnapshot('"Changer cette page"');
	});
});
