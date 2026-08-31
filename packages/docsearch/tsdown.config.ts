import { defineConfig } from 'tsdown';

export default defineConfig({
	copy: ['src/DocSearch.astro', 'src/variables.css'],
	dts: true,
	entry: ['src/index.ts', 'src/schema.ts'],
	fixedExtension: false,
	publint: { strict: true },
	unbundle: true,
});
