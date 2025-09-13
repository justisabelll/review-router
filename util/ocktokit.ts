import {Octokit} from 'octokit';
import {Endpoints} from '@octokit/types';

export const createOctokit = (apiKey: string) => {
	return new Octokit({
		auth: apiKey,
		request: {headers: {'X-GitHub-Api-Version': '2022-11-28'}},
	});
};

export type GitHubRepos = Endpoints['GET /user/repos']['response']['data'];
