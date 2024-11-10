import { describe, expect, test, vi } from 'vitest';
import config from 'virtual:starlight/user-config';
import { useTranslations } from '../../utils/translations';
import { runPlugins } from '../../utils/plugins';
import { createTestPluginContext } from '../test-plugin-utils';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		// We do not strip unknown translations in this test so that user-defined translations can
		// override plugin translations like it would in a real- world scenario were the plugin would
		// have provided a custom schema to extend the translations.
		i18n: [['ar', { 'testPlugin3.doThing': 'افعل الشيء' }]],
	})
);

describe('can access UI string in an Astro context', () => {
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

test('can access UI strings in the plugin context using useTranslations()', () => {
	const { uiStrings } = JSON.parse(config.titleDelimiter);

	// A built-in UI string.
	expect(uiStrings[0]).toBe('Skip to content');
	// A built-in UI string overriden by a plugin.
	expect(uiStrings[1]).toBe('Rechercher le truc');
	// A UI string injected by a plugin.
	expect(uiStrings[2]).toBe('Do the Plugin 3 thing');
});

test('can infer langs from an absolute path in the plugin context using absolutePathToLang()', () => {
	const { langs } = JSON.parse(config.titleDelimiter);

	// The default language.
	expect(langs[0]).toBe('en');
	// A language with a regional subtag.
	expect(langs[1]).toBe('pt-BR');
	// A page not matching any language defaults to the default language.
	expect(langs[2]).toBe('en');
});

test('throws when using absolutePathToLang() with a path that is not absolute and in the docs directory', async () => {
	expect.assertions(2);

	await runPlugins(
		{ title: 'Test Docs' },
		[
			{
				name: 'test-plugin',
				hooks: {
					'config:setup'({ absolutePathToLang }) {
						expect(() => absolutePathToLang(new URL('../src/index.md', import.meta.url).pathname))
							.toThrowErrorMatchingInlineSnapshot(`
							"[AstroUserError]:
								Invalid file path: /Users/hideo/Temp/starlight/refactor-inject-translations/starlight/packages/starlight/__tests__/src/index.md
							Hint:
								The \`absolutePathToLang()\` function can only be used with absolute paths for files in the docs directory.
								Learn more about \`absolutePathToLang()\` at https://starlight.astro.build/reference/plugins/#absolutepathtolang"
						`);
						expect(() => absolutePathToLang('en/index.md')).toThrowErrorMatchingInlineSnapshot(`
							"[AstroUserError]:
								Invalid file path: /en/index.md
							Hint:
								The \`absolutePathToLang()\` function can only be used with absolute paths for files in the docs directory.
								Learn more about \`absolutePathToLang()\` at https://starlight.astro.build/reference/plugins/#absolutepathtolang"
						`);
					},
				},
			},
		],
		createTestPluginContext()
	);
});
