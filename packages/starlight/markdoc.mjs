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
	},
};

/** @return {import('@astrojs/markdoc/config').AstroMarkdocConfig} */
export default function starlightMarkdoc() {
	return StarlightMarkdocPreset;
}
