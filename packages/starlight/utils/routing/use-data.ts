import type { APIContext } from 'astro';
import { getRouteBySlugParam } from '../routing';
import type { StarlightRouteData } from './types';
import { render } from 'astro:content';
import { generateRouteData, get404Route } from './data';

export async function useRouteData(context: APIContext): Promise<StarlightRouteData> {
	const route =
		('slug' in context.params && getRouteBySlugParam(context.params.slug)) ||
		(await get404Route(context.locals));
	const { Content, headings } = await render(route.entry);
	const routeData = generateRouteData({ props: { ...route, headings }, url: context.url });
	return { ...routeData, Content };
}
