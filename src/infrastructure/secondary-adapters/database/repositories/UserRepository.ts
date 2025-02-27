import { Injectable } from '@nestjs/common/decorators';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserRepository } from 'src/application/interfaces/IUserRepository';
import { UserEntity } from 'src/domain/entities/UserEntity';
import { Repository } from 'typeorm';
import { BaseTypeOrmRepository } from '@code-scarecrow/base/database';

@Injectable()
export class UserRepository extends BaseTypeOrmRepository<{ id: number }, UserEntity> implements IUserRepository {
	constructor(@InjectRepository(UserEntity) repository: Repository<UserEntity>) {
		super(repository);
	}
}
