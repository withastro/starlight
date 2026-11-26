import type { AstroIntegration } from 'astro';
import { AstroError } from 'astro/errors';
import fs from 'node:fs/promises';
import { basename, extname } from 'node:path';
import type { SharpConstructor } from 'sharp';
import type { StarlightPlugin } from '../../utils/plugins';
import type { FaviconsModule } from './types';
import { mimeTypeForFaviconExt, type FaviconExt } from './utils';

// We dynamically import `sharp` so we can handle the case where a user does not have it installed
// instead of erroring.
const sharp = await (async (): Promise<SharpConstructor | void> => {
	try {
		return (await import('sharp')).default;
	} catch {}
})();

/**
 * Internal Starlight plugin for handling user favicons. It exposes them in the final build, and
 * generates a `.ico` file as a fallback if a user’s favicon is not already in that format.
 */
export const starlightPluginFavicon: StarlightPlugin = {
	name: 'starlight-favicon',
	hooks: {
		async 'config:setup'({ config, astroConfig: { publicDir, root }, logger, addIntegration }) {
			// If the favicon is explicitly disabled, initialise the Astro integration with no data.
			if (config.favicon === false) {
				addIntegration(astroIntegrationFavicon());
				return;
			}

			// Extract the favicon extension (or use the default `.svg` if there is no favicon configured.)
			// We assert the extension type as this is already validated by Starlight’s config schema.
			const faviconExt = config.favicon ? extname(config.favicon).toLowerCase() : '.svg';
			const faviconType = mimeTypeForFaviconExt(faviconExt as FaviconExt);

			// If the favicon is a valid absolute URL, expose it via the Astro integration.
			if (config.favicon && URL.canParse(config.favicon)) {
				addIntegration(
					astroIntegrationFavicon({
						externalFavicon: { href: config.favicon, type: faviconType },
					})
				);
				return;
			}

			// Otherwise, treat the favicon as a local file and attempt to load it from the filesystem.
			let faviconFileURL = config.favicon
				? new URL(config.favicon, root)
				: // Default to loading `./public/favicon.svg`. This matches Starlight’s historic
					// behaviour of referencing this file and will keep working for existing sites.
					new URL('./favicon.svg', publicDir);

			// Load the user’s favicon.
			let faviconBuffer: Buffer;
			try {
				faviconBuffer = await fs.readFile(faviconFileURL);
			} catch {
				if (!config.favicon) {
					// If the user didn’t configure a favicon and we failed to load from the default location,
					// load our internal default instead, which is guaranteed to be present.
					faviconFileURL = new URL('./favicon.svg', import.meta.url);
					faviconBuffer = await fs.readFile(faviconFileURL);
				} else {
					// Otherwise, throw a helpful error.
					const rootRelativeFaviconPath = faviconFileURL.href.replace(root.href, '');
					throw new AstroError(
						`Failed to load favicon file \`${rootRelativeFaviconPath}\`.`,
						'Make sure it exists, or set Starlight’s `favicon` option to provide a valid file path or disable favicon generation.\n\n' +
							'Learn more: https://starlight.astro.build/reference/configuration/#favicon'
					);
				}
			}

			// Unless a user already provided an ICO file, generate one as a
			// fallback for older browsers and some web servers that require it.

			/** Target width & height for the generated ICO fallback. */
			const size = 32;

			let icoFallbackBuffer;
			if (faviconExt !== '.ico') {
				if (sharp) {
					const pngBuffer = await sharp(faviconBuffer, {
						svg: { stylesheet: 'background-color: transparent' },
					})
						.resize(size, size, { fit: 'contain', background: 'transparent' })
						.png()
						.toBuffer();
					icoFallbackBuffer = pngToIco(pngBuffer, size);
				} else {
					logger.warn(
						'Sharp is not available, no ICO fallback will be generated for your favicon.'
					);
				}
			}

			addIntegration(
				astroIntegrationFavicon({
					faviconIsInPublicDir: faviconFileURL.pathname.startsWith(publicDir.pathname),
					favicon: {
						buffer: [...faviconBuffer],
						attrs: { type: faviconType, href: basename(faviconFileURL.pathname) },
					},
					icoFallback: icoFallbackBuffer && {
						buffer: [...icoFallbackBuffer],
						attrs: { type: 'image/x-icon', href: 'favicon.ico', sizes: '32x32' },
					},
				})
			);
		},
	},
};

