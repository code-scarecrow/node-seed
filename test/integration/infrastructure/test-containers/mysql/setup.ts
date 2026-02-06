import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { LogWaitStrategy } from 'testcontainers/build/wait-strategies/log-wait-strategy';
import { startDocker } from '../base/DockerWrapper';

export let container: StartedTestContainer | undefined;

export const setUpMysql = async function (debugLog = false): Promise<void> {
	await startDocker('mysql', async () => {
		container = await new GenericContainer('mariadb:10.5')
			.withName('mysql')
			.withExposedPorts({ container: 3306, host: 3306 })
			.withWaitStrategy(new LogWaitStrategy('mysqld: ready for connections.', 1))
			.withEnvironment({
				MYSQL_ROOT_PASSWORD: 'root',
				MYSQL_DATABASE: 'pickit',
				MYSQL_USER: 'pickit',
				MYSQL_PASSWORD: 'pickit',
			})
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
