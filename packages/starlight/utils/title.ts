import config from 'virtual:starlight/user-config';

/** Get a title from a user-provided title. **/
export function getSiteTitle(lang: string): string {
	const defaultLang = config.defaultLocale.lang as string;
	if (lang && config.title[lang]) {
	  return config.title[lang] as string;
	}
	return config.title[defaultLang] as string;
  }