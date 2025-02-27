import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFound } from 'src/domain/errors/EntityNotFound';
import { CLUB_REPO, IClubRepository } from '../interfaces/IClubRepository';
import { ClubEntity } from 'src/domain/entities/ClubEntity';
import { CountryService } from './CountryService';
import { CLUB_CACHE_REPO, IClubCacheRepository } from '../interfaces/IClubCacheRepository';

@Injectable()
export class ClubService {
	constructor(
		@Inject(CLUB_REPO) private readonly clubRepository: IClubRepository,
		private readonly countryService: CountryService,
		@Inject(CLUB_CACHE_REPO) private readonly cacheRepository: IClubCacheRepository,
	) {}

	public async create(countryId: string, club: ClubEntity): Promise<ClubEntity> {
		const country = await this.countryService.findByUuid(countryId);
		club.country = country;

		return await this.clubRepository.create(club);
	}

	public async update(id: string, countryId: string, club: ClubEntity): Promise<ClubEntity> {
		const country = await this.countryService.findByUuid(countryId);
		const clubDb = await this.findByUuid(id);
		club.uuid = clubDb.uuid;
		club.country = country;

		const res = await this.clubRepository.update({ id: clubDb.id }, club);

		await this.cacheRepository.deleteCache(club.uuid);

		return res;
	}

	public async delete(id: string): Promise<void> {
		const club = await this.findByUuid(id);

		await this.clubRepository.delete({ id: club.id });
		await this.cacheRepository.deleteCache(id);
	}

	public async findByUuid(uuid: string): Promise<ClubEntity> {
		const cache = await this.cacheRepository.getCache(uuid);

		if (cache) {
			return cache;
		}

		const club = await this.clubRepository.findByUuid(uuid);

		if (!club) {
			throw new EntityNotFound('Club');
		}

		await this.cacheRepository.saveCache(club);

		return club;
	}

	public async findAll(): Promise<ClubEntity[]> {
		return await this.clubRepository.findAll();
	}
}
