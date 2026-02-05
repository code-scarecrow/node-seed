import { registerAs } from '@nestjs/config';
import { ICacheConfig } from './ICacheConfig';
import { getRequiredConfig } from 'src/base/nest/config';

export const cacheConfig = registerAs('cache', (): ICacheConfig => {
	return {
		config: {
			host: getRequiredConfig('REDIS_HOST'),
			port: parseInt(getRequiredConfig('REDIS_PORT')),
			password: getRequiredConfig('REDIS_PASSWORD'),
		},
	};
});
