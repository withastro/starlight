import type { APIRoute } from 'astro';
import data from 'virtual:starlight/favicons';

export const GET = (() => {
	if (!data.favicon) {
		return new Response(null, { status: 404 });
	}

	return new Response(Buffer.from(data.favicon.buffer), {
		headers: { 'Content-Type': data.favicon.attrs.type },
	});
}) satisfies APIRoute;