/**
 * Astro integration that sets up a Vite virtual module to expose configured favicon data and
 * injects routes to serve the favicons from.
 */
function astroIntegrationFavicon({
	faviconIsInPublicDir = false,
	favicon,
	icoFallback,
	externalFavicon,
}: FaviconsModule & { faviconIsInPublicDir?: boolean } = {}): AstroIntegration {
	const virtualModuleId = 'virtual:starlight/favicons';
	const virtualModuleResolvedId = '\0' + virtualModuleId;

	// https://vite.dev/guide/api-plugin#hook-filters
	const pluginResolveIdIdFilter = new RegExp(`^${virtualModuleId}$`);
	const pluginLoadIdFilter = new RegExp(`^${virtualModuleResolvedId}$`);

	return {
		name: 'starlight-favicon',
		hooks: {
			'astro:config:setup'({ injectRoute, updateConfig }) {
				updateConfig({
					vite: {
						plugins: [
							{
								name: 'starlight-favicon',

								resolveId: {
									filter: { id: pluginResolveIdIdFilter },
									handler(id): string | void {
										if (id === virtualModuleId) return virtualModuleResolvedId;
									},
								},

								load: {
									filter: { id: pluginLoadIdFilter },
									handler(id): string | void {
										if (id === virtualModuleResolvedId) {
											return `export default ${JSON.stringify({ favicon, icoFallback, externalFavicon })};`;
										}
									},
								},
							},
						],
					},
				});

				// Inject routes for the favicon and `.ico` fallback file.
				// We need two separate routes because Astro does not support file endpoints with different
				// file types when a user configures `trailingSlash: "always"`. Varying extensions from one
				// endpoint’s `getStaticPaths()` (e.g. `icon.ico` and `icon.png`) requires a plain `pattern`
				// like `[filename]`, but when it detects a pattern without an extension, Astro enforces the
				// trailing slash and only accepts requests like `/favicon.ico/` resulting in 404s in dev.

				if (favicon && !faviconIsInPublicDir) {
					// If the user’s favicon is already in the public directory, we don’t need to inject the
					// route, because Astro will handle exposing it for us.
					injectRoute({
						prerender: true,
						pattern: favicon.attrs.href,
						entrypoint: new URL('./endpoint.ts', import.meta.url),
					});
				}

				if (icoFallback) {
					injectRoute({
						prerender: true,
						pattern: icoFallback.attrs.href,
						entrypoint: new URL('./fallback-endpoint.ts', import.meta.url),
					});
				}
			},
		},
	};
}

/**
 * Adds ICO header bytes to a PNG buffer to create a valid ICO file.
 * @see https://en.wikipedia.org/wiki/ICO_(file_format)#Structure
 */
function pngToIco(png: Buffer, size: number) {
	// The ICO header is 6 bytes + 16 bytes for each embedded image, so in our single-image case it is 22 bytes.
	const headerLength = 22;

	/** Header bytes for the ICO file. */
	const header = Buffer.alloc(headerLength);

	// ICONDIR - identifies the file as an ICO. Fields are 2 bytes each.
	header.writeUInt16LE(0, 0); // idReserved: Reserved field that must be 0
	header.writeUInt16LE(1, 2); // idType: Specifies the type of image (1 = ICO)
	header.writeUInt16LE(1, 4); // idCount: Number of images in the file.

	// ICONDIRENTRY - embeds the image data (we just use a single image)
	// 1-byte fields
	header.writeUInt8(size, 6); // bWidth: Image width in pixels.
	header.writeUInt8(size, 7); // bHeight: Image height in pixels.
	header.writeUInt8(0, 8); // bColorCount: Number of colors in the color table (0 = 8 bits per pixel)
	header.writeUInt8(0, 9); // bReserved: Reserved field that must be 0
	// 2-byte fields
	header.writeUInt16LE(1, 10); // wPlanes: Specifies color planes. Should be 0 or 1.
	header.writeUInt16LE(32, 12); // wBitCount: Specifies bits per pixel.
	// 4-byte fields
	header.writeUInt32LE(png.length, 14); // dwBytesInRes: Image data size in bytes.
	header.writeUInt32LE(headerLength, 18); // dwImageOffset: Offset to image data, which in our single-image case is just the header length.

	return Buffer.concat([header, png]);
}
