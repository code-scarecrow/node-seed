import { Player } from 'src/domain/entities/Player';
import { IBaseRepository } from '@code-scarecrow/base/database';

export const PLAYER_REPO = 'PlayerRepositoryInterface';

export type PlayerCreation = Omit<Player, 'id' | 'uuid' | 'createdAt' | 'updatedAt' | 'club' | 'country'> & {
	countryId: number;
	clubId: number;
};

export interface IPlayerRepository extends IBaseRepository<{ id: number }, Player, PlayerCreation> {
	findByUuid(uuid: string): Promise<Player | null>;
}
