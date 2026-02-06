import { FactoryProvider } from '@nestjs/common';
import { Logger } from '../core/Logger';
import { ConsoleWritter } from '../core/console-log/ConsoleWritter';
import { LoggerConfig } from './LoggerConfig';
import { storage } from './Storage';

export const LogProvider: FactoryProvider<Logger> = {
	provide: Logger,
	useFactory: (loggerConfig: LoggerConfig) => {
		return new Logger(loggerConfig.minimumLogLevel, loggerConfig.appName, new ConsoleWritter(), () =>
			storage.getStore(),
		);
	},
	inject: [{ token: LoggerConfig, optional: false }],
};
