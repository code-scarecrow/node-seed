import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { Club } from 'src/domain/entities/Club';
import { Country } from 'src/domain/entities/Country';
import { PositionEnum } from 'src/domain/enums/PositionEnum';
import { Player } from 'src/domain/entities/Player';
import { User } from 'src/domain/entities/User';
import { WorldCup } from 'src/domain/entities/WorldCup';
import { positionEnumMap } from 'src/infrastructure/secondary-adapters/database/mappers/PositionEnumMapper';

export class DBClient {
	private readonly prisma: PrismaClient;

	public constructor() {
		this.prisma = new PrismaClient();
	}

	public async deleteDB(): Promise<void> {
		await this.prisma.users.deleteMany();
		await this.prisma.players.deleteMany();
		await this.prisma.clubs.deleteMany();
		await this.prisma.participants.deleteMany();
		await this.prisma.world_cups.deleteMany();
		await this.prisma.countries.deleteMany();
	}

	public async createClub(countryId: number): Promise<Club> {
		const club = await this.prisma.clubs.create({
			data: {
				name: 'Club 1',
				uuid: faker.string.uuid(),
				foundationDate: faker.date.past(),
				createdAt: faker.date.past(),
				updatedAt: faker.date.past(),
				countryId: countryId,
			},
			include: {
				countries: true,
			},
		});

		return new Club(club, new Country(club.countries));
	}

	public async getClubByUuid(uuid: string): Promise<Club | null> {
		const club = await this.prisma.clubs.findFirst({
			where: {
				uuid,
			},
			include: {
				countries: true,
			},
		});

		if (!club) return null;

		return new Club(club, new Country(club.countries));
	}

	public async createCountry(): Promise<Country> {
		const country = await this.prisma.countries.create({
			data: {
				name: 'Country 1',
				code: faker.string.alpha(3),
				uuid: faker.string.uuid(),
			},
		});

		return new Country(country);
	}

	public async getCountryByUuid(uuid: string): Promise<Country | null> {
		const country = await this.prisma.countries.findFirst({
			where: {
				uuid,
			},
		});

		if (!country) return null;

		return new Country(country);
	}

	public async createPlayer(clubId: number, countryId: number): Promise<Player> {
		const player = await this.prisma.players.create({
			data: {
				name: faker.string.alpha(10),
				uuid: faker.string.uuid(),
				createdAt: faker.date.past(),
				updatedAt: faker.date.past(),
				clubId: clubId,
				birthDate: faker.date.past(),
				countryId: countryId,
				lastname: faker.string.alpha(10),
				position: positionEnumMap.getRev(PositionEnum.CM),
			},
			include: {
				countries: true,
				clubs: {
					include: {
						countries: true,
					},
				},
			},
		});

		return new Player(
			player,
			positionEnumMap.get(player.position),
			new Club(player.clubs, new Country(player.clubs.countries)),
			new Country(player.countries),
		);
	}

	public async getPlayer(uuid: string): Promise<Player | null> {
		const player = await this.prisma.players.findFirst({
			where: {
				uuid,
			},
			include: {
				countries: true,
				clubs: {
					include: {
						countries: true,
					},
				},
			},
		});

		if (!player) return null;

		return new Player(
			player,
			positionEnumMap.get(player.position),
			new Club(player.clubs, new Country(player.clubs.countries)),
			new Country(player.countries),
		);
	}

	public async createUser(): Promise<User> {
		const user = await this.prisma.users.create({
			data: {
				email: faker.internet.email(),
				password: faker.internet.password(),
				uuid: faker.string.uuid(),
				name: faker.string.alpha(10),
				lastname: faker.string.alpha(10),
				dni: faker.string.numeric(8),
				birthDate: faker.date.past(),
			},
		});

		return new User(user);
	}

	public async getUserByEmail(email: string): Promise<User | null> {
		const user = await this.prisma.users.findFirst({
			where: {
				email: email,
			},
		});

		if (!user) return null;

		return new User(user);
	}

	public async createWorldCup(countryId: number, participants: Country[]): Promise<WorldCup> {
		const wc = await this.prisma.world_cups.create({
			data: {
				uuid: faker.string.uuid(),
				petName: faker.string.alpha(10),
				startDate: faker.date.past(),
				finishDate: faker.date.past(),
				year: faker.string.numeric(4),
				locationId: countryId,
				participants: {
					create: participants.map((p) => ({
						countryId: p.id,
					})),
				},
			},
			include: {
				countries: true,
			},
		});

		return new WorldCup(wc, new Country(wc.countries));
	}

	public async getWorldCup(uuid: string): Promise<WorldCup | null> {
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

		return new WorldCup(wc, new Country(wc.countries));
	}
}
