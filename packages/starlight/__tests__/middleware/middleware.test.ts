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
			This usually means a Starlight component is being rendered outside of a Starlight page, which is not supported."
	`);
});

test('starlightRoute returns as expected if it has been set', async () => {
	const context = { locals: {}, currentLocale: 'en' } as APIContext;
	await onRequest(context, async () => new Response());
	context.locals.starlightRoute = { siteTitle: 'Test title' } as any;
	expect(context.locals.starlightRoute.siteTitle).toBe('Test title');
});
