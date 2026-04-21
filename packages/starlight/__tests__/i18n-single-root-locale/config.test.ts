import config from 'virtual:starlight/user-config';
import { expect, test } from 'vitest';

test('test suite is using correct env', () => {
	expect(config.title).toMatchObject({ 'fr-CA': 'i18n with a single root locale' });
});

test('config.isMultilingual is false with a single root locale', () => {
	expect(config.isMultilingual).toBe(false);
	expect(config.locales).toBeUndefined();
});

test('config.defaultLocale is populated from the single root locale', () => {
	expect(config.defaultLocale.lang).toBe('fr-CA');
	expect(config.defaultLocale.dir).toBe('ltr');
	expect(config.defaultLocale.locale).toBeUndefined();
});
