import { rmSync } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { build } from 'astro';

process.env.ASTRO_TELEMETRY_DISABLED = 'true';
process.env.ASTRO_DISABLE_UPDATE_CHECK = 'true';

const componentNames = [
	'aside',
	'badge',
	'card',
	'card-grid',
	'code',
	'file-tree',
	'icon',
	'link-button',
	'link-card',
	'steps',
	'tab-item',
	'tabs',
] as const;

type FixtureName = 'large-sidebar' | 'components' | 'locales';

interface DocFile {
	path: string;
	contents: string;
}

export const buildBenchOptions = {
	iterations: 1,
	time: 0,
	warmupIterations: 0,
	warmupTime: 0,
};

function getFixtureRoot(name: FixtureName) {
	return fileURLToPath(new URL(`./fixtures/${name}/`, import.meta.url));
}

function frontmatter(title: string) {
	return `---\ntitle: ${title}\n---\n\n`;
}

function componentContents(component: (typeof componentNames)[number]) {
	const imports = `import { ${
		component === 'code'
			? 'Code'
			: component
					.split('-')
					.map((part) => part[0]?.toUpperCase() + part.slice(1))
					.join('')
	} } from '@astrojs/starlight/components';\n\n`;

	switch (component) {
		case 'aside':
			return `${imports}{Array.from({ length: 100 }, (_, index) => <Aside title={\`Aside \${index}\`}>Benchmark content</Aside>)}`;
		case 'badge':
			return `${imports}{Array.from({ length: 100 }, (_, index) => <Badge text={\`Badge \${index}\`} />)}`;
		case 'card':
			return `${imports}{Array.from({ length: 100 }, (_, index) => <Card title={\`Card \${index}\`}>Benchmark content</Card>)}`;
		case 'card-grid':
			return `${imports}import { Card } from '@astrojs/starlight/components';\n\n{Array.from({ length: 100 }, (_, index) => <CardGrid><Card title={\`Card \${index}\`}>Benchmark content</Card></CardGrid>)}`;
		case 'code':
			return `${imports}{Array.from({ length: 100 }, (_, index) => <Code code={\`const value = \${index};\`} lang="js" />)}`;
		case 'file-tree':
			return `${imports}{Array.from({ length: 100 }, (_, index) => <FileTree><ul><li>{\`file-\${index}.ts\`}</li></ul></FileTree>)}`;
		case 'icon':
			return `${imports}{Array.from({ length: 100 }, () => <Icon name="rocket" />)}`;
		case 'link-button':
			return `${imports}{Array.from({ length: 100 }, (_, index) => <LinkButton href={\`/destination-\${index}/\`}>Destination</LinkButton>)}`;
		case 'link-card':
			return `${imports}{Array.from({ length: 100 }, (_, index) => <LinkCard href={\`/destination-\${index}/\`} title={\`Destination \${index}\`} />)}`;
		case 'steps':
			return `${imports}{Array.from({ length: 100 }, (_, index) => <Steps><ol><li>{\`Step \${index}\`}</li></ol></Steps>)}`;
		case 'tab-item':
			return `${imports}import { Tabs } from '@astrojs/starlight/components';\n\n<Tabs>{Array.from({ length: 100 }, (_, index) => <TabItem label={\`Tab \${index}\`}>Benchmark content</TabItem>)}</Tabs>`;
		case 'tabs':
			return `${imports}import { TabItem } from '@astrojs/starlight/components';\n\n{Array.from({ length: 100 }, (_, index) => <Tabs><TabItem label={\`Tab \${index}\`}>Benchmark content</TabItem></Tabs>)}`;
	}
}

export function createComponentDocs(locales: string[] = ['']): DocFile[] {
	return [
		{ path: '404.md', contents: frontmatter('Not found') + 'Benchmark fallback page.\n' },
		...locales.flatMap((locale) =>
			componentNames.map((component) => ({
				path: `${locale ? locale + '/' : ''}components/${component}.mdx`,
				contents: frontmatter(component) + componentContents(component),
			}))
		),
	];
}

export function createLargeSidebarDocs(): DocFile[] {
	const docs: DocFile[] = [
		{ path: '404.md', contents: frontmatter('Not found') + 'Benchmark fallback page.\n' },
	];
	for (let section = 0; section < 10; section++) {
		const nesting = Array.from({ length: 7 }, (_, index) => `level-${index + 1}`).join('/');
		for (let page = 0; page < 100; page++) {
			docs.push({
				path: `reference/section-${section}/${nesting}/page-${page}.md`,
				contents: frontmatter(`Page ${section}-${page}`) + 'Benchmark content.\n',
			});
		}
	}
	return docs;
}

export async function writeFixtureDocs(name: FixtureName, docs: DocFile[]) {
	const root = getFixtureRoot(name);
	const docsRoot = join(root, 'src/content/docs');
	await rm(docsRoot, { recursive: true, force: true });
	await Promise.all(
		docs.map(async ({ path, contents }) => {
			const filePath = join(docsRoot, path);
			await mkdir(dirname(filePath), { recursive: true });
			await writeFile(filePath, contents);
		})
	);
}

export async function resetFixtureBuild(name: FixtureName) {
	const root = getFixtureRoot(name);
	await Promise.all([
		rm(join(root, '.astro'), { recursive: true, force: true }),
		rm(join(root, 'dist'), { recursive: true, force: true }),
	]);
}

export async function buildFixture(name: FixtureName) {
	await build({ logLevel: 'silent', root: getFixtureRoot(name) });
}

export function cleanFixture(name: FixtureName) {
	const root = getFixtureRoot(name);
	for (const path of ['src/content/docs', '.astro', 'dist']) {
		rmSync(join(root, path), { recursive: true, force: true });
	}
}
