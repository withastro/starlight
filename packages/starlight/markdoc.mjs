import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';

export default function starlightMarkdoc() {
	return defineMarkdocConfig({
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
	});
}
