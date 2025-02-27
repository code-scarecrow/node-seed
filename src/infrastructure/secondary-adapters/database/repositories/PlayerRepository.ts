import { Injectable } from '@nestjs/common/decorators';
import { InjectRepository } from '@nestjs/typeorm';
import { IPlayerRepository } from 'src/application/interfaces/IPlayerRepository';
import { PlayerEntity } from 'src/domain/entities/PlayerEntity';
import { Repository } from 'typeorm';
import { BaseTypeOrmRepository } from '@code-scarecrow/base/database';

@Injectable()
export class PlayerRepository extends BaseTypeOrmRepository<{ id: number }, PlayerEntity> implements IPlayerRepository {
	constructor(@InjectRepository(PlayerEntity) private repository: Repository<PlayerEntity>) {
		super(repository);
	}

	public override async update(key: { id: number }, entity: PlayerEntity): Promise<PlayerEntity> {
		entity.updatedAt = new Date();
		await this.repository.update(key, entity);
		return entity;
	}

	public async findByUuid(uuid: string): Promise<PlayerEntity | null> {
		return this.repository.findOne({ where: { uuid }, relations: { country: true, club: true } });
	}
}
