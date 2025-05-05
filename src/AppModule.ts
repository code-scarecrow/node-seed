import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { HttpConfigService } from './infrastructure/secondary-adapters/http/config/HttpConfigService';
import { dynamodbConfig } from './infrastructure/secondary-adapters/dynamodb/config/DynamodbConfig';
import { DynamodbClient } from './infrastructure/secondary-adapters/dynamodb/clients/DynamodbClient';
import { cacheConfig } from './infrastructure/secondary-adapters/redis/config/CacheConfig';
import { ValidateCountryCodeMiddleware } from './infrastructure/primary-adapters/http/middleware/ValidateCountryCodeMiddleware';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { UserCreateListener } from './infrastructure/primary-adapters/message-queue/listeners/user/UserCreateListener';
import { RabbitRepository } from './infrastructure/secondary-adapters/dynamodb/repositories/RabbitRepository';
import { RABBIT_REPO } from './application/interfaces/IRabbitRepository';
import { SUPER_HERO_REPO } from './application/interfaces/ISuperHeroRepository';
import { loggerConfig } from './infrastructure/base/logger/LoggerConfig';
import { LogModule, LoggerConfig, QueueInterceptor } from '@code-scarecrow/base/logger';
import { COUNTRY_REPO } from './application/interfaces/ICountryRepository';
import { CountryRepository } from './infrastructure/secondary-adapters/database/repositories/CountryRepository';
import { CLUB_REPO } from './application/interfaces/IClubRepository';
import { ClubRepository } from './infrastructure/secondary-adapters/database/repositories/ClubRepository';
import { PLAYER_REPO } from './application/interfaces/IPlayerRepository';
import { PlayerRepository } from './infrastructure/secondary-adapters/database/repositories/PlayerRepository';
import { WORLD_CUP_REPO } from './application/interfaces/IWorldCupRepository';
import { WorldCupRepository } from './infrastructure/secondary-adapters/database/repositories/WorldCupRepository';
import { rabbitMQConfig } from './infrastructure/secondary-adapters/message-queue/config/RabbitMQConfig';
import { USER_CREATE_MESSAGE_PRODUCER } from './application/interfaces/IUserCreateMessageProducer';
import { USER_REPO } from './application/interfaces/IUserRepository';
import { UserRepository } from './infrastructure/secondary-adapters/database/repositories/UserRepository';
import { userCreateQueueConfig } from './infrastructure/secondary-adapters/message-queue/producers/config/UserCreateQueueConfig';
import { UserCreateProducer } from './infrastructure/secondary-adapters/message-queue/producers/user/UserCreateProducer';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisConfig } from './infrastructure/secondary-adapters/redis/client/RedisConfig';
import { controllers } from './infrastructure/primary-adapters/http/controllers';
import { services } from './application/services';
import { UserFinishCreationProducer } from './infrastructure/secondary-adapters/message-queue/producers/user/UserFinishCreationProducer';
import { USER_FINISH_CREATION_PRODUCER } from './application/interfaces/IUserFinishCreationProducer';
import { userFinishCreationConfig } from './infrastructure/secondary-adapters/message-queue/producers/config/UserFinishCreationConfig';
import { S3Module } from 'nestjs-s3';
import { awsClientS3Config } from './infrastructure/secondary-adapters/s3/config/AWSClientS3Config';
import { FilesRepository } from './infrastructure/secondary-adapters/s3/repositories/FilesRepository';
import { FILE_REPO } from './application/interfaces/IFileRepository';
import { ClubCacheRepository } from './infrastructure/secondary-adapters/redis/repositories/ClubCacheRepository';
import { CLUB_CACHE_REPO } from './application/interfaces/IClubCacheRepository';
import { AxiosInstanceFactory } from '@code-scarecrow/base';
import { SuperHeroRepository } from './infrastructure/secondary-adapters/http/super-hero/repositories/SuperHeroRepository';
import { SuperHeroClient } from './infrastructure/secondary-adapters/http/super-hero/client/SuperHeroClient';
import { httpSuperHeroConfig } from './infrastructure/secondary-adapters/http/super-hero/config/HttpSuperHeroConfig';
import { PrismaService } from './infrastructure/secondary-adapters/database/client/PrismaService';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [
				dynamodbConfig,
				cacheConfig,
				rabbitMQConfig,
				httpSuperHeroConfig,
				loggerConfig,
				userCreateQueueConfig,
				userFinishCreationConfig,
				awsClientS3Config,
			],
			isGlobal: true,
			cache: true,
		}),
		RabbitMQModule.forRootAsync(RabbitMQModule, {
			inject: [rabbitMQConfig.KEY],
			useFactory: (config: ConfigType<typeof rabbitMQConfig>) => config,
		}),
		HttpModule.registerAsync({
			imports: [ConfigModule],
			useClass: HttpConfigService,
		}),
		LogModule.register({
			provide: LoggerConfig,
			useFactory: (pktLoggerConfig: ConfigType<typeof loggerConfig>) => {
				return pktLoggerConfig;
			},
			inject: [{ token: loggerConfig.KEY, optional: false }],
		}),
		RedisModule.forRootAsync({
			useClass: RedisConfig,
		}),
		S3Module.forRootAsync({
			inject: [awsClientS3Config.KEY],
			useFactory: (config: ConfigType<typeof awsClientS3Config>) => config,
		}),
	],
	controllers: [...controllers],
	providers: [
		...services,
		DynamodbClient,
		SuperHeroClient,
		AxiosInstanceFactory,
		{ provide: RABBIT_REPO, useClass: RabbitRepository },
		{ provide: SUPER_HERO_REPO, useClass: SuperHeroRepository },
		{ provide: COUNTRY_REPO, useClass: CountryRepository },
		{ provide: CLUB_REPO, useClass: ClubRepository },
		{ provide: PLAYER_REPO, useClass: PlayerRepository },
		{ provide: WORLD_CUP_REPO, useClass: WorldCupRepository },
		{ provide: USER_REPO, useClass: UserRepository },
		{ provide: USER_CREATE_MESSAGE_PRODUCER, useClass: UserCreateProducer },
		{ provide: USER_FINISH_CREATION_PRODUCER, useClass: UserFinishCreationProducer },
		{ provide: FILE_REPO, useClass: FilesRepository },
		{ provide: CLUB_CACHE_REPO, useClass: ClubCacheRepository },
		UserCreateListener,
		QueueInterceptor,
		PrismaService,
	],
})
export class AppModule {
	public configure(consumer: MiddlewareConsumer): void {
		consumer.apply(ValidateCountryCodeMiddleware).exclude('health-check', 'info').forRoutes('*');
	}
}
