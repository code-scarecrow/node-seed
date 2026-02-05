import { Club } from 'src/domain/entities/Club';

export const CLUB_REPO = 'ClubRepositoryInterface';

export type ClubCreation = Omit<Club, 'id' | 'uuid' | 'createdAt' | 'updatedAt' | 'country'> & {
	countryId: number;
};

type Key = Pick<Club, 'id'>;

export interface IClubRepository {
	findByUuid(uuid: string): Promise<Club | null>;
	findByKey(key: Key): Promise<Club | null>;
	create(entity: ClubCreation): Promise<Club>;
	update(key: Key, entity: ClubCreation): Promise<Club>;
	delete(key: Key): Promise<void>;
	findAll(): Promise<Club[]>;
}
