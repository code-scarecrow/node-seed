import { Injectable } from '@nestjs/common/decorators';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { IPlayerRepository, PlayerCreation } from 'src/application/interfaces/IPlayerRepository';
import { Player } from 'src/domain/entities/Player';
import { PrismaService } from '../client/PrismaService';
import { Country } from 'src/domain/entities/Country';
import { Club } from 'src/domain/entities/Club';
import { v4 } from 'uuid';
import { positionEnumMap } from '../mappers/PositionEnumMapper';

@Injectable()
export class PlayerRepository implements IPlayerRepository {
	protected readonly repository: Prisma.playersDelegate<DefaultArgs>;

	constructor(prisma: PrismaService) {
		this.repository = prisma.players;
	}

	public async findAll(): Promise<Player[]> {
		const res = await this.repository.findMany({
			include: { clubs: { include: { countries: true } }, countries: true },
		});

		return res.map((r) => {
			return new Player(
				r,
				positionEnumMap.get(r.position),
				new Club(r.clubs, new Country(r.clubs.countries)),
				new Country(r.countries),
			);
		});
	}

	public async findByKey(key: { id: number }): Promise<Player | null> {
		const res = await this.repository.findUnique({
			where: { id: key.id },
			include: { clubs: { include: { countries: true } }, countries: true },
		});

		if (!res) return null;

		return new Player(
			res,
			positionEnumMap.get(res.position),
			new Club(res.clubs, new Country(res.clubs.countries)),
			new Country(res.countries),
		);
	}

	public async create(entity: PlayerCreation): Promise<Player> {
		const res = await this.repository.create({
			data: {
				uuid: v4(),
				...entity,
				position: positionEnumMap.getRev(entity.position),
			},
			include: {
				countries: true,
				clubs: { include: { countries: true } },
			},
		});

		return new Player(
			res,
			positionEnumMap.get(res.position),
			new Club(res.clubs, new Country(res.clubs.countries)),
			new Country(res.countries),
		);
	}

	public async delete(key: { id: number }): Promise<void> {
		await this.repository.delete({
			where: {
				id: key.id,
			},
		});
	}

	public async update(key: { id: number }, entity: PlayerCreation): Promise<Player> {
		const res = await this.repository.update({
			where: {
				id: key.id,
			},
			data: {
				name: entity.name,
				lastname: entity.lastname,
				birthDate: entity.birthDate,
				position: positionEnumMap.getRev(entity.position),
				updatedAt: new Date(),
			},
			include: {
				countries: true,
				clubs: { include: { countries: true } },
			},
		});

		return new Player(
			res,
			positionEnumMap.get(res.position),
			new Club(res.clubs, new Country(res.clubs.countries)),
			new Country(res.countries),
		);
	}

	public async findByUuid(uuid: string): Promise<Player | null> {
		const res = await this.repository.findUnique({
			where: { uuid },
			include: {
				countries: true,
				clubs: { include: { countries: true } },
			},
		});

		if (!res) return null;

		return new Player(
			res,
			positionEnumMap.get(res.position),
			new Club(res.clubs, new Country(res.clubs.countries)),
			new Country(res.countries),
		);
	}
}
