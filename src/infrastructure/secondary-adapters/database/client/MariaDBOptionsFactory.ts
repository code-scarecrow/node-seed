import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { databaseConfig } from '../config/DatabaseConfig';

@Injectable()
export class MariaDBOptionsFactory implements TypeOrmOptionsFactory {
	constructor(
		@Inject(databaseConfig.KEY)
		private readonly databaseConfiguration: ConfigType<typeof databaseConfig>,
	) {}

	public createTypeOrmOptions(): TypeOrmModuleOptions {
		return {
			type: 'mariadb',
			...this.databaseConfiguration,
			bigNumberStrings: false,
			supportBigNumbers: true,
			autoLoadEntities: true,
		};
	}
}
