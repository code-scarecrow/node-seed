import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { ClubEntity } from 'src/domain/entities/ClubEntity';
import { CountryEntity } from 'src/domain/entities/CountryEntity';
import {
	mapPositionEnum,
	mapPositionPrismaEnum,
} from 'src/infrastructure/secondary-adapters/database/mappers/PositionEnumMapper';
import { PositionEnum } from 'src/domain/enums/PositionEnum';
import { PlayerEntity } from 'src/domain/entities/PlayerEntity';
import { UserEntity } from 'src/domain/entities/UserEntity';
import { WorldCupEntity } from 'src/domain/entities/WorldCupEntity';

class DBClient {
	private readonly prisma: PrismaClient;

	public constructor(client: PrismaClient) {
		this.prisma = client;
	}

	public async deleteDB(): Promise<void> {
		await this.prisma.users.deleteMany();
		await this.prisma.players.deleteMany();
		await this.prisma.clubs.deleteMany();
		await this.prisma.participants.deleteMany();
		await this.prisma.world_cups.deleteMany();
		await this.prisma.countries.deleteMany();
	}

	public async createClub(countryId: number): Promise<ClubEntity> {
		const club = await this.prisma.clubs.create({
			data: {
				name: 'Club 1',
				uuid: faker.string.uuid(),
				foundation_date: faker.date.past(),
				created_at: faker.date.past(),
				updated_at: faker.date.past(),
				country_id: countryId,
			},
			include: {
				countries: true,
			},
		});

		const res = new ClubEntity();
		res.id = club.id;
		res.uuid = club.uuid;
		res.foundationDate = club.foundation_date;
		res.createdAt = club.created_at;
		res.updatedAt = club.updated_at;
		res.name = club.name;
		res.country = new CountryEntity();
		res.country.id = club.countries.id;
		res.country.uuid = club.countries.uuid;
		res.country.name = club.countries.name;
		res.country.code = club.countries.code;
		return res;
	}

	public async getClubByUuid(uuid: string): Promise<ClubEntity | null> {
		const club = await this.prisma.clubs.findFirst({
			where: {
				uuid,
			},
			include: {
				countries: true,
			},
		});

		if (!club) return null;

		const res = new ClubEntity();
		res.id = club.id;
		res.uuid = club.uuid;
		res.foundationDate = club.foundation_date;
		res.createdAt = club.created_at;
		res.updatedAt = club.updated_at;
		res.name = club.name;
		res.country = new CountryEntity();
		res.country.id = club.countries.id;
		res.country.uuid = club.countries.uuid;
		res.country.name = club.countries.name;
		res.country.code = club.countries.code;
		return res;
	}

	public async createCountry(): Promise<CountryEntity> {
		return await this.prisma.countries.create({
			data: {
				name: 'Country 1',
				code: faker.string.alpha(3),
				uuid: faker.string.uuid(),
			},
		});
	}

	public async getCountryByUuid(uuid: string): Promise<CountryEntity | null> {
		const country = await this.prisma.countries.findFirst({
			where: {
				uuid,
			},
		});

		if (!country) return null;

		const res = new CountryEntity();
		res.id = country.id;
		res.uuid = country.uuid;
		res.name = country.name;
		res.code = country.code;
		return res;
	}

	public async createPlayer(clubId: number, countryId: number): Promise<PlayerEntity> {
		const player = await this.prisma.players.create({
			data: {
				name: faker.string.alpha(10),
				uuid: faker.string.uuid(),
				created_at: faker.date.past(),
				updated_at: faker.date.past(),
				club_id: clubId,
				birth_date: faker.date.past(),
				country_id: countryId,
				lastname: faker.string.alpha(10),
				position: mapPositionPrismaEnum(PositionEnum.CM),
			},
		});

		const res = new PlayerEntity();
		res.id = player.id;
		res.uuid = player.uuid;
		res.name = player.name;
		res.createdAt = player.created_at;
		res.updatedAt = player.updated_at;
		res.position = mapPositionEnum(player.position);
		res.birthDate = player.birth_date;
		res.lastname = player.lastname;

		return res;
	}

