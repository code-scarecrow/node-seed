import { MessageHandlerErrorBehavior, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/application/services/UserService';
import { IUserIncommingMessage } from './IUserIncommingMessage';
import { BaseMessageHandler, IRabbitMessage } from 'src/base/rabbit';
import { Logger, QueueInterceptor } from 'src/base/logger';

@Injectable()
export class UserCreateListener extends BaseMessageHandler {
	constructor(
		private readonly userService: UserService,
		private readonly interceptor: QueueInterceptor,
		logger: Logger,
	) {
		super(logger);
	}

	@RabbitSubscribe({
		queue: 'ms-seed-consumer',
		createQueueIfNotExists: false,
		errorBehavior: MessageHandlerErrorBehavior.ACK,
	})
	public async handleMessage(msg: IRabbitMessage<IUserIncommingMessage>): Promise<void> {
		await this.runWithTryCath(async () => {
			const response = await this.userService.create(msg.data);
			this.interceptor.logMessage(`USER CREATE: ${JSON.stringify(response)}`);
		});
	}
}
