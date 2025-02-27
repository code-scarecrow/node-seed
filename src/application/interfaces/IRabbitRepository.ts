import { Rabbit } from 'src/domain/entities/Rabbit';
import { ISingleEntityRepository } from '@code-scarecrow/base/database';

export const RABBIT_REPO = 'IRabbitRepository';

export type IRabbitRepository = ISingleEntityRepository<{ id: string }, Rabbit>;
