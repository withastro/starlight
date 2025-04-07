import type { APIContext } from 'astro';
import { expect, test } from 'vitest';
import { onRequest } from '../../locals';

test('starlightRoute throws when accessed outside of a Starlight page', async () => {
	const context = { locals: {}, currentLocale: 'en' } as APIContext;
	await onRequest(context, async () => new Response());
	expect(() => {
		context.locals.starlightRoute;
	}).toThrowErrorMatchingInlineSnapshot(`
		"[AstroUserError]:
			\`locals.starlightRoute\` is not defined
		Hint:
			This usually means a component that accesses \`locals.starlightRoute\` is being rendered outside of a Starlight page, which is not supported.
			
			If this is a component you authored, you can do one of the following:
			
			1. Avoid using this component in non-Starlight pages.
			2. Wrap the code that reads \`locals.starlightRoute\` in a  \`try/catch\` block and handle the cases where \`starlightRoute\` is not available.
			
			If this is a Starlight built-in or third-party component, you may need to report a bug or avoid this use of the component."
	`);
});

test('starlightRoute returns as expected if it has been set', async () => {
	const context = { locals: {}, currentLocale: 'en' } as APIContext;
	await onRequest(context, async () => new Response());
	context.locals.starlightRoute = { siteTitle: 'Test title' } as any;
	expect(context.locals.starlightRoute.siteTitle).toBe('Test title');
});
