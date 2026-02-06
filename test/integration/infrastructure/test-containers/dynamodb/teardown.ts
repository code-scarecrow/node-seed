import { stopDocker } from '../base/DockerWrapper';
import { container } from './setup';

export const takeDownDynamo = async function (): Promise<void> {
	await stopDocker('DynamoDB', async () => {
		if (container) await container.stop();
	});
};
