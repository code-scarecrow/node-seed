import { registerAs } from '@nestjs/config';
import { LogLevels, LoggerConfig } from '@code-scarecrow/base/logger';
import { safeGetConfig } from '@code-scarecrow/base';

export const loggerConfig = registerAs('Logger', (): LoggerConfig => {
	return {
		appName: safeGetConfig('APP_NAME'),
		minimumLogLevel: LogLevels.INFO,
	};
});
