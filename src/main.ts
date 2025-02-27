import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import { setUpPipeline, setUpPrefix, setUpSwagger } from './AppConfigurator';
import { Logger, NestLoggerAdapter } from '@code-scarecrow/base/logger';
import { Transport } from '@nestjs/microservices';
import { safeGetConfig } from '@code-scarecrow/base';

async function initApp(): Promise<void> {
	const app = await NestFactory.create(AppModule, { bufferLogs: true });
	app.useLogger(new NestLoggerAdapter(app.get(Logger)));

	setUpPrefix(app);
	setUpSwagger(app);
	setUpPipeline(app);
	app.connectMicroservice({
		transport: Transport.RMQ,
		options: {
			urls: [safeGetConfig('RABBIT_URI')],
			queueOptions: { durable: false },
		},
	});

	await app.startAllMicroservices();
	await app.listen(33000);
}
void initApp();
