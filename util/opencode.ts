import {createOpencodeClient, createOpencodeServer} from '@opencode-ai/sdk';

// instances or or null if not started
let serverPromise: ReturnType<typeof createOpencodeServer> | null = null;
let client: ReturnType<typeof createOpencodeClient> | null = null;

/**
 * ensures that the OpenCode server is running and returns the server promise.
 * if the server is not already started, it starts a new one on localhost with an ephemeral port.
 * also sets up process event handlers to gracefully shut down the server on exit or termination signals.
 */
const ensureServer = (): ReturnType<typeof createOpencodeServer> => {
	if (!serverPromise) {
		// start the server on 127.0.0.1 with random available port
		serverPromise = createOpencodeServer({
			hostname: '127.0.0.1',
			// 0 = choose an ephemeral port to avoid EADDRINUSE during hot reload
			port: 0,
			config: {},
		});

		// once the server is started, set up cleanup handlers
		serverPromise.then(server => {
			// helper to safely close the server
			const safeClose = () => {
				try {
					server.close();
				} catch {}
			};

			// ensure  server shuts down on process exits
			process.on('exit', safeClose);
			process.on('SIGINT', () => {
				safeClose();
				process.exit(0);
			});
			process.on('SIGTERM', () => {
				safeClose();
				process.exit(0);
			});
		});
	}

	return serverPromise;
};

export const getOpencode = async () => {
	const server = await ensureServer();
	if (!client) {
		client = createOpencodeClient({
			baseUrl: server.url,
			responseStyle: 'data',
		});
	}
	return client;
};

export const setOpenCodeAuth = async (apiKey: string) => {
	const oc = await getOpencode();
	await oc.auth.set({
		path: {
			id: 'openrouter',
		},
		body: {
			type: 'api',
			key: apiKey,
		},
	});
};

export const stopOpencodeServer = async () => {
	if (!serverPromise) return;
	const server = await serverPromise;
	server.close();
	serverPromise = null;
	client = null;
};
