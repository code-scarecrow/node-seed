import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import { ErrorCodesMapper } from './infrastructure/primary-adapters/filters/ErrorCodesMapper';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Logger, ContextInterceptor, NestLoggingInterceptor } from '@code-scarecrow/base/logger';
import { CustomExceptionsFilter } from './infrastructure/primary-adapters/filters/CustomExceptionsFilter';

export function setUpSwagger(app: INestApplication): void {
	const config = new DocumentBuilder()
		.setTitle('Microservice Seed')
		.setDescription('API description')
		.setVersion('1.0')
		.build();

	const customOptions: SwaggerCustomOptions = {
		customSiteTitle: 'Pickit',
	};

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api/v1.0/docs', app, document, customOptions);
}

export function setUpPipeline(app: INestApplication): void {
	app.useGlobalFilters(new CustomExceptionsFilter(app.get(Logger), new ErrorCodesMapper()));
	app.useGlobalInterceptors(new ContextInterceptor());
	app.useGlobalInterceptors(new NestLoggingInterceptor(app.get(Logger)));
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
		}),
	);
}

export function setUpPrefix(app: INestApplication): void {
	app.setGlobalPrefix('api/v1.0');
}
