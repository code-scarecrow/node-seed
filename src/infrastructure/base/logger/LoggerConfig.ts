import { registerAs } from '@nestjs/config';
import { LoggerConfig, LogLevels } from 'src/base/logger';
import { getRequiredConfig } from 'src/base/nest/config';

export const loggerConfig = registerAs('Logger', (): LoggerConfig => {
	return {
		appName: getRequiredConfig('APP_NAME'),
		minimumLogLevel: LogLevels.INFO,
	};
});
