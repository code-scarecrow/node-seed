import { Player } from 'src/domain/entities/Player';

export const PLAYER_REPO = 'PlayerRepositoryInterface';

export type PlayerCreation = Omit<Player, 'id' | 'uuid' | 'createdAt' | 'updatedAt' | 'club' | 'country'> & {
	countryId: number;
	clubId: number;
};

type Key = Pick<Player, 'id'>;

export interface IPlayerRepository {
	findByUuid(uuid: string): Promise<Player | null>;
	findByKey(key: Key): Promise<Player | null>;
	create(entity: PlayerCreation): Promise<Player>;
	update(key: Key, entity: PlayerCreation): Promise<Player>;
	delete(key: Key): Promise<void>;
	findAll(): Promise<Player[]>;
}
