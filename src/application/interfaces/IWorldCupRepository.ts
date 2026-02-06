import { WorldCup } from 'src/domain/entities/WorldCup';
import { Country } from 'src/domain/entities/Country';

export const WORLD_CUP_REPO = 'WorldRepositoryInterface';

export type WorldCupCreation = Omit<WorldCup, 'id' | 'uuid' | 'participants' | 'location'> & {
	locationId: number;
};

type Key = Pick<WorldCup, 'id'>;

export interface IWorldCupRepository {
	findByUuid(uuid: string): Promise<WorldCup | null>;
	deleteByUuid(uuid: string): Promise<void>;
	addParticipants(id: string, countries: Country[]): Promise<void>;
	findOneWithParticipants(uuid: string): Promise<WorldCup | null>;
	create(entity: WorldCupCreation): Promise<WorldCup>;
	update(key: Key, entity: WorldCupCreation): Promise<WorldCup>;
	delete(key: Key): Promise<void>;
	findAll(): Promise<WorldCup[]>;
}
