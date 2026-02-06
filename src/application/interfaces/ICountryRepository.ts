import { Country } from 'src/domain/entities/Country';

export const COUNTRY_REPO = 'CountryRepositoryInterface';

export type CountryCreation = Omit<Country, 'id' | 'uuid' | 'players'>;

type Key = Pick<Country, 'id'>;

export interface ICountryRepository {
	findByUuid(uuid: string): Promise<Country | null>;
	findAllByUuid(uuids: string[]): Promise<Country[]>;
	getCountryWithPlayers(uuid: string): Promise<Country | null>;
	findByKey(key: Key): Promise<Country | null>;
	create(entity: CountryCreation): Promise<Country>;
	update(key: Key, entity: CountryCreation): Promise<Country>;
	delete(key: Key): Promise<void>;
	findAll(): Promise<Country[]>;
}
