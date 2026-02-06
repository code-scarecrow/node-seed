export interface IRabbitMessage<T> {
	data: T;
	timestamp: Date;
	traceId: string;
	app: string;
}
