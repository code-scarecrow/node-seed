import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFound } from 'src/domain/errors/EntityNotFound';
import { CountryService } from './CountryService';
import { IWorldCupRepository, WORLD_CUP_REPO, WorldCupCreation } from '../interfaces/IWorldCupRepository';
import { WorldCup } from 'src/domain/entities/WorldCup';
//import { IUOWFactory, UOW_FACTORY } from '@code-scarecrow/base/database';

@Injectable()
export class WorldCupService {
	constructor(
		@Inject(WORLD_CUP_REPO) private readonly worldCupRepository: IWorldCupRepository,
		private readonly countryService: CountryService, //@Inject(UOW_FACTORY) private readonly uow: IUOWFactory,
	) {}

	public async create(countryId: string, worldCup: Omit<WorldCupCreation, 'locationId'>): Promise<WorldCup> {
		const country = await this.countryService.findByUuid(countryId);

		return await this.worldCupRepository.create({ ...worldCup, locationId: country.id });
	}

	public async update(
		id: string,
		countryId: string,
		worldCup: Omit<WorldCupCreation, 'locationId'>,
	): Promise<WorldCup> {
		const country = await this.countryService.findByUuid(countryId);
		const worldCupDb = await this.findByUuid(id);

		return await this.worldCupRepository.update({ id: worldCupDb.id }, { ...worldCup, locationId: country.id });
	}

	public async delete(id: string): Promise<void> {
		await this.worldCupRepository.deleteByUuid(id);
	}

	public async findByUuid(uuid: string): Promise<WorldCup> {
		const worldCup = await this.worldCupRepository.findByUuid(uuid);

		if (!worldCup) throw new EntityNotFound('WorldCup');
		return worldCup;
	}

	public async findAll(): Promise<WorldCup[]> {
		return await this.worldCupRepository.findAll();
	}

	public async addParticipants(id: string, countriesUuids: string[]): Promise<void> {
		const countries = await this.countryService.findAllByUuid(countriesUuids);
		await this.worldCupRepository.addParticipants(id, countries);
	}

	public async getWithParticipants(id: string): Promise<WorldCup> {
		const worldCup = await this.worldCupRepository.findOneWithParticipants(id);

		if (!worldCup) throw new EntityNotFound('WorldCup');

		return worldCup;
	}
}
