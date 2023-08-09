import { map } from './atom';

export const store = {
	accent: map({ hue: 270, chroma: 0.27 }),
	gray: map({ hue: 270, chroma: 0.02 }),
} as const;
