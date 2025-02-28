import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFound } from 'src/domain/errors/EntityNotFound';
import { CountryService } from './CountryService';
import { IWorldCupRepository, WORLD_CUP_REPO } from '../interfaces/IWorldCupRepository';
import { WorldCupEntity } from 'src/domain/entities/WorldCupEntity';
import { IUOWFactory, UOW_FACTORY } from '@code-scarecrow/base/database';

@Injectable()
export class WorldCupService {
	constructor(
		@Inject(WORLD_CUP_REPO) private readonly worldCupRepository: IWorldCupRepository,
		private readonly countryService: CountryService,
		@Inject(UOW_FACTORY) private readonly uow: IUOWFactory,
	) {}

	public async create(countryId: string, worldCup: WorldCupEntity): Promise<WorldCupEntity> {
		const country = await this.countryService.findByUuid(countryId);
		worldCup.location = country;

		return await this.worldCupRepository.create(worldCup);
	}

	public async update(id: string, countryId: string, worldCup: WorldCupEntity): Promise<WorldCupEntity> {
		const country = await this.countryService.findByUuid(countryId);
		const worldCupDb = await this.findByUuid(id);
		worldCup.uuid = worldCupDb.uuid;
		worldCup.location = country;

		return await this.worldCupRepository.update({ id: worldCupDb.id }, worldCup);
	}

	public async delete(id: string): Promise<void> {
		const worldCup = await this.findByUuid(id);
		worldCup.participants = [];
		const uow = this.uow.getUnitOfWork();

		await uow.runSafe(async (uw) => {
			await uw.getRepository<IWorldCupRepository, WorldCupEntity>(WorldCupEntity).save(worldCup);
			await uw.getRepository(WorldCupEntity).delete({ id: worldCup.id });
		});
	}

	public async findByUuid(uuid: string): Promise<WorldCupEntity> {
		const worldCup = await this.worldCupRepository.findByUuid(uuid);

		if (!worldCup) throw new EntityNotFound('WorldCup');

		return worldCup;
	}

	public async findAll(): Promise<WorldCupEntity[]> {
		return await this.worldCupRepository.findAll();
	}

	public async addParticipants(id: string, countriesUuids: string[]): Promise<void> {
		const worldCup = await this.findByUuid(id);
		const countries = await this.countryService.findAllByUuid(countriesUuids);
		worldCup.participants = countries;

		await this.worldCupRepository.save(worldCup);
	}

	public async getWithParticipants(id: string): Promise<WorldCupEntity> {
		const worldCup = await this.worldCupRepository.findOneWithParticipants(id);

		if (!worldCup) throw new EntityNotFound('WorldCup');

		return worldCup;
	}
}
