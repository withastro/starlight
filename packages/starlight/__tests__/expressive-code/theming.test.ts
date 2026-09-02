import { describe, expect, test } from 'vitest';
import { ExpressiveCodeTheme } from 'astro-expressive-code';
import {
	applyStarlightUiThemeColors,
	preprocessThemes,
} from '../../src/integrations/expressive-code/theming';

describe('preprocessThemes', () => {
	test('returns the default theme objects when no options are provided', () => {
		const result = preprocessThemes(undefined);
		expect(result).toHaveLength(2);
		expect(result).toMatchObject([{ name: 'Night Owl No Italics' }, { name: 'Night Owl Light' }]);
	});

	test('normalizes a single theme string into an array', () => {
		// @ts-expect-error - The function handles this but does not allow it in the type signature.
		const result = preprocessThemes('starlight-light');
		expect(result).toHaveLength(1);
		expect(result).toMatchObject([{ name: 'Night Owl Light' }]);
	});

	test('passes through Shiki built-in themes as strings', () => {
		const result = preprocessThemes(['nord', 'github-light']);
		expect(result).toEqual(['nord', 'github-light']);
	});
});

describe('applyStarlightUiThemeColors', () => {
	test('applies the correct colors to a dark theme', () => {
		const [darkTheme] = preprocessThemes(['starlight-dark']);

		expect.assert.instanceOf(darkTheme, ExpressiveCodeTheme);
		const result = applyStarlightUiThemeColors(darkTheme);
		expect(result.colors['titleBar.activeBackground']).toBe('var(--sl-color-black)');
		expect(result.colors['editorGroupHeader.tabsBorder']).toBe(
			'color-mix(in srgb, var(--sl-color-gray-5), transparent 25%)'
		);
	});

	test('applies the correct colors to a light theme', () => {
		const [lightTheme] = preprocessThemes(['starlight-light']);

		expect.assert.instanceOf(lightTheme, ExpressiveCodeTheme);
		const result = applyStarlightUiThemeColors(lightTheme);
		expect(result.colors['titleBar.activeBackground']).toBe('var(--sl-color-gray-6)');
		expect(result.colors['editorGroupHeader.tabsBorder']).toBe(
			'color-mix(in srgb, var(--sl-color-gray-5), transparent 25%)'
		);
	});
});
