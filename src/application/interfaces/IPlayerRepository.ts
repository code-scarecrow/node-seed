import { Player } from 'src/domain/entities/Player';
import { IBaseRepository } from '@code-scarecrow/base/database';

export const PLAYER_REPO = 'PlayerRepositoryInterface';

export interface IPlayerRepository extends IBaseRepository<{ id: number }, Player> {
	findByUuid(uuid: string): Promise<Player | null>;
}
