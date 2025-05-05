import { SuperHero } from 'src/domain/entities/SuperHero';

export const SUPER_HERO_REPO = 'ISuperHeroRepository';

export type SuperHeroCreation = Omit<SuperHero, 'id'>;

export interface ISuperHeroRepository {
	getAll(): Promise<SuperHero[]>;
	get(id: number): Promise<SuperHero | null>;
	delete(id: number): Promise<void>;
	create(sh: SuperHeroCreation): Promise<void>;
	update(sh: SuperHero): Promise<void>;
}
