export type PageIndex = {
	[language: string]: {
		[pagePath: string]: PageData;
	};
};

export type PageData = {
	i18nReady?: boolean;
	lastChange: string;
	lastCommitMsg: string;
	lastMajorChange: string;
	lastMajorCommitMsg: string;
};

export type PageTranslationStatus = {
	subpath: string;
	sourcePage: PageData;
	githubUrl: string;
	translations: {
		[language: string]: {
			page: PageData;
			isMissing: boolean;
			isOutdated: boolean;
			githubUrl: string;
			sourceHistoryUrl: string;
		};
	};
};
