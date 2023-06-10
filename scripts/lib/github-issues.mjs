/**
 * Note: This module is only here to avoid including octokit.js with hundreds of dependencies,
 * which would slow down the install task of our GitHub workflows.
 *
 * If we want to switch to octokit.js at one point, we should make this code independent from
 * our scripts by creating separate GitHub actions with their own repos and compilation steps.
 */

import fetch from 'node-fetch';
import { githubGet } from './github-get.mjs';
import output from './output.mjs';

/**
 * Searches for issues matching the given criteria.
 *
 * @return {{
 *     number: number;
 *     title: string;
 *     user: {
 *         login: string;
 *     };
 *     body: string;
 *     state: 'open' | 'closed';
 *     locked: boolean;
 *     labels: string[];
 *     created_at: date;
 *     updated_at: date;
 *     closed_at: date | null;
 * }} An array of issue objects.
 */
export async function search({
	repo,
	title,
	author,
	open,
	ascending = true,
	githubToken = undefined,
}) {
	const url = new URL('https://api.github.com/search/issues');

	const queryParts = [
		'type:issue',
		repo && `repo:${repo}`,
		author && `author:${author}`,
		open !== undefined && `state:${open ? 'open' : 'closed'}`,
		title && `in:title ${title}`,
	];

	url.searchParams.set('q', queryParts.filter((part) => part).join(' '));
	url.searchParams.set('sort', 'created');
	url.searchParams.set('order', ascending ? 'asc' : 'desc');
	url.searchParams.set('per_page', '100');

	const json = await githubGet({
		url,
		githubToken,
	});

	if (json.total_count !== json.items.length) {
		output.warning(
			`Query "${url}" returned a total_count of ${json.total_count}, ` +
				`but items.length was ${json.items.length}. Pagination is not supported yet.`
		);
	}

	return json.items;
}

/**
 * Gets an existing issue specified by `repo` and `issueNumber`.
 */
export async function get({ repo, issueNumber, githubToken = undefined }) {
	if (typeof issueNumber !== 'number' || !(issueNumber > 0))
		throw new Error(
			`Missing or invalid property "issueNumber": Expected a positive number, but got ${JSON.stringify(
				issueNumber
			)}`
		);

	requireStringProps({ repo });

	const url = new URL(`https://api.github.com/repos/${repo}/issues/${issueNumber}`);

	const issue = await githubGet({
		url,
		githubToken,
	});

	return issue;
}

/**
 * Creates a new issue in `repo` with the given contents.
 *
 * Returns the newly created issue object.
 */
export async function create({ repo, title, body, labels, githubToken }) {
	requireStringProps({
		repo,
		title,
		body,
	});

	const url = new URL(`https://api.github.com/repos/${repo}/issues`);

	const createdIssue = await githubWrite({
		method: 'post',
		url,
		body: {
			title,
			body,
			labels,
		},
		githubToken,
	});

	return createdIssue;
}

/**
 * Updates an existing issue specified by `repo` and `issueNumber`.
 */
export async function update({ repo, issueNumber, title, body, labels, githubToken }) {
	if (typeof issueNumber !== 'number' || !(issueNumber > 0))
		throw new Error(
			`Missing or invalid property "issueNumber": Expected a positive number, but got ${JSON.stringify(
				issueNumber
			)}`
		);

	requireStringProps({ repo });
	optionalTypeProps('string', {
		title,
		body,
	});

	const url = new URL(`https://api.github.com/repos/${repo}/issues/${issueNumber}`);

	const createdIssue = await githubWrite({
		method: 'patch',
		url,
		body: {
			title,
			body,
			labels,
		},
		githubToken,
	});

	return createdIssue;
}

async function githubWrite({ method, url, body, githubToken }) {
	const allowedMethods = ['post', 'patch', 'put', 'delete'];
	if (typeof method !== 'string' || !allowedMethods.includes(method.toLowerCase()))
		throw new Error(
			`GitHub API call failed: Expected "method" to be one of ${JSON.stringify(
				allowedMethods
			)}, but got ${JSON.stringify(method)}`
		);

	if (typeof githubToken !== 'string' || !githubToken.length)
		throw new Error(
			`GitHub API call failed: ${method.toUpperCase()} "${url}" requires githubToken, but none was provided`
		);

	const response = await fetch(url, {
		method: method.toLowerCase(),
		headers: {
			Accept: 'application/vnd.github.v3+json',
			Authorization: `token ${githubToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});
	const json = await response.json();

	if (!response.ok)
		throw new Error(
			`GitHub API call failed: ${method.toUpperCase()} "${url}" returned status ${
				response.status
			}: ${JSON.stringify(json)}`
		);

	return json;
}

function requireStringProps(props) {
	Object.keys(props).forEach((key) => {
		const val = props[key];
		if (typeof val !== 'string' || !val.length)
			throw new Error(
				`Missing or invalid property "${key}": Expected a non-empty string, but got ${JSON.stringify(
					val
				)}`
			);
	});
}

function optionalTypeProps(expectedTypeOrUndefined, props) {
	Object.keys(props).forEach((key) => {
		const val = props[key];
		if (val !== undefined && typeof val !== expectedTypeOrUndefined)
			throw new Error(
				`Invalid type of optional property "${key}": Expected ${expectedTypeOrUndefined} or undefined, but got ${typeof val} ${JSON.stringify(
					val
				)}`
			);
	});
}

// #endregion

export default {
	search,
	get,
	create,
	update,
};
