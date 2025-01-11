import type { APIContext } from 'astro';
export type { StarlightRouteData } from './utils/routing/types';

type RouteMiddlewareHandler = (context: APIContext) => void | Promise<void>;

export function defineRouteMiddleware(fn: RouteMiddlewareHandler) {
	return fn;
}
