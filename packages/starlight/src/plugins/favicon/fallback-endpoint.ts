import type { APIRoute } from 'astro';
import data from 'virtual:starlight/favicons';

export const GET = (() => {
	if (!data.icoFallback) {
		return new Response(null, { status: 404 });
	}

	return new Response(Buffer.from(data.icoFallback.buffer), {
		headers: { 'Content-Type': data.icoFallback.attrs.type },
	});
}) satisfies APIRoute;
