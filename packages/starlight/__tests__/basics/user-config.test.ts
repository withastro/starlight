import { expect, test } from 'vitest';
import { StarlightConfigSchema } from '../../utils/user-config';

test('preserve social link target attribute', () => {
	const config = StarlightConfigSchema.parse({
		title: 'Test',
		social: [
			{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight', target: '_blank' },
			{ icon: 'discord', label: 'Discord', href: 'https://astro.build/chat' },
		],
	});
	const social = config.social || [];
	expect(social[0]?.target).toBe('_blank');
	expect(social[1]?.target).toBeUndefined();
});

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
