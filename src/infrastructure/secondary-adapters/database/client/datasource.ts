import { DataSource } from 'typeorm';
import { safeGetConfig } from '@code-scarecrow/base';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const createDatasource: () => DataSource = () => {
	return new DataSource({
		type: 'mariadb',
		host: safeGetConfig('DATABASE_HOST'),
		port: 3306,
		username: safeGetConfig('DATABASE_USER'),
		password: safeGetConfig('DATABASE_PASS'),
		database: safeGetConfig('DATABASE_NAME'),
		entities: ['**/domain/entities/*Entity.js'],
		migrations: ['**/database/migrations/*.ts'],
		namingStrategy: new SnakeNamingStrategy(),
	});
};

export const datasource = createDatasource();
