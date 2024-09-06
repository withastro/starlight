import { component } from '@astrojs/markdoc/config';
import { WellKnownElementAttributes, WellKnownAnchorAttributes } from './html.mjs';

/**
 * The Markdoc preset for Starlight mapping Starlight components to Markdoc nodes and tags.
 *
 * - The icons are not using a `matches` to provide a list of supported icons as it is not possible
 * to import a TypeScript file in this file (which can also not be a TypeScript file). When
 * Starlight is bundled, this could be refactored to provide a list of supported icons.
 * - Some components (`<Badge>`, `<LinkButton>`, and `<LinkCard>`) support extra attributes, e.g.
 * all the attributes supported by the `<a>` tag. As Markdoc requires type definitions for each
 * attribute, only some well-known attributes are supported in these tags.
 *
 * @satisfies {import('@astrojs/markdoc/config').AstroMarkdocConfig}
 */
export const StarlightMarkdocPreset = {
	nodes: {
		fence: {
			render: component('@astrojs/starlight-markdoc/components', 'Code'),
			attributes: {
				content: {
					type: String,
					required: true,
					render: 'code',
				},
				language: {
					type: String,
					required: false,
					render: 'lang',
				},
				/**
				 * Markdoc ignores meta attributes (markers) after a fence block (e.g.
				 * ```js title="example.js" del={2} ins={3-4} {6} ).
				 * This means that Expressive Code markers defined after the fence block are ignored and
				 * users would need to use the `code` tag instead.
				 *
				 * @see https://github.com/withastro/astro/blob/9f943c1344671b569a0d1ddba683b3cca0068adc/packages/integrations/markdoc/src/extensions/shiki.ts#L15-L17
				 */
			},
		},
	},
	tags: {
		aside: {
			render: component('@astrojs/starlight/components', 'Aside'),
			attributes: {
				title: {
					type: String,
					required: false,
				},
				type: {
					type: String,
					required: false,
					default: 'note',
					matches: ['note', 'danger', 'caution', 'tip'],
				},
			},
		},
		badge: {
			render: component('@astrojs/starlight/components', 'Badge'),
			attributes: {
				...WellKnownElementAttributes,
				text: {
					type: String,
					required: true,
				},
				size: {
					type: String,
					required: false,
					default: 'small',
					matches: ['small', 'medium', 'large'],
				},
				variant: {
					type: String,
					required: false,
					matches: ['note', 'tip', 'danger', 'caution', 'success'],
				},
			},
		},
		card: {
			render: component('@astrojs/starlight/components', 'Card'),
			attributes: {
				icon: {
					type: String,
					required: false,
				},
				title: {
					type: String,
					required: true,
				},
			},
		},
		cardgrid: {
			render: component('@astrojs/starlight/components', 'CardGrid'),
			attributes: {
				stagger: {
					type: Boolean,
					required: false,
					default: false,
				},
			},
		},
		code: {
			render: component('@astrojs/starlight/components', 'Code'),
			attributes: {
				class: {
					type: String,
					required: false,
				},
				code: {
					type: String,
					required: true,
				},
				lang: {
					type: String,
					required: false,
				},
				meta: {
					type: String,
					required: false,
				},
				locale: {
					type: String,
					required: false,
				},
				frame: {
					type: String,
					required: false,
					default: 'auto',
					matches: ['auto', 'code', 'terminal', 'none'],
				},
				preserveIndent: {
					type: Boolean,
					required: false,
					default: true,
				},
				title: {
					type: String,
					required: false,
				},
				useDiffSyntax: {
					type: Boolean,
					required: false,
					default: false,
				},
				wrap: {
					type: Boolean,
					required: false,
					default: false,
				},
				/**
				 * `mark`, `ins`, and `del` are not supported as the Markdoc attribute validation syntax
				 * does not allow to describe properly all the possible values.
				 * Users should use the `meta` attribute instead.
				 *
				 * @see https://expressive-code.com/key-features/code-component/#mark--ins--del
				 */
			},
		},
		filetree: {
			render: component('@astrojs/starlight/components', 'FileTree'),
			attributes: {},
		},
		icon: {
			render: component('@astrojs/starlight/components', 'Icon'),
			attributes: {
				class: {
					type: String,
					required: false,
				},
				color: {
					type: String,
					required: false,
				},
				label: {
					type: String,
					required: false,
				},
				name: {
					type: String,
					required: true,
				},
				size: {
					type: String,
					required: false,
				},
			},
		},
		linkbutton: {
			render: component('@astrojs/starlight/components', 'LinkButton'),
			attributes: {
				...WellKnownAnchorAttributes,
				href: {
					type: String,
					required: true,
				},
				icon: {
					type: String,
					required: false,
				},
				iconPlacement: {
					type: String,
					required: false,
					default: 'end',
					matches: ['start', 'end'],
				},
				variant: {
					type: String,
					required: false,
					default: 'primary',
					matches: ['primary', 'secondary', 'minimal'],
				},
			},
		},
		linkcard: {
			render: component('@astrojs/starlight/components', 'LinkCard'),
			attributes: {
				...WellKnownAnchorAttributes,
				description: {
					type: String,
					required: false,
				},
				href: {
					type: String,
					required: true,
				},
				title: {
					type: String,
					required: true,
				},
			},
		},
		steps: {
			render: component('@astrojs/starlight/components', 'Steps'),
			attributes: {},
		},
		tabitem: {
			render: component('@astrojs/starlight/components', 'TabItem'),
			attributes: {
				icon: {
					type: String,
					required: false,
				},
				label: {
					type: String,
					required: true,
				},
			},
		},
		tabs: {
			render: component('@astrojs/starlight/components', 'Tabs'),
			attributes: {
				syncKey: {
					type: String,
					required: false,
				},
			},
		},
	},
};

/** @return {import('@astrojs/markdoc/config').AstroMarkdocConfig} */
export default function starlightMarkdoc() {
	return StarlightMarkdocPreset;
}
