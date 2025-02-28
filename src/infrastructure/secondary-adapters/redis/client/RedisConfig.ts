import { Inject, Injectable } from '@nestjs/common';
import { RedisOptionsFactory, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { ConfigType } from '@nestjs/config';
import { cacheConfig } from '../config/CacheConfig';

@Injectable()
export class RedisConfig implements RedisOptionsFactory {
	constructor(
		@Inject(cacheConfig.KEY)
		private readonly cacheConfiguration: ConfigType<typeof cacheConfig>,
	) {}
	public createRedisOptions(): RedisModuleOptions {
		return { ...this.cacheConfiguration };
	}
}
