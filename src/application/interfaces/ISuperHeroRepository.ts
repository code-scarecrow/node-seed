import { SuperHero } from 'src/domain/entities/SuperHero';

export const SUPER_HERO_REPO = 'ISuperHeroRepository';

export interface ISuperHeroRepository {
	getAll(): Promise<SuperHero[]>;
	get(id: number): Promise<SuperHero | null>;
	delete(id: number): Promise<void>;
	create(sh: SuperHero): Promise<void>;
	update(sh: SuperHero): Promise<void>;
}
