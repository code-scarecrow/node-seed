import { User } from 'src/domain/entities/User';

export const USER_CREATE_MESSAGE_PRODUCER = 'IUserCreateMessageProducer';

export interface IUserCreateMessageProducer {
	send(user: Omit<User, 'id'>): void;
}
