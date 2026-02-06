import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import { setUpPipeline, setUpPrefix, setUpSwagger } from './AppConfigurator';
import { Transport } from '@nestjs/microservices';
import { getRequiredConfig } from 'src/base/nest/config';
import { Logger, NestLoggerAdapter } from './base/logger';

async function initApp(): Promise<void> {
	const app = await NestFactory.create(AppModule, { bufferLogs: true });
	app.useLogger(new NestLoggerAdapter(app.get(Logger)));

	setUpPrefix(app);
	setUpSwagger(app);
	setUpPipeline(app);
	app.connectMicroservice({
		transport: Transport.RMQ,
		options: {
			urls: [getRequiredConfig('RABBIT_URI')],
			queueOptions: { durable: false },
		},
	});

	await app.startAllMicroservices();
	await app.listen(3000);
}
void initApp();
