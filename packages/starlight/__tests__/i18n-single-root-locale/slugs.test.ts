import { describe, expect, test } from 'vitest';
import { localeToLang, localizedId, localizedSlug, slugToLocaleData } from '../../utils/slugs';

describe('slugToLocaleData', () => {
	test('returns an undefined locale for root locale slugs', () => {
		expect(slugToLocaleData('test').locale).toBeUndefined();
		expect(slugToLocaleData('dir/test').locale).toBeUndefined();
	});
	test('returns default locale "fr" lang', () => {
		expect(slugToLocaleData('test').lang).toBe('fr-CA');
		expect(slugToLocaleData('dir/test').lang).toBe('fr-CA');
	});
	test('returns default locale "ltr" dir', () => {
		expect(slugToLocaleData('test').dir).toBe('ltr');
		expect(slugToLocaleData('dir/test').dir).toBe('ltr');
	});
});

describe('localeToLang', () => {
	test('returns lang for default locale', () => {
		expect(localeToLang(undefined)).toBe('fr-CA');
	});
});

describe('localizedId', () => {
	test('returns unchanged for default locale', () => {
		expect(localizedId('test.md', undefined)).toBe('test.md');
	});
});

describe('localizedSlug', () => {
	test('returns unchanged for default locale', () => {
		expect(localizedSlug('test', undefined)).toBe('test');
		expect(localizedSlug('dir/test', undefined)).toBe('dir/test');
	});
});
