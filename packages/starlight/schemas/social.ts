import { z } from 'astro/zod';

export const socialLinks = [
	'twitter',
	'mastodon',
	'github',
	'gitlab',
	'bitbucket',
	'discord',
	'gitter',
	'codeberg',
	'codePen',
	'youtube',
	'threads',
	'linkedin',
	'twitch',
	'azureDevOps',
	'microsoftTeams',
	'instagram',
	'stackOverflow',
	'x.com',
	'telegram',
	'rss',
	'facebook',
	'email',
	'reddit',
	'patreon',
	'signal',
	'slack',
	'matrix',
	'openCollective',
	'hackerOne',
	'blueSky',
	'discourse',
	'zulip',
	'pinterest',
	'tiktok',
	'nostr',
	'backstage',
	'farcaster',
	'confluence',
	'jira',
	'storybook',
	'npm',
	'sourcehut',
	'substack',
] as const;

export const SocialLinksSchema = () =>
	z
		.record(
			z.enum(socialLinks),
			// Link to the respective social profile for this site
			z.string().url()
		)
		.transform((links) => {
			const labelledLinks: Partial<Record<keyof typeof links, { label: string; url: string }>> = {};
			for (const _k in links) {
				const key = _k as keyof typeof links;
				const url = links[key];
				if (!url) continue;
				const label = {
					github: 'GitHub',
					gitlab: 'GitLab',
					bitbucket: 'Bitbucket',
					discord: 'Discord',
					gitter: 'Gitter',
					twitter: 'Twitter',
					mastodon: 'Mastodon',
					codeberg: 'Codeberg',
					codePen: 'CodePen',
					youtube: 'YouTube',
					threads: 'Threads',
					linkedin: 'LinkedIn',
					twitch: 'Twitch',
					azureDevOps: 'Azure DevOps',
					microsoftTeams: 'Microsoft Teams',
					instagram: 'Instagram',
					stackOverflow: 'Stack Overflow',
					'x.com': 'X',
					telegram: 'Telegram',
					rss: 'RSS',
					facebook: 'Facebook',
					email: 'Email',
					reddit: 'Reddit',
					patreon: 'Patreon',
					signal: 'Signal',
					slack: 'Slack',
					matrix: 'Matrix',
					openCollective: 'Open Collective',
					hackerOne: 'Hacker One',
					blueSky: 'BlueSky',
					discourse: 'Discourse',
					zulip: 'Zulip',
					pinterest: 'Pinterest',
					tiktok: 'TikTok',
					nostr: 'Nostr',
					backstage: 'Backstage',
					farcaster: 'Farcaster',
					confluence: 'Confluence',
					jira: 'Jira',
					storybook: 'Storybook',
					npm: 'npm',
					sourcehut: 'SourceHut',
					substack: 'Substack',
				}[key];
				labelledLinks[key] = { label, url };
			}
			return labelledLinks;
		})
		.optional();
