import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { QueueInterceptor } from '@code-scarecrow/base/logger';
import { IUserCreateMessageProducer } from 'src/application/interfaces/IUserCreateMessageProducer';
import { UserEntity } from 'src/domain/entities/UserEntity';
import { userCreateQueueConfig } from '../config/UserCreateQueueConfig';
import { UserCreateMessage } from './UserCreateMessage';
import { MessageClient, safeGetConfig } from '@code-scarecrow/base';

@Injectable()
export class UserCreateProducer extends MessageClient<UserCreateMessage> implements IUserCreateMessageProducer {
	constructor(
		@Inject(userCreateQueueConfig.KEY) config: ConfigType<typeof userCreateQueueConfig>,
		amqpConnection: AmqpConnection,
		interceptor: QueueInterceptor,
	) {
		super(config.queue, amqpConnection, interceptor, safeGetConfig('APP_NAME'));
	}

	public send(user: Omit<UserEntity, 'id'>): void {
		this.publish(new UserCreateMessage(user));
	}
}
