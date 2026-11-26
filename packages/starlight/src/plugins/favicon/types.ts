import type { FaviconMimeType } from './utils';

interface FaviconData {
	buffer: number[];
	attrs: FaviconAttributes;
}

export interface FaviconAttributes {
	type: FaviconMimeType;
	href: string;
	sizes?: string | undefined;
}

export interface FaviconsModule {
	favicon?: FaviconData | undefined;
	icoFallback?: FaviconData | undefined;
	externalFavicon?: FaviconAttributes | undefined;
}
