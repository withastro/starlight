import type { APIContext } from 'astro';
import { klona } from 'klona/lite';
import { routeMiddleware } from 'virtual:starlight/route-middleware';
import type { StarlightRouteData } from './types';

/**
 * Adds a deep clone of the passed `routeData` object to locals and then runs middleware.
 * @param context Astro context object
 * @param routeData Initial route data object to attach.
 */
export async function attachRouteDataAndRunMiddleware(
	context: APIContext,
	routeData: StarlightRouteData
) {
	context.locals.starlightRoute = klona(routeData);
	for (const middlewareFn of routeMiddleware) {
		await middlewareFn(context);
	}
}
