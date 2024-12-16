import { defineMiddleware } from 'astro:middleware';
import { useTranslations } from './utils/translations';

export const onRequest = defineMiddleware((context, next) => {
	context.locals.t = useTranslations(context.currentLocale);

	return next();
});
