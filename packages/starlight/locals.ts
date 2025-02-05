import type { APIContext } from 'astro';
import { AstroError } from 'astro/errors';
import { defineMiddleware } from 'astro:middleware';
import type { StarlightRouteData } from './route-data';
import { useTranslations } from './utils/translations';

export const onRequest = defineMiddleware(async (context, next) => {
	context.locals.t = useTranslations(context.currentLocale);
	initializeStarlightRoute(context);
	return next();
});

/**
 * Sets up a `starlightRoute` property on locals. Initially, this will throw an error if accessed.
 * When rendering, Starlight’s routes set `starlightRoute` with the resolved route data object for
 * the current page.
 *
 * This ensures Starlight components can easily access `starlightRoute` without needing type guards,
 * we can throw a helpful message if `starlightRoute` is accessed on non-Starlight pages, and we
 * avoid generating route data in this middleware which also runs for non-Starlight route.
 */
export function initializeStarlightRoute(context: APIContext) {
	const state: { routeData: StarlightRouteData | undefined } = { routeData: undefined };
	Object.defineProperty(context.locals, 'starlightRoute', {
		get() {
			if (!state.routeData) {
				throw new AstroError(
					'`locals.starlightRoute` is not defined',
					'This usually means a Starlight component is being rendered outside of a Starlight page, which is not supported.'
				);
			}
			return state.routeData;
		},
		set(routeData: StarlightRouteData) {
			state.routeData = routeData;
		},
	});
}
