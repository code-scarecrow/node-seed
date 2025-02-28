import { Injectable } from '@nestjs/common/decorators';
import { InjectRepository } from '@nestjs/typeorm';
import { IWorldCupRepository } from 'src/application/interfaces/IWorldCupRepository';
import { WorldCupEntity } from 'src/domain/entities/WorldCupEntity';
import { Repository } from 'typeorm';
import { BaseTypeOrmRepository } from '@code-scarecrow/base/database';

@Injectable()
export class WorldCupRepository
	extends BaseTypeOrmRepository<{ id: number }, WorldCupEntity>
	implements IWorldCupRepository
{
	constructor(@InjectRepository(WorldCupEntity) private readonly repository: Repository<WorldCupEntity>) {
		super(repository);
	}

	public override async findAll(): Promise<WorldCupEntity[]> {
		return this.repository.find({ relations: { location: true } });
	}

	public async findByUuid(uuid: string): Promise<WorldCupEntity | null> {
		return this.repository.findOne({ where: { uuid }, relations: { location: true } });
	}

	public async save(worldCup: WorldCupEntity): Promise<WorldCupEntity> {
		return this.repository.save(worldCup);
	}

	public async findOneWithParticipants(uuid: string): Promise<WorldCupEntity | null> {
		return this.repository.findOne({ where: { uuid: uuid }, relations: { participants: true } });
	}
}
