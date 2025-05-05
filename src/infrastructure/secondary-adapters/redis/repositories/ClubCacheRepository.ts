import { Injectable } from '@nestjs/common';
import { Logger } from '@code-scarecrow/base/logger';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { RedisBaseRepository } from './RedisBaseRepository';
import { Club } from 'src/domain/entities/Club';
import { IClubCacheRepository } from 'src/application/interfaces/IClubCacheRepository';

@Injectable()
export class ClubCacheRepository extends RedisBaseRepository implements IClubCacheRepository {
	private readonly keyPrefix = 'club-';

	constructor(logger: Logger, redisService: RedisService) {
		super(logger, redisService.getOrThrow());
	}

	public async getCache(uuid: string): Promise<Club | null> {
		const res = await this.get(this.getKey(uuid));
		if (!res) return null;
		return JSON.parse(res, this.mapFoundationDate);
	}

	public async saveCache(club: Club): Promise<void> {
		await this.save(this.getKey(club.uuid), JSON.stringify(club), 30);
	}

	public async deleteCache(uuid: string): Promise<void> {
		await this.delete(this.getKey(uuid));
	}

	private getKey(uuid: string): string {
		return this.keyPrefix + uuid;
	}

	private mapFoundationDate(key: string, value: string): Date | string {
		if (key === 'foundationDate' || key === 'createdAt' || key === 'updatedAt') {
			return new Date(value);
		}
		return value;
	}
}
