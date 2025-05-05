import { Club } from 'src/domain/entities/Club';
import { IBaseRepository } from '@code-scarecrow/base/database';

export const CLUB_REPO = 'ClubRepositoryInterface';

export type ClubCreation = Omit<Club, 'id' | 'uuid' | 'createdAt' | 'updatedAt' | 'country'> & {
	countryId: number;
};

export interface IClubRepository extends IBaseRepository<{ id: number }, Club, ClubCreation> {
	findByUuid(uuid: string): Promise<Club | null>;
}
