import { IRabbitMessage } from './IRabbitMessage';

export class RabbitMessage<T> implements IRabbitMessage<T> {
	public data: T;
	public timestamp: Date;
	public traceId: string;
	public app: string;

	constructor(data: T, traceId: string, app: string) {
		this.data = data;
		this.timestamp = new Date();
		this.traceId = traceId;
		this.app = app;
	}
}
