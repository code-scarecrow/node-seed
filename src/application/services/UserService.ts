import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/domain/entities/UserEntity';
import { IUserCreateMessageProducer, USER_CREATE_MESSAGE_PRODUCER } from '../interfaces/IUserCreateMessageProducer';
import { IUserRepository, USER_REPO } from '../interfaces/IUserRepository';
import { v4 as uuid } from 'uuid';
import { IUserFinishCreationProducer, USER_FINISH_CREATION_PRODUCER } from '../interfaces/IUserFinishCreationProducer';

@Injectable()
export class UserService {
	constructor(
		@Inject(USER_CREATE_MESSAGE_PRODUCER)
		private userCreateProducer: IUserCreateMessageProducer,
		@Inject(USER_FINISH_CREATION_PRODUCER)
		private userFinishCreationProducer: IUserFinishCreationProducer,
		@Inject(USER_REPO) private userRepository: IUserRepository,
	) {}

	public createMessage(user: Omit<UserEntity, 'id' | 'uuid'>): void {
		const userWithUuid: Omit<UserEntity, 'id'> = { ...user, uuid: uuid() };

		return this.userCreateProducer.send(userWithUuid);
	}

	public async create(user: Omit<UserEntity, 'id'>): Promise<UserEntity> {
		const result = await this.userRepository.create(user as UserEntity);

		this.userFinishCreationProducer.send(result);

		return result;
	}

	public async findAll(): Promise<UserEntity[]> {
		return this.userRepository.findAll();
	}
}
