import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { QueueInterceptor } from '@code-scarecrow/base/logger';
import { UserEntity } from 'src/domain/entities/UserEntity';
import { UserCreateMessage } from './UserCreateMessage';
import { EventClient, safeGetConfig } from '@code-scarecrow/base';
import { IUserFinishCreationProducer } from 'src/application/interfaces/IUserFinishCreationProducer';
import { userFinishCreationConfig } from '../config/UserFinishCreationConfig';

@Injectable()
export class UserFinishCreationProducer extends EventClient<UserCreateMessage> implements IUserFinishCreationProducer {
	constructor(
		@Inject(userFinishCreationConfig.KEY) config: ConfigType<typeof userFinishCreationConfig>,
		amqpConnection: AmqpConnection,
		interceptor: QueueInterceptor,
	) {
		super(config.exchange, 'users.status.created', amqpConnection, interceptor, safeGetConfig('APP_NAME'));
	}

	public send(user: UserEntity): void {
		this.publish(new UserCreateMessage(user));
	}
}
