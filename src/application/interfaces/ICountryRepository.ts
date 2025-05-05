import { Country } from 'src/domain/entities/Country';
import { IBaseRepository } from '@code-scarecrow/base/database';

export const COUNTRY_REPO = 'CountryRepositoryInterface';

export type CountryCreation = Omit<Country, 'id' | 'uuid' | 'players'>;

export interface ICountryRepository extends IBaseRepository<{ id: number }, Country, CountryCreation> {
	findByUuid(uuid: string): Promise<Country | null>;
	findAllByUuid(uuids: string[]): Promise<Country[]>;
	getCountryWithPlayers(uuid: string): Promise<Country | null>;
}