	public async getPlayer(uuid: string): Promise<PlayerEntity | null> {
		const player = await this.prisma.players.findFirst({
			where: {
				uuid,
			},
			include: {
				countries: true,
				clubs: true,
			},
		});

		if (!player) return null;

		const res = new PlayerEntity();
		res.id = player.id;
		res.uuid = player.uuid;
		res.name = player.name;
		res.createdAt = player.created_at;
		res.updatedAt = player.updated_at;
		res.position = mapPositionEnum(player.position);
		res.birthDate = player.birth_date;
		res.lastname = player.lastname;
		res.club = new ClubEntity();
		res.club.id = player.clubs.id;
		res.club.uuid = player.clubs.uuid;
		res.club.name = player.clubs.name;
		res.club.foundationDate = player.clubs.foundation_date;
		res.club.createdAt = player.clubs.created_at;
		res.club.updatedAt = player.clubs.updated_at;
		res.country = new CountryEntity();
		res.country.id = player.countries.id;
		res.country.uuid = player.countries.uuid;
		res.country.name = player.countries.name;
		res.country.code = player.countries.code;

		return res;
	}

	public async createUser(): Promise<UserEntity> {
		const user = await this.prisma.users.create({
			data: {
				email: faker.internet.email(),
				passsword: faker.internet.password(),
				uuid: faker.string.uuid(),
				name: faker.string.alpha(10),
				lastname: faker.string.alpha(10),
				dni: faker.string.numeric(8),
				birth_date: faker.date.past(),
			},
		});

		const res = new UserEntity();
		res.id = user.id;
		res.uuid = user.uuid;
		res.email = user.email;
		res.password = user.passsword;
		res.name = user.name;
		res.lastname = user.lastname;
		res.dni = user.dni;
		res.birthDate = user.birth_date;
		return res;
	}

	public async getUserByEmail(email: string): Promise<UserEntity | null> {
		const user = await this.prisma.users.findFirst({
			where: {
				email: email,
			},
		});

		if (!user) return null;

		const res = new UserEntity();
		res.id = user.id;
		res.uuid = user.uuid;
		res.email = user.email;
		res.password = user.passsword;
		res.name = user.name;
		res.lastname = user.lastname;
		res.dni = user.dni;
		res.birthDate = user.birth_date;
		return res;
	}

	public async createWorldCup(countryId: number, participants: CountryEntity[]): Promise<WorldCupEntity> {
		const wc = await this.prisma.world_cups.create({
			data: {
				uuid: faker.string.uuid(),
				pet_name: faker.string.alpha(10),
				start_date: faker.date.past(),
				finish_date: faker.date.past(),
				year: faker.string.numeric(4),
				location_id: countryId,
				participants: {
					create: participants.map((p) => ({
						country_id: p.id,
					})),
				},
			},
			include: {
				countries: true,
			},
		});

		const res = new WorldCupEntity();
		res.id = wc.id;
		res.uuid = wc.uuid;
		res.petName = wc.pet_name;
		res.startDate = wc.start_date;
		res.finishDate = wc.finish_date;
		res.year = wc.year;
		res.location = new CountryEntity();
		res.location.id = wc.location_id;
		res.location.name = wc.countries.name;
		res.location.code = wc.countries.code;
		res.location.uuid = wc.countries.uuid;
		return res;
	}

	public async getWorldCup(uuid: string): Promise<WorldCupEntity | null> {
		const wc = await this.prisma.world_cups.findFirst({
			where: {
				uuid,
			},
			include: {
				countries: true,
				participants: {
					include: {
						countries: true,
					},
				},
			},
		});

		if (!wc) return null;

		const res = new WorldCupEntity();
		res.id = wc.id;
		res.uuid = wc.uuid;
		res.petName = wc.pet_name;
		res.startDate = wc.start_date;
		res.finishDate = wc.finish_date;
		res.year = wc.year;
		res.location = new CountryEntity();
		res.location.id = wc.location_id;
		res.location.name = wc.countries.name;
		res.location.code = wc.countries.code;
		res.location.uuid = wc.countries.uuid;
		res.participants = wc.participants.map((p) => {
			const c = new CountryEntity();
			c.id = p.country_id;
			c.name = p.countries.name;
			c.code = p.countries.code;
			c.uuid = p.countries.uuid;
			return c;
		});

		return res;
	}
}

export const dbClient = new DBClient(new PrismaClient());
