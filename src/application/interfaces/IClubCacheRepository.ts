import { Club } from 'src/domain/entities/Club';

export const CLUB_CACHE_REPO = 'ClubCacheRepositoryInterface';

export interface IClubCacheRepository {
	getCache(uuid: string): Promise<Club | null>;
	saveCache(club: Club): Promise<void>;
	deleteCache(uuid: string): Promise<void>;
}
