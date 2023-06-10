import fs from 'fs';

export function tryGetFrontMatterBlock(filePath: string): string {
	const contents = fs.readFileSync(filePath, 'utf8');
	const matches = contents.match(/^\s*---([\S\s]*?)\n---/);
	if (!matches) return '';
	return matches[1];
}

export function toUtcString(date: string) {
	return new Date(date).toISOString();
}
