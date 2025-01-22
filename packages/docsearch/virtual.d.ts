declare module 'virtual:starlight/docsearch-config' {
	const DocSearchProps: Parameters<typeof import('@docsearch/js').default>[0];
	export default DocSearchProps;
}
