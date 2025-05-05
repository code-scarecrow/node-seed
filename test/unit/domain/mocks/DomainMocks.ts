import { faker } from '@faker-js/faker';
import { Club } from 'src/domain/entities/Club';
import { Country } from 'src/domain/entities/Country';
import { Player } from 'src/domain/entities/Player';
import { User } from 'src/domain/entities/User';
import { WorldCup } from 'src/domain/entities/WorldCup';
import { PositionEnum } from 'src/domain/enums/PositionEnum';

class DomainMocks {
	public getCountry(includePlayers = false): Country {
		const res = new Country({
			id: faker.number.int(),
			name: faker.string.alpha(10),
			code: faker.string.alpha(3),
			uuid: faker.string.uuid(),
		});

		if (!includePlayers) return res;
		return { ...res, players: [this.getPlayer({ country: res }), this.getPlayer({ country: res })] };
	}

	public getClub(
		props: {
			id?: number;
			uuid?: string;
			name?: string;
			createdAt?: Date;
			updatedAt?: Date;
			foundationDate?: Date;
		} = {},
	): Club {
		return new Club(
			{
				id: props.id ?? faker.number.int(),
				uuid: props.uuid ?? faker.string.uuid(),
				name: props.name ?? faker.string.alpha(10),
				createdAt: props.createdAt ?? faker.date.anytime(),
				updatedAt: props.updatedAt ?? faker.date.anytime(),
				foundationDate: props.foundationDate ?? faker.date.anytime(),
			},
			this.getCountry(),
		);
	}

	public getPlayer(
		props: {
			id?: number;
			uuid?: string;
			name?: string;
			birthDate?: Date;
			createdAt?: Date;
			updatedAt?: Date;
			lastname?: string;
			country?: Country;
		} = {},
	): Player {
		return new Player(
			{
				id: props.id ?? faker.number.int(),
				uuid: props.uuid ?? faker.string.uuid(),
				name: props.name ?? faker.string.alpha(10),
				birthDate: props.birthDate ?? faker.date.anytime(),
				createdAt: props.createdAt ?? faker.date.anytime(),
				updatedAt: props.updatedAt ?? faker.date.anytime(),
				lastname: props.lastname ?? faker.string.alpha(10),
			},
			PositionEnum.CB,
			this.getClub(),
			props.country ?? this.getCountry(),
		);
	}

	public getUser(): User {
		return new User({
			id: faker.number.int(),
			uuid: faker.string.uuid(),
			email: faker.internet.email(),
			password: faker.internet.password(),
			name: faker.string.alpha(10),
			lastname: faker.string.alpha(10),
			dni: faker.string.alpha(8),
			birthDate: faker.date.anytime(),
		});
	}

	public getWorldCup(): WorldCup {
		return new WorldCup(
			{
				id: faker.number.int(),
				uuid: faker.string.uuid(),
				finishDate: faker.date.anytime(),
				startDate: faker.date.anytime(),
				petName: faker.string.alpha(10),
				year: faker.string.numeric(4),
			},
			this.getCountry(),
			[this.getCountry()],
		);
	}
}

export const domainMocks = new DomainMocks();
