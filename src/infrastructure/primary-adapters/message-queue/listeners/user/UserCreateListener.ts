import { MessageHandlerErrorBehavior, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { Logger, QueueInterceptor } from '@code-scarecrow/base/logger';
import { UserService } from 'src/application/services/UserService';
import { BaseMessageHandler, IRabbitMessage } from '@code-scarecrow/base';
import { IUserIncommingMessage } from './IUserIncommingMessage';

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
