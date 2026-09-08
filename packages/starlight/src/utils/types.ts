// https://stackoverflow.com/a/66252656/1945960
export type RemoveIndexSignature<T> = {
	[K in keyof T as string extends K
		? never
		: number extends K
			? never
			: symbol extends K
				? never
				: K]: T[K];
};

// https://www.totaltypescript.com/concepts/the-prettify-helper
export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};
