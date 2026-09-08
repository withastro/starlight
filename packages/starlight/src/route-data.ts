import type { APIContext } from 'astro';
export type { StarlightRouteData } from './utils/routing/types';

export type RouteMiddlewareHandler = (
	context: APIContext,
	next: () => Promise<void>
) => void | Promise<void>;

export function defineRouteMiddleware(fn: RouteMiddlewareHandler) {
	return fn;
}
