import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/domain/entities/User';
import { IUserCreateMessageProducer, USER_CREATE_MESSAGE_PRODUCER } from '../interfaces/IUserCreateMessageProducer';
import { IUserRepository, USER_REPO } from '../interfaces/IUserRepository';
import { v4 as uuid } from 'uuid';
import { IUserFinishCreationProducer, USER_FINISH_CREATION_PRODUCER } from '../interfaces/IUserFinishCreationProducer';

@Injectable()
export class UserService {
	constructor(
		@Inject(USER_CREATE_MESSAGE_PRODUCER)
		private readonly userCreateProducer: IUserCreateMessageProducer,
		@Inject(USER_FINISH_CREATION_PRODUCER)
		private readonly userFinishCreationProducer: IUserFinishCreationProducer,
		@Inject(USER_REPO) private readonly userRepository: IUserRepository,
	) {}

	public createMessage(user: Omit<User, 'id' | 'uuid'>): void {
		const userWithUuid: Omit<User, 'id'> = { ...user, uuid: uuid() };

		return this.userCreateProducer.send(userWithUuid);
	}

	public async create(user: Omit<User, 'id'>): Promise<User> {
		const result = await this.userRepository.create(user as User);

		this.userFinishCreationProducer.send(result);

		return result;
	}

	public async findAll(): Promise<User[]> {
		return this.userRepository.findAll();
	}
}
