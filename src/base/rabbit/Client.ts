import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RabbitMessage } from './RabbitMessage';
import { QueueInterceptor } from '../logger';

export abstract class Client<T> {
	protected queueClient: AmqpConnection;
	private readonly interceptor: QueueInterceptor;
	private readonly appName: string;

	constructor(queueClient: AmqpConnection, interceptor: QueueInterceptor, appName: string) {
		this.queueClient = queueClient;
		this.interceptor = interceptor;
		this.appName = appName;
	}

	protected createMessage(data: T): Buffer {
		const message = new RabbitMessage(data, this.interceptor.getTraceId(), this.appName);
		this.interceptor.logMessage(message);
		return Buffer.from(JSON.stringify(message));
	}
}
