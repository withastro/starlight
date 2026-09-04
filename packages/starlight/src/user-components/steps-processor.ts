import { AstroError } from 'astro/errors';
import type { Element, Root } from 'hast';
import { format } from 'hast-util-format';
import { toHtml } from 'hast-util-to-html';
import { htmlToHast } from 'satteri';

const prettyPrintHtml = (tree: Root) => {
	format(tree);
	return toHtml(tree);
};

/**
 * Process steps children: validates the HTML and adds `role="list"` to the ordered list.
 * @param html Inner HTML passed to the `<Steps>` component.
 */
export const processSteps = (html: string | undefined) => {
	const tree = htmlToHast(html ?? '', { fragment: true }) as Root;
	const rootElements = tree.children.filter(
		(item): item is Element =>
			item.type === 'element' &&
			// Since Astro 5.16.9, `<script>` elements from nested child elements can end up hoisted
			// into the `<Steps>` slot due to our use of `Astro.slots.render()`. We can safely ignore
			// these, so we filter them out here.
			// TODO: we may be able to remove this in the future if the upstream issue is fixed.
			// See: https://github.com/withastro/astro/issues/15627
			item.tagName !== 'script'
	);
	const [rootElement] = rootElements;

	if (!rootElement) {
		throw new StepsError(
			'The `<Steps>` component expects its content to be a single ordered list (`<ol>`) but found no child elements.'
		);
	} else if (rootElements.length > 1) {
		throw new StepsError(
			'The `<Steps>` component expects its content to be a single ordered list (`<ol>`) but found multiple child elements: ' +
				rootElements.map((element: Element) => `\`<${element.tagName}>\``).join(', ') +
				'.',
			tree
		);
	} else if (rootElement.tagName !== 'ol') {
		throw new StepsError(
			'The `<Steps>` component expects its content to be a single ordered list (`<ol>`) but found the following element: ' +
				`\`<${rootElement.tagName}>\`.`,
			tree
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

	// Add the `start` attribute as a CSS custom property so we can use it as the starting index
	// of the steps custom counter.
	if (typeof rootElement.properties.start === 'number') {
		const styles = [`--sl-steps-start: ${rootElement.properties.start - 1}`];
		if (rootElement.properties.style) styles.push(String(rootElement.properties.style));
		rootElement.properties.style = styles.join(';');
	}

	return { html: toHtml(tree) };
};

class StepsError extends AstroError {
	constructor(message: string, tree?: Root) {
		let hint =
			'To learn more about the `<Steps>` component, see https://starlight.astro.build/components/steps/';
		if (tree) {
			hint += '\n\nFull HTML passed to `<Steps>`:\n' + prettyPrintHtml(tree);
		}
		super(message, hint);
	}
}
