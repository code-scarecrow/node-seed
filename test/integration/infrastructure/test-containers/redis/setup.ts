import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { startDocker } from '../base/DockerWrapper';

export let container: StartedTestContainer | undefined;

export const setUpRedis = async function (debugLog = false): Promise<void> {
	await startDocker('Redis', async () => {
		container = await new GenericContainer('redis')
			.withName('redis')
			.withExposedPorts({ container: 6379, host: 6379 })
			.start();

		if (debugLog) {
			const stream = await container.logs();
			stream
				.on('data', (line) => console.log(line))
				.on('err', (line) => console.error(line))
				.on('end', () => console.log('Stream closed'));
		}
	});
};
