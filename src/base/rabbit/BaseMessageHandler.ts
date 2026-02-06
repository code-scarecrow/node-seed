import { Logger } from '../logger';

export class BaseMessageHandler {
	constructor(private readonly logger: Logger) {}

	public async runWithTryCath(exec: () => Promise<unknown>): Promise<void> {
		try {
			await exec();
		} catch (error) {
			if (error instanceof Error) this.logger.error(error.message);
			throw error;
		}
	}
}
