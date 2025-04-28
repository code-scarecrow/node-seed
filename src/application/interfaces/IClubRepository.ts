import { Club } from 'src/domain/entities/Club';
import { IBaseRepository } from '@code-scarecrow/base/database';

export const CLUB_REPO = 'ClubRepositoryInterface';

export interface IClubRepository extends IBaseRepository<{ id: number }, Club> {
	findByUuid(uuid: string): Promise<Club | null>;
}
