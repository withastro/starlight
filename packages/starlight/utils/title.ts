import type { StarlightConfig } from '../types';
import config from 'virtual:starlight/user-config';
export const getI18nTitle = (lang:string)=>{
	const title = config.title
	if(typeof title === 'object'){
		return title[lang]
	}
	return title
}

export const getErrorLangKey = (userConfig:StarlightConfig)=>{
	let result:[boolean, string]
	if(typeof userConfig.title !== 'object' || !userConfig.locales) return [false,''];
	for(const key in userConfig.title ){
		const localesList = Array.from (Object.values(userConfig.locales))
		if(!localesList.find(el=>el?.lang ===key )){
			result = [true,key]
			return result
		}
	}
	return [false,'']
}