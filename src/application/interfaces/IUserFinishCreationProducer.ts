import { UserEntity } from 'src/domain/entities/UserEntity';

export const USER_FINISH_CREATION_PRODUCER = 'IUserFinishCreationEventProducer';

export interface IUserFinishCreationProducer {
	send(user: UserEntity): void;
}
