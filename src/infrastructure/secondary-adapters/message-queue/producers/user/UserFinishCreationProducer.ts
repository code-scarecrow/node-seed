import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { User } from 'src/domain/entities/User';
import { UserCreateMessage } from './UserCreateMessage';
import { IUserFinishCreationProducer } from 'src/application/interfaces/IUserFinishCreationProducer';
import { userFinishCreationConfig } from '../config/UserFinishCreationConfig';
import { EventClient } from 'src/base/rabbit';
import { QueueInterceptor } from 'src/base/logger';
import { getRequiredConfig } from 'src/base/nest/config';

@Injectable()
export class UserFinishCreationProducer extends EventClient<UserCreateMessage> implements IUserFinishCreationProducer {
	constructor(
		@Inject(userFinishCreationConfig.KEY) config: ConfigType<typeof userFinishCreationConfig>,
		amqpConnection: AmqpConnection,
		interceptor: QueueInterceptor,
	) {
		super(config.exchange, 'users.status.created', amqpConnection, interceptor, getRequiredConfig('APP_NAME'));
	}

	public send(user: User): void {
		this.publish(new UserCreateMessage(user));
	}
}
