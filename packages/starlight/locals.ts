import { defineMiddleware } from 'astro:middleware';
import { useRouteData } from './utils/routing/data';
import { attachRouteDataAndRunMiddleware } from './utils/routing/middleware';
import { useTranslations } from './utils/translations';

export const onRequest = defineMiddleware(async (context, next) => {
	context.locals.t = useTranslations(context.currentLocale);
	await attachRouteDataAndRunMiddleware(context, await useRouteData(context));
	return next();
});
