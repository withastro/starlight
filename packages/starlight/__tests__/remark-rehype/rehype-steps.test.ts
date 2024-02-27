import { expect, test } from 'vitest';
import { processSteps } from '../../user-components/rehype-steps';

test('empty component throws an error', () => {
	expect(() => processSteps('')).toThrowErrorMatchingInlineSnapshot(
		`
		"[AstroUserError]:
			The \`<Steps>\` component expects its content to be a single ordered list (\`<ol>\`) but found no child elements.
		Hint:
			To learn more about the \`<Steps>\` component, see https://starlight.astro.build/guides/components/#steps"
	`
	);
});

test('component with non-element content throws an error', () => {
	expect(() => processSteps('<!-- comment -->Text node')).toThrowErrorMatchingInlineSnapshot(
		`
		"[AstroUserError]:
			The \`<Steps>\` component expects its content to be a single ordered list (\`<ol>\`) but found no child elements.
		Hint:
			To learn more about the \`<Steps>\` component, see https://starlight.astro.build/guides/components/#steps"
	`
	);
});

test('component with non-`<ol>` content throws an error', () => {
	expect(() => processSteps('<p>A paragraph is not an ordered list</p>'))
		.toThrowErrorMatchingInlineSnapshot(`
			"[AstroUserError]:
				The \`<Steps>\` component expects its content to be a single ordered list (\`<ol>\`) but found the following element: \`<p>\`.
			Hint:
				To learn more about the \`<Steps>\` component, see https://starlight.astro.build/guides/components/#steps"
		`);
});

test('component with multiple children throws an error', () => {
	expect(() => processSteps('<ol></ol><ol></ol>')).toThrowErrorMatchingInlineSnapshot(`
		"[AstroUserError]:
			The \`<Steps>\` component expects its content to be a single ordered list (\`<ol>\`) but found multiple child elements: \`<ol>\`, \`<ol>\`.
		Hint:
			To learn more about the \`<Steps>\` component, see https://starlight.astro.build/guides/components/#steps"
	`);
});

test('applies `role="list"` to child list', () => {
	const { html } = processSteps('<ol><li>Step one</li></ol>');
	expect(html).toMatchInlineSnapshot(`"<ol role="list"><li>Step one</li></ol>"`);
});

test('does not interfere with other attributes on the child list', () => {
	const { html } = processSteps('<ol start="5"><li>Step one</li></ol>');
	expect(html).toMatchInlineSnapshot(`"<ol start="5" role="list"><li>Step one</li></ol>"`);
});
