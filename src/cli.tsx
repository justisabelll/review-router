#!/usr/bin/env bun
import {useEffect, useState} from 'react';
import {Box, render, Text} from 'ink';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import CredentialsSetup, {Config} from './views/credential-setup';
import {Octokit} from 'octokit';
import {setOpenCodeAuth} from '../util/opencode';
import {createOctokit, GitHubRepos} from '../util/ocktokit';
// import meow from 'meow';

import {useQuery} from '@tanstack/react-query';

const qc = new QueryClient();

const config = (await Bun.file('config.json').json()) as unknown as Config;

let octokit: Octokit;

const App = () => {
	const [isAnyAuth, setIsAnyAuth] = useState<boolean>(() =>
		Boolean(
			config.credentials.opencode.openrouter || config.credentials.github_PAT,
		),
	);

	return isAnyAuth ? (
		<Auth />
	) : (
		<CredentialsSetup onDone={() => setIsAnyAuth(true)} />
	);
};

const Auth = () => {
	octokit = createOctokit(config.credentials.github_PAT);
	setOpenCodeAuth(config.credentials.opencode.openrouter);

	const {data, isLoading} = useQuery<GitHubRepos>({
		queryKey: ['repos'],
		queryFn: async () => {
			return await octokit.paginate(
				octokit.rest.repos.listForAuthenticatedUser,
				{
					affiliation: 'owner',
					per_page: 100,
				},
			);
		},
		enabled: Boolean(config.credentials.github_PAT),
	});

	if (isLoading || !data) {
		return null;
	}

	const want = data.find(repo => repo.name === 'review-router');

	console.log(want?.created_at);

	return (
		<Box flexDirection="column">
			<Text>Welcome to Review Router</Text>
		</Box>
	);
};

render(
	<QueryClientProvider client={qc}>
		<App />
	</QueryClientProvider>,
);

// const cli = meow(
// 	`
// 	Usage
// 	  $ review-router

// 	Options
// 		--name  Your name

// 	Examples
// 	  $ review-router --name=Jane
// 	  Hello, Jane
// `,
// 	{
// 		importMeta: import.meta,
// 		flags: {
// 			name: {
// 				type: 'string',
// 			},
// 		},
// 	},
// );

//render(<App name={cli.flags.name} />);
