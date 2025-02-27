import { ClubEntity } from 'src/domain/entities/ClubEntity';

export const CLUB_CACHE_REPO = 'ClubCacheRepositoryInterface';

export interface IClubCacheRepository {
	getCache(uuid: string): Promise<ClubEntity | null>;
	saveCache(club: ClubEntity): Promise<void>;
	deleteCache(uuid: string): Promise<void>;
}
