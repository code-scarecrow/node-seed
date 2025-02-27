import { registerAs } from '@nestjs/config';
import { ICacheConfig } from './ICacheConfig';
import { safeGetConfig } from '@code-scarecrow/base';

export const cacheConfig = registerAs('cache', (): ICacheConfig => {
	return {
		config: {
			host: safeGetConfig('REDIS_HOST'),
			port: parseInt(safeGetConfig('REDIS_PORT')),
			password: safeGetConfig('REDIS_PASSWORD'),
		},
	};
});
