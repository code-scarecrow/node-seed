import { Injectable } from '@nestjs/common/decorators';
import { CountryCreation, ICountryRepository } from 'src/application/interfaces/ICountryRepository';
import { Country } from 'src/domain/entities/Country';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from '../client/PrismaService';
import { Player } from 'src/domain/entities/Player';
import { v4 } from 'uuid';
import { Club } from 'src/domain/entities/Club';
import { positionEnumMap } from '../mappers/PositionEnumMapper';

@Injectable()
export class CountryRepository implements ICountryRepository {
	protected readonly repository: Prisma.countriesDelegate<DefaultArgs>;

	constructor(prisma: PrismaService) {
		this.repository = prisma.countries;
	}

	public async findAll(): Promise<Country[]> {
		const res = await this.repository.findMany();

		return res.map((r) => {
			return new Country(r);
		});
	}

	public async findByKey(key: { id: number }): Promise<Country | null> {
		const res = await this.repository.findUnique({ where: { id: key.id } });

		if (!res) return null;

		return new Country(res);
	}

	public async create(entity: CountryCreation): Promise<Country> {
		const res = await this.repository.create({
			data: {
				uuid: v4(),
				...entity,
			},
		});

		return new Country(res);
	}

	public async update(key: { id: number }, entity: CountryCreation): Promise<Country> {
		const res = await this.repository.update({
			where: {
				id: key.id,
			},
			data: {
				...entity,
			},
		});

		return new Country(res);
	}

	public async delete(key: { id: number }): Promise<void> {
		await this.repository.delete({ where: { id: key.id } });
	}

	public async findByUuid(uuid: string): Promise<Country | null> {
		const res = await this.repository.findUnique({ where: { uuid } });

		if (!res) return null;

		return new Country(res);
	}

	public async findAllByUuid(uuids: string[]): Promise<Country[]> {
		const res = await this.repository.findMany({ where: { uuid: { in: uuids } } });

		return res.map((r) => {
			return new Country(r);
		});
	}

	public async getCountryWithPlayers(uuid: string): Promise<Country | null> {
		const res = await this.repository.findUnique({
			where: { uuid },
			include: { players: { include: { clubs: { include: { countries: true } }, countries: true } } },
		});

		if (!res) return null;

		return new Country(
			res,
			res.players.map((r) => {
				return new Player(
					r,
					positionEnumMap.get(r.position),
					new Club(r.clubs, new Country(r.clubs.countries)),
					new Country(r.countries),
				);
			}),
		);
	}
}
