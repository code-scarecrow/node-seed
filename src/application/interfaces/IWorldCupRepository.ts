import { WorldCupEntity } from 'src/domain/entities/WorldCupEntity';
import { IBaseRepository } from '@code-scarecrow/base/database';
import { CountryEntity } from 'src/domain/entities/CountryEntity';

export const WORLD_CUP_REPO = 'WorldRepositoryInterface';

export interface IWorldCupRepository extends IBaseRepository<{ id: number }, WorldCupEntity> {
	findByUuid(uuid: string): Promise<WorldCupEntity | null>;
	deleteByUuid(uuid: string): Promise<void>;
	addParticipants(id: string, countries: CountryEntity[]): Promise<void>;
	findOneWithParticipants(uuid: string): Promise<WorldCupEntity | null>;
}
