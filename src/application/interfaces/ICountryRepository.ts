import { CountryEntity } from 'src/domain/entities/CountryEntity';
import { IBaseRepository } from '@code-scarecrow/base/database';

export const COUNTRY_REPO = 'CountryRepositoryInterface';

export interface ICountryRepository extends IBaseRepository<{ id: number }, CountryEntity> {
	findByUuid(uuid: string): Promise<CountryEntity | null>;
	findAllByUuid(uuids: string[]): Promise<CountryEntity[]>;
	getCountryWithPlayers(uuid: string): Promise<CountryEntity | null>;
}
