import { ClubEntity } from 'src/domain/entities/ClubEntity';
import { IBaseRepository } from '@code-scarecrow/base/database';

export const CLUB_REPO = 'ClubRepositoryInterface';

export interface IClubRepository extends IBaseRepository<{ id: number }, ClubEntity> {
	findByUuid(uuid: string): Promise<ClubEntity | null>;
}
