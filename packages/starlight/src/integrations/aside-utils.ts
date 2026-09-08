import { AstroError } from 'astro/errors';
import { Icons, type StarlightIcon } from '../components-internals/Icons';

export const asideVariants = ['note', 'tip', 'caution', 'danger'] as const;
export type AsideVariant = (typeof asideVariants)[number];

// A map of aside variants to their default Starlight icon names.
const asideIconNames: Record<AsideVariant, StarlightIcon> = {
	note: 'information',
	tip: 'rocket',
	caution: 'warning',
	danger: 'error',
};

const asideVariantSet = new Set<string>(asideVariants);
export function isAsideVariant(value: string): value is AsideVariant {
	return asideVariantSet.has(value);
}

export function getAsideIconName(variant: AsideVariant, customIcon?: string | null): StarlightIcon {
	let iconName = asideIconNames[variant];

	if (customIcon) {
		iconName = customIcon as StarlightIcon;
		if (!Icons[iconName]) throwInvalidAsideIconError(iconName);
	}

	return iconName;
}

export function getAsideIcon(variant: AsideVariant, customIcon?: string | null) {
	return Icons[getAsideIconName(variant, customIcon)];
}

function throwInvalidAsideIconError(icon: string) {
	throw new AstroError(
		'Invalid aside icon',
		`An aside custom icon must be set to the name of one of Starlight’s built-in icons, but received \`${icon}\`.\n\n` +
			'See https://starlight.astro.build/reference/icons/#all-icons for a list of available icons.'
	);
}
