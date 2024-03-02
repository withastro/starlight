import { AstroError } from 'astro/errors';
import type { Element, Root } from 'hast';
import { rehype } from 'rehype';

const stepsProcessor = rehype()
	.data('settings', { fragment: true })
	.use(function steps() {
		return (tree: Root) => {
			const rootElements = tree.children.filter((item): item is Element => item.type === 'element');
			const [rootElement] = rootElements;

			if (!rootElement) {
				throw new StepsError(
					'The `<Steps>` component expects its content to be a single ordered list (`<ol>`) but found no child elements.'
				);
			} else if (rootElements.length > 1) {
				throw new StepsError(
					'The `<Steps>` component expects its content to be a single ordered list (`<ol>`) but found multiple child elements: ' +
						rootElements.map((element: Element) => `\`<${element.tagName}>\``).join(', ') +
						'.'
				);
			} else if (rootElement.tagName !== 'ol') {
				throw new StepsError(
					'The `<Steps>` component expects its content to be a single ordered list (`<ol>`) but found the following element: ' +
						`\`<${rootElement.tagName}>\`.`
				);
			}

			// Ensure `role="list"` is set on the ordered list.
			// We use `list-style: none` in the styles for this component and need to ensure the list
			// retains its semantics in Safari, which will remove them otherwise.
			rootElement.properties.role = 'list';
			// Add the required CSS class name, preserving existing classes if present.
			if (!Array.isArray(rootElement.properties.className)) {
				rootElement.properties.className = ['sl-steps'];
			} else {
				rootElement.properties.className.push('sl-steps');
			}
		};
	});

/**
 * Process steps children: validates the HTML and adds `role="list"` to the ordered list.
 * @param html Inner HTML passed to the `<Steps>` component.
 */
export const processSteps = (html: string | undefined) => {
	const file = stepsProcessor.processSync({ value: html });
	return { html: file.toString() };
};

class StepsError extends AstroError {
	constructor(message: string) {
		super(
			message,
			'To learn more about the `<Steps>` component, see https://starlight.astro.build/guides/components/#steps'
		);
	}
}
