import { Injectable } from '@nestjs/common';
import { Logger } from '../core/Logger';
import { storage } from './Storage';

@Injectable()
export class QueueInterceptor {
	constructor(private readonly logger: Logger) {}

	public getTraceId(): string {
		const traceId = storage.getStore();
		if (!traceId) throw new Error('traceId not found');
		return traceId;
	}

	public logMessage(message: unknown): void {
		this.logger.info('Outgoing Message', message);
	}
}
