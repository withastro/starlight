import { describe, expect, test, vi } from 'vitest';
import { useTranslations } from '../../utils/translations';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		// We do not strip unknown translations in this test so that user-defined translations can
		// override plugin translations like it would in a real- world scenario were the plugin would
		// have provided a custom schema to extend the translations.
		i18n: [['ar', { 'testPlugin3.doThing': 'افعل الشيء' }]],
	})
);

describe('useTranslations()', () => {
	test('includes UI strings injected by plugins for the default locale', () => {
		const t = useTranslations(undefined);
		expect(t).toBeTypeOf('function');
		// Include the default locale strings.
		expect(t('skipLink.label')).toBe('Skip to content');
		// Include a built-in translation overriden by a plugin.
		expect(t('search.label')).toBe('Search the thing');
		// Include a translation injected by a plugin.
		// @ts-expect-error - translation key injected by a test plugin.
		expect(t('testPlugin3.doThing')).toBe('Do the Plugin 3 thing');
	});

	test('includes UI strings injected by plugins', () => {
		const t = useTranslations('fr');
		// Include the default locale strings.
		expect(t('skipLink.label')).toBe('Aller au contenu');
		// Include a built-in translation overriden by a plugin.
		expect(t('search.label')).toBe('Rechercher le truc');
		// Include a translation injected by a plugin.
		// @ts-expect-error - translation key injected by a test plugin.
		expect(t('testPlugin3.doThing')).toBe('Faire la chose du plugin 3');
	});

	test('uses user-defined translations for untranslated strings injected by plugins', () => {
		const t = useTranslations('pt-BR');
		// @ts-expect-error - translation key injected by a test plugin.
		expect(t('testPlugin3.doThing')).toBe('Do the Plugin 3 thing');
	});

	test('prefers user-defined translations over plugin translations', () => {
		const t = useTranslations('ar');
		// @ts-expect-error - translation key injected by a test plugin.
		expect(t('testPlugin3.doThing')).toBe('افعل الشيء');
	});
});
