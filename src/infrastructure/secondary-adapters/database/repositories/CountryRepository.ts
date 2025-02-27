import { Injectable } from '@nestjs/common/decorators';
import { InjectRepository } from '@nestjs/typeorm';
import { ICountryRepository } from 'src/application/interfaces/ICountryRepository';
import { CountryEntity } from 'src/domain/entities/CountryEntity';
import { In, Repository } from 'typeorm';
import { BaseTypeOrmRepository } from '@code-scarecrow/base/database';

@Injectable()
export class CountryRepository
	extends BaseTypeOrmRepository<{ id: number }, CountryEntity>
	implements ICountryRepository
{
	constructor(@InjectRepository(CountryEntity) private repository: Repository<CountryEntity>) {
		super(repository);
	}

	public async findByUuid(uuid: string): Promise<CountryEntity | null> {
		return this.repository.findOneBy({ uuid });
	}

	public async findAllByUuid(uuids: string[]): Promise<CountryEntity[]> {
		return this.repository.find({ where: { uuid: In(uuids) } });
	}

	public async getCountryWithPlayers(uuid: string): Promise<CountryEntity | null> {
		return this.repository.findOne({ where: { uuid }, relations: { players: true } });
	}
}
