import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
	if (context.url.pathname === '/content') {
		return context.rewrite('/demo');
	}
	return next();
});
