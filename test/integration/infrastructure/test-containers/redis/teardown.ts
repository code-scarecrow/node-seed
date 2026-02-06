import { stopDocker } from '../base/DockerWrapper';
import { container } from './setup';

export const takeDownRedis = async function (): Promise<void> {
	await stopDocker('Redis', async () => {
		if (container) await container.stop();
	});
};
