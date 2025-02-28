import { Inject, Injectable } from '@nestjs/common';
import { IRabbitRepository, RABBIT_REPO } from '../interfaces/IRabbitRepository';
import { Rabbit } from 'src/domain/entities/Rabbit';
import { EntityNotFound } from 'src/domain/errors/EntityNotFound';

@Injectable()
export class RabbitService {
	constructor(@Inject(RABBIT_REPO) private readonly rabbitRepository: IRabbitRepository) {}

	public async create(rabbit: Rabbit): Promise<Rabbit> {
		return await this.rabbitRepository.create(rabbit);
	}

	public async update(rabbit: Rabbit): Promise<Rabbit> {
		return await this.rabbitRepository.update({ id: rabbit.id }, rabbit);
	}

	public async delete(id: string): Promise<void> {
		await this.rabbitRepository.delete({ id });
	}

	public async findById(id: string): Promise<Rabbit> {
		const rabbit = await this.rabbitRepository.findByKey({ id });

		if (!rabbit) throw new EntityNotFound('Rabbit');

		return rabbit;
	}
}
