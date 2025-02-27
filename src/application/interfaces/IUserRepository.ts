import { UserEntity } from 'src/domain/entities/UserEntity';
import { IBaseRepository } from '@code-scarecrow/base/database';

export const USER_REPO = 'UserRepositoryInterface';

export type IUserRepository = IBaseRepository<{ id: number }, UserEntity>;
