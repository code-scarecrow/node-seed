import { Club } from 'src/domain/entities/Club';
import { Country } from 'src/domain/entities/Country';
import { Player } from 'src/domain/entities/Player';
import { User } from 'src/domain/entities/User';
import { WorldCup } from 'src/domain/entities/WorldCup';
import { countries, clubs, players, users, world_cups } from '@prisma/client';
import { positionEnumMap } from 'src/infrastructure/secondary-adapters/database/mappers/PositionEnumMapper';

class PrismaMocks {
	public getCountry(entity: Country, includePlayer?: false): countries;
	public getCountry(entity: Country, includePlayer?: true): countries & { players: players[] };
	public getCountry(entity: Country, includePlayer = false): (countries & { players: players[] }) | countries {
		const res: countries = {
			id: entity.id,
			name: entity.name,
			code: entity.code,
			uuid: entity.uuid,
		};

		if (!includePlayer || !entity.players) return res;

		return { ...res, players: entity.players.map((p) => this.getPlayer(p)) };
	}

	public getClub(entity: Club): clubs & { countries: countries } {
		return {
			id: entity.id,
			name: entity.name,
			uuid: entity.uuid,
			countryId: entity.country.id,
			foundationDate: entity.foundationDate,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
			countries: this.getCountry(entity.country),
		};
	}

	public getPlayer(entity: Player): players & { clubs: clubs & { countries: countries }; countries: countries } {
		return {
			id: entity.id,
			uuid: entity.uuid,
			name: entity.name,
			lastname: entity.lastname,
			birthDate: entity.birthDate,
			position: positionEnumMap.getRev(entity.position),
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
			countryId: entity.country.id,
			clubId: entity.club.id,
			clubs: this.getClub(entity.club),
			countries: this.getCountry(entity.country),
		};
	}

	public getUser(entity: User): users {
		return {
			id: entity.id,
			uuid: entity.uuid,
			email: entity.email,
			password: entity.password,
			birthDate: entity.birthDate,
			dni: entity.dni,
			lastname: entity.lastname,
			name: entity.name,
		};
	}

	public getWorldCup(entity: WorldCup): world_cups & { countries: countries } {
		return {
			id: entity.id,
			uuid: entity.uuid,
			year: entity.year,
			finishDate: entity.finishDate,
			startDate: entity.startDate,
			locationId: entity.location.id,
			petName: entity.petName,
			countries: this.getCountry(entity.location),
		};
	}
}

export const prismaMocks = new PrismaMocks();
