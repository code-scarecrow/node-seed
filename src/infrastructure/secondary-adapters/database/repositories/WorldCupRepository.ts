import { Injectable } from '@nestjs/common/decorators';
import { IWorldCupRepository, WorldCupCreation } from 'src/application/interfaces/IWorldCupRepository';
import { WorldCup } from 'src/domain/entities/WorldCup';
import { PrismaService } from '../client/PrismaService';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Country } from 'src/domain/entities/Country';
import { v4 } from 'uuid';

@Injectable()
export class WorldCupRepository implements IWorldCupRepository {
	protected readonly repository: Prisma.world_cupsDelegate<DefaultArgs>;
	protected readonly participantsRepository: Prisma.participantsDelegate<DefaultArgs>;
	protected readonly prisma: PrismaService;

	constructor(prisma: PrismaService) {
		this.repository = prisma.world_cups;
		this.participantsRepository = prisma.participants;
		this.prisma = prisma;
	}

	public async findByKey(key: { id: number }): Promise<WorldCup | null> {
		const res = await this.repository.findUnique({
			where: {
				id: key.id,
			},
			include: {
				countries: true,
			},
		});

		if (!res) return null;

		return new WorldCup(res, new Country(res.countries));
	}

	public async create(entity: WorldCupCreation): Promise<WorldCup> {
		const res = await this.repository.create({
			data: {
				uuid: v4(),
				...entity,
			},
			include: {
				countries: true,
			},
		});

		return new WorldCup(res, new Country(res.countries));
	}

	public async update(key: { id: number }, entity: WorldCupCreation): Promise<WorldCup> {
		const res = await this.repository.update({
			where: {
				id: key.id,
			},
			data: {
				...entity,
			},
			include: {
				countries: true,
			},
		});

		return new WorldCup(res, new Country(res.countries));
	}

	public async delete(key: { id: number }): Promise<void> {
		await this.prisma.$transaction([
			this.participantsRepository.deleteMany({
				where: {
					worldCupId: key.id,
				},
			}),
			this.repository.delete({
				where: {
					id: key.id,
				},
			}),
		]);
	}

	public async deleteByUuid(uuid: string): Promise<void> {
		await this.prisma.$transaction([
			this.participantsRepository.deleteMany({
				where: {
					world_cups: {
						uuid,
					},
				},
			}),
			this.repository.delete({
				where: {
					uuid,
				},
			}),
		]);
	}

	public async findAll(): Promise<WorldCup[]> {
		const wc = await this.repository.findMany({ include: { countries: true } });

		return wc.map((res) => {
			return new WorldCup(res, new Country(res.countries));
		});
	}

	public async findByUuid(uuid: string): Promise<WorldCup | null> {
		const res = await this.repository.findUnique({
			where: {
				uuid: uuid,
			},
			include: {
				countries: true,
			},
		});

		if (!res) return null;

		return new WorldCup(res, new Country(res.countries));
	}

	public async findOneWithParticipants(uuid: string): Promise<WorldCup | null> {
		const worldCup = await this.repository.findUnique({
			where: {
				uuid: uuid,
			},
			include: {
				participants: {
					include: {
						countries: true,
					},
				},
				countries: true,
			},
		});

		if (!worldCup) return null;

		return new WorldCup(
			worldCup,
			new Country(worldCup.countries),
			worldCup.participants.map((e) => new Country(e.countries)),
		);
	}

	public async addParticipants(id: string, countries: Country[]): Promise<void> {
		await this.repository.update({
			where: {
				uuid: id,
			},
			data: {
				participants: {
					createMany: {
						data: [
							...countries.map((e) => {
								return {
									countryId: e.id,
								};
							}),
						],
					},
				},
			},
		});
	}
}
