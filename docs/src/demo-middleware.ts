// TODO(Chris): remove this demo file.

import { defineRouteMiddleware, type StarlightRouteData } from '@astrojs/starlight/route-data';

export const onRequest = defineRouteMiddleware((context) => {
	context.locals.starlightRoute.entry.data.title =
		'🚨 ' + context.locals.starlightRoute.entry.data.title + '!';
	usePageTitleInTOC(context.locals.starlightRoute);
});

function usePageTitleInTOC(starlightRoute: StarlightRouteData) {
	const overviewLink = starlightRoute.toc?.items[0];
	if (overviewLink) {
		overviewLink.text = starlightRoute.entry.data.title;
	}
}
