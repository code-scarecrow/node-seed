import { User } from 'src/domain/entities/User';

export const USER_REPO = 'UserRepositoryInterface';

type Key = Pick<User, 'id'>;

export interface IUserRepository {
	findByKey(key: Key): Promise<User | null>;
	create(entity: User): Promise<User>;
	update(key: Key, entity: User): Promise<User>;
	delete(key: Key): Promise<void>;
	findAll(): Promise<User[]>;
}
