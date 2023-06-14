import fetch from 'node-fetch';
import pRetry, { AbortError } from 'p-retry';

/**
 * Fetch a URL from the GitHub API and resolve its JSON response.
 * @param {{ url: string; githubToken?: string }} options
 * @returns {Promise<any>}
 */
export async function githubGet({ url, githubToken = undefined }) {
	return await pRetry(
		async () => {
			const headers = {
				Accept: 'application/vnd.github.v3+json',
			};
			if (githubToken) {
				headers.Authorization = `token ${githubToken}`;
			}
			const response = await fetch(url, { headers });
			const json = await response.json();

			if (!response.ok) {
				throw new AbortError(
					`GitHub API call failed: GET "${url}" returned status ${
						response.status
					}: ${JSON.stringify(json)}`
				);
			}

			return json;
		},
		{ retries: 5 }
	);
}
