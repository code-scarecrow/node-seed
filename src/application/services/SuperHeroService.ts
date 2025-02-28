import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFound } from 'src/domain/errors/EntityNotFound';
import { ISuperHeroRepository, SUPER_HERO_REPO } from '../interfaces/ISuperHeroRepository';
import { SuperHero } from 'src/domain/entities/SuperHero';

@Injectable()
export class SuperHeroService {
	constructor(@Inject(SUPER_HERO_REPO) private readonly superHeroRepository: ISuperHeroRepository) {}

	public async create(superHero: SuperHero): Promise<void> {
		await this.superHeroRepository.create(superHero);
	}

	public async update(superHero: SuperHero): Promise<void> {
		await this.superHeroRepository.update(superHero);
	}

	public async delete(id: number): Promise<void> {
		await this.superHeroRepository.delete(id);
	}

	public async findById(id: number): Promise<SuperHero> {
		const sh = await this.superHeroRepository.get(id);

		if (!sh) throw new EntityNotFound('Super Hero');

		return sh;
	}

	public async findAll(): Promise<SuperHero[]> {
		return await this.superHeroRepository.getAll();
	}
}
