import { Injectable } from '@nestjs/common';
import { Logger } from '@code-scarecrow/base/logger';
import Redis from 'ioredis';

//TODO - move to pkt-base
@Injectable()
export abstract class RedisBaseRepository {
	private logger: Logger;

	constructor(logger: Logger, private readonly redisManager: Redis) {
		this.logger = logger;
	}

	protected async get(key: string): Promise<string | null> {
		try {
			return await this.redisManager.get(key);
		} catch (err) {
			this.logger.error('error readinging redis cache with key: ' + key);
			throw err;
		}
	}

	protected async save(key: string, payload: string, ttl: number): Promise<void> {
		try {
			await this.redisManager.set(key, payload, 'EX', ttl);
		} catch (err) {
			this.logger.error('error saving redis cache with key: ' + key);
			throw err;
		}
	}

	protected async delete(key: string): Promise<void> {
		try {
			await this.redisManager.del(key);
		} catch (err) {
			this.logger.error('error deleting redis cache with key: ' + key);
			throw err;
		}
	}
}
