import { WorldCupEntity } from 'src/domain/entities/WorldCupEntity';
import { IBaseRepository } from '@code-scarecrow/base/database';

export const WORLD_CUP_REPO = 'WorldRepositoryInterface';

export interface IWorldCupRepository extends IBaseRepository<{ id: number }, WorldCupEntity> {
	findByUuid(uuid: string): Promise<WorldCupEntity | null>;
	save(worldCup: WorldCupEntity): Promise<WorldCupEntity>;
	findOneWithParticipants(uuid: string): Promise<WorldCupEntity | null>;
}
