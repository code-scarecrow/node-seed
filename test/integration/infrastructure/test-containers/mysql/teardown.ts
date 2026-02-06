import { stopDocker } from '../base/DockerWrapper';
import { container } from './setup';

export const takeDownMysql = async function (): Promise<void> {
	await stopDocker('mysql', async () => {
		if (container) await container.stop();
	});
};
