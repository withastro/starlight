const faviconTypeMap = {
	'.ico': 'image/x-icon',
	'.gif': 'image/gif',
	'.jpeg': 'image/jpeg',
	'.jpg': 'image/jpeg',
	'.png': 'image/png',
	'.svg': 'image/svg+xml',
} as const;

export type FaviconExt = keyof typeof faviconTypeMap;
export type FaviconMimeType = (typeof faviconTypeMap)[FaviconExt];

export function isFaviconExt(ext: string): ext is FaviconExt {
	return ext in faviconTypeMap;
}

export function mimeTypeForFaviconExt(ext: FaviconExt) {
	return faviconTypeMap[ext];
}
