import { stopDocker } from '../base/DockerWrapper';
import { container } from './setup';

export const takeDownS3 = async function (): Promise<void> {
	await stopDocker('S3', async () => {
		if (container) await container.stop();
	});
};
