import { WorldCup } from 'src/domain/entities/WorldCup';
import { IBaseRepository } from '@code-scarecrow/base/database';
import { Country } from 'src/domain/entities/Country';

export const WORLD_CUP_REPO = 'WorldRepositoryInterface';

export type WorldCupCreation = Omit<WorldCup, 'id' | 'uuid' | 'participants' | 'location'> & {
	locationId: number;
};

export interface IWorldCupRepository extends IBaseRepository<{ id: number }, WorldCup, WorldCupCreation> {
	findByUuid(uuid: string): Promise<WorldCup | null>;
	deleteByUuid(uuid: string): Promise<void>;
	addParticipants(id: string, countries: Country[]): Promise<void>;
	findOneWithParticipants(uuid: string): Promise<WorldCup | null>;
}
