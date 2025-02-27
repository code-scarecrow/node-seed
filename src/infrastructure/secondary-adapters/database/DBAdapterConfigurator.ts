import { WORLD_CUP_REPO } from 'src/application/interfaces/IWorldCupRepository';
import { WorldCupEntity } from 'src/domain/entities/WorldCupEntity';
import { DBAdapterRegistry } from '@code-scarecrow/base/database';
import { WorldCupRepository } from './repositories/WorldCupRepository';

const dbAdapterRegistry = new DBAdapterRegistry();

dbAdapterRegistry.register(WORLD_CUP_REPO, WorldCupRepository, WorldCupEntity);

export { dbAdapterRegistry };
