import { User } from 'src/domain/entities/User';
import { IBaseRepository } from '@code-scarecrow/base/database';

export const USER_REPO = 'UserRepositoryInterface';

export type IUserRepository = IBaseRepository<{ id: number }, User>;
