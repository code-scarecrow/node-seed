import { LoggerService } from '@nestjs/common';
import { Logger } from '../core/Logger';

export class NestLoggerAdapter implements LoggerService {
	constructor(private readonly logger: Logger) {}

	public log(message: string): void {
		this.logger.info(message);
	}
	public error(message: string): void {
		this.logger.error(message);
	}
	public warn(message: string): void {
		this.logger.warn(message);
	}
	public debug(message: string): void {
		this.logger.debug(message);
	}
	public verbose(message: string): void {
		this.logger.debug(message);
	}
}
