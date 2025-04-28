import { Country } from 'src/domain/entities/Country';
import { IBaseRepository } from '@code-scarecrow/base/database';

export const COUNTRY_REPO = 'CountryRepositoryInterface';

export interface ICountryRepository extends IBaseRepository<{ id: number }, Country> {
	findByUuid(uuid: string): Promise<Country | null>;
	findAllByUuid(uuids: string[]): Promise<Country[]>;
	getCountryWithPlayers(uuid: string): Promise<Country | null>;
}
