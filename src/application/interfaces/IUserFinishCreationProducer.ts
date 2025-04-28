import { User } from 'src/domain/entities/User';

export const USER_FINISH_CREATION_PRODUCER = 'IUserFinishCreationEventProducer';

export interface IUserFinishCreationProducer {
	send(user: User): void;
}
