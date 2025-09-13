import {useState} from 'react';
import {Box, Newline, Text} from 'ink';

import TextInput from 'ink-text-input';

export interface Config {
	credentials: {
		opencode: {
			openrouter: string;
		};
		github_PAT: string;
	};
}

type Step = {
	label: string;
	key: string;
	validate: (value: string) => boolean;
};

const config = (await Bun.file('config.json').json()) as unknown as Config;

const steps: Step[] = [
	{
		label: 'OpenRouter API Key',
		key: 'openrouter',
		validate: (value: string) => value.length > 0,
	},
	{
		label: 'GitHub Personal Access Token',
		key: 'github',
		validate: (value: string) => value.length > 0,
	},
];

const CredentialsSetup = ({onDone}: {onDone: () => void}) => {
	const [currentStep, setCurrentStep] = useState<number>(0);
	const [OpenRouterKey, setOpenRouterKey] = useState<string>('');
	const [GitHubPAT, setGitHubPAT] = useState<string>('');

	const values: Record<Step['key'], string> = {
		openrouter: OpenRouterKey,
		github: GitHubPAT,
	};
	const setters: Record<Step['key'], (value: string) => void> = {
		openrouter: setOpenRouterKey,
		github: setGitHubPAT,
	};

	const handleSubmit = async () => {
		const step = steps[currentStep];
		const value = values[step?.key as Step['key']]!;

		if (!step?.validate(value)) return;

		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		} else {
			config.credentials.opencode.openrouter = OpenRouterKey;
			config.credentials.github_PAT = GitHubPAT;

			Bun.write('config.json', JSON.stringify(config, null, 2));

			onDone();
		}
	};

	const step = steps[currentStep];

	return (
		<Box flexDirection="column">
			<Text>Welcome to Review Router</Text>
			<Newline />
			<Text>Please enter your credentials to get started</Text>
			<Newline />
			<Box>
				<Text>Please enter your {step?.label}: </Text>
				<TextInput
					showCursor
					value={values[step?.key as Step['key']]!}
					onChange={setters[step?.key as Step['key']]!}
					onSubmit={handleSubmit}
					mask={'*'}
				/>
			</Box>
		</Box>
	);
};

export default CredentialsSetup;
