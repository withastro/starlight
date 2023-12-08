import { type APIRoute } from 'astro';
import * as pagefind from 'pagefind';
import { routes } from './utils/routing';
import { slugToPathname } from './utils/slugs.ts';

const extensionToMime: Partial<Record<string, string>> = {
	js: 'text/javascript',
	css: 'text/css',
	html: 'text/html',
	json: 'application/json',
};

async function createPagefindIndex(baseUrl: URL): Promise<ReadonlyMap<string, Response>> {
	console.time('pagefind index')
	const { index } = await pagefind.createIndex({}) as Required<pagefind.NewIndexResponse>;

	await Promise.all(
		routes.map(
			async route => {
				const path = slugToPathname(route.slug);
				console.time(`pagefind index ${path}`);
				const pageResponse = await fetch(new URL(path, baseUrl));

				if (pageResponse.status !== 200) {
					return;
				}

				const pageContent = await pageResponse.text();

				await index.addHTMLFile({
					url: path,
					content: pageContent,
				});

				console.timeEnd(`pagefind index ${route.slug}`)
			},
		),
	);

	const files = await index.getFiles();

	if (files.errors.length > 0) {
		throw new Error(files.errors.join('\n'));
	}

	const indexFiles = new Map<string, Response>();

	for (const file of files.files) {
		const extension = file.path.substring(file.path.lastIndexOf('.') + 1);

		indexFiles.set(file.path, new Response(file.content, {
			headers: {
				'Content-Type': extensionToMime[extension] ?? 'application/octet-stream',
			},
		}));
	}

	console.timeEnd('pagefind index')

	return indexFiles;
}

let pagefindIndex: Promise<ReadonlyMap<string, Response>>;

async function getIndex(baseURL: URL): Promise<ReadonlyMap<string, Response>> {
	if (pagefindIndex === undefined) {
		pagefindIndex = createPagefindIndex(baseURL);
	}

	return pagefindIndex;
}

export const GET: APIRoute = async ({ params , url}) => {
	const index = await getIndex(url)

	const path = params.path;
	const entry = index.get(path!);

	if (entry === undefined) {
		return new Response(null, { status: 404 });
	}

	return entry;
};
