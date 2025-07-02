// TODO(HiDeoo) Remove

import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

export const onRequest = defineRouteMiddleware((context) => {
	context.locals.starlightRoute.entry.data.banner = {
		content: 'This is a <a href="https://starlight.astro.build/">test banner</a>.',
	};
});
