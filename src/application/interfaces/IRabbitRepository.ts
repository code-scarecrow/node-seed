import { Rabbit } from 'src/domain/entities/Rabbit';

export const RABBIT_REPO = 'IRabbitRepository';

export type RabbitCreation = Omit<Rabbit, 'id'>;

type Key = Pick<Rabbit, 'id'>;

export interface IRabbitRepository {
	findByKey(key: Key): Promise<Rabbit | null>;
	create(entity: RabbitCreation): Promise<Rabbit>;
	update(key: Key, entity: RabbitCreation): Promise<Rabbit>;
	delete(key: Key): Promise<void>;
}
