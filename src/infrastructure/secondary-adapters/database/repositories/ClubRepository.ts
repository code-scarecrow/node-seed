import { Injectable } from '@nestjs/common/decorators';
import { InjectRepository } from '@nestjs/typeorm';
import { IClubRepository } from 'src/application/interfaces/IClubRepository';
import { ClubEntity } from 'src/domain/entities/ClubEntity';
import { Repository } from 'typeorm';
import { BaseTypeOrmRepository } from '@code-scarecrow/base/database';

@Injectable()
export class ClubRepository extends BaseTypeOrmRepository<{ id: number }, ClubEntity> implements IClubRepository {
	constructor(@InjectRepository(ClubEntity) private repository: Repository<ClubEntity>) {
		super(repository);
	}

	public override async update(key: { id: number }, entity: ClubEntity): Promise<ClubEntity> {
		entity.updatedAt = new Date();
		await this.repository.update(key, entity);
		return entity;
	}

	public override async findAll(): Promise<ClubEntity[]> {
		return this.repository.find({ relations: { country: true } });
	}

	public async findByUuid(uuid: string): Promise<ClubEntity | null> {
		return this.repository.findOne({ where: { uuid }, relations: { country: true } });
	}
}
