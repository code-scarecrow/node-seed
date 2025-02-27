import { UserEntity } from 'src/domain/entities/UserEntity';

export const USER_CREATE_MESSAGE_PRODUCER = 'IUserCreateMessageProducer';

export interface IUserCreateMessageProducer {
	send(user: Omit<UserEntity, 'id'>): void;
}
