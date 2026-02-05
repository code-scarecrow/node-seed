import { DynamicModule, Provider } from '@nestjs/common';
import { AxiosLoggerInterceptor } from './AxiosLoggerInterceptor';
import { LoggerConfig } from './LoggerConfig';
import { LogProvider } from './LogProvider';

export class LogModule {
	public static register(configProvider: Provider<LoggerConfig>): DynamicModule {
		return {
			module: LogModule,
			providers: [configProvider, AxiosLoggerInterceptor, LogProvider],
			exports: [AxiosLoggerInterceptor, LogProvider],
		};
	}
}
