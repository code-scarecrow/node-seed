import { stopDocker } from '../base/DockerWrapper';
import { container } from './setup';

export const takeDownRabbit = async function (): Promise<void> {
	await stopDocker('RabbitMQ', async () => {
		if (container) await container.stop();
	});
};
