import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFound } from 'src/domain/errors/EntityNotFound';
import { CLUB_REPO, ClubCreation, IClubRepository } from '../interfaces/IClubRepository';
import { Club } from 'src/domain/entities/Club';
import { CountryService } from './CountryService';
import { CLUB_CACHE_REPO, IClubCacheRepository } from '../interfaces/IClubCacheRepository';

@Injectable()
export class ClubService {
	constructor(
		@Inject(CLUB_REPO) private readonly clubRepository: IClubRepository,
		private readonly countryService: CountryService,
		@Inject(CLUB_CACHE_REPO) private readonly cacheRepository: IClubCacheRepository,
	) {}

	public async create(countryId: string, club: Omit<ClubCreation, 'countryId'>): Promise<Club> {
		const country = await this.countryService.findByUuid(countryId);

		return await this.clubRepository.create({ ...club, countryId: country.id });
	}

	public async update(id: string, countryId: string, club: Omit<ClubCreation, 'countryId'>): Promise<Club> {
		const country = await this.countryService.findByUuid(countryId);
		const clubDb = await this.findByUuid(id);

		const res = await this.clubRepository.update({ id: clubDb.id }, { ...club, countryId: country.id });
		await this.cacheRepository.deleteCache(id);

		return res;
	}

	public async delete(id: string): Promise<void> {
		const club = await this.findByUuid(id);

		await this.clubRepository.delete({ id: club.id });
		await this.cacheRepository.deleteCache(id);
	}

	public async findByUuid(uuid: string): Promise<Club> {
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

	public async findAll(): Promise<Club[]> {
		return await this.clubRepository.findAll();
	}
}
