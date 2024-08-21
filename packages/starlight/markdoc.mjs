import { component } from '@astrojs/markdoc/config';

/** @satisfies {import('@astrojs/markdoc/config').AstroMarkdocConfig} */
export const StarlightMarkdocPreset = {
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
				// TODO(HiDeoo) Any span attributes
			},
		},
		card: {
			render: component('@astrojs/starlight/components', 'Card'),
			attributes: {
				icon: {
					type: String,
					required: false,
					// TODO(HiDeoo) Union?
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
		// TODO(HiDeoo) code component
		filetree: {
			render: component('@astrojs/starlight/components', 'FileTree'),
			attributes: {},
		},
		linkbutton: {
			render: component('@astrojs/starlight/components', 'LinkButton'),
			attributes: {
				href: {
					type: String,
					required: true,
				},
				icon: {
					type: String,
					required: false,
					// TODO(HiDeoo) Union?
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
				// TODO(HiDeoo) Any link attributes
			},
		},
		linkcard: {
			render: component('@astrojs/starlight/components', 'LinkCard'),
			attributes: {
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
				// TODO(HiDeoo) Any link attributes
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
					// TODO(HiDeoo) Union?
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
