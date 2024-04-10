import { TitleTransformConfigSchema } from '../schemas/title';
import config from 'virtual:starlight/user-config';

const defaultLang = config.defaultLocale.lang as string;
const TitleSchema = TitleTransformConfigSchema(defaultLang);

/** Create a title from a user-provided title. **/
export function createTitle(lang: string): string {
	const title = TitleSchema.parse(config.title);
	if (lang && title[lang]) {
		return title[lang] as string;
	}
	return title[defaultLang] as string;
}
