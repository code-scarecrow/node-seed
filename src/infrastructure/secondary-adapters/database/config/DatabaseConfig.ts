import { registerAs } from '@nestjs/config';
import { IDatabaseConfig } from './IDatabaseConfig';
import { safeGetConfig } from '@code-scarecrow/base';

export const databaseConfig = registerAs('database', (): IDatabaseConfig => {
	return {
		host: safeGetConfig('DATABASE_HOST'),
		port: 3306,
		username: safeGetConfig('DATABASE_USER'),
		password: safeGetConfig('DATABASE_PASS'),
		database: safeGetConfig('DATABASE_NAME'),
		entities: ['**/domain/entities/*Entity.js'],
		autoloadEntities: true,
	};
});
