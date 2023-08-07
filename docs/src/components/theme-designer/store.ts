import { map } from './atom';

export const store = {
	accent: map({ hue: 268.7, chroma: 0.266 }),
	gray: map({ hue: 268.7, chroma: 0.021 }),
} as const;
