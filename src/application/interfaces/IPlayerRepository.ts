import { PlayerEntity } from 'src/domain/entities/PlayerEntity';
import { IBaseRepository } from '@code-scarecrow/base/database';

export const PLAYER_REPO = 'PlayerRepositoryInterface';

export interface IPlayerRepository extends IBaseRepository<{ id: number }, PlayerEntity> {
	findByUuid(uuid: string): Promise<PlayerEntity | null>;
}
