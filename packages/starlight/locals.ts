import { defineMiddleware } from 'astro:middleware';
import { useTranslations } from './utils/translations';
import { attachRouteData, useRouteData } from './utils/route-data';

export const onRequest = defineMiddleware(async (context, next) => {
	context.locals.t = useTranslations(context.currentLocale);
	attachRouteData(context.locals, await useRouteData(context), context.url);
	return next();
});
