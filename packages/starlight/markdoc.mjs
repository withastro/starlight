import { component } from '@astrojs/markdoc/config';

// Explicitly not using `defineMarkdocConfig` or typing this value here so that we can rely on
// TypeScript to infer the type in tests.
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
					matches: ['note', 'danger', 'caution', 'tip'],
				},
			},
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
