export const startDocker = async function (name: string, fn: () => Promise<void>): Promise<void> {
	try {
		console.log('Setting up ' + name + ' ...');
		await fn();
		console.log('Setting up ' + name + ' completed');
	} catch (err: unknown) {
		if (err instanceof Error) console.log('Error while setting up ' + name + ' docker: ' + err.message);
	}
};

export const stopDocker = async function (name: string, fn: () => Promise<void>): Promise<void> {
	try {
		console.log('Tear down ' + name + ' ...');
		await fn();
		console.log('Tear down ' + name + ' completed');
	} catch (err: unknown) {
		if (err instanceof Error) console.log('Error while setting up ' + name + ' docker: ' + err.message);
	}
};
