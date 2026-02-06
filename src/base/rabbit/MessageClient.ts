import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Client } from './Client';
import { QueueInterceptor } from '../logger';

export abstract class MessageClient<T> extends Client<T> {
	private readonly queue: string;

	constructor(queue: string, queueClient: AmqpConnection, interceptor: QueueInterceptor, appName: string) {
		super(queueClient, interceptor, appName);
		this.queue = queue;
	}

	public publish(data: T): void {
		this.queueClient.channel.sendToQueue(this.queue, this.createMessage(data));
	}
}
