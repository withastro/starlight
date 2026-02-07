import { expect, test } from 'vitest';
import { StarlightConfigSchema } from '../../utils/user-config';

test('preserve social config order', () => {
	const config = StarlightConfigSchema.parse({
		title: 'Test',
		social: [
			{ icon: 'twitch', label: 'Twitch', href: 'https://www.twitch.tv/bholmesdev' },
			{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' },
			{ icon: 'discord', label: 'Discord', href: 'https://astro.build/chat' },
		],
	});
	expect((config.social || []).map(({ icon }) => icon)).toEqual(['twitch', 'github', 'discord']);
});

test('markdown.optimize defaults to true', () => {
	const config = StarlightConfigSchema.parse({
		title: 'Test',
	});
	expect(config.markdown.optimize).toBe(true);
});

test('mdxStrictMode can be set to false', () => {
	const config = StarlightConfigSchema.parse({
		title: 'Test',
		markdown: {
			optimize: false,
		},
	});
	expect(config.markdown.optimize).toBe(false);
});
