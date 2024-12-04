import { defineMiddleware } from 'astro:middleware';
import { useTranslations } from './utils/translations';
import { useRouteData } from './utils/route-data';

export const onRequest = defineMiddleware(async (context, next) => {
	context.locals.t = useTranslations(context.currentLocale);
	context.locals.routeData = await useRouteData(context);
	return next();
});
