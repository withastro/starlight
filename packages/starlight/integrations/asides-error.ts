import { AstroError } from 'astro/errors';

export function throwInvalidAsideIconError(icon: string) {
	throw new AstroError(
		'Invalid aside icon',
		`An aside custom icon must be set to the name of one of Starlight’s built-in icons, but received \`${icon}\`.\n\n` +
			'See https://starlight.astro.build/reference/icons/#all-icons for a list of available icons.'
	);
}
