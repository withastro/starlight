import { describe, expect, test, vi } from 'vitest';
import { useTranslations } from '../../utils/translations';
import translations from '../../translations';

describe('useTranslations()', () => {
	test('includes localized UI strings', () => {
		const t = useTranslations(undefined);
		expect(t).toBeTypeOf('function');
		expect(t('skipLink.label')).toBe('Skip to content');
	});
});

describe('t()', async () => {
	// The mocked user-defined translations are scoped to this `describe` block so that they do not
	// affect other tests (`vi.mock` → `vi.doMock`).
	vi.doMock('astro:content', async () =>
		(await import('../test-utils')).mockedAstroContent({
			i18n: [
				[
					'en',
					{
						'test.interpolation': '{{subject}} is {{adjective}}',
						'test.dataModel': 'Powered by {{integration.name}}',
						'test.escape': 'The tag is {{tag}}',
						'test.unescape': 'The tag is {{- tag}}',
						'test.currency': 'The price is {{price, currency(USD)}}',
						'test.list': '{{subjects, list}} are awesome',
						'test.count_one': '{{count}} project',
						'test.count_other': '{{count}} projects',
						'test.nesting1': '$t(test.nesting2) is nested',
						'test.nesting2': 'this UI string',
					},
				],
			],
		})
	);
	// Reset the modules registry so that re-importing `../../utils/translations` re-evaluates the
	// module and re-computes `useTranslations`. Re-importing the module is necessary because
	// top-level imports cannot be re-evaluated.
	vi.resetModules();
	const { useTranslations } = await import('../../utils/translations');
	const t = useTranslations(undefined);

	test('supports using interpolation', () => {
		expect(t).toBeTypeOf('function');
		// @ts-expect-error - using a mocked translation key.
		expect(t('test.interpolation', { subject: 'Starlight', adjective: 'amazing' })).toBe(
			'Starlight is amazing'
		);
	});

	test('supports using data models', () => {
		expect(t).toBeTypeOf('function');
		// @ts-expect-error - using a mocked translation key.
		expect(t('test.dataModel', { integration: { name: 'Starlight' } })).toBe(
			'Powered by Starlight'
		);
	});

	test('escapes by default', () => {
		expect(t).toBeTypeOf('function');
		// @ts-expect-error - using a mocked translation key.
		expect(t('test.escape', { tag: '<img />' })).toBe('The tag is &lt;img &#x2F;&gt;');
	});

	test('supports unescaped strings', () => {
		expect(t).toBeTypeOf('function');
		// @ts-expect-error - using a mocked translation key.
		expect(t('test.unescape', { tag: '<img />' })).toBe('The tag is <img />');
	});

	test('supports currencies', () => {
		expect(t).toBeTypeOf('function');
		// @ts-expect-error - using a mocked translation key.
		expect(t('test.currency', { price: 1000 })).toBe('The price is $1,000.00');
	});

	test('supports lists', () => {
		expect(t).toBeTypeOf('function');
		// @ts-expect-error - using a mocked translation key.
		expect(t('test.list', { subjects: ['Astro', 'Starlight', 'Astro DB'] })).toBe(
			'Astro, Starlight, and Astro DB are awesome'
		);
	});

	test('supports counts', () => {
		expect(t).toBeTypeOf('function');
		// @ts-expect-error - using a mocked translation key.
		expect(t('test.count', { count: 1 })).toBe('1 project');
		// @ts-expect-error - using a mocked translation key.
		expect(t('test.count', { count: 20 })).toBe('20 projects');
	});

	test('supports nesting', () => {
		expect(t).toBeTypeOf('function');
		// @ts-expect-error - using a mocked translation key.
		expect(t('test.nesting1')).toBe('this UI string is nested');
	});

	test('returns the UI string key if the translation is missing', () => {
		expect(t).toBeTypeOf('function');
		// @ts-expect-error - using a missing translation key.
		expect(t('test.unknown')).toBe('test.unknown');
	});
});

describe('t.all()', async () => {
	// See the `t()` tests for an explanation of how the user-defined translations are mocked.
	vi.doMock('astro:content', async () =>
		(await import('../test-utils')).mockedAstroContent({
			i18n: [['en', { 'test.foo': 'bar' }]],
		})
	);
	vi.resetModules();
	const { useTranslations } = await import('../../utils/translations');
	const t = useTranslations(undefined);

	test('returns all translations including custom ones', () => {
		expect(t.all).toBeTypeOf('function');
		expect(t.all()).toEqual({ ...translations.en, 'test.foo': 'bar' });
	});
});

describe('t.exists()', async () => {
	// See the `t()` tests for an explanation of how the user-defined translations are mocked.
	vi.doMock('astro:content', async () =>
		(await import('../test-utils')).mockedAstroContent({
			i18n: [['en', { 'test.foo': 'bar' }]],
		})
	);
	vi.resetModules();
	const { useTranslations } = await import('../../utils/translations');
	const t = useTranslations(undefined);

	test('returns `true` for existing translations', () => {
		expect(t.exists).toBeTypeOf('function');
		expect(t.exists('skipLink.label')).toBe(true);
		expect(t.exists('test.foo')).toBe(true);
	});

	test('returns `false` for unknown translations', () => {
		expect(t.exists).toBeTypeOf('function');
		expect(t.exists('test.unknown')).toBe(false);
	});
});
