import { Injectable } from '@nestjs/common/decorators';
import { ClubCreation, IClubRepository } from 'src/application/interfaces/IClubRepository';
import { Club } from 'src/domain/entities/Club';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from '../client/PrismaService';
import { v4 } from 'uuid';
import { Country } from 'src/domain/entities/Country';

@Injectable()
export class ClubRepository implements IClubRepository {
	protected readonly repository: Prisma.clubsDelegate<DefaultArgs>;

	constructor(prisma: PrismaService) {
		this.repository = prisma.clubs;
	}

	public async findByKey(key: { id: number }): Promise<Club | null> {
		const res = await this.repository.findUnique({ where: { id: key.id }, include: { countries: true } });

		if (!res) return null;

		return new Club(res, new Country(res.countries));
	}

	public async create(entity: ClubCreation): Promise<Club> {
		const res = await this.repository.create({
			data: {
				uuid: v4(),
				...entity,
			},
			include: { countries: true },
		});

		return new Club(res, new Country(res.countries));
	}

	public async delete(key: { id: number }): Promise<void> {
		await this.repository.delete({
			where: {
				id: key.id,
			},
		});
	}

	public async update(key: { id: number }, entity: ClubCreation): Promise<Club> {
		const res = await this.repository.update({
			where: {
				id: key.id,
			},
			data: {
				...entity,
				updatedAt: new Date(),
			},
			include: { countries: true },
		});

		return new Club(res, new Country(res.countries));
	}

	public async findAll(): Promise<Club[]> {
		const res = await this.repository.findMany({ include: { countries: true } });

		return res.map((r) => {
			return new Club(r, new Country(r.countries));
		});
	}

	public async findByUuid(uuid: string): Promise<Club | null> {
		const res = await this.repository.findUnique({ where: { uuid: uuid }, include: { countries: true } });

		if (!res) return null;

		return new Club(res, new Country(res.countries));
	}
}
