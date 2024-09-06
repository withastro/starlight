/**
 * A list of well-known HTML element global attributes that can be used on any HTML element.
 *
 * @satisfies {HTMLElementTagAttributes<'span'>}
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
 */
export const WellKnownElementAttributes = {
	class: { type: String },
	dir: { type: String, matches: ['ltr', 'rtl', 'auto'] },
	hidden: { type: String, matches: ['', 'hidden', 'until-found'] },
	id: { type: String },
	lang: { type: String },
	role: { type: String },
	style: { type: String },
	title: { type: String },
};

/**
 * A list of well-known HTML attributes that can be used on an `<a>` element.
 *
 * @satisfies {HTMLElementTagAttributes<'a'>}
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
 */
export const WellKnownAnchorAttributes = {
	...WellKnownElementAttributes,
	download: { type: String },
	href: { type: String },
	hreflang: { type: String },
	media: { type: String },
	ping: { type: String },
	rel: { type: String },
	target: { type: String, matches: ['_self', '_blank', '_parent', '_top'] },
};

/**
 * The configuration of a tag attribute.
 * @typedef {NonNullable<NonNullable<import('@astrojs/markdoc/config').AstroMarkdocConfig['tags']>[string]['attributes']>[string]} TagAttributeConfig
 */

/**
 * A map of HTML attributes for a specific HTML element with their associated attribute configuration.
 * @typedef {Partial<Record<keyof import('astro/types').HTMLAttributes<T>, TagAttributeConfig>>} HTMLElementTagAttributes
 * @template {import('astro/types').HTMLTag} T
 */
