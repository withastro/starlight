import type { APIContext } from 'astro';

type RouteMiddlewareHandler = (context: APIContext) => void | Promise<void>;

export function defineRouteMiddleware(fn: RouteMiddlewareHandler) {
	return fn;
}
